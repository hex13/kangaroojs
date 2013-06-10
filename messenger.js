function Messenger(locateObject) {
    var buffer = [];
    function dispatchOne(msg) {
        var obj = locateObject? locateObject(msg.to) : msg.to;
        if (obj) 
            obj.send(msg, this.send);    
    }
    this.send = function(msg) {
        if (msg.immediate)
            dispatchOne(msg);
        else
            buffer.push(msg);
    }
    this.receive = function() {
        var res = buffer.slice(0);
        buffer.length = 0;
        return res;
    }    
    this.dispatch = function() {
        this.receive().forEach(dispatchOne);
    } 
}
