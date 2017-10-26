/*********************************************************************************************
* Name         : tripper.js
* Description  : Javascript implementation of 2ch/4chan tripcode generation algorithm
* Author       : Alvaro Fernandez (nishinishi9999)
* Notes        : Based on DES.js and crypt3.js
*
* Version      : 1.0
* License      : GPL 3.0 - https://www.gnu.org/licenses/gpl-3.0.en.html
* See also     : DES.js  - https://github.com/nishinishi9999/DES.js
*
* Github       : https://github.com/nishinishi9999/tripperjs (fork me!)
* Contact mail : nishinishi9999@gmail.com
*********************************************************************************************/

const db = new PouchDB('trip_db');

/**
* Global variables
**/
var found         = { total: 0 };   /* Number of tripcodes found */
var pool          = [];             /* Pool of workers */
var log           = {};             /* Tripcodes found */
var thread_n      = 0;              /* Number of total threads */
var worker_n      = 0;              /* Number of workers */
var last_id       = -1;             /* Id of the last worker */


/**
* Functions
**/

function gen_search_id()
    {
        var A = 'abcdefghijk'.split('');
        return (parseInt(Math.random()*88888888) + 11111111).toString().split('').map( (n) => A[n] ).join('');
    }

function add_search_table(target, search_id)
    {
        $('#search_screen').append
            (
                $( document.createElement('DIV') ).attr('id', 'search_div_'+search_id).addClass('search_div').append
                    (
                        /* - Button */
                        $( document.createElement('SPAN') ).addClass('stop_worker_button').text('-')
                            .on('click', () => stop_worker(search_id)),
                        
                        /* + Button */
                        $( document.createElement('SPAN') ).addClass('add_worker_button').text('+')
                            .on('click', () => add_worker(target, search_id)),
                        
                        /* Thread number */
                        $( document.createElement('SPAN') ).text('Worker: 1/'+thread_n)
                            .attr('id', 'worker_n_'+search_id)
                            .addClass('search_div_worker_n'),
                        
                        /* Pause button */
                        $( document.createElement('SPAN') ).addClass('pause_button').text('Pause')
                            .on( 'click', function()
                                {
                                    pause_search(search_id);
                                    this.textContent = this.textContent == 'Pause' ? 'Resume' : 'Pause'
                                }),
                        
                        /* Stop button */
                        $( document.createElement('SPAN') ).addClass('stop_button').text('Stop')
                            .on( 'click', () => stop_search(search_id) ),
                        
                        
                        /* Search table */
                        $( document.createElement('TABLE') )
                            .addClass('search_table search_screen')
                            .append
                                (
                                    $( document.createElement('TR') )
                                        .addClass('search_tr')
                                        .append
                                            (
                                                $( document.createElement('TH') ).text('Target'),
                                                $( document.createElement('TH') ).text('Found'),
                                                $( document.createElement('TH') ).text('Password'),
                                                $( document.createElement('TH') ).text('Tripcode')
                                            ),
                                    
                                    $(document.createElement('TR'))
                                        .addClass('search_tr')
                                        .append
                                            (
                                                $( document.createElement('TD') ).attr('id', 'target_'+search_id).text(target),
                                                $( document.createElement('TD') ).attr('id', 'found_' +search_id).text(0),
                                                $( document.createElement('TD') ).attr('id', 'pwd_'   +search_id).text(0),
                                                $( document.createElement('TD') ).attr('id', 'trip_'  +search_id).text(0)
                                            )
                                )
                    )
            );
    }

function add_log_screen_div(target, search_id)
    {
        /* Create log screen table */
        $('#log_screen').append
            (
                $( document.createElement('DIV') ).addClass('log_screen_div').append
                    (
                        $( document.createElement('SPAN') ).text(target),
                        $( document.createElement('SPAN') )
                            .addClass('toggle_log_table')
                            .text(' [+]')
                            .on('click', function()
                                {
                                    this.textContent = this.textContent == ' [+]' ? ' [-]' : ' [+]'
                                    $('#log_screen_table_'+search_id).toggle();
                                }),
                        
                        $( document.createElement('TABLE') ).attr('id', 'log_screen_table_'+search_id)
                            .addClass('log_screen_table')
                    )
            );
    }

function highlight_match(regex, text)
    {
        regex = new RegExp( '('+regex.source+')', 'i' );
        console.log()
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

function log_trip(target_regex, search_id, pwd, trip)
    {
        console.log(target_regex, search_id);
        
        /* Add trip to log screen */
        log[search_id].push([pwd, trip]);
                
        $('#log_screen_table_'+search_id).append
            (
                $( document.createElement('TR') ).append
                    (
                        $( document.createElement('TD') ).text(pwd),
                        $( document.createElement('TD') ).html
                            (
                                highlight_match(target_regex, trip)
                            )
                    )
            );
    }

function get_search(search_id)
    {
        return pool.filter( (worker) => worker.search_id == search_id );
    }

function pause_search(search_id)
    {
        var search = get_search(search_id);
        if(search.length == 0) { return; }
        
        for(var i = 0; i < search.length; i++) { search[i]._toggle(); }
    }

function stop_search(search_id)
    {
        var search = get_search(search_id);
        
        for(var i = 0; i < search.length; i++) { search[i]._stop(); }
        
        update_worker_n(worker_n - search.length);
        
        $('#search_div_'+search_id).remove();
    }

function add_worker(target, search_id)
    {
        /* Initialize worker */
        last_id++;
        
        init_worker(target, search_id, last_id);
        
        /* Update worker number */
        var search = get_search(search_id);
        
        $('#worker_n_'+search_id).text('Worker: '+search.length+'/'+thread_n);
        update_worker_n(worker_n+1);
    }

function stop_worker(search_id)
    {
        var search = get_search(search_id);
        if(search.length == 0) { return; }

        /* Stop worker */
        search[search.length-1]._stop();
        
        /* Update worker number */
        $('#worker_n_'+search_id).text('Worker: '+(search.length-1)+'/'+thread_n);
        update_worker_n(worker_n-1);
    }

function on_worker_msg(e)
    {
        var search_id = e.data.search_id;
        
        /* Found a match */
        if(e.data.type == 'found')
            {
                found.total++;
                found[search_id]++;
                
                $('#found_' +search_id).text( found[search_id] );
                $('#pwd_'   +search_id).text( e.data.pwd );
                $('#trip_'  +search_id).text( e.data.trip );
              
                $('#found_n').text(found.total);
                
                
                /* Add to log screen */
                log_trip(e.data.target_regex, e.data.search_id, e.data.pwd, e.data.trip);
                
                /* Add to DB */
                //save_db_doc(e.data.pwd, e.data.trip, e.data.search_id);
            }
        /* Display total tps */
        else if(e.data.type == 'tps')
            {
                pool[e.data.id].tps = e.data.tps;
                update_tps();
            }
    }

function init_worker(target, search_id, id)
    {                        
        /* Initialize worker */
        var worker = new Worker('./assets/js/worker.js');
        
        worker.onmessage = on_worker_msg;
        worker.target    = target;
        worker.search_id = search_id;
        worker.tps       = 0;
        
        worker._toggle = function()
            {
                var that = this;
                
                this.postMessage({ type: 'toggle' });
                
                /* Leave a second to avoid worker updating tps before calling update_tps */
                setTimeout(function() { that.tps = 0; update_tps(); }, 1000);
            };
        
        worker._stop = function()
            {
                var that = this;
                
                this.postMessage({ type: 'stop' });
                this.terminate();

                /* Set worker as terminated */
                this.search_id = 'TERMINATED';
                this.target    = 'TERMINATED';
                
                /* Leave a second to avoid worker updating tps before calling update_tps */
                setTimeout(function() { that.tps = 0; update_tps(); }, 1000);
            };
        
        pool.push(worker);
        
        
        /* Search target regex */
        var target_regex = new RegExp(target, 'i');
        log[search_id] = [];
                    
        
        /* Send message to worker */
        worker.postMessage
            ({
                type         : 'init',
                id           : id,
                target_regex : target_regex,
                search_id    : search_id
            });
    }

function update_worker_n(n)
    {
        worker_n = n < 0 ? 0 : n;
        
        $('#worker_n').text( worker_n + '/' + thread_n );
    }

function update_tps()
    {
        var tps_n = 0;
        
        for(var i = 0; i < pool.length; i++) { tps_n += pool[i].tps; }
        
        $('#tps_n').text(tps_n+' trips/s');
    }

function save_db_doc(pwd, trip, search_id )
    {
        var doc = { _id: pwd, trip: trip, search_id: search_id };
        
        db.put(doc);
    }

function get_db_doc(pwd)
    {
        db.get(pwd).then( (doc) => console.log(doc) );
    }

function get_db_info()
    {
        db.info().then( (info) => console.log(info) );
    }

function get_db_search(search_id)
    {
        db.query( (doc, emit) => emit( doc.search_id), { key: search_id } ).then( function(query)
            {
                var rows = query.rows;
                
                for(var i = 0; i < rows.length; i++)
                    {
                        get_db_doc(rows[i].id);
                    }
            });
    }


/**
* Execute
**/

/*********************
* Initialize worker
*********************/            
window.onload = function()
{
    /* Use hardwareConcurrency to get number of CPU threads */
    thread_n = window.navigator.hardwareConcurrency || ':(';
    
    $('#worker_n').text('0/'+thread_n);
    
    
    /******************************************
    * Set text input worker message handlers
    ******************************************/
    $('#target').on('keypress', function(e)
        {
            if(e.which == 13) /* Enter */
                {
                    var search_id, target, search;
                    
                    /* Get target */
                    target = $('#target').val();
                    
                    
                    /* Don't clear search */
                    e.preventDefault();
                    
                    
                    search = pool.filter( (worker) => worker.target == target );
                    
                    /* Don't add a table if there is already a search in progress */
                    if(search.length == 0)
                        {
                            search_id = gen_search_id();
                            found[search_id] = 0;
                            
                            add_search_table(target, search_id);
                            add_log_screen_div(target, search_id);
                        }
                    else
                        {
                            /* Add worker to search */
                            search_id = search[0].search_id;
                            
                            $('#worker_n_'+search_id).text('Worker: '+(search.length+1)+'/'+thread_n);
                        }
                    
                    last_id++;
                    init_worker(target, search_id, last_id);
                    
                    update_worker_n(worker_n+1);
                }
        });

    
    /********************
    * Toggle log screen
    ********************/
    $('#trip_log').on('click', function()
        {
            $('#search_screen, #log_screen').toggle();
            
            this.textContent = this.textContent == 'Trip log' ? 'Search' : 'Trip log';
        });
};