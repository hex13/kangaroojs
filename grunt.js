module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: ["model.js", "messenger.js", "container.js", "timer.js",
                	"core.js", "types.js", "plugins.js",
                	"domview.js", "simplephysics.js", "box2dphysics.js",
                	"game.js"
                ],
                dest: 'kangaroo.js'
            }
        }    
    });
};
