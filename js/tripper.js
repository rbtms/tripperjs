/*********************************************************************************************
* Name         : tripper.js
* Description  : Javascript implementation of 2ch/4chan tripcode generation algorithm
*
* Version      : 1.0
* License      : GPL 3.0
* Author       : Alvaro Fernandez (nishinishi)
* Contact mail : nishinishi9999@gmail.com
*********************************************************************************************/

/*********************************************************************************************
* Contants (var)
*
*   - Permutation tables
*       - initial_table
*       - initial_table_L
*       - initial_table_R
*       - final_table
*       - parity_drop_table
*       - compression_table
*       - straight_table
*       - inverse_straight_table
*       - s_box_table
*       - shift_table
*       - shift_offset
*
*       - CHAR_CODE_Z
*       - CHAR_CODE_9
*       - CHAR_CODE_DOT
*       - CHAR_LIST_LEN
*       - RAND_CHAR_N
*
*
*
* Global variables
*
*   - Permutation tables
*       - expansion_table
*
*   - Arrays
*       - char_list
*       - parity_drop
*       - K
*       - L
*       - R
*       - data
*       - pwd_bin
*   
*
*
* Functions
*
*   - DES:
*       - gen_round_keys()
*       - cipher()
*
*   - crypt(3):
*       - perturb_expansion()
*       - crypt3()
*
*   - tripper.js:
*       - rand_pwd()
*       - get_salt()
*       - send_tps()
*       - main()
*
*********************************************************************************************/

var char_list =
    (
        'a b c d e f g h i j k l m n o p q r s t u v w x y z '
      + 'A B C E D F G H I J K L M N O P Q R S T U V W X Y Z '
      + '0 1 2 3 4 5 6 7 8 9'
//    + ' . / ! " $ % & ( ) = ? { } [ ]'
    ).split(' ');


/****************************************************************************
* Tables
*
* Note: All tables except s_box_table have all their entries reduced by one
*       to avoid constant substracting operations
*
****************************************************************************/

/***************************
* Initial permutation (IP)
***************************/
var initial_table =
    [
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7,
        56, 48, 40, 32, 24, 16,  8, 0,
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6
    ];


/*************************************
* Left side Initial permutation (IP)
*************************************/
var initial_table_L =
    [
        57, 49, 41, 33, 25, 17,  9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7,
    ];


/*****************************************
* Right side of Initial permutation (IP)
*****************************************/
var initial_table_R =
    [
        56, 48, 40, 32, 24, 16,  8, 0,
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6
    ];


/***************************
* Final permutation (IP-1)
***************************/
var final_table =
    [
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41,  9, 49, 17, 57, 25,
        32, 0, 40,  8, 48, 16, 56, 24
    ];


/***********************************************
* Expansion table (E) used in the DES function
* to expand R from 32 bits to 48
***********************************************/
var expansion_table =
    [
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
var parity_drop_table =
    [
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
var compression_table =
    [
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
var straight_table =
    [
        15,  6, 19, 20, 28, 11, 27, 16,
         0, 14, 22, 25,  4, 17, 30,  9,
         1,  7, 23, 13, 31, 26,  2,  8,
        18, 12, 29,  5, 21, 10,  3, 24
    ];


/****************************************************
* Inverse table of straight_table for speed reasons
****************************************************/
var inverse_straight_table =
    [
         8, 16, 22, 30, 12, 27,  1, 17,
        23, 15, 29,  5, 25, 19,  9,  0,
         7, 13, 24,  2,  3, 28, 10, 18,
        31, 11, 21,  6,  4, 26, 14, 20
    ];


/******************************************
* S-Box tables, the core of the algorithm
******************************************/
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


/********************************************************************
* Number of left shifts to apply in each round key generation round
* and precalculated offset for speed reasons
********************************************************************/
var shift_table  = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var shift_offset = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];



/************
* Functions
************/

/*********
* DES.js
*********/

/************************************************************************************
* Description : gen_round_keys(): Generate 16 48-bit round keys from one 64-bit key
* Takes       : key (arrayref) - 48 bit binary array
* Returns     : nothing
* Sets global : K[0-15]
* Notes       : Nothing
* TODO        : Nothing
************************************************************************************/
var K = new Array(16);
for(var n = 0; n < 16; n++) { K[n] = new Array(48).fill(0); }

var parity_drop = new Array(56).fill(0);

function gen_round_keys(key)
    {
        var n, m;
        var value;
        var offset;

        
        /***********************************************************************
        * Apply parity drop permutation and separate into left and right parts
        ***********************************************************************/
        for(n = 0; n < 56; n++) { parity_drop[n] = key[parity_drop_table[n]]; }
        
        
        /**********************
        * Generate round keys
        **********************/
        for(n = 0; n < 16; n++)
            {
                /****************************************************
                * Circular left shift (1, 2, 9, 16: 1; rest: 2)
                *
                * As it is very costly to shift arrays physically,
                * a logical left shift is done in it place, with an
                * offset representing the 0 index of the left and
                * right arrays.
                ****************************************************/
                offset = shift_offset[n] ;
                
                /********************************
                * Apply compression permutation
                ********************************/
                for(m = 0; m < 48; m++)
                    {
                        value = compression_table[m];
                        
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
var L = new Array(32).fill(0);
var R = new Array(32).fill(0);

function cipher()
    {
        var n, m;
        var k;
        var temp;
        var pos, row, col, dec;
        
        
        /*******************************************************************
        * Apply initial permutation and separate into left and right parts
        *******************************************************************/
        for(n = 0; n < 32; n++) { L[n] = data[initial_table_L[n]]; }
        for(n = 0; n < 32; n++) { R[n] = data[initial_table_R[n]]; }
        
        
        /*********************
        * Round 0 through 16
        *********************/
        for(n = 0; n < 16; n++)
            {
                k = K[n];
        
                /***************************
                * Apply S-Box permutations
                ***************************/
                for(m = 0; m < 8; m++)
                    {
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
                        pos = m*6;
                        
                        row = ( (k[pos+5]^R[expansion_table[pos+5]]) << 0 )
                            + ( (k[pos]  ^R[expansion_table[pos]])   << 1 );
                        
                        col = ( (k[pos+4]^R[expansion_table[pos+4]]) << 0 )
                            + ( (k[pos+3]^R[expansion_table[pos+3]]) << 1 )
                            + ( (k[pos+2]^R[expansion_table[pos+2]]) << 2 )
                            + ( (k[pos+1]^R[expansion_table[pos+1]]) << 3 );
                
                
                        /*******************************
                        * Get decimal value from s-box
                        *******************************/
                        dec = s_box_table[m][row][col];
                        
                
                        /***************************************************************
                        * Convert dec to bin,
                        * apply straight inverse permutation and then xor to L with it
                        *
                        * shortcut for:
                        * for(n = 0; n < 32; n++) { L ^= S_output[straight_table[n]]; }
                        *
                        ****************************************************************/
                        pos = m*4;
                        
                        L[inverse_straight_table[pos]]   ^= (dec >> 3) & 1;
                        L[inverse_straight_table[pos+1]] ^= (dec >> 2) & 1;
                        L[inverse_straight_table[pos+2]] ^= (dec >> 1) & 1;
                        L[inverse_straight_table[pos+3]] ^= (dec >> 0) & 1;
                    }
                
                
                /****************************************************
                * Swap L and R (skip last round to allow reversing)
                *****************************************************/
                if(n != 15)
                    {
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



/************
* crypt3.js
************/

/************************************************************
* Name        : perturb_expansion
* Description : Perturbs expansion table with provided salt
* Takes       : salt (string) - Two character string
* Returns     : Nothing
* Sets global : perturb_expansion(salt)
* Notes       : It is reversible, so if it's called twice
*               it returns to its original state
************************************************************/
var CHAR_CODE_Z   = 90;
var CHAR_CODE_9   = 57;
var CHAR_CODE_DOT = 46;

function perturb_expansion(salt)
    {
        var n, m;
        var a, b;
        var c;
        var temp;
        var row;
        
        for(n = 0; n < 2; n++)
            {
                c = salt[n].charCodeAt();

                if(c > CHAR_CODE_Z) { c -= 6; }
                if(c > CHAR_CODE_9) { c -= 7; }
                c   -= CHAR_CODE_DOT;
                
                row = 6*n;
                for(m = 0; m < 6; m++)
                    {
                        /********************************************
                        * Right shift through the first 6 bits of c
                        * and perturb the expansion_table if it's 1
                        ********************************************/
                        if((c >> m) & 01)
                            {
                                a = row + m;
                                b = row + m + 24;
                                
                                temp               = expansion_table[a];
                                expansion_table[a] = expansion_table[b];
                                expansion_table[b] = temp;
                            }
                    }
            }
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
var data    = new Array(64);
var pwd_bin = new Array(64);

function crypt3(pwd, salt)
    {
        var digest = '';
        var n, m;
        var c;
        var row;
        var pad;
        
        
        /*********************************************************
        * Set the two first characters of the digest to the salt
        *********************************************************/
        digest = salt;        
        
        
        /******************************************
        * Use salt to perturb the expansion table
        ******************************************/
        perturb_expansion(salt);        
        
        
        /******************************
        * Convert pwd to binary array
        ******************************/
        for(n = 0; n < 8; n++)
            {
                c   = pwd[n].charCodeAt();
                row = n*8;                
                        
                for(m = 0; m < 7; m++)
                    {
                        pwd_bin[row + m] = ( c >> (6-m) ) & 1;
                    }
            }
            
        
        /**********************
        * Generate round keys
        **********************/
        gen_round_keys(pwd_bin);
        
        
        /***********************
        * Call cipher 25 times
        ***********************/
        data.fill(0);
        for(n = 0; n < 25; n++) { cipher(); }
        
        
        /****************************************************
        * Return expansion table to normal (might be buggy)
        ****************************************************/
        perturb_expansion(salt);
        
        
        /****************
        * Format digest
        ****************/
        for(n = 0; n < 11; n++)
            {
                row = 6*n;
                c   = 0;
                
                for(m = 0; m < 6; m++)
                    {
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



/**************
* tripper.js
**************/

/**********************************************************************
* Name        : rand_pwd
* Description : Generate RAND_CHAR_N length ascii password for crypt3
* Takes       : Nothing
* Returns     : pwd (string) - 8 bit ascii password
* Notes       : Nothing
* TODO        : Nothing
**********************************************************************/
var CHAR_LIST_LEN = char_list.length;
var RAND_CHAR_N   = 8;

function rand_pwd()
    {
        var pwd = '';
        
        for(var n = 0; n < 8; n++)
            {
                pwd += char_list[ parseInt(Math.random()*CHAR_LIST_LEN) ];
            }

        return pwd;
    }


/***************************************************************************
* Name        : get_salt
* Description : Get salt from 2ch/4chan tripcode salt generation algorithm
* Takes       : key  (string) - Key to apply salt algorithm to
* Returns     : salt (string) - Generated salt
***************************************************************************/
function get_salt(key)
    {
        var salt = (key+'H.')
            .substr(1, 2)
            .replace(/[^\.-z]/, '.')
            .replace(':',  'A')
            .replace(';',  'B')
            .replace('<',  'C')
            .replace('=',  'D')
            .replace('>',  'E')
            .replace('?',  'F')
            .replace('@',  'a')
            .replace('[',  'b')
            .replace('\\', 'c')
            .replace(']',  'd')
            .replace('^',  'e')
            .replace('_',  'f')
            .replace('`',  'g');
        
        return salt;
    }


/*********************************************************
* Name        : main
* Description : Loop over crypt3() with random passwords
*               in order to search for tripcodes
* Takes       : Nothing
* Returns     : Nothing
*********************************************************/
function main()
    {
        var pwd, salt, hash;
        
        for(var n = 0; n < 2000; n++)
            {
                pwd  = rand_pwd();
                salt = get_salt(pwd);
                hash = crypt3(pwd, salt).substr(-10);
        
                //// test
                if( this.target_regex.test(hash) )
                    {
                        this.postMessage
                            ({
                                type         : 'found',
                                id           : this.id,
                                target_regex : this.target_regex,
                                search_id    : this.search_id,
                                pwd          : pwd,
                                trip         : hash,
                                trip_n       : this.trip_n
                            });

                        //console.log({'id': this.id, 'key': pwd, 'salt': salt, 'trip': hash, 'target': this.target});
                    }
        
        
                this.trip_n++;
            }
        
        
        /* Send worker tps */
        send_tps();
        
        if(!this.is_stopped) { setTimeout(main); }
    }

/**************************************************************************
* Name        : send_tps
* Description : Calculate worker trips per second and send to main thread
* Takes       : Nothing
* Returns     : Nothing
**************************************************************************/
function send_tps()
    {
        var time = ( (new Date()).getTime() - this.start_time ) / 1000;
        var tps  = this.trip_n / time;
        
        self.postMessage
            ({
                type      : 'tps',
                id        : this.id,
                tps       : parseInt(tps)
            });
    }


/************
* Execution
************/

/***************************
* Set worker event handler
***************************/
this.onmessage = function(e)
    {
        var type = e.data.type;
        console.log(type);
        
        if (type == 'init')
            {                
                this.id           = e.data.id;
                this.target_regex = e.data.target_regex;
                this.search_id    = e.data.search_id;
                this.trip_n       = 0;
                this.start_time   = (new Date()).getTime();
                
                this.is_stopped = false;
                
                this.main();
            }
        else if(type == 'toggle')
            {
                this.is_stopped = !this.is_stopped;
                
                if(!this.is_stopped) { this.main(); }
            }
        else if(type == 'stop')
            {
                this.close();
            }
    };


//for(var n = 0; n < 100000; n++) { crypt3('abcdefgh', 'ab'); }
//console.log(crypt3('abcdefgh', 'ab'));
