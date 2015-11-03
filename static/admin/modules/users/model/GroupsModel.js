/**
 * @author Max Tushev
 * @scope Server, Client
 * The model for Users Groups module 
 * @private
 */
Ext.define('Desktop.modules.users.model.GroupsModel', {    
    extend: "Core.data.DataModel"
        
    ,collection: 'groups'
    

    ,fields: [{
        name: '_id',
        type: 'ObjectID',
        visible: true
    },{
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'description',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'modelAccess',
        type: 'object',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'pagesAccess',
        type: 'object',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'desktopClassName',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'autorun',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    }]
    
    /**
     * @scope Client
     * @method 
     * Getting accessible modules
     * @public
     */
    ,getModules: function(callback) {
        this.runOnServer('getModules', callback)
    }
    
    /**
     * @scope Server
     * @method 
     * Getting accessible modules
     * read "model" dir in "modules" catalogue
     * @public
     */
    ,$getModules: function(data, callback) {
       
        var me = this
            ,dirs = [
                {nameSpace: 'Desktop-modules', dir: me.config.adminCoreModulesDir}                
            ]
            ,fs = me.getFs()
            ,res = [];

        [
            function(call) {
                if(me.config.nameSpace)
                    dirs.push({nameSpace: me.config.nameSpace + '-modules', dir: me.config.staticDir + me.config.adminModulesDir}) 
                call()
            }
            
            ,function(call) {
                var fun = function(i) {
                    if(i>=dirs.length) {
                        callback(res)
                        return;
                    }
                    fs.readdir(dirs[i].dir, function(e, models) {
                        if(!models) {
                            fun(i+1)
                            return;
                        }
                        var f = function(j) {
                            if(j>=models.length) {
                                fun(i+1)
                                return;
                            }
                            fs.readdir(dirs[i].dir + '/' + models[j] + '/model', function(e, files) {
                                if(!e && files) {
                                    me.getModelnameFromFiles(dirs[i].dir + '/' + models[j] + '/model', files, function(r) {
                                        r.each(function(rr) {res.push(rr)})    
                                        f(j+1)
                                    })
                                } else
                                    f(j+1)
                            })
                        }
                        f(0)
                    })
                }
                fun(0)
            }
        ].runEach();
    }
    
    ,getModelnameFromFiles: function(dir, files, cb) {
        var me = this,res = [];
        var f = function(i) {
            if(i>=files.length) {
                cb(res)
                return;
            }
            me.getModelnameFromFile(dir + '/' + files[i], function(r) {
    
                if(r) res.push(r)
                f(i+1)
            })
        }
        f(0)
    }
  
    ,getModelnameFromFile: function(path, cb) {
        this.getFs().readFile(path, function(e, d) {
            if(d) {
                d = d.toString()
                var i=0, s = '';
                while(i<d.length && d.substr(i++,10) != 'Ext.define');
                i+=9;
                while(i<d.length && /[\(\)\s'"]/.test(d.charAt(i++)));
                i--;
                while(i<d.length && /[a-zA-Z0-9_\.]/.test(d.charAt(i))) s += d.charAt(i++);
                if(s) cb({name: s.replace(/\./g, '-')})
                else cb()
            } else
                cb()
            
        })
        
    }
    /**
     * @scope Server
     * @method 
     * Getting file system lib
     * @private
     */
    ,getFs: function() {
        if(!this.fs) this.fs = require('fs')
        return this.fs
    }
    
    ,beforeSave: function(data, cb) {
        var me = this;
        
        [
            function(next) {
                me.src.db.collection(me.collection).findOne({
                    _id: me.src.db.fieldTypes.ObjectID.getValueToSave({}, data._id)    
                }, 
                {pagesAccess: 1}, 
                function(e,d) {
                    if(d && d.pagesAccess)
                        next(d.pagesAccess)
                    else
                        cb(data)
                })
            }
            ,function(oldData, next) {
                var i, out = {}
                if(data.pagesAccess) {
                    for(i in data.pagesAccess) {
                        if( !data.pagesAccess[i].read &&
                            !data.pagesAccess[i].add &&
                            !data.pagesAccess[i].modify &&
                            !data.pagesAccess[i].del && 
                            !data.pagesAccess[i].inherit 
                        ) {
                            if(oldData[i])
                                delete oldData[i]
                        } else {
                            out[i] = data.pagesAccess[i]
                        }
                    }
                }
                for(i in oldData)
                    out[i] = oldData[i]
                    
                data.pagesAccess = out
                cb(data)
            }
        ].runEach()
    }
})