// test/test.js
import assert from "assert";
import fs from "fs";
import { performance } from "perf_hooks";
import init from '../pkg/tripperjs_wasm.js';

const TEST_TRIPCODE_FILE = 'tests/test_password_tripcode.txt';

function generate_tripcode(pwd) {
    // Generate a tripcode given a password
    const salt = init.get_salt(pwd);
    const hash = init.crypt3(pwd, salt).substr(-10);

    return hash;
}

function test_correctness() {
    // Test the correctness of tripcode generation against
    // a known tripcode list
    console.log("Running correctness tests...");

    // --- Read test cases from file ---
    const testCases = fs
        .readFileSync(TEST_TRIPCODE_FILE, "utf-8")
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
            const [input, expected] = line.split(" ");
            return { input, expected };
        });

    for (const { input, expected } of testCases) {
        const generated = generate_tripcode(input);

        assert.strictEqual(
            generated,
            expected,
            `Tripcode mismatch for input "${input}": expected ${expected}, got ${generated}`
        );

        //console.log(generated, '->', expected)
    }
    
    console.log("    All correctness tests passed.\n");
}

function test_performance() {
    // Test the tripcodes generated per second in a period of 4 seconds
    console.log("Running performance test");

    const start = performance.now();
    let iterations = 0;
    const targetTime = 4_000; // 4 seconds

    while (performance.now() - start < targetTime) {
        init.run_1000_iterations();
        iterations += 1000;
    }

    const end = performance.now();
    const duration = (end - start).toFixed(2);
    const tripcodesPerSecond = Math.round(iterations / (duration / 1000));

    console.log(`    Total iterations: ${iterations}`);
    console.log(`    Tripcodes per second: ${tripcodesPerSecond}`);
}

test_correctness();
test_performance();
