function DOMView() {
    var element = document.body;
    var view = this;
    $(element).on('click', function(e) {
        var x = e.pageX / view.pixelsPerUnit;
        var y = e.pageY / view.pixelsPerUnit;        
        
        var target = $(e.target).closest('.kang-visual');         

        var model = target && target[0] && target[0].kngModel;//e.target && e.target.kngModel;
        if (model) {
            kng.send({to:model.obj, name:'click'});
        }
        else {
            kng.send({to:'scene', name:'create', e:e, obj: {
                name:'ball',
                model: {
                        x:x, y:y
                    }
                }
            });
        }        
        
        
        
        
        
    });
    
    this.pixelsPerUnit = 1;
   var d = 0.001;
    this.onRender = function(data) {
        var ppu = this.pixelsPerUnit;
        this.pixelsPerUnit += d;
        if (this.pixelsPerUnit>3 || this.pixelsPerUnit<0.5) d*=-1;
        
        var style = data.style;            
        var el = data.el;
        model = data.model();        
        var oldModel = data.model(-1);
        var newModel = data.model(1);
        style.left = ~~(model.x * ppu) + 'px';
        style.top =  ~~(model.y * ppu + 10) + 'px';  
        
        style.width = (model.w * ppu) + 'px'; //!!!doesn't should take w/h from images?
        style.height = (model.h * ppu) + 'px';

        if (model.dead) {
            style.backgroundColor = "rgba(" + _.random(50,100) +",0,0,0.7)";
            style.zIndex = '-10';
        }
        if(typeof model.opacity!='undefined' && model.opacity !== null)
            style.opacity = model.opacity;        
            
        if((typeof model.text != 'undefined') &&  el.innerHTML != model.text
            /*&& oldModel.text != model.text*/) {
            el.innerHTML = model.text;
        }    
        
        var vendorStylePrefix = 'Webkit';//!!TODO: do support for others browsers than webkit
        var transform = '';
        if (typeof model.rotation != 'undefined')
            transform += 'rotate(' + model.rotation  +  'deg)';
        style[vendorStylePrefix + 'Transform'] = transform;
        
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
        element.appendChild(el);
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
