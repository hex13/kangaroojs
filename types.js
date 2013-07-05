kng.defineTypes = function(kng) {
    kng.define('visual', {
        model: {
          x: 400, y:100, vx:0,  vy:0, w:60, h:60,  /*targetx:100, targety:100,*/
          rotation:0,
          gravity: 0, collidable: false, shape:'rect', active:true,
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

                cleanup: function() {
                    this.observers.forEach(function(observer) {
                        observer.cleanup && observer.cleanup();
                    });                
                },
                
                create: function(model, plugin, aaa, msg) {
                
                    var objData = _.clone(msg.obj);
                    var self = this;
                    (_.isArray(objData)?objData:[objData]).forEach(function(objData) {
                        objData.model.color = self.color;//!!!DEBUG                
                        //if (objData.image
                        //objData.model.w = 100;

                        var ppu = model().pixelsPerUnit || 1;
                        var img = kng.type2image(objData.name);
                        if (img) {
                            objData.model.w = img.width / ppu;
                            objData.model.h = img.height / ppu;                            
                        }                        
                        var obj = kng.create(objData.name, objData, self);
                        /*if (obj.image) {
                            obj.model(1).w = obj.image.width;
                            obj.model(1).h = obj.image.height;
                                                         
                        }*/

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
