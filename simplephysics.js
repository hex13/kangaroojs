function SimplePhysics() {
    var physics = new Container();
    physics.update = function() {        
        this.send('move');

        this.objects.forEach(function(data) {
            var m = data.model();
            var nm = data.model(1);
            nm.x += m.vx;
            nm.y += m.vy;
            nm.vy += kng.GRAVITY * m.gravity;
        });
            //model.modify({x: '+vx', y: '+vy', vy:'+0.1'});              
        
        this.send('update');
        this._checkCollisions();    
        this.send('update');        
    }    
    
    physics._checkCollisions = function () {
        var objects = this.objects;
        for (var i = 0; i < objects.length - 1; i++) {
            var a = objects[i].model.obj;
            var am = a.model;
            var am0 = a.model();
            for (var j = i+1; j < objects.length; j++) {
                var b = objects[j].model.obj;
                var bm = b.model;
                var bm0 = b.model();                
                if (am0.dead || bm0.dead || !am0.collidable || !bm0.collidable) continue;                
                var ax = am().x + am().vx;
                var bx = bm().x + bm().vx;
                var ay = am().y + am().vy;
                var by = bm().y + bm().vy;                    
                
                var dx = ax - bx;
                var dy = ay - by;
                
                if (dx * dx + dy * dy < 50*50) {
                    am(1).vx /= 55;
                    am(1).vy /= 55;                
                    bm(1).vx /= 55;
                    bm(1).vy /= 55;                
                    
                    a.send({name:'collision', collider:b}, kng.send);
                    b.send({name:'collision', collider:a}, kng.send);
                }

            }           
        }
    };     
    return physics;   
}

