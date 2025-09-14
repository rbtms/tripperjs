#![cfg(target_arch = "wasm32")]
use tripperjs_wasm::base::crypt3;
use tripperjs_wasm::bitslice_64::crypt3_64;
use tripperjs_wasm::bitslice_v128::crypt3_v128;
use tripperjs_wasm::{get_salt, run_x_iterations, run_x_iterations_64, run_x_iterations_v128};
use wasm_bindgen::prelude::JsValue;
use wasm_bindgen_test::*;
use web_sys::console;
use wasm_bindgen;
use js_sys::Date;

wasm_bindgen_test_configure!(run_in_browser);

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3::crypt3(pwd, &salt);
    hash.chars().rev().take(10).collect::<String>().chars().rev().collect()
}

fn generate_tripcode_64(pwd: &str) -> String {
    let salt = get_salt(pwd);

    let mut pwds = Vec::new();
    for _ in 0..128 {
        pwds.push(pwd.to_string())
    }
    
    let hashes = crypt3_64::crypt3(&pwds, &salt);
    hashes[0].clone()
}

fn generate_tripcode_v128(pwd: &str) -> String {
    let salt = get_salt(pwd);
    // Input the same password 64 times
    let mut pwds = Vec::new();
    for _ in 0..128 {
        pwds.push(pwd.to_string())
    }
 
    // Return the first one since they're all the same
    crypt3_v128::crypt3(&pwds, &salt)[0].clone()
}

// ---- Correctness tests ----
// Correctness tests verify that tripcode generation produces expected output
// by comparing generated tripcodes against known test cases from a file.

fn run_correctness_test(f: &dyn Fn(&str) -> String) {
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

        let generated = f(input);

        //info!("generated {} expected {}", generated, expected);
        //console::log_1(&format!("generated {} expected {}", generated, expected).into());

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }
}

//#[wasm_bindgen_test]
fn test_correctness() {
    run_correctness_test(&generate_tripcode);
}

#[wasm_bindgen_test]
fn test_correctness_64() {
    run_correctness_test(&generate_tripcode_64);
}

#[wasm_bindgen_test]
fn test_correctness_v128() {
    run_correctness_test(&generate_tripcode_v128);
}

// ---- Performance tests ----
// Performance tests measure tripcodes per second by running functions repeatedly
// for a fixed duration

fn now_secs() -> f64 {
    Date::now() / 1000.0
}

fn run_performance_test(name: &str, f: &dyn Fn(u32, &str) -> JsValue, items_per_iter: u32) {
    let iter_per_batch = 1_000;
    let mut iterations = 0;
    let target_duration = 4.0; // seconds
    let start = now_secs();

    while now_secs() - start < target_duration {
        f(iter_per_batch, "random_regex");
        iterations += iter_per_batch*items_per_iter;
    }

    let duration_secs = now_secs() - start;
    let tripcodes_per_second = (iterations as f64 / duration_secs).round() as u64;

    web_sys::console::log_1(
        &format!("    {name}: {tripcodes_per_second} tripcodes/s").into()
    );
}

#[wasm_bindgen_test]
fn test_performance() {
    run_performance_test("run_x_iterations", &run_x_iterations, 1);
}

#[wasm_bindgen_test]
fn test_performance_64() {
    run_performance_test("run_x_iterations_64", &run_x_iterations_64, 64);
}

#[wasm_bindgen_test]
fn test_performance_v128() {
    run_performance_test("run_x_iterations_v128", &run_x_iterations_v128, 128);
}
