var crypto = require('crypto')

/**
 * @author Max Tushev
 * @class Core.fieldtype.password
 * Password field. Use text field with param "inputType: 'password'" in the form for this data type.
 */
Ext.define('Core.fieldtype.password', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {
        var hash_alg = (this.config && this.config.hash_alg? this.config.hash_alg:'sha1')
        callback(!value? null:crypto.createHash(hash_alg).update(value).digest('hex'))
    }
    
    ,getDisplayValue: function(value, rec, callback) {
        callback(null);
    }
})