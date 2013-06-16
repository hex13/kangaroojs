function DOMView() {
   
    this.onRender = function(data) {
        var style = data.style;            
        var el = data.el;
        model = data.model();        
        style.left = ~~(model.x) + 'px';
        style.top =  ~~(model.y + 10) + 'px';  

        if (model.dead) {
            style.background = "rgba(" + _.random(50,100) +",0,0,0.7)";
            style.zIndex = '-10';
        }
        if(typeof model.opacity!='undefined')
            style.opacity = model.opacity;        
            
        if(typeof model.text != 'undefined') {
            el.innerHTML = model.text;
        }    
        
        if(!model.collidable) {
            style.border = '2px solid gray';
            style.opacity = 0.7;
        }
        
        
    }

    this.onAdd = function(data) {
        var el = data.el = document.createElement('div');             
        data.style = el.style;
        el.className = 'sprite';             
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
