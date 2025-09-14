use lazy_static::lazy_static;
#[cfg(target_arch = "wasm32")]
use std::arch::wasm32::*;
#[cfg(target_arch = "wasm32")]
use crate::bitslice_v128::v128_utils;

/// Converts a string password into a 64-bit binary representation.
///
/// This function takes the first 8 characters of the input string and converts
/// each character into a 64-bit value by:
/// 1. Reversing the bits of each character
/// 2. Shifting the result right by 1 bit
/// 3. Placing each character's value in the appropriate bit position (8-bit chunks)
///
/// # Arguments
/// * `pwd` - A string slice representing the password to convert
///
/// # Returns
/// * `u64` - The 64-bit binary representation of the password
pub fn to_binary_array(pwd: &str) -> u64 {
    let mut pwd_bin = 0u64;

    for (i, &c) in pwd.as_bytes().iter().take(8).enumerate() {
        pwd_bin |= ((c.reverse_bits() >> 1) as u64) << (i*8);
    }

    pwd_bin
}

/// Converts a vector of password strings into an array of 64-bit binary representations.
///
/// This function take 64 passwords from the input vector and converts each
/// one into a 64-bit binary value using `to_binary_array`.
///
/// # Arguments
/// * `pwds` - A vector of strings representing passwords to convert
///
/// # Returns
/// * `[u64; 64]` - An array of 64 64-bit binary values
pub fn to_binary_array_64(pwds: &Vec<String>) -> [u64; 64] {
    std::array::from_fn(|i| to_binary_array(&pwds[i]))
}

/// Extracts a column from a 64x64 bit matrix represented as an array of 64 u64 values.
///
/// This function treats the input slice as a 64x64 binary matrix where each u64 represents
/// a row. It extracts the specified column index and returns it as a u64 value.
///
/// # Arguments
/// * `m` - A reference to an array of 64 u64 values representing the matrix rows
/// * `col_i` - The column index to extract (0-63)
///
/// # Returns
/// * `u64` - The column as a u64 value with bits set according to the column values
#[inline(always)]
pub fn get_matrix_column(matrix: &[u64; 32], col_i: usize) -> u64 {
    let mut col = 0u64;

    for (i, &row) in matrix.iter().enumerate() {
        col |= ((row>>col_i)&1) << i;
    }

    col
}

/// Performs an in-place transposition of a 64x64 bit matrix using a butterfly network.
///
/// This function treats the 64-element array `matrix` as a 64x64 binary matrix,
/// where each `u64` represents a row of 64 bits. That is, `matrix[i]` is the i-th row,
/// and each bit in that row is a column value (bit j of matrix[i] is at (i, j)).
///
/// The algorithm efficiently transposes this bit matrix in-place, so that
/// the resulting `matrix[j]` will contain the bits from the j-th column of the original.
///
/// It uses a sequence of log2(64) = 6 bit-level "butterfly" stages. Each stage exchanges
/// pairs of bits at increasing distances (1, 2, 4, 8, 16, 32) to perform partial transpositions.
///
/// At each stage, specific bit masks are used to isolate and swap interleaved bit fields.
/// These masks (1-bit, 2-bit, 4-bit, etc.) ensure only the relevant bits are modified at
/// each level of the butterfly network, avoiding unintended interference with others.
///
/// The nested loops perform pairwise operations on rows. At each level, the rows are grouped
/// in pairs spaced by `s = 1 << level`. Within each group, the rows exchange bit fields
/// according to the current mask and offset. This is equivalent to performing
/// bitwise transpositions across the matrix diagonals in log₂(n) time.
///
/// Overall, this method is much more efficient than naïvely iterating over all 4096 bits,
/// and is suitable for applications such as graphics, cryptography, or linear algebra where
/// bitwise matrix operations are required.
///
/// # Arguments
/// * `matrix` - A mutable reference to an array of 64 u64 values representing the matrix to transpose
pub fn transpose_64x64(matrix: &mut [u64; 64]) {
    const MASKS: [u64; 6] = [
        0x5555555555555555, // 1-bit mask
        0x3333333333333333, // 2-bit mask
        0x0f0f0f0f0f0f0f0f, // 4-bit mask
        0x00ff00ff00ff00ff, // 8-bit mask
        0x0000ffff0000ffff, // 16-bit mask
        0x00000000ffffffff, // 32-bit mask
    ];

    // Iterate over each of the 6 stages (levels) of the butterfly network.
    for level in 0..6 {
        let s = 1 << level;
        let mask = MASKS[level];

        // Process the matrix in chunks of size s*2 rows
        for i in (0..64).step_by(s * 2) {
            for j in 0..s {
                let a = matrix[i + j];
                let b = matrix[i + j + s];
                let t = ((a >> s) ^ b) & mask;
                matrix[i + j] = a ^ (t << s);
                matrix[i + j + s] = b ^ t;
            }
        }
    }
}

#[cfg(target_arch = "wasm32")]
lazy_static! {
    static ref TRANSPOSE_V128_MASKS: [v128; 6] = {
        unsafe {[
            v128_utils::load_u64_to_v128(0x5555555555555555),
            v128_utils::load_u64_to_v128(0x3333333333333333),
            v128_utils::load_u64_to_v128(0x0f0f0f0f0f0f0f0f),
            v128_utils::load_u64_to_v128(0x00ff00ff00ff00ff),
            v128_utils::load_u64_to_v128(0x0000ffff0000ffff),
            v128_utils::load_u64_to_v128(0x00000000ffffffff),
        ]}
    };
}

#[cfg(target_arch = "wasm32")]
pub unsafe fn transpose_64x64_v128(matrix: &mut [v128; 64]) {
    // Iterate over each of the 6 stages (levels) of the butterfly network.
    for level in 0..6 {
        let s = 1 << level;
        let mask = TRANSPOSE_V128_MASKS[level];

        // Process the matrix in chunks of size s*2 rows
        for i in (0..64).step_by(s * 2) {
            for j in 0..s {
                let a = matrix[i + j];
                let b = matrix[i + j + s];

                // Compute t = ((a >> s) ^ b) & mask
                let a_shr = i64x2_shr(a, s as u32);
                let t = v128_and(v128_xor(a_shr, b), mask);

                // matrix[i + j]     = a ^ (t << s)
                // matrix[i + j + s] = b ^ t
                let t_shl = i64x2_shl(t, s as u32);
                matrix[i + j] = v128_xor(a, t_shl);
                matrix[i + j + s] = v128_xor(b, t);
            }
        }
    }
}

