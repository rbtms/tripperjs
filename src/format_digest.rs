use crate::constants::*;

static FORMAT_TABLES: [[char; 64]; 11] = {
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
    [ FORMAT_TABLES[1][ ((data >> 6 ) & 0x3F) as usize ],
      FORMAT_TABLES[2][ ((data >> 12) & 0x3F) as usize ],
      FORMAT_TABLES[3][ ((data >> 18) & 0x3F) as usize ],
      FORMAT_TABLES[4][ ((data >> 24) & 0x3F) as usize ],
      FORMAT_TABLES[5][ ((data >> 30) & 0x3F) as usize ],
      FORMAT_TABLES[6][ ((data >> 36) & 0x3F) as usize ],
      FORMAT_TABLES[7][ ((data >> 42) & 0x3F) as usize ],
      FORMAT_TABLES[8][ ((data >> 48) & 0x3F) as usize ],
      FORMAT_TABLES[9][ ((data >> 54) & 0x3F) as usize ],
      FORMAT_TABLES[10][((data >> 60) & 0x0F) as usize],
    ].iter().collect()
}
