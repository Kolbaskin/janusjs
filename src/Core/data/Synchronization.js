var BSON = require('bson').pure().BSON;

Ext.define('Core.data.Synchronization', {
    extend: 'Core.data.DataModel'
    
    ,syncField: 'stime'
    
    ,callSelfMethod: function(data, method, conn, type, cb) {
        var me = this
            ,data = {
                data: {
                    model: 'Core.data.Synchronization',
                    action: method,
                    data: data
                }
            };
        
        if(!!cb) {
            var scope = Math.random()
            data.data.scope = scope
            if(!conn.callbacks) conn.callbacks = []
            conn.callbacks.push({scope: scope, cb: cb})
        }
        
        if(type == 'binnary') {
            data = BSON.serialize(data);
            conn.send(data);
        } else {
            data = JSON.stringify(data);
            conn.sendUTF(data);
        }
        
        
        
    }
    
    
    // Step 1, server side
    ,$getTime: function(data, cb, conn) {
        this.callSelfMethod({time: (new Date()).getTime()}, 'resTime', conn)
     
    }
    
    
    
    // Client side
    ,$resTime: function(data, cb, conn) {
     
        syncServerTime = (new Date()).getTime() - data.data.time; // Global variable without 'var'
    
        var me = this;
        [
            function(next) {
                me.getCollectionsNames(next)    
            }
             
            ,function(cols, next) {
                me.getCollectionsMax(cols, next)
            }
            
            ,function(cols) {
                me.callSelfMethod({cols: cols}, 'getCollectionsData', conn)
            }
        ].runEach()
    }
    
    ,getCollectionsNames: function(cb) {
        this.src.db.getCollections(function(e, cols) {
            var out = []
            cols.each(function(r) {
                r = r.name.split('.')
                if(r[1] !== 'system')
                    out.push(r[1])
            })
            cb(out)
        })
    }
    
    ,getCollectionsMax: function(cols, cb) {
        var out = {}, me = this;
        
        var f = function(i) {
            if(i>=cols.length) {
                cb(out)
                return;
            }
            me.getCollectionMax(cols[i], me.syncField, function(max) {
                out[cols[i]] = max;
                f(i+1)
            })
        }
        f(0)
    }
    
    ,getCollectionMax: function(col, field, cb) {
        this.src.db.collection(col).findOne({}, {sort: [[field, 'desc']]}, function(e, d) {
            if(d && d[field])
                cb(d[field])
            else
                cb(null)
        })    
    }
    
    ,writeLineToStdout: function(str, len) {
        if(!len) len = 40;
        while(str.length < len) str += '.'
        process.stdout.write(str);
    }
    
    // Getting actual collections data (server side)
    ,$getCollectionsData: function(data, cb, conn) {
        var me = this;
        [
            function(next) {
                if(conn.isServer && conn.userId) {
                    me.getAccessedCollections(conn.userId, next)    
                }
            }
            
            ,function(cols, next) {
                var f = function(i) {
                    if(i>=cols.length) {
                        next() 
                        return
                    }
                    me.writeLineToStdout("Syncronization: " + cols[i].collection);
                    
                    var find = {}
                    if(data.data.cols[cols[i].collection])
                        find[me.syncField] = {$gt: data.data.cols[cols[i].collection]}
                    
                    me.sendSyncData(cols[i], find, conn, function() {
                        console.log('OK')
                        f(i+1)    
                    })
                }
                f(0)
            }
            
            ,function() {
                me.callSelfMethod({}, 'getLocalRecords', conn)
            }
        ].runEach()
    }
    
    ,getAccessedCollections: function(userId, cb) {
        var me = this; 
        
        [
            function(next) {
                me.callModel('Admin.model.User.getUserInfo', {auth: userId}, function(usr){ 
                    next(usr.group.modelAccess)
                })
            }
            
            ,function(models, next) {
                var mdl, cols = []
                for(var mName in models) {
                    if(models[mName].read) {
                        mdl = Ext.create(mName.replace(/-/g, '.'), {
                            src: me.src,
                            config: me.config
                        })
                        if(mdl.collection) {
                            cols.push({collection: mdl.collection, model: mName})    
                        }
                        mdl.destroy()
                    }
                }
                cb(cols)
            }
        ].runEach()
    }
    
    ,sendSyncData: function(item, find, conn, cb) {
        var me = this;
            
        
        var coursor = me.src.db.collection(item.collection).find(find, {})
        me.readDoc(item, coursor, conn, cb)
    }
    
    ,readDoc: function(item, coursor, conn, cb) {
        var me = this;
        coursor.nextObject(function(e,d) {
            if(d) {
                [
                    function(next) {
                        if(!d.stime) {
                            d.stime = (new Date()).getTime();
                            d.ltime = d.stime
                            me.src.db.collection(item.collection).update({_id: d._id}, {$set: {stime: d.stime, ltime: d.ltime}}, function() {
                                next()    
                            })
                        } else
                            next()
                    }
                    
                    ,function() {
                        me.callSelfMethod({model: item, data: d}, 'saveRecord', conn, 'binnary', function() {
                            me.readDoc(item, coursor, conn, cb)                            
                        })
                    }
                    
                ].runEach()
            } else {
                cb()    
            }
        })
    }
    
    // Client side
    ,$saveRecord: function(data, cb) {
        var me = this;
        [
            function(next) {
                if(me.config.authoriz)  // Client side only!
                    next()
                else
                    cb({})
            }
            
            ,function(next) {
                var mdl = Ext.create(data.data.model.model.replace(/-/g, '.'), {
                        src: me.src,
                        config: me.config
                    })
                if(mdl) {
                    mdl.syncDataFromServer(data.data.data, cb)                    
                } else {
                    cb({})    
                }
            }
            /*
            ,function(next) {
                me.src.db.collection(data.data.model.collection).findOne({_id: data.data.data._id}, {ltime: 1}, function(e, d) {
                    if(d) {
                        if((!d.ltime || (d.ltime - syncServerTime) < data.data.data.stime)) {
                            me.recordUpdate(data.data, next)
                        } else {
                            cb({})
                        }
                    } else {
                            me.recordInsert(data.data, next)
                    }
                })
            }
            ,function() {
                cb({})    
            }
            */
        ].runEach()
    }
    
    /*
    ,recordUpdate: function(data, cb) {
        var me = this;
        data.data.ltime = null
        var set = {}
        for(var i in data.data) if(i != '_id') set[i] = data.data[i]
        me.src.db.collection(data.model.collection).update({_id: data.data._id}, {$set: set}, function(e, d) {
            cb()    
        })
    }
    
    ,recordInsert: function(data, cb) {
        var me = this;
        data.data.ltime = null
        me.src.db.collection(data.model.collection).insert(data.data, function(e, d) {
            cb()    
        })
    }
    */
    
    // Client side
    ,$getLocalRecords: function(data, cb, conn) {
        var me = this;
        [
            function(next) {
                me.callModel('Desktop.modules.users.model.GroupsModel.$getModules', {auth: me.user.id}, function(models) {
                    next(models)        
                })
            }
            ,function(models, next) {
                var f = function(i) {
                    if(i>=models.length) {
                        cb({})
                        return;
                    }
                    me.syncModel(models[i].name.replace(/-/g,'.'), function() {
                        f(i+1)    
                    }, conn)
                }
                f(0);
            }
        ].runEach()
    }
    
    ,syncModel: function(modelName, cb, conn) {
        var me = this
            ,model = Ext.create(modelName, {
                src: me.src,
                config: me.config,
                user: me.user
            })
            
        model.syncData(function(data, cb) {
            me.syncRecordOnServer(data, cb, conn)
        }, function() {
            model.destroy()
            cb()            
        })
    }
    
    ,syncRecordOnServer: function(data, cb, conn) {
        var me = this;
        me.callSelfMethod(data, 'saveRecordOnServer', conn, 'binnary', function(res) {
            cb(res)
        })
        
    }
     
    ,$saveRecordOnServer: function(data, cb, conn) {
        var me = this;
        
        [
            function(next) {
                if(data &&  data.data && data.data.data) {
                    me.checkModuleAccess(data.model, next)        
                } else
                    cb({success: false})
            }
            
            ,function(permis, next) {
                data.data.stime = (new Date()).getTime()
                data.data.ltime = null;
                if(data.data.data.removed) {
                    if(permis.del)
                        me.removeRecord(data.data, next)
                    else
                        cb({success: false})
                } else
                    me.upsertRecord(data.data, permis, next)
            }
            
            ,function(res) {
                if(res) { 
                    cb({success: true, stime: data.data.stime})
                } else {
                    cb({success: false})
                }
            }
            
        ].runEach()
    } 
    
    ,checkModuleAccess: function(module, cb) {
        this.callModel('Admin.model.User.getUserInfo', {auth: this.user.id}, function(inf) {
            if(inf.superuser) {
                cb({read: true, add: true, modify: true, del: true})
                return;
            } else if(inf.group && inf.group.modelAccess) {
                var m = module.replace(/./g, '-')
                if(inf.group.modelAccess[m]) {
                    cb(inf.group.modelAccess[m])
                    return;
                }
            }
            cb({read: false, add: false, modify: false, del: false})
        })
    }
    
    ,removeRecord: function(data, cb) {
        var set = {}
        for(var i in data.data) if(i != '_id') set[i] = data.data[i]
        this.src.db.collection(data.collection).update({_id: data.data._id}, set, function(e,d) {
            cb(!e)
        })
    }
    
    ,upsertRecord: function(data, permis, cb) {
        if(permis.add && permis.modify) {
            this.src.db.collection(data.collection).update({_id: data.data._id}, data.data, {upsert: 1}, function(e,d) {
                cb(!e)
            })    
        } else
        if(permis.add && !permis.modify) {
            this.src.db.collection(data.collection).insert(data.data, function(e,d) {
                cb(!e)
            })    
        } else
        if(!permis.add && permis.modify) {
            var set = {}
            for(var i in data.data) if(i != '_id') set[i] = data.data[i]
            this.src.db.collection(data.collection).update({_id: data.data._id}, set, function(e,d) {
                cb(!e)
            })    
        } else
            cb(false)
    }
    
    
})