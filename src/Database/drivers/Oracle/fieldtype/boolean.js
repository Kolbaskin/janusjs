/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.string
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Oracle.fieldtype.boolean', {
    extend: 'Database.drivers.Mysql.fieldtype.boolean'

    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " NUMBER DEFAULT 0");
    }
})