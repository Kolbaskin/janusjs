/**
 * @author Max Tushev
 * @class Core.fieldtype.parentpages
 * This field type used in tree modules, like {@link Desktop.modules.pages.model.PagesModel} to making links on parent nodes. 
 */
Ext.define('Core.fieldtype.parentpages', {
    extend: 'Core.fieldtype.Field'    
    ,getValueToSave: function(value, callback) { 
        
        
        
        var me = this
            ,pid = (me.record.pid? (me.record.pid+'')._id():'');
        if(pid) {
            var pages = [], dir = '/' + me.record.alias + '/'
            
            var func = function(pd) {
                pages.push(pd)
                me.src.db.collection(me.collection).findOne({_id:pd}, {pid:1, alias:1}, function(e,d) {
                    if(d && d.pid) {
                        dir = '/' + d.alias + dir
                        func(d.pid)
                    } else {
                        me.record.dir = dir
                        callback(pages)
                    }
                })
            }
            func(pid)    
            return;        
        }
        callback(null);
    }
})