#![cfg(target_arch = "wasm32")]
#![feature(stdsimd)]
use std::arch::wasm32::*;
use crate::bitslice_sboxes_64_wasm::*;
use crate::constants::*;
use crate::matrix_utils::transpose_64x64;

const fn _precompute_initial_lr_64() -> [[u64; 256]; 8] {
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
}

static INITIAL_LR_PRECOMPUTED_64: [[u64; 256]; 8] = _precompute_initial_lr_64();


// ------------------------------------------------------------------------------------------------


/// helpers: load/extract u64 <-> v128
#[target_feature(enable = "simd128")]
unsafe fn load_u64_to_v128(x: u64) -> v128 { u64x2_splat(x) }

#[target_feature(enable = "simd128")]
unsafe fn extract_v128_to_u64(x: v128) -> u64 { u64x2_extract_lane::<0>(x) }

#[target_feature(enable = "simd128")]
unsafe fn load_u64x2_to_v128(lo: u64, hi: u64) -> v128 {
    u64x2(lo, hi)
}

#[target_feature(enable = "simd128")]
unsafe fn extract_v128_lane0(x: v128) -> u64 { u64x2_extract_lane::<0>(x) }
#[target_feature(enable = "simd128")]
unsafe fn extract_v128_lane1(x: v128) -> u64 { u64x2_extract_lane::<1>(x) }

#[target_feature(enable = "simd128")]
pub unsafe fn des_round(l: &mut [v128; 32], r: &[v128; 32], k_round: &[v128; 64], exp: &[usize; 48]) {
    // For each S-box we compute k_round[j] ^ r[ exp[j] ] as v128 and call the v128 S-box.
    // Note: s?_v are expected to have signature:
    //   fn s1_v(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128;32]);
    // They should XOR their outputs into l according to INVERSE_STRAIGHT_TABLE (but in v128 form).

    // S1: indices 0..5
    s1(
        v128_xor(k_round[0], r[exp[0]]),
        v128_xor(k_round[1], r[exp[1]]),
        v128_xor(k_round[2], r[exp[2]]),
        v128_xor(k_round[3], r[exp[3]]),
        v128_xor(k_round[4], r[exp[4]]),
        v128_xor(k_round[5], r[exp[5]]),
        l,
    );

    // S2: indices 6..11
    s2(
        v128_xor(k_round[6], r[exp[6]]),
        v128_xor(k_round[7], r[exp[7]]),
        v128_xor(k_round[8], r[exp[8]]),
        v128_xor(k_round[9], r[exp[9]]),
        v128_xor(k_round[10], r[exp[10]]),
        v128_xor(k_round[11], r[exp[11]]),
        l,
    );

    // S3: 12..17
    s3(
        v128_xor(k_round[12], r[exp[12]]),
        v128_xor(k_round[13], r[exp[13]]),
        v128_xor(k_round[14], r[exp[14]]),
        v128_xor(k_round[15], r[exp[15]]),
        v128_xor(k_round[16], r[exp[16]]),
        v128_xor(k_round[17], r[exp[17]]),
        l,
    );

    // S4: 18..23
    s4(
        v128_xor(k_round[18], r[exp[18]]),
        v128_xor(k_round[19], r[exp[19]]),
        v128_xor(k_round[20], r[exp[20]]),
        v128_xor(k_round[21], r[exp[21]]),
        v128_xor(k_round[22], r[exp[22]]),
        v128_xor(k_round[23], r[exp[23]]),
        l,
    );

    // S5: 24..29
    s5(
        v128_xor(k_round[24], r[exp[24]]),
        v128_xor(k_round[25], r[exp[25]]),
        v128_xor(k_round[26], r[exp[26]]),
        v128_xor(k_round[27], r[exp[27]]),
        v128_xor(k_round[28], r[exp[28]]),
        v128_xor(k_round[29], r[exp[29]]),
        l,
    );

    // S6: 30..35
    s6(
        v128_xor(k_round[30], r[exp[30]]),
        v128_xor(k_round[31], r[exp[31]]),
        v128_xor(k_round[32], r[exp[32]]),
        v128_xor(k_round[33], r[exp[33]]),
        v128_xor(k_round[34], r[exp[34]]),
        v128_xor(k_round[35], r[exp[35]]),
        l,
    );

    // S7: 36..41
    s7(
        v128_xor(k_round[36], r[exp[36]]),
        v128_xor(k_round[37], r[exp[37]]),
        v128_xor(k_round[38], r[exp[38]]),
        v128_xor(k_round[39], r[exp[39]]),
        v128_xor(k_round[40], r[exp[40]]),
        v128_xor(k_round[41], r[exp[41]]),
        l,
    );

    // S8: 42..47
    s8(
        v128_xor(k_round[42], r[exp[42]]),
        v128_xor(k_round[43], r[exp[43]]),
        v128_xor(k_round[44], r[exp[44]]),
        v128_xor(k_round[45], r[exp[45]]),
        v128_xor(k_round[46], r[exp[46]]),
        v128_xor(k_round[47], r[exp[47]]),
        l,
    );
}
 
// the input has one block per entry
// l and r have transposed (bitsliced) values
#[target_feature(enable = "simd128")]
pub unsafe fn init_lr(data1: &[u64; 64], data2: &[u64; 64]) -> ([v128; 32], [v128; 32]) {
    let mut _data1 = [0u64; 64];
    let mut _data2 = [0u64; 64];

    for i in 0..64 {
        _data1[i] =
              INITIAL_LR_PRECOMPUTED_64[0][ (data1[i]      &0xFF) as usize]
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
        l[i] = load_u64x2_to_v128(_data1[i], _data2[i]);
        r[i] = load_u64x2_to_v128(_data1[32+i], _data2[32+i]);
    }

    (l, r)
}

// l and r have transposed values
// the output has one block per entry
#[target_feature(enable = "simd128")]
pub unsafe fn final_permutation(l: &[v128; 32], r: &[v128; 32]) -> ([u64; 64], [u64; 64]) {
    let mut data1 = [0u64; 64];
    let mut data2 = [0u64; 64];

    for i in 0..32 {
        let v_l = l[i];
        let v_r = r[i];
        data1[i]       = extract_v128_lane0(v_l);
        data1[32 + i]  = extract_v128_lane0(v_r);
        data2[i]       = extract_v128_lane1(v_l);
        data2[32 + i]  = extract_v128_lane1(v_r);
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

#[target_feature(enable = "simd128")]
pub fn des(
    data1: &[u64; 64],
    data2: &[u64; 64],
    k: &[[v128; 64]; 16],
    expansion_table: &[usize; 48]
) -> ([u64; 64], [u64; 64]) {
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
