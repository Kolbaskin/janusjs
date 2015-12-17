/**
 * Server parent class for DataModel
 */

Ext.define('Core.data.TreeDataModel', {
    extend: 'Core.data.DataModel'
    
    /**
     * @method
     * Getting module permissions
     * @public
     */
    //,$getPermissions: function(params, callback) {
    //    callback({read: true, add: true, modify: true, del: true})
    //}
     
    ,getData: function(params, callback) {
        var me = this, RootRecord;
       
        [
            function(call) {
                me.buildWhere(params, function(find) {
                    me.fields.leaf = 1
                    call(find)    
                })
            }
            
            ,function(find, call) {
                me.getReadableFields(params, function(fields) {
                    fields.leaf = 1
                    call(find,fields)    
                })
            }
                
            ,function(find, fields, call) {

                if(params.filters && params.filters.length) {
                    call(find, fields)
                    return;
                }

                if(params._id) params.id = params._id

                if(!params.id || params.id == 'root') {
                    me.src.db.collection(me.collection).findOne({root:true}, fields, function(e,data) {
                        if(data) {
                            find._id = data._id
                            RootRecord = data
                            call(find, fields);
                        } else callback(null, {code: 500, mess: 'Root node not found'})
                    })
                } else {
                    
                    find.pid = me.src.db.fieldTypes.ObjectID.StringToValue(params.id)
                    call(find, fields);
                }
            }
            
            ,function(find, fields, call) {
                if(RootRecord) {
                    me.builData([RootRecord], function(data) {
                        call(data)
                    })
                    return;
                }
                me.db.getData(me.collection, find, fields, {indx: 1}, null, null, function(total, data) {
                    call(data)    
                })
            }
            
            ,function(data) {
              
                me.builData(data, function(data) {
                    if(!Ext.isArray(data)) data = [data]
                    callback({list: data})
                })
            }
            
        ].runEach();
    }
    
    ,prepRecord: function() {
        arguments[0].id = arguments[0]._id
        this.callParent(arguments)
    }
    
    ,beforeReorder: function(indexes, recs, sortField, callback) {
        callback(recs)
    }
    
    ,afterReorder: function(data, callback) {
        callback(data)
    }
    
    
    /**
     * @scope: Server
     * @method
     * Reordering items in the pages tree
     * @public
     */
    ,reorder: function(params, callback) {
        var me = this;
        
        [
            function(call) {
                if(params && params.indexes && params.recs) {
                    call(params.indexes, params.recs)    
                } else {
                    callback(null)    
                }
            }
            
            ,function(indexes, recs, call) {
                for(var i=0;i<me.fields.length;i++) {
                    if(me.fields[i].type == 'sortfield') {
                        call(indexes, recs, me.fields[i].name)
                        return;
                    }
                }
                callback(false)
            }
            
            ,function(indexes, recs, sortField, call) {
                me.beforeReorder(indexes, recs, sortField, function(recs) {
                    if(recs) call(indexes, recs, sortField)
                    else callback(null)
                })
            }
            
            ,function(indexes, recs, sortField, call) {
                var rootId, func = function(i) {
                    if(i>=recs.length) {
                        call(indexes, recs, sortField)
                        return;
                    }
                    var id = me.src.db.fieldTypes.ObjectID.StringToValue(recs[i]? recs[i]._id:'')
                        ,pid = me.src.db.fieldTypes.ObjectID.StringToValue(recs[i].pid? recs[i].pid:'');
                        
                    if(!pid) pid = rootId;   
                    if(id && pid) {
                        me.src.db.collection(me.collection).update({_id:id}, {$set:{pid: pid}}, function(e,d,qr) {
                            func(i+1)    
                        })
                    } else {
                        callback(null)    
                    }
                }
                me.src.db.collection(me.collection).findOne({root:true}, {_id:1}, function(e,d) {
                    if(d) {
                        rootId = d._id  
                        func(0)
                    } else
                        callback(null)
                })
                
            }
            
            ,function(indexes, recs, sortField, call) {
                var id, set, keys = [], i;
                for(i in indexes) keys.push(i)
                i = 0;
                var f = function() {
                    if(i>=keys.length) {
                       call(indexes, recs, sortField)
                       return;
                    }
                    id = me.src.db.fieldTypes.ObjectID.StringToValue(keys[i])
                    if(id) {
                        set = {}
                        set[sortField] = indexes[keys[i]]
                        me.src.db.collection(me.collection).update({_id:id}, {$set: set}, function(e,d,qr) {
                            i++;
                            f();
                        })
                    } else {
                        i++;
                        f();
                    }
                }
                f()
            }
            ,function(indexes, recs, sortField, call) {
                recs.each(function(d) {
                    if(indexes[d._id+'']) d[sortField]=indexes[d._id+'']
                    return d;
                }, true)
                call(recs)
            }
            ,function(data) {
                me.afterReorder(data, function(data) {
                    if(data) callback({success: true, data: data})
                    else callback(null)
                })
            }
        ].runEach()
    }
    
    ,$remove: function(data, callback) {
        var me = this;
        me.getPermissions(function(permis) {
            if(permis.del)
                me.removeRecur(data.records, callback)
            else
                me.error(401)
        })
    }
    
    ,removeRecur: function(data, cb) {
        var me = this;
        me.noChangeLog = true;
        var i=0,f=function() {
            if(i>=data.length) {
                me.noChangeLog = false;
                cb({success:true})   
                me.changeModelData(Object.getPrototypeOf(me).$className, 'remove', data)
                return;
            }
            me.removeRecurOne(data[i], function() {
                i++;
                f()
            })
        }
        f()
    }
    
    ,removeRecurOne: function(id, cb) {
        var me = this, db = me.src.db;
        
        [
            function(next) {
                var pid = me.db.fieldTypes.ObjectID.getValueToSave(me, id)
                if(pid) {
                    db.collection(me.collection).find({pid: pid}, {_id:1}).toArray(function(e,d) {
                        if(d && d.length) {
                            var ids = []
                            d.each(function(r) {
                                ids.push(r._id + '')    
                            })
                            me.removeRecur(ids, function() {
                                next()    
                            })
                        } else
                            next()                            
                    })
                } else  
                    cb()
            }
            ,function(next) {
                me.remove([id], function() {
                    cb()    
                })    
            }
        ].runEach()
        
    }
    
    ,changeModelData: function(modelName, act, ids) {
        if(act == 'remove') {
            if(this.noChangeLog) return;
        }
        this.callParent(arguments)
    }

})