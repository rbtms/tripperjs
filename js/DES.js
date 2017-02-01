// DES.js

/*************
* Constants
*************/

const ROUND_N = 16;


/*********************
* Global variables
*********************/

var initial_table =
    [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ];

var final_table =
    [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41,  9, 49, 17, 57, 25
    ];


var expansion_table =
    [
         32,  1,  2,  3,  4,  5,
          4,  5,  6,  7,  8,  9,
          8,  9, 10, 11, 12, 13,
         12, 13, 14, 15, 16, 17,
         16, 17, 18, 19, 20, 21,
         20, 21, 22, 23, 24, 25,
         24, 25, 26, 27, 28, 29,
         28, 29, 30, 31, 32,  1
    ];

var parity_drop_table =
    [
        57, 49, 41, 33, 25, 17,  9,  1,
        58, 50, 42, 34, 26, 18, 10,  2,
        59, 51, 43, 35, 27, 19, 11,  3,
        60, 52, 44, 36, 63, 55, 47, 39,
        31, 23, 15,  7, 62, 54, 46, 38,
        30, 22, 14,  6, 61, 53, 45, 37,
        29, 21, 13,  5, 28, 20, 12,  4
    ];

var compression_table =
    [
        14, 17, 11, 24,  1,  5,  3, 28,
        15,  6, 21, 10, 23, 19, 12,  4,
        26,  8, 16,  7, 27, 20, 13,  2,
        41, 52, 31, 37, 47, 55, 30, 40,
        51, 45, 33, 48, 44, 49, 39, 56,
        34, 53, 46, 42, 50, 36, 29, 32
    ];

var straight_table =
    [
        16,  7, 20, 21, 29, 12, 28, 17,
         1, 15, 23, 26,  5, 18, 31, 10,
         2,  8, 24, 14, 32, 27,  3,  9,
        19, 13, 30,  6, 22, 11,  4, 25
    ];

var s_box_table =
    [
        /**** s-box 0 ****/
        [
            [14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7],
            [ 0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8],
            [ 4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0],
            [15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13]
        ],
        
        /**** s-box 1 *****/
        [
            [15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10],
            [ 3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5],
            [ 0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15],
            [13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9]
        ],

        /**** s-box 2 ****/
        [
            [10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8],
            [13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1],
            [13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7],
            [ 1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12]
        ],
        
        /**** s-box 3 ****/
        [
            [ 7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15],
            [13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9],
            [10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4],
            [ 3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14]
        ],
        
        /**** s-box 4 ****/
        [
            [ 2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9],
            [14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6],
            [ 4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14],
            [11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3]
        ],
        
        /**** s-box 5 ****/
        [
            [12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11],
            [10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8],
            [ 9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6],
            [ 4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13]
        ],
        
        /**** s-box 6 ****/
        [
            [ 4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1],
            [13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6],
            [ 1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2],
            [ 6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12]
        ],
        
        /**** s-box 7 ****/
        [
            [13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7],
            [ 1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2],
            [ 7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8],
            [ 2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11]
        ]
    ];

var shift_table = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];


//---- Functions ---------------------------------------------------------------------------------------------------

/***********************************
* Description :
* Takes       :
* Returns     :
* Notes       :
* TODO        :
***********************************/
function bin_arr_to_ascii(bin)
    {
        var ascii = '';
        
        for(let n = 0; n < bin.length; n += 8)
            {
                var c = (bin[n]   << 7)
                      + (bin[n+1] << 6)
                      + (bin[n+2] << 5)
                      + (bin[n+3] << 4)
                      + (bin[n+4] << 3)
                      + (bin[n+5] << 2)
                      + (bin[n+6] << 1)
                      + (bin[n+7] << 0);
                
                ascii += String.fromCharCode(c);
            }

        return ascii;
    }

function bin_arr_to_hex(bin)
    {
        var hex_str = '';
        for(let n = 0; n < bin.length; n += 8)
            {
                var hex = parseInt( bin.slice(n, n+8).join(''), 2 ).toString(16);
                if(hex.length == 1) { hex = '0'+hex; }
                
                hex_str += hex;
            }

        return hex_str;
    }

function hex_to_bin_arr(hex_str, pad, dir)
    {
        var bin_str = [];
        for(let n = 0; n < hex_str.length; n += 2)
            {
                var hex = hex_str[n]+hex_str[n+1];
                var bin = parseInt(hex, 16).toString(2);
                
                if(dir == 0) { while(bin.length % pad != 0) { bin = '0'+bin; } }
                else         { while(bin.length % pad != 0) { bin = bin+'0'; } }
                
                bin_str += bin;
            }

        return bin_str.split('');
    }

function dec_to_bin_arr(dec)
    {
        var bin = dec.toString(2);
        
        while(bin.length % 8 != 0) { bin = '0'+bin; }
        
        return bin.split('').map(function(n){return parseInt(n);});
    }

function ascii_to_bin_arr(str, dir)
    {
        var bin = new Array(64).fill(0);
        
        for(let n = 0; n < 8; n++)
            {
                var c = str[n].charCodeAt();
                
                /** Left padding **/
                if(dir == 0)
                    {
                        for(let m = 0; m < 8; m++)
                            {
                                bin[n*8 + m] = ( c >> (7-m) ) & 1;
                            }
                    }
                
                /** Right padding **/
                else
                    {
                        var pad = c < 64 ? 2 : 1;
                        
                        for(let m = 0; m < 8-pad; m++)
                            {
                                bin[n*8 + m] = (c >> (7-pad-m)) & 1;
                            }
                    }
            }

        return bin;
    }


function xor_array(a, b)
    {
        if(a.size != b.size) { throw 'Error: arrays are not the same size'; }
        
        for(let n = 0; n < a.length; n++) { a[n] ^= b[n]; }
    }


var K = new Array(16);
for(let n = 0; n < 16; n++) { K[n] = new Array(48).fill(0); }

var key_L = new Array(28).fill(0);
var key_R = new Array(28).fill(0);
function gen_round_keys(key)
    {
        /***********************************************************************
        * Apply parity drop permutation and separate into left and right parts
        ***********************************************************************/
        for(let n = 0; n < 28; n++) { key_L[n] = key[parity_drop_table[n]-1];    }
        for(let n = 0; n < 28; n++) { key_R[n] = key[parity_drop_table[n+28]-1]; }
        
        
        for(let n = 0; n < ROUND_N; n++)
            {
                /************************************************
                * Circular left shift (1, 2, 9, 16: 1; rest: 2)
                ************************************************/
                for(let m = 0; m < shift_table[n]; m++)
                    {
                        key_L.push(key_L.shift());
                        key_R.push(key_R.shift());
                    }
                
                
                /********************************
                * Apply compression permutation
                *********************************/
                for(let m = 0; m < 48; m++)
                    {
                        var value = compression_table[m]-1;
                        K[n][m] = value < 28 ? key_L[value] : key_R[value-28];
                    }
            }
    }

var S_output = new Array(32).fill(0);
function s_box(input)
    {
        for(let n = 0, pos = 0; n < 8; pos += 6, n++)
            {
                /*********************************
                * Convert from binary to decimal
                *********************************/
                var row = (input[pos+4] << 0) + (input[pos+3] << 1) + (input[pos+2] << 2)  + (input[pos+1] << 3);
                var col = (input[pos]   << 1) + (input[pos+5] << 0);
                
                
                /*******************************
                * Get decimal value from s-box
                *******************************/
                var dec = s_box_table[n][col][row];
                
                
                /*********************
                * Convert dec to bin
                *********************/
                for(let m = 0; m < 4; m++) { S_output[n*4 + m] = ( dec >> (3-m) ) & 1; }
            }

        return S_output;
    }

var des_R      = new Array(48).fill(0);
var des_output = new Array(32).fill(0);
function DES(R, k)
    {
        /******************************
        * Apply expansion permutation
        ******************************/
        for(let n = 0; n < 48; n++) { des_R[n] = R[expansion_table[n]-1]; }
        
        xor_array(des_R, k);        
        des_R = s_box(des_R);
        
        /*****************************
        * Apply straight permutation
        *****************************/
        for(let n = 0; n < 32; n++) { des_output[n] = des_R[straight_table[n]-1]; }
        
        
        return des_output;
    }

var initial       = new Array(64).fill(0);
var L             = new Array(32).fill(0);
var R             = new Array(32).fill(0);
function cipher(data, mode)
    {
        /*******************************************************************
        * Apply initial permutation and separate into left and right parts
        *******************************************************************/
        for(let n = 0; n < 32; n++) { L[n] = data[initial_table[n]-1];    }
        for(let n = 0; n < 32; n++) { R[n] = data[initial_table[n+32]-1]; }
        
        
        /**********************
        * Round 0 through 16
        **********************/
        for(let n = 0; n < ROUND_N; n++)
            {
                xor_array( L, DES(R, K[n]) );
                
                if(n < ROUND_N-1) { [L, R] = [R, L]; } /** To allow reversing **/
            }

        
        /*********************************************
        * Apply final permutation to data and return
        *********************************************/
        for(let n = 0; n < 64; n++)
            {
                var value = final_table[n]-1;
                data[n] = value < 32 ? L[value] : R[value-32];
            }
        
        
        return data;
    }

function encrypt(data, key, input_t, output_t)
    {
        /**** Convert input ****/
        if( !input_t.match(/bin|ascii|hex/) )
            {
                throw 'Invalid input type: '+input_t+'.';
            }
            
        if(input_t == 'ascii')
            {
                data = ascii_to_bin_arr(data, 0);
                key  = ascii_to_bin_arr(key,  0);
            }
        else if(input_t == 'hex')
            {
                data = hex_to_bin_arr(data, 0);
                key  = hex_to_bin_arr(key,  0);
            }
        
        
        /**** Generate round keys and encrypt ****/
        gen_round_keys(key);
        
        var digest = cipher(data, 'encrypt');
        
        
        /**** Convert output ****/
        return output_t == 'bin'   ? digest                         :
               output_t == 'ascii' ? bin_arr_to_ascii(digest)       :
               output_t == 'b64'   ? btoa(bin_arr_to_ascii(digest)) :
               output_t == 'hex'   ? bin_arr_to_hex(digest)         :
                                     false;
    }

function decrypt(data, key, input_t, output_t)
    {
        /**** Convert input ****/
        if( !input_t.match(/bin|hex|ascii|b64/) )
            {
                throw 'Invalid input type: '+input_t+'.';
            }
        
        if(input_t == 'hex')
            {
                data = hex_to_bin_arr(data, 0);
                key  = hex_to_bin_arr(key,  0);
            }
        else if(input_t == 'ascii')
            {
                data = ascii_to_bin_arr(data, 0);
                key  = ascii_to_bin_arr(key,  0);
            }
        else if(input_t == 'b64')
            {
                data = ascii_to_bin_arr(atob(data), 0);
                key  = ascii_to_bin_arr(atob(key),  0);
            }
        
        
        /*** Generate inverse round keys and decrypt ****/        
        gen_round_keys(key);
        K.reverse();
        
        var decrypt = cipher(data, 'decrypt');
        
        
        /**** Convert output ****/
        return output_t == 'bin'   ? decrypt                   :
               output_t == 'ascii' ? bin_arr_to_ascii(decrypt) :
               output_t == 'hex'   ? bin_arr_to_hex(decrypt)   :
                                     false;
    }