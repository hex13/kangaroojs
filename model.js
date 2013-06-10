window.kng = window.kng || {}; // kangaroo namespace

kng.createModel = function(data, obj) {
    var self = function(a) {
        if (!a)
            return data;
        return future;
    };

    self.update = function() {
        data = future;
        future = _.clone(data);
    }
    
    var future = _.clone(data);    
    self.update();
    
    self.obj = obj;
    return self;    
}
