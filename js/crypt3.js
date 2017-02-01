function perturb_expansion(salt)
    {
        for(let n = 0; n < 2; n++)
            {
                c = salt[n].charCodeAt();

                if(c > 'Z'.charCodeAt()) { c -= 6; }
                if(c > '9'.charCodeAt()) { c -= 7; }
                c   -= '.'.charCodeAt();
                
                for(m = 0; m < 6; m++)
                    {
                        /********************************************
                        * Right shift through the first 6 bits of c
                        * and perturb the expansion_table if it's 1
                        ********************************************/
                        if((c >> m) & 01)
                            {
                                var a = 6*n + m;
                                var b = 6*n + m + 24;
                                
                                [expansion_table[a], expansion_table[b]] =
                                [expansion_table[b], expansion_table[a]];
                            }
                    }
            }
    }

var data = new Array(64);
function crypt3(pwd, salt)
    {
        var digest = salt;
        
        //// Pad strings
        
        /**** Use salt to perturb the expansion table ****/
        perturb_expansion(salt);
        
        
        /**** Generate round keys ****/
        pwd = ascii_to_bin_arr(pwd, 1);
        gen_round_keys(pwd);
        
        
        /**** Call cipher 25 times ****/
        data.fill(0);
        for(let n = 0; n < 25; n++) { data = cipher(data, 'encrypt'); }
        
        
        /**** Return expansion table to normal (might be buggy) ****/
        perturb_expansion(salt);
        
        
        /**** Format digest ****/
        for(let n = 0; n < 11; n++)
            {
                var c = 0;
                
                for(m = 0; m < 6; m++)
                    {
                        c <<= 1;
                        c |= data[6*n + m];
                    }

                c   += '.'.charCodeAt();
                if(c > '9'.charCodeAt()) { c += 7; }
                if(c > 'Z'.charCodeAt()) { c += 6; }

                digest += String.fromCharCode(c);
            }

        //digest[13] = "\0";
        //if(digest[1] == "\0") { digest[1] = digest[0]; }
        
        
        return digest;
    }

crypt3('abcdefgh', 'ab');