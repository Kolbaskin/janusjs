/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.date
 * @extend Database.drivers.Mysql.fieldtype.date
 * Date field. Use date field in the form for this data type.
 */
Ext.define('Database.drivers.Oracle.fieldtype.date', {
    extend: 'Database.drivers.Mysql.fieldtype.date'

    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " DATETIME NULL DEFAULT NULL");
    }
})