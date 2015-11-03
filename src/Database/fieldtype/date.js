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
            param[filter.property] = {};
            param[filter.property]['$' + filter.operator] = new Date(filter.value);
            cb(param)
        } else
            cb()
    }

})