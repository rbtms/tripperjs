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
