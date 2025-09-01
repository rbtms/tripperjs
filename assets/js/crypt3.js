/*********************************************************************************************
* Name         : tripper.js
* Description  : Javascript implementation of 2ch/4chan tripcode generation algorithm
*
* Version      : 1.0
* License      : GPL 3.0
* Author       : Alvaro Fernandez (nishinishi)
* Contact mail : nishinishi9999@gmail.com
*********************************************************************************************/

/****************************************************************************
* Tables
*
* Note: All tables except s_box_table have all their entries reduced by one
*       to avoid constant substracting operations
*
****************************************************************************/

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
var initial_table_L = [
    57, 49, 41, 33, 25, 17,  9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
];
var initial_table_R = [
    56, 48, 40, 32, 24, 16,  8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6
];

/***************************
* Final permutation (IP-1)
***************************/
// var final_table = [
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
var expansion_table =  [
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
var parity_drop_table = [
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
var compression_table = [
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
var inverse_straight_table = [
     8, 16, 22, 30, 12, 27,  1, 17,
    23, 15, 29,  5, 25, 19,  9,  0,
     7, 13, 24,  2,  3, 28, 10, 18,
    31, 11, 21,  6,  4, 26, 14, 20
];


/******************************************
* S-Box tables, the core of the algorithm
******************************************/
var s_box_table = [
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

/********************************************************************
* Number of left shifts to apply in each round key generation round
* and precalculated offset for speed reasons
********************************************************************/
//var shift_table  = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var shift_offset = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

// Round keys
var K = new Array(16).fill();
for(var n = 0; n < 16; n++) { K[n] = new Array(48).fill(0); }

// Magic numbers
const CHAR_CODE_Z   = 90;
const CHAR_CODE_9   = 57;
const CHAR_CODE_DOT = 46;

/************************************************************************************
* Description : gen_round_keys(): Generate 16 48-bit round keys from one 64-bit key
* Takes       : key (arrayref) - 48 bit binary array
* Returns     : nothing
* Sets global : K[0-15]
* Notes       : Nothing
* TODO        : Nothing
************************************************************************************/
function generate_round_keys(key) {
    let parity_drop = new Array(56).fill(0);

    /***********************************************************************
    * Apply parity drop permutation and separate into left and right parts
    ***********************************************************************/
    for(let n = 0; n < 56; n++) {
        parity_drop[n] = key[parity_drop_table[n]];
    }
    
    /**********************
    * Generate round keys
    **********************/
    for(let n = 0; n < 16; n++) {
        /****************************************************
        * Circular left shift (1, 2, 9, 16: 1; rest: 2)
        *
        * As it is very costly to shift arrays physically,
        * a logical left shift is done in it place, with an
        * offset representing the 0 index of the left and
        * right arrays.
        ****************************************************/
        const offset = shift_offset[n] ;
        
        /********************************
        * Apply compression permutation
        ********************************/
        for(let m = 0; m < 48; m++) {
            const value = compression_table[m];
            
            K[n][m] = value < 28 ?
                parity_drop[(offset + value)%28] :
                parity_drop[(offset + value%28)%28 + 28];
            }
        }
}

/********************************************************************
* Name        : cipher
* Description : Encrypt and decrypt data with the DES algorithm
* Takes       : data (array) - 64 bit binary array containing input
* Returns     : Nothing
* Sets global : data (array) - The same array as the input
********************************************************************/
function cipher(data) {
    var n, m;
    var round_n;
    var k;
    var temp;
    var pos, row, col, dec;

    let L = new Uint8Array(32).fill(0);
    let R = new Uint8Array(32).fill(0);
    
    /*******************************************************************
    * Apply initial permutation and separate into left and right parts
    * (both 32 bits long)
    *******************************************************************/
    for(n = 0; n < 32; n++) {
        L[n] = data[initial_table_L[n]];
        R[n] = data[initial_table_R[n]];
    }
    
    /*********************
    * Round 0 through 16
    *********************/
    for(round_n = 0; round_n < 16; round_n++) {
        k = K[round_n];

        /***************************
        * Apply S-Box permutations
        ***************************/
        for(m = 0; m < 8; m++) {
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
           // R (4 bit) -> 6 bit
           // k (6 bit) ^ R (6 bit) -> 6 bit
            pos = m*6;
            row =   (k[pos+5] ^ R[expansion_table[pos+5]])
                | ( (k[pos]   ^ R[expansion_table[pos]])   << 1 );
            col =    k[pos+4] ^ R[expansion_table[pos+4]]
                | ( (k[pos+3] ^ R[expansion_table[pos+3]]) << 1 )
                | ( (k[pos+2] ^ R[expansion_table[pos+2]]) << 2 )
                | ( (k[pos+1] ^ R[expansion_table[pos+1]]) << 3 );

                    
            // const x = k_6^r_6;
            // row = (x>>5) | ((x&1)<<1);
            // col = (x>>2);
            // col = ((x>>4)&1) | (((x>>3)&1)<<1) | (((x>>2)&1)<<2) | (((x>>1)&1)<<3);
    
            // Get decimal value from s-box
            // 6 bit -> dec (4 bit)
            dec = s_box_table[m*64 + row*16 + col]; // 32 bit
    
            /***************************************************************
            * Convert dec to bin,
            * apply straight inverse permutation and then xor to L with it
            *
            * shortcut for:
            * for(n = 0; n < 32; n++) { L ^= S_output[straight_table[n]]; }
            *
            ****************************************************************/
            pos = m*4;
            L[inverse_straight_table[pos]]   ^= (dec >> 3) & 1; // 4 bit
            L[inverse_straight_table[pos+1]] ^= (dec >> 2) & 1;
            L[inverse_straight_table[pos+2]] ^= (dec >> 1) & 1;
            L[inverse_straight_table[pos+3]] ^=  dec & 1;
        }        
        
        // Swap L and R (skip last round to allow reversing)
        if(round_n != 15) {
            temp = L;
            L    = R;
            R    = temp;
        }
    }

    
    /*****************************************************
    * Apply final through the initial permutation table
    * from the left side to data and return,
    * as the number of rounds is even, L and R return to
    * their original place
    *****************************************************/
    for(n = 0; n < 32; n++) { data[initial_table_L[n]] = L[n]; }
    for(n = 0; n < 32; n++) { data[initial_table_R[n]] = R[n]; }
}


/************************************************************
* Name        : perturb_expansion
* Description : Perturbs expansion table with provided salt
* Takes       : salt (string) - Two character string
* Returns     : Nothing
* Sets global : perturb_expansion(salt)
* Notes       : It is reversible, so if it's called twice
*               it returns to its original state
************************************************************/
function perturb_expansion(salt) {
    for(let n = 0; n < 2; n++) {
        let c = salt[n].charCodeAt();

        if(c > CHAR_CODE_Z) { c -= 6; }
        if(c > CHAR_CODE_9) { c -= 7; }
        c   -= CHAR_CODE_DOT;
        
        const row = 6*n;
        for(let m = 0; m < 6; m++) {
            /********************************************
            * Right shift through the first 6 bits of c
            * and perturb the expansion_table if it's 1
            ********************************************/
            if((c >> m) & 1) {
                const a = row + m;
                const b = row + m + 24;
                
                const temp         = expansion_table[a];
                expansion_table[a] = expansion_table[b];
                expansion_table[b] = temp;
            }
        }
    }
}

function to_binary_array(pwd) {
    let pwd_bin = new Uint8Array(64);

    for(n = 0; n < 8; n++) {
        const c   = pwd[n].charCodeAt();
        const row = n*8;                
                
        for(let m = 0; m < 7; m++) {
            pwd_bin[row + m] = ( c >> (6-m) ) & 1;
        }
    }

    return pwd_bin;
}

function format_digest(data, salt) {
    // Set the two first characters of the digest to the salt
    let digest = salt;

    for(let n = 0; n < 11; n++) {
        const row = 6*n;
        let c = 0;
        
        for(let m = 0; m < 6; m++) {
            c <<= 1;
            c |= data[row + m];
        }

        c   += CHAR_CODE_DOT;
        if(c > CHAR_CODE_9) { c += 7; }
        if(c > CHAR_CODE_Z) { c += 6; }

        digest += String.fromCharCode(c);
    }
        
    return digest;
}

/******************************************************************
* Name        : crypt3
* Description : DES-based UNIX crypt(3) javascript implementation
*
* Takes       : pwd (string)  - 8 byte ascii string
*               salt (string) - 1 or 2 byte ascii string
*
* Returns     : digest (string) - Ascii string with the digest
******************************************************************/
export function crypt3(pwd, salt) {
    let data = new Uint8Array(64).fill(0);
    const pwd_bin = to_binary_array(pwd);

    // Use salt to perturb the expansion table
    perturb_expansion(salt);        
    generate_round_keys(pwd_bin);
    
    // Crypt(3) calls DES3 25 times
    for(let n = 0; n < 25; n++) {
        cipher(data);
    }
    
    // Return expansion table to normal (might be buggy)
    perturb_expansion(salt);

    return format_digest(data, salt);
}
