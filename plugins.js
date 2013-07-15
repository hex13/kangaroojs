kng.PhysicsPlugin = {
    events: {
        move: function move(model, plugin, send) {
            var m = model();
            var nm = model(1);
            nm.x += m.vx;
            nm.y += m.vy;
            nm.vy += kng.GRAVITY * m.gravity;
            //model.modify({x: '+vx', y: '+vy', vy:'+0.1'});            
        }
    }
}


kng.DivRenderer = {
    events: {
        init: function(model, plugin, send) {
             var el = plugin.el = document.createElement('div');             
             plugin.style = el.style;
             el.className = 'sprite';             
             document.body.appendChild(el);
             
             el.kngModel = model;
             //model.el = el;
        },
        render: function render(model, plugin) {
            var style = plugin.style;            
            model = model();
            style.left = ~~(model.x) + 'px';
            style.top =  ~~(model.y) + 'px';  
            if (model.dead) {
                style.background = "rgba(" + _.random(50,100) +",0,0,0.7)";
                style.zIndex = '-10';
            }
            if(typeof model.opacity!='undefined')
                style.opacity = model.opacity;
        }
    }
}


kng.TargetPlugin = {
    events: {
        move: function(model) {
            var m = model();
            var nm = model(1);
            if (_.isNumber(m.targetx) && _.isNumber(m.targety)) {
                var dx = (m.targetx - m.x)/2000;//TODO: remove hardcoded value 
                var dy = (m.targety - m.y)/2000;                
                nm.vx += dx;
                nm.vy += dy;                
            }
        }
    }
};

kng.LifeSpanPlugin = {
    events: {
        move: function(model, pluginData, $do) {
            var m = model();
            if (!m.lifespan)
                return;
            
            if (new Date() - m.birth > m.lifespan) 
                $do.killYourself();     
        }
    }
}

// to use with scene object
kng.ShapePlugin = function(shape) {
    return {
        events: {
            create: function(model, plugin, aaa, msg) {
                //!!!! warning: no-op behavior
                //msg.obj.model.shape = shape;
            }
        }
    }    
}
