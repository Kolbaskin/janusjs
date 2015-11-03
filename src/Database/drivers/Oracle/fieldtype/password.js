var crypto = require('crypto')

/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.password
 * @extend Database.fieldtype.Field
 * Password field. Use text field with param "inputType: 'password'" in the form for this data type.
 */
Ext.define('Database.drivers.Oracle.fieldtype.password', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        var hash_alg = (model.config && model.config.hash_alg? model.config.hash_alg:'sha1')
        callback(!value? null:crypto.createHash(hash_alg).update(value).digest('hex'))
    }
    
    ,getDisplayValue: function(model, record, name, callback) {
        callback(null);
    }
    
    ,createField: function(field, collection, db, callback) {
        var len = 255
        if(field.len) len = field.len
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(" + len + ") NULL DEFAULT NULL");
    }
    
})