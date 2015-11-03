/**
 * @author Max Tushev
 * @class Database.drivers.Mysql.fieldtype.parentpages
 * @extend Database.fieldtype.Field
 * This field type used in tree modules, like {@link Desktop.modules.pages.model.PagesModel} to making links on parent nodes. 
 */
Ext.define('Database.drivers.Mysql.fieldtype.parentpages', {
    extend: 'Database.drivers.Mysql.fieldtype.object'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {
        var me = this
            ,pid = (newRecord.pid? newRecord.pid:0);
        if(pid) {
            var pages = [], dir = '/' + newRecord.alias + '/'
            
            var func = function(pd) {
                pages.push(pd)
                model.db.collection(model.collection).findOne({_id:pd}, {pid:1, alias:1}, function(e,d) {
                    if(d && d.pid) {
                        dir = '/' + d.alias + dir
                        func(d.pid)
                    } else {
                        newRecord.dir = dir
                        callback(JSON.stringify(pages))
                    }
                })
            }
            func(pid)    
            return;        
        }
        callback(null);
    }
        
})