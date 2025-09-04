use wasm_bindgen::prelude::*;
use rand::{distributions::Alphanumeric, Rng};
use std::sync::{OnceLock};
use std::collections::HashMap;

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

/*************************************************
* Parity drop table used to contract the key
* from 64 bits to 56 and to permutate the result
*************************************************/
static PARITY_DROP_TABLE: [usize; 56] = [
    56, 48, 40, 32, 24, 16,  8,  0,
    57, 49, 41, 33, 25, 17,  9,  1,
    58, 50, 42, 34, 26, 18, 10,  2,
    59, 51, 43, 35, 62, 54, 46, 38,
    30, 22, 14,  6, 61, 53, 45, 37,
    29, 21, 13,  5, 60, 52, 44, 36,
    28, 20, 12,  4, 27, 19, 11,  3
];


/************************************************
* Compression table used to contract round keys
* from 56 bits to 48 bits
************************************************/
static COMPRESSION_TABLE: [usize; 48] = [
    13, 16, 10, 23,  0,  4,  2, 27,
    14,  5, 20,  9, 22, 18, 11,  3,
    25,  7, 15,  6, 26, 19, 12,  1,
    40, 51, 30, 36, 46, 54, 29, 39,
    50, 44, 32, 47, 43, 48, 38, 55,
    33, 52, 45, 41, 49, 35, 28, 31
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

static S_VAL: [u32; 64*8] = {
    let mut s_val = [0u32; 64*8];
    let mut m = 0;
    while m < 8 {
        let mut i = 0;
        while i < 64 {
            let x = i as u64;
            let row = ((x>>5)&1) | ((x&1)<<1);
            let col = ((x>>4)&1) | (((x>>3)&1)<<1) | (x&0b100) | (((x>>1)&1)<<3);

            let dec = S_BOX_TABLE[m*64 + (row as usize)*16 + col as usize];
            let pos = m*4;
            let mod_val = ((dec>>3)&1) << (INVERSE_STRAIGHT_TABLE[pos] as u32)
                | ((dec>>2)&1) << (INVERSE_STRAIGHT_TABLE[pos+1] as u32)
                | ((dec>>1)&1) << (INVERSE_STRAIGHT_TABLE[pos+2] as u32)
                | (dec&1)      << (INVERSE_STRAIGHT_TABLE[pos+3] as u32);


            s_val[m*64+i] = mod_val as u32;
            i += 1;
        }
        m += 1;
    }

    s_val
};


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

/********************************************************************
* Number of left shifts to apply in each round key generation round
* and precalculated offset for speed reasons
*
* From
*   static SHIFT_TABLE: [usize; 16] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
*
********************************************************************/
static SHIFT_OFFSET: [usize; 16] = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

// Magic numbers
const CHAR_CODE_Z: u8   = 90;
const CHAR_CODE_9: u8   = 57;
const CHAR_CODE_DOT: u8 = 46;

/******************************************************************************
*   Precomputation of the indexes used for round keys calculation.
*
*        /****************************************************
*        * Circular left shift (1, 2, 9, 16: 1; rest: 2)
*        *
*        * As it is very costly to shift arrays physically,
*        * a logical left shift is done in it place, with an
*        * offset representing the 0 index of the left and
*        * right arrays.
*        ****************************************************/
*        let offset = SHIFT_OFFSET[n];
*        
*        /************************************************
*        * Apply compression permutation
*        * Originally this loop checked if the value
*        * in the compression table was lower than 28.   
*        * Since they turn >=28 after a given index (23),
*        * I decided to optimize it by chunks.
*        ************************************************/
*        for m in 0..24 { // value < 28
*            let value = COMPRESSION_TABLE[m];
*            let index = (offset+value%28);
*        }
*
*        for m in 24..48 { // value >= 28
*            let value = COMPRESSION_TABLE[m];
*            let index = (offset+value%28) + 28;
*        }
*******************************************************************************/
static PARITY_DROP_INDEXES: [usize; 16*48] = {
    let mut indexes = [0usize; 16*48];
    let mut n = 0;
    while n < 16 {
        let mut m = 0;
        while m < 24 { // value < 28
            indexes[48*n+m] = (SHIFT_OFFSET[n] + COMPRESSION_TABLE[m])%28;
            m += 1;
        }

        while m < 48 { // value < 28
            indexes[48*n+m] = (SHIFT_OFFSET[n] + COMPRESSION_TABLE[m])%28 + 28;
            m += 1;
        }
        n += 1;
    }
    indexes
};

fn generate_round_keys(key: u64) -> [u64; 16]{
    let mut parity_drop_key = [0u64;56];
    let mut K = [0u64; 16];

    /*******************************
    * Apply parity drop permutation
    ********************************/
    for n in 0..56 {
        parity_drop_key[n] = ((key >> PARITY_DROP_TABLE[n])&1) as u64;
    }

    /**********************
    * Generate round keys
    **********************/
    for n in 0..16 {
        /*******************************************************
        * Apply circular left shift and compression permutation
        *******************************************************/
        for m in 0..48 {
            K[n] |= parity_drop_key[PARITY_DROP_INDEXES[48*n+m]] << m;
        }
    }

    K
}

fn cipher(data: &mut [u8; 64], K: &[u64; 16], r_expanded_precomputed: &[[u64; 256]; 4]) {
    /*******************************************************************
    * Apply initial permutation and separate into left and right parts
    * (both 32 bits long)
    *******************************************************************/
    let mut L = 0u32;
    let mut R = 0u32;

    let mut _data = 0u64;
    for i in 0..64 {
        _data |= (data[i] as u64) << i;
    }

    L = INITIAL_L_PRECOMPUTED[0][(_data&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[1][((_data>>8)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[2][((_data>>16)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[3][((_data>>24)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[4][((_data>>32)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[5][((_data>>40)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[6][((_data>>48)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[7][((_data>>56)&0xFF) as usize];

    R = INITIAL_R_PRECOMPUTED[0][(_data&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[1][((_data>>8)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[2][((_data>>16)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[3][((_data>>24)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[4][((_data>>32)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[5][((_data>>40)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[6][((_data>>48)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[7][((_data>>56)&0xFF) as usize];

    /*********************
    * Round 0 through 16
    *********************/
    for round_n in 0..16 {
        let k = K[round_n];

        let r_expanded = r_expanded_precomputed[0][(R&0xFF) as usize]
            | r_expanded_precomputed[1][((R>>8)&0xFF) as usize]
            | r_expanded_precomputed[2][((R>>16)&0xFF) as usize]
            | r_expanded_precomputed[3][((R>>24)&0xFF) as usize];
        
        /***************************
        * Apply S-Box permutations
        ***************************/
        for m in 0..8 {
            /*****************************************************************************
            * Convert from binary to decimal every six bits
            *
            * shortcut for:
            *
            *   Get the result of xor k with expanded R:
            *       for(m = 0; m < 48; m++) { des_R[m] ^ R[expansion_table[m]] }
            *
            *       shortcut for:
            *           for(n = 0; n < 48; n++) { des_R[n]  = R[expansion_table[n]-1]; }
            *           for(n = 0; n < 48; n++) { des_R[n] ^= k[n]; }
            *
            *   Convert binary to dec in order to search inside s_box_table:
            *      row/pos = (des_R[pos]) << (n + des_R[pos+m])...
            *
            ******************************************************************************/
            let pos = m*6;
            let s_offset = ((k^r_expanded)>>pos)&0x3F;

            /***************************************************************
            * Convert dec to bin,
            * apply straight inverse permutation and then xor to L with it
            *
            * shortcut for:
            * for(n = 0; n < 32; n++) { L ^= S_output[straight_table[n]]; }
            *
            ****************************************************************/
            L ^= S_VAL[m*64 + s_offset as usize];
        }        
        
        // Swap L and R
        std::mem::swap(&mut L, &mut R);
    }

    // Swap L and R at the end to allow reversing
    std::mem::swap(&mut L, &mut R);

    /**************************************************
    * Apply final permutation using the initial tables
    ***************************************************/
    for n in 0..32 {
        data[INITIAL_TABLE_L[n]] = ((L>>n) as u8)&1;
        data[INITIAL_TABLE_R[n]] = ((R>>n) as u8)&1;
    }
}

fn perturb_expansion(salt: &str) -> [usize; 48] {
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

fn to_binary_array(pwd: &str) -> u64 {
    let mut pwd_bin = 0u64;

    for (n, &c) in pwd.as_bytes().iter().enumerate() {
        let row = n*8;
        for m in 0..7 {
            pwd_bin |= (( (c as u64) >> (6-m) ) & 1) << (row + m);
        }
    }

    pwd_bin
}

fn format_digest(data: &[u8; 64], salt: &str) -> String {
    // Set the two first characters of the digest to the salt
    let mut digest = String::from(&salt[0..2]);

    for n in 0..11 {
        let row = 6*n;
        let mut c = 0;
        
        for m in 0..6 {
            c <<= 1;
            c |= if row + m >= 64 {0} else {data[row + m]};
        }

        c += CHAR_CODE_DOT;
        if c > CHAR_CODE_9 { c += 7; }
        if c > CHAR_CODE_Z { c += 6; }

        digest.push(c as char);
    }
        
    digest
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
fn generate_r_expanded_tables_cached(salt: &str) -> [[u64; 256]; 4] {
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

#[allow(static_mut_refs)]
#[wasm_bindgen]
pub fn crypt3(pwd: &str, salt: &str) -> String {
    // Keep only the first 2 characters
    let salt = &salt[0..2];
    let mut data = [0u8; 64];
    let pwd_bin = to_binary_array(pwd);
    let K = generate_round_keys(pwd_bin);
    let r_expanded_precomputed = generate_r_expanded_tables_cached(salt);

    // Crypt(3) calls 3DES 25 times
    for _ in 0..25 {
        cipher(&mut data, &K, &r_expanded_precomputed);
    }
    
    format_digest(&data, salt)
}

/*
    TODO
    Adding here because I'm not sure if wasm modules can import
    other wasm modules.
*/
#[wasm_bindgen]
pub fn rand_pwd() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(8)
        .map(char::from)
        .collect()
}

#[wasm_bindgen]
pub fn get_salt(key: &str) -> String {
    // Step 1: append "H."
    let extended = format!("{}H.", key);

    // Step 2: take substring from index 1, length 2 (in bytes, safe for ASCII tripcode inputs)
    let slice: String = extended.chars().skip(1).take(2).collect();

    // Step 3: apply replacements
    let mut result = String::new();
    for c in slice.chars() {
        let mapped = match c {
            // enforce valid range
            ch if !(('.'..='z').contains(&ch)) => '.',

            ':' => 'A',
            ';' => 'B',
            '<' => 'C',
            '=' => 'D',
            '>' => 'E',
            '?' => 'F',
            '@' => 'a',
            '[' => 'b',
            '\\' => 'c',
            ']' => 'd',
            '^' => 'e',
            '_' => 'f',
            '`' => 'g',

            ch => ch,
        };
        result.push(mapped);
    }

    result
}

#[wasm_bindgen]
pub fn run_1000_iterations() {
    for _ in 0..1000 {
        let pwd = rand_pwd();
        let salt = get_salt(&pwd);
        crypt3(&pwd, &salt);
    }
}

fn main() {}
