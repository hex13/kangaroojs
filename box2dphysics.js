function Box2DPhysics() {    
    // import box2d types
    var b2Vec2 = Box2D.Common.Math.b2Vec2;    
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
 	var	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
 	var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
 	
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;    
    
    
    var physics = new Container();
    
    var world = new Box2D.Dynamics.b2World(new b2Vec2(0, 0.6), true);    

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;    


    function DEBUG() {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
        physics.toString = function(){return 'box2d'};        
    };
    
    
    
    DEBUG();			

    
   
    var SCALE_POS = 0.035;  
    var SCALE_VEL = 2;  
    
    physics.update = function() {                
        this.send('move');       
        this.send('update');         
        this.each(function(data) {
            var m = data.model();
            var nm = data.model(1);
            var vx = m.vx * SCALE_VEL;
            var vy = m.vy * SCALE_VEL;     
            var pos = data.body.GetPosition();
            nm.x = pos.x / SCALE_POS;
            nm.y = pos.y / SCALE_POS;
            //data.body.SetLinearVelocity(new b2Vec2(vx, vy));             
        });
        this.send('update');
        
        world.Step(1 / 60, 10, 10);        
        world.DrawDebugData();        
        
    }
        

    physics.onAdd = function(data) {
    
        // get parameters from the model
        var m = data.model();
        var vx = m.vx * SCALE_VEL;
        var vy = m.vy * SCALE_VEL;
        var x = m.x * SCALE_POS;
        var y = m.y * SCALE_POS; 
        
        // create body def        
        var bodyDef = new b2BodyDef;    
        bodyDef.type = b2Body.b2_dynamicBody;        


        // create object' shape
        if (m.shape=='rect') {
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(1,1);
        } else {
            fixDef.shape = new b2CircleShape(1);        
        }
        
        // create body
        var body = world.CreateBody(bodyDef);        
        body.CreateFixture(fixDef);
        
        // set body position and velocity
        body.SetLinearVelocity(new b2Vec2(vx,vy));
        body.SetPosition(new b2Vec2(x, y))	
        
        // remember the body
        data.body = body;
    }
    
    return physics;   
}

