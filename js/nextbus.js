/**
 * namespace nextbus
 */

if(typeof(nextbus) == 'undefined') {
    var nextbus = {};
}

(function() {
    
    this.base_url = false;
    
    this.get_bustimes = function() {
        var stop_number = $('#stop_number').val();
        if (stop_number == '' || parseInt(stop_number) == NaN) {
            alert('no stop number?');
            return;
        }
        $('#error-box').hide();
        $('#submit_btn').attr('disabled', true);
        

        this.get(stop_number);
    }

    this.get = function(stop_number) {
        $('#bus-data').hide().html('');
        $('#stop_container').hide();
        $('#stop_name').html('');
        var uri = window.nextbus_base_url + 'server.php?stop=' + stop_number;
        $.getJSON(uri, {}, function(data) {
			if (data.error) {
				nextbus.ui.flash(data.error);
			}
			else {
	            nextbus.history.save(data.stop_info);
	            nextbus.ui.show_results(data);				
			}

        });
    }

}).apply(nextbus);

/**
 * namespace nextbus.history
 */

if(typeof(nextbus.history) == 'undefined') {
    nextbus.history = {};
}

(function() {
    /* data in the cookie is stored as JSON */
    
    this.cookie_name = "NEXTBUS_HIST";
    
    /**
     * intialize the history object copy in the
     */
    
    this.init = function() {
        window.nextbus_history = {}
        this.load();
    }

    /**
     * save a stop hash record into the window
     */
    
    this.save = function(stop) {
        history_length = this.get_stop_numbers().length;
        if (history_length > 0) {
            if (typeof(window.nextbus_history[stop[0]]) == 'undefined') {
                window.nextbus_history[stop[0]] = stop[1];
            }
        } else {
            window.nextbus_history[stop[0]] = stop[1];
        }
        _save_cookie(window.nextbus_history);
		nextbus.ui.fill_history();
    }

    this.load = function() {
        var str_cookie_data = $.cookie(this.cookie_name);
		var cookie_data;
		if (str_cookie_data) {
			cookie_data = $.evalJSON(str_cookie_data);
		}
        if (cookie_data) {
            window.nextbus_history = cookie_data;    
        }
    }
    
    function _save_cookie(data) {
		var d = new Date(2014);
        var str_data = $.toJSON(data);
        $.cookie(nextbus.history.cookie_name, 
				 str_data,
				 {path: '/', expires: d}
		);
    }
    
    this.get_stop_numbers = function() {
        var stops = [];
        for (i in window.nextbus_history) {
            stops.push(i);
        }
        return stops;
    }

}).apply(nextbus.history);
