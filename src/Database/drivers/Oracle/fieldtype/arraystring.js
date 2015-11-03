
Ext.define('Database.drivers.Oracle.fieldtype.arraystring', {
    extend: 'Database.drivers.Oracle.fieldtype.array'
    
    ,getValueToSave: function(model, value, newRecord, oldRecord, name, callback) {        
        if(value) {
            value = value.split('\n')
            if(value.length == 1) value = value[0].split(',')
            for(var i=0;i<value.length;i++) value[i] = value[i].trim()
        }
        arguments[1] = value
        this.callParent(arguments)
    }
    
    ,getDisplayValue: function(model, record, name, callback) {
        var value = '';
        if(record && record[name] && !!record[name].join) {
            value = record[name].join(',')
        }
        callback(value)
    }
})