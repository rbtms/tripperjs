#![cfg(target_arch = "wasm32")]
use std::arch::wasm32::*;
use crate::constants::*;
use crate::matrix_utils::{transpose_64x64, transpose_64x64_v128};
use crate::bitslice_v128::sboxes_v128::*;
use crate::bitslice_v128::v128_utils;

/// Precomputation of the initial L/R bit permutations for 64-bit blocks.
///
/// This function initializes a lookup table used during the DES encryption process.
/// It maps bit positions from the initial permutation to their corresponding bit indices
/// in the transposed data structure.
///
/// # Returns
/// A static array of 8 tables, each containing values representing precomputed
/// bit permutations for the initial L/R split.
static INITIAL_LR_PRECOMPUTED_64: [[u64; 256]; 8] = {
    let mut tables = [[0u64; 256]; 8];

    let mut i = 0;
    while i < 32 {
        let initial_val = INITIAL_PERMUTATION_L[i];
        let byte_index = initial_val / 8;
        let bit_index  = (initial_val % 8) as u64;

        let mut b = 0;
        while b < 256u64 {
            let mask = ((b >> bit_index) & 1) << i;
            tables[byte_index][b as usize] |= mask;
            b += 1;
        }

        i += 1;
    }

    let mut i = 0;
    while i < 32 {
        let initial_val = INITIAL_PERMUTATION_R[i];
        let byte_index = initial_val / 8;
        let bit_index  = (initial_val % 8) as u64;

        let mut b = 0;
        while b < 256u64 {
            let mask = ((b >> bit_index) & 1) << i;
            tables[byte_index][b as usize] |= mask << 32;
            b += 1;
        }

        i += 1;
    }

    tables
};

// ------------------------------------------------------------------------------------------------

/// Performs two DES round using SIMD operations to avoid swaps between L and R.
///
/// This function computes one round of the DES encryption algorithm using vectorized operations.
/// It applies S-box substitutions to the expanded right half XORed with the round key,
/// and XORs the result into the left half according to the inverse straight permutation.
///
/// # Parameters
/// * `l` - Mutable reference to the left half bitsliced data
/// * `r` - Reference to the right half bitsliced data
/// * `k_round_r` - The round key data for the round depending on R
/// * `k_round_l` - The round key data for the round depending on L
/// * `exp` - The expansion permutation table
#[target_feature(enable = "simd128")]
pub unsafe fn des_rounds(l: &mut [v128; 32], r: &mut [v128; 32], k_round_r: &[v128; 64], k_round_l: &[v128; 64], exp: &[usize; 48]) {
    s1(v128_xor(k_round_r[0],  r[exp[0]]),  v128_xor(k_round_r[1],  r[exp[1]]),  v128_xor(k_round_r[2],  r[exp[2]]),
       v128_xor(k_round_r[3],  r[exp[3]]),  v128_xor(k_round_r[4],  r[exp[4]]),  v128_xor(k_round_r[5],  r[exp[5]]),  l);
    s2(v128_xor(k_round_r[6],  r[exp[6]]),  v128_xor(k_round_r[7],  r[exp[7]]),  v128_xor(k_round_r[8],  r[exp[8]]),
       v128_xor(k_round_r[9],  r[exp[9]]),  v128_xor(k_round_r[10], r[exp[10]]), v128_xor(k_round_r[11], r[exp[11]]), l);
    s3(v128_xor(k_round_r[12], r[exp[12]]), v128_xor(k_round_r[13], r[exp[13]]), v128_xor(k_round_r[14], r[exp[14]]),
       v128_xor(k_round_r[15], r[exp[15]]), v128_xor(k_round_r[16], r[exp[16]]), v128_xor(k_round_r[17], r[exp[17]]), l);
    s4(v128_xor(k_round_r[18], r[exp[18]]), v128_xor(k_round_r[19], r[exp[19]]), v128_xor(k_round_r[20], r[exp[20]]),
       v128_xor(k_round_r[21], r[exp[21]]), v128_xor(k_round_r[22], r[exp[22]]), v128_xor(k_round_r[23], r[exp[23]]), l);
    s5(v128_xor(k_round_r[24], r[exp[24]]), v128_xor(k_round_r[25], r[exp[25]]), v128_xor(k_round_r[26], r[exp[26]]),
       v128_xor(k_round_r[27], r[exp[27]]), v128_xor(k_round_r[28], r[exp[28]]), v128_xor(k_round_r[29], r[exp[29]]), l);
    s6(v128_xor(k_round_r[30], r[exp[30]]), v128_xor(k_round_r[31], r[exp[31]]), v128_xor(k_round_r[32], r[exp[32]]),
       v128_xor(k_round_r[33], r[exp[33]]), v128_xor(k_round_r[34], r[exp[34]]), v128_xor(k_round_r[35], r[exp[35]]), l);
    s7(v128_xor(k_round_r[36], r[exp[36]]), v128_xor(k_round_r[37], r[exp[37]]), v128_xor(k_round_r[38], r[exp[38]]),
       v128_xor(k_round_r[39], r[exp[39]]), v128_xor(k_round_r[40], r[exp[40]]), v128_xor(k_round_r[41], r[exp[41]]), l);
    s8(v128_xor(k_round_r[42], r[exp[42]]), v128_xor(k_round_r[43], r[exp[43]]), v128_xor(k_round_r[44], r[exp[44]]),
       v128_xor(k_round_r[45], r[exp[45]]), v128_xor(k_round_r[46], r[exp[46]]), v128_xor(k_round_r[47], r[exp[47]]), l);

    s1(v128_xor(k_round_l[0],  l[exp[0]]),  v128_xor(k_round_l[1],  l[exp[1]]),  v128_xor(k_round_l[2],  l[exp[2]]),
       v128_xor(k_round_l[3],  l[exp[3]]),  v128_xor(k_round_l[4],  l[exp[4]]),  v128_xor(k_round_l[5],  l[exp[5]]),  r);
    s2(v128_xor(k_round_l[6],  l[exp[6]]),  v128_xor(k_round_l[7],  l[exp[7]]),  v128_xor(k_round_l[8],  l[exp[8]]),
       v128_xor(k_round_l[9],  l[exp[9]]),  v128_xor(k_round_l[10], l[exp[10]]), v128_xor(k_round_l[11], l[exp[11]]), r);
    s3(v128_xor(k_round_l[12], l[exp[12]]), v128_xor(k_round_l[13], l[exp[13]]), v128_xor(k_round_l[14], l[exp[14]]),
       v128_xor(k_round_l[15], l[exp[15]]), v128_xor(k_round_l[16], l[exp[16]]), v128_xor(k_round_l[17], l[exp[17]]), r);
    s4(v128_xor(k_round_l[18], l[exp[18]]), v128_xor(k_round_l[19], l[exp[19]]), v128_xor(k_round_l[20], l[exp[20]]),
       v128_xor(k_round_l[21], l[exp[21]]), v128_xor(k_round_l[22], l[exp[22]]), v128_xor(k_round_l[23], l[exp[23]]), r);
    s5(v128_xor(k_round_l[24], l[exp[24]]), v128_xor(k_round_l[25], l[exp[25]]), v128_xor(k_round_l[26], l[exp[26]]),
       v128_xor(k_round_l[27], l[exp[27]]), v128_xor(k_round_l[28], l[exp[28]]), v128_xor(k_round_l[29], l[exp[29]]), r);
    s6(v128_xor(k_round_l[30], l[exp[30]]), v128_xor(k_round_l[31], l[exp[31]]), v128_xor(k_round_l[32], l[exp[32]]),
       v128_xor(k_round_l[33], l[exp[33]]), v128_xor(k_round_l[34], l[exp[34]]), v128_xor(k_round_l[35], l[exp[35]]), r);
    s7(v128_xor(k_round_l[36], l[exp[36]]), v128_xor(k_round_l[37], l[exp[37]]), v128_xor(k_round_l[38], l[exp[38]]),
       v128_xor(k_round_l[39], l[exp[39]]), v128_xor(k_round_l[40], l[exp[40]]), v128_xor(k_round_l[41], l[exp[41]]), r);
    s8(v128_xor(k_round_l[42], l[exp[42]]), v128_xor(k_round_l[43], l[exp[43]]), v128_xor(k_round_l[44], l[exp[44]]),
       v128_xor(k_round_l[45], l[exp[45]]), v128_xor(k_round_l[46], l[exp[46]]), v128_xor(k_round_l[47], l[exp[47]]), r);
}

/// Initializes the left and right halves for DES encryption from raw data.
///
/// This function takes two 64-element arrays of u64 values representing the input blocks,
/// applies the initial permutation, transposes the data, and converts it into bitsliced
/// v128 vectors for processing.
///
/// # Parameters
/// * `data1` - First 64-element array of u64 values representing the first block
/// * `data2` - Second 64-element array of u64 values representing the second block
///
/// # Returns
/// A tuple containing (left_half, right_half) where each is an array of 32 v128 vectors
#[target_feature(enable = "simd128")]
pub unsafe fn init_lr(data1: &[u64; 64], data2: &[u64; 64]) -> ([v128; 32], [v128; 32]) {
    let mut _data1 = [0u64; 64];
    let mut _data2 = [0u64; 64];

    for i in 0..64 {
        let [b0, b1, b2, b3, b4, b5, b6, b7] = data1[i].to_le_bytes();
        _data1[i] =
              INITIAL_LR_PRECOMPUTED_64[0][b0 as usize]
            | INITIAL_LR_PRECOMPUTED_64[1][b1 as usize]
            | INITIAL_LR_PRECOMPUTED_64[2][b2 as usize]
            | INITIAL_LR_PRECOMPUTED_64[3][b3 as usize]
            | INITIAL_LR_PRECOMPUTED_64[4][b4 as usize]
            | INITIAL_LR_PRECOMPUTED_64[5][b5 as usize]
            | INITIAL_LR_PRECOMPUTED_64[6][b6 as usize]
            | INITIAL_LR_PRECOMPUTED_64[7][b7 as usize];

        let [b0, b1, b2, b3, b4, b5, b6, b7] = data2[i].to_le_bytes();
        _data2[i] =
              INITIAL_LR_PRECOMPUTED_64[0][b0 as usize]
            | INITIAL_LR_PRECOMPUTED_64[1][b1 as usize]
            | INITIAL_LR_PRECOMPUTED_64[2][b2 as usize]
            | INITIAL_LR_PRECOMPUTED_64[3][b3 as usize]
            | INITIAL_LR_PRECOMPUTED_64[4][b4 as usize]
            | INITIAL_LR_PRECOMPUTED_64[5][b5 as usize]
            | INITIAL_LR_PRECOMPUTED_64[6][b6 as usize]
            | INITIAL_LR_PRECOMPUTED_64[7][b7 as usize];
    }

    transpose_64x64(&mut _data1);
    transpose_64x64(&mut _data2);

    let mut l: [v128; 32] = [u64x2_splat(0); 32];
    let mut r: [v128; 32] = [u64x2_splat(0); 32];

    for i in 0..32 {
        l[i] = unsafe { v128_utils::load_u64x2_to_v128(_data1[i], _data2[i]) };
        r[i] = unsafe { v128_utils::load_u64x2_to_v128(_data1[32+i], _data2[32+i]) };
    }

    (l, r)
}

/// Applies the final permutation to the DES output and returns the decrypted blocks.
///
/// This function performs the inverse of the initial permutation, converting the bitsliced
/// data back into standard bit layout for the output blocks.
///
/// # Parameters
/// * `l` - Left half bitsliced data (32 v128 vectors)
/// * `r` - Right half bitsliced data (32 v128 vectors)
///
/// # Returns
/// A tuple containing (blocks1, blocks2) where each is a 64-element array of u64 values
#[target_feature(enable = "simd128")]
pub fn final_permutation(l: &[v128; 32], r: &[v128; 32]) -> ([u64; 64], [u64; 64]) {
    let mut data = unsafe { v128_utils::concat_v128_arrays(l, r) };

    unsafe { transpose_64x64_v128(&mut data); }

    let mut blocks1 = [0u64; 64];
    let mut blocks2 = [0u64; 64];

    for block_i in 0..32 {
        let col1 = unsafe { v128_utils::extract_v128_lane0(data[block_i]) };
        let [l0, l1, l2, l3, r0, r1, r2, r3] = col1.to_le_bytes();

        blocks1[block_i] =
               FINAL_L_PRECOMPUTED[0][l0 as usize]
             | FINAL_L_PRECOMPUTED[1][l1 as usize]
             | FINAL_L_PRECOMPUTED[2][l2 as usize]
             | FINAL_L_PRECOMPUTED[3][l3 as usize]
             | FINAL_R_PRECOMPUTED[0][r0 as usize]
             | FINAL_R_PRECOMPUTED[1][r1 as usize]
             | FINAL_R_PRECOMPUTED[2][r2 as usize]
             | FINAL_R_PRECOMPUTED[3][r3 as usize];

        let col2 = unsafe { v128_utils::extract_v128_lane1(data[block_i]) };
        let [l0, l1, l2, l3, r0, r1, r2, r3] = col2.to_le_bytes();
        blocks2[block_i] =
               FINAL_L_PRECOMPUTED[0][l0 as usize]
             | FINAL_L_PRECOMPUTED[1][l1 as usize]
             | FINAL_L_PRECOMPUTED[2][l2 as usize]
             | FINAL_L_PRECOMPUTED[3][l3 as usize]
             | FINAL_R_PRECOMPUTED[0][r0 as usize]
             | FINAL_R_PRECOMPUTED[1][r1 as usize]
             | FINAL_R_PRECOMPUTED[2][r2 as usize]
             | FINAL_R_PRECOMPUTED[3][r3 as usize];
    }

    (blocks1, blocks2)
}

/// Performs full DES encryption on two 64-blocks using SIMD operations.
///
/// This is the main entry point for DES encryption. It handles the complete
/// encryption process including initial permutation, 16 rounds of DES operations,
/// and final permutation.
///
/// # Parameters
/// * `data1` - First 64-element array of u64 values representing the first input block
/// * `data2` - Second 64-element array of u64 values representing the second input block
/// * `k` - Array of round keys
/// * `expansion_table` - The expansion permutation table
///
/// # Returns
/// A tuple containing (output_blocks1, output_blocks2)
#[target_feature(enable = "simd128")]
pub unsafe fn des_25(data1: &[u64; 64], data2: &[u64; 64], k: &[[v128; 64]; 16], expansion_table: &[usize; 48])
    -> ([u64; 64], [u64; 64]) {
    unsafe {
        let (mut l, mut r) = init_lr(data1, data2);

        for _ in 0..25 {
            for round_n in 0..8 {
                des_rounds(&mut l, &mut r, &k[round_n*2], &k[round_n*2+1], expansion_table);
            }

            // Swap L and R at the end of each DES 16-round group
            (l, r) = (r, l);
        }

        // Apply final permutation
        final_permutation(&l, &r)
    }
}
