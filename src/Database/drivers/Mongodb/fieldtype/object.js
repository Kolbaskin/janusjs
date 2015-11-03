/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.array
 * @extend Database.fieldtype.Field
 * Array field
 */
Ext.define('Database.drivers.Mongodb.fieldtype.object', {
    extend: 'Database.fieldtype.Field'
    
    /*
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {      
        var fields;
        if(value) {
            if(!Ext.isArray(value)) value = [value]
        }
        
        for(var i=0;i<model.fields.length;i++) {
            if(model.fields[i].name == name) {
                if(model.fields[i].fields) fields = model.fields[i].fields
                break;
            }
        }
        
        if(fields) {
            this.prepFields(model, fields, value, name,  callback)    
        } else {       
            callback(value);
        }
    }
    ,prepFields: function(model, fields, value, name, cb) {
        var n = 0;
        var ff = function(field, callback) {
            (model.db.fieldTypes[field.type] || model.db.fieldTypes.Field)
            .getValueToSave(model, value[field.name], value, {}, name + '.' + field.name, function(v) {
                value[field.name] = v
                callback()
            })
        }
        
        var f = function() {
            if(n>=fields.length) {
                cb(value)
                return;
            }
            ff(fields[n], function() {
                n++;
                f()
            })
        }
        f()
    }
    */
    
    ,getFilterValue: function(model, filter, name, callback) {
        var nm = name.split('.')[0]  
        for(var i=0;i<model.fields.length;i++) {
            if(model.fields[i].name == nm) {
                if(model.fields[i].filterType) {
                    (model.db.fieldTypes[model.fields[i].filterType] || model.db.fieldTypes.Field)
                    .getFilterValue(model, filter, name, function(v) {
                        callback(v) 
                    })
                    return;
                } 
            }
         }
         callback(filter)  
    }
    
    
})