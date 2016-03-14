/**
 * @author Max Tushev
 * @class Database.drivers.Mongodb.fieldtype.date
 * @extend Database.fieldtype.Field
 * Date field. Use date field in the form for this data type.
 */
Ext.define('Database.fieldtype.date', {
    extend: 'Database.fieldtype.Field'

    ,getExportValue: function(val) {
        if(val) val = Ext.Date.format(val, 'Y-m-d');
        return val;
    }
    
    ,getFilterValue: function(mdl, filter, name, cb) {
        if(filter) {
            var param = {}
                ,dt = new Date(Ext.Date.format(new Date(filter.value), 'm/d/Y'));
            
            if(filter.operator == 'eq') {
                var d1 = {}, d2 = {};
                d1[filter.property] = {}
                d1[filter.property].$gte = dt;
                d2[filter.property] = {}
                d2[filter.property].$lte = new Date(dt.getTime() + 86400000);
                param.$and = [d1,d2]
                
            } else {            
                param[filter.property] = {};
                param[filter.property]['$' + filter.operator] = dt;
            }
            cb(param)
        } else
            cb()
    }

})
