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
pub fn s1(
    a1: v128,
    a2: v128,
    a3: v128,
    a4: v128,
    a5: v128,
    a6: v128,
    l: &mut [v128; 32],
) {
    // Step 1
    let x0F0F3333 = v128_bitselect(a2, a3, a5);
    let x3C3C3C3C = v128_xor(a2, a3);
    let x55FF55FF = v128_or(a1, a4);
    let x69C369C3 = v128_xor(x3C3C3C3C, x55FF55FF);
    let x0903B73F = v128_bitselect(x0F0F3333, a5, x69C369C3);
    let x09FCB7C0 = v128_xor(a4, x0903B73F);
    let x5CA9E295 = v128_xor(a1, x09FCB7C0);

    // Step 2
    let x55AFD1B7 = v128_bitselect(x55FF55FF, x5CA9E295, x0F0F3333);
    let x3C3C69C3 = v128_bitselect(x69C369C3, x3C3C3C3C, a5);
    let x6993B874 = v128_xor(x55AFD1B7, x3C3C69C3);

    // Step 3
    let x5CEDE59F = v128_bitselect(x5CA9E295, x55FF55FF, x6993B874);
    let x09FCE295 = v128_bitselect(x5CA9E295, x09FCB7C0, a5);
    let x5D91A51E = v128_bitselect(x6993B874, x5CEDE59F, x09FCE295);
    let x529E962D = v128_xor(x0F0F3333, x5D91A51E);

    // Step 4
    let x29EEADC0 = v128_bitselect(x09FCB7C0, x69C369C3, x5CEDE59F);
    let x4B8771A3 = v128_bitselect(x69C369C3, x0F0F3333, x5CA9E295);
    let x428679F3 = v128_bitselect(x4B8771A3, a5, x529E962D);
    let x6B68D433 = v128_xor(x29EEADC0, x428679F3);

    // Step 5
    let x5BA7E193 = v128_bitselect(x4B8771A3, x5CA9E295, a3);
    let x026F12F3 = v128_bitselect(x0F0F3333, a4, x529E962D);
    let x6B27C493 = v128_bitselect(x5BA7E193, x6B68D433, x026F12F3);
    let x94D83B6C = v128_not(x6B27C493);
    let x0 = v128_bitselect(x6B68D433, x94D83B6C, a6);
    l[INVERSE_STRAIGHT_TABLE[0]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[0]], x0);

    // Step 6
    let x965E0B0F = v128_bitselect(a3, x94D83B6C, x428679F3);
    let x3327A113 = v128_bitselect(a2, x5BA7E193, x69C369C3);
    let x847F0A1F = v128_bitselect(a4, x965E0B0F, x3327A113);
    let xD6E19C32 = v128_xor(x529E962D, x847F0A1F);
    let x1 = v128_bitselect(x5CA9E295, xD6E19C32, a6);
    l[INVERSE_STRAIGHT_TABLE[1]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[1]], x1);

    // Step 7
    let x0DBCE883 = v128_bitselect(x3C3C69C3, x09FCE295, x847F0A1F);
    let x3A25A215 = v128_bitselect(x5CA9E295, x3327A113, x0903B73F);
    let x37994A96 = v128_xor(x0DBCE883, x3A25A215);
    let x3 = v128_bitselect(x529E962D, x37994A96, a6);
    l[INVERSE_STRAIGHT_TABLE[3]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[3]], x3);

    // Step 8
    let xC9C93B62 = v128_bitselect(x69C369C3, x94D83B6C, x5D91A51E);
    let x89490F02 = v128_bitselect(xC9C93B62, a3, x965E0B0F);
    let xB96C2D16 = v128_bitselect(x3C3C3C3C, x89490F02, x3A25A215);
    let x2 = v128_bitselect(x6993B874, xB96C2D16, a6);
    l[INVERSE_STRAIGHT_TABLE[2]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[2]], x2);
}

#[target_feature(enable = "simd128")]
pub fn s2(
    a1: v128,
    a2: v128,
    a3: v128,
    a4: v128,
    a5: v128,
    a6: v128,
    l: &mut [v128; 32],
) {
    // Step 1
    let x55553333 = v128_bitselect(a3, a1, a6);
    let x0055FF33 = v128_bitselect(x55553333, a6, a5);
    let x33270F03 = v128_bitselect(a4, a3, x0055FF33);
    let x66725A56 = v128_xor(a1, x33270F03);
    let x00FFFF00 = v128_xor(a5, a6);
    let x668DA556 = v128_xor(x66725A56, x00FFFF00);

    // Step 2
    let x0F0F5A56 = v128_bitselect(x66725A56, a4, a6);
    let xF0F0A5A9 = v128_not(x0F0F5A56);
    let xA5A5969A = v128_xor(x55553333, xF0F0A5A9);
    let xA55A699A = v128_xor(x00FFFF00, xA5A5969A);
    let x1 = v128_bitselect(x668DA556, xA55A699A, a2);
    l[INVERSE_STRAIGHT_TABLE[5]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[5]], x1);

    // Step 3
    let x0F5AF03C = v128_xor(a4, x0055FF33);
    let x6600FF56 = v128_bitselect(a6, x66725A56, x00FFFF00);
    let x87A5F09C = v128_bitselect(x0F5AF03C, xA5A5969A, x6600FF56);

    // Step 4
    let xA55A963C = v128_bitselect(x0F5AF03C, xA5A5969A, a5);
    let x3C69C30F = v128_xor(a3, x0F5AF03C);
    let xB44BC32D = v128_bitselect(x3C69C30F, xA55A963C, a1);

    // Step 5
    let x66D7CC56 = v128_bitselect(x668DA556, x66725A56, xA5A5969A);
    let x0F4B0F2D = v128_bitselect(xB44BC32D, a4, a5);
    let x699CC37B = v128_xor(x66D7CC56, x0F4B0F2D);
    let x996C66D2 = v128_xor(xF0F0A5A9, x699CC37B);
    let x0 = v128_bitselect(xB44BC32D, x996C66D2, a2);
    l[INVERSE_STRAIGHT_TABLE[4]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[4]], x0);

    // Step 6
    let xB46C662D = v128_bitselect(x996C66D2, xB44BC32D, x00FFFF00);
    let x278DB412 = v128_bitselect(xA5A5969A, x668DA556, a1);
    let xB66CB43B = v128_bitselect(x278DB412, xB46C662D, x6600FF56);

    // Step 7
    let xD2DC4E52 = v128_bitselect(x996C66D2, x66D7CC56, xB44BC32D);
    let x27993333 = v128_bitselect(a3, x278DB412, x0055FF33);
    let xD2994E33 = v128_bitselect(x27993333, xD2DC4E52, a5);
    let x3 = v128_bitselect(xD2994E33, x87A5F09C, a2);
    l[INVERSE_STRAIGHT_TABLE[7]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[7]], x3);

    // Step 8
    let x278D0F2D = v128_bitselect(x0F4B0F2D, x278DB412, a6);
    let x2E0E547B = v128_bitselect(xB66CB43B, x0F0F5A56, x278D0F2D);
    let x09976748 = v128_xor(x27993333, x2E0E547B);
    let x2 = v128_bitselect(x09976748, xB66CB43B, a2);
    l[INVERSE_STRAIGHT_TABLE[6]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[6]], x2);
}

#[target_feature(enable = "simd128")]
pub fn s3(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x0F330F33 = v128_bitselect(a3, a4, a5);
    let x0F33F0CC = v128_xor(a6, x0F330F33);
    let x5A66A599 = v128_xor(a2, x0F33F0CC);

    let x2111B7BB = v128_bitselect(a6, a3, x5A66A599);
    let x03FF3033 = v128_bitselect(a3, a5, x0F33F0CC);
    let x05BB50EE = v128_bitselect(x0F33F0CC, a5, a2);
    let x074F201F = v128_bitselect(a4, x03FF3033, x05BB50EE);
    let x265E97A4 = v128_xor(x2111B7BB, x074F201F);

    let x556BA09E = v128_bitselect(x05BB50EE, x5A66A599, a4);
    let x665A93AC = v128_bitselect(x265E97A4, x556BA09E, a3);
    let x99A56C53 = v128_not(x665A93AC);
    let x1 = v128_bitselect(x99A56C53, x265E97A4, a1);
    l[INVERSE_STRAIGHT_TABLE[9]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[9]], x1);  // corresponds to out2

    let x25A1A797 = v128_xor(x03FF3033, x265E97A4);
    let x5713754C = v128_bitselect(x0F33F0CC, a2, x074F201F);
    let x66559355 = v128_bitselect(a2, x665A93AC, a5);
    let x47B135C6 = v128_bitselect(x5713754C, x25A1A797, x66559355);

    let x9A5A5C60 = v128_xor(x03FF3033, x99A56C53);
    let xD07AF8F8 = v128_bitselect(x556BA09E, x9A5A5C60, x5A66A599);
    let x87698DB4 = v128_xor(x5713754C, xD07AF8F8);
    let xE13C1EE1 = v128_xor(x66559355, x87698DB4);

    let x000CFFCF = v128_bitselect(a6, a4, x0F33F0CC);
    let x9A485CCE = v128_bitselect(x000CFFCF, x9A5A5C60, x05BB50EE);
    let x0521DDF4 = v128_bitselect(a6, x87698DB4, x9A5A5C60);
    let x9E49915E = v128_bitselect(x66559355, x9A485CCE, x0521DDF4);
    let x0 = v128_bitselect(xE13C1EE1, x9E49915E, a1);
    l[INVERSE_STRAIGHT_TABLE[8]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[8]], x0);  // corresponds to out1

    let xD069F8B4 = v128_bitselect(x87698DB4, xD07AF8F8, a5);
    let x030FF0C3 = v128_bitselect(x03FF3033, x000CFFCF, a4);
    let xD2699876 = v128_bitselect(x9E49915E, xD069F8B4, x030FF0C3);
    let x3 = v128_bitselect(xD2699876, x5A66A599, a1);
    l[INVERSE_STRAIGHT_TABLE[11]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[11]], x3);  // corresponds to out4

    let xD579DDF4 = v128_bitselect(a2, xD07AF8F8, x5713754C);
    let xD579F0C3 = v128_bitselect(x030FF0C3, xD579DDF4, a6);
    let xB32C6396 = v128_xor(x66559355, xD579F0C3);
    let x2 = v128_bitselect(x47B135C6, xB32C6396, a1);
    l[INVERSE_STRAIGHT_TABLE[10]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[10]], x2);  // corresponds to out3
}

#[target_feature(enable = "simd128")]
pub fn s4(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x0505AFAF = v128_bitselect(a3, a5, a1);
    let x0555AF55 = v128_bitselect(a1, x0505AFAF, a4);
    let x0A5AA05A = v128_xor(a3, x0555AF55);
    let x46566456 = v128_bitselect(x0A5AA05A, a1, a2);
    let x0A0A5F5F = v128_bitselect(a5, a3, a1);
    let x0AF55FA0 = v128_xor(a4, x0A0A5F5F);
    let x0AF50F0F = v128_bitselect(a3, x0AF55FA0, a5);
    let x4CA36B59 = v128_xor(x46566456, x0AF50F0F);

    let xB35C94A6 = v128_not(x4CA36B59);

    let x01BB23BB = v128_bitselect(a2, a4, x0555AF55);
    let x5050FAFA = v128_xor(a1, x0505AFAF);
    let xA31C26BE = v128_bitselect(x01BB23BB, xB35C94A6, x5050FAFA);
    let xA91679E1 = v128_xor(x0A0A5F5F, xA31C26BE);

    let x56E9861E = v128_not(xA91679E1);

    let x50E9FA1E = v128_bitselect(x56E9861E, x5050FAFA, a4);
    let x0AF55F00 = v128_bitselect(x0AF55FA0, x0AF50F0F, x0A0A5F5F);
    let x827D9784 = v128_bitselect(x0AF55F00, xB35C94A6, a2);
    let xD2946D9A = v128_xor(x50E9FA1E, x827D9784);

    let x2 = v128_bitselect(x4CA36B59, xD2946D9A, a6);
    l[INVERSE_STRAIGHT_TABLE[14]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[14]], x2);

    let x3 = v128_bitselect(xD2946D9A, xB35C94A6, a6);
    l[INVERSE_STRAIGHT_TABLE[15]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[15]], x3);

    let x31F720B3 = v128_bitselect(a4, a2, x0AF55FA0);
    let x11FB21B3 = v128_bitselect(x31F720B3, x01BB23BB, x5050FAFA);
    let x4712A7AD = v128_xor(x56E9861E, x11FB21B3);
    let x9586CA37 = v128_xor(xD2946D9A, x4712A7AD);

    let x0 = v128_bitselect(x9586CA37, x56E9861E, a6);
    l[INVERSE_STRAIGHT_TABLE[12]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[12]], x0);

    let x1 = v128_bitselect(xA91679E1, x9586CA37, a6);
    l[INVERSE_STRAIGHT_TABLE[13]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[13]], x1);
}

#[target_feature(enable = "simd128")]
pub fn s5(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x550F550F = v128_bitselect(a3, a1, a5);
    let xAAF0AAF0 = v128_not(x550F550F);
    let xA5F5A5F5 = v128_bitselect(a1, xAAF0AAF0, a3);
    let x96C696C6 = v128_xor(a2, xA5F5A5F5);
    let x00FFFF00 = v128_xor(a5, a6);
    let x963969C6 = v128_xor(x96C696C6, x00FFFF00);

    let x2E3C2E3C = v128_bitselect(xAAF0AAF0, a3, a2);
    let xB73121F7 = v128_bitselect(x963969C6, a2, x96C696C6);
    let x1501DF0F = v128_bitselect(x550F550F, a6, xB73121F7);
    let x00558A5F = v128_bitselect(a5, x1501DF0F, a1);
    let x2E69A463 = v128_xor(x2E3C2E3C, x00558A5F);

    let x0679ED42 = v128_bitselect(x2E69A463, x00FFFF00, x96C696C6);
    let x045157FD = v128_bitselect(a1, a6, x0679ED42);
    let xB32077FF = v128_bitselect(a6, xB73121F7, x045157FD);
    let x9D49D39C = v128_xor(x2E69A463, xB32077FF);
    let x2 = v128_bitselect(x2E69A463, x9D49D39C, a4);
    l[INVERSE_STRAIGHT_TABLE[18]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[18]], x2);

    let xAC81CFB2 = v128_bitselect(x1501DF0F, xAAF0AAF0, x0679ED42);
    let xF72577AF = v128_bitselect(x550F550F, xB32077FF, a1);
    let x5BA4B81D = v128_xor(xAC81CFB2, xF72577AF);
    let x1 = v128_bitselect(x963969C6, x5BA4B81D, a4);
    l[INVERSE_STRAIGHT_TABLE[17]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[17]], x1);

    let x5BA477AF = v128_bitselect(xF72577AF, x5BA4B81D, a6);
    let x4895469F = v128_bitselect(x00558A5F, x5BA477AF, a2);
    let x3A35273A = v128_bitselect(a2, x2E3C2E3C, x963969C6);
    let x1A35669A = v128_bitselect(x3A35273A, x4895469F, x5BA4B81D);

    let x12E6283D = v128_bitselect(x5BA4B81D, a5, x963969C6);
    let x9E47D3D4 = v128_bitselect(x9D49D39C, x96C696C6, xAC81CFB2);
    let x1A676AB4 = v128_bitselect(x9E47D3D4, x12E6283D, x4895469F);

    let x2E3C69C6 = v128_bitselect(x963969C6, x2E3C2E3C, a6);
    let x92C7C296 = v128_bitselect(x1A676AB4, x96C696C6, a1);
    let x369CC1D6 = v128_bitselect(x92C7C296, x2E3C69C6, x5BA4B81D);
    let x0 = v128_bitselect(x1A676AB4, x369CC1D6, a4);
    l[INVERSE_STRAIGHT_TABLE[16]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[16]], x0);

    let x891556DF = v128_bitselect(x4895469F, xB32077FF, x3A35273A);
    let xE5E77F82 = v128_bitselect(x00FFFF00, xF72577AF, x12E6283D);
    let x6CF2295D = v128_xor(x891556DF, xE5E77F82);
    let x3 = v128_bitselect(x6CF2295D, x1A35669A, a4);
    l[INVERSE_STRAIGHT_TABLE[19]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[19]], x3);
}

#[target_feature(enable = "simd128")]
pub fn s6(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x555500FF = v128_bitselect(a4, a1, a5);
    let x666633CC = v128_xor(a2, x555500FF);
    let x606F30CF = v128_bitselect(a4, x666633CC, a3);
    let x353A659A = v128_xor(a1, x606F30CF);
    let x353A9A65 = v128_xor(a5, x353A659A);
    let xCAC5659A = v128_not(x353A9A65);

    let x353A6565 = v128_bitselect(x353A9A65, x353A659A, a4);
    let x0A3F0A6F = v128_bitselect(a4, a3, x353A6565);
    let x6C5939A3 = v128_xor(x666633CC, x0A3F0A6F);
    let x5963A3C6 = v128_xor(x353A9A65, x6C5939A3);

    let x35FF659A = v128_bitselect(x353A659A, a4, x353A6565);
    let x3AF06A95 = v128_xor(a3, x35FF659A);
    let x05CF0A9F = v128_bitselect(a3, a4, x353A9A65);
    let x16E94A97 = v128_bitselect(x05CF0A9F, x3AF06A95, x6C5939A3);

    let x86CD4C9B = v128_bitselect(x05CF0A9F, xCAC5659A, x6C5939A3);
    let x12E0FFFD = v128_bitselect(x3AF06A95, a5, x16E94A97);
    let x942D9A67 = v128_bitselect(x353A9A65, x86CD4C9B, x12E0FFFD);
    let x0 = v128_bitselect(x942D9A67, xCAC5659A, a6);
    l[INVERSE_STRAIGHT_TABLE[20]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[20]], x0);

    let x142956AB = v128_bitselect(x942D9A67, x353A659A, a2);
    let x455D45DF = v128_bitselect(x86CD4C9B, a1, x142956AB);
    let x1C3EE619 = v128_xor(x5963A3C6, x455D45DF);
    let x3 = v128_bitselect(x1C3EE619, x5963A3C6, a6);
    l[INVERSE_STRAIGHT_TABLE[23]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[23]], x3);

    let x2AEA70D5 = v128_bitselect(x606F30CF, x3AF06A95, x353A9A65);
    let x20CF7A9F = v128_bitselect(x05CF0A9F, x2AEA70D5, x0A3F0A6F);
    let x3CF19C86 = v128_xor(x1C3EE619, x20CF7A9F);
    let x69A49C79 = v128_xor(x555500FF, x3CF19C86);

    let x840DBB67 = v128_bitselect(x942D9A67, a5, x86CD4C9B);
    let x6DA19C1E = v128_bitselect(x3CF19C86, x69A49C79, x840DBB67);
    let x925E63E1 = v128_not(x6DA19C1E);
    let x1 = v128_bitselect(x69A49C79, x925E63E1, a6);
    l[INVERSE_STRAIGHT_TABLE[21]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[21]], x1);

    let x9C3CA761 = v128_bitselect(x1C3EE619, x840DBB67, x3CF19C86);
    let x257A75D5 = v128_bitselect(x2AEA70D5, x455D45DF, x606F30CF);
    let xB946D2B4 = v128_xor(x9C3CA761, x257A75D5);
    let x2 = v128_bitselect(xB946D2B4, x16E94A97, a6);
    l[INVERSE_STRAIGHT_TABLE[22]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[22]], x2);
}

#[target_feature(enable = "simd128")]
pub fn s7(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x44447777 = v128_bitselect(a6, a2, a3);
    let x4B4B7878 = v128_xor(a4, x44447777);
    let x22772277 = v128_bitselect(a5, a3, a2);
    let x0505F5F5 = v128_bitselect(a2, a6, a4);
    let x220522F5 = v128_bitselect(x0505F5F5, x22772277, a5);
    let x694E5A8D = v128_xor(x4B4B7878, x220522F5);

    let x00FFFF00 = v128_xor(a5, a6);
    let x66666666 = v128_xor(a2, a3);
    let x32353235 = v128_bitselect(x220522F5, a3, a4);
    let x26253636 = v128_bitselect(x32353235, x66666666, x4B4B7878);
    let x26DAC936 = v128_xor(x00FFFF00, x26253636);
    let x0 = v128_bitselect(x694E5A8D, x26DAC936, a1);
    l[INVERSE_STRAIGHT_TABLE[24]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[24]], x0);

    let x738F9C63 = v128_xor(a2, x26DAC936);
    let x11EF9867 = v128_bitselect(a5, x738F9C63, x66666666);
    let x26DA9867 = v128_bitselect(x11EF9867, x26DAC936, a6);

    let x4B4B9C63 = v128_bitselect(x738F9C63, x4B4B7878, a6);
    let x4B666663 = v128_bitselect(x66666666, x4B4B9C63, x00FFFF00);
    let x4E639396 = v128_xor(x0505F5F5, x4B666663);

    let x4E4B393C = v128_bitselect(x4E639396, x4B4B7878, a2);
    let xFF00FF00 = v128_not(a5);
    let xFF05DD21 = v128_bitselect(x738F9C63, xFF00FF00, x32353235);
    let xB14EE41D = v128_xor(x4E4B393C, xFF05DD21);
    let x1 = v128_bitselect(x26DA9867, xB14EE41D, a1);
    l[INVERSE_STRAIGHT_TABLE[25]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[25]], x1);

    let xD728827B = v128_xor(x66666666, xB14EE41D);
    let x6698807B = v128_bitselect(xD728827B, x26DA9867, x4E4B393C);
    let x699C585B = v128_bitselect(x694E5A8D, x6698807B, xFF05DD21);
    let x2 = v128_bitselect(x4E639396, x699C585B, a1);
    l[INVERSE_STRAIGHT_TABLE[26]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[26]], x2);

    let x738C847B = v128_bitselect(xD728827B, x738F9C63, x4B4B7878);
    let xA4A71E18 = v128_xor(x738F9C63, xD728827B);
    let x74878E78 = v128_bitselect(xA4A71E18, x738C847B, a4);

    let x333D9639 = v128_bitselect(x738C847B, x32353235, xB14EE41D);
    let x74879639 = v128_bitselect(x333D9639, x74878E78, a6);
    let x8B7869C6 = v128_not(x74879639);
    let x3 = v128_bitselect(x8B7869C6, x74878E78, a1);
    l[INVERSE_STRAIGHT_TABLE[27]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[27]], x3);
}

#[target_feature(enable = "simd128")]
pub fn s8(a1: v128, a2: v128, a3: v128, a4: v128, a5: v128, a6: v128, l: &mut [v128; 32]) {
    let x0505F5F5 = v128_bitselect(a1, a5, a3);
    let x05FAF50A = v128_xor(a4, x0505F5F5);
    let x0F0F00FF = v128_bitselect(a4, a3, a5);
    let x22227777 = v128_bitselect(a5, a2, a1);
    let x07DA807F = v128_bitselect(x0F0F00FF, x05FAF50A, x22227777);
    let x34E9B34C = v128_xor(a2, x07DA807F);

    let x00FFF00F = v128_bitselect(a4, x05FAF50A, a3);
    let x0033FCCF = v128_bitselect(x00FFF00F, a5, a2);
    let x5565B15C = v128_bitselect(x34E9B34C, a1, x0033FCCF);
    let x0C0C3F3F = v128_bitselect(a5, a3, a2);
    let x59698E63 = v128_xor(x5565B15C, x0C0C3F3F);

    let x3001F74E = v128_bitselect(a5, x34E9B34C, x05FAF50A);
    let x30555745 = v128_bitselect(a1, x3001F74E, x00FFF00F);
    let x693CD926 = v128_xor(x59698E63, x30555745);
    let x2 = v128_bitselect(x59698E63, x693CD926, a6);
    l[INVERSE_STRAIGHT_TABLE[30]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[30]], x2);

    let x0C0CD926 = v128_bitselect(x693CD926, x0C0C3F3F, a5);
    let x0C3F25E9 = v128_xor(x0033FCCF, x0C0CD926);
    let x38D696A5 = v128_xor(x34E9B34C, x0C3F25E9);

    let xC729695A = v128_not(x38D696A5);

    let x03D2117B = v128_bitselect(a2, x07DA807F, x0C0CD926);
    let xC778395B = v128_bitselect(x03D2117B, xC729695A, x30555745);
    let xCB471CB2 = v128_xor(x0C3F25E9, xC778395B);
    let x1 = v128_bitselect(x34E9B34C, xCB471CB2, a6);
    l[INVERSE_STRAIGHT_TABLE[29]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[29]], x1);

    let x5425B13F = v128_bitselect(x0C0C3F3F, x5565B15C, x03D2117B);
    let x56B3803F = v128_bitselect(x5425B13F, x07DA807F, x59698E63);
    let x919AE965 = v128_xor(xC729695A, x56B3803F);
    let x3 = v128_bitselect(x919AE965, xC729695A, a6);
    l[INVERSE_STRAIGHT_TABLE[31]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[31]], x3);

    let x03DA807F = v128_bitselect(x07DA807F, x03D2117B, x693CD926);
    let x613CD515 = v128_bitselect(x693CD926, a1, x34E9B34C);
    let x62E6556A = v128_xor(x03DA807F, x613CD515);
    let xA59E6C31 = v128_xor(xC778395B, x62E6556A);
    let x0 = v128_bitselect(x38D696A5, xA59E6C31, a6);
    l[INVERSE_STRAIGHT_TABLE[28]] = v128_xor(l[INVERSE_STRAIGHT_TABLE[28]], x0);
}
