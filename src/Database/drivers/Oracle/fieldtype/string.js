/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.string
 * @extend Database.drivers.Mysql.fieldtype.string
 * String field.
 */
Ext.define('Database.drivers.Oracle.fieldtype.string', {
    extend: 'Database.drivers.Mysql.fieldtype.string'
    
    ,createField: function(field, collection, db, callback) {
        var len = 4000
        if(field.len) len = field.len
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(" + len + ") NULL DEFAULT NULL");
    }
    
})