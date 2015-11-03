/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.ObjectID
 * @extend Database.fieldtype.Field
 * Mongodb ObjectId field
 */
var mongo = require('mongodb')
    ,BSON = mongo.BSONPure;
 
Ext.define('Database.drivers.Mongodb.fieldtype.ObjectID', {
    extend: 'Database.fieldtype.Field'
    
    ,bldBson: function(str) {
        str = str + ''
        if(/^[a-z0-9]{24}$/.test(str)) {
            return new BSON.ObjectID(str)
        }
        return false;    
    }
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        if(!!callback) callback(this.bldBson(value))
        else return this.bldBson(value)
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
         var f = {}

         var vals = (Ext.isArray(filter.value)? filter.value:filter.value.split(','))
         if(vals.length == 1)
            f[name] = this.bldBson(filter.value)
        else if(vals.length > 1) {
            for(var i=0;i<vals.length;i++) {
                vals[i] = this.bldBson(vals[i])    
            }
            f[name] = {$in: vals}
        } else
            f = null;
        
         callback(f)   
    }
    
    
})