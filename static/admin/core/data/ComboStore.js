/**
 * @class Core.data.ComboStore
 * @extend Core.data.Store
 * @private
 * @author Max Tushev <maximtushev@gmail.ru>
 * This is a superclass of {@link Core.data.Store}  
 */
Ext.define('Core.data.ComboStore', {
    extend: 'Core.data.Store',
    
    alias: 'store.combostore',
    
    autoLoad: true,
    
    /**
     * @cnf {Array} fields Defaults: [{name: '_id'},{name: 'name'}]
     */
    fields:[{name: '_id'},{name: 'name'}],
    data: [],
    
    initDataGetter: function(options) {
        var me = this;
        me.dataModel.readAll(function(data) {
            if(!!me.prepData) {
                data.list = me.prepData(data.list)   
            }
            me.loadData(data.list)
        })
        if(options.scope) this.scope = options.scope        
        me.dataActionsSubscribe()
        setTimeout(function() {
            me.fireEvent('ready', me, options)
        }, 100)
    }
     

    
    
});