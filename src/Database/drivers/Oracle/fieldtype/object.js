/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.string
 * @extend Database.drivers.Mysql.fieldtype.object
 * String field.
 */
Ext.define('Database.drivers.Oracle.fieldtype.object', {
    extend: 'Database.drivers.Mysql.fieldtype.object'
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " CLOB NULL DEFAULT NULL");
    }
})