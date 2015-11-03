Ext.define('Database.drivers.Mysql.fieldtype.Field', {
    extend: 'Database.fieldtype.Field'

    ,createField: function(field, collection, db, callback) {
        var len = 255
        if(field.len) len = field.len
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR(" + len + ") NULL DEFAULT NULL");
    }
})