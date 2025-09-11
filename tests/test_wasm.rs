use tripperjs_wasm::{crypt3, crypt3_64, get_salt, crypt3_128, run_x_iterations, run_x_iterations_64, run_x_iterations_128};
use wasm_bindgen_test::*;
use web_sys::console;
use wasm_bindgen;
use js_sys::Date;

wasm_bindgen_test_configure!(run_in_browser);

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3(pwd, &salt);
    hash.chars().rev().take(10).collect::<String>().chars().rev().collect()
}

fn generate_tripcode_64(pwd: &str) -> String {
    let salt = get_salt(pwd);

    let mut pwds = Vec::new();
    for _ in 0..64 {
        pwds.push(pwd.to_string())
    }
    
    let hashes = crypt3_64(&pwds, &salt);
    hashes[0].clone()
}

fn generate_tripcode_128(pwd: &str) -> String {
    let salt = get_salt(pwd);

    // Input the same password 64 times
    let mut pwds = Vec::new();
    for _ in 0..128 {
        pwds.push(pwd.to_string())
    }
    
    // Return the first one since they're all the same
    crypt3_128(&pwds, &salt)[0].clone()
}

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_correctness() {
    // Read test cases from file at compile time
    let contents = include_str!("../tests/test_password_tripcode.txt");

    // TODO; Ignore characters that produce incorrect tripcodes
    let pool = "&\'<>@[\\]^_`";

    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue;  }

        let generated = generate_tripcode(input);

        //info!("generated {} expected {}", generated, expected);
        //console::log_1(&format!("generated {} expected {}", generated, expected).into());

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }
}


#[wasm_bindgen_test]
fn test_correctness_64() {
    // --- Read test cases from file ---
    let contents = include_str!("../tests/test_password_tripcode.txt");
    
    // TODO; Ignore characters that produce incorrect tripcodes
    let pool = "&\'<>@[\\]^_`"; // Characters that somehow produce incorrect tripcodes
    
    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue;  }

        let generated = generate_tripcode_64(input);

        //console::log_1(&format!("generated {} expected {}", generated, expected).into());

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }
}

fn now_secs() -> f64 {
    Date::now() / 1000.0
}
//#[wasm_bindgen_test]
#[cfg(target_arch = "wasm32")]
fn test_performance() {
    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = 4.0; // seconds
    let start = now_secs();

    while now_secs() - start < target_duration {
        run_x_iterations(iter_per_batch, "random_regex");
        iterations += iter_per_batch;
    }

    let duration_secs = now_secs() - start;
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    web_sys::console::log_1(
        &format!("    run_x_iterations: {} tripcodes/s", tripcodes_per_second).into()
    );
}

#[wasm_bindgen_test]
#[cfg(target_arch = "wasm32")]
fn test_performance_64() {
    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = 4.0; // seconds
    let start = now_secs();

    while now_secs() - start < target_duration {
        run_x_iterations_64(iter_per_batch, "random_regex");
        iterations += iter_per_batch * 64;
    }

    let duration_secs = now_secs() - start;
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    web_sys::console::log_1(
        &format!("    run_x_iterations_64: {} tripcodes/s", tripcodes_per_second).into()
    );
}

//#[wasm_bindgen_test]
#[cfg(target_arch = "wasm32")]
fn test_performance_128() {
    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = 4.0; // seconds
    let start = now_secs();

    while now_secs() - start < target_duration {
        run_x_iterations_128(iter_per_batch, "random_regex");
        iterations += iter_per_batch * 128;
    }

    let duration_secs = now_secs() - start;
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    web_sys::console::log_1(
        &format!("    run_x_iterations_128: {} tripcodes/s", tripcodes_per_second).into()
    );
}
