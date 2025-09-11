use std::sync::{OnceLock};
use std::collections::HashMap;
use crate::constants::*;
use crate::bitslice_sboxes;

/*************************************
* Left side Initial permutation (IP) and
* Right side of Initial permutation
* Derived from:
*
* Initial permutation (IP):
*
* var initial_table = [
*     57, 49, 41, 33, 25, 17,  9, 1,
*     59, 51, 43, 35, 27, 19, 11, 3,
*     61, 53, 45, 37, 29, 21, 13, 5,
*     63, 55, 47, 39, 31, 23, 15, 7,
*     56, 48, 40, 32, 24, 16,  8, 0,
*     58, 50, 42, 34, 26, 18, 10, 2,
*     60, 52, 44, 36, 28, 20, 12, 4,
*     62, 54, 46, 38, 30, 22, 14, 6
* ];
*************************************/
const INITIAL_TABLE_L: [usize; 32] = [
    57, 49, 41, 33, 25, 17,  9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
];
const INITIAL_TABLE_R: [usize; 32] = [
    56, 48, 40, 32, 24, 16,  8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6
];

/***************************
* Final permutation (IP-1)
***************************/
// static FINAL_TABLE: [u8; 64] = [
//     39, 7, 47, 15, 55, 23, 63, 31,
//     38, 6, 46, 14, 54, 22, 62, 30,
//     37, 5, 45, 13, 53, 21, 61, 29,
//     36, 4, 44, 12, 52, 20, 60, 28,
//     35, 3, 43, 11, 51, 19, 59, 27,
//     34, 2, 42, 10, 50, 18, 58, 26,
//     33, 1, 41,  9, 49, 17, 57, 25,
//     32, 0, 40,  8, 48, 16, 56, 24
// ];

/***********************************************
* Expansion table (E) used in the DES function
* to expand R from 32 bits to 48
***********************************************/
static EXPANSION_TABLE: [usize; 48] =  [
    31,  0,  1,  2,  3,  4,
    3,   4,  5,  6,  7,  8,
    7,   8,  9, 10, 11, 12,
    11, 12, 13, 14, 15, 16,
    15, 16, 17, 18, 19, 20,
    19, 20, 21, 22, 23, 24,
    23, 24, 25, 26, 27, 28,
    27, 28, 29, 30, 31,  0
];

/****************************************************
* Inverse table of straight_table for speed reasons
* Derived from:
*
* Permutation table applied to s_box results:
*
* straight_table = [
*   15,  6, 19, 20, 28, 11, 27, 16,
*    0, 14, 22, 25,  4, 17, 30,  9,
*    1,  7, 23, 13, 31, 26,  2,  8,
*   18, 12, 29,  5, 21, 10,  3, 24
* ];
****************************************************/
static INVERSE_STRAIGHT_TABLE: [usize; 32] = [
     8, 16, 22, 30, 12, 27,  1, 17,
    23, 15, 29,  5, 25, 19,  9,  0,
     7, 13, 24,  2,  3, 28, 10, 18,
    31, 11, 21,  6,  4, 26, 14, 20
];

/******************************************
* S-Box tables, the core of the algorithm
******************************************/
static S_BOX_TABLE: [usize; 512] = [
    /**** s-box 0 ****/
    14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
     0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
     4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
    15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13,
    
    /**** s-box 1 *****/
    15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
     3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
     0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
    13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9,

    /**** s-box 2 ****/
    10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
    13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
    13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
     1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12,
    
    /**** s-box 3 ****/
     7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
    13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
    10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
     3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14,
    
    /**** s-box 4 ****/
     2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
    14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
     4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
    11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3,
    
    /**** s-box 5 ****/
    12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
    10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
     9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
     4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13,
    
    /**** s-box 6 ****/
     4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
    13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
     1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
     6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12,
    
    /**** s-box 7 ****/
    13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
     1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
     7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
     2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11
];

const fn precompute_initial_l_r(l_r: [usize; 32]) -> [[u32; 256]; 8] {
    let mut tables = [[0u32; 256]; 8];

    let mut i = 0;
    while i < 32 {
        let initial_val = l_r[i];
        let byte_index = initial_val / 8;
        let bit_index  = (initial_val % 8) as u64;

        let mut b = 0;
        while b < 256u64 {
            let mask = (((b >> bit_index) & 1) << i) as u32;
            tables[byte_index as usize][b as usize] |= mask;
            b += 1;
        }

        i += 1;
    }

    tables
}

static INITIAL_L_PRECOMPUTED: [[u32; 256]; 8] = precompute_initial_l_r(INITIAL_TABLE_L);
static INITIAL_R_PRECOMPUTED: [[u32; 256]; 8] = precompute_initial_l_r(INITIAL_TABLE_R);

const fn precompute_final_l_r(l_r: [usize; 32]) -> [[u64; 256]; 4] {
    let mut tables = [[0u64; 256]; 4];

    let mut byte_index = 0;
    while byte_index < 4 {
        let mut b = 0;
        while b < 256 {
            let mut val = 0u64;
            let mut bit = 0;
            while bit < 8 {
                let bit_pos = byte_index * 8 + bit;
                let out_pos = l_r[bit_pos];
                if (b >> bit) & 1 == 1 {
                    val |= 1u64 << out_pos;
                }
                bit += 1;
            }
            tables[byte_index][b as usize] = val;
            b += 1;
        }
        byte_index += 1;
    }

    tables
}

static FINAL_L_PRECOMPUTED: [[u64; 256]; 4] = precompute_final_l_r(INITIAL_TABLE_L);
static FINAL_R_PRECOMPUTED: [[u64; 256]; 4] = precompute_final_l_r(INITIAL_TABLE_R);

static S_FUNCTIONS: [fn(u64, u64, u64, u64, u64, u64) -> (u64, u64, u64, u64); 8]  = [
    bitslice_sboxes::s1, bitslice_sboxes::s2, bitslice_sboxes::s3, bitslice_sboxes::s4,
    bitslice_sboxes::s5, bitslice_sboxes::s6, bitslice_sboxes::s7, bitslice_sboxes::s8,
];

/* --------------------------------------------------------- Constants end ------------------------------------------------------ */

pub fn perturb_expansion(salt: &str) -> [usize; 48] {
    let salt_bytes = salt.as_bytes();
    let mut expansion_table = EXPANSION_TABLE.clone();

    for n in 0..2 {
        let mut c = salt_bytes[n];
        let row = 6*n;

        if c > CHAR_CODE_Z { c -= 6; }
        if c > CHAR_CODE_9 { c -= 7; }
        c -= CHAR_CODE_DOT;
        
        for m in 0..6 {
            /********************************************
            * Right shift through the first 6 bits of c
            * and perturb the expansion_table if it's 1
            ********************************************/
            if ((c >> m) & 1) == 1 {
                let a = row + m;
                let b = row + m + 24;
                
                (expansion_table[a], expansion_table[b]) =
                (expansion_table[b], expansion_table[a]);
            }
        }
    }

    expansion_table
}

fn generate_r_expanded_tables(salt: &str) -> [[u64; 256]; 4] {
    // Use salt to perturb the expansion table
    let expansion_table = perturb_expansion(salt);

    let mut table0_8   = [0u64; 256];
    let mut table8_16  = [0u64; 256];
    let mut table16_24 = [0u64; 256];
    let mut table24_32 = [0u64; 256];

    for (i, &n) in expansion_table.iter().enumerate() {            
        let local_bit = n%8;
        let mask = 1u64 << i;

        match n/8 {
            0 => for r in 0..256u64 {
                // if ((r >> local_bit) & 1) { apply mask }
                table0_8[r as usize] |= mask & ((r >> local_bit) & 1)<<i;
            },
            1 => for r in 0..256u64 {
                table8_16[r as usize]  |= mask & ((r >> local_bit) & 1)<<i;
            },
            2 => for r in 0..256u64 {
                table16_24[r as usize] |= mask & ((r >> local_bit) & 1)<<i;
            },
            3 => for r in 0..256u64 {
                table24_32[r as usize] |= mask & ((r >> local_bit) & 1)<<i;
            },
            _ => {}
        }
    }

    [ table0_8, table8_16, table16_24, table24_32 ]
}

static R_EXPANDED_CACHE: OnceLock<std::sync::Mutex<HashMap<[u8; 2], [[u64; 256]; 4]>>> = OnceLock::new();
pub fn generate_r_expanded_tables_cached(salt: &str) -> [[u64; 256]; 4] {
    // Initialize the global cache once
    let cache = R_EXPANDED_CACHE.get_or_init(|| std::sync::Mutex::new(HashMap::new()));
    let key = [salt.as_bytes()[0], salt.as_bytes()[1]];
    
    // Check the cache
    { let map = cache.lock().unwrap();
      if let Some(tables) = map.get(&key) {
          return *tables;
      }
    }

    // Not in cache
    let tables = generate_r_expanded_tables(salt);

    // Insert into cache
    { let mut map = cache.lock().unwrap();
      map.insert(key, tables);
    }

    tables
}

pub fn to_binary_array(pwd: &str) -> u64 {
    let mut pwd_bin = 0u64;

    if pwd.len() < 8 {
        panic!("Password must have at least 8 bytes");
    }

    for (n, &c) in pwd.as_bytes().iter().take(8).enumerate() {
        let offset = n*8;
        
        for m in 0..7 {
            pwd_bin |= (( (c as u64) >> (6-m) ) & 1) << (offset + m);
        }
    }

    pwd_bin
}

fn des_round(l: [u64; 32], r: [u64; 32], k_round: &[u64; 64], expansion_table: &[usize; 48]) -> ([u64; 32], [u64; 32]) {
    let mut r_expanded = [0u64; 48];
    let mut k_xor_r = [0u64; 48];
    
    for i in 0..48 {
        let src_bit = expansion_table[i]; // 0..31
        r_expanded[i] = r[src_bit];
        k_xor_r[i] = k_round[i] ^ r_expanded[i];
    }

    let mut f = [0u64; 32];
    for sbox_n in 0..8 {
        let shift = sbox_n * 6;

        let a1 = k_xor_r[shift + 0];
        let a2 = k_xor_r[shift + 1];
        let a3 = k_xor_r[shift + 2];
        let a4 = k_xor_r[shift + 3];
        let a5 = k_xor_r[shift + 4];
        let a6 = k_xor_r[shift + 5];

        let (o1, o2, o3, o4) = S_FUNCTIONS[sbox_n](a1, a2, a3, a4, a5, a6);

        // Map S-box outputs through straight permutation (indices are 0..31)
        f[INVERSE_STRAIGHT_TABLE[sbox_n*4 + 0]] = o1;
        f[INVERSE_STRAIGHT_TABLE[sbox_n*4 + 1]] = o2;
        f[INVERSE_STRAIGHT_TABLE[sbox_n*4 + 2]] = o3;
        f[INVERSE_STRAIGHT_TABLE[sbox_n*4 + 3]] = o4;
    }

    let mut new_r = [0u64; 32];
    for i in 0..32 {
        new_r[i] = l[i] ^ f[i];
    }

    (r, new_r)
}

 fn get_matrix_column<const ROWS: usize>(m: &[u64; ROWS], col_i: usize) -> u64 {
    let mut col = 0u64;

    let mut i = 0;
    while i < m.len() {
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
        let block0  = ( block      &0xFF) as usize;
        let block8  = ((block>> 8) &0xFF) as usize;
        let block16 = ((block>> 16)&0xFF) as usize;
        let block24 = ((block>> 24)&0xFF) as usize;
        let block32 = ((block>> 32)&0xFF) as usize;
        let block40 = ((block>> 40)&0xFF) as usize;
        let block48 = ((block>> 48)&0xFF) as usize;
        let block56 = ((block>> 56)&0xFF) as usize;

        let l_block =
              INITIAL_L_PRECOMPUTED[0][block0]
            | INITIAL_L_PRECOMPUTED[1][block8]
            | INITIAL_L_PRECOMPUTED[2][block16]
            | INITIAL_L_PRECOMPUTED[3][block24]
            | INITIAL_L_PRECOMPUTED[4][block32]
            | INITIAL_L_PRECOMPUTED[5][block40]
            | INITIAL_L_PRECOMPUTED[6][block48]
            | INITIAL_L_PRECOMPUTED[7][block56];

        let r_block =
              INITIAL_R_PRECOMPUTED[0][block0]
            | INITIAL_R_PRECOMPUTED[1][block8]
            | INITIAL_R_PRECOMPUTED[2][block16]
            | INITIAL_R_PRECOMPUTED[3][block24]
            | INITIAL_R_PRECOMPUTED[4][block32]
            | INITIAL_R_PRECOMPUTED[5][block40]
            | INITIAL_R_PRECOMPUTED[6][block48]
            | INITIAL_R_PRECOMPUTED[7][block56];

        for bit_i in 0..32 {
            let bit_mask = 1u64 << bit_i;
            l[bit_i] |= (l_block as u64 & bit_mask) >> bit_i << block_i;
            r[bit_i] |= (r_block as u64 & bit_mask) >> bit_i << block_i;
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

pub fn des(data: [u64; 64], k: &[[u64; 64]; 16], r_expanded_precomputed: &[[u64; 256]; 4], expansion_table: &[usize; 48]) -> [u64; 64] {
    /*******************************************************************
    * Apply initial permutation and separate into left and right parts
    * (both 32 bits long)
    *******************************************************************/
    let (mut l, mut r) = init_lr(&data);

    /*********************
    * Round 0 through 16
    *********************/
    for round_n in 0..16 {
        (l, r) = des_round(l, r, &k[round_n], expansion_table);
    }
    
    // Swap L and R at the end to allow reversing
    (l, r) = (r, l);

    // Apply final permutation
    final_permutation(l, r)
}
 