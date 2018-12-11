

// Some helpers
function store_i32(index :i32, n :i32, mem_offset :i32) :void {
  store<i8>( 20000 + (mem_offset)*13 + index, <i8>n);
}

/*************************************
* Left side Initial permutation (IP)
*************************************/
const initial_table_L :i32[] = [
  57, 49, 41, 33, 25, 17,  9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];


/*****************************************
* Right side of Initial permutation (IP)
*****************************************/
const initial_table_R :i32[] = [
  56, 48, 40, 32, 24, 16,  8, 0,
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6
];

/***********************************************
* Expansion table (E) used in the DES function
* to expand R from 32 bits to 48
***********************************************/
const expansion_table :i32[] = [
   31,  0,  1,  2,  3,  4,
    3,  4,  5,  6,  7,  8,
    7,  8,  9, 10, 11, 12,
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
const parity_drop_table :i32[] = [
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
const compression_table :i32[] = [
  13, 16, 10, 23,  0,  4,  2, 27,
  14,  5, 20,  9, 22, 18, 11,  3,
  25,  7, 15,  6, 26, 19, 12,  1,
  40, 51, 30, 36, 46, 54, 29, 39,
  50, 44, 32, 47, 43, 48, 38, 55,
  33, 52, 45, 41, 49, 35, 28, 31
];


/*********************************************
* Permutation table applied to s_box results
*********************************************/
const straight_table :i32[] = [
  15,  6, 19, 20, 28, 11, 27, 16,
   0, 14, 22, 25,  4, 17, 30,  9,
   1,  7, 23, 13, 31, 26,  2,  8,
  18, 12, 29,  5, 21, 10,  3, 24
];


/****************************************************
* Inverse table of straight_table for speed reasons
****************************************************/
const inverse_straight_table :i32[] = [
   8, 16, 22, 30, 12, 27,  1, 17,
  23, 15, 29,  5, 25, 19,  9,  0,
   7, 13, 24,  2,  3, 28, 10, 18,
  31, 11, 21,  6,  4, 26, 14, 20
];

const s_box_table :i32[] = [
  // 0
  14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
   0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
   4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
  15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13,
  // 1
  15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
   3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
   0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
  13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9,
  // 2
  10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
  13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
  13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
   1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12,
  // 3
   7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
  13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
  10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
   3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14,
  // 4
   2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
  14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
   4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
  11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3,
  // 5
  12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
  10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
   9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
   4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13,
  // 6
   4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
  13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
   1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
   6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12,
  // 7
  13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
   1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
   7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
   2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11,
];


// Initialization

const shift_offset :i32[] = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

const CHAR_CODE_Z   :i32 = 90;
const CHAR_CODE_9   :i32 = 57;
const CHAR_CODE_DOT :i32 = 46;

const PARITY_DROP :i32[] = new Array(56);
const PWD_BIN     :i32[] = new Array(64);

const PWD    :i32[] = new Array(8);
const SALT   :i32[] = new Array(2);
const DATA   :i32[] = new Array(64);
const DIGEST :i32[] = new Array(13);
const L      :i32[] = new Array(32);
const R      :i32[] = new Array(32);

let K :i32[][] = new Array(18);

for(let i :i32 = 0; i < 18; i++)
  K[i] = new Array(46);

// Initialization end

export function gen_round_keys() :void {
  let i      :i32, j :i32;
  let k      :i32[];
  let value  :i32;
  let offset :i32;

  for(i = 0; i < 56; i++)
    PARITY_DROP[i] = PWD_BIN[ parity_drop_table[i] ];

  for(i = 0; i < 16; i++) {
    offset = shift_offset[i];
    k = K[i];

    for(j = 0; j < 48; j++) {
      value = compression_table[j];

      k[j] = value < 28
        ? PARITY_DROP[ (offset + value   )%28      ]
        : PARITY_DROP[ (offset + value%28)%28 + 28 ];
    }
  }
}

export function cipher(L :i32[], R :i32[]) :void {
  let i    :i32, j :i32;
  let k    :i32[];
  let temp :i32[];
  let pos  :i32, row :i32, col :i32, dec :i32;
  let a :i32, b :i32, c :i32, d :i32;

  for(i = 0; i < 32; i++) {
    L[i] = DATA[ initial_table_L[i] ];
    R[i] = DATA[ initial_table_R[i] ];
  }
  
  for(i = 0; i < 16; i++) {
    k = K[i];

    for(j = 0; j < 8; j++) {
      pos = j*6;
      
      row = ( ( k[pos+5] ^ R[ expansion_table[pos+5] ] ) << 0 )
          + ( ( k[pos]   ^ R[ expansion_table[pos]   ] ) << 1 );
      
      col = ( ( k[pos+4] ^ R[ expansion_table[pos+4] ] ) << 0 )
          + ( ( k[pos+3] ^ R[ expansion_table[pos+3] ] ) << 1 )
          + ( ( k[pos+2] ^ R[ expansion_table[pos+2] ] ) << 2 )
          + ( ( k[pos+1] ^ R[ expansion_table[pos+1] ] ) << 3 );


      dec = s_box_table[ j*64 + row*16 + col ];

      pos = j*4;
      a = inverse_straight_table[pos];
      b = inverse_straight_table[pos+1];
      c = inverse_straight_table[pos+2];
      d = inverse_straight_table[pos+3];

      L[a] = L[a] ^ ( (dec >> 3) & 1 );
      L[b] = L[b] ^ ( (dec >> 2) & 1 );
      L[c] = L[c] ^ ( (dec >> 1) & 1 );
      L[d] = L[d] ^ ( (dec >> 0) & 1 );
    }
    
    if(i != 15) {
      temp = L;
      L    = R;
      R    = temp;
    }
  }
  
  for(i = 0; i < 32; i++) {
    DATA[ initial_table_L[i] ] = L[i];
    DATA[ initial_table_R[i] ] = R[i];
  }
}

function perturb_expansion() :void {
  let i :i32, j :i32;
  let a :i32, b :i32;
  let c :i32;
  let temp :i32;
  let row  :i32;

  for(i = 0; i < 2; i++) {
    c = SALT[i];

    if( c > CHAR_CODE_Z )
      c = c - 6;
    if( c > CHAR_CODE_9 )
      c = c -7;

    c = c - CHAR_CODE_DOT;

    row = 6*i;

    for(j = 0; j < 6; j++) {
      if( (c >> j) & 1 ) { //// Supposed to be octal
        a = row + j;
        b = row + j + 24;

        temp               = expansion_table[a];
        expansion_table[a] = expansion_table[b];
        expansion_table[b] = temp;
      }
    }
  }
}

function gen_pwd() :void {
  for(let i :i32 = 0; i < 8; i++)
    PWD[i] = 97+i;
}

function gen_salt() :void {
  for(let i :i32 = 0; i < 2; i++)
    SALT[i] = 97+i;
}

export function crypt3(mem_offset :i32) :i32 {
  let i   :i32, j :i32;
  let c   :i32;
  let row :i32;

  /*
   * Gen pwd and salt
   */
  gen_pwd();
  gen_salt();

  /*
   * Init DATA
   */
  for(i = 0; i < 64; i++)
    DATA[i] = 0;

  /*
   * Init digest as the two first chars of salt
   */
  for(i = 0; i < 2; i++)
    DIGEST[i] = SALT[i];

  /*
   * Perturb expansion table
   */
  perturb_expansion();


  /*
   * Convert pwd to binary array
   */
  for(i = 0; i < 8; i++) {
    c   = PWD[i];
    row = i*8;

    for(j = 0; j < 7; j++)
      PWD_BIN[row + j] = ( c >> (6-j) ) & 1;
  }

  /*
   * Generate round keys
   */
  gen_round_keys();

  /*
   * Cipher 25 times
   */
  for(i = 0; i < 25; i++)
    cipher(L, R);

  /*
   * Return expansion table to normal
   */
  perturb_expansion();
  
  /*
   * Format digest
   */
  for(i = 0; i < 11; i++) {
    row = 6*i //// Outside of bounds;
    c   = 0;

    for(j = 0; j < 6; j++) {
      c = c << 1;
      c = c | (row + j >= DATA.length ? 0 : DATA[row + j]);
    }

      c = c + CHAR_CODE_DOT;
    if(c > CHAR_CODE_9 )
      c = c + 7;
    if(c > CHAR_CODE_Z)
      c = c + 6;

    DIGEST[i+2] = c;
  }

  // Store the result in memory
  for(i = 0; i < 13; i++)
    store_i32(i, DIGEST[i], mem_offset);


  return DIGEST[0];
}

export function main(itr_n :i32) :void {
  for(let i :i32 = 0; i < itr_n; i++) {
    crypt3(i);
  }
}

