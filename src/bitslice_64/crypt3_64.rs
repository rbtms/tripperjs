use crate::matrix_utils;
use crate::generate_round_keys;
use crate::format_digest;
use crate::perturb_expansion::perturb_expansion_cached;
use crate::bitslice_64::des_64;

/// Main cryptographic function implementing crypt(3) algorithm
///
/// It processes tripcodes in matrices of 64 elements at a time
/// by using bitsliced DES.
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
    // Keep only the first 2 characters
    let salt = &salt[0..2];
    let mut data = [0u64; 64];
    let pwd_bins = matrix_utils::to_binary_array_64(pwds);
    let keys = generate_round_keys::generate_transposed_round_keys_64(&pwd_bins);
    let expansion_table = perturb_expansion_cached(salt);

    // Crypt(3) calls DES 25 times
    data = des_64::des_25(&data, &keys, &expansion_table);

    data.iter().map(
        |&tripcode_u64| format_digest::format_digest(tripcode_u64)
    ).collect()
}
