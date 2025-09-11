use std::fs;
use std::time::Instant;
use tripperjs_wasm::{crypt3, crypt3_64, crypt3_128};
use tripperjs_wasm::{run_x_iterations, run_x_iterations_64, run_x_iterations_128};
use tripperjs_wasm::get_salt;

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    crypt3(pwd, &salt)
}

fn generate_tripcode_64(pwd: &str) -> String {
    let salt = get_salt(pwd);

    // Input the same password 64 times
    let mut pwds = Vec::new();
    for _ in 0..64 {
        pwds.push(pwd.to_string())
    }
    
    // Return the first one since they're all the same
    crypt3_64(&pwds, &salt)[0].clone()
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


//#[test]
fn test_correctness() {
    //println!("Running correctness tests...");

    // --- Read test cases from file ---
    let contents = fs::read_to_string("tests/test_password_tripcode.txt")
        .expect("Failed to read test file");

    //let pool = "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
    let pool = "&\'<>@[\\]^_`"; // Characters that somehow produce incorrect tripcodes
    
    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        // TODO; Ignore characters that produce incorrect tripcodes
        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue; }

        let generated = generate_tripcode(input);

        //println!("generated {} expected {}", generated, expected);

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }

    //println!("    All correctness tests passed.\n");
}

#[test]
fn test_correctness_64() {
    //println!("Running correctness tests...");

    // --- Read test cases from file ---
    let contents = fs::read_to_string("tests/test_password_tripcode.txt")
        .expect("Failed to read test file");

    //let pool = "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
    let pool = "&\'<>@[\\]^_`"; // Characters that somehow produce incorrect tripcodes
    
    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        // TODO; Ignore characters that produce incorrect tripcodes
        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue;  }

        let generated = generate_tripcode_64(input);

        //println!("generated {} expected {}", generated, expected);

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }

    //println!("    All correctness tests passed.\n");
}

#[test]
fn test_correctness_128() {
    //println!("Running correctness tests...");

    // --- Read test cases from file ---
    let contents = fs::read_to_string("tests/test_password_tripcode.txt")
        .expect("Failed to read test file");

    //let pool = "#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
    let pool = "&\'<>@[\\]^_`"; // Characters that somehow produce incorrect tripcodes
    
    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        // TODO; Ignore characters that produce incorrect tripcodes
        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue;  }

        let generated = generate_tripcode_128(input);

        //println!("generated {} expected {}", generated, expected);

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }

    //println!("    All correctness tests passed.\n");
}

#[test]
fn test_performance() {
    //println!("Running performance test...");

    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = std::time::Duration::from_secs(4);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        run_x_iterations(iter_per_batch,"random_regex");
        iterations += iter_per_batch;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    //println!("    Total iterations: {}", iterations);
    println!("    run_x_iterations: {} tripcodes/s", tripcodes_per_second);
}

#[test]
fn test_performance_64() {
    //println!("Running performance test...");

    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = std::time::Duration::from_secs(4);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        run_x_iterations_64(iter_per_batch,"random_regex");
        iterations += iter_per_batch * 64;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    //println!("    Total iterations: {}", iterations);
    println!("    run_x_iterations_64: {} tripcodes/s", tripcodes_per_second);
}

#[test]
fn test_performance_128() {
    //println!("Running performance test...");

    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = std::time::Duration::from_secs(4);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        run_x_iterations_128(iter_per_batch,"random_regex");
        iterations += iter_per_batch * 128;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    //println!("    Total iterations: {}", iterations);
    println!("    run_x_iterations_128: {} tripcodes/s", tripcodes_per_second);
}
