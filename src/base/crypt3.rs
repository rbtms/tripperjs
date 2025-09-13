use crate::matrix_utils;
use crate::generate_round_keys::generate_round_keys;
use crate::base::des;
use crate::format_digest::format_digest;
use crate::wasm_bindgen;

#[wasm_bindgen]
pub fn crypt3(pwd: &str, salt: &str) -> String {
    // Keep only the first 2 characters
    let salt = &salt[0..2];
    let mut data = 0u64;
    let pwd_bin = matrix_utils::to_binary_array(pwd);
    let k = generate_round_keys(pwd_bin);
    let r_expanded_precomputed = des::generate_r_expanded_tables_cached(salt);

    // Crypt(3) calls DES 25 times
    for _ in 0..25 {
        data = des::des(data, &k, &r_expanded_precomputed);
    }
    
    format_digest(data)
}
