/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.array
 * @extend Database.fieldtype.Field
 * Array field
 */
Ext.define('Database.drivers.Mongodb.fieldtype.array', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, cb) {      
        
        var callback = function(val) {
            cb(val? val : [])
        }

        var items;
        if(value) {
            if(!Ext.isArray(value)) value = [value]
        }
        
        for(var i=0;i<model.fields.length;i++) {
            if(model.fields[i].name == name) {
                if(model.fields[i].itemsType) {
                    this.prepItemsType(model, model.fields[i].itemsType, value, newRecord, name,  callback)
                    return;
                } else
                if(model.fields[i].items) items = model.fields[i].items
                break;
            }
        }
        
        if(items) {
            this.prepItems(model, items, value, name,  callback)    
        } else {       
            callback(value);
        }
    }
    
    ,prepItemsType: function(model, itemsType, value, newRecord, name,  callback) {
        if(!value || !Ext.isArray(value)) {
            callback(null)
            return;
        }
        var ff = function(i) {
            if(i>=value.length) {
                callback(value)
                return;
            }
            (model.db.fieldTypes[itemsType] || model.db.fieldTypes.Field)
            .getValueToSave(model, value[i], newRecord, {}, name, function(v) {
                value[i] = v
                ff(i+1)
            })
        }
        ff(0)
    }
    
    ,prepItems: function(model, items, value, name, cb) {

        if(!value) {
            cb([])
            return;
        }

        
        var ff = function(val, callback) {
            var out = {}
            var f = function(i) {
                if(i>=items.length) {
                    callback(out) 
                    return;
                }
                if(val[items[i].name]) {
                    (model.db.fieldTypes[items[i].type] || model.db.fieldTypes.Field)
                    .getValueToSave(model, val[items[i].name], val, {}, name + '.' + items[i].name, function(v) {
                        out[items[i].name] = v
                        f(i+1)
                    })
                } else {
                    out[items[i].name] = null;
                    f(i+1)
                }
            }
            f(0)
        }
        
        var f = function(i) {
            if(i>=value.length) {
                cb(value)
                return;
            }
            ff(value[i], function(val) {
                value[i] = val
                f(i+1)
            })
        }
        f(0)
        
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
         for(var i=0;i<model.fields.length;i++) {
            if(model.fields[i].name == name) {
                if(model.fields[i].itemsType) {
                    (model.db.fieldTypes[model.fields[i].itemsType] || model.db.fieldTypes.Field)
                    .getValueToSave(model, filter.value, {}, {}, name, function(v) {
                        var f = {}
                        f[name] = v
                        callback(f) 
                    })
                    return;
                } 
            }
         }
         callback(filter)  
    }
})