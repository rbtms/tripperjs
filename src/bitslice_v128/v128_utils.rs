#![cfg(target_arch = "wasm32")]
#![feature(stdsimd)]
use std::arch::wasm32::*;
use std::mem::MaybeUninit;

/// Utilities for converting between u64 values and WASM v128 vectors.
/// Provides load and extract operations for 64-bit integers to/from v128 registers.

#[target_feature(enable = "simd128")]
pub unsafe fn load_u64_to_v128(x: u64) -> v128 { u64x2_splat(x) }

#[target_feature(enable = "simd128")]
pub unsafe fn extract_v128_to_u64(x: v128) -> u64 { u64x2_extract_lane::<0>(x) }

#[target_feature(enable = "simd128")]
pub unsafe fn load_u64x2_to_v128(lo: u64, hi: u64) -> v128 { u64x2(lo, hi) }

#[target_feature(enable = "simd128")]
pub unsafe fn extract_v128_lane0(x: v128) -> u64 { u64x2_extract_lane::<0>(x) }

#[target_feature(enable = "simd128")]
pub unsafe fn extract_v128_lane1(x: v128) -> u64 { u64x2_extract_lane::<1>(x) }

#[inline]
pub unsafe fn concat_v128_arrays(
    l: &[v128; 32],
    r: &[v128; 32],
) -> [v128; 64] {
    let mut result: [MaybeUninit<v128>; 64] = MaybeUninit::uninit().assume_init();

    for i in 0..32 {
        result[i].as_mut_ptr().write(l[i]);
        result[i + 32].as_mut_ptr().write(r[i]);
    }

    // Transmute to initialized array without copying
    std::mem::transmute::<_, [v128; 64]>(result)
}