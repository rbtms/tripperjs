use std::time::Instant;
use tripperjs_wasm::matrix_utils;
use tripperjs_wasm::make_passwords_batch;
use tripperjs_wasm::matrix_utils::to_binary_array_64;
use tripperjs_wasm::generate_round_keys;

// Test the number of matrices per second that the module is capable of processing
//#[test]
fn test_generate_key_64_performance() {
    let mut total = 0;
    let target_duration = std::time::Duration::from_secs(1);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        let (_, pwds) = make_passwords_batch(64);
        let mut pwds = to_binary_array_64(&pwds);
        generate_round_keys::generate_transposed_round_keys_64(&pwds);
        total += 64;
    }

    println!("Keys generated: {} /s", total);
}
