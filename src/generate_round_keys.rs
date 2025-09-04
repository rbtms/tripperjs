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


/********************************************************************
* Number of left shifts to apply in each round key generation round
* and precalculated offset for speed reasons
*
* From
*   static SHIFT_TABLE: [usize; 16] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
*
********************************************************************/
static SHIFT_OFFSET: [usize; 16] = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

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


const fn precompute_parity_drop_key() -> [[u64; 256]; 8] {
    let mut tables = [[0u64; 256]; 8]; // 8 bytes of input

    let mut out_bit = 0;
    while out_bit < 56 { // 56 output bits
        let input_bit = PARITY_DROP_TABLE[out_bit];
        let input_byte = input_bit / 8;
        let bit_in_byte = input_bit % 8;
        let mask = 1u64 << out_bit;

        let mut b = 0;
        while b < 256 {
            if ((b >> bit_in_byte) & 1) != 0 {
                tables[input_byte][b as usize] |= mask;
            }
            b += 1;
        }

        out_bit += 1;
    }

    tables
}

static PARITY_DROP_PRECOMPUTED: [[u64; 256]; 8] = precompute_parity_drop_key();

const fn precompute_compress_tables() -> [[[u64; 256]; 7]; 16] {
    let mut tables = [[[0u64; 256]; 7]; 16]; // 16 rounds, 7 bytes for 56-bit parity-drop key

    let mut round = 0;
    while round < 16 {
        let mut out_bit = 0;
        while out_bit < 48 { // 48 bits per round key
            let input_bit = PARITY_DROP_INDEXES[48 * round + out_bit];
            let input_byte = input_bit / 8;
            let bit_in_byte = input_bit % 8;
            let mask = 1u64 << out_bit;

            let mut b = 0;
            while b < 256 {
                if ((b >> bit_in_byte) & 1) != 0 {
                    tables[round][input_byte][b as usize] |= mask;
                }
                b += 1;
            }

            out_bit += 1;
        }
        round += 1;
    }

    tables
}

static CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED: [[[u64; 256]; 7]; 16] = precompute_compress_tables();


pub fn generate_round_keys(key: u64) -> [u64; 16] {
    //let mut parity_drop_key = [0u64;56];
    let mut parity_drop_key = 0u64; // 56 bits
    let mut k = [0u64; 16];

    parity_drop_key = PARITY_DROP_PRECOMPUTED[0][(key&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[1][((key>>8) &0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[2][((key>>16)&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[3][((key>>24)&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[4][((key>>32)&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[5][((key>>40)&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[6][((key>>48)&0xFF) as usize]
        | PARITY_DROP_PRECOMPUTED[7][((key>>56)&0xFF) as usize];

    /**********************
    * Generate round keys
    **********************/
    for n in 0..16 {
        /*******************************************************
        * Apply circular left shift and compression permutation
        *******************************************************/

        k[n] |= CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][0][((parity_drop_key >> 0)  & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][1][((parity_drop_key >> 8)  & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][2][((parity_drop_key >> 16) & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][3][((parity_drop_key >> 24) & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][4][((parity_drop_key >> 32) & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][5][((parity_drop_key >> 40) & 0xFF) as usize]
              | CIRCULAR_SHIFT_PERMUTATION_PRECOMPUTED[n][6][((parity_drop_key >> 48) & 0xFF) as usize];
    }

    k
}
