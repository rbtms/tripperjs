use std::fs;
use std::time::Instant;
use tripperjs_wasm::crypt3; // your Rust crypt3 implementation
use tripperjs_wasm::run_1000_iterations;
use tripperjs_wasm::get_salt;

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3(pwd, &salt);
    hash.chars().rev().take(10).collect::<String>().chars().rev().collect()
}

#[test]
fn test_correctness() {
    println!("Running correctness tests...");

    // --- Read test cases from file ---
    let contents =
        fs::read_to_string("tests/test_password_tripcode.txt").expect("Failed to read test file");
        for line in contents.lines().filter(|l| !l.trim().is_empty()) {

        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        let generated = generate_tripcode(input);

        println!("generated {} expected {}", generated, expected);

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }

    println!("    All correctness tests passed.\n");
}

#[test]
fn test_performance() {
    println!("Running performance test...");

    let target_duration = std::time::Duration::from_secs(10);
    let start = Instant::now();
    let mut iterations = 0;

    while Instant::now() - start < target_duration {
        // Run 1000 iterations
        run_1000_iterations();
        iterations += 1000;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    println!("    Total iterations: {}", iterations);
    println!("    Tripcodes per second: {}", tripcodes_per_second);
}
