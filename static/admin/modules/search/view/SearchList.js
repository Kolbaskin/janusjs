

Ext.define('Desktop.modules.search.view.SearchList', {
    extend: 'Core.grid.GridWindow'
    
    ,filtrable: true
    
    ,buildColumns: function() {
        return [
            {
                text: D.t("Model"),
                flex: 1,
                sortable: true,
                dataIndex: 'model',
                renderer: function(v) {
                    return D.t(v)    
                }
            },{
                text: D.t("Title"),
                flex: 1,
                sortable: true,
                dataIndex: 'title'
            },{
                text: D.t("Descript"),
                flex: 1,
                sortable: true,
                dataIndex: 'descript'
            }
        ]        
    }
    
    ,buildTbar: function() {
        return [{
            tooltip:D.t('Reload data'),
            ui: 'reload',
            action: 'refresh'
        },{
            width: 300,
            emptyText: D.t('Search'),
            margin: '0 0 0 20',
            xtype: 'searchfield',
            store: this.store
        }]
    }

    /**
     * @method
     * Creating a bootom bar
     */
    ,buildBbar: function() {
        return null
    }
})