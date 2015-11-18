var fs = require('fs')

Ext.define("Database.Base", {
    
    extend: 'Ext.Base'
    
    /**
     * @method
     * Connect to a database
     * @param {Object} config
     * @param {Function} callback
     */
    
    /**
     * @method
     * Select the database
     * @param {String} database
     * @param {Function} callback
     */
     
    /**
     * @method
     * Closing a connection
     * @param {Function} callback
     */
    
    ,constructor: function(cfg) {
        this.readFieldTypes()
    }
    
    /**
     * @method
     * Show error log
     * @param {Object} error
     * @param {String} message Optional
     */
    ,error: function(err) {
        console.log('Error #', err)
    }
    
    /**
     * @method
     * Destroying this
     */
    ,destroy: function() {
        var me = this;
        me.close(function() {
            delete me;
        })
    }
    
    /**
     * @method
     * Creating a collection object
     * @param {String} collection
     */
    ,collection: function(collection) {
        var me = this
            ,name = Object.getPrototypeOf(this).$className.replace(/Database$/, 'Collection')
        
        return  Ext.create(name, {
            db: me,
            collection: collection
        })
    }
    
    /**
     * @method
     * Getting a valid field types
     * @param {String} collection
     */
    ,readFieldTypes: function(callback) {
        var me = this
            ,className = Object.getPrototypeOf(this).$className.replace(/Database$/, 'fieldtype')
            ,baseFldDir = __dirname
            ,driverFldDir = baseFldDir + '/' + className.split('.').splice(1).join('/')
        
        me.fieldTypes = {};
        
        [
            function(call) {
                fs.readdir(driverFldDir, function(err, files) {
                    if(files) {
                        files.each(function(file) {
                            file = file.substr(0,file.length - 3);
                            me.fieldTypes[file] = Ext.create(className + '.' + file, {db: me})
                        })
                    }  
                    call()
                })
            }
            ,function(call) {
                fs.readdir(baseFldDir + '/fieldtype', function(err, files) {
                    
                    if(files) {
                        files.each(function(file) {
                            file = file.substr(0,file.length - 3);
                            if(!me.fieldTypes[file]) 
                                me.fieldTypes[file] = Ext.create('Database.fieldtype.' + file, {db: me})
                        })
                    }  
                    call()
                })
            }
            ,function() {
                me.ready = true; 
                if(!!callback) callback()
            }
        ].runEach();
    }
    
    /**
     * @method
     * Getting data records with sorting and limiting
     * @param {String} collection The collection name
     * @param {Object} find
     * @param {Object} fields
     * @param {Object} sort
     * @param {Number} start
     * @param {Number} limit
     * @param {Function} callback The callback gets an object like this: {total: 100, list: [array of results]} 
     */
    ,getData: function(collection, find, fields, sort, start, limit, callback) {
        callback(null)
    }
    
    ,afterBuildWhere: function(find, model, callback) {
        callback(find)
    }
    
    ,buildWhere: function(params, model, callback) {
        var me = this
            ,find = (model.find || {});


        var fin = function(find) {
            me.afterBuildWhere(find, model, callback)
        };
        
        [   
            function(call) {
                if(params && params.filters && Ext.isArray(params.filters)) {
                    call(params.filters)
                } else
                    fin({})
            }
            
            // Search by query in string fields
            ,function(filters, call) {
                if(filters.length && filters[0] && filters[0]._property == 'query') {
                    
                    me.fieldTypes.string.getFilterValue(null, {value: filters[0]._value, operator: 'like'}, 'query', function(res) {
                        find.$or = []
                        model.fields.each(function(field) {
                            if(field.filterable && field.type == 'string' && res && res.query) {
                                var cond = {}
                                cond[field.name] = res.query
                                find.$or.push(cond)
                            }
                        })
                        call(false)
                    })
                } else 
                    call(filters)
            }
            
            // Search by filters
            ,function(filters, call) {
                if(!filters) {
                    call();
                    return;
                }
                find.$and = []
            
                var func = function(i) {
                    if(i>=filters.length) {
                        call();
                        return;
                    }
                    var filter = filters[i]._property? {
                        property: filters[i]._property,
                        value: filters[i]._value,
                        operator: filters[i]._operator
                    }:filters[i];
                    
                    var cond = {}
                   
                    for(var j=0;j<model.fields.length;j++) {
                        if(model.fields[j].name == filter.property.split('.')[0] || model.fields[j].mapping == filter.property) {
                            var fldTp = me.fieldTypes.Field
                            if(model.fields[j].type && me.fieldTypes[model.fields[j].type]) 
                                fldTp = me.fieldTypes[model.fields[j].type]    
                            fldTp.getFilterValue (model, filter, filter.property, function(prm) {
                                if(prm) {                                   
                                    find.$and.push(prm)
                                }
                                func(i+1)
                            })
                            return;
                        }
                    }
                    func(i+1)
                }
                func(0);                
            }
                                    
            ,function(call) {
                if(!params.showRemoved) find.removed = {$ne:true}
                call();
            }
            
            ,function(call) {
                for(var i in model.fields) {
                    if(
                        params.parentField && 
                        params.parentCode &&
                        model.fields[i].name == params.parentField
                    ) {
                        if(model.fields[i].type == 'ObjectID') {
                            find[params.parentField] = me.fieldTypes.ObjectID.getValueToSave(model,params.parentCode)
                        } else {
                            me.fieldTypes[model.fields[i].type].getFilterValue(model, {value: params.parentCode, property: model.fields[i].name}, model.fields[i].name, function(v) {
                                var o = {}
                                o[model.fields[i].name] = v[model.fields[i].name]
                                find.$and.push(o)
                                fin(find)
                            })
                            return;
                        }
                    }      
                }
                if(find.$and && !find.$and.length) delete find.$and;
                fin(find)
            }
        ].runEach();
    }
    
    ,checkCollection: function(model, callback) {
        if(!!callback) callback()    
    }
    
    
    
})