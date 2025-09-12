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
                transpose_and_swap_blocks(matrix, block_row, block_col, block_col, block_row);
            }
        }
    }
}

fn transpose_block_in_place(matrix: &mut [u64; 64], block_row: usize, block_col: usize) {
    let mut block = [0u8; 8];

    for i in 0..8 {
        block[i] = ((matrix[block_row * 8 + i] >> (block_col * 8)) & 0xFF) as u8;
    }

    let trans = transpose_8x8_bytes(&block);

    for i in 0..8 {
        matrix[block_row * 8 + i] &= !(0xFFu64 << (block_col * 8));
        matrix[block_row * 8 + i] |= (trans[i] as u64) << (block_col * 8);
    }
}

/// Transposes two 8×8 blocks and swaps them across the diagonal
fn transpose_and_swap_blocks(
    matrix: &mut [u64; 64],
    row1: usize,
    col1: usize,
    row2: usize,
    col2: usize,
) {
    let mut block1 = [0u8; 8];
    let mut block2 = [0u8; 8];

    for i in 0..8 {
        block1[i] = ((matrix[row1 * 8 + i] >> (col1 * 8)) & 0xFF) as u8;
        block2[i] = ((matrix[row2 * 8 + i] >> (col2 * 8)) & 0xFF) as u8;
    }

    // Transpose both
    let trans1 = transpose_8x8_bytes(&block1);
    let trans2 = transpose_8x8_bytes(&block2);

    // Write transposed block2 into block1’s original location
    for i in 0..8 {
        matrix[row1 * 8 + i] &= !(0xFFu64 << (col1 * 8));
        matrix[row1 * 8 + i] |= (trans2[i] as u64) << (col1 * 8);
    }

    // Write transposed block1 into block2’s original location
    for i in 0..8 {
        matrix[row2 * 8 + i] &= !(0xFFu64 << (col2 * 8));
        matrix[row2 * 8 + i] |= (trans1[i] as u64) << (col2 * 8);
    }
}

/// Transposes an 8×8 block stored in 8 bytes
#[inline(always)]
fn transpose_8x8_bytes(input: &[u8; 8]) -> [u8; 8] {
    let mut x: u64 = 0;
    for i in 0..8 {
        x |= (input[i] as u64) << (i * 8);
    }

    let mut t: u64;

    // Swap bit 1 with bit 8
    t = (x ^ (x >> 7)) & 0x00AA00AA00AA00AA;
    x = x ^ t ^ (t << 7);

    // Swap bit 2 with bit 4
    t = (x ^ (x >> 14)) & 0x0000CCCC0000CCCC;
    x = x ^ t ^ (t << 14);

    // Swap bit 4 with bit 8
    t = (x ^ (x >> 28)) & 0x00000000F0F0F0F0;
    x = x ^ t ^ (t << 28);

    let mut out = [0u8; 8];
    for i in 0..8 {
        out[i] = ((x >> (i * 8)) & 0xFF) as u8;
    }
    out
}
