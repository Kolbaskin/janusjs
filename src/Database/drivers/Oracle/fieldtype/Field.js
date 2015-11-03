Ext.define('Database.drivers.Oracle.fieldtype.Field', {
    extend: 'Database.fieldtype.Field'

    ,createField: function(field, collection, db, callback) {
        var len = 255
        if(field.len) len = field.len
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(" + len + ") NULL DEFAULT NULL");
    }
})