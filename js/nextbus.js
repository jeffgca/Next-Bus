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
	$('#stop_name').html('');
	$('#search-form').hide();
        $('#bus-data').hide().html('');
        $('#stop_container').hide();
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
    
    /* they history key we're using */
    this.storage_label = 'nextbus_history';
    this.data = [];
    
    this.init = function() {
	var data;
	data = localStorage.getItem(this.storage_label);
	if (!data) {
	    localStorage.setItem(this.storage_label, $.toJSON({}));
	    this.data = {}
	}
	else {
	    this.data = $.evalJSON(data);
	}
    }
    
    this.save = function(stop) {
	try {
	    var history_hash = $.evalJSON(localStorage.getItem(this.storage_label));
	    
	    if (!history_hash) {
		history_hash = {};
	    }
	    
	    history_hash[stop.number] = stop;
	    localStorage.setItem(this.storage_label, $.toJSON(history_hash));
	    return true;
	} catch (e) {
	    return e;
	}
    }

    this.load = function(n) {
	var history_hash = this.loadAll();
	return history_hash[n];
    }
    
    this.loadAll = function() {
	try {
	    var tmp = localStorage.getItem(this.storage_label);
	    console.log(tmp);
	    return $.evalJSON(tmp);
	} catch(e) {
	    return e;
	}
    }
    
    this.get_stop_numbers = function() {
	var history_hash = this.loadAll();
	return _keys(history_hash);
    }
    
    function _keys(o) {
	var i = []
	for (k in o) { i.push(k) }
	return i;
    }

}).apply(nextbus.history);
