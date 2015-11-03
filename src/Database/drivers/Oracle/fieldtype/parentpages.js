/**
 * @author Max Tushev
 * @class Database.drivers.Oracle.fieldtype.parentpages
 * @extend Database.drivers.Mysql.fieldtype.parentpages
 * This field type used in tree modules, like {@link Desktop.modules.pages.model.PagesModel} to making links on parent nodes. 
 */
Ext.define('Database.drivers.Oracle.fieldtype.parentpages', {
    extend: 'Database.drivers.Mysql.fieldtype.parentpages'
    
    ,createField: function(field, collection, db, callback) {
        callback("ALTER TABLE " + collection + " ADD " + this.getDbFieldName(field) + " VARCHAR2(4000) NULL DEFAULT NULL");
    }
})