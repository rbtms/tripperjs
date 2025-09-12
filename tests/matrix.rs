use tripperjs_wasm::matrix_utils;

#[test]
fn test_matrix_transposition() {
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
