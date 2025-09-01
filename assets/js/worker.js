//import crypt3 from 'crypt3'
import {crypt3} from './crypt3.js'

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
// TODO: Move to another module
// this.onmessage = function(e)
//     {
//         var type = e.data.type;
//         console.log(type);
        
//         if (type == 'init')
//             {                
//                 this.id           = e.data.id;
//                 this.target_regex = e.data.target_regex;
//                 this.search_id    = e.data.search_id;
//                 this.trip_n       = 0;
//                 this.start_time   = (new Date()).getTime();
                
//                 this.is_stopped = false;
                
//                 this.main();
//             }
//         else if(type == 'toggle')
//             {
//                 this.is_stopped = !this.is_stopped;
                
//                 if(!this.is_stopped) { this.main(); }
//             }
//         else if(type == 'stop')
//             {
//                 this.close();
//             }
//     };


//for(var n = 0; n < 100000; n++) { crypt3('abcdefgh', 'ab'); }
//console.log(crypt3('abcdefgh', 'ab'));
