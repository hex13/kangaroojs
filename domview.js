function DOMView() {
   
    this.onRender = function(data) {
        var style = data.style;            
        var el = data.el;
        model = data.model();        
        var oldModel = data.model(-1);
        var newModel = data.model(1);
        style.left = ~~(model.x) + 'px';
        style.top =  ~~(model.y + 10) + 'px';  

        if (model.dead) {
            style.background = "rgba(" + _.random(50,100) +",0,0,0.7)";
            style.zIndex = '-10';
        }
        if(typeof model.opacity!='undefined' && model.opacity !== null)
            style.opacity = model.opacity;        
            
        if((typeof model.text != 'undefined') &&  el.innerHTML != model.text
            /*&& oldModel.text != model.text*/) {
            el.innerHTML = model.text;
        }    
        
        if(!model.collidable) {
            style.border = '2px solid gray';
        }
        
        if(model.fadeOut) {
            $(el).fadeOut(model.fadeOut);
            newModel.fadeOut = 0;
        }        
        
        if(model.blink) {
            $(el).fadeOut(~~(model.blink/2)).fadeIn(~~(model.blink/2));
            newModel.blink = 0;
        }
        
        if(model.popup) {
            $(el).animate({opacity:1},model.popup[0]).fadeOut(model.popup[1]);
            newModel.opacity = null;
            newModel.popup = null;
        }
        
        
        
    }

    this.onAdd = function(data) {
        var el = data.el = document.createElement('div');             
        data.style = el.style;
        
        
        var className = data.model.obj.className;
        el.className = className;
        
        data.style.backgroundColor = data.model().color;
        document.body.appendChild(el);
        el.kngModel = data.model;
        
        if (data.model().shape == 'circle')
            data.style.borderRadius = '50%';
    };
    
    this.onRemove = function(data) {
        var el = data.el;
        el.parentNode.removeChild(el);
    }
};
DOMView.prototype = new Container(['render']);





function DOMViewTest() {
    /*var view = new DOMView;
    alert(view.onRender);
    alert(view.render);      */
}

new DOMViewTest;
