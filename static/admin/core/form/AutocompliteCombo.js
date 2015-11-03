Ext.define('Core.form.AutocompliteCombo', {
    extend: 'Ext.form.field.ComboBox',
    
    filterName: 'name',
    fieldSet: ['_id', 'name'],
    
    displayField: 'name',
    valueField: 'name',
    
    initComponent: function() {
        var me = this;

        
        this.store = Ext.create('Core.data.Store', {
            filterParam: 'query',
            remoteFilter: true,
            dataModel: me.dataModel,
            scope: this,
            autoLoad: false,
            listeners: {
                beforeload: function(x,y,z) {                    
                    if(y.filters && y.filters[0] && y.filters[0].property == me.filterName && y.filters[0].value && y.filters[0].value.length>1){}
                    else
                    return false;
                },
                load: function(x,y,z) {
                    if(!y || !y.length) {
                        me.collapse()
                        return false
                    }
                }
            },
            fieldSet: me.fieldSet
        })
        this.store.loadData([])
        this.queryParam = 'query'
        this.queryMode = 'local'
        this.remoteFilter = true
        this.triggerAction = 'all'
        this.onTriggerClick = function() {
            me.fireEvent('triggerclick', me);    
        }
 
        this.callParent(arguments)
    }
})