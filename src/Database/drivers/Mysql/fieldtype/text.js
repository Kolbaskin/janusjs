/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mysql.fieldtype.text', {
    extend: 'Database.drivers.Mysql.fieldtype.string'
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " TEXT NULL DEFAULT NULL");
    }
})