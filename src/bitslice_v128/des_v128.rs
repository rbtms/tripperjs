#![cfg(target_arch = "wasm32")]
#![feature(stdsimd)]
use std::arch::wasm32::*;
use crate::constants::*;
use crate::matrix_utils::transpose_64x64;
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
            let mask = (((b >> bit_index) & 1) << i) as u64;
            tables[byte_index as usize][b as usize] |= mask;
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
            let mask = (((b >> bit_index) & 1) << i) as u64;
            tables[byte_index as usize][b as usize] |= mask << 32;
            b += 1;
        }

        i += 1;
    }

    tables
};

// ------------------------------------------------------------------------------------------------

/// Performs a single DES round using SIMD operations.
///
/// This function computes one round of the DES encryption algorithm using vectorized operations.
/// It applies S-box substitutions to the expanded right half XORed with the round key,
/// and XORs the result into the left half according to the inverse straight permutation.
///
/// # Parameters
/// * `l` - Mutable reference to the left half bitsliced data
/// * `r` - Reference to the right half bitsliced data
/// * `k_round` - The round key data
/// * `exp` - The expansion permutation table
#[target_feature(enable = "simd128")]
pub unsafe fn des_round(l: &mut [v128; 32], r: &[v128; 32], k_round: &[v128; 64], exp: &[usize; 48]) {
    s1( v128_xor(k_round[0], r[exp[0]]),  v128_xor(k_round[1], r[exp[1]]),
        v128_xor(k_round[2], r[exp[2]]),  v128_xor(k_round[3], r[exp[3]]),
        v128_xor(k_round[4], r[exp[4]]),  v128_xor(k_round[5], r[exp[5]]),
        l
    );

    s2( v128_xor(k_round[6], r[exp[6]]),  v128_xor(k_round[7],  r[exp[7]]),
        v128_xor(k_round[8], r[exp[8]]),  v128_xor(k_round[9],  r[exp[9]]),
        v128_xor(k_round[10], r[exp[10]]),v128_xor(k_round[11], r[exp[11]]),
        l
    );

    s3( v128_xor(k_round[12], r[exp[12]]), v128_xor(k_round[13], r[exp[13]]),
        v128_xor(k_round[14], r[exp[14]]), v128_xor(k_round[15], r[exp[15]]),
        v128_xor(k_round[16], r[exp[16]]), v128_xor(k_round[17], r[exp[17]]),
        l
    );

    s4( v128_xor(k_round[18], r[exp[18]]), v128_xor(k_round[19], r[exp[19]]),
        v128_xor(k_round[20], r[exp[20]]), v128_xor(k_round[21], r[exp[21]]),
        v128_xor(k_round[22], r[exp[22]]), v128_xor(k_round[23], r[exp[23]]),
        l
    );

    s5( v128_xor(k_round[24], r[exp[24]]), v128_xor(k_round[25], r[exp[25]]),
        v128_xor(k_round[26], r[exp[26]]), v128_xor(k_round[27], r[exp[27]]),
        v128_xor(k_round[28], r[exp[28]]), v128_xor(k_round[29], r[exp[29]]),
        l
    );

    s6( v128_xor(k_round[30], r[exp[30]]), v128_xor(k_round[31], r[exp[31]]),
        v128_xor(k_round[32], r[exp[32]]), v128_xor(k_round[33], r[exp[33]]),
        v128_xor(k_round[34], r[exp[34]]), v128_xor(k_round[35], r[exp[35]]),
        l
    );

    s7( v128_xor(k_round[36], r[exp[36]]), v128_xor(k_round[37], r[exp[37]]),
        v128_xor(k_round[38], r[exp[38]]), v128_xor(k_round[39], r[exp[39]]),
        v128_xor(k_round[40], r[exp[40]]), v128_xor(k_round[41], r[exp[41]]),
        l
    );

    s8( v128_xor(k_round[42], r[exp[42]]), v128_xor(k_round[43], r[exp[43]]),
        v128_xor(k_round[44], r[exp[44]]), v128_xor(k_round[45], r[exp[45]]),
        v128_xor(k_round[46], r[exp[46]]), v128_xor(k_round[47], r[exp[47]]),
        l
    );
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
        _data1[i] =
              INITIAL_LR_PRECOMPUTED_64[0][ (data1[i]     &0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[1][((data1[i]>> 8)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[2][((data1[i]>>16)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[3][((data1[i]>>24)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[4][((data1[i]>>32)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[5][((data1[i]>>40)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[6][((data1[i]>>48)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[7][((data1[i]>>56)&0xFF) as usize];

        _data2[i] =
              INITIAL_LR_PRECOMPUTED_64[0][ (data2[i]      &0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[1][((data2[i]>> 8)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[2][((data2[i]>>16)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[3][((data2[i]>>24)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[4][((data2[i]>>32)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[5][((data2[i]>>40)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[6][((data2[i]>>48)&0xFF) as usize]
            | INITIAL_LR_PRECOMPUTED_64[7][((data2[i]>>56)&0xFF) as usize];
    }

    transpose_64x64(&mut _data1);
    transpose_64x64(&mut _data2);

    let mut l: [v128; 32] = [u64x2_splat(0); 32];
    let mut r: [v128; 32] = [u64x2_splat(0); 32];

    for i in 0..32 {
        l[i] = v128_utils::load_u64x2_to_v128(_data1[i], _data2[i]);
        r[i] = v128_utils::load_u64x2_to_v128(_data1[32+i], _data2[32+i]);
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
pub unsafe fn final_permutation(l: &[v128; 32], r: &[v128; 32]) -> ([u64; 64], [u64; 64]) {
    let mut data1 = [0u64; 64];
    let mut data2 = [0u64; 64];

    for i in 0..32 {
        let v_l = l[i];
        let v_r = r[i];
        data1[i]       = v128_utils::extract_v128_lane0(v_l);
        data1[32 + i]  = v128_utils::extract_v128_lane0(v_r);
        data2[i]       = v128_utils::extract_v128_lane1(v_l);
        data2[32 + i]  = v128_utils::extract_v128_lane1(v_r);
    }

    transpose_64x64(&mut data1);
    transpose_64x64(&mut data2);

    let mut blocks1 = [0u64; 64];
    let mut blocks2 = [0u64; 64];

    for block_i in 0..64 {
        let l_col1 = data1[block_i] & 0xFFFFFFFF;
        let r_col1 = data1[block_i] >> 32;
        blocks1[block_i] =
               FINAL_L_PRECOMPUTED[0][ (l_col1        & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[1][((l_col1 >>  8) & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[2][((l_col1 >> 16) & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[3][((l_col1 >> 24) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[0][ (r_col1        & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[1][((r_col1 >>  8) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[2][((r_col1 >> 16) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[3][((r_col1 >> 24) & 0xFF) as usize];

        let l_col2 = data2[block_i] & 0xFFFFFFFF;
        let r_col2 = data2[block_i] >> 32;
        blocks2[block_i] =
               FINAL_L_PRECOMPUTED[0][ (l_col2        & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[1][((l_col2 >>  8) & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[2][((l_col2 >> 16) & 0xFF) as usize]
             | FINAL_L_PRECOMPUTED[3][((l_col2 >> 24) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[0][ (r_col2        & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[1][((r_col2 >>  8) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[2][((r_col2 >> 16) & 0xFF) as usize]
             | FINAL_R_PRECOMPUTED[3][((r_col2 >> 24) & 0xFF) as usize];
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
pub fn des(data1: &[u64; 64], data2: &[u64; 64], k: &[[v128; 64]; 16], expansion_table: &[usize; 48])
    -> ([u64; 64], [u64; 64]) {
    unsafe {
        let (mut l, mut r) = init_lr(data1, data2);

        for round_n in 0..16 {
            des_round(&mut l, &r, &k[round_n], expansion_table);
            (l, r) = (r, l);
        }

        (l, r) = (r, l);

        final_permutation(&l, &r)
    }
}

/// Converts standard DES keys into v128 vectors for SIMD processing.
///
/// This function takes two arrays of round keys (one for each block array) and packs
/// them into v128 vectors where the first key is in lane 0 and second key is in lane 1.
///
/// # Parameters
/// * `keys1` - Array of 16 round keys, each containing 64 u64 values
/// * `keys2` - Array of 16 round keys, each containing 64 u64 values
///
/// # Returns
/// A vectorized array with the keys
pub fn keys_to_v128(keys1: &[[u64; 64]; 16], keys2: &[[u64; 64]; 16]) -> [[v128; 64]; 16] {
    let mut keys_v128: [[v128; 64]; 16] = [[unsafe { i64x2(0, 0) }; 64]; 16];

    unsafe {
        for round in 0..16 {
            for i in 0..64 {
                // Pack keys1[round][i] into lane 0 and keys2[round][i] into lane 1
                keys_v128[round][i] = i64x2(keys1[round][i] as i64, keys2[round][i] as i64);
            }
        }
    }

    keys_v128
}
