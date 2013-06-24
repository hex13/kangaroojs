function DOMView(element, pixelsPerUnit) {

    element = element || document.body;
    var view = new Container(['render']);
    view.pixelsPerUnit = pixelsPerUnit || 1;    
    
    console.log('DOMVIEW');    
    console.log(view);
    view.abc = 1209;
    
    var dragData = {};
    $(element).on('click mousedown mouseup mousemove', function(e) {
        var offset = $(element).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;        
        var x =  mouseX / view.pixelsPerUnit;
        var y = mouseY / view.pixelsPerUnit;        
        var target = $(e.target).closest('.kang-visual');                 
        var model = target && target[0] && target[0].kngModel;     
        var mouseData = {x:x, y:y, target:target, e:e, model:model};   
        
        function click() {

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
        }
       // if (e.type=='click') click();
        if (e.type=='mousedown') {
            dragData = {start:mouseData};
        }
        
        if (e.type=='mousemove') {
            if (dragData.start)
                document.title = mouseData.x;
        }
        
        
        if (e.type=='mouseup') {
            dragData.end = mouseData;
            var vx = (dragData.end.x - dragData.start.x)/20;            
            var vy = (dragData.end.y - dragData.start.y)/20;
            
            if (!dragData.start.model) {
                    kng.send({to:'scene', name:'create', e:e, obj: [{
                        name:'ball',
                        model: {
                                x:dragData.start.x, y:dragData.start.y, vx:vx, vy:vy
                            }
                        }  ]
                    });            
            } else {
                model.vx = 0;
  
            }            
            
            dragData.start = dragData.end = null; 
        }
        
        
        
               
    });
   

   var d = Math.random()*0.01;
    view.onRender = function(data) {
        var ppu = this.pixelsPerUnit;
        //this.pixelsPerUnit += d;
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

    view.onAdd = function(data) {
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
    
    view.onRemove = function(data) {
        var el = data.el;
        el.parentNode.removeChild(el);
    }
    
    return view;
};






function DOMViewTest() {
    /*var view = new DOMView;
    alert(view.onRender);
    alert(view.render);      */
}

new DOMViewTest;
