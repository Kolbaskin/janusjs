
Ext.define('Desktop.modules.filemanager.model.fmModel', {
    extend: 'Core.data.TreeDataModel'
    
    ,fields: [{
        name: 'id',
        mapping: '_id',
        type: 'ObjectID',
        editable: false,
        visible: true
    },{
        name: 'pid',
        type: 'ObjectID',
        editable: true,
        visible: true
    },{
        name: 'filename',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'type',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'size',
        type: 'number',
        editable: true,
        visible: true
    },{
        name: 'mtime',
        type: 'date',
        editable: true,
        visible: true
    }]
    
    ,initOnServer: function() {
        
        this.ex = {}
        
        this.ex.fs = require('fs')
        this.ex.exec = require('child_process').exec    
        this.ex.arch_types = ['tar', 'zip', '7z', 'rar', 'arj']
        this.ex.crypto = require('crypto')

    }
    
    /**
     * @scope Server
     * @method 
     * @private
     * Getting files or directories
     
    ,getData: function(params, callback) {
console.log('conf:', this.config)
        callback({total: 3, list:[
            {_id:'file1', filename: 'file1name', type: 'doc', size: 1024, mtime: new Date(), leaf: true},
            {_id:'file2', filename: 'file2name', type: 'doc', size: 1024, mtime: new Date(), leaf: false},
            {_id:'file3', filename: 'file3name', type: 'doc', size: 1024, mtime: new Date(), leaf: false},
        ]})
    }
    */
    ,getExtension: function(fn) {
        var v = fn.length;
        while(v>0 && fn.charAt(v) != '.') v--;
        if(v>0) return fn.substr(v+1).toLowerCase()    
        return null;
    }
    
    ,getUploadDir: function(callback) {
        var dir = this.config.uploadDir || this.config.staticDir + '/uploads'
        callback(dir)
    }
    
    ,getData: function(data, callback) {
        var me = this
        me.getUploadDir(function(rootDir) {
            me.getdir((data.id == 'root'? '':data.id), rootDir, callback)
        })
    }
    
    ,getdir: function(dir, rootDir, callback) {    
        var me = this;
        [
            function(call) {
                dir = dir.replace(/\.\./g, '')
                call(rootDir + dir)
            }
            
            ,function(rdDir, call) {
                me.ex.fs.readdir(rdDir, function(e, files) {
                    if(files && files.length)
                        call(rdDir, files)
                    else
                        callback(null)
                })    
            }
            
            ,function(rdDir, files, call) {
                var out = {dirs: [], files: []}
                var func = function(i) {
                    var t;
                    if(i>=files.length) {
                        call(out)
                        return;
                    }
                    me.ex.fs.stat(rdDir + '/' + files[i], function(e, stat) {
                        if(stat) {
                            if(stat.isFile()) {
                                t = me.getExtension(files[i]);
                                out.files.push({filename: files[i], _id: dir + '/'+files[i], leaf: true, type: t, size: stat.size, mtime: stat.mtime})
                            } else {
                                out.dirs.push({filename: files[i], _id: dir + '/'+files[i], leaf: false, mtime: stat.mtime})
                            }
                        }
                        func(i+1)
                    })
                }
                func(0)
            }
            
            ,function(out) {
                var res = {list: out.dirs.concat(out.files)}
                res.total = res.list.length;
                callback(res)
            }
            
        ].runEach()
      
    }
    
    ,newDir: function(data, callback) {
        this.runOnServer('newDir', data, function(res) {
            if(res.filename) callback(res)
        })    
    }
    
    ,$newDir: function(data, callback) {
        var me = this;
        [
            function(call) {
                me.getPermissions(function(permis) {
                    if(permis.add)
                        call()
                    else
                        callback(null)
                })
            }
            ,function(call) {
                me.getUploadDir(function(rootDir) {
                    call(rootDir)
                })    
            }
            ,function(rootDir) {
                var path = rootDir + data.path + '/' + data.name
                me.ex.fs.mkdir(path, function(e,r) {
                    if(e) {
                        callback(null);
                    } else {
                        callback({
                            filename: data.name, 
                            id: data.path+'/'+data.name,
                            leaf: false,
                            mtime: new Date()
                        });    
                    }
                })
            }
        ].runEach()
    }

    // Client side method
    ,uploadFiles: function(files, path, callback) {
        var me = this;
        var func = function(i) {
            if(i>=files.length) {
                callback({})
                return;
            }
            me.uploadFile(files[i], path, function() {
                func(i+1)    
            })
        }
        func(0)
    }
    
    ,uploadFile: function(file, path, callback) {
        var reader = new FileReader();
        var rawData = new ArrayBuffer();        
        Core.ws.ws.send('file:{name:"name", key: "key"}');
        Core.ws.ws.binaryType = "arraybuffer";
        reader.onload = function(e) {
            rawData = e.target.result;
            Core.ws.ws.send(rawData);
            Core.ws.ws.send('end');
        }
        reader.readAsArrayBuffer(file);
        
    }
    
    ,upload: function(req, callback, auth) {
        var me = this
        me.getUploadDir(req, function(dir) {
            me.upload1(req, callback, auth, dir)
        }, auth)
    }
    ,upload1: function(req, callback, auth, UPLOAD_DIR) {    
        
        if(UPLOAD_DIR) {
            var me = this, path, file, rpath;
            
            if(req.urlparams[0]) path = decodeURIComponent(req.urlparams[0])
            if(req.urlparams[1]) file = decodeURIComponent(req.urlparams[1])
            
            if(file) {            
                rpath = (!path || path==''? '/'+UPLOAD_DIR:path)
                path = me.server.dir+'/'+me.server.config.STATIC_DIR+rpath+'/'+file
                fs.writeFile(path, req.fullData, function (e) {
                    if (e) {
                        callback({success: false})
                    } else {
                        callback({
                            filename: file, 
                            id: rpath+'/'+file,
                            type: getExtension(file),
                            leaf: true,
                            mtime: new Date(),
                            size: req.fullData.length
                        })
                    
                        if(convert) convert.makePreview(path, me.server, auth)
                    }                
                });                   
                return;      
            } 
            callback(null, {code: 404});        
        } else callback(null, {code: 401});    
    }
    
    ,removeFiles: function(files, callback) {
        this.runOnServer('remove', {records: files}, callback)    
    }
    
    ,remove: function(files, callback) {    
        var me = this;
        
        [
            function(call) {
                me.getUploadDir(function(rootDir) {
                    call(rootDir)
                })    
            }
            ,function(rootDir, call) {
                
                var delFiles = function(dir, files, cb) {
                    var fun = function(i) {
                        if(i>=files.length) {
                            cb()
                            return;
                        }
                        me.ex.fs.stat(dir + '/' + files[i], function(e, stat) {
                            if(stat) {
                                if(stat.isFile()) 
                                    me.ex.fs.unlink(dir + '/' + files[i], function() {fun(i+1)})
                                else 
                                    delDir(dir + '/' + files[i], function() {fun(i+1)})
                            } else fun(i+1)
                        })    
                    }
                    fun(0);
                }
                                
                var delDir = function(dir, cb) {
                    me.ex.fs.readdir(dir, function(e,files) {
                        if(files && files.length) {
                            delFiles(dir, files, function() {
                                me.ex.fs.rmdir(dir, cb);
                            })
                        } else {
                            me.ex.fs.rmdir(dir, cb);
                        }
                    })
                }  
                
                delFiles(rootDir, files, call)
            }
            
            ,function() {
                callback({success: true})    
            }
        ].runEach()
    }
});