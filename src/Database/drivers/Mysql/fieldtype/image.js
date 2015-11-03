var fs = require('fs')

/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.image
 * @extend Database.fieldtype.Field
 * Image field. Use image field in the form for this data type.
 * 
 *     @example
 *     // Detail Form 
 *     Ext.define('Desctop.mymodule.view.myModuleForm', {
 *         extend: 'Core.form.DetailForm',
 *         
 *         requires: ['Desktop.core.widgets.ImageField'],
 * 
 *         buildItems: function() {
 *             return [
 *                 .....
 *                 {
 *                     xtype: 'image',
 *                     name: 'img',
 *                     tumbSizes: '250x150x500x', // sizes of preview and full image
 *                     width: 350,
 *                     height: 150        
 *                 },
 *                 .....
 *             ]
 *         }
 *     })
 */
Ext.define('Database.drivers.Mysql.fieldtype.image', {
    extend: 'Database.drivers.Mysql.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {
        
        var delOld = function(call) {
            if(name && oldRecord && oldRecord[name]) {
                var path = model.config.staticDir + model.config.userFilesDir + '/'+oldRecord[name] 
                fs.unlink(path, function() {
                    fs.unlink(path + '_small', function() {
                        call()
                    })
                })
            } else
                call()
        }
        
        // delete image
        if(value === '-') {
            delOld(function() {
                callback(null, true)
            })
            return;
        }
        
        // don't change picture
        if(!value) {
            callback(null)
            return;
        };
        
        var path = model.config.adminCoreModulesDir + '/../../tmp/'+value 
            ,pathToSave = model.config.staticDir + model.config.userFilesDir + '/' + value 
        
        delOld(function() {
            fs.exists(path, function(e) {
                if(e) {
                    fs.rename(path, pathToSave, function(e) {
                        fs.rename(path + '_small', pathToSave + '_small', function(e) {
                            callback(value)
                        })
                    })                
                } else {
                    callback(null)
                }
            })
        })
    }
    
    ,getDisplayValue: function(model, record, name, callback) {        
        if(record && record[name])
            callback(model.config.userFilesDir + '/' + record[name])
        else
            callback(null)
    }

})