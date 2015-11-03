/**
 * @class Core.data.DataModel
 * @extend Core.AbstractModel
 * 
 * Server
 * 
 * 
 * Server side data model
 */
 
var excelbuilder = require('msexcel-builder')
    ,crypto = require('crypto')
    ,BSON = require('bson').pure().BSON;
 
Ext.define('Core.data.DataModel', {
    extend: 'Core.AbstractModel'

    ,maxLimit: 50    
    
    ,constructor: function(cfg) {
        var me = this;
        if(me.dbType && cfg.src[me.dbType]) {       
            me.db = cfg.src[me.dbType]
        } else              
        if(cfg.src && cfg.src.db) {
            me.db = cfg.src.db
            if(me.collection) me.dbCollection = cfg.src.db.collection(me.collection)   
        }

        if(cfg.config && cfg.config.debug) {
            me.db.checkCollection(me)
        }
        
        

        me.callParent(arguments)
    }

    /**
     * @method
     * Server method.
     * 
     * Create find object
     * @param {Object} params request params
     * @param {Function} callback
     * 
     */
    ,buildWhere: function(params, callback) {
        this.db.buildWhere(params, this, callback)
    }
        
    /**
     * @method
     * Server method
     * 
     * Getting readable fields for the request
     * @param {Object} params request params
     * @param {Function} callback
     * 
     */
    ,getReadableFields: function(params, callback) {
        var me = this
            ,fields = {}
            ,queryFieldSet  
        if(params) {
            if(params.fieldSet) {
                if(Ext.isString(params.fieldSet)) queryFieldSet = params.fieldSet.split(',')
                else queryFieldSet = params.fieldSet
            } 
        }
        me.fields.each(function(field) {
            if(field.visible) {
                if(!queryFieldSet || queryFieldSet.indexOf(field.name) != -1) { 
                    if(field.mapping) fields[field.mapping] = 1
                    else  fields[field.name] = 1
                }
            }
        })
        fields._id = 1
        callback(fields);
    }
    
    /**
     * @method
     * Server method
     * 
     * Build object for results sorting
     * @param {Object} params request params
     * @param {Function} callback
     * 
     */
    ,buildSort: function(params, callback) {
        var me = this
            ,sr
            ,sort = {}
        if(params.sorters && Ext.isArray(params.sorters) && params.sorters.length) {    
            for(var i=0;i<me.fields.length;i++) {
                for(var j=0;j<params.sorters.length;j++) {
                    sr = params.sorters[j]._property? {
                        property: params.sorters[j]._property,
                        direction: params.sorters[j]._direction
                    }:params.sorters[j]
                    if(sr.property == me.fields[i].name) {
                        sort[me.fields[i].name] = sr.direction == 'ASC'? 1:-1
                    }
                }
            }  
        } else
        if(params.sort) {
            if(typeof params.sort === "object") {
                for(var i=0;i<me.fields.length;i++) {
                    if(params.sort[me.fields[i].name]) {
                        sort[me.fields[i].name] = params.sort[me.fields[i].name]
                    }
                }
            } else {        
                sort[params.sort] = (!!params.dir && params.dir == 'ASC'? 1:-1)
            }
        } else {
            for(var i=0;i<me.fields.length;i++) {
                if(me.fields[i].sort) {
                    sort[me.fields[i].name] = me.fields[i].sort
                }
            }
        }
        
        
        
        callback(sort);
    }
    
    /**
     * @method
     * Server method
     * 
     * Getting results limits
     * @param {Object} params request params
     * @param {Function} callback
     * 
     */
    ,buildLimits: function(params, callback) {
        var start = params.start || 0
            ,limit = params.limit || 200
            
        start = parseInt(start)
        limit = parseInt(limit)
        if(isNaN(start)) start = 0;
        if(isNaN(limit)) limit = 200;

        if(limit> this.maxLimit) limit = this.maxLimit;        
        
        callback(start, limit)
    }
    
    /**
     * @method
     * Server method
     * 
     * Preparing found data
     * @param {Object} data list of result records 
     * @private
     */
    ,builData: function(data, callback, fields) {
        var me = this
            ,i = 0
        
        
        var func = function() {
            if(i>=data.length) {
                callback(data)
                return;
            }
            me.prepRecord(data[i], function(rec) {
                data[i] = rec;
  
                i++;
                func(i)
            })
        };
        
        [
            function(next) {
                me.fields.each(function(r){
                    if((!fields || fields[r.name]) && r.bindTo) {
                        
                        if(!me.binds) me.binds = {}
                        me.binds[r.name] = r.bindTo
                    }
                }) 
                next()
            }
            
            ,function(next) {
                if(me.binds) next()
                else func();
            }
            
            ,function(next) {
                me.bindsKeys = {}
                data.each(function(r) {
                    for(var i in r) {
                        if(me.binds[i]) {
                            if(!me.bindsKeys[i]) me.bindsKeys[i] = {}
                            if(!me.bindsKeys[i][r[i]]) me.bindsKeys[i][r[i]] = r[i]
                        }
                    }
                })
                next()
            }
            
            ,function(next) {
                
                var keys = []
                for(var i in me.binds) keys.push(i)
                var f = function(i) {
                    if(i>=keys.length) {
                        func()
                        return;
                    }
                    me.getBindValues(me.binds[keys[i]], me.bindsKeys[keys[i]], function(d) {
                        if(d) me.binds[keys[i]] = d
                        f(i+1)    
                    })
                }
                f(0)
            }
        ].runEach()
    }
    
    
    ,getBindValues: function(sets, keys, cb) {
        if(!keys || !sets || !sets.keyField) {
            cb()
            return;
        }

        var find = {}, ids = []

        for(var i in keys) if(keys[i]) ids.push(keys[i])       
        
        find[sets.keyField] = {$in: ids}

        sets.fields[sets.keyField] = 1;
        this.src.db.collection(sets.collection).find(find, sets.fields).toArray(function(e,d) {
            cb(d)    
        })
    }
    
    /**
     * @method
     * Server method
     * 
     * Alias of "getControllerName"
     * @private
     */
    ,getName: function() {
        return this.getControllerName()//Object.getPrototypeOf(this).$className    
    }
    
    /**
     * @method
     * Server method
     * 
     * Getting short name of the model
     * @private
     */
    ,getShortName: function() {
        return this.getName().replace(/\./g,'-');
        //var s = this.getName().split('.');
        //return s[s.length-3] + '-' + s[s.length-1];
    }
    
    /**
     * @method
     * Server method
     * 
     * Prepare one result record for returning
     * @param {Object} rec one record of results
     * @param {Function} callback
     * @private
     */
    ,prepRecord: function(rec, callback) {
        var me = this
            ,i = 0
        
        var func = function() {
            if(i>=me.fields.length) {
                callback(rec);
                return;
            }
            var log = false;
            for(var j in rec) {
                if(j == me.fields[i].name) {
                    log = true;
                    break;
                }
            }
            if(me.fields[i].bindTo && me.binds[me.fields[i].name]) {
                for(var j = 0;j<me.binds[me.fields[i].name].length;j++) {
                    if(me.binds[me.fields[i].name][j][me.fields[i].bindTo.keyField]+'' == rec[me.fields[i].name]+'') {
                        rec[me.fields[i].name] = me.binds[me.fields[i].name][j];
                        break;
                    }
                }
                i++;
                func.nextCall()
            } else
            if(me.fields[i].type && log && me.db.fieldTypes[me.fields[i].type]) {
                me.db.fieldTypes[me.fields[i].type].getDisplayValue(me, rec, me.fields[i].name, function(val) {
                    rec[me.fields[i].name] = val   
                    i++;
                    func.nextCall()
                }, me.fields[i])
            } else {
                i++;
                func.nextCall()
            }
        }
        func();
    }
    
    /**
     * @method
     * Server method
     *
     * Getting data by params
     * @param {Object} params 
     * @param {Function} callback
     * @private
     */
    ,getData: function(params, callback) {
        var me = this;
        // fix for extjs >= 5
        if(params._start) params.start = params._start;
        if(params._limit) params.limit = params._limit;
        if(params._filters) params.filters = params._filters;
        if(params._sorters) params.sorters = params._sorters;
        
        if(!params.filters) params.filters = [];
        
        [
            function(call) {
                if(params && params.params && params.params.reorder) {
                    if(Ext.isString(params.params.reorder))  {
                        try {
                            params.params.reorder = JSON.parse(params.params.reorder)  
                        } catch(e) {
                            params.params.reorder = null
                        }
                    }
                    if(params.params.reorder) {
                        me.reorder(params.params.reorder, function() {
                            call()    
                        })    
                    } else
                        call()
                } else 
                    call()
            }
            
            ,function(call) {
                me.buildWhere(params, function(find) {
                    call(find)    
                })
            }
            ,function(find, call) {
                me.getReadableFields(params, function(fields) {
                    call(find, fields)
                })
            }
            ,function(find, fields, call) {
                 me.buildSort(params, function(sort) {
                    call(find, fields, sort)
                })    
            }
            ,function(find, fields, sort, call) {
                 me.buildLimits(params, function(start, limit) {
                    call(find, fields, sort, start, limit)
                })    
            }
            ,function(find, fields, sort, start, limit, call) {
                if(me.find) {
                    for(var i in me.find)  find[i] = me.find[i];  
                }
                find.removed = {$ne: true}
                me.db.getData(me.collection, find, fields, sort, start, limit, function(total, data) {
                    call(total, data)
                })
            }
            ,function(total, data, call) {
                if(!!me.afterGetData) {
                    me.afterGetData(data, function(data) {
                        call(total, data)    
                    })
                } else call(total, data)
            }
            ,function(total, data) {
                if(data) {
                    me.builData(data, function(data) {
                
                        callback({total: total, list: data},null)
                    })   
                } else
                    callback({total: 0, list: []},null)
            }            
        ].runEach();
    }
    
    /**
     * @method
     * Server method
     * 
     * Creating record for saving
     * @param {Object} data new record
     * @param {Object} cur_data old saved data
     * @param {Function} callback
     * @private
     */
    ,createDataRecord: function(data, cur_data, callback, fields) {
        var me = this,
            insdata = {}, 
            i = 0,
            f = function() {
                if(i>=me.fields.length) {
                    callback(insdata)
                    return;
                }
                
                if(me.fields[i].name  == '_id' || me.fields[i].mapping  == '_id') {
                    i++;
                    f.nextCall()
                    return; 
                }
                var cnf = me.fields[i].cnf || {}
                    ,name = me.fields[i].mapping || me.fields[i].name;
                if(me.fields[i].editable && (!fields || fields.indexOf(name) != -1)) { 
                    
                    (me.db.fieldTypes[me.fields[i].type] || me.db.fieldTypes.Field)
                    .getValueToSave(me, data[name], data, cur_data, name, function(val, saveNull) {
                        if((val !== null && val !== undefined) || (val === null && saveNull)) insdata[name] = val   
                        i++;
                        f.nextCall()
                    })
                } else {
                    i++;
                    f.nextCall()
                }
            }
        
        f()
    }
    
    /**
     * @method
     * Server and client method
     * 
     * Saving data
     * @param {Object} data record to save
     * @param {Function} callback
     * @private
     */
    ,write: function(data, callback, permissions, fields) {
        var me =this
            ,insdata = {}
            ,actionType;



        [
            function(call) {
                if(!!me.beforeSave) {
                    me.beforeSave(data, call);    
                } else call(data)
            }
            
            ,function(data, call) {
                if(!data || data.success === false) {
                    callback(data)
                    return;
                }
                call(data)
            }
            
            ,function(data, call) {
                    if(data && data._id) {
                        call('upd', data)
                    } else {
                        call('ins', data)

                    }
                //}, null, data)
            }
            
            ,function(type, data, call) {
            // Updating
            
                actionType = type
                if(type == 'ins') {
                    call(true, data)
                    return;
                }
                
                me.db.fieldTypes.ObjectID.getValueToSave(me, data._id+'', null, null, null, function(_id) {
                   
                    me.db.collection(me.collection).findOne({_id: _id}, function(err, cur_data) {
                        if(cur_data) {
                            var fff = function(permis) {
                                if(permis.modify) {
                                    me.createDataRecord(data, cur_data, function(data) {
                                        data.mtime = new Date()
                                        data = me.setModifyTime(data)
                                        
                                        me.db.collection(me.collection).update({_id: _id}, {$set: data}, function(e,d) {
                                            data._id = _id
                                            call(false, data)
                                        })
                                    }, fields)
                                } else
                                    me.error(401)
                            }
                            
                            if(permissions) 
                                fff(permissions)
                            else 
                                me.getPermissions(fff, null, cur_data)
                                                      
                        } else {
                            data._id = _id
                            actionType = 'ins'
                            call(true, data)
                        }
                    })
                })
            }
            
            ,function(ins, data, call) {
            // Inserting 
                if(ins) {
                    var _id = data._id  
                    me.createDataRecord(data, null, function(data) {
                        data.ctime = new Date()
                        data.mtime = new Date()
                        if(me.user) data.maker = me.user.id
                        data = me.setModifyTime(data)
                        if(_id) data._id = _id
                        var fff = function(permis) {
                            if(permis.add) {      
                                me.db.collection(me.collection).insert(data, function(e, d) {
                                    if(d && d[0]) call(d[0])
                                    else {
                                        console.log('Insert error:', e)                                        
                                        callback({success:false});
                                        return;
                                    }
                                }) 
                            } else
                                me.error(401)
                        }
                        
                        if(permissions) 
                            fff(permissions)
                        else 
                            me.getPermissions(fff)
                    }, fields)
                } else {
                    call(data)
                }
            }
            
            ,function(data, call) {
                if(!!me.afterSave) {
                    me.afterSave(data, function(data) {
                        call(data);    
                    })    
                } else {
                    call(data);
                }    
            }
            
            ,function(data, call) {
                me.builData([data], function(data) {      
                    me.addDataToSearchIndex(data, function() {
                        me.changeModelData(Object.getPrototypeOf(me).$className, actionType, data[0])
                        callback({success:true, record: data[0]});
                    })
                })    
            }
            
         ].runEach()
     }
     
     ,addDataToSearchIndex: function(data, cb) {
         Ext.create('Core.search.SearchEngine', {model: this}).indexer(data, cb)
     }
     
     /**
      * @method
      * Server method
      *
      * @param {Array} ids
      * @param {Function} callback
      */
     ,beforeRemove: function(ids, callback) {
         callback(ids)
     }
     
     /**
      * @method
      * Server method
      *
      * @param {Array} ids
      * @param {Function} callback
      */
     ,afterRemove: function(ids, callback) {
         callback(true)
     }
     
     /**
      * @method
      * Server and client method
      *
      * @param {Array} ids
      * @param {Function} callback
      */
     ,remove: function(data, callback) {
        var me = this;
        [
            function(call) {
                if(data && Ext.isArray(data)) {
                    var ids = []
                    
                    var fnc = function(i) {
                        if(i>=data.length) {
                            if(ids.length) {
                                call(ids)
                            } else {
                                callback({success:false})
                            }
                            return;
                        }
                        me.db.fieldTypes.ObjectID.getValueToSave(me, data[i], null, null, null, function(_id) {
                            if(_id) {
                                ids.push(_id)    
                            } 
                            fnc(i+1)
                        })
                    }
                    fnc(0)
                }
            }
            // Before removing
            ,function(ids, call) {
                me.beforeRemove(ids, function(ids) {
                    if(ids && ids.length) call(ids)
                    else callback({success:false})
                })    
            }
            // Removing
            ,function(ids, call) {
                if(!me.removeAction || me.removeAction == 'mark') {
                // Marking as removed
                
                    var set = {removed: true}
                    set = me.setModifyTime(set)
                    me.db.collection(me.collection).update({_id:{$in: ids}}, {$set: set}, {multi:true}, function(e,d) {
                        call(ids)    
                    })
                } else {
                // Remove from collection
                    me.db.collection(me.collection).remove({_id: {$in: ids}}, {multi: 1}, function(e,d) {
                        call(ids)    
                    })
                }
            }
            
            ,function(ids, call) {
                me.removeFromSearchIndex(ids, function() {
                    call(ids)    
                })
            }
            
            // After removing
            ,function(ids, call) {
                me.afterRemove(ids, function(result) {
                    if(result === null || result) {
                        me.changeModelData(Object.getPrototypeOf(me).$className, 'remove', ids)
                        callback({success:true})
                    } else callback({success:false})
                })    
            }           
        ].runEach();
    }
    
    ,removeFromSearchIndex: function(ids, cb) {
         Ext.create('Core.search.SearchEngine', {model: this}).remove(ids, cb)
     }
    
    /**
      * @method
      * Server method
      *
      * @param {Object} record
      * @param {Function} callback
      */
    ,beforeCopy: function(record, callback) {
        callback(record)
    }
    
    /**
      * @method
      * Server method
      *
      * @param {Object} record
      * @param {Function} callback
      */
    ,afterCopy: function(record, callback) {
        callback(record)
    }
     
    /**
     * @method
     * Server and client method
     *
     * Create copy of a record
     * @param {ObjectId} _id Id of a record to copy
     * @param {Function} callback
     * @private
     */
    ,copy: function(_id, callback) {
        var me = this;
        [
            function(call) {
                me.db.collection(me.collection).findOne({_id: _id}, {}, function(e,record) {
                    if(record)
                        call(record)
                    else
                        callback(null)
                })    
            }
            ,function(record, call) {
                me.beforeCopy(record, function(record) {
                    if(record)
                        call(record)
                    else
                        callback(null)
                })
            }
            ,function(record, call) {
                
                var savedID = []
                savedID.push(record._id)
                
                delete record._id
                
                record = me.setModifyTime(record)
                
                me.db.collection(me.collection).insert(record, function(e, data) {
                    if(data && data[0]) {
                        if(me.binded) {
                            me.copyBindedData(savedID[0], data[0]._id, function() {
                                call(data[0])    
                            })
                        } else
                            call(data[0])
                    }
                    else
                        callback(null)
                })    
            }
            ,function(data, call) {
                me.changeModelData(Object.getPrototypeOf(me).$className, 'ins', data)
                call(data)    
            }
            
            ,function(record, call) {
                me.afterCopy(record, function(record) {
                    if(record)
                        call(record)
                    else
                        callback(null)
                })
            }
            ,function(record, call) {
                me.builData([record], function(data) {
                    callback(data[0]);
                })
            }
        ].runEach()
    }
    
    ,copyBindedData: function(srcId, dstId, cb) {
        var me = this, i = 0;
        var f= function() {
            if(i>=me.binded.length) {
                cb()
                return;
            }
            me.copyBindedDataRecs(srcId, dstId, me.binded[i], function() {
                i++;
                f();
            })
        }
        f()
    }
    
    ,copyBindedDataRecs: function(srcId, dstId, bind, cb) {
        var me = this
            ,model = Ext.create(bind.model, {src: me.src, config: me.config});
            
        [
            function(next) {
                var find = {removed: {$ne: true}}
                find[bind.pidField] = srcId;
                me.src.db.collection(model.collection).find(find, {_id: 1}).toArray(function(e, data) {
                    if(data && data.length) {
                        var ids = []
                        data.each(function(d) {ids.push(d._id)})
                        next(ids)
                    } else
                        cb()
                })    
            },
            function(ids, next) {
                var i = 0;
                var f = function() {
                    if(i>=ids.length) {
                        cb();
                        return;
                    }
                    model.copy(ids[i], function(d) {
                        if(d) {
                            var set = {}
                            set[bind.pidField] = dstId;
                            me.src.db.collection(model.collection).update({_id: d._id}, {$set:set}, function() {
                                i++;
                                f.nextCall();
                            })
                        } else {
                            i++;
                            f.nextCall();
                        }
                    })
                }
                f()
            }
        ].runEach();    
        
    }
    
    /**
      * @method
      * Server method
      *
      * @param {Array} movable array of record id for moveing
      * @param {String} fieldName field name of sorting
      * @param {Number} indx index for paste
      * @param {Function} callback
      */
    ,beforeReorder: function(movable, fieldName, indx, callback) {
        callback(movable, fieldName, indx)
    }
    
    /**
      * @method
      * Server method
      *
      * @param {Array} movable array of record id for moveing
      * @param {String} fieldName field name of sorting
      * @param {Number} indx index for paste
      * @param {Function} callback
      */
    ,afterReorder: function(movable, fieldName, indx, callback) {
        callback(movable)
    }
    
    /**
      * @method
      * Server method
      *
      * @param {Object} params
      * @param {Function} callback
      */
    ,reorder: function(params, callback) {
        var me = this;
        [
            // get id param
            function(call) {
                if(params && params.dropRec && params.dropRec._id) {
                    me.src.db.fieldTypes.ObjectID.StringToValue(params.dropRec._id, function(id) {
                        if(id)
                            call(id)
                        else
                            callback(false) 
                    })
                } else 
                    callback(false) 
            }
            
            // validating params
            ,function(id, call) {
                if(
                    params &&
                    params.records && Ext.isArray(params.records) && params.records.length                    
                ) {
                    var movable = []
                        ,purp = id;
                    params.records.each(function(r) {
                        if(r && r._id) {
                            r._id = me.src.db.fieldTypes.ObjectID.StringToValue(r._id)
                            if(r._id) movable.push(r._id) 
                        }
                    })
                    if(purp && movable.length) {
                        call(purp, movable)  
                        return;
                    }
                }
                callback(false)
            }
            // finding sortfield
            ,function(purp, movable, call) {
                for(var i=0;i<me.fields.length;i++) {
                    if(me.fields[i].type == 'sortfield') {
                        call(purp, movable, me.fields[i].name)
                        return;
                    }
                }
                callback(false)
            }
            // getting sort field value
            ,function(purp, movable, fieldName, call) {
                var fld = {}
                fld[fieldName] = 1;
                me.db.collection(me.collection).findOne({_id: purp}, fld, function(e, d) {
                    if(d && (d[fieldName] || d[fieldName] === 0)) {
                        call(movable, fieldName, d[fieldName])  
                        return;
                    }
                    callback(false)
                })
            }
            
            ,function(movable, fieldName, indx, call) {
                me.beforeReorder(movable, fieldName, indx, call)
            }
            
            // moving other items down
            ,function(movable, fieldName, indx, call) {
                var upd = {}
                    ,set = {}
                if(params.position && params.position != 'before') indx++ 
                upd[fieldName] = {$gte:indx}
                set[fieldName] = movable.length
                me.db.collection(me.collection).update(upd, {$inc: set}, {multi: true}, function(e,d, qr) {
                    call(movable, fieldName, indx)
                })
            }
            // updating movable items
            ,function(movable, fieldName, indx, call) {
                var i=0
                var func = function() {
                    if(i>=movable.length) {
                        call(movable, fieldName, indx)
                        return;
                    }
                    var set = {}
                    set[fieldName] = indx;
                    me.db.collection(me.collection).update({_id: movable[i]}, {$set: set}, function(e,d, qr) {
                        indx++;
                        i++;
                        func();
                    })
                }
                func();
            }
            
            ,function(movable, fieldName, indx) {
                me.afterReorder(movable, fieldName, indx, function() {
                    callback(true)    
                })
            }
            
        ].runEach();
    }
    
    /**
     * @method
     * Server method
     *
     * Sending changed model data to a websocket
     * @param {String} modelName
     * @param {String} eventName
     * @param {Object} data
     * @private
     */
    ,changeModelData: function(modelName, event, data, conn) {
        
        if(this.noChangeModel) return;
        
        if(!modelName) modelName = Object.getPrototypeOf(this).$className
        
        var me = this;
        
        [
            function(next) {
                me.beforeChangeModelData(data, event, function(data) {
                    next(data)
                })
            }
            
            ,function(data) {

                var params = {
                        model: modelName,
                        event: event,
                        data: data
                    }
                    ,mdlStr = modelName.replace(/\./g,'-')            
                    ,jdata, bdata;

                for(var i in me.src.wsConnections) {
                    if(
                        me.src.wsConnections[i].sUser || (
                        me.src.wsConnections[i].permis &&
                        me.src.wsConnections[i].permis[mdlStr] &&
                        me.src.wsConnections[i].permis[mdlStr].read
                    )) {
                        for(var j=0;j<me.src.wsConnections[i].conns.length;j++) {

                            
                            if(me.src.wsConnections[i].conns[j] != conn && me.isNeedWsSync(me.src.wsConnections[i].conns[j], params, i)) {
           
                                if(me.src.wsConnections[i].conns[j].isServer) {
                                    if(!bdata) bdata = BSON.serialize(params);
                                    me.src.wsConnections[i].conns[j].send(bdata);
                                } else {
                                    if(!jdata) jdata = JSON.stringify(params);
                                    me.src.wsConnections[i].conns[j].sendUTF(jdata);
                                }
                            }
                        }
                    }
                }
            }
        ].runEach()
    }
    
    ,beforeChangeModelData: function(data, event, cb) {
        cb(data)    
    }
    
    ,isNeedWsSync: function(conn, params, user_id) {
        return true;
    }
    
    /**
     * @method
     * @private
     * Server and client method
     *
     * Getting permissions of a current model
     * @param {Function} callback
     */
    ,getPermissions: function(callback, mn, data) {
       
        var me = this;   
        
        if(!mn) mn = me.getShortName();
        
        [
            function(call) {
                if(!me.user) 
                    callback({read: false, add: false, modify: false, del: false})
                else
                    call()
            }
            
            ,function(call) {      

                me.callModel('Admin.model.User.getUserAccessRates', {auth: me.user.id}, function(permis) {
                    
                    if(permis) 
                        call(permis)
                    else    
                        callback({read: false, add: false, modify: false, del: false})
                })
            }
            
            ,function(permis, call) {
                if(permis.superuser) // superuser cans all
                    callback({read: true, add: true, modify: true, del: true, ext: true})
                else
                    call(permis)
            }
            
            ,function(permis) {
                if(permis && permis.modelAccess && permis.modelAccess[mn])
                   callback(permis.modelAccess[mn]) 
                else 
                   callback({read: false, add: false, modify: false, del: false}) 
            }
        ].runEach()
    }
    
    /**
     * @method
     * Server method
     *
     * Getting module permissions
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$getPermissions: function(params, callback) {
        this.getPermissions(callback, null, params)       
    }
    
    /**
     * @method
     * Server method
     *
     * Saving changed record with checking access rights
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$write: function(data, callback) {
        var me = this;
        if(!data) {
            me.error(401)
            return;
        }
        if(data.noChangeModel) {
            me.noChangeModel = true;    
        }
        
        
        me.write(data, callback)
        /*
        me.getPermissions(function(permis) {
            if(data._id && permis.modify)
                me.write(data, callback)
            else if(!data._id && permis.add)
                me.write(data, callback)
            else
                me.error(401)
        })
        */
    }
    
    /**
     * @method
     * Server method
     *
     * Create copy of a record with checking access rights
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$copy: function(data, callback) {
        var me = this;
        [
            function(call) {
                if(data && data._id) {
                    me.src.db.fieldTypes.ObjectID.StringToValue(data._id, call)    
                } else
                    callback(null)
            } 
            ,function(id) {
                me.getPermissions(function(permis) {
                    if(permis.add)
                        me.copy(id, callback)
                    else
                        me.error(401)
                })
            }
        ].runEach()
    }
    
    /**
     * @method
     * Server method
     *
     * Remove records with checking access rights
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$remove: function(data, callback) {
        var me = this;
        me.getPermissions(function(permis) {
            if(permis.del)
                me.remove(data.records, callback)
            else
                me.error(401)
        }, null, data)
    }
    
    /**
     * @method
     * Server method
     *
     * Alias for private method getData with checking access rights
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$read: function(data, cb) {
        var me = this;
        me.getPermissions(function(permis) {
            if(permis.read)
                me.getData(data, cb)
            else
                me.error(401)
        }, null, data)
    }
    
    /**
     * @method
     * Server method
     *
     * Reordering records with checking access rights
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$reorder: function(data, cb) {
        var me = this;
        me.getPermissions(function(permis) {
            if(permis.modify)
                me.reorder(data, cb)
            else
                me.error(401)
        }, null, data)
    }
    
    /**
     * @method
     * Server method
     *
     * Creating XLS file
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$exportData: function(params, cb) {
        var me = this;

        [
            function(call) {
                me.buildWhere(params, function(find) {
                    call(find)    
                })
            }
            ,function(find, call) {
                me.getReadableFields(params, function(fields) {
                    call(find, fields)
                })
            }
            ,function(find, fields, call) {
                 me.buildSort(params, function(sort) {
                    call(find, fields, sort)
                })    
            }
            
            ,function(find, fields, sort, call) {
                me.db.getData(me.collection, find, fields, sort, 0, 10000, call)
            }
            ,function(total, data, next) {  
                if(data) 
                    me.export2xls(data, cb)   
                else
                    cb({})
            }
            
        ].runEach();
    }
    
    /**
     * @method
     * Server method
     *
     * Creating new ObjectId
     * @param {Object} params
     * @param {Function} callback
     * 
     */
    ,$getNewObjectId: function(data, cb) {
        this.src.db.createObjectId(this.collection, cb)
    }
    
    ,export2xls: function(data, cb) {
        var me = this
            ,fName
            ,workbook
            ,cols = me.fields.length
            ,rows = data.length
            ,sheet1 
            ,l = 1;
        
        [
            function(next) {
                if(me.beforeExport) {
                    me.beforeExport(data, next)
                } else
                    next()
            }
            ,function(next) {
                crypto.randomBytes(32, function(ex, buf) {
                    fName = buf.toString('hex') + '.xlsx';
                    next()    
                })    
            }
            ,function(next) {
                workbook = excelbuilder.createWorkbook(me.config.staticDir + me.config.userFilesDir, fName)
                sheet1 = workbook.createSheet('sheet1', cols+1, rows+1)
                
                var i = 1;
                for(var j=0;j<me.fields.length;j++) {
                    if(me.fields[j].exp !== false) 
                        sheet1.set(i++, l, me.fields[j].xlsTitle || me.fields[j].name);
                }
                l++;
                
                data.each(function(item) {
                    var i = 1;
                    for(var j=0;j<me.fields.length;j++) {
                        if(me.fields[j].exp !== false) {
                            if(me.fields[j].renderer) {
                                sheet1.set(i, l, me.fields[j].renderer(item[me.fields[j].name], item));
                            } else
                            if(me.db.fieldTypes[me.fields[j].type] && !!me.db.fieldTypes[me.fields[j].type].getExportValue) {
                                sheet1.set(i, l, me.db.fieldTypes[me.fields[j].type].getExportValue(item[me.fields[j].name]));
                            } else
                                sheet1.set(i, l, item[me.fields[j].name]);
                            i++;
                        }
                    }
                    l++;
                })
                
                workbook.save(function(ok){
                    cb({file: fName})
                });
            }
        ].runEach()
    }
    
    ,wsEvent_ins: function(conn, data, cb) {
        var me = this;
        me.getPermissions(function(permis) {
            if(data._id && permis.add) {
                me.upsertData(data, function() {
                    me.changeModelData(Object.getPrototypeOf(me).$className, 'ins', data, conn) 
                    cb()
                })
            }
        }, null, data)
    }
    
    ,wsEvent_upd: function(conn, data, cb) {
        var me = this;
        me.getPermissions(function(permis) {
            if(data._id && permis.modify) {
                me.upsertData(data, function() {
                    me.changeModelData(Object.getPrototypeOf(me).$className, 'upd', data, conn) 
                    cb()
                })
            }
        }, null, data)
    }
    
    ,wsEvent_remove: function(conn, data, cb) {
        var me = this;
        me.getPermissions(function(permis) {
            if(permis.del)
                me.removeData(data, function() {
                    me.changeModelData(Object.getPrototypeOf(me).$className, 'remove', data, conn) 
                    cb()
                })
            else
                me.error(401)
        }, null, data)
    }
    
    ,upsertData: function(data, cb) {
        data = this.setModifyTime(data)
        this.src.db.collection(this.collection).update({_id: data._id}, data, {upsert: true}, cb)
    }
    
    ,removeData: function(data, cb) {
        var me = this
            ,set = me.setModifyTime({removed: true})
        data.eachCb(function(id, next) {
           me.src.db.collection(me.collection).update({_id: id}, {$set: set}, next) 
        }, cb)
    }
    
    ,setModifyTime: function(data) {
        if(syncServerTime || !this.config.authoriz) {
            // socket connect OK
            data.stime = (new Date()).getTime() - syncServerTime;
            data.ltime = null
        } else {
            data.ltime = (new Date()).getTime();
            data.stime = null
        }
        return data;
    }
    
    ,syncData: function(servCb, cb) {
        var me = this;
        if(!this.collection) {
            cb()
            return;
        }

        var cursor = me.src.db.collection(me.collection).find({ltime:{$ne: null}}, {})
        me.syncDataNextRecord(cursor, servCb, function() {
            me.changeModelData(Object.getPrototypeOf(me).$className, 'ins', {}) 
            cb()
        })
    }
    
    ,syncDataNextRecord: function(cursor, servCb, cb) {
        var me = this;
        cursor.nextObject(function(e,d) {
            if(!d) {
                cb()
                return;
            }
            me.syncDataProcRecord(d, servCb, function() {
                me.syncDataNextRecord(cursor, servCb, cb)    
            })         
        })
    }
    
    ,syncDataProcRecord: function(data, servCb, cb) {
        var me = this;
        servCb({collection: me.collection, data: data}, function(res) {
            if(res && res.success && res.stime) {
                me.src.db.collection(me.collection).update({_id: data._id}, {$set: {ltime: null, stime: res.stime}}, function() {
                    cb()    
                })    
            }
        })
    }
    
    ,syncDataFromServer: function(data, cb) {
        var me = this;
        
        [
            function(next) {
                me.onBeforeSyncDataFromServer(data, next)
            }
            
            ,function(data, next) {
                me.src.db.collection(me.collection).findOne({_id: data._id}, {ltime: 1}, function(e, d) {
                    if(d) {
                        if((!d.ltime || (d.ltime - syncServerTime) < data.stime)) {
                            me.syncDataFromServerUpdate(data, cb)
                        } else {
                            cb({})
                        }
                    } else {
                        me.syncDataFromServerInsert(data, cb)
                    }
                })    
            }
            
        ].runEach()
    }
    
    ,syncDataFromServerUpdate: function(data, cb) {
        var me = this;
        data.ltime = null
        var set = {}
        for(var i in data) if(i != '_id') set[i] = data[i]
        me.src.db.collection(me.collection).update({_id: data._id}, {$set: set}, function(e, d) {
            me.onAfterSyncDataFromServer(set, 'upd', cb)    
        })
    }
    
    ,syncDataFromServerInsert: function(data, cb) {
        var me = this;
        data.ltime = null
        me.src.db.collection(me.collection).insert(data, function(e, d) {
            me.onAfterSyncDataFromServer(d[0], 'ins', cb)    
        })
    }
    
    ,onBeforeSyncDataFromServer: function(data, cb) {
       cb(data) 
    }
    
    ,onAfterSyncDataFromServer: function(data, action, cb) {
       cb({}) 
    }
    
})