#![allow(clippy::missing_safety_doc)]
use wasm_bindgen::prelude::*;
use rand::prelude::{thread_rng, RngCore};
use std::collections::HashMap;
use regex::Regex;
#[cfg(target_arch = "wasm32")]
use serde_wasm_bindgen::to_value;

mod constants;
pub mod matrix_utils;
pub mod generate_round_keys;
mod format_digest;
mod perturb_expansion;

pub mod base;
pub mod bitslice_64;
pub mod bitslice_v128;

/// Generate a random password of specified length using a predefined character set.
///
/// # Arguments
/// * `pwd_len` - The desired length of the password to generate
///
/// # Returns
/// A randomly generated password string of the specified length
#[wasm_bindgen]
pub fn rand_pwd(pwd_len: usize) -> String {
    const ALLOWED: &[u8] = b"#$%()*+,-./0123456789:;=?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}";
    const ALLOWED_LEN: u32 = 80;

    let mut rng = thread_rng();
    let mut pwd  = Vec::with_capacity(pwd_len);

    for _ in 0..pwd_len {
        let index = rng.next_u32() % ALLOWED_LEN;
        pwd.push(ALLOWED[index as usize]);
    }

    String::from_utf8(pwd).unwrap()
}

/// Generate a salt value from a given key by processing the first three characters.
///
/// The function:
/// 1. Appends "H." to the input key
/// 2. Takes substring from index 1, length 2 (in bytes)
/// 3. Applies character replacements for valid ASCII range characters
///
/// # Arguments
/// * `key` - Input string used to generate the salt
///
/// # Returns
/// A processed salt string with specific character mappings applied
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

    result
}

/// Create a batch of passwords with a common salt prefix to reduce the number
/// of times the expansion table has to be perturbed, hence allowing faster
/// processing of tripcodes.
///
/// # Arguments
/// * `batch_size` - Number of passwords to generate in the batch
///
/// # Returns
/// A tuple containing (salt, vector_of_passwords) for the generated batch
pub fn make_passwords_batch(batch_size: usize) -> (String, Vec<String>) {
    let prefix = rand_pwd(3);
    let salt = get_salt(&prefix);

    let mut pwds = Vec::with_capacity(batch_size);

    for _ in 0..batch_size {
        let mut pwd = String::with_capacity(8);
        pwd.push_str(&prefix);
        pwd.push_str(&rand_pwd(5));
        pwds.push(pwd);
    }

    (salt, pwds)
}

/// Generate password and tripcode combinations for a specified number of iterations,
/// filtering results that match the given regex pattern.
///
/// # Arguments
/// * `iter_n` - Number of iterations to run
/// * `regex_pattern` - Regular expression pattern to match against generated tripcodes
///
/// # Returns
/// A HashMap containing password-tripcode pairs that match the regex pattern
pub fn run_x_iterations_common(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    let re = Regex::new(regex_pattern).unwrap();
    let mut results = HashMap::new();
    let (salt, pwds) = make_passwords_batch(iter_n as usize);

    for pwd in pwds {
        let tripcode = base::crypt3::crypt3(&pwd, &salt);
        if re.is_match(&tripcode) {
            results.insert(pwd, tripcode);
        }
    }
    results
}

/// Generate password and tripcode combinations using bitslice optimization for 64-bit operations.
///
/// This function uses batch processing with bitslice optimizations to improve performance
/// when generating tripcodes for multiple passwords simultaneously.
///
/// # Arguments
/// * `iter_n` - Number of iterations to run
/// * `regex_pattern` - Regular expression pattern to match against generated tripcodes
///
/// # Returns
/// A HashMap containing password-tripcode pairs that match the regex pattern
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

/// WASM-exported function to run iterations using v128 bitslice optimizations.
///
/// # Arguments
/// * `iter_n` - Number of iterations to run (converted from u32)
/// * `regex_pattern` - Regular expression pattern to match against generated tripcodes
///
/// # Returns
/// A JavaScript value containing the HashMap of results
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

//
// Wrappers for non-wasm and wasm targets of the common functions.
//

#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common(iter_n, regex_pattern)
}
#[cfg(not(target_arch = "wasm32"))]
pub fn run_x_iterations_64(iter_n: u32, regex_pattern: &str) -> HashMap<String,String> {
    run_x_iterations_common_bitslice(iter_n, regex_pattern)
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations(iter_n: u32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common(iter_n, regex_pattern);
    to_value(&results).unwrap()
}
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn run_x_iterations_64(iter_n: u32, regex_pattern: &str) -> JsValue {
    let results = run_x_iterations_common_bitslice(iter_n, regex_pattern);
    to_value(&results).unwrap()
}

#[allow(dead_code)]
fn main() {
}
