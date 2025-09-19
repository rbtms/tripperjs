use crate::constants::*;

/// This table contains 64 characters used to map 6-bit values (0-63)
/// to printable ASCII characters.
const FORMAT_TABLE: [char; 64] = {
    let mut table = ['.'; 64];
    let mut i = 0;

    while i < 64 {
        let mut val = i as u8;
        let mut c = 0u8;
        let mut j = 0;

        while j < 6 {
            c <<= 1;
            c |= val & 1;
            val >>= 1;
            j += 1;
        }
        c += CHAR_CODE_DOT;
        if c > CHAR_CODE_9 { c += 7; }
        if c > CHAR_CODE_Z { c += 6; }
        table[i] = c as char;
        i += 1;
    }

    table
};

/// Converts a 64-bit digest value into a formatted string representation
///
/// # Arguments
/// * `data` - A 64-bit unsigned integer representing the digest to format
///
/// # Returns
/// * `String` - A 10-character formatted string representation of the digest
pub fn format_digest(data: u64) -> String {
    let mut s: String = String::with_capacity(10);

    for i in 1..11 {
        s.push(FORMAT_TABLE[ ((data >> (6*i)) & 0x3F) as usize] );
    }

    s
}
