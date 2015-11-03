var fs = require('fs')

/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.file
 * @extend Database.fieldtype.Field
 * 
 * 
 *     @example
 *     // Detail Form 
 *     Ext.define('Desctop.mymodule.view.myModuleForm', {
 *         extend: 'Core.form.DetailForm',
 *         
 *         requires: ['Desktop.core.widgets.UploadField'],
 * 
 *         buildItems: function() {
 *             return [
 *                 .....
 *                 {
 *                     xtype: 'uploadfield',
 *                     name: 'file',
 *                     width: 350,
 *                     height: 150        
 *                 },
 *                 .....
 *             ]
 *         }
 *     })
 */
Ext.define('Database.drivers.Mysql.fieldtype.file', {
    extend: 'Database.drivers.Mysql.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {
        
        var delOld = function(call) {
            if(name && oldRecord && oldRecord[name]) {
                var val;
                
                try {
                    val = JSON.parse(oldRecord[name])
                } catch(e) {}
                
                if(!val) {
                    call()
                    return;
                }
                
                var path = model.config.staticDir + model.config.userFilesDir + '/'+val.file 
                fs.unlink(path, function() {
                    call()
                })
            } else
                call()
        }
        
        // delete file
        if(value === '-') {
            delOld(function() {
                callback(null, true)
            })
            return;
        }
        
        // don't change file
        if(!value) {
            callback(null)
            return;
        };
        
        try {
            value = JSON.parse(value)    
        } catch(e){}
        
        if(!value) {
            callback(null)
            return;
        }
        
        var path = model.config.adminCoreModulesDir + '/../../tmp/'+value.tmpName 
            ,pathToSave = model.config.staticDir + model.config.userFilesDir + '/' + value.tmpName 
        
        delOld(function() {
            fs.exists(path, function(e) {
                if(e) {
                    fs.rename(path, pathToSave, function(e) {
                        callback(JSON.stringify({file:value.tmpName, name: value.name}))
                    })                
                } else {
                    callback(null)
                }
            })
        })
    }
    /*
    ,getDisplayValue: function(model, record, name, callback) {        
        if(record && record[name]) {
            //callback(model.config.userFilesDir + '/' + record[name])
            var val;
            try {
                val = JSON.parse(record[name])    
            } catch(e) {}
            
            callback(val)
            
        } else
            callback(null)
    }
*/
})