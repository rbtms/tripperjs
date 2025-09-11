use wasm_bindgen::prelude::*;
use rand::prelude::{thread_rng, RngCore};
use std::collections::HashMap;
use regex::Regex;
#[cfg(target_arch = "wasm32")]
use serde_wasm_bindgen::to_value;

mod constants;
mod des;
mod bitslice_des_64;
mod bitslice_des_128;
mod bitslice_sboxes_64;
mod bitslice_sboxes_128;
mod generate_round_keys;
mod format_digest;

fn to_binary_arrays(pwds: &Vec<String>) -> [u64; 64] {
    let mut pwd_bins = [0u64; 64];

    for i in 0..64 {
        pwd_bins[i] = des::to_binary_array(&pwds[i]);
    }

    pwd_bins
}

fn to_binary_arrays_128(pwds: &Vec<String>) -> [u64; 128] {
    let mut pwd_bins = [0u64; 128];

    for i in 0..128 {
        pwd_bins[i] = des::to_binary_array(&pwds[i]);
    }

    pwd_bins
}

#[wasm_bindgen]
pub fn rand_pwd(pwd_len: usize) -> String {
    const ALLOWED: &[u8] = b"#$%()*+,-./0123456789:;=?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}";
    
    let mut rng = thread_rng();
    let mut pwd  = Vec::with_capacity(pwd_len);

    for _ in 0..pwd_len {
        let index = rng.next_u32() % (ALLOWED.len() as u32);
        pwd.push(ALLOWED[index as usize]);
    }

    String::from_utf8(pwd).unwrap()
}

#[wasm_bindgen]
pub fn get_salt(key: &str) -> String {
    // Step 1: append "H."
    let extended = format!("{}H.", key);

    // Step 2: take substring from index 1, length 2 (in bytes, safe for ASCII tripcode inputs)
    let slice: String = extended.chars().skip(1).take(2).collect();

    // Step 3: apply replacements
    let mut result = String::new();
    for c in slice.chars() {
        let mapped = match c {
            // enforce valid range
            ch if !(('.'..='z').contains(&ch)) => '.',

            ':'  => 'A',
            ';'  => 'B',
            '<'  => 'C',
            '='  => 'D',
            '>'  => 'E',
            '?'  => 'F',
            '@'  => 'a',
            '['  => 'b',
            '\\' => 'c',
            ']'  => 'd',
            '^'  => 'e',
            '_'  => 'f',
            '`'  => 'g',

            ch => ch,
        };
        result.push(mapped);
    }

    //println!("key: {}, salt: {}", key, result);

    result
}

#[allow(static_mut_refs)]
#[wasm_bindgen]
pub fn crypt3(pwd: &str, salt: &str) -> String {
    // Keep only the first 2 characters
    let salt = &salt[0..2];
    let mut data = 0u64;
    let pwd_bin = des::to_binary_array(pwd);
    let k = generate_round_keys::generate_round_keys(pwd_bin);
    let r_expanded_precomputed = des::generate_r_expanded_tables_cached(salt);

    // Crypt(3) calls DES 25 times
    for _ in 0..25 {
        data = des::des(data, &k, &r_expanded_precomputed);
    }
    
    format_digest::format_digest(data)
}

pub fn crypt3_64(pwds: &Vec<String>, salt: &str) -> Vec<String> {
    // Keep only the first 2 characters
    let salt = &salt[0..2];

    let mut data = [0u64; 64];
    let pwd_bins = to_binary_arrays(pwds);
    let keys = generate_round_keys::generate_transposed_round_keys_64(&pwd_bins);
 
    let expansion_table = des::perturb_expansion(&salt);

    // Crypt(3) calls DES 25 times
    for _ in 0..25 {
        data = bitslice_des_64::des(&data, &keys, &expansion_table);
    }

    //format_digest::format_digest(data)
    let mut ret = vec![String::new(); 64];
    for i in 0..64 {
        ret[i] = format_digest::format_digest(data[i]);
    }

    ret
}

pub fn crypt3_128(pwds: &Vec<String>, salt: &str) -> Vec<String> {
    // Keep only the first 2 characters
    let salt = &salt[0..2];

    let mut data = [0u64; 128];
    let pwd_bins = to_binary_arrays_128(pwds);
    let keys = generate_round_keys::generate_transposed_round_keys_128(&pwd_bins);
 
    let r_expanded_precomputed = des::generate_r_expanded_tables_cached(salt);
    let expansion_table = des::perturb_expansion(&salt);

    // Crypt(3) calls DES 25 times
    for _ in 0..25 {
        data = bitslice_des_128::des(&data, &keys, &r_expanded_precomputed, &expansion_table);
    }

    //format_digest::format_digest(data)
    let mut ret = vec![String::new(); 128];
    for i in 0..128 {
        ret[i] = format_digest::format_digest(data[i]);
    }

    ret
}

pub fn run_x_iterations_common(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    
    // Only calculate the salt (first part of the password)
    // once every x iterations to reduce the cache misses
    // from the hash table lookup. Also increases speed in 50k
    // or so since it reduces the number of times the expansion
    // table has to be perturbed.
    let first_3_chars = &rand_pwd(3);
    let salt = get_salt(&first_3_chars);

    for _ in 0..iter_n {
        let last_5_chars = rand_pwd(6);
        let pwd = format!("{}{}", first_3_chars, last_5_chars);
        let tripcode = crypt3(&pwd, &salt);

        if re.is_match(&tripcode) {
            results.insert(pwd, tripcode);
        }
    }

    results
}

// Only calculate the salt (first part of the password)
// once every x iterations to reduce the cache misses
// from the hash table lookup. Also increases speed in 50k
// or so since it reduces the number of times the expansion
// table has to be perturbed.
fn make_passwords_batch(batch_size: usize) -> (String, Vec<String>) {
    let mut pwds =Vec::with_capacity(batch_size);
    let first_3_chars = &rand_pwd(3);

    for _ in 0..batch_size {
        let last_5_chars = rand_pwd(5);
        pwds.push(format!("{}{}", first_3_chars, last_5_chars));
    }

    (get_salt(&first_3_chars), pwds)
}

pub fn run_x_iterations_common_64(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    
    for _ in 0..iter_n {
        let (salt, pwds) = make_passwords_batch(64);
        let tripcodes = crypt3_64(&pwds, &salt);

        for i in 0..64 {
            if re.is_match(&tripcodes[i]) {
                results.insert(pwds[i].clone(), tripcodes[i].clone());
            }
        }
    }

    results
}

pub fn run_x_iterations_common_128(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    
    for _ in 0..iter_n {
        let (salt, pwds) = make_passwords_batch(128);
        let tripcodes = crypt3_128(&pwds, &salt);    
    
        for i in 0..128 {
            if re.is_match(&tripcodes[i]) {
                results.insert(pwds[i].clone(), tripcodes[i].clone());
            }
        }
    }

    results
}


#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations(iter_n: i32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common(iter_n as u32, regex_pattern);
    to_value(&results).unwrap()
}
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations_64(iter_n: i32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common_64(iter_n as u32, regex_pattern);
    to_value(&results).unwrap()
}
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations_128(iter_n: i32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common_128(iter_n as u32, regex_pattern);
    to_value(&results).unwrap()
}

#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common(iter_n, regex_pattern)
}
#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations_64(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common_64(iter_n, regex_pattern)
}
#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations_128(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common_128(iter_n, regex_pattern)
}

fn main() {
}
