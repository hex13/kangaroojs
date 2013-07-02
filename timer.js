window.kng = window.kng || {}; // kangaroo namespace

kng.Timer = function(callback, interval) {
    var interval;
    function start() {
        interval = setInterval(callback, interval);        
        return this;
    }
    return {
        stop: function() {
            clearInterval(interval);
            interval = null;
            return this;
        },
        start: start,
        toggle: function() {
            interval? this.stop() : this.start();
            return this;
        }
        
    }
}