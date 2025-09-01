import {crypt3} from './crypt3.js'

/*****************************************************************
* Name        : rand_pwd
* Description : Generate 8 byte length ascii password for crypt3
* Takes       : Nothing
* Returns     : pwd (string) - 8 bit ascii password
* Notes       : Nothing
* TODO        : Nothing
*****************************************************************/
var char_list =
    (
        'a b c d e f g h i j k l m n o p q r s t u v w x y z '
      + 'A B C E D F G H I J K L M N O P Q R S T U V W X Y Z '
      + '0 1 2 3 4 5 6 7 8 9'
//    + ' . / ! " $ % & ( ) = ? { } [ ]'
    ).split(' ');

var CHAR_LIST_LEN = char_list.length;

export function rand_pwd()
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
export function get_salt(key)
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

/***************************************************************************
* Name        : _get_salt
* Description : Get salt from Durarara tripcode salt generation algorithm
* Takes       : key  (string) - Key to apply salt algorithm to
* Returns     : salt (string) - Generated salt
***************************************************************************/
function _get_salt(key)
    {
        var salt = (key)
            .substr(2, 2)
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

export function run_1000_iterations()
{
    var pwd, salt, hash;
    var iteration_n = 1000;
    
    for(var n = 0; n < iteration_n; n++)
        {
            pwd  = rand_pwd();
            salt = get_salt(pwd);
            hash = crypt3(pwd, salt).substr(-10);
    
        //     //// test
        //     if( this.target_regex.test(hash) )
        //         {
        //             this.postMessage
        //                 ({
        //                     type         : 'found',
        //                     id           : this.id,
        //                     target_regex : this.target_regex,
        //                     search_id    : this.search_id,
        //                     pwd          : pwd,
        //                     trip         : hash,
        //                     trip_n       : this.trip_n
        //                 });

        //             //console.log({'id': this.id, 'key': pwd, 'salt': salt, 'trip': hash, 'target': this.target});
        //         }
    
    
        //     this.trip_n++;
        // }
    
    
    /* Send worker tps */
    //send_tps();
    
    //if(!this.is_stopped) { setTimeout(main); }
}}