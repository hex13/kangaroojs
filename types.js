kng.defineTypes = function(kng) {
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
};
