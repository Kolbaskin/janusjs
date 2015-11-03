/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.richtext
 * @extend Database.fieldtype.Field
 * String field.
 */
Ext.define('Database.drivers.Mongodb.fieldtype.richtext', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) { 
        var images = value.match(/\/tmp\/[a-f0-9]{64}/g);
        if(!images) {
            callback(value)
            return;
        }
        var me = this
            ,i=0
            ,path = model.config.adminCoreModulesDir + '/../..'
        var f = function() {
            if(i>=images.length) {
                callback(value)
                return;    
            }
            me.getImage(path + images[i], function(res) {               
                if(res) {
                    value = value.replace(new RegExp(images[i], 'g'), images[i].replace('/tmp/', '/userimages/'))
                }
                i++;
                f();
            })
        }
        f()
    }
    
    ,getImage: function(path, cb) {
        var fs = require('fs');
        fs.exists(path, function(e) {
            if(e) {
                fs.rename(path, path.replace('/tmp/', '/userimages/'), function(e, s) {
                    cb(true)
                })
            } else
                cb()
        })
    }
    
    ,getFilterValue: function(model, filter, name, callback) {
         callback()
    }
})