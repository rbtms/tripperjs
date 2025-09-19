use std::time::Instant;
use tripperjs_wasm::matrix_utils;

// Test that matrices are transposed correctly
#[test]
fn test_matrix_transposition_correctness() {
    let mut matrix: [u64; 64] = [
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100
    ];

    let transposed_matrix:  [u64; 64] = [
        0x5555555555555555, 0x5555555555555555, 0x5555555555555555, 0x5555555555555555,
        0x0000000000000000, 0x5555555555555555, 0x5555555555555555, 0x5555555555555555,
        0xffffffffffffffff, 0x0000000000000000, 0x5555555555555555, 0x5555555555555555,
        0x0000000000000000, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555, 0x5555555555555555,
        0xffffffffffffffff, 0xffffffffffffffff, 0x0000000000000000, 0x5555555555555555,
        0x0000000000000000, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555,
        0xffffffffffffffff, 0x0000000000000000, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555,
        0x0000000000000000, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555,
        0x5555555555555555, 0x5555555555555555, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa,
        0xaaaaaaaaaaaaaaaa, 0x5555555555555555, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa,
        0x5555555555555555, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa,
        0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa,
        0x5555555555555555, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa,
        0xaaaaaaaaaaaaaaaa, 0x5555555555555555, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa,
        0x5555555555555555, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa,
        0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa, 0xaaaaaaaaaaaaaaaa
    ];

    matrix_utils::transpose_64x64(&mut matrix);

    for (i, &line) in matrix.iter().enumerate() {
        assert!(line == transposed_matrix[i], "Matrix transposition is incorrect.");
    }
}

// Test the number of matrices per second that the module is capable of processing
//#[test]
#[test]
fn test_matrix_transposition_performance() {
    let mut matrix: [u64; 64] = [
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100,
        0x0123456789abcdef, 0xfedcba9865432100, 0x0123456789abcdef, 0xfedcba9865432100
    ];

    let mut total = 0;
    let target_duration = std::time::Duration::from_secs(1);
    let start = Instant::now();

    while Instant::now() - start < target_duration {
        matrix_utils::transpose_64x64(&mut matrix);
        total += 1;
    }

    println!("{} transpositions/s", total);
}
