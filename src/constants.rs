// Magic numbers
pub const CHAR_CODE_Z: u8   = 90;
pub const CHAR_CODE_9: u8   = 57;
pub const CHAR_CODE_DOT: u8 = 46;

pub const INITIAL_PERMUTATION_L: [usize; 32] = [
    57, 49, 41, 33, 25, 17,  9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
];
pub const INITIAL_PERMUTATION_R: [usize; 32] = [
    56, 48, 40, 32, 24, 16,  8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6
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

pub static INITIAL_L_PRECOMPUTED: [[u32; 256]; 8] = precompute_initial_l_r(INITIAL_PERMUTATION_L);
pub static INITIAL_R_PRECOMPUTED: [[u32; 256]; 8] = precompute_initial_l_r(INITIAL_PERMUTATION_R);

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

pub static FINAL_L_PRECOMPUTED: [[u64; 256]; 4] = precompute_final_l_r(INITIAL_PERMUTATION_L);
pub static FINAL_R_PRECOMPUTED: [[u64; 256]; 4] = precompute_final_l_r(INITIAL_PERMUTATION_R);

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
pub static EXPANSION_TABLE: [usize; 48] =  [
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
pub static INVERSE_STRAIGHT_TABLE: [usize; 32] = [
     8, 16, 22, 30, 12, 27,  1, 17,
    23, 15, 29,  5, 25, 19,  9,  0,
     7, 13, 24,  2,  3, 28, 10, 18,
    31, 11, 21,  6,  4, 26, 14, 20
];

/******************************************
* S-Box tables, the core of the algorithm
******************************************/
pub static S_BOX_TABLE: [usize; 512] = [
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

pub static S_VAL: [[u32; 64]; 8] = {
    let mut s_val = [[0u32; 64]; 8];
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

            s_val[m][i] = mod_val as u32;
            i += 1;
        }
        m += 1;
    }

    s_val
};
