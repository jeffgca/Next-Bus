/**
 * namespace nextBus
 */

if(typeof(nextBus) == 'undefined') {
    var nextBus = {};
}

(function() {

this.getBustimes = function(base_url) {
    
    var stop_number = $('#stop_number').val();
    
    if (stop_number == '' || parseInt(stop_number) == NaN) {
        alert('no stop number?');
        return;
    }
    
    $('#submit_btn').attr('disabled', true);
    $('#bus-data').hide().html('');
    $('#stop_container').hide();
    $('#stop_name').html('');
    
    
    uri = base_url + 'server.php?stop=' +  stop_number;
    $.getJSON(uri, {}, function(data) {
        nextBus.insertData(data);
    });
}

this.insertData = function(data) {
    
    if (typeof(data.error) == 'undefined') {
        $('#stop_name').html(data.stop_info.join(' '));
        
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
    

}).apply(nextBus);