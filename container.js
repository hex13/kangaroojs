function Container(functionNames) {
    this.objects = [];
    
    var self = this;

    if (functionNames) 
        for (var i = 0; i < functionNames.length; i++) {
            var name = functionNames[i];
            var onEvent = 'on' + name.charAt(0).toUpperCase() + name.slice(1);            
            self[name] = function() {
                var handler = this[onEvent];
                if (handler)
                    this.objects.forEach(handler.bind(this));
            }            
        }
}

Container.prototype = {

    add: function(model) {
        var data = {model:model};
        this.onAdd && this.onAdd(data);
        this.objects.push(data);
    },
    
    remove: function(model) {
        var objects = this.objects;
        for (var i = 0, len = objects.length; i < len; i++) 
            if (objects[i].model == model) {
                var data = objects.splice(i, 1);
                this.onRemove && this.onRemove(data);                                
                return data;
            }

    },
    
    each: function(func) {
        var self = this;
        this.objects.forEach(function(data) {
            func.call(self, data);
        });    
    },
    
    send: function(msg) {
        this.each(function(data) {
            var obj = data.model.obj;
            obj.send(msg);
        });
    }
};

//-------------------

function ContainerTest() {
    console.log('Container Test started');
    var c = new Container();
    var kot = {kotek:12};
    c.add(kot);    
    assert(c.objects, 'container test 10')
    assert(c.objects[0], 'container test 20');        
    assert(c.objects[0].model, 'container test 30');    
    assert(c.objects[0].model.kotek === 12, 'container test 40');
    
    
    c.add('piesek');    
    assert(c.objects, 'container test 50 - adding second element');            
    assert(c.objects[1], 'container test 60 - adding second element');        
    assert(c.objects[1].model==='piesek', 'container test 70 - adding second element');    
    
    assert(c.objects.length===2, 'container test 80 - checking length of the array'); 
    
    c.remove('piesek');
    
    assert(c.objects.length===1, 'container test 90 - checking length of the array after removing element'); 

    var desc = ' checking if element still exists (it should do)';
    assert(c.objects, 'container test 100 ' + desc);
    assert(c.objects[0], 'container test 110 ' + desc);
    assert(c.objects[0].model, 'container test 120 ' + desc);
    assert(c.objects[0].model.kotek===12,'container test 130 ' + desc);
    
    c.add({'test':'porcelanowa figurka'});    
    c.remove(kot);

    assert(c.objects,'container test 140');
    assert(c.objects[0],'container test 150');
    assert(c.objects[0].model,'container test 160');
    assert(c.objects[0].model.test==='porcelanowa figurka', 'container test 170');        
    console.log('Container Test finished');
}

new ContainerTest;
