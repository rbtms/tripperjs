#[cfg(target_arch = "wasm32")]
use core::arch::wasm32::*;

pub fn to_binary_array(pwd: &str) -> u64 {
    let mut pwd_bin = 0u64;

    for (i, &c) in pwd.as_bytes().iter().take(8).enumerate() {
        pwd_bin |= ((c.reverse_bits() >> 1) as u64) << (i*8);
    }

    pwd_bin
}

pub fn to_binary_arrays(pwds: &Vec<String>) -> [u64; 64] {
    std::array::from_fn(|i| to_binary_array(&pwds[i]))
}

pub fn to_binary_arrays_128(pwds: &Vec<String>) -> [u64; 128] {
    std::array::from_fn(|i| to_binary_array(&pwds[i]))
}

#[inline(always)]
pub fn get_matrix_column(m: &[u64; 32], col_i: usize) -> u64 {
    let mut col = 0u64;

    for (i, &row) in m.iter().enumerate() {
        col |= ((row>>col_i)&1) << i;
    }

    col
}

/* -- From here below, matrix transposition -- */

pub fn transpose_64x64(matrix: &mut [u64; 64]) {
    const MATRIX_SIZE: usize = 64;
    const BLOCK_SIZE: usize = 8;

    for block_row in 0..(MATRIX_SIZE / BLOCK_SIZE) {
        for block_col in 0..(MATRIX_SIZE / BLOCK_SIZE) {
            if block_row == block_col {
                transpose_block_in_place(matrix, block_row, block_col);
            } else if block_row < block_col {
                transpose_and_swap_8x8_blocks(matrix, block_row, block_col, block_col, block_row);
            }
        }
    }
}

fn transpose_block_in_place(matrix: &mut [u64; 64], block_row: usize, block_col: usize) {
    let mut block: u64 = 0;

    // Pack the 8×8 block into a single u64
    for i in 0..8 {
        let row = matrix[block_row * 8 + i];
        let byte = (row >> (block_col * 8)) & 0xFF;
        block |= byte << (i * 8);
    }

    // Transpose it in-place using fast bitwise method
    block = transpose_8x8_u64(block);

    // Unpack the transposed block back into the matrix
    for i in 0..8 {
        matrix[block_row * 8 + i] &= !(0xFFu64 << (block_col * 8)); // clear bits
        matrix[block_row * 8 + i] |= ((block >> (i * 8)) & 0xFF) << (block_col * 8); // write new bits
    }
}

/// Transposes two 8×8 blocks and swaps them across the diagonal
fn transpose_and_swap_8x8_blocks(matrix: &mut [u64; 64], row1: usize, col1: usize, row2: usize, col2: usize) {
    // Extract 8 rows from each block and pack into u64s
    let mut block1: u64 = 0;
    let mut block2: u64 = 0;

    for i in 0..8 {
        block1 |= ((matrix[row1 * 8 + i] >> (col1 * 8)) & 0xFF) << (i * 8);
        block2 |= ((matrix[row2 * 8 + i] >> (col2 * 8)) & 0xFF) << (i * 8);
    }

    // Transpose
    let block1_transposed = transpose_8x8_u64(block1);
    let block2_transposed = transpose_8x8_u64(block2);

    for i in 0..8 {
        // Write transposed block1 into block2’s position
        matrix[row1 * 8 + i] &= !(0xFFu64 << (col1 * 8));
        matrix[row1 * 8 + i] |= ((block2_transposed >> (i * 8)) & 0xFF) << (col1 * 8);

        // Write transposed block2 into block1’s position
        matrix[row2 * 8 + i] &= !(0xFFu64 << (col2 * 8));
        matrix[row2 * 8 + i] |= ((block1_transposed >> (i * 8)) & 0xFF) << (col2 * 8);
    }
}

#[inline(always)]
fn transpose_8x8_u64(x: u64) -> u64 {
    let mut x = x;
    let mut t: u64;

    t = (x ^ (x >> 7)) & 0x00AA00AA00AA00AA;
    x = x ^ t ^ (t << 7);

    t = (x ^ (x >> 14)) & 0x0000CCCC0000CCCC;
    x = x ^ t ^ (t << 14);

    t = (x ^ (x >> 28)) & 0x00000000F0F0F0F0;
    x = x ^ t ^ (t << 28);

    x
}

