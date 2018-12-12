

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

  let L :i32[] = _L;
  let R :i32[] = _R;
  let round_n :i32;

  const ET0  :i32 = expansion_table[0];
  const ET1  :i32 = expansion_table[1];
  const ET2  :i32 = expansion_table[2];
  const ET3  :i32 = expansion_table[3];
  const ET4  :i32 = expansion_table[4];
  const ET5  :i32 = expansion_table[5];
  const ET6  :i32 = expansion_table[6];
  const ET7  :i32 = expansion_table[7];
  const ET8  :i32 = expansion_table[8];
  const ET9  :i32 = expansion_table[9];
  const ET10 :i32 = expansion_table[10];
  const ET11 :i32 = expansion_table[11];
  const ET12 :i32 = expansion_table[12];
  const ET13 :i32 = expansion_table[13];
  const ET14 :i32 = expansion_table[14];
  const ET15 :i32 = expansion_table[15];
  const ET16 :i32 = expansion_table[16];
  const ET17 :i32 = expansion_table[17];
  const ET18 :i32 = expansion_table[18];
  const ET19 :i32 = expansion_table[19];
  const ET20 :i32 = expansion_table[20];
  const ET21 :i32 = expansion_table[21];
  const ET22 :i32 = expansion_table[22];
  const ET23 :i32 = expansion_table[23];
  const ET24 :i32 = expansion_table[24];
  const ET25 :i32 = expansion_table[25];
  const ET26 :i32 = expansion_table[26];
  const ET27 :i32 = expansion_table[27];
  const ET28 :i32 = expansion_table[28];
  const ET29 :i32 = expansion_table[29];
  const ET30 :i32 = expansion_table[30];
  const ET31 :i32 = expansion_table[31];
  const ET32 :i32 = expansion_table[32];
  const ET33 :i32 = expansion_table[33];
  const ET34 :i32 = expansion_table[34];
  const ET35 :i32 = expansion_table[35];
  const ET36 :i32 = expansion_table[36];
  const ET37 :i32 = expansion_table[37];
  const ET38 :i32 = expansion_table[38];
  const ET39 :i32 = expansion_table[39];
  const ET40 :i32 = expansion_table[40];
  const ET41 :i32 = expansion_table[41];
  const ET42 :i32 = expansion_table[42];
  const ET43 :i32 = expansion_table[43];
  const ET44 :i32 = expansion_table[44];
  const ET45 :i32 = expansion_table[45];
  const ET46 :i32 = expansion_table[46];
  const ET47 :i32 = expansion_table[47];

  const IST0  :i32 = inverse_straight_table[0];
  const IST1  :i32 = inverse_straight_table[1];
  const IST2  :i32 = inverse_straight_table[2];
  const IST3  :i32 = inverse_straight_table[3];
  const IST4  :i32 = inverse_straight_table[4];
  const IST5  :i32 = inverse_straight_table[5];
  const IST6  :i32 = inverse_straight_table[6];
  const IST7  :i32 = inverse_straight_table[7];
  const IST8  :i32 = inverse_straight_table[8];
  const IST9  :i32 = inverse_straight_table[9];
  const IST10 :i32 = inverse_straight_table[10];
  const IST11 :i32 = inverse_straight_table[11];
  const IST12 :i32 = inverse_straight_table[12];
  const IST13 :i32 = inverse_straight_table[13];
  const IST14 :i32 = inverse_straight_table[14];
  const IST15 :i32 = inverse_straight_table[15];
  const IST16 :i32 = inverse_straight_table[16];
  const IST17 :i32 = inverse_straight_table[17];
  const IST18 :i32 = inverse_straight_table[18];
  const IST19 :i32 = inverse_straight_table[19];
  const IST20 :i32 = inverse_straight_table[20];
  const IST21 :i32 = inverse_straight_table[21];
  const IST22 :i32 = inverse_straight_table[22];
  const IST23 :i32 = inverse_straight_table[23];
  const IST24 :i32 = inverse_straight_table[24];
  const IST25 :i32 = inverse_straight_table[25];
  const IST26 :i32 = inverse_straight_table[26];
  const IST27 :i32 = inverse_straight_table[27];
  const IST28 :i32 = inverse_straight_table[28];
  const IST29 :i32 = inverse_straight_table[29];
  const IST30 :i32 = inverse_straight_table[30];
  const IST31 :i32 = inverse_straight_table[31];

  k = K[0];
  const K0_0  :i32 = k[0];
  const K0_1  :i32 = k[1];
  const K0_2  :i32 = k[2];
  const K0_3  :i32 = k[3];
  const K0_4  :i32 = k[4];
  const K0_5  :i32 = k[5];
  const K0_6  :i32 = k[6];
  const K0_7  :i32 = k[7];
  const K0_8  :i32 = k[8];
  const K0_9  :i32 = k[9];
  const K0_10 :i32 = k[10];
  const K0_11 :i32 = k[11];
  const K0_12 :i32 = k[12];
  const K0_13 :i32 = k[13];
  const K0_14 :i32 = k[14];
  const K0_15 :i32 = k[15];
  const K0_16 :i32 = k[16];
  const K0_17 :i32 = k[17];
  const K0_18 :i32 = k[18];
  const K0_19 :i32 = k[19];
  const K0_20 :i32 = k[20];
  const K0_21 :i32 = k[21];
  const K0_22 :i32 = k[22];
  const K0_23 :i32 = k[23];
  const K0_24 :i32 = k[24];
  const K0_25 :i32 = k[25];
  const K0_26 :i32 = k[26];
  const K0_27 :i32 = k[27];
  const K0_28 :i32 = k[28];
  const K0_29 :i32 = k[29];
  const K0_30 :i32 = k[30];
  const K0_31 :i32 = k[31];
  const K0_32 :i32 = k[32];
  const K0_33 :i32 = k[33];
  const K0_34 :i32 = k[34];
  const K0_35 :i32 = k[35];
  const K0_36 :i32 = k[36];
  const K0_37 :i32 = k[37];
  const K0_38 :i32 = k[38];
  const K0_39 :i32 = k[39];
  const K0_40 :i32 = k[40];
  const K0_41 :i32 = k[41];
  const K0_42 :i32 = k[42];
  const K0_43 :i32 = k[43];
  const K0_44 :i32 = k[44];
  const K0_45 :i32 = k[45];
  const K0_46 :i32 = k[46];
  const K0_47 :i32 = k[47];

  k = K[1];
  const K1_0  :i32 = k[0];
  const K1_1  :i32 = k[1];
  const K1_2  :i32 = k[2];
  const K1_3  :i32 = k[3];
  const K1_4  :i32 = k[4];
  const K1_5  :i32 = k[5];
  const K1_6  :i32 = k[6];
  const K1_7  :i32 = k[7];
  const K1_8  :i32 = k[8];
  const K1_9  :i32 = k[9];
  const K1_10 :i32 = k[10];
  const K1_11 :i32 = k[11];
  const K1_12 :i32 = k[12];
  const K1_13 :i32 = k[13];
  const K1_14 :i32 = k[14];
  const K1_15 :i32 = k[15];
  const K1_16 :i32 = k[16];
  const K1_17 :i32 = k[17];
  const K1_18 :i32 = k[18];
  const K1_19 :i32 = k[19];
  const K1_20 :i32 = k[20];
  const K1_21 :i32 = k[21];
  const K1_22 :i32 = k[22];
  const K1_23 :i32 = k[23];
  const K1_24 :i32 = k[24];
  const K1_25 :i32 = k[25];
  const K1_26 :i32 = k[26];
  const K1_27 :i32 = k[27];
  const K1_28 :i32 = k[28];
  const K1_29 :i32 = k[29];
  const K1_30 :i32 = k[30];
  const K1_31 :i32 = k[31];
  const K1_32 :i32 = k[32];
  const K1_33 :i32 = k[33];
  const K1_34 :i32 = k[34];
  const K1_35 :i32 = k[35];
  const K1_36 :i32 = k[36];
  const K1_37 :i32 = k[37];
  const K1_38 :i32 = k[38];
  const K1_39 :i32 = k[39];
  const K1_40 :i32 = k[40];
  const K1_41 :i32 = k[41];
  const K1_42 :i32 = k[42];
  const K1_43 :i32 = k[43];
  const K1_44 :i32 = k[44];
  const K1_45 :i32 = k[45];
  const K1_46 :i32 = k[46];
  const K1_47 :i32 = k[47];

  k = K[2];
  const K2_0  :i32 = k[0];
  const K2_1  :i32 = k[1];
  const K2_2  :i32 = k[2];
  const K2_3  :i32 = k[3];
  const K2_4  :i32 = k[4];
  const K2_5  :i32 = k[5];
  const K2_6  :i32 = k[6];
  const K2_7  :i32 = k[7];
  const K2_8  :i32 = k[8];
  const K2_9  :i32 = k[9];
  const K2_10 :i32 = k[10];
  const K2_11 :i32 = k[11];
  const K2_12 :i32 = k[12];
  const K2_13 :i32 = k[13];
  const K2_14 :i32 = k[14];
  const K2_15 :i32 = k[15];
  const K2_16 :i32 = k[16];
  const K2_17 :i32 = k[17];
  const K2_18 :i32 = k[18];
  const K2_19 :i32 = k[19];
  const K2_20 :i32 = k[20];
  const K2_21 :i32 = k[21];
  const K2_22 :i32 = k[22];
  const K2_23 :i32 = k[23];
  const K2_24 :i32 = k[24];
  const K2_25 :i32 = k[25];
  const K2_26 :i32 = k[26];
  const K2_27 :i32 = k[27];
  const K2_28 :i32 = k[28];
  const K2_29 :i32 = k[29];
  const K2_30 :i32 = k[30];
  const K2_31 :i32 = k[31];
  const K2_32 :i32 = k[32];
  const K2_33 :i32 = k[33];
  const K2_34 :i32 = k[34];
  const K2_35 :i32 = k[35];
  const K2_36 :i32 = k[36];
  const K2_37 :i32 = k[37];
  const K2_38 :i32 = k[38];
  const K2_39 :i32 = k[39];
  const K2_40 :i32 = k[40];
  const K2_41 :i32 = k[41];
  const K2_42 :i32 = k[42];
  const K2_43 :i32 = k[43];
  const K2_44 :i32 = k[44];
  const K2_45 :i32 = k[45];
  const K2_46 :i32 = k[46];
  const K2_47 :i32 = k[47];

  k = K[3];
  const K3_0  :i32 = k[0];
  const K3_1  :i32 = k[1];
  const K3_2  :i32 = k[2];
  const K3_3  :i32 = k[3];
  const K3_4  :i32 = k[4];
  const K3_5  :i32 = k[5];
  const K3_6  :i32 = k[6];
  const K3_7  :i32 = k[7];
  const K3_8  :i32 = k[8];
  const K3_9  :i32 = k[9];
  const K3_10 :i32 = k[10];
  const K3_11 :i32 = k[11];
  const K3_12 :i32 = k[12];
  const K3_13 :i32 = k[13];
  const K3_14 :i32 = k[14];
  const K3_15 :i32 = k[15];
  const K3_16 :i32 = k[16];
  const K3_17 :i32 = k[17];
  const K3_18 :i32 = k[18];
  const K3_19 :i32 = k[19];
  const K3_20 :i32 = k[20];
  const K3_21 :i32 = k[21];
  const K3_22 :i32 = k[22];
  const K3_23 :i32 = k[23];
  const K3_24 :i32 = k[24];
  const K3_25 :i32 = k[25];
  const K3_26 :i32 = k[26];
  const K3_27 :i32 = k[27];
  const K3_28 :i32 = k[28];
  const K3_29 :i32 = k[29];
  const K3_30 :i32 = k[30];
  const K3_31 :i32 = k[31];
  const K3_32 :i32 = k[32];
  const K3_33 :i32 = k[33];
  const K3_34 :i32 = k[34];
  const K3_35 :i32 = k[35];
  const K3_36 :i32 = k[36];
  const K3_37 :i32 = k[37];
  const K3_38 :i32 = k[38];
  const K3_39 :i32 = k[39];
  const K3_40 :i32 = k[40];
  const K3_41 :i32 = k[41];
  const K3_42 :i32 = k[42];
  const K3_43 :i32 = k[43];
  const K3_44 :i32 = k[44];
  const K3_45 :i32 = k[45];
  const K3_46 :i32 = k[46];
  const K3_47 :i32 = k[47];

  k = K[4];
  const K4_0  :i32 = k[0];
  const K4_1  :i32 = k[1];
  const K4_2  :i32 = k[2];
  const K4_3  :i32 = k[3];
  const K4_4  :i32 = k[4];
  const K4_5  :i32 = k[5];
  const K4_6  :i32 = k[6];
  const K4_7  :i32 = k[7];
  const K4_8  :i32 = k[8];
  const K4_9  :i32 = k[9];
  const K4_10 :i32 = k[10];
  const K4_11 :i32 = k[11];
  const K4_12 :i32 = k[12];
  const K4_13 :i32 = k[13];
  const K4_14 :i32 = k[14];
  const K4_15 :i32 = k[15];
  const K4_16 :i32 = k[16];
  const K4_17 :i32 = k[17];
  const K4_18 :i32 = k[18];
  const K4_19 :i32 = k[19];
  const K4_20 :i32 = k[20];
  const K4_21 :i32 = k[21];
  const K4_22 :i32 = k[22];
  const K4_23 :i32 = k[23];
  const K4_24 :i32 = k[24];
  const K4_25 :i32 = k[25];
  const K4_26 :i32 = k[26];
  const K4_27 :i32 = k[27];
  const K4_28 :i32 = k[28];
  const K4_29 :i32 = k[29];
  const K4_30 :i32 = k[30];
  const K4_31 :i32 = k[31];
  const K4_32 :i32 = k[32];
  const K4_33 :i32 = k[33];
  const K4_34 :i32 = k[34];
  const K4_35 :i32 = k[35];
  const K4_36 :i32 = k[36];
  const K4_37 :i32 = k[37];
  const K4_38 :i32 = k[38];
  const K4_39 :i32 = k[39];
  const K4_40 :i32 = k[40];
  const K4_41 :i32 = k[41];
  const K4_42 :i32 = k[42];
  const K4_43 :i32 = k[43];
  const K4_44 :i32 = k[44];
  const K4_45 :i32 = k[45];
  const K4_46 :i32 = k[46];
  const K4_47 :i32 = k[47];

  k = K[5];
  const K5_0  :i32 = k[0];
  const K5_1  :i32 = k[1];
  const K5_2  :i32 = k[2];
  const K5_3  :i32 = k[3];
  const K5_4  :i32 = k[4];
  const K5_5  :i32 = k[5];
  const K5_6  :i32 = k[6];
  const K5_7  :i32 = k[7];
  const K5_8  :i32 = k[8];
  const K5_9  :i32 = k[9];
  const K5_10 :i32 = k[10];
  const K5_11 :i32 = k[11];
  const K5_12 :i32 = k[12];
  const K5_13 :i32 = k[13];
  const K5_14 :i32 = k[14];
  const K5_15 :i32 = k[15];
  const K5_16 :i32 = k[16];
  const K5_17 :i32 = k[17];
  const K5_18 :i32 = k[18];
  const K5_19 :i32 = k[19];
  const K5_20 :i32 = k[20];
  const K5_21 :i32 = k[21];
  const K5_22 :i32 = k[22];
  const K5_23 :i32 = k[23];
  const K5_24 :i32 = k[24];
  const K5_25 :i32 = k[25];
  const K5_26 :i32 = k[26];
  const K5_27 :i32 = k[27];
  const K5_28 :i32 = k[28];
  const K5_29 :i32 = k[29];
  const K5_30 :i32 = k[30];
  const K5_31 :i32 = k[31];
  const K5_32 :i32 = k[32];
  const K5_33 :i32 = k[33];
  const K5_34 :i32 = k[34];
  const K5_35 :i32 = k[35];
  const K5_36 :i32 = k[36];
  const K5_37 :i32 = k[37];
  const K5_38 :i32 = k[38];
  const K5_39 :i32 = k[39];
  const K5_40 :i32 = k[40];
  const K5_41 :i32 = k[41];
  const K5_42 :i32 = k[42];
  const K5_43 :i32 = k[43];
  const K5_44 :i32 = k[44];
  const K5_45 :i32 = k[45];
  const K5_46 :i32 = k[46];
  const K5_47 :i32 = k[47];

  k = K[6];
  const K6_0  :i32 = k[0];
  const K6_1  :i32 = k[1];
  const K6_2  :i32 = k[2];
  const K6_3  :i32 = k[3];
  const K6_4  :i32 = k[4];
  const K6_5  :i32 = k[5];
  const K6_6  :i32 = k[6];
  const K6_7  :i32 = k[7];
  const K6_8  :i32 = k[8];
  const K6_9  :i32 = k[9];
  const K6_10 :i32 = k[10];
  const K6_11 :i32 = k[11];
  const K6_12 :i32 = k[12];
  const K6_13 :i32 = k[13];
  const K6_14 :i32 = k[14];
  const K6_15 :i32 = k[15];
  const K6_16 :i32 = k[16];
  const K6_17 :i32 = k[17];
  const K6_18 :i32 = k[18];
  const K6_19 :i32 = k[19];
  const K6_20 :i32 = k[20];
  const K6_21 :i32 = k[21];
  const K6_22 :i32 = k[22];
  const K6_23 :i32 = k[23];
  const K6_24 :i32 = k[24];
  const K6_25 :i32 = k[25];
  const K6_26 :i32 = k[26];
  const K6_27 :i32 = k[27];
  const K6_28 :i32 = k[28];
  const K6_29 :i32 = k[29];
  const K6_30 :i32 = k[30];
  const K6_31 :i32 = k[31];
  const K6_32 :i32 = k[32];
  const K6_33 :i32 = k[33];
  const K6_34 :i32 = k[34];
  const K6_35 :i32 = k[35];
  const K6_36 :i32 = k[36];
  const K6_37 :i32 = k[37];
  const K6_38 :i32 = k[38];
  const K6_39 :i32 = k[39];
  const K6_40 :i32 = k[40];
  const K6_41 :i32 = k[41];
  const K6_42 :i32 = k[42];
  const K6_43 :i32 = k[43];
  const K6_44 :i32 = k[44];
  const K6_45 :i32 = k[45];
  const K6_46 :i32 = k[46];
  const K6_47 :i32 = k[47];

  k = K[7];
  const K7_0  :i32 = k[0];
  const K7_1  :i32 = k[1];
  const K7_2  :i32 = k[2];
  const K7_3  :i32 = k[3];
  const K7_4  :i32 = k[4];
  const K7_5  :i32 = k[5];
  const K7_6  :i32 = k[6];
  const K7_7  :i32 = k[7];
  const K7_8  :i32 = k[8];
  const K7_9  :i32 = k[9];
  const K7_10 :i32 = k[10];
  const K7_11 :i32 = k[11];
  const K7_12 :i32 = k[12];
  const K7_13 :i32 = k[13];
  const K7_14 :i32 = k[14];
  const K7_15 :i32 = k[15];
  const K7_16 :i32 = k[16];
  const K7_17 :i32 = k[17];
  const K7_18 :i32 = k[18];
  const K7_19 :i32 = k[19];
  const K7_20 :i32 = k[20];
  const K7_21 :i32 = k[21];
  const K7_22 :i32 = k[22];
  const K7_23 :i32 = k[23];
  const K7_24 :i32 = k[24];
  const K7_25 :i32 = k[25];
  const K7_26 :i32 = k[26];
  const K7_27 :i32 = k[27];
  const K7_28 :i32 = k[28];
  const K7_29 :i32 = k[29];
  const K7_30 :i32 = k[30];
  const K7_31 :i32 = k[31];
  const K7_32 :i32 = k[32];
  const K7_33 :i32 = k[33];
  const K7_34 :i32 = k[34];
  const K7_35 :i32 = k[35];
  const K7_36 :i32 = k[36];
  const K7_37 :i32 = k[37];
  const K7_38 :i32 = k[38];
  const K7_39 :i32 = k[39];
  const K7_40 :i32 = k[40];
  const K7_41 :i32 = k[41];
  const K7_42 :i32 = k[42];
  const K7_43 :i32 = k[43];
  const K7_44 :i32 = k[44];
  const K7_45 :i32 = k[45];
  const K7_46 :i32 = k[46];
  const K7_47 :i32 = k[47];

  k = K[8];
  const K8_0  :i32 = k[0];
  const K8_1  :i32 = k[1];
  const K8_2  :i32 = k[2];
  const K8_3  :i32 = k[3];
  const K8_4  :i32 = k[4];
  const K8_5  :i32 = k[5];
  const K8_6  :i32 = k[6];
  const K8_7  :i32 = k[7];
  const K8_8  :i32 = k[8];
  const K8_9  :i32 = k[9];
  const K8_10 :i32 = k[10];
  const K8_11 :i32 = k[11];
  const K8_12 :i32 = k[12];
  const K8_13 :i32 = k[13];
  const K8_14 :i32 = k[14];
  const K8_15 :i32 = k[15];
  const K8_16 :i32 = k[16];
  const K8_17 :i32 = k[17];
  const K8_18 :i32 = k[18];
  const K8_19 :i32 = k[19];
  const K8_20 :i32 = k[20];
  const K8_21 :i32 = k[21];
  const K8_22 :i32 = k[22];
  const K8_23 :i32 = k[23];
  const K8_24 :i32 = k[24];
  const K8_25 :i32 = k[25];
  const K8_26 :i32 = k[26];
  const K8_27 :i32 = k[27];
  const K8_28 :i32 = k[28];
  const K8_29 :i32 = k[29];
  const K8_30 :i32 = k[30];
  const K8_31 :i32 = k[31];
  const K8_32 :i32 = k[32];
  const K8_33 :i32 = k[33];
  const K8_34 :i32 = k[34];
  const K8_35 :i32 = k[35];
  const K8_36 :i32 = k[36];
  const K8_37 :i32 = k[37];
  const K8_38 :i32 = k[38];
  const K8_39 :i32 = k[39];
  const K8_40 :i32 = k[40];
  const K8_41 :i32 = k[41];
  const K8_42 :i32 = k[42];
  const K8_43 :i32 = k[43];
  const K8_44 :i32 = k[44];
  const K8_45 :i32 = k[45];
  const K8_46 :i32 = k[46];
  const K8_47 :i32 = k[47];

  k = K[9];
  const K9_0  :i32 = k[0];
  const K9_1  :i32 = k[1];
  const K9_2  :i32 = k[2];
  const K9_3  :i32 = k[3];
  const K9_4  :i32 = k[4];
  const K9_5  :i32 = k[5];
  const K9_6  :i32 = k[6];
  const K9_7  :i32 = k[7];
  const K9_8  :i32 = k[8];
  const K9_9  :i32 = k[9];
  const K9_10 :i32 = k[10];
  const K9_11 :i32 = k[11];
  const K9_12 :i32 = k[12];
  const K9_13 :i32 = k[13];
  const K9_14 :i32 = k[14];
  const K9_15 :i32 = k[15];
  const K9_16 :i32 = k[16];
  const K9_17 :i32 = k[17];
  const K9_18 :i32 = k[18];
  const K9_19 :i32 = k[19];
  const K9_20 :i32 = k[20];
  const K9_21 :i32 = k[21];
  const K9_22 :i32 = k[22];
  const K9_23 :i32 = k[23];
  const K9_24 :i32 = k[24];
  const K9_25 :i32 = k[25];
  const K9_26 :i32 = k[26];
  const K9_27 :i32 = k[27];
  const K9_28 :i32 = k[28];
  const K9_29 :i32 = k[29];
  const K9_30 :i32 = k[30];
  const K9_31 :i32 = k[31];
  const K9_32 :i32 = k[32];
  const K9_33 :i32 = k[33];
  const K9_34 :i32 = k[34];
  const K9_35 :i32 = k[35];
  const K9_36 :i32 = k[36];
  const K9_37 :i32 = k[37];
  const K9_38 :i32 = k[38];
  const K9_39 :i32 = k[39];
  const K9_40 :i32 = k[40];
  const K9_41 :i32 = k[41];
  const K9_42 :i32 = k[42];
  const K9_43 :i32 = k[43];
  const K9_44 :i32 = k[44];
  const K9_45 :i32 = k[45];
  const K9_46 :i32 = k[46];
  const K9_47 :i32 = k[47];


  k = K[10];
  const K10_0  :i32 = k[0];
  const K10_1  :i32 = k[1];
  const K10_2  :i32 = k[2];
  const K10_3  :i32 = k[3];
  const K10_4  :i32 = k[4];
  const K10_5  :i32 = k[5];
  const K10_6  :i32 = k[6];
  const K10_7  :i32 = k[7];
  const K10_8  :i32 = k[8];
  const K10_9  :i32 = k[9];
  const K10_10 :i32 = k[10];
  const K10_11 :i32 = k[11];
  const K10_12 :i32 = k[12];
  const K10_13 :i32 = k[13];
  const K10_14 :i32 = k[14];
  const K10_15 :i32 = k[15];
  const K10_16 :i32 = k[16];
  const K10_17 :i32 = k[17];
  const K10_18 :i32 = k[18];
  const K10_19 :i32 = k[19];
  const K10_20 :i32 = k[20];
  const K10_21 :i32 = k[21];
  const K10_22 :i32 = k[22];
  const K10_23 :i32 = k[23];
  const K10_24 :i32 = k[24];
  const K10_25 :i32 = k[25];
  const K10_26 :i32 = k[26];
  const K10_27 :i32 = k[27];
  const K10_28 :i32 = k[28];
  const K10_29 :i32 = k[29];
  const K10_30 :i32 = k[30];
  const K10_31 :i32 = k[31];
  const K10_32 :i32 = k[32];
  const K10_33 :i32 = k[33];
  const K10_34 :i32 = k[34];
  const K10_35 :i32 = k[35];
  const K10_36 :i32 = k[36];
  const K10_37 :i32 = k[37];
  const K10_38 :i32 = k[38];
  const K10_39 :i32 = k[39];
  const K10_40 :i32 = k[40];
  const K10_41 :i32 = k[41];
  const K10_42 :i32 = k[42];
  const K10_43 :i32 = k[43];
  const K10_44 :i32 = k[44];
  const K10_45 :i32 = k[45];
  const K10_46 :i32 = k[46];
  const K10_47 :i32 = k[47];


  k = K[11];
  const K11_0  :i32 = k[0];
  const K11_1  :i32 = k[1];
  const K11_2  :i32 = k[2];
  const K11_3  :i32 = k[3];
  const K11_4  :i32 = k[4];
  const K11_5  :i32 = k[5];
  const K11_6  :i32 = k[6];
  const K11_7  :i32 = k[7];
  const K11_8  :i32 = k[8];
  const K11_9  :i32 = k[9];
  const K11_10 :i32 = k[10];
  const K11_11 :i32 = k[11];
  const K11_12 :i32 = k[12];
  const K11_13 :i32 = k[13];
  const K11_14 :i32 = k[14];
  const K11_15 :i32 = k[15];
  const K11_16 :i32 = k[16];
  const K11_17 :i32 = k[17];
  const K11_18 :i32 = k[18];
  const K11_19 :i32 = k[19];
  const K11_20 :i32 = k[20];
  const K11_21 :i32 = k[21];
  const K11_22 :i32 = k[22];
  const K11_23 :i32 = k[23];
  const K11_24 :i32 = k[24];
  const K11_25 :i32 = k[25];
  const K11_26 :i32 = k[26];
  const K11_27 :i32 = k[27];
  const K11_28 :i32 = k[28];
  const K11_29 :i32 = k[29];
  const K11_30 :i32 = k[30];
  const K11_31 :i32 = k[31];
  const K11_32 :i32 = k[32];
  const K11_33 :i32 = k[33];
  const K11_34 :i32 = k[34];
  const K11_35 :i32 = k[35];
  const K11_36 :i32 = k[36];
  const K11_37 :i32 = k[37];
  const K11_38 :i32 = k[38];
  const K11_39 :i32 = k[39];
  const K11_40 :i32 = k[40];
  const K11_41 :i32 = k[41];
  const K11_42 :i32 = k[42];
  const K11_43 :i32 = k[43];
  const K11_44 :i32 = k[44];
  const K11_45 :i32 = k[45];
  const K11_46 :i32 = k[46];
  const K11_47 :i32 = k[47];


  k = K[12];
  const K12_0  :i32 = k[0];
  const K12_1  :i32 = k[1];
  const K12_2  :i32 = k[2];
  const K12_3  :i32 = k[3];
  const K12_4  :i32 = k[4];
  const K12_5  :i32 = k[5];
  const K12_6  :i32 = k[6];
  const K12_7  :i32 = k[7];
  const K12_8  :i32 = k[8];
  const K12_9  :i32 = k[9];
  const K12_10 :i32 = k[10];
  const K12_11 :i32 = k[11];
  const K12_12 :i32 = k[12];
  const K12_13 :i32 = k[13];
  const K12_14 :i32 = k[14];
  const K12_15 :i32 = k[15];
  const K12_16 :i32 = k[16];
  const K12_17 :i32 = k[17];
  const K12_18 :i32 = k[18];
  const K12_19 :i32 = k[19];
  const K12_20 :i32 = k[20];
  const K12_21 :i32 = k[21];
  const K12_22 :i32 = k[22];
  const K12_23 :i32 = k[23];
  const K12_24 :i32 = k[24];
  const K12_25 :i32 = k[25];
  const K12_26 :i32 = k[26];
  const K12_27 :i32 = k[27];
  const K12_28 :i32 = k[28];
  const K12_29 :i32 = k[29];
  const K12_30 :i32 = k[30];
  const K12_31 :i32 = k[31];
  const K12_32 :i32 = k[32];
  const K12_33 :i32 = k[33];
  const K12_34 :i32 = k[34];
  const K12_35 :i32 = k[35];
  const K12_36 :i32 = k[36];
  const K12_37 :i32 = k[37];
  const K12_38 :i32 = k[38];
  const K12_39 :i32 = k[39];
  const K12_40 :i32 = k[40];
  const K12_41 :i32 = k[41];
  const K12_42 :i32 = k[42];
  const K12_43 :i32 = k[43];
  const K12_44 :i32 = k[44];
  const K12_45 :i32 = k[45];
  const K12_46 :i32 = k[46];
  const K12_47 :i32 = k[47];


  k = K[13];
  const K13_0  :i32 = k[0];
  const K13_1  :i32 = k[1];
  const K13_2  :i32 = k[2];
  const K13_3  :i32 = k[3];
  const K13_4  :i32 = k[4];
  const K13_5  :i32 = k[5];
  const K13_6  :i32 = k[6];
  const K13_7  :i32 = k[7];
  const K13_8  :i32 = k[8];
  const K13_9  :i32 = k[9];
  const K13_10 :i32 = k[10];
  const K13_11 :i32 = k[11];
  const K13_12 :i32 = k[12];
  const K13_13 :i32 = k[13];
  const K13_14 :i32 = k[14];
  const K13_15 :i32 = k[15];
  const K13_16 :i32 = k[16];
  const K13_17 :i32 = k[17];
  const K13_18 :i32 = k[18];
  const K13_19 :i32 = k[19];
  const K13_20 :i32 = k[20];
  const K13_21 :i32 = k[21];
  const K13_22 :i32 = k[22];
  const K13_23 :i32 = k[23];
  const K13_24 :i32 = k[24];
  const K13_25 :i32 = k[25];
  const K13_26 :i32 = k[26];
  const K13_27 :i32 = k[27];
  const K13_28 :i32 = k[28];
  const K13_29 :i32 = k[29];
  const K13_30 :i32 = k[30];
  const K13_31 :i32 = k[31];
  const K13_32 :i32 = k[32];
  const K13_33 :i32 = k[33];
  const K13_34 :i32 = k[34];
  const K13_35 :i32 = k[35];
  const K13_36 :i32 = k[36];
  const K13_37 :i32 = k[37];
  const K13_38 :i32 = k[38];
  const K13_39 :i32 = k[39];
  const K13_40 :i32 = k[40];
  const K13_41 :i32 = k[41];
  const K13_42 :i32 = k[42];
  const K13_43 :i32 = k[43];
  const K13_44 :i32 = k[44];
  const K13_45 :i32 = k[45];
  const K13_46 :i32 = k[46];
  const K13_47 :i32 = k[47];


  k = K[14];
  const K14_0  :i32 = k[0];
  const K14_1  :i32 = k[1];
  const K14_2  :i32 = k[2];
  const K14_3  :i32 = k[3];
  const K14_4  :i32 = k[4];
  const K14_5  :i32 = k[5];
  const K14_6  :i32 = k[6];
  const K14_7  :i32 = k[7];
  const K14_8  :i32 = k[8];
  const K14_9  :i32 = k[9];
  const K14_10 :i32 = k[10];
  const K14_11 :i32 = k[11];
  const K14_12 :i32 = k[12];
  const K14_13 :i32 = k[13];
  const K14_14 :i32 = k[14];
  const K14_15 :i32 = k[15];
  const K14_16 :i32 = k[16];
  const K14_17 :i32 = k[17];
  const K14_18 :i32 = k[18];
  const K14_19 :i32 = k[19];
  const K14_20 :i32 = k[20];
  const K14_21 :i32 = k[21];
  const K14_22 :i32 = k[22];
  const K14_23 :i32 = k[23];
  const K14_24 :i32 = k[24];
  const K14_25 :i32 = k[25];
  const K14_26 :i32 = k[26];
  const K14_27 :i32 = k[27];
  const K14_28 :i32 = k[28];
  const K14_29 :i32 = k[29];
  const K14_30 :i32 = k[30];
  const K14_31 :i32 = k[31];
  const K14_32 :i32 = k[32];
  const K14_33 :i32 = k[33];
  const K14_34 :i32 = k[34];
  const K14_35 :i32 = k[35];
  const K14_36 :i32 = k[36];
  const K14_37 :i32 = k[37];
  const K14_38 :i32 = k[38];
  const K14_39 :i32 = k[39];
  const K14_40 :i32 = k[40];
  const K14_41 :i32 = k[41];
  const K14_42 :i32 = k[42];
  const K14_43 :i32 = k[43];
  const K14_44 :i32 = k[44];
  const K14_45 :i32 = k[45];
  const K14_46 :i32 = k[46];
  const K14_47 :i32 = k[47];


  k = K[15];
  const K15_0  :i32 = k[0];
  const K15_1  :i32 = k[1];
  const K15_2  :i32 = k[2];
  const K15_3  :i32 = k[3];
  const K15_4  :i32 = k[4];
  const K15_5  :i32 = k[5];
  const K15_6  :i32 = k[6];
  const K15_7  :i32 = k[7];
  const K15_8  :i32 = k[8];
  const K15_9  :i32 = k[9];
  const K15_10 :i32 = k[10];
  const K15_11 :i32 = k[11];
  const K15_12 :i32 = k[12];
  const K15_13 :i32 = k[13];
  const K15_14 :i32 = k[14];
  const K15_15 :i32 = k[15];
  const K15_16 :i32 = k[16];
  const K15_17 :i32 = k[17];
  const K15_18 :i32 = k[18];
  const K15_19 :i32 = k[19];
  const K15_20 :i32 = k[20];
  const K15_21 :i32 = k[21];
  const K15_22 :i32 = k[22];
  const K15_23 :i32 = k[23];
  const K15_24 :i32 = k[24];
  const K15_25 :i32 = k[25];
  const K15_26 :i32 = k[26];
  const K15_27 :i32 = k[27];
  const K15_28 :i32 = k[28];
  const K15_29 :i32 = k[29];
  const K15_30 :i32 = k[30];
  const K15_31 :i32 = k[31];
  const K15_32 :i32 = k[32];
  const K15_33 :i32 = k[33];
  const K15_34 :i32 = k[34];
  const K15_35 :i32 = k[35];
  const K15_36 :i32 = k[36];
  const K15_37 :i32 = k[37];
  const K15_38 :i32 = k[38];
  const K15_39 :i32 = k[39];
  const K15_40 :i32 = k[40];
  const K15_41 :i32 = k[41];
  const K15_42 :i32 = k[42];
  const K15_43 :i32 = k[43];
  const K15_44 :i32 = k[44];
  const K15_45 :i32 = k[45];
  const K15_46 :i32 = k[46];
  const K15_47 :i32 = k[47];


  k = K[16];
  const K16_0  :i32 = k[0];
  const K16_1  :i32 = k[1];
  const K16_2  :i32 = k[2];
  const K16_3  :i32 = k[3];
  const K16_4  :i32 = k[4];
  const K16_5  :i32 = k[5];
  const K16_6  :i32 = k[6];
  const K16_7  :i32 = k[7];
  const K16_8  :i32 = k[8];
  const K16_9  :i32 = k[9];
  const K16_10 :i32 = k[10];
  const K16_11 :i32 = k[11];
  const K16_12 :i32 = k[12];
  const K16_13 :i32 = k[13];
  const K16_14 :i32 = k[14];
  const K16_15 :i32 = k[15];
  const K16_16 :i32 = k[16];
  const K16_17 :i32 = k[17];
  const K16_18 :i32 = k[18];
  const K16_19 :i32 = k[19];
  const K16_20 :i32 = k[20];
  const K16_21 :i32 = k[21];
  const K16_22 :i32 = k[22];
  const K16_23 :i32 = k[23];
  const K16_24 :i32 = k[24];
  const K16_25 :i32 = k[25];
  const K16_26 :i32 = k[26];
  const K16_27 :i32 = k[27];
  const K16_28 :i32 = k[28];
  const K16_29 :i32 = k[29];
  const K16_30 :i32 = k[30];
  const K16_31 :i32 = k[31];
  const K16_32 :i32 = k[32];
  const K16_33 :i32 = k[33];
  const K16_34 :i32 = k[34];
  const K16_35 :i32 = k[35];
  const K16_36 :i32 = k[36];
  const K16_37 :i32 = k[37];
  const K16_38 :i32 = k[38];
  const K16_39 :i32 = k[39];
  const K16_40 :i32 = k[40];
  const K16_41 :i32 = k[41];
  const K16_42 :i32 = k[42];
  const K16_43 :i32 = k[43];
  const K16_44 :i32 = k[44];
  const K16_45 :i32 = k[45];
  const K16_46 :i32 = k[46];
  const K16_47 :i32 = k[47];

  k = K[17];
  const K17_0  :i32 = k[0];
  const K17_1  :i32 = k[1];
  const K17_2  :i32 = k[2];
  const K17_3  :i32 = k[3];
  const K17_4  :i32 = k[4];
  const K17_5  :i32 = k[5];
  const K17_6  :i32 = k[6];
  const K17_7  :i32 = k[7];
  const K17_8  :i32 = k[8];
  const K17_9  :i32 = k[9];
  const K17_10 :i32 = k[10];
  const K17_11 :i32 = k[11];
  const K17_12 :i32 = k[12];
  const K17_13 :i32 = k[13];
  const K17_14 :i32 = k[14];
  const K17_15 :i32 = k[15];
  const K17_16 :i32 = k[16];
  const K17_17 :i32 = k[17];
  const K17_18 :i32 = k[18];
  const K17_19 :i32 = k[19];
  const K17_20 :i32 = k[20];
  const K17_21 :i32 = k[21];
  const K17_22 :i32 = k[22];
  const K17_23 :i32 = k[23];
  const K17_24 :i32 = k[24];
  const K17_25 :i32 = k[25];
  const K17_26 :i32 = k[26];
  const K17_27 :i32 = k[27];
  const K17_28 :i32 = k[28];
  const K17_29 :i32 = k[29];
  const K17_30 :i32 = k[30];
  const K17_31 :i32 = k[31];
  const K17_32 :i32 = k[32];
  const K17_33 :i32 = k[33];
  const K17_34 :i32 = k[34];
  const K17_35 :i32 = k[35];
  const K17_36 :i32 = k[36];
  const K17_37 :i32 = k[37];
  const K17_38 :i32 = k[38];
  const K17_39 :i32 = k[39];
  const K17_40 :i32 = k[40];
  const K17_41 :i32 = k[41];
  const K17_42 :i32 = k[42];
  const K17_43 :i32 = k[43];
  const K17_44 :i32 = k[44];
  const K17_45 :i32 = k[45];
  const K17_46 :i32 = k[46];
  const K17_47 :i32 = k[47];


  for(round_n = 0; round_n < 25; round_n++) {
    set_initial_lr(L, R, round_n);
    
    for(i = 0; i < 16; i++) {
      k = K[i];

        row = ( ( k[5] ^ R[ET5] ) << 0 )
            + ( ( k[0] ^ R[ET0] ) << 1 );
        col = ( ( k[4] ^ R[ET4] ) << 0 )
            + ( ( k[3] ^ R[ET3] ) << 1 )
            + ( ( k[2] ^ R[ET2] ) << 2 )
            + ( ( k[1] ^ R[ET1] ) << 3 );
        dec = s_box_table[ 0 + row*16 + col ];
        L[IST0] = L[IST0] ^ ( (dec >> 3) & 1 );
        L[IST1] = L[IST1] ^ ( (dec >> 2) & 1 );
        L[IST2] = L[IST2] ^ ( (dec >> 1) & 1 );
        L[IST3] = L[IST3] ^ ( (dec >> 0) & 1 );

        row = ( ( k[11] ^ R[ET11] ) << 0 )
            + ( ( k[6]  ^ R[ET6 ] ) << 1 );
        col = ( ( k[10] ^ R[ET10] ) << 0 )
            + ( ( k[9]  ^ R[ET9 ] ) << 1 )
            + ( ( k[8]  ^ R[ET8 ] ) << 2 )
            + ( ( k[7]  ^ R[ET7 ] ) << 3 );
        dec = s_box_table[ 64 + row*16 + col ];
        L[IST4] = L[IST4] ^ ( (dec >> 3) & 1 );
        L[IST5] = L[IST5] ^ ( (dec >> 2) & 1 );
        L[IST6] = L[IST6] ^ ( (dec >> 1) & 1 );
        L[IST7] = L[IST7] ^ ( (dec >> 0) & 1 );
 
        row = ( ( k[17] ^ R[ET17] ) << 0 )
            + ( ( k[12] ^ R[ET12] ) << 1 );
        col = ( ( k[16] ^ R[ET16] ) << 0 )
            + ( ( k[15] ^ R[ET15] ) << 1 )
            + ( ( k[14] ^ R[ET14] ) << 2 )
            + ( ( k[13] ^ R[ET13] ) << 3 );
        dec = s_box_table[ 128 + row*16 + col ];
        L[IST8 ] = L[IST8 ] ^ ( (dec >> 3) & 1 );
        L[IST9 ] = L[IST9 ] ^ ( (dec >> 2) & 1 );
        L[IST10] = L[IST10] ^ ( (dec >> 1) & 1 );
        L[IST11] = L[IST11] ^ ( (dec >> 0) & 1 );     

        row = ( ( k[23] ^ R[ET23] ) << 0 )
            + ( ( k[18] ^ R[ET18] ) << 1 );
        col = ( ( k[22] ^ R[ET22] ) << 0 )
            + ( ( k[21] ^ R[ET21] ) << 1 )
            + ( ( k[20] ^ R[ET20] ) << 2 )
            + ( ( k[19] ^ R[ET19] ) << 3 );
        dec = s_box_table[ 192 + row*16 + col ];
        L[IST12] = L[IST12] ^ ( (dec >> 3) & 1 );
        L[IST13] = L[IST13] ^ ( (dec >> 2) & 1 );
        L[IST14] = L[IST14] ^ ( (dec >> 1) & 1 );
        L[IST15] = L[IST15] ^ ( (dec >> 0) & 1 );
      
        row = ( ( k[29] ^ R[ET29] ) << 0 )
            + ( ( k[24] ^ R[ET24] ) << 1 );
        col = ( ( k[28] ^ R[ET28] ) << 0 )
            + ( ( k[27] ^ R[ET27] ) << 1 )
            + ( ( k[26] ^ R[ET26] ) << 2 )
            + ( ( k[25] ^ R[ET25] ) << 3 );
        dec = s_box_table[ 256 + row*16 + col ];
        L[IST16] = L[IST16] ^ ( (dec >> 3) & 1 );
        L[IST17] = L[IST17] ^ ( (dec >> 2) & 1 );
        L[IST18] = L[IST18] ^ ( (dec >> 1) & 1 );
        L[IST19] = L[IST19] ^ ( (dec >> 0) & 1 );

        row = ( ( k[35] ^ R[ET35] ) << 0 )
            + ( ( k[30] ^ R[ET30] ) << 1 );
        col = ( ( k[34] ^ R[ET34] ) << 0 )
            + ( ( k[33] ^ R[ET33] ) << 1 )
            + ( ( k[32] ^ R[ET32] ) << 2 )
            + ( ( k[31] ^ R[ET31] ) << 3 );
        dec = s_box_table[ 320 + row*16 + col ];
        L[IST20] = L[IST20] ^ ( (dec >> 3) & 1 );
        L[IST21] = L[IST21] ^ ( (dec >> 2) & 1 );
        L[IST22] = L[IST22] ^ ( (dec >> 1) & 1 );
        L[IST23] = L[IST23] ^ ( (dec >> 0) & 1 );

        row = ( ( k[41] ^ R[ET41] ) << 0 )
            + ( ( k[36] ^ R[ET36] ) << 1 );
        col = ( ( k[40] ^ R[ET40] ) << 0 )
            + ( ( k[39] ^ R[ET39] ) << 1 )
            + ( ( k[38] ^ R[ET38] ) << 2 )
            + ( ( k[37] ^ R[ET37] ) << 3 );
        dec = s_box_table[ 384 + row*16 + col ];
        L[IST24] = L[IST24] ^ ( (dec >> 3) & 1 );
        L[IST25] = L[IST25] ^ ( (dec >> 2) & 1 );
        L[IST26] = L[IST26] ^ ( (dec >> 1) & 1 );
        L[IST27] = L[IST27] ^ ( (dec >> 0) & 1 );
      
        row = ( ( k[47] ^ R[ET47] ) << 0 )
            + ( ( k[42] ^ R[ET42] ) << 1 );
        col = ( ( k[46] ^ R[ET46] ) << 0 )
            + ( ( k[45] ^ R[ET45] ) << 1 )
            + ( ( k[44] ^ R[ET44] ) << 2 )
            + ( ( k[43] ^ R[ET43] ) << 3 );
        dec = s_box_table[ 448 + row*16 + col ];
        L[IST28] = L[IST28] ^ ( (dec >> 3) & 1 );
        L[IST29] = L[IST29] ^ ( (dec >> 2) & 1 );
        L[IST30] = L[IST30] ^ ( (dec >> 1) & 1 );
        L[IST31] = L[IST31] ^ ( (dec >> 0) & 1 );

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

