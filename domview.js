function DOMView() {
    this.render = function() {
        this.objects.forEach(function(data) {
            var style = data.style;            
            model = data.model();
            style.left = ~~(model.x) + 'px';
            style.top =  ~~(model.y + 10) + 'px';  
            if (model.dead) {
                style.background = "rgba(" + _.random(50,100) +",0,0,0.7)";
                style.zIndex = '-10';
            }
            if(typeof model.opacity!='undefined')
                style.opacity = model.opacity;        
        });
    }
    this.onAdd = function(data) {
        var el = data.el = document.createElement('div');             
        data.style = el.style;
        el.className = 'sprite';             
        data.style.backgroundColor = '#fa0';
        document.body.appendChild(el);
        el.kngModel = data.model;
    };
    
};
DOMView.prototype = new Container;
