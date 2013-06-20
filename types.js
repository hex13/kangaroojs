kng.defineTypes = function(kng) {
    kng.define('visual', {
        model: {
          x: 400, y:100, vx:0,  vy:0, w:60, h:60,  /*targetx:100, targety:100,*/
          rotation:0,
          gravity: 0, collidable: false, shape:'rect',
        }, plugins: [kng.TargetPlugin],
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
    
    kng.define('spr', {
        model: {
            gravity: 1, collidable: true
        }

    },'visual');


    kng.define('UnderscoreTemplate', {
        model: {
            template: '',
            text: ''
        },
        events: {
            move: function(model) {         
                var text = _.template(model().template)(model());
                model(1).text = text;
            }
        }
    },'visual');
    
    

    kng.define('scene',{
            events: {
                init: function(model, plugin, aaa, msg) {
                    this.observers = [];

                    if (model().physics) {
                        this.physics = model().physics;//
                        this.send({name:'addObserver', observer:this.physics});                    
                    }

                    this.color = ['red','green','blue','yellow','orange'][_.random(4)];//!!!!DEBUG
                },
                
                addObserver: function(model, plugin, aaa, msg) {
                    this.observers.push(msg.observer);
                },
                
                load: function(model, plugin, $do, msg) {
                },                
                
                create: function(model, plugin, aaa, msg) {
                
                    var objData = msg.obj;
                    var self = this;
                    (_.isArray(objData)?objData:[objData]).forEach(function(objData) {
                        objData.model.color = self.color;//!!!DEBUG                
                        var obj = kng.create(objData.name, objData, self);
                        console.log(obj.model().shape);
                        self.observers.forEach(function(observer) {
                            observer.add(obj.model);
                        });                
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
