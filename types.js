kng.defineTypes = function(kng) {
    kng.define('spr', {
        model: {
          x: 400, y:100, vx:0,  vy:0, w:50, h:50,  opacity:1 , /*targetx:100, targety:100,*/
          gravity: 1, collidable: true
        }, plugins: [kng.PhysicsPlugin, kng.TargetPlugin],
        events: {            
            update: function(model) {
                model.update();
            },
            kill: function(model, plugin, send) {
                model(1).dead = true;              
                send({to:'scene', name:'destroy', obj:model.obj});
            }
        }
    });


    kng.define('UnderscoreTemplate', {
        model: {
            template: '',
            text: ''
        },
        events: {
            move: function(model) {         
                model(1).text = _.template(model().template)(model());
            }
        }
    },'spr');
    
    

    kng.define('scene',{
            events: {
                init: function(model, plugin, aaa, msg) {
                    this.observers = [];

                    if (model().physics) {
                        this.physics = model().physics;//
                        this.send({name:'addObserver', observer:this.physics});                    
                    }

                },
                
                addObserver: function(model, plugin, aaa, msg) {
                    this.observers.push(msg.observer);
                },
                
                create: function(model, plugin, aaa, msg) {
                    var obj = kng.create(msg.obj.name, msg.obj, this);
                    this.observers.forEach(function(observer) {
                        observer.add(obj.model);
                    });                
                },
                
                destroy: function(model, plugin, aaa, msg) {                
                    var objModel = msg.obj.model;
                    this.observers.forEach(function(observer) {
                        observer.remove(objModel);
                    });

                },
                
                move: function() {
                    this.physics && this.physics.update();
                }
            }        
    });
    
    
};
