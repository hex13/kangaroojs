function DOMView() {
   
    this.onRender = function(data) {
        var style = data.style;            
        var el = data.el;
        model = data.model();        
        var oldModel = data.model(-1);
        style.left = ~~(model.x) + 'px';
        style.top =  ~~(model.y + 10) + 'px';  

        if (model.dead) {
            style.background = "rgba(" + _.random(50,100) +",0,0,0.7)";
            style.zIndex = '-10';
        }
        if(typeof model.opacity!='undefined')
            style.opacity = model.opacity;        
            
        if((typeof model.text != 'undefined') &&  el.innerHTML != model.text
            /*&& oldModel.text != model.text*/) {
            el.innerHTML = model.text;
        }    
        
        if(!model.collidable) {
            style.border = '2px solid gray';
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
