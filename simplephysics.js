//!!!
// notice: poor quality of code (TODO: improve in further versions)
// when to change x, y ? and when nx, ny?
// what to do when collision?
// is wasCollision variable solution correct?

function SimplePhysics() {
    var physics = new Container();
    physics.update = function() {        


        this.objects.forEach(function(data) {
            var m = data.model();
            var nm = data.model(1);
            nm.x += m.vx;
            nm.y += m.vy;
            nm.vy += kng.GRAVITY * m.gravity;
            
            if (nm.y > 600 || nm.y<0) {nm.vy *= -1; nm.y+=nm.vy}
            if (nm.x > 1000 || nm.x<0) {nm.vx *= -1; nm.x+=nm.vx};
        });
        
        this._checkCollisions();    
        
        this.objects.forEach(function(data) {
            var m = data.model(1);        
            var nm = data.model(1);
            if (nm.wasCollision) {
                nm.vx *= 0;
                nm.vy *= 0;
                nm.x = m.x;
                nm.y = m.y;                
              // nm.wasCollision = false;
            }
        });
        this.send('update');   

        
         this.send('move');       
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
                
                if (am0.wasCollision) am(1).wasCollision = false;
                if (bm0.wasCollision) bm(1).wasCollision = false;                
                
                if(am0.wasCollision || bm0.wasCollision) continue;
                var ax = am(1).x;
                var bx = bm(1).x; 
                var ay = am(1).y;
                var by = bm(1).y;
                
                var dx = ax - bx;
                var dy = ay - by;
                
                if (dx * dx + dy * dy < 50*50) {
                
                    am(1).wasCollision = true;  
                    bm(1).wasCollision = true;       
                    console.log('kolizja');             
                    a.send({name:'collision', collider:b}, kng.send);
                    b.send({name:'collision', collider:a}, kng.send);
                } 

            }           
        }
    };     
    return physics;   
}

