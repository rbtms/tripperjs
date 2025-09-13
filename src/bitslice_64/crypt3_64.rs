use crate::matrix_utils;
use crate::generate_round_keys;
use crate::format_digest;
use crate::perturb_expansion::perturb_expansion;
use crate::bitslice_64::des_64;

pub fn crypt3(pwds: &Vec<String>, salt: &str) -> Vec<String> {
    // Keep only the first 2 characters
    let salt = &salt[0..2];
    let mut data = [0u64; 64];
    let pwd_bins = matrix_utils::to_binary_arrays(pwds);
    let keys = generate_round_keys::generate_transposed_round_keys_64(&pwd_bins); 
    let expansion_table = perturb_expansion(&salt);
    // Crypt(3) calls DES 25 times
    for _ in 0..25 {
        data = des_64::des(&data, &keys, &expansion_table);
    }
    data.iter().map(
        |&tripcode_u64| format_digest::format_digest(tripcode_u64)
    ).collect()
}
