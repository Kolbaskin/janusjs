Ext.define('Database.drivers.Mongodb.fieldtype.file', {
    extend: 'Database.fieldtype.Field'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {    
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
    
    ,getDisplayValue: function(model, record, name, callback) {        
        callback('file')
    }

})