use crate::constants::*;

/// This function takes a salt string and uses its first two characters to modify the
/// EXPANSION_TABLE through bit manipulation. Each character is processed to determine
/// which positions in the expansion table should be swapped.
///
/// # Details
/// The function processes the first two characters of the salt:
/// 1. Each character is adjusted by subtracting ASCII values to map them into a specific range
/// 2. For each character, the lower 6 bits are examined
/// 3. If a bit is set to 1, corresponding positions in the expansion table are swapped
/// 4. The swapping occurs between positions in the first half and second half of the table
///
/// 
/// # Arguments
/// * `salt` - A string slice containing at least 2 bytes used for perturbation
/// 
/// # Returns
/// * `[usize; 48]` - A new array with perturbed values based on the salt
/// 
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
