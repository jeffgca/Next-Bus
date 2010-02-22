/**
 * namespace nextbus_ui
 */

if(typeof(nextbus) == 'undefined') {
    var nextbus = {};
}

if(typeof(nextbus.ui) == 'undefined') {
    nextbus.ui = {};
}

(function() {
    
    this.init = function() {
        $('#error-box').hide();
        $('#bus-data').hide();
        $('#stop_container').hide();
        $('#submit_btn').click(function() {
            nextbus.get_bustimes();
        });    
    }

    this.show_results = function(data) {
        if (typeof(data.error) == 'undefined') {
            var stop_name = data.stop_info.join(' ');
            $('#stop_name').html(stop_name);
            
            for (i in data.data) {
                var time_str = data.data[i].times.join(' ');
                label = 'Route: ' + data.data[i].routeName + '<br/>Times: ' + time_str;
                $('#bus-data').append('<li>' + label + '</li>');
            }
            $('#stop_container').show();
        }
        else {
            $('#bus-data').html('<li>Error: ' + data.error + '</li>');
        }
        
        $('#submit_btn').attr('disabled', false);
        $('#bus-data').show();
    }
    
    this.show_history = function() {
        var ii = 0;
        var list = window.nextbus_history;
        var str_history = '';
        for (var i in list) {
            var a = '<a href="#search" onclick="nextbus.get('+ i +');">'
                + i + ' ' + list[i] + '</a>';
            var li ='<li>' + a + '</li>';
            str_history += li;
        }
        if (str_history.length > 0) {
            $('#history-list').html('').append(str_history);
        }
    }
    
    this.flash = function(msg) {
        $('#search-toolbar').after('<div class="error">' + msg + '</div>');
        
    }
    
}).apply(nextbus.ui);
