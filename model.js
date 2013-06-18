window.kng = window.kng || {}; // kangaroo namespace

kng.createModel = function(data, obj) {
    var old;
    var self = function(a) {
        if (!a)
            return data;
        if (a==-1 || a=='old')
            return old;            
        return future;
    };

    self.update = function() {
        old = data;
        data = future;
        future = _.clone(data);
    }
    
    var future = _.clone(data);    
    self.update();
    
    old = {};//data;//!!! should'n we write old = _.clone(data)  ?
    
    self.obj = obj;
    return self;    
}
