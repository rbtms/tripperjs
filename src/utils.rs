pub fn to_binary_array(pwd: &str) -> u64 {
    let mut pwd_bin = 0u64;

    for (n, &c) in pwd.as_bytes().iter().take(8).enumerate() {
        let offset = n*8;
        
        for m in 0..7 {
            pwd_bin |= (( (c as u64) >> (6-m) ) & 1) << (offset + m);
        }
    }

    pwd_bin
}

pub fn to_binary_arrays(pwds: &Vec<String>) -> [u64; 64] {
    let mut pwd_bins = [0u64; 64];

    for i in 0..64 {
        pwd_bins[i] = to_binary_array(&pwds[i]);
    }

    pwd_bins
}

pub fn to_binary_arrays_128(pwds: &Vec<String>) -> [u64; 128] {
    let mut pwd_bins = [0u64; 128];

    for i in 0..128 {
        pwd_bins[i] = to_binary_array(&pwds[i]);
    }

    pwd_bins
}


#[inline(always)]
fn get_matrix_column(m: &[u64; 32], col_i: usize) -> u64 {
    let mut col = 0u64;
    let matrix_len = 32;

    let mut i = 0;
    while i < matrix_len {
        col |= ((m[i]>>col_i)&1) << i;
        i +=1;
    }

    col
}