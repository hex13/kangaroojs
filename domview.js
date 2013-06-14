function DOMView() {
    var self = this;
    this.onRender = function(data) {
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
    }
    this.onAdd = function(data) {
        var el = data.el = document.createElement('div');             
        data.style = el.style;
        el.className = 'sprite';             
        data.style.backgroundColor = '#fa0';
        document.body.appendChild(el);
        el.kngModel = data.model;
    };
    console.log(this.onRender);
    console.log(this.render);
    console.log('XX');            
};
DOMView.prototype = new Container(['render']);

function DOMViewTest() {
    /*var view = new DOMView;
    alert(view.onRender);
    alert(view.render);      */
}

new DOMViewTest;
