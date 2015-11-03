Ext.define('Core.fieldtype.file', {
    extend: 'Core.fieldtype.Field'
    
    ,getValueToSave: function(value, old_value, callback) {        
        /*
        if(!s) {
            callback(cur_data)        
            return;
        }
            
        var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'+s 
        fs.exists(path, function(e) {
            if(e) {
                fs.readFile(path, function(e, s) {
                    if(s) fs.unlink(path)
                    callback(s)
                })
            } else {
                callback(null)
            }
        })
        */
        callback('')
    }
    
    ,getDisplayValue: function(name, record, callback) {        
        callback('file')
    }

})