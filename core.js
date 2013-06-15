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
kng.create = function(name, properties) {
    var obj = new kng.Obj(kng.define('', properties || {}, name));
    return obj;
}

// constructor of Obj - don't call directly
kng.Obj = function(attrs) {      
    _.extend(this, attrs);    
    this.plugins.data = []; 
    this.model = kng.createModel(this.model, this);
    
    this.send('init');
    //!!! ^ przy usuwaniu/dodawaniu pluginow trzeba bedzie jednoczesnie uaktualniac tablice danych
}


kng.Obj.prototype = {   
    send: function (msg, lets) {
        var msgName = msg.name || msg;
        var model = this.model;
        var plugins = this.plugins;
        function _call(obj, index, list) {
            var handler = obj.events[msgName];
            var data = !list? null : kng.utils.getOrCreate(list.data, index, {});
            if (handler)
                handler(model, data, lets, msg);
        }       
        
       
        this.plugins.forEach(_call);
        _call(this);                                    
    }
};


// ---------------------------


//TODO: remove test values for x, y, w, h
// w and h should be correct width/height of the object (taken from sprite width/height))   
kng.init = function() {
    kng.define('spr', {
        model: {
          x: 400, y:100, vx:0,  vy:0, w:50, h:50,  opacity:1 , /*targetx:100, targety:100,*/
          gravity: 1
        }, plugins: [kng.PhysicsPlugin, kng.TargetPlugin],
        events: {            
            update: function(model) {
                model.update();
            },
            kill: function(model, plugin, send) {
                model(1).dead = true;              
                send({to:'world', name:'destroy', obj:model.obj});
            }
        }
    });
    
}

