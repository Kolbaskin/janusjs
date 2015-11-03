var crypto = require('crypto')

/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.password
 * @extend Database.fieldtype.Field
 * Password field. Use text field with param "inputType: 'password'" in the form for this data type.
 */
Ext.define('Database.drivers.Mysql.fieldtype.password', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        var hash_alg = (model.config && model.config.hash_alg? model.config.hash_alg:'sha1')
        callback(!value? null:crypto.createHash(hash_alg).update(value).digest('hex'))
    }
    
    ,getDisplayValue: function(model, record, name, callback) {
        callback(null);
    }
})