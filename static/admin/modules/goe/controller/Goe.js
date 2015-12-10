/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.goe.controller.Goe', {
    extend: 'Core.controller.Controller',
    
    mainView: 'Desktop.modules.goe.view.GoeWin',
    
    sizeCfg: {
        width: 400,
        height: 300,
        preserveRatio: false
    },
    
    launcher: {
        text: D.t('Image editor'),
        iconCls:'fa fa-picture-o'
    }
    
    ,addControls: function(win) {
        var me = this
        me.control(win,{
            "[action=accept]": {click: function() {me.accept(win)}},
            "[action=rotate_left]": {click: function() {me.rotate(-90)}},
            "[action=rotate_right]": {click: function() {me.rotate(90)}},
            "[action=formclose]": {click: function() {win.close()}},
            "[action=formclose]": {click: function() {win.close()}}
        })
    }
        
    ,resizeFile: function(file, cb) {
        var me = this
            ,width
            ,height;
        
        me.callback = cb;
        
        me.sizeCfg.width = me.resizeCfg.width * me.sizeCfg.height / me.resizeCfg.height
        me.resize(window.URL.createObjectURL(file), {width: me.resizeCfg.width,height: me.resizeCfg.height}, function(data) {
            me.Source = data;
            me.DataURL = data;
            me.resizeAndCrop()
        })
    }
    ,resizeAndCrop: function() {
        var me = this
            ,panel = me.mainWin.down('[name=center]')
            ,img = document.createElement("img")
            ,canvas = document.createElement("canvas")
            ,cfg = me.sizeCfg;
        
        img.src = me.DataURL
       
        
        me.resize(me.DataURL, cfg, function(data, width, height) {
            if(!me.crop) {            
                panel.setWidth(width)
            }
            var x = 0, y = 0;            
            if(width < cfg.width) {
                height = Math.floor(width * cfg.height / cfg.width)
                y = Math.floor((cfg.width - width)/2)+10
            } 
            if(height < cfg.height) {
                width = Math.floor(height * cfg.width / cfg.height)   
                x = Math.floor((cfg.height - height)/2)+10
            } 
            me.DataURL = data
            var conf = {
                width: cfg.width,
                height: cfg.height,
                rectWidth: width,
                rectHeight: height,
                rectX: 0,
                rectY: 0,
                src: data,
                preserveRatio: cfg.preserveRatio
            }
            if(me.crop) {
                me.crop.reconf(conf)
            } else {
                //conf.preserveRation =  
                me.crop = Ext.create('Ext.ux.ImageCrop', conf)
                panel.add(me.crop)
            }
        })
    }
    
    ,resize: function(data, cfg, cb) {
        var me = this
            ,img = document.createElement("img")
            ,canvas = document.createElement("canvas");
        
        img.src = data
        
        img.onload = function() {
            var width = img.width
                ,height = img.height;
                
            if(width > cfg.width) {
                height *= cfg.width/width;
                width = cfg.width;
            }
            if (height > cfg.height) {
                width *= cfg.height / height;
                height = cfg.height;
            }
            canvas.width = width;
            canvas.height = height;
            
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            cb(canvas.toDataURL("image/jpeg"), width, height);
            delete canvas;
            delete img;
        }
    }
    
    
    ,getFile: function(cb) {
        var me = this;
        var res = me.crop.getResultPosition()
        var img_src = document.createElement("img");
        var canvas = document.createElement("canvas");
         
        img_src.onload = function() {
            var img = document.createElement("img");
            img.onload = function() {
                var k1 = img.width / img_src.width
                var k2 = img.height / img_src.height
                if(me.sizeCfg.preserveRatio) {
                    canvas.width = res.width * k1
                    canvas.height = res.height * k2
                    res.x *= k1;
                    res.y *= k2;
                } else {
                    canvas.width = res.width * k1
                    canvas.height = res.height * k1
                    res.x *= k1;
                    res.y *= k1;
                }
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, res.x, res.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                var blobBin = atob(canvas.toDataURL("image/jpeg").split(',')[1]);
                var array = [];
                for(var i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                delete canvas;
                delete img;
                var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                cb(file);
            }
            img.src = me.Source;
        }
        img_src.src = me.DataURL;
    }
    
    ,accept: function(win) {
        var me = this;
        me.getFile(function(file) {
            if(!!me.callback) 
                me.callback(file)
            win.close();
            me.destroy();
        })
    }
    
    ,rotate: function(deg) {
        var me = this
            ,ctx
            ,canvas = document.createElement("canvas")
            ,img = document.createElement("img");
        
        function drawRotated(degrees){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(degrees*Math.PI/180);
            ctx.drawImage(img,-img.width/2,-img.height/2);
            ctx.restore();
        }
        
        
        img.onload = function() {
            var x = 0, y = 0;
            if(img.width>=img.height) {
                x = (img.width - img.height)/2
                canvas.width = img.width;
                canvas.height = img.width;
            } else {
                y = (img.height - img.width)/2
                canvas.width = img.height;
                canvas.height = img.height;    
            }
            ctx=canvas.getContext("2d");
            ctx.drawImage(img,canvas.width/2-img.width/2,canvas.height/2-img.height/2);
            drawRotated(deg)
            var tempCanvas = document.createElement("canvas");
            tempCanvas.width = img.height;
            tempCanvas.height = img.width;
            var tCtx=tempCanvas.getContext("2d");
            tCtx.drawImage(canvas,x,y,tempCanvas.width, tempCanvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
            me.DataURL = tempCanvas.toDataURL("image/jpeg");
            me.Source = tempCanvas.toDataURL("image/jpeg");
            me.resizeAndCrop()
        }
        
        img.src = this.Source;
    },
    
    
    createWindow : function(){
        var me = this;
                
        var win = Ext.create(me.mainView);

        me.addControls(win)
        me.mainWin = win
        
        return win;
    }
});

