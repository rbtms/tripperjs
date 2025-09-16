use crate::constants::*;
use crate::matrix_utils;
use crate::bitslice_64::sboxes::*;

/// Precomputes the initial L and R permutation tables for 64-bit DES.
///
/// This function initializes a lookup table that maps input bytes to their
/// permuted positions according to the INITIAL_PERMUTATION_L and INITIAL_PERMUTATION_R
/// constants. The result is used to efficiently apply the initial permutation to data blocks.
///
/// # Returns
/// A static array of 8 tables representing precomputed bit permutations
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

/// Performs two DES rounds using bitsliced operations to avoid swaps between L and R.
///
/// This function applies the standard DES round function (F-function) to the
/// right half of the data block using the given round key and expansion table.
/// The result is XORed with the left half to produce the new left half.
///
/// # Parameters
/// * `l` - Mutable reference to the left half of the data block
/// * `r` - Right half of the data block
/// * `k_round_r` - The round key data for the round depending on R
/// * `k_round_l` - The round key data for the round depending on L
/// * `exp` - Expansion table mapping 32 bits to 48 bits
#[inline(always)]
fn des_rounds(l: &mut [u64; 32], r: &mut [u64; 32], k_round_r: &[u64; 64], k_round_l: &[u64; 64], exp: &[usize; 48]) {
    s1(k_round_r[0]  ^ r[exp[0]],  k_round_r[1]  ^ r[exp[1]],  k_round_r[2]  ^ r[exp[2]],
       k_round_r[3]  ^ r[exp[3]],  k_round_r[4]  ^ r[exp[4]],  k_round_r[5]  ^ r[exp[5]],  l);
    s2(k_round_r[6]  ^ r[exp[6]],  k_round_r[7]  ^ r[exp[7]],  k_round_r[8]  ^ r[exp[8]],
       k_round_r[9]  ^ r[exp[9]],  k_round_r[10] ^ r[exp[10]], k_round_r[11] ^ r[exp[11]], l);
    s3(k_round_r[12] ^ r[exp[12]], k_round_r[13] ^ r[exp[13]], k_round_r[14] ^ r[exp[14]],
       k_round_r[15] ^ r[exp[15]], k_round_r[16] ^ r[exp[16]], k_round_r[17] ^ r[exp[17]], l);
    s4(k_round_r[18] ^ r[exp[18]], k_round_r[19] ^ r[exp[19]], k_round_r[20] ^ r[exp[20]],
       k_round_r[21] ^ r[exp[21]], k_round_r[22] ^ r[exp[22]], k_round_r[23] ^ r[exp[23]], l);
    s5(k_round_r[24] ^ r[exp[24]], k_round_r[25] ^ r[exp[25]], k_round_r[26] ^ r[exp[26]],
       k_round_r[27] ^ r[exp[27]], k_round_r[28] ^ r[exp[28]], k_round_r[29] ^ r[exp[29]], l);
    s6(k_round_r[30] ^ r[exp[30]], k_round_r[31] ^ r[exp[31]], k_round_r[32] ^ r[exp[32]],
       k_round_r[33] ^ r[exp[33]], k_round_r[34] ^ r[exp[34]], k_round_r[35] ^ r[exp[35]], l);
    s7(k_round_r[36] ^ r[exp[36]], k_round_r[37] ^ r[exp[37]], k_round_r[38] ^ r[exp[38]],
       k_round_r[39] ^ r[exp[39]], k_round_r[40] ^ r[exp[40]], k_round_r[41] ^ r[exp[41]], l);
    s8(k_round_r[42] ^ r[exp[42]], k_round_r[43] ^ r[exp[43]], k_round_r[44] ^ r[exp[44]],
       k_round_r[45] ^ r[exp[45]], k_round_r[46] ^ r[exp[46]], k_round_r[47] ^ r[exp[47]], l);

    s1(k_round_l[0]  ^ l[exp[0]],  k_round_l[1]  ^ l[exp[1]],  k_round_l[2]  ^ l[exp[2]],
       k_round_l[3]  ^ l[exp[3]],  k_round_l[4]  ^ l[exp[4]],  k_round_l[5]  ^ l[exp[5]],  r);
    s2(k_round_l[6]  ^ l[exp[6]],  k_round_l[7]  ^ l[exp[7]],  k_round_l[8]  ^ l[exp[8]],
       k_round_l[9]  ^ l[exp[9]],  k_round_l[10] ^ l[exp[10]], k_round_l[11] ^ l[exp[11]], r);
    s3(k_round_l[12] ^ l[exp[12]], k_round_l[13] ^ l[exp[13]], k_round_l[14] ^ l[exp[14]],
       k_round_l[15] ^ l[exp[15]], k_round_l[16] ^ l[exp[16]], k_round_l[17] ^ l[exp[17]], r);
    s4(k_round_l[18] ^ l[exp[18]], k_round_l[19] ^ l[exp[19]], k_round_l[20] ^ l[exp[20]],
       k_round_l[21] ^ l[exp[21]], k_round_l[22] ^ l[exp[22]], k_round_l[23] ^ l[exp[23]], r);
    s5(k_round_l[24] ^ l[exp[24]], k_round_l[25] ^ l[exp[25]], k_round_l[26] ^ l[exp[26]],
       k_round_l[27] ^ l[exp[27]], k_round_l[28] ^ l[exp[28]], k_round_l[29] ^ l[exp[29]], r);
    s6(k_round_l[30] ^ l[exp[30]], k_round_l[31] ^ l[exp[31]], k_round_l[32] ^ l[exp[32]],
       k_round_l[33] ^ l[exp[33]], k_round_l[34] ^ l[exp[34]], k_round_l[35] ^ l[exp[35]], r);
    s7(k_round_l[36] ^ l[exp[36]], k_round_l[37] ^ l[exp[37]], k_round_l[38] ^ l[exp[38]],
       k_round_l[39] ^ l[exp[39]], k_round_l[40] ^ l[exp[40]], k_round_l[41] ^ l[exp[41]], r);
    s8(k_round_l[42] ^ l[exp[42]], k_round_l[43] ^ l[exp[43]], k_round_l[44] ^ l[exp[44]],
       k_round_l[45] ^ l[exp[45]], k_round_l[46] ^ l[exp[46]], k_round_l[47] ^ l[exp[47]], r);
}

/// Initializes the left and right halves of the DES block from input data.
///
/// This function applies the initial permutation to the input data blocks
/// and separates them into left and right halves. The output data is
/// in a transposed format (bitsliced), where each entry represents
/// one bit position across all blocks.
///
/// # Parameters
/// * `data` - Input data blocks
///
/// # Returns
/// A tuple containing the left and right halves of the permuted data
#[inline(always)]
pub fn init_lr(data: &[u64; 64]) -> ([u64; 32], [u64; 32]) {
    let mut _data = [0u64; 64];

    for (i, block) in data.iter().enumerate() {
        _data[i] =
          INITIAL_LR_PRECOMPUTED_64[0][ (block     &0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[1][((block>> 8)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[2][((block>>16)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[3][((block>>24)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[4][((block>>32)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[5][((block>>40)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[6][((block>>48)&0xFF) as usize]
        | INITIAL_LR_PRECOMPUTED_64[7][((block>>56)&0xFF) as usize];
    }

    matrix_utils::transpose_64x64(&mut _data);

    // L / R
    ( _data[0..32].try_into().unwrap(),  _data[32..64].try_into().unwrap() )
}

/// Applies the final permutation to the DES output.
///
/// This function reverses the initial permutation by applying the final
/// permutation table. It combines the left and right halves, transposes
/// the result, and applies precomputed lookup tables to produce the final
/// permuted output blocks.
///
/// # Parameters
/// * `l` - Left half of the data
/// * `r` - Right half of the data
///
/// # Returns
/// The final permuted data
#[inline(always)]
fn final_permutation(l: &[u64; 32], r: &[u64; 32]) -> [u64; 64] {
    let mut blocks = [0u64; 64];

    // Concatenate L and R
    let mut data: [u64; 64] = [0u64; 64];
    data[..32].copy_from_slice(l);
    data[32..].copy_from_slice(r);

    // Transpose the bitsliced result
    matrix_utils::transpose_64x64(&mut data);

    for block_i in 0..64 {
        let l_col = data[block_i]&0xFFFFFFFF;
        let r_col = data[block_i]>>32;

        blocks[block_i] =
           FINAL_L_PRECOMPUTED[0][ (l_col        & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[1][((l_col >>  8) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[2][((l_col >> 16) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[3][((l_col >> 24) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[0][ (r_col        & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[1][((r_col >>  8) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[2][((r_col >> 16) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[3][((r_col >> 24) & 0xFF) as usize];
    }

    blocks
}

/// Performs the complete DES encryption on input data using the specified keys.
///
/// This is the main function that executes a full DES encryption process,
/// including initial permutation, 16 rounds of DES operations, and final
/// permutation. The input data and key are expected to be in bitsliced format.
///
/// # Parameters
/// * `data` - Input data blocks in transposed format
/// * `k` - Round keys for all 16 DES rounds
/// * `expansion_table` - Expansion table mapping 32 bits to 48 bits (48 usize values)
///
/// # Returns
/// The encrypted data as 64 u64 blocks in transposed format
pub fn des(data: &[u64; 64], k: &[[u64; 64]; 16], expansion_table: &[usize; 48]) -> [u64; 64] {
    // Apply initial permutation and separate into left and right parts
    let (mut l, mut r) = init_lr(&data);

    // Round 0 through 16
    for round_n in 0..8 {
        des_rounds(&mut l, &mut r, &k[round_n*2], &k[round_n*2+1], expansion_table);
    }

    // Apply final permutation swapping L and R at the end
    final_permutation(&r, &l)
}
