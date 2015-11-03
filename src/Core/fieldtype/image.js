var fs = require('fs')

/**
 * @author Max Tushev
 * @class Core.fieldtype.image
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
Ext.define('Core.fieldtype.image', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, callback) {        
        
        // delete image
        if(value === '-') {
            callback(null, true)
            return;
        }
        
        // don't change picture
        if(!value) {
            callback(null)
            return;
        }
        
        var path = __dirname + '/../../../static/tmp/'+value 
            ,res = {}


        fs.exists(path, function(e) {
            if(e) {
                fs.readFile(path, function(e, s) {
                    if(s) {
                        fs.unlink(path)
                        res.img = s
                        path += '_small'
                        fs.readFile(path, function(e, s) {
                            if(s) {
                                fs.unlink(path)
                                res.preview = s    
                            }
                            callback(res)
                        })
                    } else callback(null)
                })
            } else {
                callback(null)
            }
        })
    }
    
    ,getDisplayValue: function(name, record, callback) {        
        callback('/Admin.Data.img/' + this.collection + '.' + name + '.' + (record._id || record.id) + '.main.')
    }

})