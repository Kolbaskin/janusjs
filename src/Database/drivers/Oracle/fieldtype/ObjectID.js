/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.ObjectID
 * @extend Database.fieldtype.Field
 * Mongodb ObjectId field
 */
Ext.define('Database.drivers.Oracle.fieldtype.ObjectID', {
    'Database.drivers.Mongodb.fieldtype.ObjectID'
    
    ,bldBson: function(str) {
        str = str + ''
        if(/^[a-z0-9]{24}$/.test(str)) {
            return str
        }
        return false;    
    }
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(24), ADD INDEX (" + field.name + ")");
    }
    
})