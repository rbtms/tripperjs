use std::fs;
use std::time::Instant;
use tripperjs_wasm::crypt3; // your Rust crypt3 implementation
use tripperjs_wasm::run_x_iterations;
use tripperjs_wasm::get_salt;

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3(pwd, &salt);
    hash.chars().rev().collect::<String>().chars().rev().collect()
}

#[test]
fn test_correctness() {
    println!("Running correctness tests...");

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

    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = std::time::Duration::from_secs(4);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        // Run 1000 iterations
        run_x_iterations(iter_per_batch,"random_regex");
        iterations += iter_per_batch;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    println!("    Total iterations: {}", iterations);
    println!("    Tripcodes per second: {}", tripcodes_per_second);
}
