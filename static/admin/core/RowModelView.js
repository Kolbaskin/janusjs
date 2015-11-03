Ext.define('Core.RowModelView', {
    extend: 'Ext.selection.RowModelView',
    
    storeHasSelected: function(record) {
        var store = this.store,
            records,
            len, id, i;
        
        if (record.hasId() && store.getById(record)) {
            return true;
        } else {
            records = store.data.items;
            
            if(!records) return false;
            
            len = records.length;
            id = record.internalId;
            
            for (i = 0; i < len; ++i) {
                if (id === records[i].internalId) {
                    return true;
                }
            }
        }
        return false;
    }
})
