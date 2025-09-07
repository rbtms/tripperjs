use wasm_bindgen::prelude::*;
use rand::prelude::{thread_rng, RngCore};
use std::collections::HashMap;
use regex::Regex;
use serde_wasm_bindgen::to_value;
mod constants;
mod des;
mod generate_round_keys;
mod format_digest;


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

#[wasm_bindgen]
pub fn rand_pwd() -> String {
    const ALLOWED: &[u8] = b"#$%()*+,-./0123456789:;=?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}";
    const PWD_LEN: usize = 8;

    let mut rng = thread_rng();
    let mut pwd = [0u8; PWD_LEN];

    for byte in pwd.iter_mut() {
        let idx = rng.next_u32() % (ALLOWED.len() as u32);
        *byte = ALLOWED[idx as usize];
    }

    String::from_utf8(pwd.to_vec()).unwrap()
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

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_1000_iterations(regex_pattern: &str) -> JsValue {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();

    for _ in 0..1000 {
        let pwd = rand_pwd();
        let salt = get_salt(&pwd);
        let tripcode = crypt3(&pwd, &salt);

        if re.is_match(&tripcode) {
            results.insert(pwd, tripcode);
        }
    }

    to_value(&results).unwrap()
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations(iter_n: i32, regex_pattern: &str) -> JsValue {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();

    for _ in 0..iter_n {
        let pwd = rand_pwd();
        let salt = get_salt(&pwd);
        let tripcode = crypt3(&pwd, &salt);

        if re.is_match(&tripcode) {
            results.insert(pwd, tripcode);
        }
    }

    to_value(&results).unwrap()
}

#[cfg(not(target_arch = "wasm32"))]
#[wasm_bindgen]
pub fn run_1000_iterations(regex_pattern: &str) {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();

    for _ in 0..1000 {
        let pwd = rand_pwd();
        let salt = get_salt(&pwd);
        let tripcode = crypt3(&pwd, &salt);

        if re.is_match(&tripcode) {
            results.insert(pwd, tripcode);
        }
    }
}

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3(pwd, &salt);
    hash.chars().rev().collect::<String>().chars().rev().collect()
}

// laK4j2SD.w
fn main() {
    let pwd = ">@1=O$R1";
    println!("{}", generate_tripcode(pwd));
}

