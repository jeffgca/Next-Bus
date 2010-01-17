/**
 * namespace nextbus_ui
 */

if(typeof(nextbus_ui) == 'undefined') {
    var nextbus_ui = {};
}

(function() {
    
this.init = function() {
    $('#bus-data').hide();
    $('#stop_container').hide();
    $('#submit_btn').click(function() {
        var stop_number = $('#stop_number').val();
        nextBus.getBustimes(base_url);
    });
    
}
    
}).apply(nextbus_ui);