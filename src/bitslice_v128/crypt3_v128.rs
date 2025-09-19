#![cfg(target_arch = "wasm32")]
use crate::matrix_utils;
use crate::generate_round_keys;
use crate::perturb_expansion::perturb_expansion_cached;
use crate::format_digest::format_digest;
use crate::bitslice_v128::des_v128;

/// Main cryptographic function implementing crypt(3) algorithm
///
/// It processes tripcodes in matrices of 64 elements at a time
/// by using bitsliced DES, as well as v128 vectors for WASM
/// optimization.
///
/// This function performs DES encryption 25 times in a loop to create a hash-like
/// output. It takes a password and salt, converts the password to binary,
/// generates round keys, creates precomputed DES tables from the salt, then
/// applies DES transformation 25 times before formatting the result.
///
/// # Arguments
/// * `pwds` - A vector of password strings to be hashed
/// * `salt` - A salt string used for the hashing process
///
/// # Returns
/// * `Vec<String>` - A vector of formatted digest strings representing the hashed passwords
pub fn crypt3(pwds: &[String], salt: &str) -> Vec<String> {
    let mut data1 = [0u64; 64];
    let mut data2 = [0u64; 64];
    let pwd_bins1 = matrix_utils::to_binary_array_64(&pwds[0..64]);
    let pwd_bins2 = matrix_utils::to_binary_array_64(&pwds[64..128]);
    let keys1 = generate_round_keys::generate_transposed_round_keys_64(&pwd_bins1); // 800k
    let keys2: [[u64; 64]; 16] = generate_round_keys::generate_transposed_round_keys_64(&pwd_bins2); // 800k
    let expansion_table = perturb_expansion_cached(salt);

    unsafe {
        let keys = generate_round_keys::keys_to_v128(&keys1, &keys2); // 300k

        // Crypt(3) calls DES 25 times
        (data1, data2) = des_v128::des_25(&data1, &data2, &keys, &expansion_table); // 1.6k
    }

    data1.iter().chain(data2.iter()).map(
        |&tripcode_u64| format_digest(tripcode_u64)
    ).collect()
}
