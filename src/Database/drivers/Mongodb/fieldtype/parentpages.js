/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.parentpages
 * @extend Database.fieldtype.Field
 * This field type used in tree modules, like {@link Desktop.modules.pages.model.PagesModel} to making links on parent nodes. 
 */
Ext.define('Database.drivers.Mongodb.fieldtype.parentpages', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {
        var me = this;
        [
            function(next) {
                if(newRecord.pid && Ext.isString(newRecord.pid)) {
                    model.db.fieldTypes.ObjectID.getValueToSave({}, newRecord.pid, null, null, null, function(_id) {
                        next(_id)    
                    })
                } else
                    next(newRecord.pid)
            }
            
            ,function(pid) {
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
                                callback(pages)
                            }
                        })
                    }
                    func(pid)    
                    return;        
                }
                callback(null);
            }
        ].runEach()
    }
})