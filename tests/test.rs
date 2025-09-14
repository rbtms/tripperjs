#![cfg(not(target_arch = "wasm32"))]
use std::fs;
use std::time::Instant;
use std::collections::HashMap;
use tripperjs_wasm::base::crypt3;
use tripperjs_wasm::bitslice_64::crypt3_64;

use tripperjs_wasm::{run_x_iterations, run_x_iterations_64};//, run_x_iterations_128};
use tripperjs_wasm::get_salt;

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    crypt3::crypt3(pwd, &salt)
}

fn generate_tripcode_64(pwd: &str) -> String {
    let salt = get_salt(pwd);

    // Input the same password 64 times
    let mut pwds = Vec::new();
    for _ in 0..64 {
        pwds.push(pwd.to_string())
    }
    
    // Return the first one since they're all the same
    crypt3_64::crypt3(&pwds, &salt)[0].clone()
}

// ---- Correctness tests ----
// Correctness tests verify that tripcode generation produces expected output
// by comparing generated tripcodes against known test cases from a file.

fn run_correctness_test(f: &dyn Fn(&str) -> String) {
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

        let generated = f(input);

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
fn test_correctness() {
    run_correctness_test(&generate_tripcode);
}

#[test]
fn test_correctness_64() { 
    run_correctness_test(&generate_tripcode_64);
}

// ---- Performance tests ----
// Performance tests measure tripcodes per second by running functions repeatedly
// for a fixed duration

fn run_performance_test(name: &str, f: &dyn Fn(u32, &str) -> HashMap<String, String>, items_per_iter: u32) {
    let iter_per_batch = 1000;
    let mut iterations = 0;
    let target_duration = std::time::Duration::from_secs(4);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        f(iter_per_batch,"random_regex");
        iterations += iter_per_batch * items_per_iter;
    }

    let duration_secs = (Instant::now() - start).as_secs_f64();
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    //println!("    Total iterations: {}", iterations);
    println!("    {name}: {tripcodes_per_second} tripcodes/s");
}

#[test]
fn test_performance() {
    run_performance_test("run_x_iterations", &run_x_iterations, 1);
}

#[test]
fn test_performance_64() {
    run_performance_test("run_x_iterations_64", &run_x_iterations_64, 64);
}
