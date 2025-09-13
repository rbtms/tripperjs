use wasm_bindgen::prelude::*;
use rand::prelude::{thread_rng, RngCore};
use std::collections::HashMap;
use regex::Regex;
#[cfg(target_arch = "wasm32")]
use serde_wasm_bindgen::to_value;

mod constants;
pub mod matrix_utils;
mod generate_round_keys;
mod format_digest;
mod perturb_expansion;

pub mod base;
pub mod bitslice_64;
pub mod bitslice_v128;

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
        let tripcode = base::crypt3::crypt3(&pwd, &salt);
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

pub fn run_x_iterations_common_bitslice(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    const PASSWORD_BATCH_SIZE :usize = 64;
    
    for _ in 0..iter_n {
        let (salt, pwds) = make_passwords_batch(PASSWORD_BATCH_SIZE);
        let tripcodes = bitslice_64::crypt3_64::crypt3(&pwds, &salt);

        for i in 0..PASSWORD_BATCH_SIZE {
            if re.is_match(&tripcodes[i]) {
                results.insert(pwds[i].clone(), tripcodes[i].clone());
            }
        }
    }

    results
}


#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations(iter_n: u32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common(iter_n as u32, regex_pattern);
    to_value(&results).unwrap()
}
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations_64(iter_n: u32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common_bitslice(iter_n as u32, regex_pattern);
    to_value(&results).unwrap()
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations_v128(iter_n: u32, regex_pattern: &str) -> JsValue {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    const PASSWORD_BATCH_SIZE :usize = 128;
    
    for _ in 0..iter_n {
        let (salt, pwds) = make_passwords_batch(PASSWORD_BATCH_SIZE);
        let tripcodes = bitslice_v128::crypt3_v128::crypt3(&pwds, &salt);

        for i in 0..PASSWORD_BATCH_SIZE {
            if re.is_match(&tripcodes[i]) {
                results.insert(pwds[i].clone(), tripcodes[i].clone());
            }
        }
    }

    to_value(&results).unwrap()
}

#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common(iter_n, regex_pattern)
}
#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations_64(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common_bitslice(iter_n, regex_pattern)
}

fn main() {
}
