use std::sync::{OnceLock};
use std::collections::HashMap;
use crate::constants::*;

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

fn des_round(l: u32, r: u32, r_expanded_precomputed: &[[u64; 256]; 4], k_round: u64) -> (u32, u32) {
        let k_xor_r_expanded = k_round ^ (
              r_expanded_precomputed[0][ (r     &0xFF) as usize]
            | r_expanded_precomputed[1][((r>> 8)&0xFF) as usize]
            | r_expanded_precomputed[2][((r>>16)&0xFF) as usize]
            | r_expanded_precomputed[3][((r>>24)&0xFF) as usize]);
        
        let _l = l
            ^ S_VAL[0][( k_xor_r_expanded        & 0x3F) as usize]
            ^ S_VAL[1][((k_xor_r_expanded >>  6) & 0x3F) as usize]
            ^ S_VAL[2][((k_xor_r_expanded >> 12) & 0x3F) as usize]
            ^ S_VAL[3][((k_xor_r_expanded >> 18) & 0x3F) as usize]
            ^ S_VAL[4][((k_xor_r_expanded >> 24) & 0x3F) as usize]
            ^ S_VAL[5][((k_xor_r_expanded >> 30) & 0x3F) as usize]
            ^ S_VAL[6][((k_xor_r_expanded >> 36) & 0x3F) as usize]
            ^ S_VAL[7][((k_xor_r_expanded >> 42) & 0x3F) as usize];

        // Swap L and R
        (r, _l)
}

pub fn des(data: u64, k: &[u64; 16], r_expanded_precomputed: &[[u64; 256]; 4]) -> u64 {
    /*******************************************************************
    * Apply initial permutation and separate into left and right parts
    * (both 32 bits long)
    *******************************************************************/
    let mut l = INITIAL_L_PRECOMPUTED[0][(data&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[1][((data>> 8)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[2][((data>>16)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[3][((data>>24)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[4][((data>>32)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[5][((data>>40)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[6][((data>>48)&0xFF) as usize]
      | INITIAL_L_PRECOMPUTED[7][((data>>56)&0xFF) as usize];

    let mut r = INITIAL_R_PRECOMPUTED[0][(data&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[1][((data>> 8)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[2][((data>>16)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[3][((data>>24)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[4][((data>>32)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[5][((data>>40)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[6][((data>>48)&0xFF) as usize]
      | INITIAL_R_PRECOMPUTED[7][((data>>56)&0xFF) as usize];

    /*********************
    * Round 0 through 16
    *********************/
    for round_n in 0..16 {
        (l, r) = des_round(l, r, r_expanded_precomputed, k[round_n]);
    }
    
    // Swap L and R at the end to allow reversing
    (l, r) = (r, l);

    /**************************
    * Apply final permutation
    **************************/
    return FINAL_L_PRECOMPUTED[0][ (l        & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[1][((l >>  8) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[2][((l >> 16) & 0xFF) as usize]
         | FINAL_L_PRECOMPUTED[3][((l >> 24) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[0][ (r        & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[1][((r >>  8) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[2][((r >> 16) & 0xFF) as usize]
         | FINAL_R_PRECOMPUTED[3][((r >> 24) & 0xFF) as usize];
}
