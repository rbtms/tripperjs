

// Some helpers
function store_i32(index :i32, n :i32, mem_offset :i32) :void {
  store<i8>( 20000 + (mem_offset)*13 + index, <i8>n);
}

/*************************************
* Left side Initial permutation (IP)
*************************************/
/*
const initial_table_L :i32[] = [
  57, 49, 41, 33, 25, 17,  9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];
*/
   

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
/*
const initial_table_R :i32[] = [
  56, 48, 40, 32, 24, 16,  8, 0,
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6
];
 */

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
//const shift_offset :i32[] = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

const SOFF0  :i32 = 1;
const SOFF1  :i32 = 2;
const SOFF2  :i32 = 4;
const SOFF3  :i32 = 6;
const SOFF4  :i32 = 8;
const SOFF5  :i32 = 10;
const SOFF6  :i32 = 12;
const SOFF7  :i32 = 14;
const SOFF8  :i32 = 15;
const SOFF9  :i32 = 17;
const SOFF10 :i32 = 19;
const SOFF11 :i32 = 21;
const SOFF12 :i32 = 23;
const SOFF13 :i32 = 25;
const SOFF14 :i32 = 27;
const SOFF15 :i32 = 28;

/*
const compression_table :i32[] = [
  13, 16, 10, 23,  0,  4,  2, 27,
  14,  5, 20,  9, 22, 18, 11,  3,
  25,  7, 15,  6, 26, 19, 12,  1,
  40, 51, 30, 36, 46, 54, 29, 39,
  50, 44, 32, 47, 43, 48, 38, 55,
  33, 52, 45, 41, 49, 35, 28, 31
];
 */

let CT0  :i32 = 13;
let CT1  :i32 = 16;
let CT2  :i32 = 10;
let CT3  :i32 = 23;
let CT4  :i32 = 0;
let CT5  :i32 = 4;
let CT6  :i32 = 2;
let CT7  :i32 = 27;

let CT8  :i32 = 14;
let CT9  :i32 = 5;
let CT10 :i32 = 20;
let CT11 :i32 = 9;
let CT12 :i32 = 22;
let CT13 :i32 = 18;
let CT14 :i32 = 11;
let CT15 :i32 = 3;

let CT16 :i32 = 25;
let CT17 :i32 = 7;
let CT18 :i32 = 15;
let CT19 :i32 = 6;
let CT20 :i32 = 26;
let CT21 :i32 = 19;
let CT22 :i32 = 12;
let CT23 :i32 = 1;

let CT24 :i32 = 40;
let CT25 :i32 = 51;
let CT26 :i32 = 30;
let CT27 :i32 = 36;
let CT28 :i32 = 46;
let CT29 :i32 = 54;
let CT30 :i32 = 29;
let CT31 :i32 = 39;

let CT32 :i32 = 50;
let CT33 :i32 = 44;
let CT34 :i32 = 32;
let CT35 :i32 = 47;
let CT36 :i32 = 43;
let CT37 :i32 = 48;
let CT38 :i32 = 38;
let CT39 :i32 = 55;

let CT40 :i32 = 33;
let CT41 :i32 = 52;
let CT42 :i32 = 45;
let CT43 :i32 = 41;
let CT44 :i32 = 49;
let CT45 :i32 = 35;
let CT46 :i32 = 28;
let CT47 :i32 = 31;

let CT24_MOD :i32 = CT24 % 28;
let CT25_MOD :i32 = CT25 % 28;
let CT26_MOD :i32 = CT26 % 28;
let CT27_MOD :i32 = CT27 % 28;
let CT28_MOD :i32 = CT28 % 28;
let CT29_MOD :i32 = CT29 % 28;
let CT30_MOD :i32 = CT30 % 28;
let CT31_MOD :i32 = CT31 % 28;
let CT32_MOD :i32 = CT32 % 28;
let CT33_MOD :i32 = CT33 % 28;
let CT34_MOD :i32 = CT34 % 28;
let CT35_MOD :i32 = CT35 % 28;
let CT36_MOD :i32 = CT36 % 28;
let CT37_MOD :i32 = CT37 % 28;
let CT38_MOD :i32 = CT38 % 28;
let CT39_MOD :i32 = CT39 % 28;
let CT40_MOD :i32 = CT40 % 28;
let CT41_MOD :i32 = CT41 % 28;
let CT42_MOD :i32 = CT42 % 28;
let CT43_MOD :i32 = CT43 % 28;
let CT44_MOD :i32 = CT44 % 28;
let CT45_MOD :i32 = CT45 % 28;
let CT46_MOD :i32 = CT46 % 28;
let CT47_MOD :i32 = CT47 % 28;


/*
  for(i = 0; i < 56; i++)
    PARITY_DROP[i] = PWD_BIN[ parity_drop_table[i] ];

  for(i = 0; i < 16; i++) {
    offset = shift_offset[i];

    for(j = 0; j < 48; j++) {
      value = compression_table[j];

      k[i][j] = value < 28
        ? PARITY_DROP[ (offset + value    )%28      ]
        : PARITY_DROP[ (offset + value_mod)%28 + 28 ];
    }
  }
 */

let SOFF0_CT0  :i32 = (SOFF0 + CT0)  % 28;
let SOFF0_CT1  :i32 = (SOFF0 + CT1)  % 28;
let SOFF0_CT2  :i32 = (SOFF0 + CT2)  % 28;
let SOFF0_CT3  :i32 = (SOFF0 + CT3)  % 28;
let SOFF0_CT4  :i32 = (SOFF0 + CT4)  % 28;
let SOFF0_CT5  :i32 = (SOFF0 + CT5)  % 28;
let SOFF0_CT6  :i32 = (SOFF0 + CT6)  % 28;
let SOFF0_CT7  :i32 = (SOFF0 + CT7)  % 28;
let SOFF0_CT8  :i32 = (SOFF0 + CT8)  % 28;
let SOFF0_CT9  :i32 = (SOFF0 + CT9)  % 28;
let SOFF0_CT10 :i32 = (SOFF0 + CT10) % 28;
let SOFF0_CT11 :i32 = (SOFF0 + CT11) % 28;
let SOFF0_CT12 :i32 = (SOFF0 + CT12) % 28;
let SOFF0_CT13 :i32 = (SOFF0 + CT13) % 28;
let SOFF0_CT14 :i32 = (SOFF0 + CT14) % 28;
let SOFF0_CT15 :i32 = (SOFF0 + CT15) % 28;
let SOFF0_CT16 :i32 = (SOFF0 + CT16) % 28;
let SOFF0_CT17 :i32 = (SOFF0 + CT17) % 28;
let SOFF0_CT18 :i32 = (SOFF0 + CT18) % 28;
let SOFF0_CT19 :i32 = (SOFF0 + CT19) % 28;
let SOFF0_CT20 :i32 = (SOFF0 + CT20) % 28;
let SOFF0_CT21 :i32 = (SOFF0 + CT21) % 28;
let SOFF0_CT22 :i32 = (SOFF0 + CT22) % 28;
let SOFF0_CT23 :i32 = (SOFF0 + CT23) % 28;

let SOFF1_CT0  :i32 = (SOFF1 + CT0)  % 28;
let SOFF1_CT1  :i32 = (SOFF1 + CT1)  % 28;
let SOFF1_CT2  :i32 = (SOFF1 + CT2)  % 28;
let SOFF1_CT3  :i32 = (SOFF1 + CT3)  % 28;
let SOFF1_CT4  :i32 = (SOFF1 + CT4)  % 28;
let SOFF1_CT5  :i32 = (SOFF1 + CT5)  % 28;
let SOFF1_CT6  :i32 = (SOFF1 + CT6)  % 28;
let SOFF1_CT7  :i32 = (SOFF1 + CT7)  % 28;
let SOFF1_CT8  :i32 = (SOFF1 + CT8)  % 28;
let SOFF1_CT9  :i32 = (SOFF1 + CT9)  % 28;
let SOFF1_CT10 :i32 = (SOFF1 + CT10) % 28;
let SOFF1_CT11 :i32 = (SOFF1 + CT11) % 28;
let SOFF1_CT12 :i32 = (SOFF1 + CT12) % 28;
let SOFF1_CT13 :i32 = (SOFF1 + CT13) % 28;
let SOFF1_CT14 :i32 = (SOFF1 + CT14) % 28;
let SOFF1_CT15 :i32 = (SOFF1 + CT15) % 28;
let SOFF1_CT16 :i32 = (SOFF1 + CT16) % 28;
let SOFF1_CT17 :i32 = (SOFF1 + CT17) % 28;
let SOFF1_CT18 :i32 = (SOFF1 + CT18) % 28;
let SOFF1_CT19 :i32 = (SOFF1 + CT19) % 28;
let SOFF1_CT20 :i32 = (SOFF1 + CT20) % 28;
let SOFF1_CT21 :i32 = (SOFF1 + CT21) % 28;
let SOFF1_CT22 :i32 = (SOFF1 + CT22) % 28;
let SOFF1_CT23 :i32 = (SOFF1 + CT23) % 28;

let SOFF2_CT0  :i32 = (SOFF2 + CT0)  % 28;
let SOFF2_CT1  :i32 = (SOFF2 + CT1)  % 28;
let SOFF2_CT2  :i32 = (SOFF2 + CT2)  % 28;
let SOFF2_CT3  :i32 = (SOFF2 + CT3)  % 28;
let SOFF2_CT4  :i32 = (SOFF2 + CT4)  % 28;
let SOFF2_CT5  :i32 = (SOFF2 + CT5)  % 28;
let SOFF2_CT6  :i32 = (SOFF2 + CT6)  % 28;
let SOFF2_CT7  :i32 = (SOFF2 + CT7)  % 28;
let SOFF2_CT8  :i32 = (SOFF2 + CT8)  % 28;
let SOFF2_CT9  :i32 = (SOFF2 + CT9)  % 28;
let SOFF2_CT10 :i32 = (SOFF2 + CT10) % 28;
let SOFF2_CT11 :i32 = (SOFF2 + CT11) % 28;
let SOFF2_CT12 :i32 = (SOFF2 + CT12) % 28;
let SOFF2_CT13 :i32 = (SOFF2 + CT13) % 28;
let SOFF2_CT14 :i32 = (SOFF2 + CT14) % 28;
let SOFF2_CT15 :i32 = (SOFF2 + CT15) % 28;
let SOFF2_CT16 :i32 = (SOFF2 + CT16) % 28;
let SOFF2_CT17 :i32 = (SOFF2 + CT17) % 28;
let SOFF2_CT18 :i32 = (SOFF2 + CT18) % 28;
let SOFF2_CT19 :i32 = (SOFF2 + CT19) % 28;
let SOFF2_CT20 :i32 = (SOFF2 + CT20) % 28;
let SOFF2_CT21 :i32 = (SOFF2 + CT21) % 28;
let SOFF2_CT22 :i32 = (SOFF2 + CT22) % 28;
let SOFF2_CT23 :i32 = (SOFF2 + CT23) % 28;

let SOFF3_CT0  :i32 = (SOFF3 + CT0)  % 28;
let SOFF3_CT1  :i32 = (SOFF3 + CT1)  % 28;
let SOFF3_CT2  :i32 = (SOFF3 + CT2)  % 28;
let SOFF3_CT3  :i32 = (SOFF3 + CT3)  % 28;
let SOFF3_CT4  :i32 = (SOFF3 + CT4)  % 28;
let SOFF3_CT5  :i32 = (SOFF3 + CT5)  % 28;
let SOFF3_CT6  :i32 = (SOFF3 + CT6)  % 28;
let SOFF3_CT7  :i32 = (SOFF3 + CT7)  % 28;
let SOFF3_CT8  :i32 = (SOFF3 + CT8)  % 28;
let SOFF3_CT9  :i32 = (SOFF3 + CT9)  % 28;
let SOFF3_CT10 :i32 = (SOFF3 + CT10) % 28;
let SOFF3_CT11 :i32 = (SOFF3 + CT11) % 28;
let SOFF3_CT12 :i32 = (SOFF3 + CT12) % 28;
let SOFF3_CT13 :i32 = (SOFF3 + CT13) % 28;
let SOFF3_CT14 :i32 = (SOFF3 + CT14) % 28;
let SOFF3_CT15 :i32 = (SOFF3 + CT15) % 28;
let SOFF3_CT16 :i32 = (SOFF3 + CT16) % 28;
let SOFF3_CT17 :i32 = (SOFF3 + CT17) % 28;
let SOFF3_CT18 :i32 = (SOFF3 + CT18) % 28;
let SOFF3_CT19 :i32 = (SOFF3 + CT19) % 28;
let SOFF3_CT20 :i32 = (SOFF3 + CT20) % 28;
let SOFF3_CT21 :i32 = (SOFF3 + CT21) % 28;
let SOFF3_CT22 :i32 = (SOFF3 + CT22) % 28;
let SOFF3_CT23 :i32 = (SOFF3 + CT23) % 28;

let SOFF4_CT0  :i32 = (SOFF4 + CT0)  % 28;
let SOFF4_CT1  :i32 = (SOFF4 + CT1)  % 28;
let SOFF4_CT2  :i32 = (SOFF4 + CT2)  % 28;
let SOFF4_CT3  :i32 = (SOFF4 + CT3)  % 28;
let SOFF4_CT4  :i32 = (SOFF4 + CT4)  % 28;
let SOFF4_CT5  :i32 = (SOFF4 + CT5)  % 28;
let SOFF4_CT6  :i32 = (SOFF4 + CT6)  % 28;
let SOFF4_CT7  :i32 = (SOFF4 + CT7)  % 28;
let SOFF4_CT8  :i32 = (SOFF4 + CT8)  % 28;
let SOFF4_CT9  :i32 = (SOFF4 + CT9)  % 28;
let SOFF4_CT10 :i32 = (SOFF4 + CT10) % 28;
let SOFF4_CT11 :i32 = (SOFF4 + CT11) % 28;
let SOFF4_CT12 :i32 = (SOFF4 + CT12) % 28;
let SOFF4_CT13 :i32 = (SOFF4 + CT13) % 28;
let SOFF4_CT14 :i32 = (SOFF4 + CT14) % 28;
let SOFF4_CT15 :i32 = (SOFF4 + CT15) % 28;
let SOFF4_CT16 :i32 = (SOFF4 + CT16) % 28;
let SOFF4_CT17 :i32 = (SOFF4 + CT17) % 28;
let SOFF4_CT18 :i32 = (SOFF4 + CT18) % 28;
let SOFF4_CT19 :i32 = (SOFF4 + CT19) % 28;
let SOFF4_CT20 :i32 = (SOFF4 + CT20) % 28;
let SOFF4_CT21 :i32 = (SOFF4 + CT21) % 28;
let SOFF4_CT22 :i32 = (SOFF4 + CT22) % 28;
let SOFF4_CT23 :i32 = (SOFF4 + CT23) % 28;

let SOFF5_CT0  :i32 = (SOFF5 + CT0)  % 28;
let SOFF5_CT1  :i32 = (SOFF5 + CT1)  % 28;
let SOFF5_CT2  :i32 = (SOFF5 + CT2)  % 28;
let SOFF5_CT3  :i32 = (SOFF5 + CT3)  % 28;
let SOFF5_CT4  :i32 = (SOFF5 + CT4)  % 28;
let SOFF5_CT5  :i32 = (SOFF5 + CT5)  % 28;
let SOFF5_CT6  :i32 = (SOFF5 + CT6)  % 28;
let SOFF5_CT7  :i32 = (SOFF5 + CT7)  % 28;
let SOFF5_CT8  :i32 = (SOFF5 + CT8)  % 28;
let SOFF5_CT9  :i32 = (SOFF5 + CT9)  % 28;
let SOFF5_CT10 :i32 = (SOFF5 + CT10) % 28;
let SOFF5_CT11 :i32 = (SOFF5 + CT11) % 28;
let SOFF5_CT12 :i32 = (SOFF5 + CT12) % 28;
let SOFF5_CT13 :i32 = (SOFF5 + CT13) % 28;
let SOFF5_CT14 :i32 = (SOFF5 + CT14) % 28;
let SOFF5_CT15 :i32 = (SOFF5 + CT15) % 28;
let SOFF5_CT16 :i32 = (SOFF5 + CT16) % 28;
let SOFF5_CT17 :i32 = (SOFF5 + CT17) % 28;
let SOFF5_CT18 :i32 = (SOFF5 + CT18) % 28;
let SOFF5_CT19 :i32 = (SOFF5 + CT19) % 28;
let SOFF5_CT20 :i32 = (SOFF5 + CT20) % 28;
let SOFF5_CT21 :i32 = (SOFF5 + CT21) % 28;
let SOFF5_CT22 :i32 = (SOFF5 + CT22) % 28;
let SOFF5_CT23 :i32 = (SOFF5 + CT23) % 28;

let SOFF6_CT0  :i32 = (SOFF6 + CT0)  % 28;
let SOFF6_CT1  :i32 = (SOFF6 + CT1)  % 28;
let SOFF6_CT2  :i32 = (SOFF6 + CT2)  % 28;
let SOFF6_CT3  :i32 = (SOFF6 + CT3)  % 28;
let SOFF6_CT4  :i32 = (SOFF6 + CT4)  % 28;
let SOFF6_CT5  :i32 = (SOFF6 + CT5)  % 28;
let SOFF6_CT6  :i32 = (SOFF6 + CT6)  % 28;
let SOFF6_CT7  :i32 = (SOFF6 + CT7)  % 28;
let SOFF6_CT8  :i32 = (SOFF6 + CT8)  % 28;
let SOFF6_CT9  :i32 = (SOFF6 + CT9)  % 28;
let SOFF6_CT10 :i32 = (SOFF6 + CT10) % 28;
let SOFF6_CT11 :i32 = (SOFF6 + CT11) % 28;
let SOFF6_CT12 :i32 = (SOFF6 + CT12) % 28;
let SOFF6_CT13 :i32 = (SOFF6 + CT13) % 28;
let SOFF6_CT14 :i32 = (SOFF6 + CT14) % 28;
let SOFF6_CT15 :i32 = (SOFF6 + CT15) % 28;
let SOFF6_CT16 :i32 = (SOFF6 + CT16) % 28;
let SOFF6_CT17 :i32 = (SOFF6 + CT17) % 28;
let SOFF6_CT18 :i32 = (SOFF6 + CT18) % 28;
let SOFF6_CT19 :i32 = (SOFF6 + CT19) % 28;
let SOFF6_CT20 :i32 = (SOFF6 + CT20) % 28;
let SOFF6_CT21 :i32 = (SOFF6 + CT21) % 28;
let SOFF6_CT22 :i32 = (SOFF6 + CT22) % 28;
let SOFF6_CT23 :i32 = (SOFF6 + CT23) % 28;

let SOFF7_CT0  :i32 = (SOFF7 + CT0)  % 28;
let SOFF7_CT1  :i32 = (SOFF7 + CT1)  % 28;
let SOFF7_CT2  :i32 = (SOFF7 + CT2)  % 28;
let SOFF7_CT3  :i32 = (SOFF7 + CT3)  % 28;
let SOFF7_CT4  :i32 = (SOFF7 + CT4)  % 28;
let SOFF7_CT5  :i32 = (SOFF7 + CT5)  % 28;
let SOFF7_CT6  :i32 = (SOFF7 + CT6)  % 28;
let SOFF7_CT7  :i32 = (SOFF7 + CT7)  % 28;
let SOFF7_CT8  :i32 = (SOFF7 + CT8)  % 28;
let SOFF7_CT9  :i32 = (SOFF7 + CT9)  % 28;
let SOFF7_CT10 :i32 = (SOFF7 + CT10) % 28;
let SOFF7_CT11 :i32 = (SOFF7 + CT11) % 28;
let SOFF7_CT12 :i32 = (SOFF7 + CT12) % 28;
let SOFF7_CT13 :i32 = (SOFF7 + CT13) % 28;
let SOFF7_CT14 :i32 = (SOFF7 + CT14) % 28;
let SOFF7_CT15 :i32 = (SOFF7 + CT15) % 28;
let SOFF7_CT16 :i32 = (SOFF7 + CT16) % 28;
let SOFF7_CT17 :i32 = (SOFF7 + CT17) % 28;
let SOFF7_CT18 :i32 = (SOFF7 + CT18) % 28;
let SOFF7_CT19 :i32 = (SOFF7 + CT19) % 28;
let SOFF7_CT20 :i32 = (SOFF7 + CT20) % 28;
let SOFF7_CT21 :i32 = (SOFF7 + CT21) % 28;
let SOFF7_CT22 :i32 = (SOFF7 + CT22) % 28;
let SOFF7_CT23 :i32 = (SOFF7 + CT23) % 28;

let SOFF8_CT0  :i32 = (SOFF8 + CT0)  % 28;
let SOFF8_CT1  :i32 = (SOFF8 + CT1)  % 28;
let SOFF8_CT2  :i32 = (SOFF8 + CT2)  % 28;
let SOFF8_CT3  :i32 = (SOFF8 + CT3)  % 28;
let SOFF8_CT4  :i32 = (SOFF8 + CT4)  % 28;
let SOFF8_CT5  :i32 = (SOFF8 + CT5)  % 28;
let SOFF8_CT6  :i32 = (SOFF8 + CT6)  % 28;
let SOFF8_CT7  :i32 = (SOFF8 + CT7)  % 28;
let SOFF8_CT8  :i32 = (SOFF8 + CT8)  % 28;
let SOFF8_CT9  :i32 = (SOFF8 + CT9)  % 28;
let SOFF8_CT10 :i32 = (SOFF8 + CT10) % 28;
let SOFF8_CT11 :i32 = (SOFF8 + CT11) % 28;
let SOFF8_CT12 :i32 = (SOFF8 + CT12) % 28;
let SOFF8_CT13 :i32 = (SOFF8 + CT13) % 28;
let SOFF8_CT14 :i32 = (SOFF8 + CT14) % 28;
let SOFF8_CT15 :i32 = (SOFF8 + CT15) % 28;
let SOFF8_CT16 :i32 = (SOFF8 + CT16) % 28;
let SOFF8_CT17 :i32 = (SOFF8 + CT17) % 28;
let SOFF8_CT18 :i32 = (SOFF8 + CT18) % 28;
let SOFF8_CT19 :i32 = (SOFF8 + CT19) % 28;
let SOFF8_CT20 :i32 = (SOFF8 + CT20) % 28;
let SOFF8_CT21 :i32 = (SOFF8 + CT21) % 28;
let SOFF8_CT22 :i32 = (SOFF8 + CT22) % 28;
let SOFF8_CT23 :i32 = (SOFF8 + CT23) % 28;

let SOFF9_CT0  :i32 = (SOFF9 + CT0)  % 28;
let SOFF9_CT1  :i32 = (SOFF9 + CT1)  % 28;
let SOFF9_CT2  :i32 = (SOFF9 + CT2)  % 28;
let SOFF9_CT3  :i32 = (SOFF9 + CT3)  % 28;
let SOFF9_CT4  :i32 = (SOFF9 + CT4)  % 28;
let SOFF9_CT5  :i32 = (SOFF9 + CT5)  % 28;
let SOFF9_CT6  :i32 = (SOFF9 + CT6)  % 28;
let SOFF9_CT7  :i32 = (SOFF9 + CT7)  % 28;
let SOFF9_CT8  :i32 = (SOFF9 + CT8)  % 28;
let SOFF9_CT9  :i32 = (SOFF9 + CT9)  % 28;
let SOFF9_CT10 :i32 = (SOFF9 + CT10) % 28;
let SOFF9_CT11 :i32 = (SOFF9 + CT11) % 28;
let SOFF9_CT12 :i32 = (SOFF9 + CT12) % 28;
let SOFF9_CT13 :i32 = (SOFF9 + CT13) % 28;
let SOFF9_CT14 :i32 = (SOFF9 + CT14) % 28;
let SOFF9_CT15 :i32 = (SOFF9 + CT15) % 28;
let SOFF9_CT16 :i32 = (SOFF9 + CT16) % 28;
let SOFF9_CT17 :i32 = (SOFF9 + CT17) % 28;
let SOFF9_CT18 :i32 = (SOFF9 + CT18) % 28;
let SOFF9_CT19 :i32 = (SOFF9 + CT19) % 28;
let SOFF9_CT20 :i32 = (SOFF9 + CT20) % 28;
let SOFF9_CT21 :i32 = (SOFF9 + CT21) % 28;
let SOFF9_CT22 :i32 = (SOFF9 + CT22) % 28;
let SOFF9_CT23 :i32 = (SOFF9 + CT23) % 28;

let SOFF10_CT0  :i32 = (SOFF10 + CT0)  % 28;
let SOFF10_CT1  :i32 = (SOFF10 + CT1)  % 28;
let SOFF10_CT2  :i32 = (SOFF10 + CT2)  % 28;
let SOFF10_CT3  :i32 = (SOFF10 + CT3)  % 28;
let SOFF10_CT4  :i32 = (SOFF10 + CT4)  % 28;
let SOFF10_CT5  :i32 = (SOFF10 + CT5)  % 28;
let SOFF10_CT6  :i32 = (SOFF10 + CT6)  % 28;
let SOFF10_CT7  :i32 = (SOFF10 + CT7)  % 28;
let SOFF10_CT8  :i32 = (SOFF10 + CT8)  % 28;
let SOFF10_CT9  :i32 = (SOFF10 + CT9)  % 28;
let SOFF10_CT10 :i32 = (SOFF10 + CT10) % 28;
let SOFF10_CT11 :i32 = (SOFF10 + CT11) % 28;
let SOFF10_CT12 :i32 = (SOFF10 + CT12) % 28;
let SOFF10_CT13 :i32 = (SOFF10 + CT13) % 28;
let SOFF10_CT14 :i32 = (SOFF10 + CT14) % 28;
let SOFF10_CT15 :i32 = (SOFF10 + CT15) % 28;
let SOFF10_CT16 :i32 = (SOFF10 + CT16) % 28;
let SOFF10_CT17 :i32 = (SOFF10 + CT17) % 28;
let SOFF10_CT18 :i32 = (SOFF10 + CT18) % 28;
let SOFF10_CT19 :i32 = (SOFF10 + CT19) % 28;
let SOFF10_CT20 :i32 = (SOFF10 + CT20) % 28;
let SOFF10_CT21 :i32 = (SOFF10 + CT21) % 28;
let SOFF10_CT22 :i32 = (SOFF10 + CT22) % 28;
let SOFF10_CT23 :i32 = (SOFF10 + CT23) % 28;

let SOFF11_CT0  :i32 = (SOFF11 + CT0)  % 28;
let SOFF11_CT1  :i32 = (SOFF11 + CT1)  % 28;
let SOFF11_CT2  :i32 = (SOFF11 + CT2)  % 28;
let SOFF11_CT3  :i32 = (SOFF11 + CT3)  % 28;
let SOFF11_CT4  :i32 = (SOFF11 + CT4)  % 28;
let SOFF11_CT5  :i32 = (SOFF11 + CT5)  % 28;
let SOFF11_CT6  :i32 = (SOFF11 + CT6)  % 28;
let SOFF11_CT7  :i32 = (SOFF11 + CT7)  % 28;
let SOFF11_CT8  :i32 = (SOFF11 + CT8)  % 28;
let SOFF11_CT9  :i32 = (SOFF11 + CT9)  % 28;
let SOFF11_CT10 :i32 = (SOFF11 + CT10) % 28;
let SOFF11_CT11 :i32 = (SOFF11 + CT11) % 28;
let SOFF11_CT12 :i32 = (SOFF11 + CT12) % 28;
let SOFF11_CT13 :i32 = (SOFF11 + CT13) % 28;
let SOFF11_CT14 :i32 = (SOFF11 + CT14) % 28;
let SOFF11_CT15 :i32 = (SOFF11 + CT15) % 28;
let SOFF11_CT16 :i32 = (SOFF11 + CT16) % 28;
let SOFF11_CT17 :i32 = (SOFF11 + CT17) % 28;
let SOFF11_CT18 :i32 = (SOFF11 + CT18) % 28;
let SOFF11_CT19 :i32 = (SOFF11 + CT19) % 28;
let SOFF11_CT20 :i32 = (SOFF11 + CT20) % 28;
let SOFF11_CT21 :i32 = (SOFF11 + CT21) % 28;
let SOFF11_CT22 :i32 = (SOFF11 + CT22) % 28;
let SOFF11_CT23 :i32 = (SOFF11 + CT23) % 28;

let SOFF12_CT0  :i32 = (SOFF12 + CT0)  % 28;
let SOFF12_CT1  :i32 = (SOFF12 + CT1)  % 28;
let SOFF12_CT2  :i32 = (SOFF12 + CT2)  % 28;
let SOFF12_CT3  :i32 = (SOFF12 + CT3)  % 28;
let SOFF12_CT4  :i32 = (SOFF12 + CT4)  % 28;
let SOFF12_CT5  :i32 = (SOFF12 + CT5)  % 28;
let SOFF12_CT6  :i32 = (SOFF12 + CT6)  % 28;
let SOFF12_CT7  :i32 = (SOFF12 + CT7)  % 28;
let SOFF12_CT8  :i32 = (SOFF12 + CT8)  % 28;
let SOFF12_CT9  :i32 = (SOFF12 + CT9)  % 28;
let SOFF12_CT10 :i32 = (SOFF12 + CT10) % 28;
let SOFF12_CT11 :i32 = (SOFF12 + CT11) % 28;
let SOFF12_CT12 :i32 = (SOFF12 + CT12) % 28;
let SOFF12_CT13 :i32 = (SOFF12 + CT13) % 28;
let SOFF12_CT14 :i32 = (SOFF12 + CT14) % 28;
let SOFF12_CT15 :i32 = (SOFF12 + CT15) % 28;
let SOFF12_CT16 :i32 = (SOFF12 + CT16) % 28;
let SOFF12_CT17 :i32 = (SOFF12 + CT17) % 28;
let SOFF12_CT18 :i32 = (SOFF12 + CT18) % 28;
let SOFF12_CT19 :i32 = (SOFF12 + CT19) % 28;
let SOFF12_CT20 :i32 = (SOFF12 + CT20) % 28;
let SOFF12_CT21 :i32 = (SOFF12 + CT21) % 28;
let SOFF12_CT22 :i32 = (SOFF12 + CT22) % 28;
let SOFF12_CT23 :i32 = (SOFF12 + CT23) % 28;

let SOFF13_CT0  :i32 = (SOFF13 + CT0)  % 28;
let SOFF13_CT1  :i32 = (SOFF13 + CT1)  % 28;
let SOFF13_CT2  :i32 = (SOFF13 + CT2)  % 28;
let SOFF13_CT3  :i32 = (SOFF13 + CT3)  % 28;
let SOFF13_CT4  :i32 = (SOFF13 + CT4)  % 28;
let SOFF13_CT5  :i32 = (SOFF13 + CT5)  % 28;
let SOFF13_CT6  :i32 = (SOFF13 + CT6)  % 28;
let SOFF13_CT7  :i32 = (SOFF13 + CT7)  % 28;
let SOFF13_CT8  :i32 = (SOFF13 + CT8)  % 28;
let SOFF13_CT9  :i32 = (SOFF13 + CT9)  % 28;
let SOFF13_CT10 :i32 = (SOFF13 + CT10) % 28;
let SOFF13_CT11 :i32 = (SOFF13 + CT11) % 28;
let SOFF13_CT12 :i32 = (SOFF13 + CT12) % 28;
let SOFF13_CT13 :i32 = (SOFF13 + CT13) % 28;
let SOFF13_CT14 :i32 = (SOFF13 + CT14) % 28;
let SOFF13_CT15 :i32 = (SOFF13 + CT15) % 28;
let SOFF13_CT16 :i32 = (SOFF13 + CT16) % 28;
let SOFF13_CT17 :i32 = (SOFF13 + CT17) % 28;
let SOFF13_CT18 :i32 = (SOFF13 + CT18) % 28;
let SOFF13_CT19 :i32 = (SOFF13 + CT19) % 28;
let SOFF13_CT20 :i32 = (SOFF13 + CT20) % 28;
let SOFF13_CT21 :i32 = (SOFF13 + CT21) % 28;
let SOFF13_CT22 :i32 = (SOFF13 + CT22) % 28;
let SOFF13_CT23 :i32 = (SOFF13 + CT23) % 28;

let SOFF14_CT0  :i32 = (SOFF14 + CT0)  % 28;
let SOFF14_CT1  :i32 = (SOFF14 + CT1)  % 28;
let SOFF14_CT2  :i32 = (SOFF14 + CT2)  % 28;
let SOFF14_CT3  :i32 = (SOFF14 + CT3)  % 28;
let SOFF14_CT4  :i32 = (SOFF14 + CT4)  % 28;
let SOFF14_CT5  :i32 = (SOFF14 + CT5)  % 28;
let SOFF14_CT6  :i32 = (SOFF14 + CT6)  % 28;
let SOFF14_CT7  :i32 = (SOFF14 + CT7)  % 28;
let SOFF14_CT8  :i32 = (SOFF14 + CT8)  % 28;
let SOFF14_CT9  :i32 = (SOFF14 + CT9)  % 28;
let SOFF14_CT10 :i32 = (SOFF14 + CT10) % 28;
let SOFF14_CT11 :i32 = (SOFF14 + CT11) % 28;
let SOFF14_CT12 :i32 = (SOFF14 + CT12) % 28;
let SOFF14_CT13 :i32 = (SOFF14 + CT13) % 28;
let SOFF14_CT14 :i32 = (SOFF14 + CT14) % 28;
let SOFF14_CT15 :i32 = (SOFF14 + CT15) % 28;
let SOFF14_CT16 :i32 = (SOFF14 + CT16) % 28;
let SOFF14_CT17 :i32 = (SOFF14 + CT17) % 28;
let SOFF14_CT18 :i32 = (SOFF14 + CT18) % 28;
let SOFF14_CT19 :i32 = (SOFF14 + CT19) % 28;
let SOFF14_CT20 :i32 = (SOFF14 + CT20) % 28;
let SOFF14_CT21 :i32 = (SOFF14 + CT21) % 28;
let SOFF14_CT22 :i32 = (SOFF14 + CT22) % 28;
let SOFF14_CT23 :i32 = (SOFF14 + CT23) % 28;

let SOFF15_CT0  :i32 = (SOFF15 + CT0)  % 28;
let SOFF15_CT1  :i32 = (SOFF15 + CT1)  % 28;
let SOFF15_CT2  :i32 = (SOFF15 + CT2)  % 28;
let SOFF15_CT3  :i32 = (SOFF15 + CT3)  % 28;
let SOFF15_CT4  :i32 = (SOFF15 + CT4)  % 28;
let SOFF15_CT5  :i32 = (SOFF15 + CT5)  % 28;
let SOFF15_CT6  :i32 = (SOFF15 + CT6)  % 28;
let SOFF15_CT7  :i32 = (SOFF15 + CT7)  % 28;
let SOFF15_CT8  :i32 = (SOFF15 + CT8)  % 28;
let SOFF15_CT9  :i32 = (SOFF15 + CT9)  % 28;
let SOFF15_CT10 :i32 = (SOFF15 + CT10) % 28;
let SOFF15_CT11 :i32 = (SOFF15 + CT11) % 28;
let SOFF15_CT12 :i32 = (SOFF15 + CT12) % 28;
let SOFF15_CT13 :i32 = (SOFF15 + CT13) % 28;
let SOFF15_CT14 :i32 = (SOFF15 + CT14) % 28;
let SOFF15_CT15 :i32 = (SOFF15 + CT15) % 28;
let SOFF15_CT16 :i32 = (SOFF15 + CT16) % 28;
let SOFF15_CT17 :i32 = (SOFF15 + CT17) % 28;
let SOFF15_CT18 :i32 = (SOFF15 + CT18) % 28;
let SOFF15_CT19 :i32 = (SOFF15 + CT19) % 28;
let SOFF15_CT20 :i32 = (SOFF15 + CT20) % 28;
let SOFF15_CT21 :i32 = (SOFF15 + CT21) % 28;
let SOFF15_CT22 :i32 = (SOFF15 + CT22) % 28;
let SOFF15_CT23 :i32 = (SOFF15 + CT23) % 28;

/************************************************************************
 * MOD
 ***********************************************************************/

let SOFF0_CT24_MOD :i32 = (SOFF0 + CT24_MOD) % 28 + 28;
let SOFF0_CT25_MOD :i32 = (SOFF0 + CT25_MOD) % 28 + 28;
let SOFF0_CT26_MOD :i32 = (SOFF0 + CT26_MOD) % 28 + 28;
let SOFF0_CT27_MOD :i32 = (SOFF0 + CT27_MOD) % 28 + 28;
let SOFF0_CT28_MOD :i32 = (SOFF0 + CT28_MOD) % 28 + 28;
let SOFF0_CT29_MOD :i32 = (SOFF0 + CT29_MOD) % 28 + 28;
let SOFF0_CT30_MOD :i32 = (SOFF0 + CT30_MOD) % 28 + 28;
let SOFF0_CT31_MOD :i32 = (SOFF0 + CT31_MOD) % 28 + 28;
let SOFF0_CT32_MOD :i32 = (SOFF0 + CT32_MOD) % 28 + 28;
let SOFF0_CT33_MOD :i32 = (SOFF0 + CT33_MOD) % 28 + 28;
let SOFF0_CT34_MOD :i32 = (SOFF0 + CT34_MOD) % 28 + 28;
let SOFF0_CT35_MOD :i32 = (SOFF0 + CT35_MOD) % 28 + 28;
let SOFF0_CT36_MOD :i32 = (SOFF0 + CT36_MOD) % 28 + 28;
let SOFF0_CT37_MOD :i32 = (SOFF0 + CT37_MOD) % 28 + 28;
let SOFF0_CT38_MOD :i32 = (SOFF0 + CT38_MOD) % 28 + 28;
let SOFF0_CT39_MOD :i32 = (SOFF0 + CT39_MOD) % 28 + 28;
let SOFF0_CT40_MOD :i32 = (SOFF0 + CT40_MOD) % 28 + 28;
let SOFF0_CT41_MOD :i32 = (SOFF0 + CT41_MOD) % 28 + 28;
let SOFF0_CT42_MOD :i32 = (SOFF0 + CT42_MOD) % 28 + 28;
let SOFF0_CT43_MOD :i32 = (SOFF0 + CT43_MOD) % 28 + 28;
let SOFF0_CT44_MOD :i32 = (SOFF0 + CT44_MOD) % 28 + 28;
let SOFF0_CT45_MOD :i32 = (SOFF0 + CT45_MOD) % 28 + 28;
let SOFF0_CT46_MOD :i32 = (SOFF0 + CT46_MOD) % 28 + 28;
let SOFF0_CT47_MOD :i32 = (SOFF0 + CT47_MOD) % 28 + 28;

let SOFF1_CT24_MOD :i32 = (SOFF1 + CT24_MOD) % 28 + 28;
let SOFF1_CT25_MOD :i32 = (SOFF1 + CT25_MOD) % 28 + 28;
let SOFF1_CT26_MOD :i32 = (SOFF1 + CT26_MOD) % 28 + 28;
let SOFF1_CT27_MOD :i32 = (SOFF1 + CT27_MOD) % 28 + 28;
let SOFF1_CT28_MOD :i32 = (SOFF1 + CT28_MOD) % 28 + 28;
let SOFF1_CT29_MOD :i32 = (SOFF1 + CT29_MOD) % 28 + 28;
let SOFF1_CT30_MOD :i32 = (SOFF1 + CT30_MOD) % 28 + 28;
let SOFF1_CT31_MOD :i32 = (SOFF1 + CT31_MOD) % 28 + 28;
let SOFF1_CT32_MOD :i32 = (SOFF1 + CT32_MOD) % 28 + 28;
let SOFF1_CT33_MOD :i32 = (SOFF1 + CT33_MOD) % 28 + 28;
let SOFF1_CT34_MOD :i32 = (SOFF1 + CT34_MOD) % 28 + 28;
let SOFF1_CT35_MOD :i32 = (SOFF1 + CT35_MOD) % 28 + 28;
let SOFF1_CT36_MOD :i32 = (SOFF1 + CT36_MOD) % 28 + 28;
let SOFF1_CT37_MOD :i32 = (SOFF1 + CT37_MOD) % 28 + 28;
let SOFF1_CT38_MOD :i32 = (SOFF1 + CT38_MOD) % 28 + 28;
let SOFF1_CT39_MOD :i32 = (SOFF1 + CT39_MOD) % 28 + 28;
let SOFF1_CT40_MOD :i32 = (SOFF1 + CT40_MOD) % 28 + 28;
let SOFF1_CT41_MOD :i32 = (SOFF1 + CT41_MOD) % 28 + 28;
let SOFF1_CT42_MOD :i32 = (SOFF1 + CT42_MOD) % 28 + 28;
let SOFF1_CT43_MOD :i32 = (SOFF1 + CT43_MOD) % 28 + 28;
let SOFF1_CT44_MOD :i32 = (SOFF1 + CT44_MOD) % 28 + 28;
let SOFF1_CT45_MOD :i32 = (SOFF1 + CT45_MOD) % 28 + 28;
let SOFF1_CT46_MOD :i32 = (SOFF1 + CT46_MOD) % 28 + 28;
let SOFF1_CT47_MOD :i32 = (SOFF1 + CT47_MOD) % 28 + 28;

let SOFF2_CT24_MOD :i32 = (SOFF2 + CT24_MOD) % 28 + 28;
let SOFF2_CT25_MOD :i32 = (SOFF2 + CT25_MOD) % 28 + 28;
let SOFF2_CT26_MOD :i32 = (SOFF2 + CT26_MOD) % 28 + 28;
let SOFF2_CT27_MOD :i32 = (SOFF2 + CT27_MOD) % 28 + 28;
let SOFF2_CT28_MOD :i32 = (SOFF2 + CT28_MOD) % 28 + 28;
let SOFF2_CT29_MOD :i32 = (SOFF2 + CT29_MOD) % 28 + 28;
let SOFF2_CT30_MOD :i32 = (SOFF2 + CT30_MOD) % 28 + 28;
let SOFF2_CT31_MOD :i32 = (SOFF2 + CT31_MOD) % 28 + 28;
let SOFF2_CT32_MOD :i32 = (SOFF2 + CT32_MOD) % 28 + 28;
let SOFF2_CT33_MOD :i32 = (SOFF2 + CT33_MOD) % 28 + 28;
let SOFF2_CT34_MOD :i32 = (SOFF2 + CT34_MOD) % 28 + 28;
let SOFF2_CT35_MOD :i32 = (SOFF2 + CT35_MOD) % 28 + 28;
let SOFF2_CT36_MOD :i32 = (SOFF2 + CT36_MOD) % 28 + 28;
let SOFF2_CT37_MOD :i32 = (SOFF2 + CT37_MOD) % 28 + 28;
let SOFF2_CT38_MOD :i32 = (SOFF2 + CT38_MOD) % 28 + 28;
let SOFF2_CT39_MOD :i32 = (SOFF2 + CT39_MOD) % 28 + 28;
let SOFF2_CT40_MOD :i32 = (SOFF2 + CT40_MOD) % 28 + 28;
let SOFF2_CT41_MOD :i32 = (SOFF2 + CT41_MOD) % 28 + 28;
let SOFF2_CT42_MOD :i32 = (SOFF2 + CT42_MOD) % 28 + 28;
let SOFF2_CT43_MOD :i32 = (SOFF2 + CT43_MOD) % 28 + 28;
let SOFF2_CT44_MOD :i32 = (SOFF2 + CT44_MOD) % 28 + 28;
let SOFF2_CT45_MOD :i32 = (SOFF2 + CT45_MOD) % 28 + 28;
let SOFF2_CT46_MOD :i32 = (SOFF2 + CT46_MOD) % 28 + 28;
let SOFF2_CT47_MOD :i32 = (SOFF2 + CT47_MOD) % 28 + 28;

let SOFF3_CT24_MOD :i32 = (SOFF3 + CT24_MOD) % 28 + 28;
let SOFF3_CT25_MOD :i32 = (SOFF3 + CT25_MOD) % 28 + 28;
let SOFF3_CT26_MOD :i32 = (SOFF3 + CT26_MOD) % 28 + 28;
let SOFF3_CT27_MOD :i32 = (SOFF3 + CT27_MOD) % 28 + 28;
let SOFF3_CT28_MOD :i32 = (SOFF3 + CT28_MOD) % 28 + 28;
let SOFF3_CT29_MOD :i32 = (SOFF3 + CT29_MOD) % 28 + 28;
let SOFF3_CT30_MOD :i32 = (SOFF3 + CT30_MOD) % 28 + 28;
let SOFF3_CT31_MOD :i32 = (SOFF3 + CT31_MOD) % 28 + 28;
let SOFF3_CT32_MOD :i32 = (SOFF3 + CT32_MOD) % 28 + 28;
let SOFF3_CT33_MOD :i32 = (SOFF3 + CT33_MOD) % 28 + 28;
let SOFF3_CT34_MOD :i32 = (SOFF3 + CT34_MOD) % 28 + 28;
let SOFF3_CT35_MOD :i32 = (SOFF3 + CT35_MOD) % 28 + 28;
let SOFF3_CT36_MOD :i32 = (SOFF3 + CT36_MOD) % 28 + 28;
let SOFF3_CT37_MOD :i32 = (SOFF3 + CT37_MOD) % 28 + 28;
let SOFF3_CT38_MOD :i32 = (SOFF3 + CT38_MOD) % 28 + 28;
let SOFF3_CT39_MOD :i32 = (SOFF3 + CT39_MOD) % 28 + 28;
let SOFF3_CT40_MOD :i32 = (SOFF3 + CT40_MOD) % 28 + 28;
let SOFF3_CT41_MOD :i32 = (SOFF3 + CT41_MOD) % 28 + 28;
let SOFF3_CT42_MOD :i32 = (SOFF3 + CT42_MOD) % 28 + 28;
let SOFF3_CT43_MOD :i32 = (SOFF3 + CT43_MOD) % 28 + 28;
let SOFF3_CT44_MOD :i32 = (SOFF3 + CT44_MOD) % 28 + 28;
let SOFF3_CT45_MOD :i32 = (SOFF3 + CT45_MOD) % 28 + 28;
let SOFF3_CT46_MOD :i32 = (SOFF3 + CT46_MOD) % 28 + 28;
let SOFF3_CT47_MOD :i32 = (SOFF3 + CT47_MOD) % 28 + 28;

let SOFF4_CT24_MOD :i32 = (SOFF4 + CT24_MOD) % 28 + 28;
let SOFF4_CT25_MOD :i32 = (SOFF4 + CT25_MOD) % 28 + 28;
let SOFF4_CT26_MOD :i32 = (SOFF4 + CT26_MOD) % 28 + 28;
let SOFF4_CT27_MOD :i32 = (SOFF4 + CT27_MOD) % 28 + 28;
let SOFF4_CT28_MOD :i32 = (SOFF4 + CT28_MOD) % 28 + 28;
let SOFF4_CT29_MOD :i32 = (SOFF4 + CT29_MOD) % 28 + 28;
let SOFF4_CT30_MOD :i32 = (SOFF4 + CT30_MOD) % 28 + 28;
let SOFF4_CT31_MOD :i32 = (SOFF4 + CT31_MOD) % 28 + 28;
let SOFF4_CT32_MOD :i32 = (SOFF4 + CT32_MOD) % 28 + 28;
let SOFF4_CT33_MOD :i32 = (SOFF4 + CT33_MOD) % 28 + 28;
let SOFF4_CT34_MOD :i32 = (SOFF4 + CT34_MOD) % 28 + 28;
let SOFF4_CT35_MOD :i32 = (SOFF4 + CT35_MOD) % 28 + 28;
let SOFF4_CT36_MOD :i32 = (SOFF4 + CT36_MOD) % 28 + 28;
let SOFF4_CT37_MOD :i32 = (SOFF4 + CT37_MOD) % 28 + 28;
let SOFF4_CT38_MOD :i32 = (SOFF4 + CT38_MOD) % 28 + 28;
let SOFF4_CT39_MOD :i32 = (SOFF4 + CT39_MOD) % 28 + 28;
let SOFF4_CT40_MOD :i32 = (SOFF4 + CT40_MOD) % 28 + 28;
let SOFF4_CT41_MOD :i32 = (SOFF4 + CT41_MOD) % 28 + 28;
let SOFF4_CT42_MOD :i32 = (SOFF4 + CT42_MOD) % 28 + 28;
let SOFF4_CT43_MOD :i32 = (SOFF4 + CT43_MOD) % 28 + 28;
let SOFF4_CT44_MOD :i32 = (SOFF4 + CT44_MOD) % 28 + 28;
let SOFF4_CT45_MOD :i32 = (SOFF4 + CT45_MOD) % 28 + 28;
let SOFF4_CT46_MOD :i32 = (SOFF4 + CT46_MOD) % 28 + 28;
let SOFF4_CT47_MOD :i32 = (SOFF4 + CT47_MOD) % 28 + 28;

let SOFF5_CT24_MOD :i32 = (SOFF5 + CT24_MOD) % 28 + 28;
let SOFF5_CT25_MOD :i32 = (SOFF5 + CT25_MOD) % 28 + 28;
let SOFF5_CT26_MOD :i32 = (SOFF5 + CT26_MOD) % 28 + 28;
let SOFF5_CT27_MOD :i32 = (SOFF5 + CT27_MOD) % 28 + 28;
let SOFF5_CT28_MOD :i32 = (SOFF5 + CT28_MOD) % 28 + 28;
let SOFF5_CT29_MOD :i32 = (SOFF5 + CT29_MOD) % 28 + 28;
let SOFF5_CT30_MOD :i32 = (SOFF5 + CT30_MOD) % 28 + 28;
let SOFF5_CT31_MOD :i32 = (SOFF5 + CT31_MOD) % 28 + 28;
let SOFF5_CT32_MOD :i32 = (SOFF5 + CT32_MOD) % 28 + 28;
let SOFF5_CT33_MOD :i32 = (SOFF5 + CT33_MOD) % 28 + 28;
let SOFF5_CT34_MOD :i32 = (SOFF5 + CT34_MOD) % 28 + 28;
let SOFF5_CT35_MOD :i32 = (SOFF5 + CT35_MOD) % 28 + 28;
let SOFF5_CT36_MOD :i32 = (SOFF5 + CT36_MOD) % 28 + 28;
let SOFF5_CT37_MOD :i32 = (SOFF5 + CT37_MOD) % 28 + 28;
let SOFF5_CT38_MOD :i32 = (SOFF5 + CT38_MOD) % 28 + 28;
let SOFF5_CT39_MOD :i32 = (SOFF5 + CT39_MOD) % 28 + 28;
let SOFF5_CT40_MOD :i32 = (SOFF5 + CT40_MOD) % 28 + 28;
let SOFF5_CT41_MOD :i32 = (SOFF5 + CT41_MOD) % 28 + 28;
let SOFF5_CT42_MOD :i32 = (SOFF5 + CT42_MOD) % 28 + 28;
let SOFF5_CT43_MOD :i32 = (SOFF5 + CT43_MOD) % 28 + 28;
let SOFF5_CT44_MOD :i32 = (SOFF5 + CT44_MOD) % 28 + 28;
let SOFF5_CT45_MOD :i32 = (SOFF5 + CT45_MOD) % 28 + 28;
let SOFF5_CT46_MOD :i32 = (SOFF5 + CT46_MOD) % 28 + 28;
let SOFF5_CT47_MOD :i32 = (SOFF5 + CT47_MOD) % 28 + 28;

let SOFF6_CT24_MOD :i32 = (SOFF6 + CT24_MOD) % 28 + 28;
let SOFF6_CT25_MOD :i32 = (SOFF6 + CT25_MOD) % 28 + 28;
let SOFF6_CT26_MOD :i32 = (SOFF6 + CT26_MOD) % 28 + 28;
let SOFF6_CT27_MOD :i32 = (SOFF6 + CT27_MOD) % 28 + 28;
let SOFF6_CT28_MOD :i32 = (SOFF6 + CT28_MOD) % 28 + 28;
let SOFF6_CT29_MOD :i32 = (SOFF6 + CT29_MOD) % 28 + 28;
let SOFF6_CT30_MOD :i32 = (SOFF6 + CT30_MOD) % 28 + 28;
let SOFF6_CT31_MOD :i32 = (SOFF6 + CT31_MOD) % 28 + 28;
let SOFF6_CT32_MOD :i32 = (SOFF6 + CT32_MOD) % 28 + 28;
let SOFF6_CT33_MOD :i32 = (SOFF6 + CT33_MOD) % 28 + 28;
let SOFF6_CT34_MOD :i32 = (SOFF6 + CT34_MOD) % 28 + 28;
let SOFF6_CT35_MOD :i32 = (SOFF6 + CT35_MOD) % 28 + 28;
let SOFF6_CT36_MOD :i32 = (SOFF6 + CT36_MOD) % 28 + 28;
let SOFF6_CT37_MOD :i32 = (SOFF6 + CT37_MOD) % 28 + 28;
let SOFF6_CT38_MOD :i32 = (SOFF6 + CT38_MOD) % 28 + 28;
let SOFF6_CT39_MOD :i32 = (SOFF6 + CT39_MOD) % 28 + 28;
let SOFF6_CT40_MOD :i32 = (SOFF6 + CT40_MOD) % 28 + 28;
let SOFF6_CT41_MOD :i32 = (SOFF6 + CT41_MOD) % 28 + 28;
let SOFF6_CT42_MOD :i32 = (SOFF6 + CT42_MOD) % 28 + 28;
let SOFF6_CT43_MOD :i32 = (SOFF6 + CT43_MOD) % 28 + 28;
let SOFF6_CT44_MOD :i32 = (SOFF6 + CT44_MOD) % 28 + 28;
let SOFF6_CT45_MOD :i32 = (SOFF6 + CT45_MOD) % 28 + 28;
let SOFF6_CT46_MOD :i32 = (SOFF6 + CT46_MOD) % 28 + 28;
let SOFF6_CT47_MOD :i32 = (SOFF6 + CT47_MOD) % 28 + 28;

let SOFF7_CT24_MOD :i32 = (SOFF7 + CT24_MOD) % 28 + 28;
let SOFF7_CT25_MOD :i32 = (SOFF7 + CT25_MOD) % 28 + 28;
let SOFF7_CT26_MOD :i32 = (SOFF7 + CT26_MOD) % 28 + 28;
let SOFF7_CT27_MOD :i32 = (SOFF7 + CT27_MOD) % 28 + 28;
let SOFF7_CT28_MOD :i32 = (SOFF7 + CT28_MOD) % 28 + 28;
let SOFF7_CT29_MOD :i32 = (SOFF7 + CT29_MOD) % 28 + 28;
let SOFF7_CT30_MOD :i32 = (SOFF7 + CT30_MOD) % 28 + 28;
let SOFF7_CT31_MOD :i32 = (SOFF7 + CT31_MOD) % 28 + 28;
let SOFF7_CT32_MOD :i32 = (SOFF7 + CT32_MOD) % 28 + 28;
let SOFF7_CT33_MOD :i32 = (SOFF7 + CT33_MOD) % 28 + 28;
let SOFF7_CT34_MOD :i32 = (SOFF7 + CT34_MOD) % 28 + 28;
let SOFF7_CT35_MOD :i32 = (SOFF7 + CT35_MOD) % 28 + 28;
let SOFF7_CT36_MOD :i32 = (SOFF7 + CT36_MOD) % 28 + 28;
let SOFF7_CT37_MOD :i32 = (SOFF7 + CT37_MOD) % 28 + 28;
let SOFF7_CT38_MOD :i32 = (SOFF7 + CT38_MOD) % 28 + 28;
let SOFF7_CT39_MOD :i32 = (SOFF7 + CT39_MOD) % 28 + 28;
let SOFF7_CT40_MOD :i32 = (SOFF7 + CT40_MOD) % 28 + 28;
let SOFF7_CT41_MOD :i32 = (SOFF7 + CT41_MOD) % 28 + 28;
let SOFF7_CT42_MOD :i32 = (SOFF7 + CT42_MOD) % 28 + 28;
let SOFF7_CT43_MOD :i32 = (SOFF7 + CT43_MOD) % 28 + 28;
let SOFF7_CT44_MOD :i32 = (SOFF7 + CT44_MOD) % 28 + 28;
let SOFF7_CT45_MOD :i32 = (SOFF7 + CT45_MOD) % 28 + 28;
let SOFF7_CT46_MOD :i32 = (SOFF7 + CT46_MOD) % 28 + 28;
let SOFF7_CT47_MOD :i32 = (SOFF7 + CT47_MOD) % 28 + 28;

let SOFF8_CT24_MOD :i32 = (SOFF8 + CT24_MOD) % 28 + 28;
let SOFF8_CT25_MOD :i32 = (SOFF8 + CT25_MOD) % 28 + 28;
let SOFF8_CT26_MOD :i32 = (SOFF8 + CT26_MOD) % 28 + 28;
let SOFF8_CT27_MOD :i32 = (SOFF8 + CT27_MOD) % 28 + 28;
let SOFF8_CT28_MOD :i32 = (SOFF8 + CT28_MOD) % 28 + 28;
let SOFF8_CT29_MOD :i32 = (SOFF8 + CT29_MOD) % 28 + 28;
let SOFF8_CT30_MOD :i32 = (SOFF8 + CT30_MOD) % 28 + 28;
let SOFF8_CT31_MOD :i32 = (SOFF8 + CT31_MOD) % 28 + 28;
let SOFF8_CT32_MOD :i32 = (SOFF8 + CT32_MOD) % 28 + 28;
let SOFF8_CT33_MOD :i32 = (SOFF8 + CT33_MOD) % 28 + 28;
let SOFF8_CT34_MOD :i32 = (SOFF8 + CT34_MOD) % 28 + 28;
let SOFF8_CT35_MOD :i32 = (SOFF8 + CT35_MOD) % 28 + 28;
let SOFF8_CT36_MOD :i32 = (SOFF8 + CT36_MOD) % 28 + 28;
let SOFF8_CT37_MOD :i32 = (SOFF8 + CT37_MOD) % 28 + 28;
let SOFF8_CT38_MOD :i32 = (SOFF8 + CT38_MOD) % 28 + 28;
let SOFF8_CT39_MOD :i32 = (SOFF8 + CT39_MOD) % 28 + 28;
let SOFF8_CT40_MOD :i32 = (SOFF8 + CT40_MOD) % 28 + 28;
let SOFF8_CT41_MOD :i32 = (SOFF8 + CT41_MOD) % 28 + 28;
let SOFF8_CT42_MOD :i32 = (SOFF8 + CT42_MOD) % 28 + 28;
let SOFF8_CT43_MOD :i32 = (SOFF8 + CT43_MOD) % 28 + 28;
let SOFF8_CT44_MOD :i32 = (SOFF8 + CT44_MOD) % 28 + 28;
let SOFF8_CT45_MOD :i32 = (SOFF8 + CT45_MOD) % 28 + 28;
let SOFF8_CT46_MOD :i32 = (SOFF8 + CT46_MOD) % 28 + 28;
let SOFF8_CT47_MOD :i32 = (SOFF8 + CT47_MOD) % 28 + 28;

let SOFF9_CT24_MOD :i32 = (SOFF9 + CT24_MOD) % 28 + 28;
let SOFF9_CT25_MOD :i32 = (SOFF9 + CT25_MOD) % 28 + 28;
let SOFF9_CT26_MOD :i32 = (SOFF9 + CT26_MOD) % 28 + 28;
let SOFF9_CT27_MOD :i32 = (SOFF9 + CT27_MOD) % 28 + 28;
let SOFF9_CT28_MOD :i32 = (SOFF9 + CT28_MOD) % 28 + 28;
let SOFF9_CT29_MOD :i32 = (SOFF9 + CT29_MOD) % 28 + 28;
let SOFF9_CT30_MOD :i32 = (SOFF9 + CT30_MOD) % 28 + 28;
let SOFF9_CT31_MOD :i32 = (SOFF9 + CT31_MOD) % 28 + 28;
let SOFF9_CT32_MOD :i32 = (SOFF9 + CT32_MOD) % 28 + 28;
let SOFF9_CT33_MOD :i32 = (SOFF9 + CT33_MOD) % 28 + 28;
let SOFF9_CT34_MOD :i32 = (SOFF9 + CT34_MOD) % 28 + 28;
let SOFF9_CT35_MOD :i32 = (SOFF9 + CT35_MOD) % 28 + 28;
let SOFF9_CT36_MOD :i32 = (SOFF9 + CT36_MOD) % 28 + 28;
let SOFF9_CT37_MOD :i32 = (SOFF9 + CT37_MOD) % 28 + 28;
let SOFF9_CT38_MOD :i32 = (SOFF9 + CT38_MOD) % 28 + 28;
let SOFF9_CT39_MOD :i32 = (SOFF9 + CT39_MOD) % 28 + 28;
let SOFF9_CT40_MOD :i32 = (SOFF9 + CT40_MOD) % 28 + 28;
let SOFF9_CT41_MOD :i32 = (SOFF9 + CT41_MOD) % 28 + 28;
let SOFF9_CT42_MOD :i32 = (SOFF9 + CT42_MOD) % 28 + 28;
let SOFF9_CT43_MOD :i32 = (SOFF9 + CT43_MOD) % 28 + 28;
let SOFF9_CT44_MOD :i32 = (SOFF9 + CT44_MOD) % 28 + 28;
let SOFF9_CT45_MOD :i32 = (SOFF9 + CT45_MOD) % 28 + 28;
let SOFF9_CT46_MOD :i32 = (SOFF9 + CT46_MOD) % 28 + 28;
let SOFF9_CT47_MOD :i32 = (SOFF9 + CT47_MOD) % 28 + 28;

let SOFF10_CT24_MOD :i32 = (SOFF10 + CT24_MOD) % 28 + 28;
let SOFF10_CT25_MOD :i32 = (SOFF10 + CT25_MOD) % 28 + 28;
let SOFF10_CT26_MOD :i32 = (SOFF10 + CT26_MOD) % 28 + 28;
let SOFF10_CT27_MOD :i32 = (SOFF10 + CT27_MOD) % 28 + 28;
let SOFF10_CT28_MOD :i32 = (SOFF10 + CT28_MOD) % 28 + 28;
let SOFF10_CT29_MOD :i32 = (SOFF10 + CT29_MOD) % 28 + 28;
let SOFF10_CT30_MOD :i32 = (SOFF10 + CT30_MOD) % 28 + 28;
let SOFF10_CT31_MOD :i32 = (SOFF10 + CT31_MOD) % 28 + 28;
let SOFF10_CT32_MOD :i32 = (SOFF10 + CT32_MOD) % 28 + 28;
let SOFF10_CT33_MOD :i32 = (SOFF10 + CT33_MOD) % 28 + 28;
let SOFF10_CT34_MOD :i32 = (SOFF10 + CT34_MOD) % 28 + 28;
let SOFF10_CT35_MOD :i32 = (SOFF10 + CT35_MOD) % 28 + 28;
let SOFF10_CT36_MOD :i32 = (SOFF10 + CT36_MOD) % 28 + 28;
let SOFF10_CT37_MOD :i32 = (SOFF10 + CT37_MOD) % 28 + 28;
let SOFF10_CT38_MOD :i32 = (SOFF10 + CT38_MOD) % 28 + 28;
let SOFF10_CT39_MOD :i32 = (SOFF10 + CT39_MOD) % 28 + 28;
let SOFF10_CT40_MOD :i32 = (SOFF10 + CT40_MOD) % 28 + 28;
let SOFF10_CT41_MOD :i32 = (SOFF10 + CT41_MOD) % 28 + 28;
let SOFF10_CT42_MOD :i32 = (SOFF10 + CT42_MOD) % 28 + 28;
let SOFF10_CT43_MOD :i32 = (SOFF10 + CT43_MOD) % 28 + 28;
let SOFF10_CT44_MOD :i32 = (SOFF10 + CT44_MOD) % 28 + 28;
let SOFF10_CT45_MOD :i32 = (SOFF10 + CT45_MOD) % 28 + 28;
let SOFF10_CT46_MOD :i32 = (SOFF10 + CT46_MOD) % 28 + 28;
let SOFF10_CT47_MOD :i32 = (SOFF10 + CT47_MOD) % 28 + 28;

let SOFF11_CT24_MOD :i32 = (SOFF11 + CT24_MOD) % 28 + 28;
let SOFF11_CT25_MOD :i32 = (SOFF11 + CT25_MOD) % 28 + 28;
let SOFF11_CT26_MOD :i32 = (SOFF11 + CT26_MOD) % 28 + 28;
let SOFF11_CT27_MOD :i32 = (SOFF11 + CT27_MOD) % 28 + 28;
let SOFF11_CT28_MOD :i32 = (SOFF11 + CT28_MOD) % 28 + 28;
let SOFF11_CT29_MOD :i32 = (SOFF11 + CT29_MOD) % 28 + 28;
let SOFF11_CT30_MOD :i32 = (SOFF11 + CT30_MOD) % 28 + 28;
let SOFF11_CT31_MOD :i32 = (SOFF11 + CT31_MOD) % 28 + 28;
let SOFF11_CT32_MOD :i32 = (SOFF11 + CT32_MOD) % 28 + 28;
let SOFF11_CT33_MOD :i32 = (SOFF11 + CT33_MOD) % 28 + 28;
let SOFF11_CT34_MOD :i32 = (SOFF11 + CT34_MOD) % 28 + 28;
let SOFF11_CT35_MOD :i32 = (SOFF11 + CT35_MOD) % 28 + 28;
let SOFF11_CT36_MOD :i32 = (SOFF11 + CT36_MOD) % 28 + 28;
let SOFF11_CT37_MOD :i32 = (SOFF11 + CT37_MOD) % 28 + 28;
let SOFF11_CT38_MOD :i32 = (SOFF11 + CT38_MOD) % 28 + 28;
let SOFF11_CT39_MOD :i32 = (SOFF11 + CT39_MOD) % 28 + 28;
let SOFF11_CT40_MOD :i32 = (SOFF11 + CT40_MOD) % 28 + 28;
let SOFF11_CT41_MOD :i32 = (SOFF11 + CT41_MOD) % 28 + 28;
let SOFF11_CT42_MOD :i32 = (SOFF11 + CT42_MOD) % 28 + 28;
let SOFF11_CT43_MOD :i32 = (SOFF11 + CT43_MOD) % 28 + 28;
let SOFF11_CT44_MOD :i32 = (SOFF11 + CT44_MOD) % 28 + 28;
let SOFF11_CT45_MOD :i32 = (SOFF11 + CT45_MOD) % 28 + 28;
let SOFF11_CT46_MOD :i32 = (SOFF11 + CT46_MOD) % 28 + 28;
let SOFF11_CT47_MOD :i32 = (SOFF11 + CT47_MOD) % 28 + 28;

let SOFF12_CT24_MOD :i32 = (SOFF12 + CT24_MOD) % 28 + 28;
let SOFF12_CT25_MOD :i32 = (SOFF12 + CT25_MOD) % 28 + 28;
let SOFF12_CT26_MOD :i32 = (SOFF12 + CT26_MOD) % 28 + 28;
let SOFF12_CT27_MOD :i32 = (SOFF12 + CT27_MOD) % 28 + 28;
let SOFF12_CT28_MOD :i32 = (SOFF12 + CT28_MOD) % 28 + 28;
let SOFF12_CT29_MOD :i32 = (SOFF12 + CT29_MOD) % 28 + 28;
let SOFF12_CT30_MOD :i32 = (SOFF12 + CT30_MOD) % 28 + 28;
let SOFF12_CT31_MOD :i32 = (SOFF12 + CT31_MOD) % 28 + 28;
let SOFF12_CT32_MOD :i32 = (SOFF12 + CT32_MOD) % 28 + 28;
let SOFF12_CT33_MOD :i32 = (SOFF12 + CT33_MOD) % 28 + 28;
let SOFF12_CT34_MOD :i32 = (SOFF12 + CT34_MOD) % 28 + 28;
let SOFF12_CT35_MOD :i32 = (SOFF12 + CT35_MOD) % 28 + 28;
let SOFF12_CT36_MOD :i32 = (SOFF12 + CT36_MOD) % 28 + 28;
let SOFF12_CT37_MOD :i32 = (SOFF12 + CT37_MOD) % 28 + 28;
let SOFF12_CT38_MOD :i32 = (SOFF12 + CT38_MOD) % 28 + 28;
let SOFF12_CT39_MOD :i32 = (SOFF12 + CT39_MOD) % 28 + 28;
let SOFF12_CT40_MOD :i32 = (SOFF12 + CT40_MOD) % 28 + 28;
let SOFF12_CT41_MOD :i32 = (SOFF12 + CT41_MOD) % 28 + 28;
let SOFF12_CT42_MOD :i32 = (SOFF12 + CT42_MOD) % 28 + 28;
let SOFF12_CT43_MOD :i32 = (SOFF12 + CT43_MOD) % 28 + 28;
let SOFF12_CT44_MOD :i32 = (SOFF12 + CT44_MOD) % 28 + 28;
let SOFF12_CT45_MOD :i32 = (SOFF12 + CT45_MOD) % 28 + 28;
let SOFF12_CT46_MOD :i32 = (SOFF12 + CT46_MOD) % 28 + 28;
let SOFF12_CT47_MOD :i32 = (SOFF12 + CT47_MOD) % 28 + 28;

let SOFF13_CT24_MOD :i32 = (SOFF13 + CT24_MOD) % 28 + 28;
let SOFF13_CT25_MOD :i32 = (SOFF13 + CT25_MOD) % 28 + 28;
let SOFF13_CT26_MOD :i32 = (SOFF13 + CT26_MOD) % 28 + 28;
let SOFF13_CT27_MOD :i32 = (SOFF13 + CT27_MOD) % 28 + 28;
let SOFF13_CT28_MOD :i32 = (SOFF13 + CT28_MOD) % 28 + 28;
let SOFF13_CT29_MOD :i32 = (SOFF13 + CT29_MOD) % 28 + 28;
let SOFF13_CT30_MOD :i32 = (SOFF13 + CT30_MOD) % 28 + 28;
let SOFF13_CT31_MOD :i32 = (SOFF13 + CT31_MOD) % 28 + 28;
let SOFF13_CT32_MOD :i32 = (SOFF13 + CT32_MOD) % 28 + 28;
let SOFF13_CT33_MOD :i32 = (SOFF13 + CT33_MOD) % 28 + 28;
let SOFF13_CT34_MOD :i32 = (SOFF13 + CT34_MOD) % 28 + 28;
let SOFF13_CT35_MOD :i32 = (SOFF13 + CT35_MOD) % 28 + 28;
let SOFF13_CT36_MOD :i32 = (SOFF13 + CT36_MOD) % 28 + 28;
let SOFF13_CT37_MOD :i32 = (SOFF13 + CT37_MOD) % 28 + 28;
let SOFF13_CT38_MOD :i32 = (SOFF13 + CT38_MOD) % 28 + 28;
let SOFF13_CT39_MOD :i32 = (SOFF13 + CT39_MOD) % 28 + 28;
let SOFF13_CT40_MOD :i32 = (SOFF13 + CT40_MOD) % 28 + 28;
let SOFF13_CT41_MOD :i32 = (SOFF13 + CT41_MOD) % 28 + 28;
let SOFF13_CT42_MOD :i32 = (SOFF13 + CT42_MOD) % 28 + 28;
let SOFF13_CT43_MOD :i32 = (SOFF13 + CT43_MOD) % 28 + 28;
let SOFF13_CT44_MOD :i32 = (SOFF13 + CT44_MOD) % 28 + 28;
let SOFF13_CT45_MOD :i32 = (SOFF13 + CT45_MOD) % 28 + 28;
let SOFF13_CT46_MOD :i32 = (SOFF13 + CT46_MOD) % 28 + 28;
let SOFF13_CT47_MOD :i32 = (SOFF13 + CT47_MOD) % 28 + 28;

let SOFF14_CT24_MOD :i32 = (SOFF14 + CT24_MOD) % 28 + 28;
let SOFF14_CT25_MOD :i32 = (SOFF14 + CT25_MOD) % 28 + 28;
let SOFF14_CT26_MOD :i32 = (SOFF14 + CT26_MOD) % 28 + 28;
let SOFF14_CT27_MOD :i32 = (SOFF14 + CT27_MOD) % 28 + 28;
let SOFF14_CT28_MOD :i32 = (SOFF14 + CT28_MOD) % 28 + 28;
let SOFF14_CT29_MOD :i32 = (SOFF14 + CT29_MOD) % 28 + 28;
let SOFF14_CT30_MOD :i32 = (SOFF14 + CT30_MOD) % 28 + 28;
let SOFF14_CT31_MOD :i32 = (SOFF14 + CT31_MOD) % 28 + 28;
let SOFF14_CT32_MOD :i32 = (SOFF14 + CT32_MOD) % 28 + 28;
let SOFF14_CT33_MOD :i32 = (SOFF14 + CT33_MOD) % 28 + 28;
let SOFF14_CT34_MOD :i32 = (SOFF14 + CT34_MOD) % 28 + 28;
let SOFF14_CT35_MOD :i32 = (SOFF14 + CT35_MOD) % 28 + 28;
let SOFF14_CT36_MOD :i32 = (SOFF14 + CT36_MOD) % 28 + 28;
let SOFF14_CT37_MOD :i32 = (SOFF14 + CT37_MOD) % 28 + 28;
let SOFF14_CT38_MOD :i32 = (SOFF14 + CT38_MOD) % 28 + 28;
let SOFF14_CT39_MOD :i32 = (SOFF14 + CT39_MOD) % 28 + 28;
let SOFF14_CT40_MOD :i32 = (SOFF14 + CT40_MOD) % 28 + 28;
let SOFF14_CT41_MOD :i32 = (SOFF14 + CT41_MOD) % 28 + 28;
let SOFF14_CT42_MOD :i32 = (SOFF14 + CT42_MOD) % 28 + 28;
let SOFF14_CT43_MOD :i32 = (SOFF14 + CT43_MOD) % 28 + 28;
let SOFF14_CT44_MOD :i32 = (SOFF14 + CT44_MOD) % 28 + 28;
let SOFF14_CT45_MOD :i32 = (SOFF14 + CT45_MOD) % 28 + 28;
let SOFF14_CT46_MOD :i32 = (SOFF14 + CT46_MOD) % 28 + 28;
let SOFF14_CT47_MOD :i32 = (SOFF14 + CT47_MOD) % 28 + 28;

let SOFF15_CT24_MOD :i32 = (SOFF15 + CT24_MOD) % 28 + 28;
let SOFF15_CT25_MOD :i32 = (SOFF15 + CT25_MOD) % 28 + 28;
let SOFF15_CT26_MOD :i32 = (SOFF15 + CT26_MOD) % 28 + 28;
let SOFF15_CT27_MOD :i32 = (SOFF15 + CT27_MOD) % 28 + 28;
let SOFF15_CT28_MOD :i32 = (SOFF15 + CT28_MOD) % 28 + 28;
let SOFF15_CT29_MOD :i32 = (SOFF15 + CT29_MOD) % 28 + 28;
let SOFF15_CT30_MOD :i32 = (SOFF15 + CT30_MOD) % 28 + 28;
let SOFF15_CT31_MOD :i32 = (SOFF15 + CT31_MOD) % 28 + 28;
let SOFF15_CT32_MOD :i32 = (SOFF15 + CT32_MOD) % 28 + 28;
let SOFF15_CT33_MOD :i32 = (SOFF15 + CT33_MOD) % 28 + 28;
let SOFF15_CT34_MOD :i32 = (SOFF15 + CT34_MOD) % 28 + 28;
let SOFF15_CT35_MOD :i32 = (SOFF15 + CT35_MOD) % 28 + 28;
let SOFF15_CT36_MOD :i32 = (SOFF15 + CT36_MOD) % 28 + 28;
let SOFF15_CT37_MOD :i32 = (SOFF15 + CT37_MOD) % 28 + 28;
let SOFF15_CT38_MOD :i32 = (SOFF15 + CT38_MOD) % 28 + 28;
let SOFF15_CT39_MOD :i32 = (SOFF15 + CT39_MOD) % 28 + 28;
let SOFF15_CT40_MOD :i32 = (SOFF15 + CT40_MOD) % 28 + 28;
let SOFF15_CT41_MOD :i32 = (SOFF15 + CT41_MOD) % 28 + 28;
let SOFF15_CT42_MOD :i32 = (SOFF15 + CT42_MOD) % 28 + 28;
let SOFF15_CT43_MOD :i32 = (SOFF15 + CT43_MOD) % 28 + 28;
let SOFF15_CT44_MOD :i32 = (SOFF15 + CT44_MOD) % 28 + 28;
let SOFF15_CT45_MOD :i32 = (SOFF15 + CT45_MOD) % 28 + 28;
let SOFF15_CT46_MOD :i32 = (SOFF15 + CT46_MOD) % 28 + 28;
let SOFF15_CT47_MOD :i32 = (SOFF15 + CT47_MOD) % 28 + 28;


/*********************************************
* Permutation table applied to s_box results
*********************************************/
/*
const straight_table :i32[] = [
  15,  6, 19, 20, 28, 11, 27, 16,
   0, 14, 22, 25,  4, 17, 30,  9,
   1,  7, 23, 13, 31, 26,  2,  8,
  18, 12, 29,  5, 21, 10,  3, 24
];
*/

/****************************************************
* Inverse table of straight_table for speed reasons
****************************************************/
const inverse_straight_table :i32[] = [
   8, 16, 22, 30, 12, 27,  1, 17,
  23, 15, 29,  5, 25, 19,  9,  0,
   7, 13, 24,  2,  3, 28, 10, 18,
  31, 11, 21,  6,  4, 26, 14, 20
];

// S-Box Tables
const SB0 :i32[] = [
  // 0
  14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
   0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
   4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
  15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13
];
const SB1 :i32[] = [
  // 1
  15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
   3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
   0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
  13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9
];
const SB2 :i32[] = [
  // 2
  10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
  13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
  13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
  1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12
];
const SB3 :i32[] = [
  // 3
   7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
  13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
  10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
   3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14
];
const SB4 :i32[] = [
  // 4
   2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
  14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
   4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
  11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3
];
const SB5 :i32[] = [
  // 5
  12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
  10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
   9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
  4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13
];
const SB6 :i32[] = [
  // 6
   4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
  13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
   1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
  6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12
];
const SB7 :i32[] = [
  // 7
  13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
   1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
   7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
   2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11
];


// Initialization

const CHAR_CODE_Z   :i32 = 90;
const CHAR_CODE_9   :i32 = 57;
const CHAR_CODE_DOT :i32 = 46;

const PARITY_DROP :i32[] = new Array(56);
const PWD_BIN     :i32[] = new Array(64);

const PWD    :i32[]  = new Array(8);
const SALT   :i32[]  = new Array(2);
const DATA   :i32[]  = new Array(64);
const DIGEST :i32[]  = new Array(13);
const _L      :i32[] = new Array(32);
const _R      :i32[] = new Array(32);

let K :i32[][] = new Array(18);

for(let i :i32 = 0; i < 18; i++)
  K[i] = new Array(46);

// Initialization end


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
  let i :i32;
  let row :i32, col :i32, dec :i32;

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

  /***********************************************************
   *  Generate round keys
   **********************************************************/
  for(i = 0; i < 56; i++)
    PARITY_DROP[i] = PWD_BIN[ parity_drop_table[i] ];

  const K0_0  :i32 = PARITY_DROP[SOFF0_CT0];
  const K0_1  :i32 = PARITY_DROP[SOFF0_CT1];
  const K0_2  :i32 = PARITY_DROP[SOFF0_CT2];
  const K0_3  :i32 = PARITY_DROP[SOFF0_CT3];
  const K0_4  :i32 = PARITY_DROP[SOFF0_CT4];
  const K0_5  :i32 = PARITY_DROP[SOFF0_CT5];
  const K0_6  :i32 = PARITY_DROP[SOFF0_CT6];
  const K0_7  :i32 = PARITY_DROP[SOFF0_CT7];
  const K0_8  :i32 = PARITY_DROP[SOFF0_CT8];
  const K0_9  :i32 = PARITY_DROP[SOFF0_CT9];
  const K0_10 :i32 = PARITY_DROP[SOFF0_CT10];
  const K0_11 :i32 = PARITY_DROP[SOFF0_CT11];
  const K0_12 :i32 = PARITY_DROP[SOFF0_CT12];
  const K0_13 :i32 = PARITY_DROP[SOFF0_CT13];
  const K0_14 :i32 = PARITY_DROP[SOFF0_CT14];
  const K0_15 :i32 = PARITY_DROP[SOFF0_CT15];
  const K0_16 :i32 = PARITY_DROP[SOFF0_CT16];
  const K0_17 :i32 = PARITY_DROP[SOFF0_CT17];
  const K0_18 :i32 = PARITY_DROP[SOFF0_CT18];
  const K0_19 :i32 = PARITY_DROP[SOFF0_CT19];
  const K0_20 :i32 = PARITY_DROP[SOFF0_CT20];
  const K0_21 :i32 = PARITY_DROP[SOFF0_CT21];
  const K0_22 :i32 = PARITY_DROP[SOFF0_CT22];
  const K0_23 :i32 = PARITY_DROP[SOFF0_CT23];
  const K0_24 :i32 = PARITY_DROP[SOFF0_CT24_MOD];
  const K0_25 :i32 = PARITY_DROP[SOFF0_CT25_MOD];
  const K0_26 :i32 = PARITY_DROP[SOFF0_CT26_MOD];
  const K0_27 :i32 = PARITY_DROP[SOFF0_CT27_MOD];
  const K0_28 :i32 = PARITY_DROP[SOFF0_CT28_MOD];
  const K0_29 :i32 = PARITY_DROP[SOFF0_CT29_MOD];
  const K0_30 :i32 = PARITY_DROP[SOFF0_CT30_MOD];
  const K0_31 :i32 = PARITY_DROP[SOFF0_CT31_MOD];
  const K0_32 :i32 = PARITY_DROP[SOFF0_CT32_MOD];
  const K0_33 :i32 = PARITY_DROP[SOFF0_CT33_MOD];
  const K0_34 :i32 = PARITY_DROP[SOFF0_CT34_MOD];
  const K0_35 :i32 = PARITY_DROP[SOFF0_CT35_MOD];
  const K0_36 :i32 = PARITY_DROP[SOFF0_CT36_MOD];
  const K0_37 :i32 = PARITY_DROP[SOFF0_CT37_MOD];
  const K0_38 :i32 = PARITY_DROP[SOFF0_CT38_MOD];
  const K0_39 :i32 = PARITY_DROP[SOFF0_CT39_MOD];
  const K0_40 :i32 = PARITY_DROP[SOFF0_CT40_MOD];
  const K0_41 :i32 = PARITY_DROP[SOFF0_CT41_MOD];
  const K0_42 :i32 = PARITY_DROP[SOFF0_CT42_MOD];
  const K0_43 :i32 = PARITY_DROP[SOFF0_CT43_MOD];
  const K0_44 :i32 = PARITY_DROP[SOFF0_CT44_MOD];
  const K0_45 :i32 = PARITY_DROP[SOFF0_CT45_MOD];
  const K0_46 :i32 = PARITY_DROP[SOFF0_CT46_MOD];
  const K0_47 :i32 = PARITY_DROP[SOFF0_CT47_MOD];

  const K1_0  :i32 = PARITY_DROP[SOFF1_CT0];
  const K1_1  :i32 = PARITY_DROP[SOFF1_CT1];
  const K1_2  :i32 = PARITY_DROP[SOFF1_CT2];
  const K1_3  :i32 = PARITY_DROP[SOFF1_CT3];
  const K1_4  :i32 = PARITY_DROP[SOFF1_CT4];
  const K1_5  :i32 = PARITY_DROP[SOFF1_CT5];
  const K1_6  :i32 = PARITY_DROP[SOFF1_CT6];
  const K1_7  :i32 = PARITY_DROP[SOFF1_CT7];
  const K1_8  :i32 = PARITY_DROP[SOFF1_CT8];
  const K1_9  :i32 = PARITY_DROP[SOFF1_CT9];
  const K1_10 :i32 = PARITY_DROP[SOFF1_CT10];
  const K1_11 :i32 = PARITY_DROP[SOFF1_CT11];
  const K1_12 :i32 = PARITY_DROP[SOFF1_CT12];
  const K1_13 :i32 = PARITY_DROP[SOFF1_CT13];
  const K1_14 :i32 = PARITY_DROP[SOFF1_CT14];
  const K1_15 :i32 = PARITY_DROP[SOFF1_CT15];
  const K1_16 :i32 = PARITY_DROP[SOFF1_CT16];
  const K1_17 :i32 = PARITY_DROP[SOFF1_CT17];
  const K1_18 :i32 = PARITY_DROP[SOFF1_CT18];
  const K1_19 :i32 = PARITY_DROP[SOFF1_CT19];
  const K1_20 :i32 = PARITY_DROP[SOFF1_CT20];
  const K1_21 :i32 = PARITY_DROP[SOFF1_CT21];
  const K1_22 :i32 = PARITY_DROP[SOFF1_CT22];
  const K1_23 :i32 = PARITY_DROP[SOFF1_CT23];
  const K1_24 :i32 = PARITY_DROP[SOFF1_CT24_MOD];
  const K1_25 :i32 = PARITY_DROP[SOFF1_CT25_MOD];
  const K1_26 :i32 = PARITY_DROP[SOFF1_CT26_MOD];
  const K1_27 :i32 = PARITY_DROP[SOFF1_CT27_MOD];
  const K1_28 :i32 = PARITY_DROP[SOFF1_CT28_MOD];
  const K1_29 :i32 = PARITY_DROP[SOFF1_CT29_MOD];
  const K1_30 :i32 = PARITY_DROP[SOFF1_CT30_MOD];
  const K1_31 :i32 = PARITY_DROP[SOFF1_CT31_MOD];
  const K1_32 :i32 = PARITY_DROP[SOFF1_CT32_MOD];
  const K1_33 :i32 = PARITY_DROP[SOFF1_CT33_MOD];
  const K1_34 :i32 = PARITY_DROP[SOFF1_CT34_MOD];
  const K1_35 :i32 = PARITY_DROP[SOFF1_CT35_MOD];
  const K1_36 :i32 = PARITY_DROP[SOFF1_CT36_MOD];
  const K1_37 :i32 = PARITY_DROP[SOFF1_CT37_MOD];
  const K1_38 :i32 = PARITY_DROP[SOFF1_CT38_MOD];
  const K1_39 :i32 = PARITY_DROP[SOFF1_CT39_MOD];
  const K1_40 :i32 = PARITY_DROP[SOFF1_CT40_MOD];
  const K1_41 :i32 = PARITY_DROP[SOFF1_CT41_MOD];
  const K1_42 :i32 = PARITY_DROP[SOFF1_CT42_MOD];
  const K1_43 :i32 = PARITY_DROP[SOFF1_CT43_MOD];
  const K1_44 :i32 = PARITY_DROP[SOFF1_CT44_MOD];
  const K1_45 :i32 = PARITY_DROP[SOFF1_CT45_MOD];
  const K1_46 :i32 = PARITY_DROP[SOFF1_CT46_MOD];
  const K1_47 :i32 = PARITY_DROP[SOFF1_CT47_MOD];


  const K2_0  :i32 = PARITY_DROP[SOFF2_CT0];
  const K2_1  :i32 = PARITY_DROP[SOFF2_CT1];
  const K2_2  :i32 = PARITY_DROP[SOFF2_CT2];
  const K2_3  :i32 = PARITY_DROP[SOFF2_CT3];
  const K2_4  :i32 = PARITY_DROP[SOFF2_CT4];
  const K2_5  :i32 = PARITY_DROP[SOFF2_CT5];
  const K2_6  :i32 = PARITY_DROP[SOFF2_CT6];
  const K2_7  :i32 = PARITY_DROP[SOFF2_CT7];
  const K2_8  :i32 = PARITY_DROP[SOFF2_CT8];
  const K2_9  :i32 = PARITY_DROP[SOFF2_CT9];
  const K2_10 :i32 = PARITY_DROP[SOFF2_CT10];
  const K2_11 :i32 = PARITY_DROP[SOFF2_CT11];
  const K2_12 :i32 = PARITY_DROP[SOFF2_CT12];
  const K2_13 :i32 = PARITY_DROP[SOFF2_CT13];
  const K2_14 :i32 = PARITY_DROP[SOFF2_CT14];
  const K2_15 :i32 = PARITY_DROP[SOFF2_CT15];
  const K2_16 :i32 = PARITY_DROP[SOFF2_CT16];
  const K2_17 :i32 = PARITY_DROP[SOFF2_CT17];
  const K2_18 :i32 = PARITY_DROP[SOFF2_CT18];
  const K2_19 :i32 = PARITY_DROP[SOFF2_CT19];
  const K2_20 :i32 = PARITY_DROP[SOFF2_CT20];
  const K2_21 :i32 = PARITY_DROP[SOFF2_CT21];
  const K2_22 :i32 = PARITY_DROP[SOFF2_CT22];
  const K2_23 :i32 = PARITY_DROP[SOFF2_CT23];
  const K2_24 :i32 = PARITY_DROP[SOFF2_CT24_MOD];
  const K2_25 :i32 = PARITY_DROP[SOFF2_CT25_MOD];
  const K2_26 :i32 = PARITY_DROP[SOFF2_CT26_MOD];
  const K2_27 :i32 = PARITY_DROP[SOFF2_CT27_MOD];
  const K2_28 :i32 = PARITY_DROP[SOFF2_CT28_MOD];
  const K2_29 :i32 = PARITY_DROP[SOFF2_CT29_MOD];
  const K2_30 :i32 = PARITY_DROP[SOFF2_CT30_MOD];
  const K2_31 :i32 = PARITY_DROP[SOFF2_CT31_MOD];
  const K2_32 :i32 = PARITY_DROP[SOFF2_CT32_MOD];
  const K2_33 :i32 = PARITY_DROP[SOFF2_CT33_MOD];
  const K2_34 :i32 = PARITY_DROP[SOFF2_CT34_MOD];
  const K2_35 :i32 = PARITY_DROP[SOFF2_CT35_MOD];
  const K2_36 :i32 = PARITY_DROP[SOFF2_CT36_MOD];
  const K2_37 :i32 = PARITY_DROP[SOFF2_CT37_MOD];
  const K2_38 :i32 = PARITY_DROP[SOFF2_CT38_MOD];
  const K2_39 :i32 = PARITY_DROP[SOFF2_CT39_MOD];
  const K2_40 :i32 = PARITY_DROP[SOFF2_CT40_MOD];
  const K2_41 :i32 = PARITY_DROP[SOFF2_CT41_MOD];
  const K2_42 :i32 = PARITY_DROP[SOFF2_CT42_MOD];
  const K2_43 :i32 = PARITY_DROP[SOFF2_CT43_MOD];
  const K2_44 :i32 = PARITY_DROP[SOFF2_CT44_MOD];
  const K2_45 :i32 = PARITY_DROP[SOFF2_CT45_MOD];
  const K2_46 :i32 = PARITY_DROP[SOFF2_CT46_MOD];
  const K2_47 :i32 = PARITY_DROP[SOFF2_CT47_MOD];

  const K3_0  :i32 = PARITY_DROP[SOFF3_CT0];
  const K3_1  :i32 = PARITY_DROP[SOFF3_CT1];
  const K3_2  :i32 = PARITY_DROP[SOFF3_CT2];
  const K3_3  :i32 = PARITY_DROP[SOFF3_CT3];
  const K3_4  :i32 = PARITY_DROP[SOFF3_CT4];
  const K3_5  :i32 = PARITY_DROP[SOFF3_CT5];
  const K3_6  :i32 = PARITY_DROP[SOFF3_CT6];
  const K3_7  :i32 = PARITY_DROP[SOFF3_CT7];
  const K3_8  :i32 = PARITY_DROP[SOFF3_CT8];
  const K3_9  :i32 = PARITY_DROP[SOFF3_CT9];
  const K3_10 :i32 = PARITY_DROP[SOFF3_CT10];
  const K3_11 :i32 = PARITY_DROP[SOFF3_CT11];
  const K3_12 :i32 = PARITY_DROP[SOFF3_CT12];
  const K3_13 :i32 = PARITY_DROP[SOFF3_CT13];
  const K3_14 :i32 = PARITY_DROP[SOFF3_CT14];
  const K3_15 :i32 = PARITY_DROP[SOFF3_CT15];
  const K3_16 :i32 = PARITY_DROP[SOFF3_CT16];
  const K3_17 :i32 = PARITY_DROP[SOFF3_CT17];
  const K3_18 :i32 = PARITY_DROP[SOFF3_CT18];
  const K3_19 :i32 = PARITY_DROP[SOFF3_CT19];
  const K3_20 :i32 = PARITY_DROP[SOFF3_CT20];
  const K3_21 :i32 = PARITY_DROP[SOFF3_CT21];
  const K3_22 :i32 = PARITY_DROP[SOFF3_CT22];
  const K3_23 :i32 = PARITY_DROP[SOFF3_CT23];
  const K3_24 :i32 = PARITY_DROP[SOFF3_CT24_MOD];
  const K3_25 :i32 = PARITY_DROP[SOFF3_CT25_MOD];
  const K3_26 :i32 = PARITY_DROP[SOFF3_CT26_MOD];
  const K3_27 :i32 = PARITY_DROP[SOFF3_CT27_MOD];
  const K3_28 :i32 = PARITY_DROP[SOFF3_CT28_MOD];
  const K3_29 :i32 = PARITY_DROP[SOFF3_CT29_MOD];
  const K3_30 :i32 = PARITY_DROP[SOFF3_CT30_MOD];
  const K3_31 :i32 = PARITY_DROP[SOFF3_CT31_MOD];
  const K3_32 :i32 = PARITY_DROP[SOFF3_CT32_MOD];
  const K3_33 :i32 = PARITY_DROP[SOFF3_CT33_MOD];
  const K3_34 :i32 = PARITY_DROP[SOFF3_CT34_MOD];
  const K3_35 :i32 = PARITY_DROP[SOFF3_CT35_MOD];
  const K3_36 :i32 = PARITY_DROP[SOFF3_CT36_MOD];
  const K3_37 :i32 = PARITY_DROP[SOFF3_CT37_MOD];
  const K3_38 :i32 = PARITY_DROP[SOFF3_CT38_MOD];
  const K3_39 :i32 = PARITY_DROP[SOFF3_CT39_MOD];
  const K3_40 :i32 = PARITY_DROP[SOFF3_CT40_MOD];
  const K3_41 :i32 = PARITY_DROP[SOFF3_CT41_MOD];
  const K3_42 :i32 = PARITY_DROP[SOFF3_CT42_MOD];
  const K3_43 :i32 = PARITY_DROP[SOFF3_CT43_MOD];
  const K3_44 :i32 = PARITY_DROP[SOFF3_CT44_MOD];
  const K3_45 :i32 = PARITY_DROP[SOFF3_CT45_MOD];
  const K3_46 :i32 = PARITY_DROP[SOFF3_CT46_MOD];
  const K3_47 :i32 = PARITY_DROP[SOFF3_CT47_MOD];

  const K4_0  :i32 = PARITY_DROP[SOFF4_CT0];
  const K4_1  :i32 = PARITY_DROP[SOFF4_CT1];
  const K4_2  :i32 = PARITY_DROP[SOFF4_CT2];
  const K4_3  :i32 = PARITY_DROP[SOFF4_CT3];
  const K4_4  :i32 = PARITY_DROP[SOFF4_CT4];
  const K4_5  :i32 = PARITY_DROP[SOFF4_CT5];
  const K4_6  :i32 = PARITY_DROP[SOFF4_CT6];
  const K4_7  :i32 = PARITY_DROP[SOFF4_CT7];
  const K4_8  :i32 = PARITY_DROP[SOFF4_CT8];
  const K4_9  :i32 = PARITY_DROP[SOFF4_CT9];
  const K4_10 :i32 = PARITY_DROP[SOFF4_CT10];
  const K4_11 :i32 = PARITY_DROP[SOFF4_CT11];
  const K4_12 :i32 = PARITY_DROP[SOFF4_CT12];
  const K4_13 :i32 = PARITY_DROP[SOFF4_CT13];
  const K4_14 :i32 = PARITY_DROP[SOFF4_CT14];
  const K4_15 :i32 = PARITY_DROP[SOFF4_CT15];
  const K4_16 :i32 = PARITY_DROP[SOFF4_CT16];
  const K4_17 :i32 = PARITY_DROP[SOFF4_CT17];
  const K4_18 :i32 = PARITY_DROP[SOFF4_CT18];
  const K4_19 :i32 = PARITY_DROP[SOFF4_CT19];
  const K4_20 :i32 = PARITY_DROP[SOFF4_CT20];
  const K4_21 :i32 = PARITY_DROP[SOFF4_CT21];
  const K4_22 :i32 = PARITY_DROP[SOFF4_CT22];
  const K4_23 :i32 = PARITY_DROP[SOFF4_CT23];
  const K4_24 :i32 = PARITY_DROP[SOFF4_CT24_MOD];
  const K4_25 :i32 = PARITY_DROP[SOFF4_CT25_MOD];
  const K4_26 :i32 = PARITY_DROP[SOFF4_CT26_MOD];
  const K4_27 :i32 = PARITY_DROP[SOFF4_CT27_MOD];
  const K4_28 :i32 = PARITY_DROP[SOFF4_CT28_MOD];
  const K4_29 :i32 = PARITY_DROP[SOFF4_CT29_MOD];
  const K4_30 :i32 = PARITY_DROP[SOFF4_CT30_MOD];
  const K4_31 :i32 = PARITY_DROP[SOFF4_CT31_MOD];
  const K4_32 :i32 = PARITY_DROP[SOFF4_CT32_MOD];
  const K4_33 :i32 = PARITY_DROP[SOFF4_CT33_MOD];
  const K4_34 :i32 = PARITY_DROP[SOFF4_CT34_MOD];
  const K4_35 :i32 = PARITY_DROP[SOFF4_CT35_MOD];
  const K4_36 :i32 = PARITY_DROP[SOFF4_CT36_MOD];
  const K4_37 :i32 = PARITY_DROP[SOFF4_CT37_MOD];
  const K4_38 :i32 = PARITY_DROP[SOFF4_CT38_MOD];
  const K4_39 :i32 = PARITY_DROP[SOFF4_CT39_MOD];
  const K4_40 :i32 = PARITY_DROP[SOFF4_CT40_MOD];
  const K4_41 :i32 = PARITY_DROP[SOFF4_CT41_MOD];
  const K4_42 :i32 = PARITY_DROP[SOFF4_CT42_MOD];
  const K4_43 :i32 = PARITY_DROP[SOFF4_CT43_MOD];
  const K4_44 :i32 = PARITY_DROP[SOFF4_CT44_MOD];
  const K4_45 :i32 = PARITY_DROP[SOFF4_CT45_MOD];
  const K4_46 :i32 = PARITY_DROP[SOFF4_CT46_MOD];
  const K4_47 :i32 = PARITY_DROP[SOFF4_CT47_MOD];

  const K5_0  :i32 = PARITY_DROP[SOFF5_CT0];
  const K5_1  :i32 = PARITY_DROP[SOFF5_CT1];
  const K5_2  :i32 = PARITY_DROP[SOFF5_CT2];
  const K5_3  :i32 = PARITY_DROP[SOFF5_CT3];
  const K5_4  :i32 = PARITY_DROP[SOFF5_CT4];
  const K5_5  :i32 = PARITY_DROP[SOFF5_CT5];
  const K5_6  :i32 = PARITY_DROP[SOFF5_CT6];
  const K5_7  :i32 = PARITY_DROP[SOFF5_CT7];
  const K5_8  :i32 = PARITY_DROP[SOFF5_CT8];
  const K5_9  :i32 = PARITY_DROP[SOFF5_CT9];
  const K5_10 :i32 = PARITY_DROP[SOFF5_CT10];
  const K5_11 :i32 = PARITY_DROP[SOFF5_CT11];
  const K5_12 :i32 = PARITY_DROP[SOFF5_CT12];
  const K5_13 :i32 = PARITY_DROP[SOFF5_CT13];
  const K5_14 :i32 = PARITY_DROP[SOFF5_CT14];
  const K5_15 :i32 = PARITY_DROP[SOFF5_CT15];
  const K5_16 :i32 = PARITY_DROP[SOFF5_CT16];
  const K5_17 :i32 = PARITY_DROP[SOFF5_CT17];
  const K5_18 :i32 = PARITY_DROP[SOFF5_CT18];
  const K5_19 :i32 = PARITY_DROP[SOFF5_CT19];
  const K5_20 :i32 = PARITY_DROP[SOFF5_CT20];
  const K5_21 :i32 = PARITY_DROP[SOFF5_CT21];
  const K5_22 :i32 = PARITY_DROP[SOFF5_CT22];
  const K5_23 :i32 = PARITY_DROP[SOFF5_CT23];
  const K5_24 :i32 = PARITY_DROP[SOFF5_CT24_MOD];
  const K5_25 :i32 = PARITY_DROP[SOFF5_CT25_MOD];
  const K5_26 :i32 = PARITY_DROP[SOFF5_CT26_MOD];
  const K5_27 :i32 = PARITY_DROP[SOFF5_CT27_MOD];
  const K5_28 :i32 = PARITY_DROP[SOFF5_CT28_MOD];
  const K5_29 :i32 = PARITY_DROP[SOFF5_CT29_MOD];
  const K5_30 :i32 = PARITY_DROP[SOFF5_CT30_MOD];
  const K5_31 :i32 = PARITY_DROP[SOFF5_CT31_MOD];
  const K5_32 :i32 = PARITY_DROP[SOFF5_CT32_MOD];
  const K5_33 :i32 = PARITY_DROP[SOFF5_CT33_MOD];
  const K5_34 :i32 = PARITY_DROP[SOFF5_CT34_MOD];
  const K5_35 :i32 = PARITY_DROP[SOFF5_CT35_MOD];
  const K5_36 :i32 = PARITY_DROP[SOFF5_CT36_MOD];
  const K5_37 :i32 = PARITY_DROP[SOFF5_CT37_MOD];
  const K5_38 :i32 = PARITY_DROP[SOFF5_CT38_MOD];
  const K5_39 :i32 = PARITY_DROP[SOFF5_CT39_MOD];
  const K5_40 :i32 = PARITY_DROP[SOFF5_CT40_MOD];
  const K5_41 :i32 = PARITY_DROP[SOFF5_CT41_MOD];
  const K5_42 :i32 = PARITY_DROP[SOFF5_CT42_MOD];
  const K5_43 :i32 = PARITY_DROP[SOFF5_CT43_MOD];
  const K5_44 :i32 = PARITY_DROP[SOFF5_CT44_MOD];
  const K5_45 :i32 = PARITY_DROP[SOFF5_CT45_MOD];
  const K5_46 :i32 = PARITY_DROP[SOFF5_CT46_MOD];
  const K5_47 :i32 = PARITY_DROP[SOFF5_CT47_MOD];

  const K6_0  :i32 = PARITY_DROP[SOFF6_CT0];
  const K6_1  :i32 = PARITY_DROP[SOFF6_CT1];
  const K6_2  :i32 = PARITY_DROP[SOFF6_CT2];
  const K6_3  :i32 = PARITY_DROP[SOFF6_CT3];
  const K6_4  :i32 = PARITY_DROP[SOFF6_CT4];
  const K6_5  :i32 = PARITY_DROP[SOFF6_CT5];
  const K6_6  :i32 = PARITY_DROP[SOFF6_CT6];
  const K6_7  :i32 = PARITY_DROP[SOFF6_CT7];
  const K6_8  :i32 = PARITY_DROP[SOFF6_CT8];
  const K6_9  :i32 = PARITY_DROP[SOFF6_CT9];
  const K6_10 :i32 = PARITY_DROP[SOFF6_CT10];
  const K6_11 :i32 = PARITY_DROP[SOFF6_CT11];
  const K6_12 :i32 = PARITY_DROP[SOFF6_CT12];
  const K6_13 :i32 = PARITY_DROP[SOFF6_CT13];
  const K6_14 :i32 = PARITY_DROP[SOFF6_CT14];
  const K6_15 :i32 = PARITY_DROP[SOFF6_CT15];
  const K6_16 :i32 = PARITY_DROP[SOFF6_CT16];
  const K6_17 :i32 = PARITY_DROP[SOFF6_CT17];
  const K6_18 :i32 = PARITY_DROP[SOFF6_CT18];
  const K6_19 :i32 = PARITY_DROP[SOFF6_CT19];
  const K6_20 :i32 = PARITY_DROP[SOFF6_CT20];
  const K6_21 :i32 = PARITY_DROP[SOFF6_CT21];
  const K6_22 :i32 = PARITY_DROP[SOFF6_CT22];
  const K6_23 :i32 = PARITY_DROP[SOFF6_CT23];
  const K6_24 :i32 = PARITY_DROP[SOFF6_CT24_MOD];
  const K6_25 :i32 = PARITY_DROP[SOFF6_CT25_MOD];
  const K6_26 :i32 = PARITY_DROP[SOFF6_CT26_MOD];
  const K6_27 :i32 = PARITY_DROP[SOFF6_CT27_MOD];
  const K6_28 :i32 = PARITY_DROP[SOFF6_CT28_MOD];
  const K6_29 :i32 = PARITY_DROP[SOFF6_CT29_MOD];
  const K6_30 :i32 = PARITY_DROP[SOFF6_CT30_MOD];
  const K6_31 :i32 = PARITY_DROP[SOFF6_CT31_MOD];
  const K6_32 :i32 = PARITY_DROP[SOFF6_CT32_MOD];
  const K6_33 :i32 = PARITY_DROP[SOFF6_CT33_MOD];
  const K6_34 :i32 = PARITY_DROP[SOFF6_CT34_MOD];
  const K6_35 :i32 = PARITY_DROP[SOFF6_CT35_MOD];
  const K6_36 :i32 = PARITY_DROP[SOFF6_CT36_MOD];
  const K6_37 :i32 = PARITY_DROP[SOFF6_CT37_MOD];
  const K6_38 :i32 = PARITY_DROP[SOFF6_CT38_MOD];
  const K6_39 :i32 = PARITY_DROP[SOFF6_CT39_MOD];
  const K6_40 :i32 = PARITY_DROP[SOFF6_CT40_MOD];
  const K6_41 :i32 = PARITY_DROP[SOFF6_CT41_MOD];
  const K6_42 :i32 = PARITY_DROP[SOFF6_CT42_MOD];
  const K6_43 :i32 = PARITY_DROP[SOFF6_CT43_MOD];
  const K6_44 :i32 = PARITY_DROP[SOFF6_CT44_MOD];
  const K6_45 :i32 = PARITY_DROP[SOFF6_CT45_MOD];
  const K6_46 :i32 = PARITY_DROP[SOFF6_CT46_MOD];
  const K6_47 :i32 = PARITY_DROP[SOFF6_CT47_MOD];

  const K7_0  :i32 = PARITY_DROP[SOFF7_CT0];
  const K7_1  :i32 = PARITY_DROP[SOFF7_CT1];
  const K7_2  :i32 = PARITY_DROP[SOFF7_CT2];
  const K7_3  :i32 = PARITY_DROP[SOFF7_CT3];
  const K7_4  :i32 = PARITY_DROP[SOFF7_CT4];
  const K7_5  :i32 = PARITY_DROP[SOFF7_CT5];
  const K7_6  :i32 = PARITY_DROP[SOFF7_CT6];
  const K7_7  :i32 = PARITY_DROP[SOFF7_CT7];
  const K7_8  :i32 = PARITY_DROP[SOFF7_CT8];
  const K7_9  :i32 = PARITY_DROP[SOFF7_CT9];
  const K7_10 :i32 = PARITY_DROP[SOFF7_CT10];
  const K7_11 :i32 = PARITY_DROP[SOFF7_CT11];
  const K7_12 :i32 = PARITY_DROP[SOFF7_CT12];
  const K7_13 :i32 = PARITY_DROP[SOFF7_CT13];
  const K7_14 :i32 = PARITY_DROP[SOFF7_CT14];
  const K7_15 :i32 = PARITY_DROP[SOFF7_CT15];
  const K7_16 :i32 = PARITY_DROP[SOFF7_CT16];
  const K7_17 :i32 = PARITY_DROP[SOFF7_CT17];
  const K7_18 :i32 = PARITY_DROP[SOFF7_CT18];
  const K7_19 :i32 = PARITY_DROP[SOFF7_CT19];
  const K7_20 :i32 = PARITY_DROP[SOFF7_CT20];
  const K7_21 :i32 = PARITY_DROP[SOFF7_CT21];
  const K7_22 :i32 = PARITY_DROP[SOFF7_CT22];
  const K7_23 :i32 = PARITY_DROP[SOFF7_CT23];
  const K7_24 :i32 = PARITY_DROP[SOFF7_CT24_MOD];
  const K7_25 :i32 = PARITY_DROP[SOFF7_CT25_MOD];
  const K7_26 :i32 = PARITY_DROP[SOFF7_CT26_MOD];
  const K7_27 :i32 = PARITY_DROP[SOFF7_CT27_MOD];
  const K7_28 :i32 = PARITY_DROP[SOFF7_CT28_MOD];
  const K7_29 :i32 = PARITY_DROP[SOFF7_CT29_MOD];
  const K7_30 :i32 = PARITY_DROP[SOFF7_CT30_MOD];
  const K7_31 :i32 = PARITY_DROP[SOFF7_CT31_MOD];
  const K7_32 :i32 = PARITY_DROP[SOFF7_CT32_MOD];
  const K7_33 :i32 = PARITY_DROP[SOFF7_CT33_MOD];
  const K7_34 :i32 = PARITY_DROP[SOFF7_CT34_MOD];
  const K7_35 :i32 = PARITY_DROP[SOFF7_CT35_MOD];
  const K7_36 :i32 = PARITY_DROP[SOFF7_CT36_MOD];
  const K7_37 :i32 = PARITY_DROP[SOFF7_CT37_MOD];
  const K7_38 :i32 = PARITY_DROP[SOFF7_CT38_MOD];
  const K7_39 :i32 = PARITY_DROP[SOFF7_CT39_MOD];
  const K7_40 :i32 = PARITY_DROP[SOFF7_CT40_MOD];
  const K7_41 :i32 = PARITY_DROP[SOFF7_CT41_MOD];
  const K7_42 :i32 = PARITY_DROP[SOFF7_CT42_MOD];
  const K7_43 :i32 = PARITY_DROP[SOFF7_CT43_MOD];
  const K7_44 :i32 = PARITY_DROP[SOFF7_CT44_MOD];
  const K7_45 :i32 = PARITY_DROP[SOFF7_CT45_MOD];
  const K7_46 :i32 = PARITY_DROP[SOFF7_CT46_MOD];
  const K7_47 :i32 = PARITY_DROP[SOFF7_CT47_MOD];

  const K8_0  :i32 = PARITY_DROP[SOFF8_CT0];
  const K8_1  :i32 = PARITY_DROP[SOFF8_CT1];
  const K8_2  :i32 = PARITY_DROP[SOFF8_CT2];
  const K8_3  :i32 = PARITY_DROP[SOFF8_CT3];
  const K8_4  :i32 = PARITY_DROP[SOFF8_CT4];
  const K8_5  :i32 = PARITY_DROP[SOFF8_CT5];
  const K8_6  :i32 = PARITY_DROP[SOFF8_CT6];
  const K8_7  :i32 = PARITY_DROP[SOFF8_CT7];
  const K8_8  :i32 = PARITY_DROP[SOFF8_CT8];
  const K8_9  :i32 = PARITY_DROP[SOFF8_CT9];
  const K8_10 :i32 = PARITY_DROP[SOFF8_CT10];
  const K8_11 :i32 = PARITY_DROP[SOFF8_CT11];
  const K8_12 :i32 = PARITY_DROP[SOFF8_CT12];
  const K8_13 :i32 = PARITY_DROP[SOFF8_CT13];
  const K8_14 :i32 = PARITY_DROP[SOFF8_CT14];
  const K8_15 :i32 = PARITY_DROP[SOFF8_CT15];
  const K8_16 :i32 = PARITY_DROP[SOFF8_CT16];
  const K8_17 :i32 = PARITY_DROP[SOFF8_CT17];
  const K8_18 :i32 = PARITY_DROP[SOFF8_CT18];
  const K8_19 :i32 = PARITY_DROP[SOFF8_CT19];
  const K8_20 :i32 = PARITY_DROP[SOFF8_CT20];
  const K8_21 :i32 = PARITY_DROP[SOFF8_CT21];
  const K8_22 :i32 = PARITY_DROP[SOFF8_CT22];
  const K8_23 :i32 = PARITY_DROP[SOFF8_CT23];
  const K8_24 :i32 = PARITY_DROP[SOFF8_CT24_MOD];
  const K8_25 :i32 = PARITY_DROP[SOFF8_CT25_MOD];
  const K8_26 :i32 = PARITY_DROP[SOFF8_CT26_MOD];
  const K8_27 :i32 = PARITY_DROP[SOFF8_CT27_MOD];
  const K8_28 :i32 = PARITY_DROP[SOFF8_CT28_MOD];
  const K8_29 :i32 = PARITY_DROP[SOFF8_CT29_MOD];
  const K8_30 :i32 = PARITY_DROP[SOFF8_CT30_MOD];
  const K8_31 :i32 = PARITY_DROP[SOFF8_CT31_MOD];
  const K8_32 :i32 = PARITY_DROP[SOFF8_CT32_MOD];
  const K8_33 :i32 = PARITY_DROP[SOFF8_CT33_MOD];
  const K8_34 :i32 = PARITY_DROP[SOFF8_CT34_MOD];
  const K8_35 :i32 = PARITY_DROP[SOFF8_CT35_MOD];
  const K8_36 :i32 = PARITY_DROP[SOFF8_CT36_MOD];
  const K8_37 :i32 = PARITY_DROP[SOFF8_CT37_MOD];
  const K8_38 :i32 = PARITY_DROP[SOFF8_CT38_MOD];
  const K8_39 :i32 = PARITY_DROP[SOFF8_CT39_MOD];
  const K8_40 :i32 = PARITY_DROP[SOFF8_CT40_MOD];
  const K8_41 :i32 = PARITY_DROP[SOFF8_CT41_MOD];
  const K8_42 :i32 = PARITY_DROP[SOFF8_CT42_MOD];
  const K8_43 :i32 = PARITY_DROP[SOFF8_CT43_MOD];
  const K8_44 :i32 = PARITY_DROP[SOFF8_CT44_MOD];
  const K8_45 :i32 = PARITY_DROP[SOFF8_CT45_MOD];
  const K8_46 :i32 = PARITY_DROP[SOFF8_CT46_MOD];
  const K8_47 :i32 = PARITY_DROP[SOFF8_CT47_MOD];

  const K9_0  :i32 = PARITY_DROP[SOFF9_CT0];
  const K9_1  :i32 = PARITY_DROP[SOFF9_CT1];
  const K9_2  :i32 = PARITY_DROP[SOFF9_CT2];
  const K9_3  :i32 = PARITY_DROP[SOFF9_CT3];
  const K9_4  :i32 = PARITY_DROP[SOFF9_CT4];
  const K9_5  :i32 = PARITY_DROP[SOFF9_CT5];
  const K9_6  :i32 = PARITY_DROP[SOFF9_CT6];
  const K9_7  :i32 = PARITY_DROP[SOFF9_CT7];
  const K9_8  :i32 = PARITY_DROP[SOFF9_CT8];
  const K9_9  :i32 = PARITY_DROP[SOFF9_CT9];
  const K9_10 :i32 = PARITY_DROP[SOFF9_CT10];
  const K9_11 :i32 = PARITY_DROP[SOFF9_CT11];
  const K9_12 :i32 = PARITY_DROP[SOFF9_CT12];
  const K9_13 :i32 = PARITY_DROP[SOFF9_CT13];
  const K9_14 :i32 = PARITY_DROP[SOFF9_CT14];
  const K9_15 :i32 = PARITY_DROP[SOFF9_CT15];
  const K9_16 :i32 = PARITY_DROP[SOFF9_CT16];
  const K9_17 :i32 = PARITY_DROP[SOFF9_CT17];
  const K9_18 :i32 = PARITY_DROP[SOFF9_CT18];
  const K9_19 :i32 = PARITY_DROP[SOFF9_CT19];
  const K9_20 :i32 = PARITY_DROP[SOFF9_CT20];
  const K9_21 :i32 = PARITY_DROP[SOFF9_CT21];
  const K9_22 :i32 = PARITY_DROP[SOFF9_CT22];
  const K9_23 :i32 = PARITY_DROP[SOFF9_CT23];
  const K9_24 :i32 = PARITY_DROP[SOFF9_CT24_MOD];
  const K9_25 :i32 = PARITY_DROP[SOFF9_CT25_MOD];
  const K9_26 :i32 = PARITY_DROP[SOFF9_CT26_MOD];
  const K9_27 :i32 = PARITY_DROP[SOFF9_CT27_MOD];
  const K9_28 :i32 = PARITY_DROP[SOFF9_CT28_MOD];
  const K9_29 :i32 = PARITY_DROP[SOFF9_CT29_MOD];
  const K9_30 :i32 = PARITY_DROP[SOFF9_CT30_MOD];
  const K9_31 :i32 = PARITY_DROP[SOFF9_CT31_MOD];
  const K9_32 :i32 = PARITY_DROP[SOFF9_CT32_MOD];
  const K9_33 :i32 = PARITY_DROP[SOFF9_CT33_MOD];
  const K9_34 :i32 = PARITY_DROP[SOFF9_CT34_MOD];
  const K9_35 :i32 = PARITY_DROP[SOFF9_CT35_MOD];
  const K9_36 :i32 = PARITY_DROP[SOFF9_CT36_MOD];
  const K9_37 :i32 = PARITY_DROP[SOFF9_CT37_MOD];
  const K9_38 :i32 = PARITY_DROP[SOFF9_CT38_MOD];
  const K9_39 :i32 = PARITY_DROP[SOFF9_CT39_MOD];
  const K9_40 :i32 = PARITY_DROP[SOFF9_CT40_MOD];
  const K9_41 :i32 = PARITY_DROP[SOFF9_CT41_MOD];
  const K9_42 :i32 = PARITY_DROP[SOFF9_CT42_MOD];
  const K9_43 :i32 = PARITY_DROP[SOFF9_CT43_MOD];
  const K9_44 :i32 = PARITY_DROP[SOFF9_CT44_MOD];
  const K9_45 :i32 = PARITY_DROP[SOFF9_CT45_MOD];
  const K9_46 :i32 = PARITY_DROP[SOFF9_CT46_MOD];
  const K9_47 :i32 = PARITY_DROP[SOFF9_CT47_MOD];

  const K10_0  :i32 = PARITY_DROP[SOFF10_CT0];
  const K10_1  :i32 = PARITY_DROP[SOFF10_CT1];
  const K10_2  :i32 = PARITY_DROP[SOFF10_CT2];
  const K10_3  :i32 = PARITY_DROP[SOFF10_CT3];
  const K10_4  :i32 = PARITY_DROP[SOFF10_CT4];
  const K10_5  :i32 = PARITY_DROP[SOFF10_CT5];
  const K10_6  :i32 = PARITY_DROP[SOFF10_CT6];
  const K10_7  :i32 = PARITY_DROP[SOFF10_CT7];
  const K10_8  :i32 = PARITY_DROP[SOFF10_CT8];
  const K10_9  :i32 = PARITY_DROP[SOFF10_CT9];
  const K10_10 :i32 = PARITY_DROP[SOFF10_CT10];
  const K10_11 :i32 = PARITY_DROP[SOFF10_CT11];
  const K10_12 :i32 = PARITY_DROP[SOFF10_CT12];
  const K10_13 :i32 = PARITY_DROP[SOFF10_CT13];
  const K10_14 :i32 = PARITY_DROP[SOFF10_CT14];
  const K10_15 :i32 = PARITY_DROP[SOFF10_CT15];
  const K10_16 :i32 = PARITY_DROP[SOFF10_CT16];
  const K10_17 :i32 = PARITY_DROP[SOFF10_CT17];
  const K10_18 :i32 = PARITY_DROP[SOFF10_CT18];
  const K10_19 :i32 = PARITY_DROP[SOFF10_CT19];
  const K10_20 :i32 = PARITY_DROP[SOFF10_CT20];
  const K10_21 :i32 = PARITY_DROP[SOFF10_CT21];
  const K10_22 :i32 = PARITY_DROP[SOFF10_CT22];
  const K10_23 :i32 = PARITY_DROP[SOFF10_CT23];
  const K10_24 :i32 = PARITY_DROP[SOFF10_CT24_MOD];
  const K10_25 :i32 = PARITY_DROP[SOFF10_CT25_MOD];
  const K10_26 :i32 = PARITY_DROP[SOFF10_CT26_MOD];
  const K10_27 :i32 = PARITY_DROP[SOFF10_CT27_MOD];
  const K10_28 :i32 = PARITY_DROP[SOFF10_CT28_MOD];
  const K10_29 :i32 = PARITY_DROP[SOFF10_CT29_MOD];
  const K10_30 :i32 = PARITY_DROP[SOFF10_CT30_MOD];
  const K10_31 :i32 = PARITY_DROP[SOFF10_CT31_MOD];
  const K10_32 :i32 = PARITY_DROP[SOFF10_CT32_MOD];
  const K10_33 :i32 = PARITY_DROP[SOFF10_CT33_MOD];
  const K10_34 :i32 = PARITY_DROP[SOFF10_CT34_MOD];
  const K10_35 :i32 = PARITY_DROP[SOFF10_CT35_MOD];
  const K10_36 :i32 = PARITY_DROP[SOFF10_CT36_MOD];
  const K10_37 :i32 = PARITY_DROP[SOFF10_CT37_MOD];
  const K10_38 :i32 = PARITY_DROP[SOFF10_CT38_MOD];
  const K10_39 :i32 = PARITY_DROP[SOFF10_CT39_MOD];
  const K10_40 :i32 = PARITY_DROP[SOFF10_CT40_MOD];
  const K10_41 :i32 = PARITY_DROP[SOFF10_CT41_MOD];
  const K10_42 :i32 = PARITY_DROP[SOFF10_CT42_MOD];
  const K10_43 :i32 = PARITY_DROP[SOFF10_CT43_MOD];
  const K10_44 :i32 = PARITY_DROP[SOFF10_CT44_MOD];
  const K10_45 :i32 = PARITY_DROP[SOFF10_CT45_MOD];
  const K10_46 :i32 = PARITY_DROP[SOFF10_CT46_MOD];
  const K10_47 :i32 = PARITY_DROP[SOFF10_CT47_MOD];

  const K11_0  :i32 = PARITY_DROP[SOFF11_CT0];
  const K11_1  :i32 = PARITY_DROP[SOFF11_CT1];
  const K11_2  :i32 = PARITY_DROP[SOFF11_CT2];
  const K11_3  :i32 = PARITY_DROP[SOFF11_CT3];
  const K11_4  :i32 = PARITY_DROP[SOFF11_CT4];
  const K11_5  :i32 = PARITY_DROP[SOFF11_CT5];
  const K11_6  :i32 = PARITY_DROP[SOFF11_CT6];
  const K11_7  :i32 = PARITY_DROP[SOFF11_CT7];
  const K11_8  :i32 = PARITY_DROP[SOFF11_CT8];
  const K11_9  :i32 = PARITY_DROP[SOFF11_CT9];
  const K11_10 :i32 = PARITY_DROP[SOFF11_CT10];
  const K11_11 :i32 = PARITY_DROP[SOFF11_CT11];
  const K11_12 :i32 = PARITY_DROP[SOFF11_CT12];
  const K11_13 :i32 = PARITY_DROP[SOFF11_CT13];
  const K11_14 :i32 = PARITY_DROP[SOFF11_CT14];
  const K11_15 :i32 = PARITY_DROP[SOFF11_CT15];
  const K11_16 :i32 = PARITY_DROP[SOFF11_CT16];
  const K11_17 :i32 = PARITY_DROP[SOFF11_CT17];
  const K11_18 :i32 = PARITY_DROP[SOFF11_CT18];
  const K11_19 :i32 = PARITY_DROP[SOFF11_CT19];
  const K11_20 :i32 = PARITY_DROP[SOFF11_CT20];
  const K11_21 :i32 = PARITY_DROP[SOFF11_CT21];
  const K11_22 :i32 = PARITY_DROP[SOFF11_CT22];
  const K11_23 :i32 = PARITY_DROP[SOFF11_CT23];
  const K11_24 :i32 = PARITY_DROP[SOFF11_CT24_MOD];
  const K11_25 :i32 = PARITY_DROP[SOFF11_CT25_MOD];
  const K11_26 :i32 = PARITY_DROP[SOFF11_CT26_MOD];
  const K11_27 :i32 = PARITY_DROP[SOFF11_CT27_MOD];
  const K11_28 :i32 = PARITY_DROP[SOFF11_CT28_MOD];
  const K11_29 :i32 = PARITY_DROP[SOFF11_CT29_MOD];
  const K11_30 :i32 = PARITY_DROP[SOFF11_CT30_MOD];
  const K11_31 :i32 = PARITY_DROP[SOFF11_CT31_MOD];
  const K11_32 :i32 = PARITY_DROP[SOFF11_CT32_MOD];
  const K11_33 :i32 = PARITY_DROP[SOFF11_CT33_MOD];
  const K11_34 :i32 = PARITY_DROP[SOFF11_CT34_MOD];
  const K11_35 :i32 = PARITY_DROP[SOFF11_CT35_MOD];
  const K11_36 :i32 = PARITY_DROP[SOFF11_CT36_MOD];
  const K11_37 :i32 = PARITY_DROP[SOFF11_CT37_MOD];
  const K11_38 :i32 = PARITY_DROP[SOFF11_CT38_MOD];
  const K11_39 :i32 = PARITY_DROP[SOFF11_CT39_MOD];
  const K11_40 :i32 = PARITY_DROP[SOFF11_CT40_MOD];
  const K11_41 :i32 = PARITY_DROP[SOFF11_CT41_MOD];
  const K11_42 :i32 = PARITY_DROP[SOFF11_CT42_MOD];
  const K11_43 :i32 = PARITY_DROP[SOFF11_CT43_MOD];
  const K11_44 :i32 = PARITY_DROP[SOFF11_CT44_MOD];
  const K11_45 :i32 = PARITY_DROP[SOFF11_CT45_MOD];
  const K11_46 :i32 = PARITY_DROP[SOFF11_CT46_MOD];
  const K11_47 :i32 = PARITY_DROP[SOFF11_CT47_MOD];

  const K12_0  :i32 = PARITY_DROP[SOFF12_CT0];
  const K12_1  :i32 = PARITY_DROP[SOFF12_CT1];
  const K12_2  :i32 = PARITY_DROP[SOFF12_CT2];
  const K12_3  :i32 = PARITY_DROP[SOFF12_CT3];
  const K12_4  :i32 = PARITY_DROP[SOFF12_CT4];
  const K12_5  :i32 = PARITY_DROP[SOFF12_CT5];
  const K12_6  :i32 = PARITY_DROP[SOFF12_CT6];
  const K12_7  :i32 = PARITY_DROP[SOFF12_CT7];
  const K12_8  :i32 = PARITY_DROP[SOFF12_CT8];
  const K12_9  :i32 = PARITY_DROP[SOFF12_CT9];
  const K12_10 :i32 = PARITY_DROP[SOFF12_CT10];
  const K12_11 :i32 = PARITY_DROP[SOFF12_CT11];
  const K12_12 :i32 = PARITY_DROP[SOFF12_CT12];
  const K12_13 :i32 = PARITY_DROP[SOFF12_CT13];
  const K12_14 :i32 = PARITY_DROP[SOFF12_CT14];
  const K12_15 :i32 = PARITY_DROP[SOFF12_CT15];
  const K12_16 :i32 = PARITY_DROP[SOFF12_CT16];
  const K12_17 :i32 = PARITY_DROP[SOFF12_CT17];
  const K12_18 :i32 = PARITY_DROP[SOFF12_CT18];
  const K12_19 :i32 = PARITY_DROP[SOFF12_CT19];
  const K12_20 :i32 = PARITY_DROP[SOFF12_CT20];
  const K12_21 :i32 = PARITY_DROP[SOFF12_CT21];
  const K12_22 :i32 = PARITY_DROP[SOFF12_CT22];
  const K12_23 :i32 = PARITY_DROP[SOFF12_CT23];
  const K12_24 :i32 = PARITY_DROP[SOFF12_CT24_MOD];
  const K12_25 :i32 = PARITY_DROP[SOFF12_CT25_MOD];
  const K12_26 :i32 = PARITY_DROP[SOFF12_CT26_MOD];
  const K12_27 :i32 = PARITY_DROP[SOFF12_CT27_MOD];
  const K12_28 :i32 = PARITY_DROP[SOFF12_CT28_MOD];
  const K12_29 :i32 = PARITY_DROP[SOFF12_CT29_MOD];
  const K12_30 :i32 = PARITY_DROP[SOFF12_CT30_MOD];
  const K12_31 :i32 = PARITY_DROP[SOFF12_CT31_MOD];
  const K12_32 :i32 = PARITY_DROP[SOFF12_CT32_MOD];
  const K12_33 :i32 = PARITY_DROP[SOFF12_CT33_MOD];
  const K12_34 :i32 = PARITY_DROP[SOFF12_CT34_MOD];
  const K12_35 :i32 = PARITY_DROP[SOFF12_CT35_MOD];
  const K12_36 :i32 = PARITY_DROP[SOFF12_CT36_MOD];
  const K12_37 :i32 = PARITY_DROP[SOFF12_CT37_MOD];
  const K12_38 :i32 = PARITY_DROP[SOFF12_CT38_MOD];
  const K12_39 :i32 = PARITY_DROP[SOFF12_CT39_MOD];
  const K12_40 :i32 = PARITY_DROP[SOFF12_CT40_MOD];
  const K12_41 :i32 = PARITY_DROP[SOFF12_CT41_MOD];
  const K12_42 :i32 = PARITY_DROP[SOFF12_CT42_MOD];
  const K12_43 :i32 = PARITY_DROP[SOFF12_CT43_MOD];
  const K12_44 :i32 = PARITY_DROP[SOFF12_CT44_MOD];
  const K12_45 :i32 = PARITY_DROP[SOFF12_CT45_MOD];
  const K12_46 :i32 = PARITY_DROP[SOFF12_CT46_MOD];
  const K12_47 :i32 = PARITY_DROP[SOFF12_CT47_MOD];

  const K13_0  :i32 = PARITY_DROP[SOFF13_CT0];
  const K13_1  :i32 = PARITY_DROP[SOFF13_CT1];
  const K13_2  :i32 = PARITY_DROP[SOFF13_CT2];
  const K13_3  :i32 = PARITY_DROP[SOFF13_CT3];
  const K13_4  :i32 = PARITY_DROP[SOFF13_CT4];
  const K13_5  :i32 = PARITY_DROP[SOFF13_CT5];
  const K13_6  :i32 = PARITY_DROP[SOFF13_CT6];
  const K13_7  :i32 = PARITY_DROP[SOFF13_CT7];
  const K13_8  :i32 = PARITY_DROP[SOFF13_CT8];
  const K13_9  :i32 = PARITY_DROP[SOFF13_CT9];
  const K13_10 :i32 = PARITY_DROP[SOFF13_CT10];
  const K13_11 :i32 = PARITY_DROP[SOFF13_CT11];
  const K13_12 :i32 = PARITY_DROP[SOFF13_CT12];
  const K13_13 :i32 = PARITY_DROP[SOFF13_CT13];
  const K13_14 :i32 = PARITY_DROP[SOFF13_CT14];
  const K13_15 :i32 = PARITY_DROP[SOFF13_CT15];
  const K13_16 :i32 = PARITY_DROP[SOFF13_CT16];
  const K13_17 :i32 = PARITY_DROP[SOFF13_CT17];
  const K13_18 :i32 = PARITY_DROP[SOFF13_CT18];
  const K13_19 :i32 = PARITY_DROP[SOFF13_CT19];
  const K13_20 :i32 = PARITY_DROP[SOFF13_CT20];
  const K13_21 :i32 = PARITY_DROP[SOFF13_CT21];
  const K13_22 :i32 = PARITY_DROP[SOFF13_CT22];
  const K13_23 :i32 = PARITY_DROP[SOFF13_CT23];
  const K13_24 :i32 = PARITY_DROP[SOFF13_CT24_MOD];
  const K13_25 :i32 = PARITY_DROP[SOFF13_CT25_MOD];
  const K13_26 :i32 = PARITY_DROP[SOFF13_CT26_MOD];
  const K13_27 :i32 = PARITY_DROP[SOFF13_CT27_MOD];
  const K13_28 :i32 = PARITY_DROP[SOFF13_CT28_MOD];
  const K13_29 :i32 = PARITY_DROP[SOFF13_CT29_MOD];
  const K13_30 :i32 = PARITY_DROP[SOFF13_CT30_MOD];
  const K13_31 :i32 = PARITY_DROP[SOFF13_CT31_MOD];
  const K13_32 :i32 = PARITY_DROP[SOFF13_CT32_MOD];
  const K13_33 :i32 = PARITY_DROP[SOFF13_CT33_MOD];
  const K13_34 :i32 = PARITY_DROP[SOFF13_CT34_MOD];
  const K13_35 :i32 = PARITY_DROP[SOFF13_CT35_MOD];
  const K13_36 :i32 = PARITY_DROP[SOFF13_CT36_MOD];
  const K13_37 :i32 = PARITY_DROP[SOFF13_CT37_MOD];
  const K13_38 :i32 = PARITY_DROP[SOFF13_CT38_MOD];
  const K13_39 :i32 = PARITY_DROP[SOFF13_CT39_MOD];
  const K13_40 :i32 = PARITY_DROP[SOFF13_CT40_MOD];
  const K13_41 :i32 = PARITY_DROP[SOFF13_CT41_MOD];
  const K13_42 :i32 = PARITY_DROP[SOFF13_CT42_MOD];
  const K13_43 :i32 = PARITY_DROP[SOFF13_CT43_MOD];
  const K13_44 :i32 = PARITY_DROP[SOFF13_CT44_MOD];
  const K13_45 :i32 = PARITY_DROP[SOFF13_CT45_MOD];
  const K13_46 :i32 = PARITY_DROP[SOFF13_CT46_MOD];
  const K13_47 :i32 = PARITY_DROP[SOFF13_CT47_MOD];

  const K14_0  :i32 = PARITY_DROP[SOFF14_CT0];
  const K14_1  :i32 = PARITY_DROP[SOFF14_CT1];
  const K14_2  :i32 = PARITY_DROP[SOFF14_CT2];
  const K14_3  :i32 = PARITY_DROP[SOFF14_CT3];
  const K14_4  :i32 = PARITY_DROP[SOFF14_CT4];
  const K14_5  :i32 = PARITY_DROP[SOFF14_CT5];
  const K14_6  :i32 = PARITY_DROP[SOFF14_CT6];
  const K14_7  :i32 = PARITY_DROP[SOFF14_CT7];
  const K14_8  :i32 = PARITY_DROP[SOFF14_CT8];
  const K14_9  :i32 = PARITY_DROP[SOFF14_CT9];
  const K14_10 :i32 = PARITY_DROP[SOFF14_CT10];
  const K14_11 :i32 = PARITY_DROP[SOFF14_CT11];
  const K14_12 :i32 = PARITY_DROP[SOFF14_CT12];
  const K14_13 :i32 = PARITY_DROP[SOFF14_CT13];
  const K14_14 :i32 = PARITY_DROP[SOFF14_CT14];
  const K14_15 :i32 = PARITY_DROP[SOFF14_CT15];
  const K14_16 :i32 = PARITY_DROP[SOFF14_CT16];
  const K14_17 :i32 = PARITY_DROP[SOFF14_CT17];
  const K14_18 :i32 = PARITY_DROP[SOFF14_CT18];
  const K14_19 :i32 = PARITY_DROP[SOFF14_CT19];
  const K14_20 :i32 = PARITY_DROP[SOFF14_CT20];
  const K14_21 :i32 = PARITY_DROP[SOFF14_CT21];
  const K14_22 :i32 = PARITY_DROP[SOFF14_CT22];
  const K14_23 :i32 = PARITY_DROP[SOFF14_CT23];
  const K14_24 :i32 = PARITY_DROP[SOFF14_CT24_MOD];
  const K14_25 :i32 = PARITY_DROP[SOFF14_CT25_MOD];
  const K14_26 :i32 = PARITY_DROP[SOFF14_CT26_MOD];
  const K14_27 :i32 = PARITY_DROP[SOFF14_CT27_MOD];
  const K14_28 :i32 = PARITY_DROP[SOFF14_CT28_MOD];
  const K14_29 :i32 = PARITY_DROP[SOFF14_CT29_MOD];
  const K14_30 :i32 = PARITY_DROP[SOFF14_CT30_MOD];
  const K14_31 :i32 = PARITY_DROP[SOFF14_CT31_MOD];
  const K14_32 :i32 = PARITY_DROP[SOFF14_CT32_MOD];
  const K14_33 :i32 = PARITY_DROP[SOFF14_CT33_MOD];
  const K14_34 :i32 = PARITY_DROP[SOFF14_CT34_MOD];
  const K14_35 :i32 = PARITY_DROP[SOFF14_CT35_MOD];
  const K14_36 :i32 = PARITY_DROP[SOFF14_CT36_MOD];
  const K14_37 :i32 = PARITY_DROP[SOFF14_CT37_MOD];
  const K14_38 :i32 = PARITY_DROP[SOFF14_CT38_MOD];
  const K14_39 :i32 = PARITY_DROP[SOFF14_CT39_MOD];
  const K14_40 :i32 = PARITY_DROP[SOFF14_CT40_MOD];
  const K14_41 :i32 = PARITY_DROP[SOFF14_CT41_MOD];
  const K14_42 :i32 = PARITY_DROP[SOFF14_CT42_MOD];
  const K14_43 :i32 = PARITY_DROP[SOFF14_CT43_MOD];
  const K14_44 :i32 = PARITY_DROP[SOFF14_CT44_MOD];
  const K14_45 :i32 = PARITY_DROP[SOFF14_CT45_MOD];
  const K14_46 :i32 = PARITY_DROP[SOFF14_CT46_MOD];
  const K14_47 :i32 = PARITY_DROP[SOFF14_CT47_MOD];

  const K15_0  :i32 = PARITY_DROP[SOFF15_CT0];
  const K15_1  :i32 = PARITY_DROP[SOFF15_CT1];
  const K15_2  :i32 = PARITY_DROP[SOFF15_CT2];
  const K15_3  :i32 = PARITY_DROP[SOFF15_CT3];
  const K15_4  :i32 = PARITY_DROP[SOFF15_CT4];
  const K15_5  :i32 = PARITY_DROP[SOFF15_CT5];
  const K15_6  :i32 = PARITY_DROP[SOFF15_CT6];
  const K15_7  :i32 = PARITY_DROP[SOFF15_CT7];
  const K15_8  :i32 = PARITY_DROP[SOFF15_CT8];
  const K15_9  :i32 = PARITY_DROP[SOFF15_CT9];
  const K15_10 :i32 = PARITY_DROP[SOFF15_CT10];
  const K15_11 :i32 = PARITY_DROP[SOFF15_CT11];
  const K15_12 :i32 = PARITY_DROP[SOFF15_CT12];
  const K15_13 :i32 = PARITY_DROP[SOFF15_CT13];
  const K15_14 :i32 = PARITY_DROP[SOFF15_CT14];
  const K15_15 :i32 = PARITY_DROP[SOFF15_CT15];
  const K15_16 :i32 = PARITY_DROP[SOFF15_CT16];
  const K15_17 :i32 = PARITY_DROP[SOFF15_CT17];
  const K15_18 :i32 = PARITY_DROP[SOFF15_CT18];
  const K15_19 :i32 = PARITY_DROP[SOFF15_CT19];
  const K15_20 :i32 = PARITY_DROP[SOFF15_CT20];
  const K15_21 :i32 = PARITY_DROP[SOFF15_CT21];
  const K15_22 :i32 = PARITY_DROP[SOFF15_CT22];
  const K15_23 :i32 = PARITY_DROP[SOFF15_CT23];
  const K15_24 :i32 = PARITY_DROP[SOFF15_CT24_MOD];
  const K15_25 :i32 = PARITY_DROP[SOFF15_CT25_MOD];
  const K15_26 :i32 = PARITY_DROP[SOFF15_CT26_MOD];
  const K15_27 :i32 = PARITY_DROP[SOFF15_CT27_MOD];
  const K15_28 :i32 = PARITY_DROP[SOFF15_CT28_MOD];
  const K15_29 :i32 = PARITY_DROP[SOFF15_CT29_MOD];
  const K15_30 :i32 = PARITY_DROP[SOFF15_CT30_MOD];
  const K15_31 :i32 = PARITY_DROP[SOFF15_CT31_MOD];
  const K15_32 :i32 = PARITY_DROP[SOFF15_CT32_MOD];
  const K15_33 :i32 = PARITY_DROP[SOFF15_CT33_MOD];
  const K15_34 :i32 = PARITY_DROP[SOFF15_CT34_MOD];
  const K15_35 :i32 = PARITY_DROP[SOFF15_CT35_MOD];
  const K15_36 :i32 = PARITY_DROP[SOFF15_CT36_MOD];
  const K15_37 :i32 = PARITY_DROP[SOFF15_CT37_MOD];
  const K15_38 :i32 = PARITY_DROP[SOFF15_CT38_MOD];
  const K15_39 :i32 = PARITY_DROP[SOFF15_CT39_MOD];
  const K15_40 :i32 = PARITY_DROP[SOFF15_CT40_MOD];
  const K15_41 :i32 = PARITY_DROP[SOFF15_CT41_MOD];
  const K15_42 :i32 = PARITY_DROP[SOFF15_CT42_MOD];
  const K15_43 :i32 = PARITY_DROP[SOFF15_CT43_MOD];
  const K15_44 :i32 = PARITY_DROP[SOFF15_CT44_MOD];
  const K15_45 :i32 = PARITY_DROP[SOFF15_CT45_MOD];
  const K15_46 :i32 = PARITY_DROP[SOFF15_CT46_MOD];
  const K15_47 :i32 = PARITY_DROP[SOFF15_CT47_MOD];


  for(i = 0; i < 32; i++) {
    L[i] = 0;
    R[i] = 0;
  }

  for(round_n = 0; round_n < 13; round_n++) {
   /********************************************************************
    *
    * FIRST PART
    * Ronuds 0 - 2 - 4 - 6 - 8 - 10 - 12 - 14 - 16 - 18 - 20 - 22 - 24
    *
    *******************************************************************/
    // 0
    row = ( K0_5 ^ R[ET5] )
      + ( ( K0_0 ^ R[ET0] ) << 1 );
    col = ( K0_4 ^ R[ET4] )
      + ( ( K0_3 ^ R[ET3] ) << 1 )
      + ( ( K0_2 ^ R[ET2] ) << 2 )
      + ( ( K0_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K0_11 ^ R[ET11] )
      + ( ( K0_6  ^ R[ET6 ] ) << 1 );
    col = ( K0_10 ^ R[ET10] )
      + ( ( K0_9  ^ R[ET9 ] ) << 1 )
      + ( ( K0_8  ^ R[ET8 ] ) << 2 )
      + ( ( K0_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K0_17 ^ R[ET17] )
      + ( ( K0_12 ^ R[ET12] ) << 1 );
    col = ( K0_16 ^ R[ET16] )
      + ( ( K0_15 ^ R[ET15] ) << 1 )
      + ( ( K0_14 ^ R[ET14] ) << 2 )
      + ( ( K0_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K0_23 ^ R[ET23] )
      + ( ( K0_18 ^ R[ET18] ) << 1 );
    col = ( K0_22 ^ R[ET22] )
      + ( ( K0_21 ^ R[ET21] ) << 1 )
      + ( ( K0_20 ^ R[ET20] ) << 2 )
      + ( ( K0_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K0_29 ^ R[ET29] )
      + ( ( K0_24 ^ R[ET24] ) << 1 );
    col = ( K0_28 ^ R[ET28] )
      + ( ( K0_27 ^ R[ET27] ) << 1 )
      + ( ( K0_26 ^ R[ET26] ) << 2 )
      + ( ( K0_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K0_35 ^ R[ET35] )
      + ( ( K0_30 ^ R[ET30] ) << 1 );
    col = ( K0_34 ^ R[ET34] )
      + ( ( K0_33 ^ R[ET33] ) << 1 )
      + ( ( K0_32 ^ R[ET32] ) << 2 )
      + ( ( K0_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K0_41 ^ R[ET41] )
      + ( ( K0_36 ^ R[ET36] ) << 1 );
    col = ( K0_40 ^ R[ET40] )
      + ( ( K0_39 ^ R[ET39] ) << 1 )
      + ( ( K0_38 ^ R[ET38] ) << 2 )
      + ( ( K0_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K0_47 ^ R[ET47] )
      + ( ( K0_42 ^ R[ET42] ) << 1 );
    col = ( K0_46 ^ R[ET46] )
      + ( ( K0_45 ^ R[ET45] ) << 1 )
      + ( ( K0_44 ^ R[ET44] ) << 2 )
      + ( ( K0_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 1
    row = ( K1_5 ^ L[ET5] )
      + ( ( K1_0 ^ L[ET0] ) << 1 );
    col = ( K1_4 ^ L[ET4] )
      + ( ( K1_3 ^ L[ET3] ) << 1 )
      + ( ( K1_2 ^ L[ET2] ) << 2 )
      + ( ( K1_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K1_11 ^ L[ET11] )
      + ( ( K1_6  ^ L[ET6 ] ) << 1 );
    col = ( K1_10 ^ L[ET10] )
      + ( ( K1_9  ^ L[ET9 ] ) << 1 )
      + ( ( K1_8  ^ L[ET8 ] ) << 2 )
      + ( ( K1_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K1_17 ^ L[ET17] )
      + ( ( K1_12 ^ L[ET12] ) << 1 );
    col = ( K1_16 ^ L[ET16] )
      + ( ( K1_15 ^ L[ET15] ) << 1 )
      + ( ( K1_14 ^ L[ET14] ) << 2 )
      + ( ( K1_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K1_23 ^ L[ET23] )
      + ( ( K1_18 ^ L[ET18] ) << 1 );
    col = ( K1_22 ^ L[ET22] )
      + ( ( K1_21 ^ L[ET21] ) << 1 )
      + ( ( K1_20 ^ L[ET20] ) << 2 )
      + ( ( K1_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K1_29 ^ L[ET29] )
      + ( ( K1_24 ^ L[ET24] ) << 1 );
    col = ( K1_28 ^ L[ET28] )
      + ( ( K1_27 ^ L[ET27] ) << 1 )
      + ( ( K1_26 ^ L[ET26] ) << 2 )
      + ( ( K1_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K1_35 ^ L[ET35] )
      + ( ( K1_30 ^ L[ET30] ) << 1 );
    col = ( K1_34 ^ L[ET34] )
      + ( ( K1_33 ^ L[ET33] ) << 1 )
      + ( ( K1_32 ^ L[ET32] ) << 2 )
      + ( ( K1_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K1_41 ^ L[ET41] )
      + ( ( K1_36 ^ L[ET36] ) << 1 );
    col = ( K1_40 ^ L[ET40] )
      + ( ( K1_39 ^ L[ET39] ) << 1 )
      + ( ( K1_38 ^ L[ET38] ) << 2 )
      + ( ( K1_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K1_47 ^ L[ET47] )
      + ( ( K1_42 ^ L[ET42] ) << 1 );
    col = ( K1_46 ^ L[ET46] )
      + ( ( K1_45 ^ L[ET45] ) << 1 )
      + ( ( K1_44 ^ L[ET44] ) << 2 )
      + ( ( K1_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 2
    row = ( K2_5 ^ R[ET5] )
      + ( ( K2_0 ^ R[ET0] ) << 1 );
    col = ( K2_4 ^ R[ET4] )
      + ( ( K2_3 ^ R[ET3] ) << 1 )
      + ( ( K2_2 ^ R[ET2] ) << 2 )
      + ( ( K2_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K2_11 ^ R[ET11] )
      + ( ( K2_6  ^ R[ET6 ] ) << 1 );
    col = ( K2_10 ^ R[ET10] )
      + ( ( K2_9  ^ R[ET9 ] ) << 1 )
      + ( ( K2_8  ^ R[ET8 ] ) << 2 )
      + ( ( K2_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K2_17 ^ R[ET17] )
      + ( ( K2_12 ^ R[ET12] ) << 1 );
    col = ( K2_16 ^ R[ET16] )
      + ( ( K2_15 ^ R[ET15] ) << 1 )
      + ( ( K2_14 ^ R[ET14] ) << 2 )
      + ( ( K2_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K2_23 ^ R[ET23] )
      + ( ( K2_18 ^ R[ET18] ) << 1 );
    col = ( K2_22 ^ R[ET22] )
      + ( ( K2_21 ^ R[ET21] ) << 1 )
      + ( ( K2_20 ^ R[ET20] ) << 2 )
      + ( ( K2_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K2_29 ^ R[ET29] )
      + ( ( K2_24 ^ R[ET24] ) << 1 );
    col = ( K2_28 ^ R[ET28] )
      + ( ( K2_27 ^ R[ET27] ) << 1 )
      + ( ( K2_26 ^ R[ET26] ) << 2 )
      + ( ( K2_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K2_35 ^ R[ET35] )
      + ( ( K2_30 ^ R[ET30] ) << 1 );
    col = ( K2_34 ^ R[ET34] )
      + ( ( K2_33 ^ R[ET33] ) << 1 )
      + ( ( K2_32 ^ R[ET32] ) << 2 )
      + ( ( K2_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K2_41 ^ R[ET41] )
      + ( ( K2_36 ^ R[ET36] ) << 1 );
    col = ( K2_40 ^ R[ET40] )
      + ( ( K2_39 ^ R[ET39] ) << 1 )
      + ( ( K2_38 ^ R[ET38] ) << 2 )
      + ( ( K2_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K2_47 ^ R[ET47] )
      + ( ( K2_42 ^ R[ET42] ) << 1 );
    col = ( K2_46 ^ R[ET46] )
      + ( ( K2_45 ^ R[ET45] ) << 1 )
      + ( ( K2_44 ^ R[ET44] ) << 2 )
      + ( ( K2_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 3
    row = ( K3_5 ^ L[ET5] )
      + ( ( K3_0 ^ L[ET0] ) << 1 );
    col = ( K3_4 ^ L[ET4] )
      + ( ( K3_3 ^ L[ET3] ) << 1 )
      + ( ( K3_2 ^ L[ET2] ) << 2 )
      + ( ( K3_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K3_11 ^ L[ET11] )
      + ( ( K3_6  ^ L[ET6 ] ) << 1 );
    col = ( K3_10 ^ L[ET10] )
      + ( ( K3_9  ^ L[ET9 ] ) << 1 )
      + ( ( K3_8  ^ L[ET8 ] ) << 2 )
      + ( ( K3_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K3_17 ^ L[ET17] )
      + ( ( K3_12 ^ L[ET12] ) << 1 );
    col = ( K3_16 ^ L[ET16] )
      + ( ( K3_15 ^ L[ET15] ) << 1 )
      + ( ( K3_14 ^ L[ET14] ) << 2 )
      + ( ( K3_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K3_23 ^ L[ET23] )
      + ( ( K3_18 ^ L[ET18] ) << 1 );
    col = ( K3_22 ^ L[ET22] )
      + ( ( K3_21 ^ L[ET21] ) << 1 )
      + ( ( K3_20 ^ L[ET20] ) << 2 )
      + ( ( K3_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K3_29 ^ L[ET29] )
      + ( ( K3_24 ^ L[ET24] ) << 1 );
    col = ( K3_28 ^ L[ET28] )
      + ( ( K3_27 ^ L[ET27] ) << 1 )
      + ( ( K3_26 ^ L[ET26] ) << 2 )
      + ( ( K3_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K3_35 ^ L[ET35] )
      + ( ( K3_30 ^ L[ET30] ) << 1 );
    col = ( K3_34 ^ L[ET34] )
      + ( ( K3_33 ^ L[ET33] ) << 1 )
      + ( ( K3_32 ^ L[ET32] ) << 2 )
      + ( ( K3_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K3_41 ^ L[ET41] )
      + ( ( K3_36 ^ L[ET36] ) << 1 );
    col = ( K3_40 ^ L[ET40] )
      + ( ( K3_39 ^ L[ET39] ) << 1 )
      + ( ( K3_38 ^ L[ET38] ) << 2 )
      + ( ( K3_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K3_47 ^ L[ET47] )
      + ( ( K3_42 ^ L[ET42] ) << 1 );
    col = ( K3_46 ^ L[ET46] )
      + ( ( K3_45 ^ L[ET45] ) << 1 )
      + ( ( K3_44 ^ L[ET44] ) << 2 )
      + ( ( K3_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 4
    row = ( K4_5 ^ R[ET5] )
      + ( ( K4_0 ^ R[ET0] ) << 1 );
    col = ( K4_4 ^ R[ET4] )
      + ( ( K4_3 ^ R[ET3] ) << 1 )
      + ( ( K4_2 ^ R[ET2] ) << 2 )
      + ( ( K4_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K4_11 ^ R[ET11] )
      + ( ( K4_6  ^ R[ET6 ] ) << 1 );
    col = ( K4_10 ^ R[ET10] )
      + ( ( K4_9  ^ R[ET9 ] ) << 1 )
      + ( ( K4_8  ^ R[ET8 ] ) << 2 )
      + ( ( K4_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K4_17 ^ R[ET17] )
      + ( ( K4_12 ^ R[ET12] ) << 1 );
    col = ( K4_16 ^ R[ET16] )
      + ( ( K4_15 ^ R[ET15] ) << 1 )
      + ( ( K4_14 ^ R[ET14] ) << 2 )
      + ( ( K4_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K4_23 ^ R[ET23] )
      + ( ( K4_18 ^ R[ET18] ) << 1 );
    col = ( K4_22 ^ R[ET22] )
      + ( ( K4_21 ^ R[ET21] ) << 1 )
      + ( ( K4_20 ^ R[ET20] ) << 2 )
      + ( ( K4_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K4_29 ^ R[ET29] )
      + ( ( K4_24 ^ R[ET24] ) << 1 );
    col = ( K4_28 ^ R[ET28] )
      + ( ( K4_27 ^ R[ET27] ) << 1 )
      + ( ( K4_26 ^ R[ET26] ) << 2 )
      + ( ( K4_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K4_35 ^ R[ET35] )
      + ( ( K4_30 ^ R[ET30] ) << 1 );
    col = ( K4_34 ^ R[ET34] )
      + ( ( K4_33 ^ R[ET33] ) << 1 )
      + ( ( K4_32 ^ R[ET32] ) << 2 )
      + ( ( K4_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K4_41 ^ R[ET41] )
      + ( ( K4_36 ^ R[ET36] ) << 1 );
    col = ( K4_40 ^ R[ET40] )
      + ( ( K4_39 ^ R[ET39] ) << 1 )
      + ( ( K4_38 ^ R[ET38] ) << 2 )
      + ( ( K4_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K4_47 ^ R[ET47] )
      + ( ( K4_42 ^ R[ET42] ) << 1 );
    col = ( K4_46 ^ R[ET46] )
      + ( ( K4_45 ^ R[ET45] ) << 1 )
      + ( ( K4_44 ^ R[ET44] ) << 2 )
      + ( ( K4_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 5
    row = ( K5_5 ^ L[ET5] )
      + ( ( K5_0 ^ L[ET0] ) << 1 );
    col = ( K5_4 ^ L[ET4] )
      + ( ( K5_3 ^ L[ET3] ) << 1 )
      + ( ( K5_2 ^ L[ET2] ) << 2 )
      + ( ( K5_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K5_11 ^ L[ET11] )
      + ( ( K5_6  ^ L[ET6 ] ) << 1 );
    col = ( K5_10 ^ L[ET10] )
      + ( ( K5_9  ^ L[ET9 ] ) << 1 )
      + ( ( K5_8  ^ L[ET8 ] ) << 2 )
      + ( ( K5_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K5_17 ^ L[ET17] )
      + ( ( K5_12 ^ L[ET12] ) << 1 );
    col = ( K5_16 ^ L[ET16] )
      + ( ( K5_15 ^ L[ET15] ) << 1 )
      + ( ( K5_14 ^ L[ET14] ) << 2 )
      + ( ( K5_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K5_23 ^ L[ET23] )
      + ( ( K5_18 ^ L[ET18] ) << 1 );
    col = ( K5_22 ^ L[ET22] )
      + ( ( K5_21 ^ L[ET21] ) << 1 )
      + ( ( K5_20 ^ L[ET20] ) << 2 )
      + ( ( K5_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K5_29 ^ L[ET29] )
      + ( ( K5_24 ^ L[ET24] ) << 1 );
    col = ( K5_28 ^ L[ET28] )
      + ( ( K5_27 ^ L[ET27] ) << 1 )
      + ( ( K5_26 ^ L[ET26] ) << 2 )
      + ( ( K5_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K5_35 ^ L[ET35] )
      + ( ( K5_30 ^ L[ET30] ) << 1 );
    col = ( K5_34 ^ L[ET34] )
      + ( ( K5_33 ^ L[ET33] ) << 1 )
      + ( ( K5_32 ^ L[ET32] ) << 2 )
      + ( ( K5_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K5_41 ^ L[ET41] )
      + ( ( K5_36 ^ L[ET36] ) << 1 );
    col = ( K5_40 ^ L[ET40] )
      + ( ( K5_39 ^ L[ET39] ) << 1 )
      + ( ( K5_38 ^ L[ET38] ) << 2 )
      + ( ( K5_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K5_47 ^ L[ET47] )
      + ( ( K5_42 ^ L[ET42] ) << 1 );
    col = ( K5_46 ^ L[ET46] )
      + ( ( K5_45 ^ L[ET45] ) << 1 )
      + ( ( K5_44 ^ L[ET44] ) << 2 )
      + ( ( K5_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 6
    row = ( K6_5 ^ R[ET5] )
      + ( ( K6_0 ^ R[ET0] ) << 1 );
    col = ( K6_4 ^ R[ET4] )
      + ( ( K6_3 ^ R[ET3] ) << 1 )
      + ( ( K6_2 ^ R[ET2] ) << 2 )
      + ( ( K6_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K6_11 ^ R[ET11] )
      + ( ( K6_6  ^ R[ET6 ] ) << 1 );
    col = ( K6_10 ^ R[ET10] )
      + ( ( K6_9  ^ R[ET9 ] ) << 1 )
      + ( ( K6_8  ^ R[ET8 ] ) << 2 )
      + ( ( K6_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K6_17 ^ R[ET17] )
      + ( ( K6_12 ^ R[ET12] ) << 1 );
    col = ( K6_16 ^ R[ET16] )
      + ( ( K6_15 ^ R[ET15] ) << 1 )
      + ( ( K6_14 ^ R[ET14] ) << 2 )
      + ( ( K6_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K6_23 ^ R[ET23] )
      + ( ( K6_18 ^ R[ET18] ) << 1 );
    col = ( K6_22 ^ R[ET22] )
      + ( ( K6_21 ^ R[ET21] ) << 1 )
      + ( ( K6_20 ^ R[ET20] ) << 2 )
      + ( ( K6_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K6_29 ^ R[ET29] )
      + ( ( K6_24 ^ R[ET24] ) << 1 );
    col = ( K6_28 ^ R[ET28] )
      + ( ( K6_27 ^ R[ET27] ) << 1 )
      + ( ( K6_26 ^ R[ET26] ) << 2 )
      + ( ( K6_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K6_35 ^ R[ET35] )
      + ( ( K6_30 ^ R[ET30] ) << 1 );
    col = ( K6_34 ^ R[ET34] )
      + ( ( K6_33 ^ R[ET33] ) << 1 )
      + ( ( K6_32 ^ R[ET32] ) << 2 )
      + ( ( K6_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K6_41 ^ R[ET41] )
      + ( ( K6_36 ^ R[ET36] ) << 1 );
    col = ( K6_40 ^ R[ET40] )
      + ( ( K6_39 ^ R[ET39] ) << 1 )
      + ( ( K6_38 ^ R[ET38] ) << 2 )
      + ( ( K6_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K6_47 ^ R[ET47] )
      + ( ( K6_42 ^ R[ET42] ) << 1 );
    col = ( K6_46 ^ R[ET46] )
      + ( ( K6_45 ^ R[ET45] ) << 1 )
      + ( ( K6_44 ^ R[ET44] ) << 2 )
      + ( ( K6_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 7
    row = ( K7_5 ^ L[ET5] )
      + ( ( K7_0 ^ L[ET0] ) << 1 );
    col = ( K7_4 ^ L[ET4] )
      + ( ( K7_3 ^ L[ET3] ) << 1 )
      + ( ( K7_2 ^ L[ET2] ) << 2 )
      + ( ( K7_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K7_11 ^ L[ET11] )
      + ( ( K7_6  ^ L[ET6 ] ) << 1 );
    col = ( K7_10 ^ L[ET10] )
      + ( ( K7_9  ^ L[ET9 ] ) << 1 )
      + ( ( K7_8  ^ L[ET8 ] ) << 2 )
      + ( ( K7_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K7_17 ^ L[ET17] )
      + ( ( K7_12 ^ L[ET12] ) << 1 );
    col = ( K7_16 ^ L[ET16] )
      + ( ( K7_15 ^ L[ET15] ) << 1 )
      + ( ( K7_14 ^ L[ET14] ) << 2 )
      + ( ( K7_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K7_23 ^ L[ET23] )
      + ( ( K7_18 ^ L[ET18] ) << 1 );
    col = ( K7_22 ^ L[ET22] )
      + ( ( K7_21 ^ L[ET21] ) << 1 )
      + ( ( K7_20 ^ L[ET20] ) << 2 )
      + ( ( K7_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K7_29 ^ L[ET29] )
      + ( ( K7_24 ^ L[ET24] ) << 1 );
    col = ( K7_28 ^ L[ET28] )
      + ( ( K7_27 ^ L[ET27] ) << 1 )
      + ( ( K7_26 ^ L[ET26] ) << 2 )
      + ( ( K7_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K7_35 ^ L[ET35] )
      + ( ( K7_30 ^ L[ET30] ) << 1 );
    col = ( K7_34 ^ L[ET34] )
      + ( ( K7_33 ^ L[ET33] ) << 1 )
      + ( ( K7_32 ^ L[ET32] ) << 2 )
      + ( ( K7_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K7_41 ^ L[ET41] )
      + ( ( K7_36 ^ L[ET36] ) << 1 );
    col = ( K7_40 ^ L[ET40] )
      + ( ( K7_39 ^ L[ET39] ) << 1 )
      + ( ( K7_38 ^ L[ET38] ) << 2 )
      + ( ( K7_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K7_47 ^ L[ET47] )
      + ( ( K7_42 ^ L[ET42] ) << 1 );
    col = ( K7_46 ^ L[ET46] )
      + ( ( K7_45 ^ L[ET45] ) << 1 )
      + ( ( K7_44 ^ L[ET44] ) << 2 )
      + ( ( K7_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 8
    row = ( K8_5 ^ R[ET5] )
      + ( ( K8_0 ^ R[ET0] ) << 1 );
    col = ( K8_4 ^ R[ET4] )
      + ( ( K8_3 ^ R[ET3] ) << 1 )
      + ( ( K8_2 ^ R[ET2] ) << 2 )
      + ( ( K8_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K8_11 ^ R[ET11] )
      + ( ( K8_6  ^ R[ET6 ] ) << 1 );
    col = ( K8_10 ^ R[ET10] )
      + ( ( K8_9  ^ R[ET9 ] ) << 1 )
      + ( ( K8_8  ^ R[ET8 ] ) << 2 )
      + ( ( K8_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K8_17 ^ R[ET17] )
      + ( ( K8_12 ^ R[ET12] ) << 1 );
    col = ( K8_16 ^ R[ET16] )
      + ( ( K8_15 ^ R[ET15] ) << 1 )
      + ( ( K8_14 ^ R[ET14] ) << 2 )
      + ( ( K8_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K8_23 ^ R[ET23] )
      + ( ( K8_18 ^ R[ET18] ) << 1 );
    col = ( K8_22 ^ R[ET22] )
      + ( ( K8_21 ^ R[ET21] ) << 1 )
      + ( ( K8_20 ^ R[ET20] ) << 2 )
      + ( ( K8_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K8_29 ^ R[ET29] )
      + ( ( K8_24 ^ R[ET24] ) << 1 );
    col = ( K8_28 ^ R[ET28] )
      + ( ( K8_27 ^ R[ET27] ) << 1 )
      + ( ( K8_26 ^ R[ET26] ) << 2 )
      + ( ( K8_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K8_35 ^ R[ET35] )
      + ( ( K8_30 ^ R[ET30] ) << 1 );
    col = ( K8_34 ^ R[ET34] )
      + ( ( K8_33 ^ R[ET33] ) << 1 )
      + ( ( K8_32 ^ R[ET32] ) << 2 )
      + ( ( K8_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K8_41 ^ R[ET41] )
      + ( ( K8_36 ^ R[ET36] ) << 1 );
    col = ( K8_40 ^ R[ET40] )
      + ( ( K8_39 ^ R[ET39] ) << 1 )
      + ( ( K8_38 ^ R[ET38] ) << 2 )
      + ( ( K8_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K8_47 ^ R[ET47] )
      + ( ( K8_42 ^ R[ET42] ) << 1 );
    col = ( K8_46 ^ R[ET46] )
      + ( ( K8_45 ^ R[ET45] ) << 1 )
      + ( ( K8_44 ^ R[ET44] ) << 2 )
      + ( ( K8_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 9
    row = ( K9_5 ^ L[ET5] )
      + ( ( K9_0 ^ L[ET0] ) << 1 );
    col = ( K9_4 ^ L[ET4] )
      + ( ( K9_3 ^ L[ET3] ) << 1 )
      + ( ( K9_2 ^ L[ET2] ) << 2 )
      + ( ( K9_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K9_11 ^ L[ET11] )
      + ( ( K9_6  ^ L[ET6 ] ) << 1 );
    col = ( K9_10 ^ L[ET10] )
      + ( ( K9_9  ^ L[ET9 ] ) << 1 )
      + ( ( K9_8  ^ L[ET8 ] ) << 2 )
      + ( ( K9_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K9_17 ^ L[ET17] )
      + ( ( K9_12 ^ L[ET12] ) << 1 );
    col = ( K9_16 ^ L[ET16] )
      + ( ( K9_15 ^ L[ET15] ) << 1 )
      + ( ( K9_14 ^ L[ET14] ) << 2 )
      + ( ( K9_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K9_23 ^ L[ET23] )
      + ( ( K9_18 ^ L[ET18] ) << 1 );
    col = ( K9_22 ^ L[ET22] )
      + ( ( K9_21 ^ L[ET21] ) << 1 )
      + ( ( K9_20 ^ L[ET20] ) << 2 )
      + ( ( K9_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K9_29 ^ L[ET29] )
      + ( ( K9_24 ^ L[ET24] ) << 1 );
    col = ( K9_28 ^ L[ET28] )
      + ( ( K9_27 ^ L[ET27] ) << 1 )
      + ( ( K9_26 ^ L[ET26] ) << 2 )
      + ( ( K9_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K9_35 ^ L[ET35] )
      + ( ( K9_30 ^ L[ET30] ) << 1 );
    col = ( K9_34 ^ L[ET34] )
      + ( ( K9_33 ^ L[ET33] ) << 1 )
      + ( ( K9_32 ^ L[ET32] ) << 2 )
      + ( ( K9_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K9_41 ^ L[ET41] )
      + ( ( K9_36 ^ L[ET36] ) << 1 );
    col = ( K9_40 ^ L[ET40] )
      + ( ( K9_39 ^ L[ET39] ) << 1 )
      + ( ( K9_38 ^ L[ET38] ) << 2 )
      + ( ( K9_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K9_47 ^ L[ET47] )
      + ( ( K9_42 ^ L[ET42] ) << 1 );
    col = ( K9_46 ^ L[ET46] )
      + ( ( K9_45 ^ L[ET45] ) << 1 )
      + ( ( K9_44 ^ L[ET44] ) << 2 )
      + ( ( K9_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 10
    row = ( K10_5 ^ R[ET5] )
      + ( ( K10_0 ^ R[ET0] ) << 1 );
    col = ( K10_4 ^ R[ET4] )
      + ( ( K10_3 ^ R[ET3] ) << 1 )
      + ( ( K10_2 ^ R[ET2] ) << 2 )
      + ( ( K10_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K10_11 ^ R[ET11] )
      + ( ( K10_6  ^ R[ET6 ] ) << 1 );
    col = ( K10_10 ^ R[ET10] )
      + ( ( K10_9  ^ R[ET9 ] ) << 1 )
      + ( ( K10_8  ^ R[ET8 ] ) << 2 )
      + ( ( K10_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K10_17 ^ R[ET17] )
      + ( ( K10_12 ^ R[ET12] ) << 1 );
    col = ( K10_16 ^ R[ET16] )
      + ( ( K10_15 ^ R[ET15] ) << 1 )
      + ( ( K10_14 ^ R[ET14] ) << 2 )
      + ( ( K10_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K10_23 ^ R[ET23] )
      + ( ( K10_18 ^ R[ET18] ) << 1 );
    col = ( K10_22 ^ R[ET22] )
      + ( ( K10_21 ^ R[ET21] ) << 1 )
      + ( ( K10_20 ^ R[ET20] ) << 2 )
      + ( ( K10_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K10_29 ^ R[ET29] )
      + ( ( K10_24 ^ R[ET24] ) << 1 );
    col = ( K10_28 ^ R[ET28] )
      + ( ( K10_27 ^ R[ET27] ) << 1 )
      + ( ( K10_26 ^ R[ET26] ) << 2 )
      + ( ( K10_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K10_35 ^ R[ET35] )
      + ( ( K10_30 ^ R[ET30] ) << 1 );
    col = ( K10_34 ^ R[ET34] )
      + ( ( K10_33 ^ R[ET33] ) << 1 )
      + ( ( K10_32 ^ R[ET32] ) << 2 )
      + ( ( K10_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K10_41 ^ R[ET41] )
      + ( ( K10_36 ^ R[ET36] ) << 1 );
    col = ( K10_40 ^ R[ET40] )
      + ( ( K10_39 ^ R[ET39] ) << 1 )
      + ( ( K10_38 ^ R[ET38] ) << 2 )
      + ( ( K10_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K10_47 ^ R[ET47] )
      + ( ( K10_42 ^ R[ET42] ) << 1 );
    col = ( K10_46 ^ R[ET46] )
      + ( ( K10_45 ^ R[ET45] ) << 1 )
      + ( ( K10_44 ^ R[ET44] ) << 2 )
      + ( ( K10_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 11
    row = ( K11_5 ^ L[ET5] )
      + ( ( K11_0 ^ L[ET0] ) << 1 );
    col = ( K11_4 ^ L[ET4] )
      + ( ( K11_3 ^ L[ET3] ) << 1 )
      + ( ( K11_2 ^ L[ET2] ) << 2 )
      + ( ( K11_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K11_11 ^ L[ET11] )
      + ( ( K11_6  ^ L[ET6 ] ) << 1 );
    col = ( K11_10 ^ L[ET10] )
      + ( ( K11_9  ^ L[ET9 ] ) << 1 )
      + ( ( K11_8  ^ L[ET8 ] ) << 2 )
      + ( ( K11_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K11_17 ^ L[ET17] )
      + ( ( K11_12 ^ L[ET12] ) << 1 );
    col = ( K11_16 ^ L[ET16] )
      + ( ( K11_15 ^ L[ET15] ) << 1 )
      + ( ( K11_14 ^ L[ET14] ) << 2 )
      + ( ( K11_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K11_23 ^ L[ET23] )
      + ( ( K11_18 ^ L[ET18] ) << 1 );
    col = ( K11_22 ^ L[ET22] )
      + ( ( K11_21 ^ L[ET21] ) << 1 )
      + ( ( K11_20 ^ L[ET20] ) << 2 )
      + ( ( K11_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K11_29 ^ L[ET29] )
      + ( ( K11_24 ^ L[ET24] ) << 1 );
    col = ( K11_28 ^ L[ET28] )
      + ( ( K11_27 ^ L[ET27] ) << 1 )
      + ( ( K11_26 ^ L[ET26] ) << 2 )
      + ( ( K11_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K11_35 ^ L[ET35] )
      + ( ( K11_30 ^ L[ET30] ) << 1 );
    col = ( K11_34 ^ L[ET34] )
      + ( ( K11_33 ^ L[ET33] ) << 1 )
      + ( ( K11_32 ^ L[ET32] ) << 2 )
      + ( ( K11_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K11_41 ^ L[ET41] )
      + ( ( K11_36 ^ L[ET36] ) << 1 );
    col = ( K11_40 ^ L[ET40] )
      + ( ( K11_39 ^ L[ET39] ) << 1 )
      + ( ( K11_38 ^ L[ET38] ) << 2 )
      + ( ( K11_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K11_47 ^ L[ET47] )
      + ( ( K11_42 ^ L[ET42] ) << 1 );
    col = ( K11_46 ^ L[ET46] )
      + ( ( K11_45 ^ L[ET45] ) << 1 )
      + ( ( K11_44 ^ L[ET44] ) << 2 )
      + ( ( K11_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 12
    row = ( K12_5 ^ R[ET5] )
      + ( ( K12_0 ^ R[ET0] ) << 1 );
    col = ( K12_4 ^ R[ET4] )
      + ( ( K12_3 ^ R[ET3] ) << 1 )
      + ( ( K12_2 ^ R[ET2] ) << 2 )
      + ( ( K12_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K12_11 ^ R[ET11] )
      + ( ( K12_6  ^ R[ET6 ] ) << 1 );
    col = ( K12_10 ^ R[ET10] )
      + ( ( K12_9  ^ R[ET9 ] ) << 1 )
      + ( ( K12_8  ^ R[ET8 ] ) << 2 )
      + ( ( K12_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K12_17 ^ R[ET17] )
      + ( ( K12_12 ^ R[ET12] ) << 1 );
    col = ( K12_16 ^ R[ET16] )
      + ( ( K12_15 ^ R[ET15] ) << 1 )
      + ( ( K12_14 ^ R[ET14] ) << 2 )
      + ( ( K12_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K12_23 ^ R[ET23] )
      + ( ( K12_18 ^ R[ET18] ) << 1 );
    col = ( K12_22 ^ R[ET22] )
      + ( ( K12_21 ^ R[ET21] ) << 1 )
      + ( ( K12_20 ^ R[ET20] ) << 2 )
      + ( ( K12_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K12_29 ^ R[ET29] )
      + ( ( K12_24 ^ R[ET24] ) << 1 );
    col = ( K12_28 ^ R[ET28] )
      + ( ( K12_27 ^ R[ET27] ) << 1 )
      + ( ( K12_26 ^ R[ET26] ) << 2 )
      + ( ( K12_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K12_35 ^ R[ET35] )
      + ( ( K12_30 ^ R[ET30] ) << 1 );
    col = ( K12_34 ^ R[ET34] )
      + ( ( K12_33 ^ R[ET33] ) << 1 )
      + ( ( K12_32 ^ R[ET32] ) << 2 )
      + ( ( K12_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K12_41 ^ R[ET41] )
      + ( ( K12_36 ^ R[ET36] ) << 1 );
    col = ( K12_40 ^ R[ET40] )
      + ( ( K12_39 ^ R[ET39] ) << 1 )
      + ( ( K12_38 ^ R[ET38] ) << 2 )
      + ( ( K12_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K12_47 ^ R[ET47] )
      + ( ( K12_42 ^ R[ET42] ) << 1 );
    col = ( K12_46 ^ R[ET46] )
      + ( ( K12_45 ^ R[ET45] ) << 1 )
      + ( ( K12_44 ^ R[ET44] ) << 2 )
      + ( ( K12_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 13
    row = ( K13_5 ^ L[ET5] )
      + ( ( K13_0 ^ L[ET0] ) << 1 );
    col = ( K13_4 ^ L[ET4] )
      + ( ( K13_3 ^ L[ET3] ) << 1 )
      + ( ( K13_2 ^ L[ET2] ) << 2 )
      + ( ( K13_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K13_11 ^ L[ET11] )
      + ( ( K13_6  ^ L[ET6 ] ) << 1 );
    col = ( K13_10 ^ L[ET10] )
      + ( ( K13_9  ^ L[ET9 ] ) << 1 )
      + ( ( K13_8  ^ L[ET8 ] ) << 2 )
      + ( ( K13_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K13_17 ^ L[ET17] )
      + ( ( K13_12 ^ L[ET12] ) << 1 );
    col = ( K13_16 ^ L[ET16] )
      + ( ( K13_15 ^ L[ET15] ) << 1 )
      + ( ( K13_14 ^ L[ET14] ) << 2 )
      + ( ( K13_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K13_23 ^ L[ET23] )
      + ( ( K13_18 ^ L[ET18] ) << 1 );
    col = ( K13_22 ^ L[ET22] )
      + ( ( K13_21 ^ L[ET21] ) << 1 )
      + ( ( K13_20 ^ L[ET20] ) << 2 )
      + ( ( K13_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K13_29 ^ L[ET29] )
      + ( ( K13_24 ^ L[ET24] ) << 1 );
    col = ( K13_28 ^ L[ET28] )
      + ( ( K13_27 ^ L[ET27] ) << 1 )
      + ( ( K13_26 ^ L[ET26] ) << 2 )
      + ( ( K13_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K13_35 ^ L[ET35] )
      + ( ( K13_30 ^ L[ET30] ) << 1 );
    col = ( K13_34 ^ L[ET34] )
      + ( ( K13_33 ^ L[ET33] ) << 1 )
      + ( ( K13_32 ^ L[ET32] ) << 2 )
      + ( ( K13_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K13_41 ^ L[ET41] )
      + ( ( K13_36 ^ L[ET36] ) << 1 );
    col = ( K13_40 ^ L[ET40] )
      + ( ( K13_39 ^ L[ET39] ) << 1 )
      + ( ( K13_38 ^ L[ET38] ) << 2 )
      + ( ( K13_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K13_47 ^ L[ET47] )
      + ( ( K13_42 ^ L[ET42] ) << 1 );
    col = ( K13_46 ^ L[ET46] )
      + ( ( K13_45 ^ L[ET45] ) << 1 )
      + ( ( K13_44 ^ L[ET44] ) << 2 )
      + ( ( K13_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );

    // 14
    row = ( K14_5 ^ R[ET5] )
      + ( ( K14_0 ^ R[ET0] ) << 1 );
    col = ( K14_4 ^ R[ET4] )
      + ( ( K14_3 ^ R[ET3] ) << 1 )
      + ( ( K14_2 ^ R[ET2] ) << 2 )
      + ( ( K14_1 ^ R[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    L[8] = L[8] ^ ( (dec >> 3) & 1 );
    L[16] = L[16] ^ ( (dec >> 2) & 1 );
    L[22] = L[22] ^ ( (dec >> 1) & 1 );
    L[30] = L[30] ^ ( dec & 1 );

    row = ( K14_11 ^ R[ET11] )
      + ( ( K14_6  ^ R[ET6 ] ) << 1 );
    col = ( K14_10 ^ R[ET10] )
      + ( ( K14_9  ^ R[ET9 ] ) << 1 )
      + ( ( K14_8  ^ R[ET8 ] ) << 2 )
      + ( ( K14_7  ^ R[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    L[12] = L[12] ^ ( (dec >> 3) & 1 );
    L[27] = L[27] ^ ( (dec >> 2) & 1 );
    L[1] = L[1] ^ ( (dec >> 1) & 1 );
    L[17] = L[17] ^ ( dec & 1 );

    row = ( K14_17 ^ R[ET17] )
      + ( ( K14_12 ^ R[ET12] ) << 1 );
    col = ( K14_16 ^ R[ET16] )
      + ( ( K14_15 ^ R[ET15] ) << 1 )
      + ( ( K14_14 ^ R[ET14] ) << 2 )
      + ( ( K14_13 ^ R[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    L[23] = L[23] ^ ( (dec >> 3) & 1 );
    L[15] = L[15] ^ ( (dec >> 2) & 1 );
    L[29] = L[29] ^ ( (dec >> 1) & 1 );
    L[5] = L[5] ^ ( dec & 1 );     

    row = ( K14_23 ^ R[ET23] )
      + ( ( K14_18 ^ R[ET18] ) << 1 );
    col = ( K14_22 ^ R[ET22] )
      + ( ( K14_21 ^ R[ET21] ) << 1 )
      + ( ( K14_20 ^ R[ET20] ) << 2 )
      + ( ( K14_19 ^ R[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    L[25] = L[25] ^ ( (dec >> 3) & 1 );
    L[19] = L[19] ^ ( (dec >> 2) & 1 );
    L[9] = L[9] ^ ( (dec >> 1) & 1 );
    L[0] = L[0] ^ ( dec & 1 );
  
    row = ( K14_29 ^ R[ET29] )
      + ( ( K14_24 ^ R[ET24] ) << 1 );
    col = ( K14_28 ^ R[ET28] )
      + ( ( K14_27 ^ R[ET27] ) << 1 )
      + ( ( K14_26 ^ R[ET26] ) << 2 )
      + ( ( K14_25 ^ R[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    L[7] = L[7] ^ ( (dec >> 3) & 1 );
    L[13] = L[13] ^ ( (dec >> 2) & 1 );
    L[24] = L[24] ^ ( (dec >> 1) & 1 );
    L[2] = L[2] ^ ( dec & 1 );

    row = ( K14_35 ^ R[ET35] )
      + ( ( K14_30 ^ R[ET30] ) << 1 );
    col = ( K14_34 ^ R[ET34] )
      + ( ( K14_33 ^ R[ET33] ) << 1 )
      + ( ( K14_32 ^ R[ET32] ) << 2 )
      + ( ( K14_31 ^ R[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    L[3] = L[3] ^ ( (dec >> 3) & 1 );
    L[28] = L[28] ^ ( (dec >> 2) & 1 );
    L[10] = L[10] ^ ( (dec >> 1) & 1 );
    L[18] = L[18] ^ ( dec & 1 );

    row = ( K14_41 ^ R[ET41] )
      + ( ( K14_36 ^ R[ET36] ) << 1 );
    col = ( K14_40 ^ R[ET40] )
      + ( ( K14_39 ^ R[ET39] ) << 1 )
      + ( ( K14_38 ^ R[ET38] ) << 2 )
      + ( ( K14_37 ^ R[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    L[31] = L[31] ^ ( (dec >> 3) & 1 );
    L[11] = L[11] ^ ( (dec >> 2) & 1 );
    L[21] = L[21] ^ ( (dec >> 1) & 1 );
    L[6] = L[6] ^ ( dec & 1 );
  
    row = ( K14_47 ^ R[ET47] )
      + ( ( K14_42 ^ R[ET42] ) << 1 );
    col = ( K14_46 ^ R[ET46] )
      + ( ( K14_45 ^ R[ET45] ) << 1 )
      + ( ( K14_44 ^ R[ET44] ) << 2 )
      + ( ( K14_43 ^ R[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    L[4] = L[4] ^ ( (dec >> 3) & 1 );
    L[26] = L[26] ^ ( (dec >> 2) & 1 );
    L[14] = L[14] ^ ( (dec >> 1) & 1 );
    L[20] = L[20] ^ ( dec & 1 );

    // 15
    row = ( K15_5 ^ L[ET5] )
      + ( ( K15_0 ^ L[ET0] ) << 1 );
    col = ( K15_4 ^ L[ET4] )
      + ( ( K15_3 ^ L[ET3] ) << 1 )
      + ( ( K15_2 ^ L[ET2] ) << 2 )
      + ( ( K15_1 ^ L[ET1] ) << 3 );
    dec = SB0[ (row<<4) + col ];
    R[8] = R[8] ^ ( (dec >> 3) & 1 );
    R[16] = R[16] ^ ( (dec >> 2) & 1 );
    R[22] = R[22] ^ ( (dec >> 1) & 1 );
    R[30] = R[30] ^ ( dec & 1 );

    row = ( K15_11 ^ L[ET11] )
      + ( ( K15_6  ^ L[ET6 ] ) << 1 );
    col = ( K15_10 ^ L[ET10] )
      + ( ( K15_9  ^ L[ET9 ] ) << 1 )
      + ( ( K15_8  ^ L[ET8 ] ) << 2 )
      + ( ( K15_7  ^ L[ET7 ] ) << 3 );
    dec = SB1[ (row<<4) + col ];
    R[12] = R[12] ^ ( (dec >> 3) & 1 );
    R[27] = R[27] ^ ( (dec >> 2) & 1 );
    R[1] = R[1] ^ ( (dec >> 1) & 1 );
    R[17] = R[17] ^ ( dec & 1 );

    row = ( K15_17 ^ L[ET17] )
      + ( ( K15_12 ^ L[ET12] ) << 1 );
    col = ( K15_16 ^ L[ET16] )
      + ( ( K15_15 ^ L[ET15] ) << 1 )
      + ( ( K15_14 ^ L[ET14] ) << 2 )
      + ( ( K15_13 ^ L[ET13] ) << 3 );
    dec = SB2[ (row<<4) + col ];
    R[23] = R[23] ^ ( (dec >> 3) & 1 );
    R[15] = R[15] ^ ( (dec >> 2) & 1 );
    R[29] = R[29] ^ ( (dec >> 1) & 1 );
    R[5] = R[5] ^ ( dec & 1 );     

    row = ( K15_23 ^ L[ET23] )
      + ( ( K15_18 ^ L[ET18] ) << 1 );
    col = ( K15_22 ^ L[ET22] )
      + ( ( K15_21 ^ L[ET21] ) << 1 )
      + ( ( K15_20 ^ L[ET20] ) << 2 )
      + ( ( K15_19 ^ L[ET19] ) << 3 );
    dec = SB3[ (row<<4) + col ];
    R[25] = R[25] ^ ( (dec >> 3) & 1 );
    R[19] = R[19] ^ ( (dec >> 2) & 1 );
    R[9] = R[9] ^ ( (dec >> 1) & 1 );
    R[0] = R[0] ^ ( dec & 1 );
  
    row = ( K15_29 ^ L[ET29] )
      + ( ( K15_24 ^ L[ET24] ) << 1 );
    col = ( K15_28 ^ L[ET28] )
      + ( ( K15_27 ^ L[ET27] ) << 1 )
      + ( ( K15_26 ^ L[ET26] ) << 2 )
      + ( ( K15_25 ^ L[ET25] ) << 3 );
    dec = SB4[ (row<<4) + col ];
    R[7] = R[7] ^ ( (dec >> 3) & 1 );
    R[13] = R[13] ^ ( (dec >> 2) & 1 );
    R[24] = R[24] ^ ( (dec >> 1) & 1 );
    R[2] = R[2] ^ ( dec & 1 );

    row = ( K15_35 ^ L[ET35] )
      + ( ( K15_30 ^ L[ET30] ) << 1 );
    col = ( K15_34 ^ L[ET34] )
      + ( ( K15_33 ^ L[ET33] ) << 1 )
      + ( ( K15_32 ^ L[ET32] ) << 2 )
      + ( ( K15_31 ^ L[ET31] ) << 3 );
    dec = SB5[ (row<<4) + col ];
    R[3] = R[3] ^ ( (dec >> 3) & 1 );
    R[28] = R[28] ^ ( (dec >> 2) & 1 );
    R[10] = R[10] ^ ( (dec >> 1) & 1 );
    R[18] = R[18] ^ ( dec & 1 );

    row = ( K15_41 ^ L[ET41] )
      + ( ( K15_36 ^ L[ET36] ) << 1 );
    col = ( K15_40 ^ L[ET40] )
      + ( ( K15_39 ^ L[ET39] ) << 1 )
      + ( ( K15_38 ^ L[ET38] ) << 2 )
      + ( ( K15_37 ^ L[ET37] ) << 3 );
    dec = SB6[ (row<<4) + col ];
    R[31] = R[31] ^ ( (dec >> 3) & 1 );
    R[11] = R[11] ^ ( (dec >> 2) & 1 );
    R[21] = R[21] ^ ( (dec >> 1) & 1 );
    R[6] = R[6] ^ ( dec & 1 );
  
    row = ( K15_47 ^ L[ET47] )
      + ( ( K15_42 ^ L[ET42] ) << 1 );
    col = ( K15_46 ^ L[ET46] )
      + ( ( K15_45 ^ L[ET45] ) << 1 )
      + ( ( K15_44 ^ L[ET44] ) << 2 )
      + ( ( K15_43 ^ L[ET43] ) << 3 );
    dec = SB7[ (row<<4) + col ];
    R[4] = R[4] ^ ( (dec >> 3) & 1 );
    R[26] = R[26] ^ ( (dec >> 2) & 1 );
    R[14] = R[14] ^ ( (dec >> 1) & 1 );
    R[20] = R[20] ^ ( dec & 1 );


    /*********************************************************************
     *
     * SECOND PART
     * Rounds 1 - 3 - 5 - 7 - 9 - 11 - 13 - 15 - 17 - 19 - 21 - 23 - 25*
     * 
     ********************************************************************/
    if( round_n != 12 ) {
      // 0
      row = ( K0_5 ^ L[ET5] )
        + ( ( K0_0 ^ L[ET0] ) << 1 );
      col = ( K0_4 ^ L[ET4] )
        + ( ( K0_3 ^ L[ET3] ) << 1 )
        + ( ( K0_2 ^ L[ET2] ) << 2 )
        + ( ( K0_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K0_11 ^ L[ET11] )
        + ( ( K0_6  ^ L[ET6 ] ) << 1 );
      col = ( K0_10 ^ L[ET10] )
        + ( ( K0_9  ^ L[ET9 ] ) << 1 )
        + ( ( K0_8  ^ L[ET8 ] ) << 2 )
        + ( ( K0_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K0_17 ^ L[ET17] )
        + ( ( K0_12 ^ L[ET12] ) << 1 );
      col = ( K0_16 ^ L[ET16] )
        + ( ( K0_15 ^ L[ET15] ) << 1 )
        + ( ( K0_14 ^ L[ET14] ) << 2 )
        + ( ( K0_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K0_23 ^ L[ET23] )
        + ( ( K0_18 ^ L[ET18] ) << 1 );
      col = ( K0_22 ^ L[ET22] )
        + ( ( K0_21 ^ L[ET21] ) << 1 )
        + ( ( K0_20 ^ L[ET20] ) << 2 )
        + ( ( K0_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K0_29 ^ L[ET29] )
        + ( ( K0_24 ^ L[ET24] ) << 1 );
      col = ( K0_28 ^ L[ET28] )
        + ( ( K0_27 ^ L[ET27] ) << 1 )
        + ( ( K0_26 ^ L[ET26] ) << 2 )
        + ( ( K0_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K0_35 ^ L[ET35] )
        + ( ( K0_30 ^ L[ET30] ) << 1 );
      col = ( K0_34 ^ L[ET34] )
        + ( ( K0_33 ^ L[ET33] ) << 1 )
        + ( ( K0_32 ^ L[ET32] ) << 2 )
        + ( ( K0_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K0_41 ^ L[ET41] )
        + ( ( K0_36 ^ L[ET36] ) << 1 );
      col = ( K0_40 ^ L[ET40] )
        + ( ( K0_39 ^ L[ET39] ) << 1 )
        + ( ( K0_38 ^ L[ET38] ) << 2 )
        + ( ( K0_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K0_47 ^ L[ET47] )
        + ( ( K0_42 ^ L[ET42] ) << 1 );
      col = ( K0_46 ^ L[ET46] )
        + ( ( K0_45 ^ L[ET45] ) << 1 )
        + ( ( K0_44 ^ L[ET44] ) << 2 )
        + ( ( K0_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 1
      row = ( K1_5 ^ R[ET5] )
        + ( ( K1_0 ^ R[ET0] ) << 1 );
      col = ( K1_4 ^ R[ET4] )
        + ( ( K1_3 ^ R[ET3] ) << 1 )
        + ( ( K1_2 ^ R[ET2] ) << 2 )
        + ( ( K1_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K1_11 ^ R[ET11] )
        + ( ( K1_6  ^ R[ET6 ] ) << 1 );
      col = ( K1_10 ^ R[ET10] )
        + ( ( K1_9  ^ R[ET9 ] ) << 1 )
        + ( ( K1_8  ^ R[ET8 ] ) << 2 )
        + ( ( K1_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K1_17 ^ R[ET17] )
        + ( ( K1_12 ^ R[ET12] ) << 1 );
      col = ( K1_16 ^ R[ET16] )
        + ( ( K1_15 ^ R[ET15] ) << 1 )
        + ( ( K1_14 ^ R[ET14] ) << 2 )
        + ( ( K1_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K1_23 ^ R[ET23] )
        + ( ( K1_18 ^ R[ET18] ) << 1 );
      col = ( K1_22 ^ R[ET22] )
        + ( ( K1_21 ^ R[ET21] ) << 1 )
        + ( ( K1_20 ^ R[ET20] ) << 2 )
        + ( ( K1_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K1_29 ^ R[ET29] )
        + ( ( K1_24 ^ R[ET24] ) << 1 );
      col = ( K1_28 ^ R[ET28] )
        + ( ( K1_27 ^ R[ET27] ) << 1 )
        + ( ( K1_26 ^ R[ET26] ) << 2 )
        + ( ( K1_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K1_35 ^ R[ET35] )
        + ( ( K1_30 ^ R[ET30] ) << 1 );
      col = ( K1_34 ^ R[ET34] )
        + ( ( K1_33 ^ R[ET33] ) << 1 )
        + ( ( K1_32 ^ R[ET32] ) << 2 )
        + ( ( K1_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K1_41 ^ R[ET41] )
        + ( ( K1_36 ^ R[ET36] ) << 1 );
      col = ( K1_40 ^ R[ET40] )
        + ( ( K1_39 ^ R[ET39] ) << 1 )
        + ( ( K1_38 ^ R[ET38] ) << 2 )
        + ( ( K1_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K1_47 ^ R[ET47] )
        + ( ( K1_42 ^ R[ET42] ) << 1 );
      col = ( K1_46 ^ R[ET46] )
        + ( ( K1_45 ^ R[ET45] ) << 1 )
        + ( ( K1_44 ^ R[ET44] ) << 2 )
        + ( ( K1_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 2
      row = ( K2_5 ^ L[ET5] )
        + ( ( K2_0 ^ L[ET0] ) << 1 );
      col = ( K2_4 ^ L[ET4] )
        + ( ( K2_3 ^ L[ET3] ) << 1 )
        + ( ( K2_2 ^ L[ET2] ) << 2 )
        + ( ( K2_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K2_11 ^ L[ET11] )
        + ( ( K2_6  ^ L[ET6 ] ) << 1 );
      col = ( K2_10 ^ L[ET10] )
        + ( ( K2_9  ^ L[ET9 ] ) << 1 )
        + ( ( K2_8  ^ L[ET8 ] ) << 2 )
        + ( ( K2_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K2_17 ^ L[ET17] )
        + ( ( K2_12 ^ L[ET12] ) << 1 );
      col = ( K2_16 ^ L[ET16] )
        + ( ( K2_15 ^ L[ET15] ) << 1 )
        + ( ( K2_14 ^ L[ET14] ) << 2 )
        + ( ( K2_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K2_23 ^ L[ET23] )
        + ( ( K2_18 ^ L[ET18] ) << 1 );
      col = ( K2_22 ^ L[ET22] )
        + ( ( K2_21 ^ L[ET21] ) << 1 )
        + ( ( K2_20 ^ L[ET20] ) << 2 )
        + ( ( K2_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K2_29 ^ L[ET29] )
        + ( ( K2_24 ^ L[ET24] ) << 1 );
      col = ( K2_28 ^ L[ET28] )
        + ( ( K2_27 ^ L[ET27] ) << 1 )
        + ( ( K2_26 ^ L[ET26] ) << 2 )
        + ( ( K2_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K2_35 ^ L[ET35] )
        + ( ( K2_30 ^ L[ET30] ) << 1 );
      col = ( K2_34 ^ L[ET34] )
        + ( ( K2_33 ^ L[ET33] ) << 1 )
        + ( ( K2_32 ^ L[ET32] ) << 2 )
        + ( ( K2_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K2_41 ^ L[ET41] )
        + ( ( K2_36 ^ L[ET36] ) << 1 );
      col = ( K2_40 ^ L[ET40] )
        + ( ( K2_39 ^ L[ET39] ) << 1 )
        + ( ( K2_38 ^ L[ET38] ) << 2 )
        + ( ( K2_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K2_47 ^ L[ET47] )
        + ( ( K2_42 ^ L[ET42] ) << 1 );
      col = ( K2_46 ^ L[ET46] )
        + ( ( K2_45 ^ L[ET45] ) << 1 )
        + ( ( K2_44 ^ L[ET44] ) << 2 )
        + ( ( K2_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 3
      row = ( K3_5 ^ R[ET5] )
        + ( ( K3_0 ^ R[ET0] ) << 1 );
      col = ( K3_4 ^ R[ET4] )
        + ( ( K3_3 ^ R[ET3] ) << 1 )
        + ( ( K3_2 ^ R[ET2] ) << 2 )
        + ( ( K3_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K3_11 ^ R[ET11] )
        + ( ( K3_6  ^ R[ET6 ] ) << 1 );
      col = ( K3_10 ^ R[ET10] )
        + ( ( K3_9  ^ R[ET9 ] ) << 1 )
        + ( ( K3_8  ^ R[ET8 ] ) << 2 )
        + ( ( K3_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K3_17 ^ R[ET17] )
        + ( ( K3_12 ^ R[ET12] ) << 1 );
      col = ( K3_16 ^ R[ET16] )
        + ( ( K3_15 ^ R[ET15] ) << 1 )
        + ( ( K3_14 ^ R[ET14] ) << 2 )
        + ( ( K3_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K3_23 ^ R[ET23] )
        + ( ( K3_18 ^ R[ET18] ) << 1 );
      col = ( K3_22 ^ R[ET22] )
        + ( ( K3_21 ^ R[ET21] ) << 1 )
        + ( ( K3_20 ^ R[ET20] ) << 2 )
        + ( ( K3_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K3_29 ^ R[ET29] )
        + ( ( K3_24 ^ R[ET24] ) << 1 );
      col = ( K3_28 ^ R[ET28] )
        + ( ( K3_27 ^ R[ET27] ) << 1 )
        + ( ( K3_26 ^ R[ET26] ) << 2 )
        + ( ( K3_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K3_35 ^ R[ET35] )
        + ( ( K3_30 ^ R[ET30] ) << 1 );
      col = ( K3_34 ^ R[ET34] )
        + ( ( K3_33 ^ R[ET33] ) << 1 )
        + ( ( K3_32 ^ R[ET32] ) << 2 )
        + ( ( K3_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K3_41 ^ R[ET41] )
        + ( ( K3_36 ^ R[ET36] ) << 1 );
      col = ( K3_40 ^ R[ET40] )
        + ( ( K3_39 ^ R[ET39] ) << 1 )
        + ( ( K3_38 ^ R[ET38] ) << 2 )
        + ( ( K3_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K3_47 ^ R[ET47] )
        + ( ( K3_42 ^ R[ET42] ) << 1 );
      col = ( K3_46 ^ R[ET46] )
        + ( ( K3_45 ^ R[ET45] ) << 1 )
        + ( ( K3_44 ^ R[ET44] ) << 2 )
        + ( ( K3_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 4
      row = ( K4_5 ^ L[ET5] )
        + ( ( K4_0 ^ L[ET0] ) << 1 );
      col = ( K4_4 ^ L[ET4] )
        + ( ( K4_3 ^ L[ET3] ) << 1 )
        + ( ( K4_2 ^ L[ET2] ) << 2 )
        + ( ( K4_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K4_11 ^ L[ET11] )
        + ( ( K4_6  ^ L[ET6 ] ) << 1 );
      col = ( K4_10 ^ L[ET10] )
        + ( ( K4_9  ^ L[ET9 ] ) << 1 )
        + ( ( K4_8  ^ L[ET8 ] ) << 2 )
        + ( ( K4_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K4_17 ^ L[ET17] )
        + ( ( K4_12 ^ L[ET12] ) << 1 );
      col = ( K4_16 ^ L[ET16] )
        + ( ( K4_15 ^ L[ET15] ) << 1 )
        + ( ( K4_14 ^ L[ET14] ) << 2 )
        + ( ( K4_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K4_23 ^ L[ET23] )
        + ( ( K4_18 ^ L[ET18] ) << 1 );
      col = ( K4_22 ^ L[ET22] )
        + ( ( K4_21 ^ L[ET21] ) << 1 )
        + ( ( K4_20 ^ L[ET20] ) << 2 )
        + ( ( K4_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K4_29 ^ L[ET29] )
        + ( ( K4_24 ^ L[ET24] ) << 1 );
      col = ( K4_28 ^ L[ET28] )
        + ( ( K4_27 ^ L[ET27] ) << 1 )
        + ( ( K4_26 ^ L[ET26] ) << 2 )
        + ( ( K4_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K4_35 ^ L[ET35] )
        + ( ( K4_30 ^ L[ET30] ) << 1 );
      col = ( K4_34 ^ L[ET34] )
        + ( ( K4_33 ^ L[ET33] ) << 1 )
        + ( ( K4_32 ^ L[ET32] ) << 2 )
        + ( ( K4_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K4_41 ^ L[ET41] )
        + ( ( K4_36 ^ L[ET36] ) << 1 );
      col = ( K4_40 ^ L[ET40] )
        + ( ( K4_39 ^ L[ET39] ) << 1 )
        + ( ( K4_38 ^ L[ET38] ) << 2 )
        + ( ( K4_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K4_47 ^ L[ET47] )
        + ( ( K4_42 ^ L[ET42] ) << 1 );
      col = ( K4_46 ^ L[ET46] )
        + ( ( K4_45 ^ L[ET45] ) << 1 )
        + ( ( K4_44 ^ L[ET44] ) << 2 )
        + ( ( K4_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 5
      row = ( K5_5 ^ R[ET5] )
        + ( ( K5_0 ^ R[ET0] ) << 1 );
      col = ( K5_4 ^ R[ET4] )
        + ( ( K5_3 ^ R[ET3] ) << 1 )
        + ( ( K5_2 ^ R[ET2] ) << 2 )
        + ( ( K5_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K5_11 ^ R[ET11] )
        + ( ( K5_6  ^ R[ET6 ] ) << 1 );
      col = ( K5_10 ^ R[ET10] )
        + ( ( K5_9  ^ R[ET9 ] ) << 1 )
        + ( ( K5_8  ^ R[ET8 ] ) << 2 )
        + ( ( K5_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K5_17 ^ R[ET17] )
        + ( ( K5_12 ^ R[ET12] ) << 1 );
      col = ( K5_16 ^ R[ET16] )
        + ( ( K5_15 ^ R[ET15] ) << 1 )
        + ( ( K5_14 ^ R[ET14] ) << 2 )
        + ( ( K5_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K5_23 ^ R[ET23] )
        + ( ( K5_18 ^ R[ET18] ) << 1 );
      col = ( K5_22 ^ R[ET22] )
        + ( ( K5_21 ^ R[ET21] ) << 1 )
        + ( ( K5_20 ^ R[ET20] ) << 2 )
        + ( ( K5_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K5_29 ^ R[ET29] )
        + ( ( K5_24 ^ R[ET24] ) << 1 );
      col = ( K5_28 ^ R[ET28] )
        + ( ( K5_27 ^ R[ET27] ) << 1 )
        + ( ( K5_26 ^ R[ET26] ) << 2 )
        + ( ( K5_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K5_35 ^ R[ET35] )
        + ( ( K5_30 ^ R[ET30] ) << 1 );
      col = ( K5_34 ^ R[ET34] )
        + ( ( K5_33 ^ R[ET33] ) << 1 )
        + ( ( K5_32 ^ R[ET32] ) << 2 )
        + ( ( K5_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K5_41 ^ R[ET41] )
        + ( ( K5_36 ^ R[ET36] ) << 1 );
      col = ( K5_40 ^ R[ET40] )
        + ( ( K5_39 ^ R[ET39] ) << 1 )
        + ( ( K5_38 ^ R[ET38] ) << 2 )
        + ( ( K5_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K5_47 ^ R[ET47] )
        + ( ( K5_42 ^ R[ET42] ) << 1 );
      col = ( K5_46 ^ R[ET46] )
        + ( ( K5_45 ^ R[ET45] ) << 1 )
        + ( ( K5_44 ^ R[ET44] ) << 2 )
        + ( ( K5_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 6
      row = ( K6_5 ^ L[ET5] )
        + ( ( K6_0 ^ L[ET0] ) << 1 );
      col = ( K6_4 ^ L[ET4] )
        + ( ( K6_3 ^ L[ET3] ) << 1 )
        + ( ( K6_2 ^ L[ET2] ) << 2 )
        + ( ( K6_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K6_11 ^ L[ET11] )
        + ( ( K6_6  ^ L[ET6 ] ) << 1 );
      col = ( K6_10 ^ L[ET10] )
        + ( ( K6_9  ^ L[ET9 ] ) << 1 )
        + ( ( K6_8  ^ L[ET8 ] ) << 2 )
        + ( ( K6_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K6_17 ^ L[ET17] )
        + ( ( K6_12 ^ L[ET12] ) << 1 );
      col = ( K6_16 ^ L[ET16] )
        + ( ( K6_15 ^ L[ET15] ) << 1 )
        + ( ( K6_14 ^ L[ET14] ) << 2 )
        + ( ( K6_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K6_23 ^ L[ET23] )
        + ( ( K6_18 ^ L[ET18] ) << 1 );
      col = ( K6_22 ^ L[ET22] )
        + ( ( K6_21 ^ L[ET21] ) << 1 )
        + ( ( K6_20 ^ L[ET20] ) << 2 )
        + ( ( K6_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K6_29 ^ L[ET29] )
        + ( ( K6_24 ^ L[ET24] ) << 1 );
      col = ( K6_28 ^ L[ET28] )
        + ( ( K6_27 ^ L[ET27] ) << 1 )
        + ( ( K6_26 ^ L[ET26] ) << 2 )
        + ( ( K6_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K6_35 ^ L[ET35] )
        + ( ( K6_30 ^ L[ET30] ) << 1 );
      col = ( K6_34 ^ L[ET34] )
        + ( ( K6_33 ^ L[ET33] ) << 1 )
        + ( ( K6_32 ^ L[ET32] ) << 2 )
        + ( ( K6_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K6_41 ^ L[ET41] )
        + ( ( K6_36 ^ L[ET36] ) << 1 );
      col = ( K6_40 ^ L[ET40] )
        + ( ( K6_39 ^ L[ET39] ) << 1 )
        + ( ( K6_38 ^ L[ET38] ) << 2 )
        + ( ( K6_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K6_47 ^ L[ET47] )
        + ( ( K6_42 ^ L[ET42] ) << 1 );
      col = ( K6_46 ^ L[ET46] )
        + ( ( K6_45 ^ L[ET45] ) << 1 )
        + ( ( K6_44 ^ L[ET44] ) << 2 )
        + ( ( K6_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 7
      row = ( K7_5 ^ R[ET5] )
        + ( ( K7_0 ^ R[ET0] ) << 1 );
      col = ( K7_4 ^ R[ET4] )
        + ( ( K7_3 ^ R[ET3] ) << 1 )
        + ( ( K7_2 ^ R[ET2] ) << 2 )
        + ( ( K7_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K7_11 ^ R[ET11] )
        + ( ( K7_6  ^ R[ET6 ] ) << 1 );
      col = ( K7_10 ^ R[ET10] )
        + ( ( K7_9  ^ R[ET9 ] ) << 1 )
        + ( ( K7_8  ^ R[ET8 ] ) << 2 )
        + ( ( K7_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K7_17 ^ R[ET17] )
        + ( ( K7_12 ^ R[ET12] ) << 1 );
      col = ( K7_16 ^ R[ET16] )
        + ( ( K7_15 ^ R[ET15] ) << 1 )
        + ( ( K7_14 ^ R[ET14] ) << 2 )
        + ( ( K7_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K7_23 ^ R[ET23] )
        + ( ( K7_18 ^ R[ET18] ) << 1 );
      col = ( K7_22 ^ R[ET22] )
        + ( ( K7_21 ^ R[ET21] ) << 1 )
        + ( ( K7_20 ^ R[ET20] ) << 2 )
        + ( ( K7_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K7_29 ^ R[ET29] )
        + ( ( K7_24 ^ R[ET24] ) << 1 );
      col = ( K7_28 ^ R[ET28] )
        + ( ( K7_27 ^ R[ET27] ) << 1 )
        + ( ( K7_26 ^ R[ET26] ) << 2 )
        + ( ( K7_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K7_35 ^ R[ET35] )
        + ( ( K7_30 ^ R[ET30] ) << 1 );
      col = ( K7_34 ^ R[ET34] )
        + ( ( K7_33 ^ R[ET33] ) << 1 )
        + ( ( K7_32 ^ R[ET32] ) << 2 )
        + ( ( K7_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K7_41 ^ R[ET41] )
        + ( ( K7_36 ^ R[ET36] ) << 1 );
      col = ( K7_40 ^ R[ET40] )
        + ( ( K7_39 ^ R[ET39] ) << 1 )
        + ( ( K7_38 ^ R[ET38] ) << 2 )
        + ( ( K7_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K7_47 ^ R[ET47] )
        + ( ( K7_42 ^ R[ET42] ) << 1 );
      col = ( K7_46 ^ R[ET46] )
        + ( ( K7_45 ^ R[ET45] ) << 1 )
        + ( ( K7_44 ^ R[ET44] ) << 2 )
        + ( ( K7_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 8
      row = ( K8_5 ^ L[ET5] )
        + ( ( K8_0 ^ L[ET0] ) << 1 );
      col = ( K8_4 ^ L[ET4] )
        + ( ( K8_3 ^ L[ET3] ) << 1 )
        + ( ( K8_2 ^ L[ET2] ) << 2 )
        + ( ( K8_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K8_11 ^ L[ET11] )
        + ( ( K8_6  ^ L[ET6 ] ) << 1 );
      col = ( K8_10 ^ L[ET10] )
        + ( ( K8_9  ^ L[ET9 ] ) << 1 )
        + ( ( K8_8  ^ L[ET8 ] ) << 2 )
        + ( ( K8_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K8_17 ^ L[ET17] )
        + ( ( K8_12 ^ L[ET12] ) << 1 );
      col = ( K8_16 ^ L[ET16] )
        + ( ( K8_15 ^ L[ET15] ) << 1 )
        + ( ( K8_14 ^ L[ET14] ) << 2 )
        + ( ( K8_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K8_23 ^ L[ET23] )
        + ( ( K8_18 ^ L[ET18] ) << 1 );
      col = ( K8_22 ^ L[ET22] )
        + ( ( K8_21 ^ L[ET21] ) << 1 )
        + ( ( K8_20 ^ L[ET20] ) << 2 )
        + ( ( K8_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K8_29 ^ L[ET29] )
        + ( ( K8_24 ^ L[ET24] ) << 1 );
      col = ( K8_28 ^ L[ET28] )
        + ( ( K8_27 ^ L[ET27] ) << 1 )
        + ( ( K8_26 ^ L[ET26] ) << 2 )
        + ( ( K8_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K8_35 ^ L[ET35] )
        + ( ( K8_30 ^ L[ET30] ) << 1 );
      col = ( K8_34 ^ L[ET34] )
        + ( ( K8_33 ^ L[ET33] ) << 1 )
        + ( ( K8_32 ^ L[ET32] ) << 2 )
        + ( ( K8_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K8_41 ^ L[ET41] )
        + ( ( K8_36 ^ L[ET36] ) << 1 );
      col = ( K8_40 ^ L[ET40] )
        + ( ( K8_39 ^ L[ET39] ) << 1 )
        + ( ( K8_38 ^ L[ET38] ) << 2 )
        + ( ( K8_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K8_47 ^ L[ET47] )
        + ( ( K8_42 ^ L[ET42] ) << 1 );
      col = ( K8_46 ^ L[ET46] )
        + ( ( K8_45 ^ L[ET45] ) << 1 )
        + ( ( K8_44 ^ L[ET44] ) << 2 )
        + ( ( K8_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 9
      row = ( K9_5 ^ R[ET5] )
        + ( ( K9_0 ^ R[ET0] ) << 1 );
      col = ( K9_4 ^ R[ET4] )
        + ( ( K9_3 ^ R[ET3] ) << 1 )
        + ( ( K9_2 ^ R[ET2] ) << 2 )
        + ( ( K9_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K9_11 ^ R[ET11] )
        + ( ( K9_6  ^ R[ET6 ] ) << 1 );
      col = ( K9_10 ^ R[ET10] )
        + ( ( K9_9  ^ R[ET9 ] ) << 1 )
        + ( ( K9_8  ^ R[ET8 ] ) << 2 )
        + ( ( K9_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K9_17 ^ R[ET17] )
        + ( ( K9_12 ^ R[ET12] ) << 1 );
      col = ( K9_16 ^ R[ET16] )
        + ( ( K9_15 ^ R[ET15] ) << 1 )
        + ( ( K9_14 ^ R[ET14] ) << 2 )
        + ( ( K9_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K9_23 ^ R[ET23] )
        + ( ( K9_18 ^ R[ET18] ) << 1 );
      col = ( K9_22 ^ R[ET22] )
        + ( ( K9_21 ^ R[ET21] ) << 1 )
        + ( ( K9_20 ^ R[ET20] ) << 2 )
        + ( ( K9_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K9_29 ^ R[ET29] )
        + ( ( K9_24 ^ R[ET24] ) << 1 );
      col = ( K9_28 ^ R[ET28] )
        + ( ( K9_27 ^ R[ET27] ) << 1 )
        + ( ( K9_26 ^ R[ET26] ) << 2 )
        + ( ( K9_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K9_35 ^ R[ET35] )
        + ( ( K9_30 ^ R[ET30] ) << 1 );
      col = ( K9_34 ^ R[ET34] )
        + ( ( K9_33 ^ R[ET33] ) << 1 )
        + ( ( K9_32 ^ R[ET32] ) << 2 )
        + ( ( K9_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K9_41 ^ R[ET41] )
        + ( ( K9_36 ^ R[ET36] ) << 1 );
      col = ( K9_40 ^ R[ET40] )
        + ( ( K9_39 ^ R[ET39] ) << 1 )
        + ( ( K9_38 ^ R[ET38] ) << 2 )
        + ( ( K9_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K9_47 ^ R[ET47] )
        + ( ( K9_42 ^ R[ET42] ) << 1 );
      col = ( K9_46 ^ R[ET46] )
        + ( ( K9_45 ^ R[ET45] ) << 1 )
        + ( ( K9_44 ^ R[ET44] ) << 2 )
        + ( ( K9_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 10
      row = ( K10_5 ^ L[ET5] )
        + ( ( K10_0 ^ L[ET0] ) << 1 );
      col = ( K10_4 ^ L[ET4] )
        + ( ( K10_3 ^ L[ET3] ) << 1 )
        + ( ( K10_2 ^ L[ET2] ) << 2 )
        + ( ( K10_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K10_11 ^ L[ET11] )
        + ( ( K10_6  ^ L[ET6 ] ) << 1 );
      col = ( K10_10 ^ L[ET10] )
        + ( ( K10_9  ^ L[ET9 ] ) << 1 )
        + ( ( K10_8  ^ L[ET8 ] ) << 2 )
        + ( ( K10_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K10_17 ^ L[ET17] )
        + ( ( K10_12 ^ L[ET12] ) << 1 );
      col = ( K10_16 ^ L[ET16] )
        + ( ( K10_15 ^ L[ET15] ) << 1 )
        + ( ( K10_14 ^ L[ET14] ) << 2 )
        + ( ( K10_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K10_23 ^ L[ET23] )
        + ( ( K10_18 ^ L[ET18] ) << 1 );
      col = ( K10_22 ^ L[ET22] )
        + ( ( K10_21 ^ L[ET21] ) << 1 )
        + ( ( K10_20 ^ L[ET20] ) << 2 )
        + ( ( K10_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K10_29 ^ L[ET29] )
        + ( ( K10_24 ^ L[ET24] ) << 1 );
      col = ( K10_28 ^ L[ET28] )
        + ( ( K10_27 ^ L[ET27] ) << 1 )
        + ( ( K10_26 ^ L[ET26] ) << 2 )
        + ( ( K10_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K10_35 ^ L[ET35] )
        + ( ( K10_30 ^ L[ET30] ) << 1 );
      col = ( K10_34 ^ L[ET34] )
        + ( ( K10_33 ^ L[ET33] ) << 1 )
        + ( ( K10_32 ^ L[ET32] ) << 2 )
        + ( ( K10_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K10_41 ^ L[ET41] )
        + ( ( K10_36 ^ L[ET36] ) << 1 );
      col = ( K10_40 ^ L[ET40] )
        + ( ( K10_39 ^ L[ET39] ) << 1 )
        + ( ( K10_38 ^ L[ET38] ) << 2 )
        + ( ( K10_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K10_47 ^ L[ET47] )
        + ( ( K10_42 ^ L[ET42] ) << 1 );
      col = ( K10_46 ^ L[ET46] )
        + ( ( K10_45 ^ L[ET45] ) << 1 )
        + ( ( K10_44 ^ L[ET44] ) << 2 )
        + ( ( K10_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 11
      row = ( K11_5 ^ R[ET5] )
        + ( ( K11_0 ^ R[ET0] ) << 1 );
      col = ( K11_4 ^ R[ET4] )
        + ( ( K11_3 ^ R[ET3] ) << 1 )
        + ( ( K11_2 ^ R[ET2] ) << 2 )
        + ( ( K11_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K11_11 ^ R[ET11] )
        + ( ( K11_6  ^ R[ET6 ] ) << 1 );
      col = ( K11_10 ^ R[ET10] )
        + ( ( K11_9  ^ R[ET9 ] ) << 1 )
        + ( ( K11_8  ^ R[ET8 ] ) << 2 )
        + ( ( K11_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K11_17 ^ R[ET17] )
        + ( ( K11_12 ^ R[ET12] ) << 1 );
      col = ( K11_16 ^ R[ET16] )
        + ( ( K11_15 ^ R[ET15] ) << 1 )
        + ( ( K11_14 ^ R[ET14] ) << 2 )
        + ( ( K11_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K11_23 ^ R[ET23] )
        + ( ( K11_18 ^ R[ET18] ) << 1 );
      col = ( K11_22 ^ R[ET22] )
        + ( ( K11_21 ^ R[ET21] ) << 1 )
        + ( ( K11_20 ^ R[ET20] ) << 2 )
        + ( ( K11_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K11_29 ^ R[ET29] )
        + ( ( K11_24 ^ R[ET24] ) << 1 );
      col = ( K11_28 ^ R[ET28] )
        + ( ( K11_27 ^ R[ET27] ) << 1 )
        + ( ( K11_26 ^ R[ET26] ) << 2 )
        + ( ( K11_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K11_35 ^ R[ET35] )
        + ( ( K11_30 ^ R[ET30] ) << 1 );
      col = ( K11_34 ^ R[ET34] )
        + ( ( K11_33 ^ R[ET33] ) << 1 )
        + ( ( K11_32 ^ R[ET32] ) << 2 )
        + ( ( K11_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K11_41 ^ R[ET41] )
        + ( ( K11_36 ^ R[ET36] ) << 1 );
      col = ( K11_40 ^ R[ET40] )
        + ( ( K11_39 ^ R[ET39] ) << 1 )
        + ( ( K11_38 ^ R[ET38] ) << 2 )
        + ( ( K11_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K11_47 ^ R[ET47] )
        + ( ( K11_42 ^ R[ET42] ) << 1 );
      col = ( K11_46 ^ R[ET46] )
        + ( ( K11_45 ^ R[ET45] ) << 1 )
        + ( ( K11_44 ^ R[ET44] ) << 2 )
        + ( ( K11_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 12
      row = ( K12_5 ^ L[ET5] )
        + ( ( K12_0 ^ L[ET0] ) << 1 );
      col = ( K12_4 ^ L[ET4] )
        + ( ( K12_3 ^ L[ET3] ) << 1 )
        + ( ( K12_2 ^ L[ET2] ) << 2 )
        + ( ( K12_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K12_11 ^ L[ET11] )
        + ( ( K12_6  ^ L[ET6 ] ) << 1 );
      col = ( K12_10 ^ L[ET10] )
        + ( ( K12_9  ^ L[ET9 ] ) << 1 )
        + ( ( K12_8  ^ L[ET8 ] ) << 2 )
        + ( ( K12_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K12_17 ^ L[ET17] )
        + ( ( K12_12 ^ L[ET12] ) << 1 );
      col = ( K12_16 ^ L[ET16] )
        + ( ( K12_15 ^ L[ET15] ) << 1 )
        + ( ( K12_14 ^ L[ET14] ) << 2 )
        + ( ( K12_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K12_23 ^ L[ET23] )
        + ( ( K12_18 ^ L[ET18] ) << 1 );
      col = ( K12_22 ^ L[ET22] )
        + ( ( K12_21 ^ L[ET21] ) << 1 )
        + ( ( K12_20 ^ L[ET20] ) << 2 )
        + ( ( K12_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K12_29 ^ L[ET29] )
        + ( ( K12_24 ^ L[ET24] ) << 1 );
      col = ( K12_28 ^ L[ET28] )
        + ( ( K12_27 ^ L[ET27] ) << 1 )
        + ( ( K12_26 ^ L[ET26] ) << 2 )
        + ( ( K12_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K12_35 ^ L[ET35] )
        + ( ( K12_30 ^ L[ET30] ) << 1 );
      col = ( K12_34 ^ L[ET34] )
        + ( ( K12_33 ^ L[ET33] ) << 1 )
        + ( ( K12_32 ^ L[ET32] ) << 2 )
        + ( ( K12_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K12_41 ^ L[ET41] )
        + ( ( K12_36 ^ L[ET36] ) << 1 );
      col = ( K12_40 ^ L[ET40] )
        + ( ( K12_39 ^ L[ET39] ) << 1 )
        + ( ( K12_38 ^ L[ET38] ) << 2 )
        + ( ( K12_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K12_47 ^ L[ET47] )
        + ( ( K12_42 ^ L[ET42] ) << 1 );
      col = ( K12_46 ^ L[ET46] )
        + ( ( K12_45 ^ L[ET45] ) << 1 )
        + ( ( K12_44 ^ L[ET44] ) << 2 )
        + ( ( K12_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 13
      row = ( K13_5 ^ R[ET5] )
        + ( ( K13_0 ^ R[ET0] ) << 1 );
      col = ( K13_4 ^ R[ET4] )
        + ( ( K13_3 ^ R[ET3] ) << 1 )
        + ( ( K13_2 ^ R[ET2] ) << 2 )
        + ( ( K13_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K13_11 ^ R[ET11] )
        + ( ( K13_6  ^ R[ET6 ] ) << 1 );
      col = ( K13_10 ^ R[ET10] )
        + ( ( K13_9  ^ R[ET9 ] ) << 1 )
        + ( ( K13_8  ^ R[ET8 ] ) << 2 )
        + ( ( K13_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K13_17 ^ R[ET17] )
        + ( ( K13_12 ^ R[ET12] ) << 1 );
      col = ( K13_16 ^ R[ET16] )
        + ( ( K13_15 ^ R[ET15] ) << 1 )
        + ( ( K13_14 ^ R[ET14] ) << 2 )
        + ( ( K13_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K13_23 ^ R[ET23] )
        + ( ( K13_18 ^ R[ET18] ) << 1 );
      col = ( K13_22 ^ R[ET22] )
        + ( ( K13_21 ^ R[ET21] ) << 1 )
        + ( ( K13_20 ^ R[ET20] ) << 2 )
        + ( ( K13_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K13_29 ^ R[ET29] )
        + ( ( K13_24 ^ R[ET24] ) << 1 );
      col = ( K13_28 ^ R[ET28] )
        + ( ( K13_27 ^ R[ET27] ) << 1 )
        + ( ( K13_26 ^ R[ET26] ) << 2 )
        + ( ( K13_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K13_35 ^ R[ET35] )
        + ( ( K13_30 ^ R[ET30] ) << 1 );
      col = ( K13_34 ^ R[ET34] )
        + ( ( K13_33 ^ R[ET33] ) << 1 )
        + ( ( K13_32 ^ R[ET32] ) << 2 )
        + ( ( K13_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K13_41 ^ R[ET41] )
        + ( ( K13_36 ^ R[ET36] ) << 1 );
      col = ( K13_40 ^ R[ET40] )
        + ( ( K13_39 ^ R[ET39] ) << 1 )
        + ( ( K13_38 ^ R[ET38] ) << 2 )
        + ( ( K13_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K13_47 ^ R[ET47] )
        + ( ( K13_42 ^ R[ET42] ) << 1 );
      col = ( K13_46 ^ R[ET46] )
        + ( ( K13_45 ^ R[ET45] ) << 1 )
        + ( ( K13_44 ^ R[ET44] ) << 2 )
        + ( ( K13_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );

      // 14
      row = ( K14_5 ^ L[ET5] )
        + ( ( K14_0 ^ L[ET0] ) << 1 );
      col = ( K14_4 ^ L[ET4] )
        + ( ( K14_3 ^ L[ET3] ) << 1 )
        + ( ( K14_2 ^ L[ET2] ) << 2 )
        + ( ( K14_1 ^ L[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      R[8] = R[8] ^ ( (dec >> 3) & 1 );
      R[16] = R[16] ^ ( (dec >> 2) & 1 );
      R[22] = R[22] ^ ( (dec >> 1) & 1 );
      R[30] = R[30] ^ ( dec & 1 );

      row = ( K14_11 ^ L[ET11] )
        + ( ( K14_6  ^ L[ET6 ] ) << 1 );
      col = ( K14_10 ^ L[ET10] )
        + ( ( K14_9  ^ L[ET9 ] ) << 1 )
        + ( ( K14_8  ^ L[ET8 ] ) << 2 )
        + ( ( K14_7  ^ L[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      R[12] = R[12] ^ ( (dec >> 3) & 1 );
      R[27] = R[27] ^ ( (dec >> 2) & 1 );
      R[1] = R[1] ^ ( (dec >> 1) & 1 );
      R[17] = R[17] ^ ( dec & 1 );

      row = ( K14_17 ^ L[ET17] )
        + ( ( K14_12 ^ L[ET12] ) << 1 );
      col = ( K14_16 ^ L[ET16] )
        + ( ( K14_15 ^ L[ET15] ) << 1 )
        + ( ( K14_14 ^ L[ET14] ) << 2 )
        + ( ( K14_13 ^ L[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      R[23] = R[23] ^ ( (dec >> 3) & 1 );
      R[15] = R[15] ^ ( (dec >> 2) & 1 );
      R[29] = R[29] ^ ( (dec >> 1) & 1 );
      R[5] = R[5] ^ ( dec & 1 );     

      row = ( K14_23 ^ L[ET23] )
        + ( ( K14_18 ^ L[ET18] ) << 1 );
      col = ( K14_22 ^ L[ET22] )
        + ( ( K14_21 ^ L[ET21] ) << 1 )
        + ( ( K14_20 ^ L[ET20] ) << 2 )
        + ( ( K14_19 ^ L[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      R[25] = R[25] ^ ( (dec >> 3) & 1 );
      R[19] = R[19] ^ ( (dec >> 2) & 1 );
      R[9] = R[9] ^ ( (dec >> 1) & 1 );
      R[0] = R[0] ^ ( dec & 1 );
    
      row = ( K14_29 ^ L[ET29] )
        + ( ( K14_24 ^ L[ET24] ) << 1 );
      col = ( K14_28 ^ L[ET28] )
        + ( ( K14_27 ^ L[ET27] ) << 1 )
        + ( ( K14_26 ^ L[ET26] ) << 2 )
        + ( ( K14_25 ^ L[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      R[7] = R[7] ^ ( (dec >> 3) & 1 );
      R[13] = R[13] ^ ( (dec >> 2) & 1 );
      R[24] = R[24] ^ ( (dec >> 1) & 1 );
      R[2] = R[2] ^ ( dec & 1 );

      row = ( K14_35 ^ L[ET35] )
        + ( ( K14_30 ^ L[ET30] ) << 1 );
      col = ( K14_34 ^ L[ET34] )
        + ( ( K14_33 ^ L[ET33] ) << 1 )
        + ( ( K14_32 ^ L[ET32] ) << 2 )
        + ( ( K14_31 ^ L[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      R[3] = R[3] ^ ( (dec >> 3) & 1 );
      R[28] = R[28] ^ ( (dec >> 2) & 1 );
      R[10] = R[10] ^ ( (dec >> 1) & 1 );
      R[18] = R[18] ^ ( dec & 1 );

      row = ( K14_41 ^ L[ET41] )
        + ( ( K14_36 ^ L[ET36] ) << 1 );
      col = ( K14_40 ^ L[ET40] )
        + ( ( K14_39 ^ L[ET39] ) << 1 )
        + ( ( K14_38 ^ L[ET38] ) << 2 )
        + ( ( K14_37 ^ L[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      R[31] = R[31] ^ ( (dec >> 3) & 1 );
      R[11] = R[11] ^ ( (dec >> 2) & 1 );
      R[21] = R[21] ^ ( (dec >> 1) & 1 );
      R[6] = R[6] ^ ( dec & 1 );
    
      row = ( K14_47 ^ L[ET47] )
        + ( ( K14_42 ^ L[ET42] ) << 1 );
      col = ( K14_46 ^ L[ET46] )
        + ( ( K14_45 ^ L[ET45] ) << 1 )
        + ( ( K14_44 ^ L[ET44] ) << 2 )
        + ( ( K14_43 ^ L[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      R[4] = R[4] ^ ( (dec >> 3) & 1 );
      R[26] = R[26] ^ ( (dec >> 2) & 1 );
      R[14] = R[14] ^ ( (dec >> 1) & 1 );
      R[20] = R[20] ^ ( dec & 1 );

      // 15
      row = ( K15_5 ^ R[ET5] )
        + ( ( K15_0 ^ R[ET0] ) << 1 );
      col = ( K15_4 ^ R[ET4] )
        + ( ( K15_3 ^ R[ET3] ) << 1 )
        + ( ( K15_2 ^ R[ET2] ) << 2 )
        + ( ( K15_1 ^ R[ET1] ) << 3 );
      dec = SB0[ (row<<4) + col ];
      L[8] = L[8] ^ ( (dec >> 3) & 1 );
      L[16] = L[16] ^ ( (dec >> 2) & 1 );
      L[22] = L[22] ^ ( (dec >> 1) & 1 );
      L[30] = L[30] ^ ( dec & 1 );

      row = ( K15_11 ^ R[ET11] )
        + ( ( K15_6  ^ R[ET6 ] ) << 1 );
      col = ( K15_10 ^ R[ET10] )
        + ( ( K15_9  ^ R[ET9 ] ) << 1 )
        + ( ( K15_8  ^ R[ET8 ] ) << 2 )
        + ( ( K15_7  ^ R[ET7 ] ) << 3 );
      dec = SB1[ (row<<4) + col ];
      L[12] = L[12] ^ ( (dec >> 3) & 1 );
      L[27] = L[27] ^ ( (dec >> 2) & 1 );
      L[1] = L[1] ^ ( (dec >> 1) & 1 );
      L[17] = L[17] ^ ( dec & 1 );

      row = ( K15_17 ^ R[ET17] )
        + ( ( K15_12 ^ R[ET12] ) << 1 );
      col = ( K15_16 ^ R[ET16] )
        + ( ( K15_15 ^ R[ET15] ) << 1 )
        + ( ( K15_14 ^ R[ET14] ) << 2 )
        + ( ( K15_13 ^ R[ET13] ) << 3 );
      dec = SB2[ (row<<4) + col ];
      L[23] = L[23] ^ ( (dec >> 3) & 1 );
      L[15] = L[15] ^ ( (dec >> 2) & 1 );
      L[29] = L[29] ^ ( (dec >> 1) & 1 );
      L[5] = L[5] ^ ( dec & 1 );     

      row = ( K15_23 ^ R[ET23] )
        + ( ( K15_18 ^ R[ET18] ) << 1 );
      col = ( K15_22 ^ R[ET22] )
        + ( ( K15_21 ^ R[ET21] ) << 1 )
        + ( ( K15_20 ^ R[ET20] ) << 2 )
        + ( ( K15_19 ^ R[ET19] ) << 3 );
      dec = SB3[ (row<<4) + col ];
      L[25] = L[25] ^ ( (dec >> 3) & 1 );
      L[19] = L[19] ^ ( (dec >> 2) & 1 );
      L[9] = L[9] ^ ( (dec >> 1) & 1 );
      L[0] = L[0] ^ ( dec & 1 );
    
      row = ( K15_29 ^ R[ET29] )
        + ( ( K15_24 ^ R[ET24] ) << 1 );
      col = ( K15_28 ^ R[ET28] )
        + ( ( K15_27 ^ R[ET27] ) << 1 )
        + ( ( K15_26 ^ R[ET26] ) << 2 )
        + ( ( K15_25 ^ R[ET25] ) << 3 );
      dec = SB4[ (row<<4) + col ];
      L[7] = L[7] ^ ( (dec >> 3) & 1 );
      L[13] = L[13] ^ ( (dec >> 2) & 1 );
      L[24] = L[24] ^ ( (dec >> 1) & 1 );
      L[2] = L[2] ^ ( dec & 1 );

      row = ( K15_35 ^ R[ET35] )
        + ( ( K15_30 ^ R[ET30] ) << 1 );
      col = ( K15_34 ^ R[ET34] )
        + ( ( K15_33 ^ R[ET33] ) << 1 )
        + ( ( K15_32 ^ R[ET32] ) << 2 )
        + ( ( K15_31 ^ R[ET31] ) << 3 );
      dec = SB5[ (row<<4) + col ];
      L[3] = L[3] ^ ( (dec >> 3) & 1 );
      L[28] = L[28] ^ ( (dec >> 2) & 1 );
      L[10] = L[10] ^ ( (dec >> 1) & 1 );
      L[18] = L[18] ^ ( dec & 1 );

      row = ( K15_41 ^ R[ET41] )
        + ( ( K15_36 ^ R[ET36] ) << 1 );
      col = ( K15_40 ^ R[ET40] )
        + ( ( K15_39 ^ R[ET39] ) << 1 )
        + ( ( K15_38 ^ R[ET38] ) << 2 )
        + ( ( K15_37 ^ R[ET37] ) << 3 );
      dec = SB6[ (row<<4) + col ];
      L[31] = L[31] ^ ( (dec >> 3) & 1 );
      L[11] = L[11] ^ ( (dec >> 2) & 1 );
      L[21] = L[21] ^ ( (dec >> 1) & 1 );
      L[6] = L[6] ^ ( dec & 1 );
    
      row = ( K15_47 ^ R[ET47] )
        + ( ( K15_42 ^ R[ET42] ) << 1 );
      col = ( K15_46 ^ R[ET46] )
        + ( ( K15_45 ^ R[ET45] ) << 1 )
        + ( ( K15_44 ^ R[ET44] ) << 2 )
        + ( ( K15_43 ^ R[ET43] ) << 3 );
      dec = SB7[ (row<<4) + col ];
      L[4] = L[4] ^ ( (dec >> 3) & 1 );
      L[26] = L[26] ^ ( (dec >> 2) & 1 );
      L[14] = L[14] ^ ( (dec >> 1) & 1 );
      L[20] = L[20] ^ ( dec & 1 );
    }
  }

  set_end_initial_lr(R, L);
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

function _perturb_expansion() :void {
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
      if( (c >> j) & 1 ) {
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
  for(let i :i32 = 0; i < itr_n; i++)
    crypt3(i);
}

