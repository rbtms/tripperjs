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
