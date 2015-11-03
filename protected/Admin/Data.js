var fs = require('fs')

Ext.define('Admin.Data',{
    extend: "Core.Controller"
    
    ,getDataModel: function() {
        if(this.params.gpc && this.params.gpc.modelName) {
            return this.params.gpc.modelName;
        } else {
            return this.request.url.split('?')[0].split('/')[2]            
        }
        return '';
    }
    
    ,$getData: function() {
        var me = this;
        [
            function(call) {
                // If need to reorder data
                if(me.params.gpc.reorder) {
                    var params
                    try {
                        params = JSON.parse(me.params.gpc.reorder);
                    } catch(e) {}
                    if(params) {
                        me.callModel(me.getDataModel() + '.reorder', params, function() {
                            call();    
                        })
                    } else {
                        call()
                    }
                } else
                    call();
            }
            ,function() {
                me.callModel(me.getDataModel() + '.getData', me.params.gpc).sendJSON()
            }
        ].runEach()

        
    }
    
    ,$save: function() {
        this.callModel(this.getDataModel() + '.save', this.params.gpc).sendJSON()
    }
    
    ,$remove: function() {
        this.callModel(this.getDataModel() + '.remove', this.params.gpc).sendJSON()
    }
    
    ,$copy: function() {
        this.callModel(this.getDataModel() + '.copy', this.params.gpc).sendJSON()
    }
    
    ,$reorder: function() {
        
        console.log('model:',this.getDataModel() + '.reorder')
        
        this.callModel(this.getDataModel() + '.reorder', this.params.gpc).sendJSON()
    }
    
    ,$img: function() {
        var me = this
            ,params = this.request.url.split('/')[2];
        if(params) {
            params = params.split('.')    
        }
        if(params.length >= 4) {
            me.callModel('Admin.model.Files.getImage', {
                collection: params[0],
                field: params[1],
                _id: params[2],
                size: params[3],
                num: params[5]
            }, function(data, mtime, ext) {
                me.headers["Last-Modified"] = mtime;
                me.headers['Cache-Control'] = (params[4] && params[4] == 'nocached'? 'no-cache':'private')
                me.sendImage(data, ext)
            }) 
        } else me.sendImage()
    }
    
    ,$uploadImage: function() {
        var me = this
            ,ua = me.request.url.split('/')
            ,sizes = ua[2]
            ,dir = ua[3]? ua[3].replace(/\./g,'/'):'';

        if(sizes) {
            
            var cfg = {
                sizes: sizes,
                dir: dir
            }
            
            if(me.params.tmpName)
                cfg.tmpName = me.params.tmpName
            else
                cfg.data = me.params.fullData
            
            me.callModel('Admin.model.Files.uploadImage', cfg, function(img) {               
                me.sendJSON(img) 
            })
        } else {
            me.sendJSON({})    
        }
    }
    
    ,$uploadFile: function() {
        var me = this
        
        if(me.params.tmpName) {
            me.sendJSON({name: me.params.tmpName})
        } else {
            me.callModel('Admin.model.Files.uploadFile', {
                data: me.params.fullData
            }, function(data) {               
                me.sendJSON(data) 
            })
        }
    }
    
    ,$getFile: function() {
        var me = this;
        
        if(me.params.gpc.name) {  
            var path;
            
            if(me.params.gpc.tmp)
                path = me.config.adminCoreModulesDir + '/../../tmp/' + me.params.gpc.tmp
            else
            if(me.params.gpc.file)
                path = me.config.staticDir + me.config.userFilesDir + '/' + me.params.gpc.file
            
            
            fs.readFile(path, function(e, data) {
                if(data) {
                    me.headers['Content-Disposition'] = 'attachment; filename="'+encodeURIComponent(me.params.gpc.name)+'"'
                    me.headers['Content-Length'] = data.length
                    me.end(data)
                }
            })
        }
    }
    
    ,$getXls: function() {
        var me = this;

        if(me.params.gpc.name) {  
            var path;
            
            if(me.params.gpc.file)
                path = me.config.staticDir + me.config.userFilesDir + '/' + me.params.gpc.file

            fs.readFile(path, function(e, data) {
                if(data) {
                    me.headers['Content-Disposition'] = 'attachment; filename="'+encodeURIComponent(me.params.gpc.name)+'"'
                    me.headers['Content-Length'] = data.length
                    me.end(data)
                    fs.unlink(path, function(){})
                }
            })
        }
    }
    
})