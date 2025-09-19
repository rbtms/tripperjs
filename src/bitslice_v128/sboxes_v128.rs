#![cfg(target_arch = "wasm32")]
#![feature(stdsimd)]
use std::arch::wasm32::*;
use crate::constants::INVERSE_STRAIGHT_TABLE;

/// Applies the S1-S8 substitution box to the input bits and XORs the result
/// into the output slice.
///
/// # Parameters
/// * `a1`, `a2`, `a3`, `a4`, `a5`, `a6` - Input bits to be processed
/// * `l` - Mutable reference to the output array where results are XORed in

#[inline(always)]
pub fn s1(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a4);
    let x2 = v128_not(a1);
    let x3 = v128_xor(a4, a3);
    let x4 = v128_xor(x3, x2);
    let x5 = v128_or(a3, x2);
    let x6 = v128_and(x5, x1);
    let x7 = v128_or(a6, x6);
    let x8 = v128_xor(x4, x7);
    let x9 = v128_or(x1, x2);
    let x10 = v128_and(a6, x9);
    let x11 = v128_xor(x7, x10);
    let x12 = v128_or(a2, x11);
    let x13 = v128_xor(x8, x12);
    let x14 = v128_xor(x9, x13);
    let x15 = v128_or(a6, x14);
    let x16 = v128_xor(x1, x15);
    let x17 = v128_not(x14);
    let x18 = v128_and(x17, x3);
    let x19 = v128_or(a2, x18);
    let x20 = v128_xor(x16, x19);
    let x21 = v128_or(a5, x20);
    let x22 = v128_xor(x13, x21);

    let x23 = v128_or(a3, x4);
    let x24 = v128_not(x23);
    let x25 = v128_or(a6, x24);
    let x26 = v128_xor(x6, x25);
    let x27 = v128_and(x1, x8);
    let x28 = v128_or(a2, x27);
    let x29 = v128_xor(x26, x28);
    let x30 = v128_or(x1, x8);
    let x31 = v128_xor(x30, x6);
    let x32 = v128_and(x5, x14);
    let x33 = v128_xor(x32, x8);
    let x34 = v128_and(a2, x33);
    let x35 = v128_xor(x31, x34);
    let x36 = v128_or(a5, x35);
    let x37 = v128_xor(x29, x36);

    let x38 = v128_and(a3, x10);
    let x39 = v128_or(x38, x4);
    let x40 = v128_and(a3, x33);
    let x41 = v128_xor(x40, x25);
    let x42 = v128_or(a2, x41);
    let x43 = v128_xor(x39, x42);
    let x44 = v128_or(a3, x26);
    let x45 = v128_xor(x44, x14);
    let x46 = v128_or(a1, x8);
    let x47 = v128_xor(x46, x20);
    let x48 = v128_or(a2, x47);
    let x49 = v128_xor(x45, x48);
    let x50 = v128_and(a5, x49);
    let x51 = v128_xor(x43, x50);

    let x52 = v128_xor(x8, x40);
    let x53 = v128_xor(a3, x11);
    let x54 = v128_and(x53, x5);
    let x55 = v128_or(a2, x54);
    let x56 = v128_xor(x52, x55);
    let x57 = v128_or(a6, x4);
    let x58 = v128_xor(x57, x38);
    let x59 = v128_and(x13, x56);
    let x60 = v128_and(a2, x59);
    let x61 = v128_xor(x58, x60);
    let x62 = v128_and(a5, x61);
    let x63 = v128_xor(x56, x62);

    l[INVERSE_STRAIGHT_TABLE[0]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[0]], x37);
    l[INVERSE_STRAIGHT_TABLE[1]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[1]], x51);
    l[INVERSE_STRAIGHT_TABLE[2]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[2]], x63);
    l[INVERSE_STRAIGHT_TABLE[3]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[3]], x22);
}

#[target_feature(enable = "simd128")]
pub fn s2(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a5);
    let x2 = v128_not(a1);
    let x3 = v128_xor(a5, a6);
    let x4 = v128_xor(x3, x2);
    let x5 = v128_xor(x4, a2);
    let x6 = v128_or(a6, x1);
    let x7 = v128_or(x6, x2);
    let x8 = v128_and(a2, x7);
    let x9 = v128_xor(a6, x8);
    let x10 = v128_and(a3, x9);
    let x11 = v128_xor(x5, x10);
    let x12 = v128_and(a2, x9);
    let x13 = v128_xor(a5, x6);
    let x14 = v128_or(a3, x13);
    let x15 = v128_xor(x12, x14);
    let x16 = v128_and(a4, x15);
    let x17 = v128_xor(x11, x16);

    let x18 = v128_or(a5, a1);
    let x19 = v128_or(a6, x18);
    let x20 = v128_xor(x13, x19);
    let x21 = v128_xor(x20, a2);
    let x22 = v128_or(a6, x4);
    let x23 = v128_and(x22, x17);
    let x24 = v128_or(a3, x23);
    let x25 = v128_xor(x21, x24);
    let x26 = v128_or(a6, x2);
    let x27 = v128_and(a5, x2);
    let x28 = v128_or(a2, x27);
    let x29 = v128_xor(x26, x28);
    let x30 = v128_xor(x3, x27);
    let x31 = v128_xor(x2, x19);
    let x32 = v128_and(a2, x31);
    let x33 = v128_xor(x30, x32);
    let x34 = v128_and(a3, x33);
    let x35 = v128_xor(x29, x34);
    let x36 = v128_or(a4, x35);
    let x37 = v128_xor(x25, x36);

    let x38 = v128_and(x21, x32);
    let x39 = v128_xor(x38, x5);
    let x40 = v128_or(a1, x15);
    let x41 = v128_xor(x40, x13);
    let x42 = v128_or(a3, x41);
    let x43 = v128_xor(x39, x42);
    let x44 = v128_or(x28, x41);
    let x45 = v128_and(a4, x44);
    let x46 = v128_xor(x43, x45);

    let x47 = v128_and(x19, x21);
    let x48 = v128_xor(x47, x26);
    let x49 = v128_and(a2, x33);
    let x50 = v128_xor(x49, x21);
    let x51 = v128_and(a3, x50);
    let x52 = v128_xor(x48, x51);
    let x53 = v128_and(x18, x28);
    let x54 = v128_and(x53, x50);
    let x55 = v128_or(a4, x54);
    let x56 = v128_xor(x52, x55);

    l[INVERSE_STRAIGHT_TABLE[4]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[4]], x46);
    l[INVERSE_STRAIGHT_TABLE[5]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[5]], x17);
    l[INVERSE_STRAIGHT_TABLE[6]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[6]], x37);
    l[INVERSE_STRAIGHT_TABLE[7]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[7]], x56);

}

#[target_feature(enable = "simd128")]
pub fn s3(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a5);
    let x2 = v128_not(a6);
    let x3 = v128_and(a5, a3);
    let x4 = v128_xor(x3, a6);
    let x5 = v128_and(a4, x1);
    let x6 = v128_xor(x4, x5);
    let x7 = v128_xor(x6, a2);
    let x8 = v128_and(a3, x1);
    let x9 = v128_xor(a5, x2);
    let x10 = v128_or(a4, x9);
    let x11 = v128_xor(x8, x10);
    let x12 = v128_and(x7, x11);
    let x13 = v128_xor(a5, x11);
    let x14 = v128_or(x13, x7);
    let x15 = v128_and(a4, x14);
    let x16 = v128_xor(x12, x15);
    let x17 = v128_and(a2, x16);
    let x18 = v128_xor(x11, x17);
    let x19 = v128_and(a1, x18);
    let x20 = v128_xor(x7, x19);

    let x21 = v128_xor(a3, a4);
    let x22 = v128_xor(x21, x9);
    let x23 = v128_or(x2, x4);
    let x24 = v128_xor(x23, x8);
    let x25 = v128_or(a2, x24);
    let x26 = v128_xor(x22, x25);
    let x27 = v128_xor(a6, x23);
    let x28 = v128_or(x27, a4);
    let x29 = v128_xor(a3, x15);
    let x30 = v128_or(x29, x5);
    let x31 = v128_or(a2, x30);
    let x32 = v128_xor(x28, x31);
    let x33 = v128_or(a1, x32);
    let x34 = v128_xor(x26, x33);

    let x35 = v128_xor(a3, x9);
    let x36 = v128_or(x35, x5);
    let x37 = v128_or(x4, x29);
    let x38 = v128_xor(x37, a4);
    let x39 = v128_or(a2, x38);
    let x40 = v128_xor(x36, x39);
    let x41 = v128_and(a6, x11);
    let x42 = v128_or(x41, x6);
    let x43 = v128_xor(x34, x38);
    let x44 = v128_xor(x43, x41);
    let x45 = v128_and(a2, x44);
    let x46 = v128_xor(x42, x45);
    let x47 = v128_or(a1, x46);
    let x48 = v128_xor(x40, x47);

    let x49 = v128_or(x2, x38);
    let x50 = v128_xor(x49, x13);
    let x51 = v128_xor(x27, x28);
    let x52 = v128_or(a2, x51);
    let x53 = v128_xor(x50, x52);
    let x54 = v128_and(x12, x23);
    let x55 = v128_and(x54, x52);
    let x56 = v128_or(a1, x55);
    let x57 = v128_xor(x53, x56);

    l[INVERSE_STRAIGHT_TABLE[8]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[8]], x34);  // corresponds to out1
    l[INVERSE_STRAIGHT_TABLE[9]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[9]], x57);  // corresponds to out2
    l[INVERSE_STRAIGHT_TABLE[10]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[10]], x48);  // corresponds to out3
    l[INVERSE_STRAIGHT_TABLE[11]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[11]], x20);  // corresponds to out4
}

#[target_feature(enable = "simd128")]
pub fn s4(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a1);
    let x2 = v128_not(a3);
    let x3 = v128_or(a1, a3);
    let x4 = v128_and(a5, x3);
    let x5 = v128_xor(x1, x4);
    let x6 = v128_or(a2, a3);
    let x7 = v128_xor(x5, x6);
    let x8 = v128_and(a1, a5);
    let x9 = v128_xor(x8, x3);
    let x10 = v128_and(a2, x9);
    let x11 = v128_xor(a5, x10);
    let x12 = v128_and(a4, x11);
    let x13 = v128_xor(x7, x12);
    let x14 = v128_xor(x2, x4);
    let x15 = v128_and(a2, x14);
    let x16 = v128_xor(x9, x15);
    let x17 = v128_and(x5, x14);
    let x18 = v128_xor(a5, x2);
    let x19 = v128_or(a2, x18);
    let x20 = v128_xor(x17, x19);
    let x21 = v128_or(a4, x20);
    let x22 = v128_xor(x16, x21);
    let x23 = v128_and(a6, x22);
    let x24 = v128_xor(x13, x23);

    let x25 = v128_not(x13);
    let x26 = v128_or(a6, x22);
    let x27 = v128_xor(x25, x26);

    let x28 = v128_and(a2, x11);
    let x29 = v128_xor(x28, x17);
    let x30 = v128_xor(a3, x10);
    let x31 = v128_xor(x30, x19);
    let x32 = v128_and(a4, x31);
    let x33 = v128_xor(x29, x32);
    let x34 = v128_xor(x25, x33);
    let x35 = v128_and(a2, x34);
    let x36 = v128_xor(x24, x35);
    let x37 = v128_or(a4, x34);
    let x38 = v128_xor(x36, x37);
    let x39 = v128_and(a6, x38);
    let x40 = v128_xor(x33, x39);

    let x41 = v128_xor(x26, x38);
    let x42 = v128_xor(x41, x40);

    l[INVERSE_STRAIGHT_TABLE[12]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[12]], x27);
    l[INVERSE_STRAIGHT_TABLE[13]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[13]], x24);
    l[INVERSE_STRAIGHT_TABLE[14]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[14]], x42);
    l[INVERSE_STRAIGHT_TABLE[15]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[15]], x40);
}

#[target_feature(enable = "simd128")]
pub fn s5(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a6);
    let x2 = v128_not(a3);
    let x3 = v128_or(x1, x2);
    let x4 = v128_xor(x3, a4);
    let x5 = v128_and(a1, x3);
    let x6 = v128_xor(x4, x5);
    let x7 = v128_or(a6, a4);
    let x8 = v128_xor(x7, a3);
    let x9 = v128_or(a3, x7);
    let x10 = v128_or(a1, x9);
    let x11 = v128_xor(x8, x10);
    let x12 = v128_and(a5, x11);
    let x13 = v128_xor(x6, x12);
    let x14 = v128_not(x4);
    let x15 = v128_and(x14, a6);
    let x16 = v128_or(a1, x15);
    let x17 = v128_xor(x8, x16);
    let x18 = v128_or(a5, x17);
    let x19 = v128_xor(x10, x18);
    let x20 = v128_or(a2, x19);
    let x21 = v128_xor(x13, x20);

    let x22 = v128_or(x2, x15);
    let x23 = v128_xor(x22, a6);
    let x24 = v128_xor(a4, x22);
    let x25 = v128_and(a1, x24);
    let x26 = v128_xor(x23, x25);
    let x27 = v128_xor(a1, x11);
    let x28 = v128_and(x27, x22);
    let x29 = v128_or(a5, x28);
    let x30 = v128_xor(x26, x29);
    let x31 = v128_or(a4, x27);
    let x32 = v128_not(x31);
    let x33 = v128_or(a2, x32);
    let x34 = v128_xor(x30, x33);

    let x35 = v128_xor(x2, x15);
    let x36 = v128_and(a1, x35);
    let x37 = v128_xor(x14, x36);
    let x38 = v128_xor(x5, x7);
    let x39 = v128_and(x38, x34);
    let x40 = v128_or(a5, x39);
    let x41 = v128_xor(x37, x40);
    let x42 = v128_xor(x2, x5);
    let x43 = v128_and(x42, x16);
    let x44 = v128_and(x4, x27);
    let x45 = v128_and(a5, x44);
    let x46 = v128_xor(x43, x45);
    let x47 = v128_or(a2, x46);
    let x48 = v128_xor(x41, x47);

    let x49 = v128_and(x24, x48);
    let x50 = v128_xor(x49, x5);
    let x51 = v128_xor(x11, x30);
    let x52 = v128_or(x51, x50);
    let x53 = v128_and(a5, x52);
    let x54 = v128_xor(x50, x53);
    let x55 = v128_xor(x14, x19);
    let x56 = v128_xor(x55, x34);
    let x57 = v128_xor(x4, x16);
    let x58 = v128_and(x57, x30);
    let x59 = v128_and(a5, x58);
    let x60 = v128_xor(x56, x59);
    let x61 = v128_or(a2, x60);
    let x62 = v128_xor(x54, x61);

    l[INVERSE_STRAIGHT_TABLE[16]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[16]], x48);
    l[INVERSE_STRAIGHT_TABLE[17]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[17]], x34);
    l[INVERSE_STRAIGHT_TABLE[18]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[18]], x21);
    l[INVERSE_STRAIGHT_TABLE[19]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[19]], x62);
}

#[target_feature(enable = "simd128")]
pub fn s6(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a2);
    let x2 = v128_not(a5);
    let x3 = v128_xor(a2, a6);
    let x4 = v128_xor(x3, x2);
    let x5 = v128_xor(x4, a1);
    let x6 = v128_and(a5, a6);
    let x7 = v128_or(x6, x1);
    let x8 = v128_and(a5, x5);
    let x9 = v128_and(a1, x8);
    let x10 = v128_xor(x7, x9);
    let x11 = v128_and(a4, x10);
    let x12 = v128_xor(x5, x11);
    let x13 = v128_xor(a6, x10);
    let x14 = v128_and(x13, a1);
    let x15 = v128_and(a2, a6);
    let x16 = v128_xor(x15, a5);
    let x17 = v128_and(a1, x16);
    let x18 = v128_xor(x2, x17);
    let x19 = v128_or(a4, x18);
    let x20 = v128_xor(x14, x19);
    let x21 = v128_and(a3, x20);
    let x22 = v128_xor(x12, x21);

    let x23 = v128_xor(a6, x18);
    let x24 = v128_and(a1, x23);
    let x25 = v128_xor(a5, x24);
    let x26 = v128_xor(a2, x17);
    let x27 = v128_or(x26, x6);
    let x28 = v128_and(a4, x27);
    let x29 = v128_xor(x25, x28);
    let x30 = v128_not(x26);
    let x31 = v128_or(a6, x29);
    let x32 = v128_not(x31);
    let x33 = v128_and(a4, x32);
    let x34 = v128_xor(x30, x33);
    let x35 = v128_and(a3, x34);
    let x36 = v128_xor(x29, x35);

    let x37 = v128_xor(x6, x34);
    let x38 = v128_and(a5, x23);
    let x39 = v128_xor(x38, x5);
    let x40 = v128_or(a4, x39);
    let x41 = v128_xor(x37, x40);
    let x42 = v128_or(x16, x24);
    let x43 = v128_xor(x42, x1);
    let x44 = v128_xor(x15, x24);
    let x45 = v128_xor(x44, x31);
    let x46 = v128_or(a4, x45);
    let x47 = v128_xor(x43, x46);
    let x48 = v128_or(a3, x47);
    let x49 = v128_xor(x41, x48);

    let x50 = v128_or(x5, x38);
    let x51 = v128_xor(x50, x6);
    let x52 = v128_and(x8, x31);
    let x53 = v128_or(a4, x52);
    let x54 = v128_xor(x51, x53);
    let x55 = v128_and(x30, x43);
    let x56 = v128_or(a3, x55);
    let x57 = v128_xor(x54, x56);

    l[INVERSE_STRAIGHT_TABLE[20]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[20]], x49);
    l[INVERSE_STRAIGHT_TABLE[21]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[21]], x22);
    l[INVERSE_STRAIGHT_TABLE[22]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[22]], x57);
    l[INVERSE_STRAIGHT_TABLE[23]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[23]], x36);
}

#[target_feature(enable = "simd128")]
pub fn s7(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a2);
    let x2 = v128_not(a5);
    let x3 = v128_and(a2, a4);
    let x4 = v128_xor(x3, a5);
    let x5 = v128_xor(x4, a3);
    let x6 = v128_and(a4, x4);
    let x7 = v128_xor(x6, a2);
    let x8 = v128_and(a3, x7);
    let x9 = v128_xor(a1, x8);
    let x10 = v128_or(a6, x9);
    let x11 = v128_xor(x5, x10);
    let x12 = v128_and(a4, x2);
    let x13 = v128_or(x12, a2);
    let x14 = v128_or(a2, x2);
    let x15 = v128_and(a3, x14);
    let x16 = v128_xor(x13, x15);
    let x17 = v128_xor(x6, x11);
    let x18 = v128_or(a6, x17);
    let x19 = v128_xor(x16, x18);
    let x20 = v128_and(a1, x19);
    let x21 = v128_xor(x11, x20);

    let x22 = v128_or(a2, x21);
    let x23 = v128_xor(x22, x6);
    let x24 = v128_xor(x23, x15);
    let x25 = v128_xor(x5, x6);
    let x26 = v128_or(x25, x12);
    let x27 = v128_or(a6, x26);
    let x28 = v128_xor(x24, x27);
    let x29 = v128_and(x1, x19);
    let x30 = v128_and(x23, x26);
    let x31 = v128_and(a6, x30);
    let x32 = v128_xor(x29, x31);
    let x33 = v128_or(a1, x32);
    let x34 = v128_xor(x28, x33);

    let x35 = v128_and(a4, x16);
    let x36 = v128_or(x35, x1);
    let x37 = v128_and(a6, x36);
    let x38 = v128_xor(x11, x37);
    let x39 = v128_and(a4, x13);
    let x40 = v128_or(a3, x7);
    let x41 = v128_xor(x39, x40);
    let x42 = v128_or(x1, x24);
    let x43 = v128_or(a6, x42);
    let x44 = v128_xor(x41, x43);
    let x45 = v128_or(a1, x44);
    let x46 = v128_xor(x38, x45);

    let x47 = v128_xor(x8, x44);
    let x48 = v128_xor(x6, x15);
    let x49 = v128_or(a6, x48);
    let x50 = v128_xor(x47, x49);
    let x51 = v128_xor(x19, x44);
    let x52 = v128_xor(a4, x25);
    let x53 = v128_and(x52, x46);
    let x54 = v128_and(a6, x53);
    let x55 = v128_xor(x51, x54);
    let x56 = v128_or(a1, x55);
    let x57 = v128_xor(x50, x56);

    l[INVERSE_STRAIGHT_TABLE[24]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[24]], x21);
    l[INVERSE_STRAIGHT_TABLE[25]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[25]], x46);
    l[INVERSE_STRAIGHT_TABLE[26]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[26]], x57);
    l[INVERSE_STRAIGHT_TABLE[27]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[27]], x34);
}

#[target_feature(enable = "simd128")]
pub fn s8(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x1 = v128_not(a1);
    let x2 = v128_not(a4);
    let x3 = v128_xor(a3, x1);
    let x4 = v128_or(a3, x1);
    let x5 = v128_xor(x4, x2);
    let x6 = v128_or(a5, x5);
    let x7 = v128_xor(x3, x6);
    let x8 = v128_or(x1, x5);
    let x9 = v128_xor(x2, x8);
    let x10 = v128_and(a5, x9);
    let x11 = v128_xor(x8, x10);
    let x12 = v128_and(a2, x11);
    let x13 = v128_xor(x7, x12);
    let x14 = v128_xor(x6, x9);
    let x15 = v128_and(x3, x9);
    let x16 = v128_and(a5, x8);
    let x17 = v128_xor(x15, x16);
    let x18 = v128_or(a2, x17);
    let x19 = v128_xor(x14, x18);
    let x20 = v128_or(a6, x19);
    let x21 = v128_xor(x13, x20);

    let x22 = v128_or(a5, x3);
    let x23 = v128_and(x22, x2);
    let x24 = v128_not(a3);
    let x25 = v128_and(x24, x8);
    let x26 = v128_and(a5, x4);
    let x27 = v128_xor(x25, x26);
    let x28 = v128_or(a2, x27);
    let x29 = v128_xor(x23, x28);
    let x30 = v128_and(a6, x29);
    let x31 = v128_xor(x13, x30);

    let x32 = v128_xor(x5, x6);
    let x33 = v128_xor(x32, x22);
    let x34 = v128_or(a4, x13);
    let x35 = v128_and(a2, x34);
    let x36 = v128_xor(x33, x35);
    let x37 = v128_and(a1, x33);
    let x38 = v128_xor(x37, x8);
    let x39 = v128_xor(a1, x23);
    let x40 = v128_and(x39, x7);
    let x41 = v128_and(a2, x40);
    let x42 = v128_xor(x38, x41);
    let x43 = v128_or(a6, x42);
    let x44 = v128_xor(x36, x43);

    let x45 = v128_xor(a1, x10);
    let x46 = v128_xor(x45, x22);
    let x47 = v128_not(x7);
    let x48 = v128_and(x47, x8);
    let x49 = v128_or(a2, x48);
    let x50 = v128_xor(x46, x49);
    let x51 = v128_xor(x19, x29);
    let x52 = v128_or(x51, x38);
    let x53 = v128_and(a6, x52);
    let x54 = v128_xor(x50, x53);

    l[INVERSE_STRAIGHT_TABLE[28]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[28]], x21);
    l[INVERSE_STRAIGHT_TABLE[29]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[29]], x54);
    l[INVERSE_STRAIGHT_TABLE[30]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[30]], x44);
    l[INVERSE_STRAIGHT_TABLE[31]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[31]], x31);
}
