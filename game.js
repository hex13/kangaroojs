window.kng = window.kng || {};

kng.Game = function(options) {
    var env = {};
    var com = new Messenger(function(id) {
        if (_.isString(id))
            return env[id];
        return id;
    });
    kng.send = function(msg) {
        com.send(msg);
    }



    var timerCallback = options.interval && options.interval[0];
    var levels = options.levels;
    var types = options.types || [];
    
    var view;
    var minimap;
    var timer;
    
    var levelIndex = 0;
    
    var physics = new SimplePhysics;    

    
    function initializeGame() {
        view = new DOMView($("#map")[0], 1);
        minimap = new DOMView($("#minimap")[0], .2);
        
        env.scene && env.scene.send({name:'cleanup'});
        env.hud && env.hud.send({name:'cleanup'});


        env.scene = kng.create('scene', { 
            model: {
                physics: new Box2DPhysics,
                pixelsPerUnit:1
            }
        });
        env.hud = kng.create('scene', { 
            model: {
                physics: new SimplePhysics,
                pixelsPerUnit:1
            }, plugins: [
                kng.ShapePlugin('circle')
            ]
        });    
        
        env.game = kng.create('', {
            model: {
                points:0
            },
            events: {
                points: function(model, plugin, aaa, msg) {
                    model().points += msg.points;
                }
            }
        });
        
    
        env.scene.send({name:'addObserver', observer:view});
        env.scene.send({name:'addObserver', observer:minimap});    
        
        env.hud.send({name:'addObserver', observer:view});      
    }
    
    
    
    function loadLevel() {
        var level = levels[levelIndex];
        com.send({to:'scene', name:'create', obj:level.objects});      
        
        com.send({to:'hud', name:'create', obj:level.hudObjects});      
    }
    
  
    function gameloop() {
        
        com.send({to:'scene', name:'move'});
        com.send({to:'hud', name:'move'});

        com.dispatch();        
        view.render();
        minimap.render();
        
        if (Math.random() < 0.06) {
            timerCallback && timerCallback(com);
        }
    }
    
    

    return {
        start: function () {
            timer && timer.stop();
            
            types.forEach(function(t) {
                kng.define.apply(kng, t);
            });
            
        
            initializeGame();    
            loadLevel();
            timer = new kng.Timer(gameloop,17).start();
        },
        pause: function() {
            timer.stop();
        },
        resume: function() {
            timer.start();
        },
        nextLevel:function() {
            levelIndex++;
            this.start();
        }
        
    };
    
};