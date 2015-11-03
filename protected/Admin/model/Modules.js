var fs = require('fs')

Ext.define('Admin.model.Modules',{
    extend: "Core.AbstractModel"
    
    ,readDir: function(md, manifests, callback) {  
        fs.readdir(md, function(e, files) {  
            if(e) {
                callback(manifests);
                return;
            }
            var s;
            for(var i=0;i<files.length;i++) {
                files[i] = md + '/' + files[i] + '/manifest.json'
                if(fs.existsSync(files[i])) {
                    s = fs.readFileSync(files[i], 'utf8')
                    s = JSON.parse(s)
    
                    if(s) {
                        if(Object.prototype.toString.call(s)=='[object Array]') {
                            for(var j=0;j<s.length;j++) manifests.push(s[j]);
                        } else {
                            manifests.push(s);
                        }
                    }
                }
            }
            callback(manifests,null)        
        }) 
    }
    
    ,getUserModules: function(params, callback) {


        if(!params.auth) {         
            callback({success: false}); 
            return;
        }
        var  me = this
            ,manifests = [];
            //,dirAdmin = me.config.staticDir + me.config.adminModulesDir;

        [
            function(call) {
                me.readDir(me.config.adminCoreModulesDir, manifests, function(mnfs) {            
                    //manifests = mnfs;
                    call()
                })     
            }
            
            ,function(call) {
                var uses = ['']
                if(!!me.config.use) uses = uses.concat(me.config.use)
                var func = function(i) {
                    if(i>=uses.length) {
                        callback(manifests,null)
                        return;
                    }
                    var dir = me.config.projectDir + (uses[i]? '/..':'') + '/static/admin/modules'
                    me.readDir(dir, manifests, function(mnfs) {            
                        //manifests = manifests.concat(mnfs);
                        func(i+1)
                    })
                }
                func(0)
            }
        ].runEach()
    }
    
    ,getAllModules: function(params, callback) {
        this.getUserModules(params, callback)           
    }
    
    ,checkAccess: function(params, callback) {
        var me = this;
        
        
        me.callModel('Admin.model.User.getUserAccessRates', params, function(rights) {
          
            if(!rights) {
                callback({read: false, add: false, modify: false, del: false})
                return;
            }
          
            if(rights.superuser) {
                // для суперюзера все пути открыты
                callback({read: true, add: true, modify: true, del: true})
                return;
            }           
            var models = rights.modelAccess
            if(models && req.urlparams) {                
                var model = getModuleName(req.urlparams[1]);
                
                if(models[model]) callback(models[model])
                else if(models[model + 'Model']) callback(models[model + 'Model'])
                else callback({read: false, add: false, modify: false, del: false})
            } else {
                callback({read: false, add: false, modify: false, del: false})
            }
        })
    }
    
});