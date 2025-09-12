use crate::constants::*;

const FORMAT_TABLES: [[char; 64]; 11] = {
    let mut tables = [['.'; 64]; 11];
    let mut n = 0;
    while n < 11 {
        let mut i = 0;
        while i < 64 {
            let mut val = i as u8;
            let mut c = 0u8;
            // Build MSB-first byte
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
            tables[n][i] = c as char;
            i += 1;
        }
        n += 1;
    }
    tables
};

pub fn format_digest(data: u64) -> String {
    let mut s: String = String::with_capacity(10);

    for i in 1..11 {
        s.push(FORMAT_TABLES[i][ ((data >> (6*i)) & 0x3F) as usize] );
    }

    s
}
