/**
 * @class Core.data.ComboStore
 * @extend Core.data.Store
 * @private
 * @author Max Tushev <maximtushev@gmail.ru>
 * This is a superclass of {@link Core.data.Store}  
 */
Ext.define('Core.data.ArrayStore', {
    extend: 'Core.data.Store',
    
    alias: 'store.arraystore',
    
    //autoLoad: true,
    
    /**
     * @cnf {Array} fields Defaults: [{name: '_id'},{name: 'name'}]
     */
    //fields:['_id'},{name: 'name'}],
    //data: [],
    
    initDataGetter: function(options) {
        var me = this;
        me.dataModel.readAll(function(data) {
            var out = []
            
            for(var i=0;i<data.list.length;i++)
                out.push([data.list[i]._id, data.list[i].name])

console.log('out:', out)

            me.loadData(out)
        })
        if(options.scope) this.scope = options.scope        
        me.dataActionsSubscribe()
    }
    
    
});