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

/* ---- From here below, matrix transposition ---- */

pub fn transpose_64x64(matrix: &mut [u64; 64]) {
    const BLOCK_WIDTH: usize = 8;
    let matrix_src = matrix.clone();

    // Clear matrix before writing the transposition
    for i in 0..64 {
        matrix[i] = 0u64;
    }

    // 36 iterations / 64 swaps
    for block_col in 0..BLOCK_WIDTH {
        for block_row in 0..block_col {
            transpose_and_swap_8x8_blocks(matrix, &matrix_src, block_row, block_col);
        }
        // Blocks in the main diagonal
        transpose_block_in_place(matrix, &matrix_src, block_col, block_col);
    }
}

#[inline(always)]
fn pack_block_to_u64(matrix: &[u64; 64], col: usize, row: usize) -> u64 {
    let mut block = 0u64;

    for i in 0..8 {
        block |= ((matrix[row * 8 + i] >> (col * 8)) & 0xFF) << (i * 8);
    }

    block
}

#[inline(always)]
fn write_u64_block(matrix: &mut [u64; 64], block: u64, col: usize, row :usize) {
    for i in 0..8 {
        matrix[row * 8 + i] |= ((block >> (i * 8)) & 0xFF) << (col * 8);
    }
}

#[inline(always)]
fn transpose_block_in_place(matrix: &mut [u64; 64], matrix_src: &[u64; 64], row: usize, col: usize) {
    let block: u64 = pack_block_to_u64(matrix_src, col, row);
    let block_t = transpose_8x8_u64(block);
    write_u64_block(matrix, block_t, col, row);
}

/// Transposes two 8×8 blocks and swaps them across the diagonal
#[inline(always)]
fn transpose_and_swap_8x8_blocks(matrix: &mut [u64; 64], matrix_src: &[u64; 64], row: usize, col: usize) {
    // Extract 8 rows from each block and pack into u64s
    let block1 = pack_block_to_u64(matrix_src, col, row);
    let block2 = pack_block_to_u64(matrix_src, row, col);

    // Transpose
    let block1_t = transpose_8x8_u64(block1);
    let block2_t = transpose_8x8_u64(block2);

    write_u64_block(matrix, block1_t, row, col);
    write_u64_block(matrix, block2_t, col, row);
}

#[inline(always)]
fn transpose_8x8_u64(x: u64) -> u64 {
    let mut x = x;
    let mut t: u64;
    const MASK1: u64 = 0x00AA00AA00AA00AA;
    const MASK2: u64 = 0x0000CCCC0000CCCC;
    const MASK3: u64 = 0x00000000F0F0F0F0;

    // Handle bits at a given distance
    t = (x ^ (x >> 7))  & MASK1;
    x ^= t ^ (t << 7);

    t = (x ^ (x >> 14)) & MASK2;
    x ^= t ^ (t << 14);

    t = (x ^ (x >> 28)) & MASK3;
    x ^= t ^ (t << 28);

    x
}