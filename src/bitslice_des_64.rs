use crate::bitslice_sboxes_64;
use crate::constants::*;

// e: expansion_table
fn des_round(l: &mut [u64; 32], r: [u64; 32], k_round: &[u64; 64], e: &[usize; 48]) -> ([u64; 32], [u64; 32]) {
    bitslice_sboxes_64::s1(k_round[0] ^ r[e[0]], k_round[1] ^ r[e[1]], k_round[2] ^ r[e[2]], 
         k_round[3] ^ r[e[3]], k_round[4] ^ r[e[4]], k_round[5] ^ r[e[5]], l);
    bitslice_sboxes_64::s2(k_round[6] ^ r[e[6]], k_round[7] ^ r[e[7]], k_round[8] ^ r[e[8]],
         k_round[9] ^ r[e[9]], k_round[10] ^ r[e[10]], k_round[11] ^ r[e[11]], l);
    bitslice_sboxes_64::s3(k_round[12] ^ r[e[12]], k_round[13] ^ r[e[13]], k_round[14] ^ r[e[14]],
         k_round[15] ^ r[e[15]], k_round[16] ^ r[e[16]], k_round[17] ^ r[e[17]], l);
    bitslice_sboxes_64::s4(k_round[18] ^ r[e[18]], k_round[19] ^ r[e[19]], k_round[20] ^ r[e[20]],
         k_round[21] ^ r[e[21]], k_round[22] ^ r[e[22]], k_round[23] ^ r[e[23]], l);
    bitslice_sboxes_64::s5(k_round[24] ^ r[e[24]], k_round[25] ^ r[e[25]], k_round[26] ^ r[e[26]],
         k_round[27] ^ r[e[27]], k_round[28] ^ r[e[28]], k_round[29] ^ r[e[29]], l);
    bitslice_sboxes_64::s6(k_round[30] ^ r[e[30]], k_round[31] ^ r[e[31]], k_round[32] ^ r[e[32]],
         k_round[33] ^ r[e[33]], k_round[34] ^ r[e[34]], k_round[35] ^ r[e[35]], l);
    bitslice_sboxes_64::s7(k_round[36] ^ r[e[36]], k_round[37] ^ r[e[37]], k_round[38] ^ r[e[38]],
         k_round[39] ^ r[e[39]], k_round[40] ^ r[e[40]], k_round[41] ^ r[e[41]], l);
    bitslice_sboxes_64::s8(k_round[42] ^ r[e[42]], k_round[43] ^ r[e[43]], k_round[44] ^ r[e[44]],
         k_round[45] ^ r[e[45]], k_round[46] ^ r[e[46]], k_round[47] ^ r[e[47]], l);

    (r, l.clone())
}

#[inline(always)]
fn get_matrix_column(m: &[u64; 32], col_i: usize) -> u64 {
    let mut col = 0u64;
    let matrix_len = 32;

    let mut i = 0;
    while i < matrix_len {
        col |= ((m[i]>>col_i)&1) << i;
        i +=1;
    }

    col
}

// the input has one block per entry
// l and r have transposed (bitsliced) values
pub fn init_lr(data: &[u64; 64]) -> ([u64; 32], [u64; 32]) {
    let mut l = [0u64; 32];
    let mut r = [0u64; 32];

    for block_i in 0..64 {
        let block = data[block_i];

        // Process left half
        for (bit_i, &src_bit) in INITIAL_PERMUTATION_L.iter().enumerate() {
            let bit_val = (block >> src_bit) & 1;
            l[bit_i] |= bit_val << block_i;
        }

        // Process right half
        for (bit_i, &src_bit) in INITIAL_PERMUTATION_R.iter().enumerate() {
            let bit_val = (block >> src_bit) & 1;
            r[bit_i] |= bit_val << block_i;
        }
    }

    (l, r)
}

// l and r have transposed values
// the output has one block per entry
fn final_permutation(l: [u64; 32], r: [u64; 32]) -> [u64; 64] {
    let mut blocks = [0u64; 64];

    for block_i in 0..64 {
        let l_col = get_matrix_column(&l, block_i);
        let r_col = get_matrix_column(&r, block_i);

        let block =
           FINAL_L_PRECOMPUTED[0][ (l_col        & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[1][((l_col >>  8) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[2][((l_col >> 16) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[3][((l_col >> 24) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[0][ (r_col        & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[1][((r_col >>  8) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[2][((r_col >> 16) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[3][((r_col >> 24) & 0xFF) as usize];

        blocks[block_i] = block;
    }

    blocks
}

pub fn des(data: &[u64; 64], k: &[[u64; 64]; 16], expansion_table: &[usize; 48]) -> [u64; 64] {
    // Apply initial permutation and separate into left and right parts
    let (mut l, mut r) = init_lr(&data);

    // Round 0 through 16
    for round_n in 0..16 {
        (l, r) = des_round(&mut l, r, &k[round_n], expansion_table);
    }
    
    // Swap L and R at the end to allow reversing
    (l, r) = (r, l);

    // Apply final permutation
    final_permutation(l, r)
}
 