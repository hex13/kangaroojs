function Box2DPhysics() {    
    // import box2d types
    var b2Vec2 = Box2D.Common.Math.b2Vec2;    
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
 	var	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
 	var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2Listener = Box2D.Dynamics.b2ContactListener;    
 	
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;    
    
    
    var physics = new Container();
    
    var world = new Box2D.Dynamics.b2World(new b2Vec2(0, 12), true);
    
    
    
    //add contact listener
    var listener = new b2Listener;
    
    function contactHandler(contact, isEnd) {
        var fixtureA = contact.GetFixtureA();
        var objA = fixtureA.GetBody().GetUserData();        
        var fixtureB = contact.GetFixtureB();
        var objB = fixtureB.GetBody().GetUserData();
        if (!isEnd) {
           // console.log("AAAAAAAAAAAAA");
            //objA.send({name:'collision'},kng.send);
            //objB.send({name:'collision'},kng.send);        
           // console.log("BBBB");            
        }
    }

    listener.BeginContact = function(contact) {
        contactHandler(contact, false);
    }

    listener.EndContact = function(contact) {
        contactHandler(contact, true);    
    }

    listener.PostSolve = function(contact, impulse) {
    }

    listener.PreSolve = function(contact, oldManifold) {
    }
    
        
    world.SetContactListener(listener);    

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.7;    


    function DEBUG() {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
        debugDraw.SetDrawScale(20.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(0.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
        physics.toString = function(){return 'box2d'};        
    };
    
    
    
    DEBUG();			

    
   
    var SCALE_POS = 1/20.0;
    var SCALE_VEL = 1;  
    
    physics.update = function() {                
    
        this.each(function(data) {
            var m = data.model();
            var nm = data.model(1);
            var vx = m.vx * SCALE_VEL;
            var vy = m.vy * SCALE_VEL;     
            var pos = data.body.GetPosition();
            nm.x = (pos.x / SCALE_POS) - m.w/2; 
            nm.y = (pos.y / SCALE_POS) - m.h/2;
            nm.rotation = data.body.GetAngle() / (Math.PI * 2) * 360.0;
            //var vel = data.body.GetLinearVelocity();             
            //nm.vx = vel.x; nm.vy = vel.y;
            //data.body.SetLinearVelocity(new b2Vec2(vx, vy));             
        });
        this.send('update');
        this.send('move');       
        this.send('update');         
        this.each(function(data) {
            var m = data.model();
            var nm = data.model(1);
            var vx = m.vx * SCALE_VEL;
            var vy = m.vy * SCALE_VEL;     
            // primitive checksum calculation (it's lame, I know ;) 
            var vsum = (~~(vx * 100)) + ';' + (~~(vy * 100)) + ';' + (~~(vx * 20)) + ';' + (~~(vy * 20));
            
            if (vsum != data.vsum) // if velocity has changed in the model...
                data.body.SetLinearVelocity(new b2Vec2(vx, vy)); // ...update box2d
            data.vsum = vsum;


        });
        
        
        world.Step(1 / 30, 10, 10);
        world.DrawDebugData();        
        
    }
        

    physics.onAdd = function(data) {
    
        // get parameters from the model
        var m = data.model();
        var vx = m.vx * SCALE_VEL;
        var vy = m.vy * SCALE_VEL;
        var x = (m.x + m.w/2) * SCALE_POS;
        var y = (m.y + m.h/2) * SCALE_POS; 
        
        // create body def        
        var bodyDef = new b2BodyDef;       
        var g = m.gravity;     
        bodyDef.type = g == 0? b2Body.b2_cinematicBody : b2Body.b2_dynamicBody;        
        bodyDef.userData = data.model.obj;


        // create object' shape
        if (m.shape=='rect') {
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(m.w * SCALE_POS/2, m.h * SCALE_POS/2);
        } else {
            fixDef.shape = new b2CircleShape(m.w*SCALE_POS/2);        
        }
        
        // create body
        var body = world.CreateBody(bodyDef);        
        body.CreateFixture(fixDef);
        
        // set body position and velocity
        body.SetLinearVelocity(new b2Vec2(vx,vy));
        body.SetPosition(new b2Vec2(x, y))	
        
        
        
        // remember the body
        data.body = body;
    };
    
    physics.onRemove = function(data) {
         console.log("--------REMOVE");                
         world.DestroyBody(data.body);
    }
    
    return physics;   
}

