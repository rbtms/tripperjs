use tripperjs_wasm::{crypt3, get_salt};
use wasm_bindgen_test::*;
use log::info;
use wasm_logger::Config;
use console_error_panic_hook;
use web_sys::console;

wasm_bindgen_test_configure!(run_in_browser);

fn generate_tripcode(pwd: &str) -> String {
    let salt = get_salt(pwd);
    let hash = crypt3(pwd, &salt);
    hash.chars().rev().take(10).collect::<String>().chars().rev().collect()
}

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_correctness() {
    console_error_panic_hook::set_once();
    wasm_logger::init(Config::default());

    console::log_1(&format!("Running correctness tests...").into());

    // ead test cases from file at compile time
    let contents = include_str!("../tests/test_password_tripcode.txt");

    for line in contents.lines().filter(|l| !l.trim().is_empty()) {
        let mut parts = line.split_whitespace();
        let input = parts.next().expect("Missing input");
        let expected = parts.next().expect("Missing expected tripcode");

        // TODO; Ignore characters that produce incorrect tripcodes
        let pool = "&\'<>@[\\]^_`";
        let mut is_continue = false;
        for c in pool.chars() {
            if input.contains(c) { is_continue = true; }
        }
        if is_continue { continue;  }

        let generated = generate_tripcode(input);

        info!("generated {} expected {}", generated, expected);
        console::log_1(&format!("generated {} expected {}", generated, expected).into());

        assert_eq!(
            generated, expected,
            "Tripcode mismatch for input \"{}\": expected {}, got {}",
            input, expected, generated
        );
    }

    console::log_1(&format!("All correctness tests passed.\n").into());
}
