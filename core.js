window.requestAnimationFrame = window['requestAnimationFrame'] || window['mozRequestAnimationFrame'] || 
window.oRequestAnimationFrame || function(callback) {
    setTimeout(callback, 16);
};  

window.kng = window.kng || {}; // kangaroo namespace

_.extend(kng, {
    reset: function() {
        this.types = {};
    },
        
    utils: {
        getOrCreate: function (obj, key, def) {
            return obj[key] || (obj[key] = def);    
        }
    },

    GRAVITY: 0.1,
    input: {},    
    modules: {},
    types: {},
    env: {},
    system: {}
});


// ---- game objects ----


// define type 
kng.define = function(name, definition, ancestor) {    
    ancestor = kng.types[ancestor] || {};
    
    var type = {};
    
    type.events = _.extend(_.clone(ancestor.events || {}), definition.events || {});
    type.model = _.extend(_.clone(ancestor.model || {}), definition.model || {});    
    type.plugins = (ancestor.plugins || []).concat(definition.plugins || []);
    
    //!!!TODO: test this features (inheritance of states)
    type.states = _.extend(_.clone(ancestor.states || {}), definition.states || {});
    
    type.plugins = type.plugins.filter(function(elem, index, arr) {
        return arr.lastIndexOf(elem) === index;
    });
    
    if (name) {
        type.name = name;
        kng.types[name] = type;        
    }           

    return type;        
}

// create object of type 'name'
kng.create = function(name, properties, scene) {
    var obj = new kng.Obj(kng.define('', properties || {}, name));
    obj.scene = scene;
    return obj;
}

// constructor of Obj - don't call directly
kng.Obj = function(attrs) { 
    var self = this;     
    _.extend(this, attrs);    
    this.plugins.data = []; 
    this.options = this.options || {};    
    if (!this.options.linkModel) //!!!TODO: test this feature
        this.model = kng.createModel(this.model, this);

    this.$do = function(func) {
        var $do = function(msg) {
           if (msg.to == 'scene') {
                msg.to = self.scene;
           }
           func(msg);
           return this;
        };
        
        $do.send = $do; ///!!TODO: test this feature        
        /*$do.create = function(obj) {
            var msg = {to:'scene', name:'create', obj:obj};
            func(msg);
        }*/

        $do.create = function(name, model) {
            var msg = {to:'scene', name:'create', obj:{
                name:name,
                model:model
            }};
            func(msg);
            return this;            
        }
        $do.killYourself = function() {
            func({to:self, name:'kill'});
            return this;
        }
        $do.points = function(amount) {
            func({to:'game', name:'points', points:amount});
            return this;
        }
        
        
        return $do;
    }

    
    this.send('init');
    //!!! ^ przy usuwaniu/dodawaniu pluginow trzeba bedzie jednoczesnie uaktualniac tablice danych
    
    
}


kng.Obj.prototype = {   
    send: function (msg, sendFunc) {
        var self = this;
            
        var msgName = msg.name || msg;
        var model = this.model;
        var plugins = this.plugins;
        var state = this.states && this.states[model().state];

        var $do = this.$do(sendFunc);
        function _call(obj, index, list) {
            var handler = obj[msgName] || (obj.events && obj.events[msgName]);
            var data = !list? null : kng.utils.getOrCreate(list.data, index, {});
            if (handler)
                handler.call(self, model, data, $do, msg);
        }       
        
       
        this.plugins.forEach(_call);
        _call(this);      
        if (state) _call(state);                              
    }
};


// ---------------------------


//TODO: remove test values for x, y, w, h
// w and h should be correct width/height of the object (taken from sprite width/height))   
kng.init = function() {

    kng.defineTypes(kng);
    
}

