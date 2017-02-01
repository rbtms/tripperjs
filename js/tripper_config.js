/**** Global variables ****/

var default_to  = 10;
var trips_found = 0;
var tps         = {};
var pool        = {};
var log         = {};
var thread_n    = 0;



/**** Functions ****/

function add_search_table(target, id)
    {
        var table =
              '<br><br>'
            + '<center><table class="search_table search_table_'+id+' search_screen">'
            + '    <tr class="search_tr">'
            + '        <th class="search_th">Target</th>'
            + '        <th class="search_th">Found</th>'
            + '        <th class="search_th pwd_cell">Password</th>'
            + '        <th class="search_th trip_cell">Tripcode</th>'
            + '        <th class="search_th">Timeout</th>'
            + '        <th class="search_th pause_cell">Pause</th>'
            + '        <th class="search_th remove_cell">Remove</th>'
            + '    </tr>'
            + '    <tr class="search_tr">'
            + '        <td class="search_td"><text id="target_'            +id+'">'+target+'</text></td>'
            + '        <td class="search_td"><text id="found_'             +id+'">0</text></td>'
            + '        <td class="search_td pwd_cell"><text id="pwd_'      +id+'">0</text></td>'
            + '        <td class="search_td trip_cell"><text id="trip_'    +id+'">0</text></td>'
            + '        <td class="search_td">'
            + '            <input type="text" value="10" class="timeout_input" id="to_'          +id+'"></text>'
            + '        </td>'
            + '        <td class="search_td pause_cell"><text id="pause_'  +id+'">0</text></td>'
            + '        <td class="search_td remove_cell"><text id="remove_'+id+'">0</text></td>'
            + '    </tr>'
            + '</table></center>';

        $('body').append(table);
        
        $('.timeout_input').keypress( function(e)
            {
                if(e.which == 13)
                    {
                        e.preventDefault();

                        var timeout = e.target.value;
                        if(timeout == 0) { return; } ////
                        
                        var id = e.target.id.substr(3);
                    
                        pool[id].postMessage
                            ({
                                'type'   : 'timeout',
                                'timeout': timeout
                            });
                    }
            });
    }

function log_trip(target, pwd, trip)
    {
        log[target].push([pwd, trip]);
                
        var pwd_trip =
            '<tr>'
          +     '<td>'+pwd+'</td>'
          +     '<td>'+trip+'</td>'
          + '</tr>';

        $('#'+target).append(pwd_trip);
    }

function init_worker(target, id)
    {                        
        var worker = new Worker('js/tripper.js');
        worker.onmessage = on_worker_msg;
        
        pool[id] = worker;
        
        var target_regex = new RegExp(target, 'i');
        log[target] = [];
                    
        
        worker.postMessage
            ({
                'type'        : 'init',
                'id'          : id,
                'target'      : target,
                'target_regex': target_regex,
                'timeout'     : default_to
            });

        
        var target_tag =
            '<center>'  
          + '<table id='+target+' class="log_table">'
          +     '<tr>'
          +         '<th>Password</th>'
          +         '<th>Tripcode</th>'
          +     '</tr>'
          + '</table>'
          + '</center>';
        
        $('#log_div').append(target_tag);
    }

function on_worker_msg(e)
    {
        var id = e.data.id;
        
        if(e.data.type == 'found')
            {
                $('#target_'+id)[0].textContent = e.data.target;
                $('#found_'+id)[0].textContent  = e.data.found;
                $('#pwd_'+id)[0].textContent    = e.data.pwd;
                $('#trip_'+id)[0].textContent   = e.data.trip;
              //$('#tps_n')[0].textContent      = e.data.tps;
              
                trips_found++;
                $('#found_n')[0].textContent = trips_found;
                
                
                log_trip(e.data.target, e.data.pwd, e.data.trip);
                
                //console.log(trip_log);
            }
        else if(e.data.type == 'tps')
            {
                tps[e.data.id] = e.data.tps;
                
                var tps_n = 0;
                for(var n in tps) { tps_n += tps[n]; }
                
                $('#tps_n')[0].textContent = tps_n+' trips/s';
            }
    }

/**** Execute ****/

/*********************
* Initialize worker
*********************/            
window.onload = function()
{
    thread_n = window.navigator.hardwareConcurrency || ':(';
    
    /***********************************
    * Set text elements default value
    ***********************************/
    $('#target').val('Enter search here');
    $('#search_n')[0].textContent = '0/'+thread_n;
    
    
    /******************************************
    * Set text input worker message handlers
    ******************************************/
    $('#target').keypress( function(e)
        {
            if(e.which == 13)
                {
                    e.preventDefault();
        
                    var target = $('#target').val();
                    var id     = Object.keys(pool).length;
                    
                    init_worker(target, id);
                    
                    add_search_table(target, id);
                    
                    $('#search_n')[0].textContent = (id+1)+'/'+thread_n;
                }
        });

    /***************************
    * Set trip_log click event
    ***************************/
    $('#trip_log').click( function(e)
        {
            $('.search_screen').toggle();
            $('.log_screen').toggle();
            
            //if($('.log_screen').is(':visible'))
            //    {
            //        format_second_screen(); //// if search screen is not hidden
            //    }
            
        });
};