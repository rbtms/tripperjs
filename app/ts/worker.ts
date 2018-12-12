

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

   

const ITL0  :i32 = 57;
const ITL1  :i32 = 49;
const ITL2  :i32 = 41;
const ITL3  :i32 = 33;
const ITL4  :i32 = 25;
const ITL5  :i32 = 17;
const ITL6  :i32 =  9;
const ITL7  :i32 =  1;

const ITL8  :i32 = 59;
const ITL9  :i32 = 51;
const ITL10 :i32 = 43;
const ITL11 :i32 = 35;
const ITL12 :i32 = 27;
const ITL13 :i32 = 19;
const ITL14 :i32 = 11;
const ITL15 :i32 =  3;

const ITL16 :i32 = 61;
const ITL17 :i32 = 53;
const ITL18 :i32 = 45;
const ITL19 :i32 = 37;
const ITL20 :i32 = 29;
const ITL21 :i32 = 21;
const ITL22 :i32 = 13;
const ITL23 :i32 =  5;

const ITL24 :i32 = 63;
const ITL25 :i32 = 55;
const ITL26 :i32 = 47;
const ITL27 :i32 = 39;
const ITL28 :i32 = 31;
const ITL29 :i32 = 23;
const ITL30 :i32 = 15;
const ITL31 :i32 =  7;

/*****************************************
* Right side of Initial permutation (IP)
*****************************************/
const initial_table_R :i32[] = [
  56, 48, 40, 32, 24, 16,  8, 0,
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6
];

const ITR0  :i32 = 56;
const ITR1  :i32 = 48;
const ITR2  :i32 = 40;
const ITR3  :i32 = 32;
const ITR4  :i32 = 24;
const ITR5  :i32 = 16;
const ITR6  :i32 =  8;
const ITR7  :i32 =  0;

const ITR8  :i32 = 58;
const ITR9  :i32 = 50;
const ITR10 :i32 = 42;
const ITR11 :i32 = 34;
const ITR12 :i32 = 26;
const ITR13 :i32 = 18;
const ITR14 :i32 = 10;
const ITR15 :i32 =  2;

const ITR16 :i32 = 60;
const ITR17 :i32 = 52;
const ITR18 :i32 = 44;
const ITR19 :i32 = 36;
const ITR20 :i32 = 28;
const ITR21 :i32 = 20;
const ITR22 :i32 = 12;
const ITR23 :i32 =  4;

const ITR24 :i32 = 62;
const ITR25 :i32 = 54;
const ITR26 :i32 = 46;
const ITR27 :i32 = 38;
const ITR28 :i32 = 30;
const ITR29 :i32 = 22;
const ITR30 :i32 = 14;
const ITR31 :i32 =  6;
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
const _L      :i32[] = new Array(32);
const _R      :i32[] = new Array(32);

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

function set_initial_lr(L :i32[], R :i32[], round_n :i32) :void {
  if( round_n == 0 ) {
    for(let i :i32 = 0; i < 32; i++) {
      L[i] = 0;
      R[i] = 0;
    }
  }
  else {
    L[0]  = DATA[ ITL0 ];
    L[1]  = DATA[ ITL1 ];
    L[2]  = DATA[ ITL2 ];
    L[3]  = DATA[ ITL3 ];
    L[4]  = DATA[ ITL4 ];
    L[5]  = DATA[ ITL5 ];
    L[6]  = DATA[ ITL6 ];
    L[7]  = DATA[ ITL7 ];
    L[8]  = DATA[ ITL8 ];
    L[9]  = DATA[ ITL9 ];
    L[10] = DATA[ ITL10 ];
    L[11] = DATA[ ITL11 ];
    L[12] = DATA[ ITL12 ];
    L[13] = DATA[ ITL13 ];
    L[14] = DATA[ ITL14 ];
    L[15] = DATA[ ITL15 ];
    L[16] = DATA[ ITL16 ];
    L[17] = DATA[ ITL17 ];
    L[18] = DATA[ ITL18 ];
    L[19] = DATA[ ITL19 ];
    L[20] = DATA[ ITL20 ];
    L[21] = DATA[ ITL21 ];
    L[22] = DATA[ ITL22 ];
    L[23] = DATA[ ITL23 ];
    L[24] = DATA[ ITL24 ];
    L[25] = DATA[ ITL25 ];
    L[26] = DATA[ ITL26 ];
    L[27] = DATA[ ITL27 ];
    L[28] = DATA[ ITL28 ];
    L[29] = DATA[ ITL29 ];
    L[30] = DATA[ ITL30 ];
    L[31] = DATA[ ITL31 ];
   
    R[0]  = DATA[ ITR0 ];
    R[1]  = DATA[ ITR1 ];
    R[2]  = DATA[ ITR2 ];
    R[3]  = DATA[ ITR3 ];
    R[4]  = DATA[ ITR4 ];
    R[5]  = DATA[ ITR5 ];
    R[6]  = DATA[ ITR6 ];
    R[7]  = DATA[ ITR7 ];
    R[8]  = DATA[ ITR8 ];
    R[9]  = DATA[ ITR9 ];
    R[10] = DATA[ ITR10 ];
    R[11] = DATA[ ITR11 ];
    R[12] = DATA[ ITR12 ];
    R[13] = DATA[ ITR13 ];
    R[14] = DATA[ ITR14 ];
    R[15] = DATA[ ITR15 ];
    R[16] = DATA[ ITR16 ];
    R[17] = DATA[ ITR17 ];
    R[18] = DATA[ ITR18 ];
    R[19] = DATA[ ITR19 ];
    R[20] = DATA[ ITR20 ];
    R[21] = DATA[ ITR21 ];
    R[22] = DATA[ ITR22 ];
    R[23] = DATA[ ITR23 ];
    R[24] = DATA[ ITR24 ];
    R[25] = DATA[ ITR25 ];
    R[26] = DATA[ ITR26 ];
    R[27] = DATA[ ITR27 ];
    R[28] = DATA[ ITR28 ];
    R[29] = DATA[ ITR29 ];
    R[30] = DATA[ ITR30 ];
    R[31] = DATA[ ITR31 ]; 
  }
}

function set_end_initial_lr(L :i32[], R :i32[]) :void {
  DATA[ ITL0 ]  = L[0];
  DATA[ ITL1 ]  = L[1];
  DATA[ ITL2 ]  = L[2];
  DATA[ ITL3 ]  = L[3];
  DATA[ ITL4 ]  = L[4];
  DATA[ ITL5 ]  = L[5];
  DATA[ ITL6 ]  = L[6];
  DATA[ ITL7 ]  = L[7];
  DATA[ ITL8 ]  = L[8];
  DATA[ ITL9 ]  = L[9];
  DATA[ ITL10 ] = L[10];
  DATA[ ITL11 ] = L[11];
  DATA[ ITL12 ] = L[12];
  DATA[ ITL13 ] = L[13];
  DATA[ ITL14 ] = L[14];
  DATA[ ITL15 ] = L[15];
  DATA[ ITL16 ] = L[16];
  DATA[ ITL17 ] = L[17];
  DATA[ ITL18 ] = L[18];
  DATA[ ITL19 ] = L[19];
  DATA[ ITL20 ] = L[20];
  DATA[ ITL21 ] = L[21];
  DATA[ ITL22 ] = L[22];
  DATA[ ITL23 ] = L[23];
  DATA[ ITL24 ] = L[24];
  DATA[ ITL25 ] = L[25];
  DATA[ ITL26 ] = L[26];
  DATA[ ITL27 ] = L[27];
  DATA[ ITL28 ] = L[28];
  DATA[ ITL29 ] = L[29];
  DATA[ ITL30 ] = L[30];
  DATA[ ITL31 ] = L[31];
 
  DATA[ ITR0 ]  = R[0];
  DATA[ ITR1 ]  = R[1];
  DATA[ ITR2 ]  = R[2];
  DATA[ ITR3 ]  = R[3];
  DATA[ ITR4 ]  = R[4];
  DATA[ ITR5 ]  = R[5];
  DATA[ ITR6 ]  = R[6];
  DATA[ ITR7 ]  = R[7];
  DATA[ ITR8 ]  = R[8];
  DATA[ ITR9 ]  = R[9];
  DATA[ ITR10 ] = R[10];
  DATA[ ITR11 ] = R[11];
  DATA[ ITR12 ] = R[12];
  DATA[ ITR13 ] = R[13];
  DATA[ ITR14 ] = R[14];
  DATA[ ITR15 ] = R[15];
  DATA[ ITR16 ] = R[16];
  DATA[ ITR17 ] = R[17];
  DATA[ ITR18 ] = R[18];
  DATA[ ITR19 ] = R[19];
  DATA[ ITR20 ] = R[20];
  DATA[ ITR21 ] = R[21];
  DATA[ ITR22 ] = R[22];
  DATA[ ITR23 ] = R[23];
  DATA[ ITR24 ] = R[24];
  DATA[ ITR25 ] = R[25];
  DATA[ ITR26 ] = R[26];
  DATA[ ITR27 ] = R[27];
  DATA[ ITR28 ] = R[28];
  DATA[ ITR29 ] = R[29];
  DATA[ ITR30 ] = R[30];
  DATA[ ITR31 ] = R[31]; 
}

export function cipher() :void {
  let i    :i32, j :i32;
  let k    :i32[];
  let temp :i32[];
  let pos  :i32, row :i32, col :i32, dec :i32;
  let a :i32, b :i32, c :i32, d :i32;

  let L :i32[] = _L;
  let R :i32[] = _R;
  let round_n :i32;

  for(round_n = 0; round_n < 25; round_n++) {
    set_initial_lr(L, R, round_n);
    
    for(i = 0; i < 16; i++) {
      k = K[i];

        row = ( ( k[5] ^ R[ expansion_table[5] ] ) << 0 )
            + ( ( k[0] ^ R[ expansion_table[0] ] ) << 1 );
        col = ( ( k[4] ^ R[ expansion_table[4] ] ) << 0 )
            + ( ( k[3] ^ R[ expansion_table[3] ] ) << 1 )
            + ( ( k[2] ^ R[ expansion_table[2] ] ) << 2 )
            + ( ( k[1] ^ R[ expansion_table[1] ] ) << 3 );
        dec = s_box_table[ 0 + row*16 + col ];
        a = inverse_straight_table[0];
        b = inverse_straight_table[1];
        c = inverse_straight_table[2];
        d = inverse_straight_table[3];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );

        pos = 6;
        row = ( ( k[11] ^ R[ expansion_table[11] ] ) << 0 )
            + ( ( k[6]  ^ R[ expansion_table[6]  ] ) << 1 );
        col = ( ( k[10] ^ R[ expansion_table[10] ] ) << 0 )
            + ( ( k[9]  ^ R[ expansion_table[9]  ] ) << 1 )
            + ( ( k[8]  ^ R[ expansion_table[8]  ] ) << 2 )
            + ( ( k[7]  ^ R[ expansion_table[7]  ] ) << 3 );
        dec = s_box_table[ 64 + row*16 + col ];
        a = inverse_straight_table[4];
        b = inverse_straight_table[5];
        c = inverse_straight_table[6];
        d = inverse_straight_table[7];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );
 
        row = ( ( k[17] ^ R[ expansion_table[17] ] ) << 0 )
            + ( ( k[12] ^ R[ expansion_table[12]   ] ) << 1 );
        col = ( ( k[16] ^ R[ expansion_table[16] ] ) << 0 )
            + ( ( k[15] ^ R[ expansion_table[15] ] ) << 1 )
            + ( ( k[14] ^ R[ expansion_table[14] ] ) << 2 )
            + ( ( k[13] ^ R[ expansion_table[13] ] ) << 3 );
        dec = s_box_table[ 128 + row*16 + col ];
        a = inverse_straight_table[8];
        b = inverse_straight_table[9];
        c = inverse_straight_table[10];
        d = inverse_straight_table[11];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );     

        row = ( ( k[23] ^ R[ expansion_table[23] ] ) << 0 )
            + ( ( k[18] ^ R[ expansion_table[18] ] ) << 1 );
        col = ( ( k[22] ^ R[ expansion_table[22] ] ) << 0 )
            + ( ( k[21] ^ R[ expansion_table[21] ] ) << 1 )
            + ( ( k[20] ^ R[ expansion_table[20] ] ) << 2 )
            + ( ( k[19] ^ R[ expansion_table[19] ] ) << 3 );
        dec = s_box_table[ 192 + row*16 + col ];
        a = inverse_straight_table[12];
        b = inverse_straight_table[13];
        c = inverse_straight_table[14];
        d = inverse_straight_table[15];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );
      
        row = ( ( k[29] ^ R[ expansion_table[29] ] ) << 0 )
            + ( ( k[24] ^ R[ expansion_table[24] ] ) << 1 );
        col = ( ( k[28] ^ R[ expansion_table[28] ] ) << 0 )
            + ( ( k[27] ^ R[ expansion_table[27] ] ) << 1 )
            + ( ( k[26] ^ R[ expansion_table[26] ] ) << 2 )
            + ( ( k[25] ^ R[ expansion_table[25] ] ) << 3 );
        dec = s_box_table[ 256 + row*16 + col ];
        a = inverse_straight_table[16];
        b = inverse_straight_table[17];
        c = inverse_straight_table[18];
        d = inverse_straight_table[19];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );

        row = ( ( k[35] ^ R[ expansion_table[35] ] ) << 0 )
            + ( ( k[30] ^ R[ expansion_table[30] ] ) << 1 );
        col = ( ( k[34] ^ R[ expansion_table[34] ] ) << 0 )
            + ( ( k[33] ^ R[ expansion_table[33] ] ) << 1 )
            + ( ( k[32] ^ R[ expansion_table[32] ] ) << 2 )
            + ( ( k[31] ^ R[ expansion_table[31] ] ) << 3 );
        dec = s_box_table[ 320 + row*16 + col ];
        a = inverse_straight_table[20];
        b = inverse_straight_table[21];
        c = inverse_straight_table[22];
        d = inverse_straight_table[23];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );

        row = ( ( k[41] ^ R[ expansion_table[41] ] ) << 0 )
            + ( ( k[36] ^ R[ expansion_table[36] ] ) << 1 );
        col = ( ( k[40] ^ R[ expansion_table[40] ] ) << 0 )
            + ( ( k[39] ^ R[ expansion_table[39] ] ) << 1 )
            + ( ( k[38] ^ R[ expansion_table[38] ] ) << 2 )
            + ( ( k[37] ^ R[ expansion_table[37] ] ) << 3 );
        dec = s_box_table[ 384 + row*16 + col ];
        a = inverse_straight_table[24];
        b = inverse_straight_table[25];
        c = inverse_straight_table[26];
        d = inverse_straight_table[27];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );
      
        row = ( ( k[47] ^ R[ expansion_table[47] ] ) << 0 )
            + ( ( k[42] ^ R[ expansion_table[42] ] ) << 1 );
        col = ( ( k[46] ^ R[ expansion_table[46] ] ) << 0 )
            + ( ( k[45] ^ R[ expansion_table[45] ] ) << 1 )
            + ( ( k[44] ^ R[ expansion_table[44] ] ) << 2 )
            + ( ( k[43] ^ R[ expansion_table[43] ] ) << 3 );
        dec = s_box_table[ 448 + row*16 + col ];
        a = inverse_straight_table[28];
        b = inverse_straight_table[29];
        c = inverse_straight_table[30];
        d = inverse_straight_table[31];
        L[a] = L[a] ^ ( (dec >> 3) & 1 );
        L[b] = L[b] ^ ( (dec >> 2) & 1 );
        L[c] = L[c] ^ ( (dec >> 1) & 1 );
        L[d] = L[d] ^ ( (dec >> 0) & 1 );

      if(i != 15) {
        temp = L;
        L    = R;
        R    = temp;
      }
    }
    
    set_end_initial_lr(L, R);
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
  cipher();

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

