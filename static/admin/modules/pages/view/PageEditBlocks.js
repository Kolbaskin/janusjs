Ext.define('Desktop.modules.pages.view.PageEditBlocks', {
    extend: 'Ext.grid.Panel',    
    autoScroll: true,
    name: 'blocks-grid',
    
    store: Ext.create('Ext.data.Store', {
        fields: [
            {name:'id'},
            {name:'block'},
            {name:'lng'},
            {name:'controller'},
            {name:'descript'},
            {name: 'text'}
        ],
        data: []
    }),
        
    initComponent: function() {
        this.viewConfig = this.buildViewConfig()
        this.title = D.t('Page blocks')
        this.columns = this.buildColumns()  
        this.tbar = this.buildButtons()
        this.callParent();
    }    
    
    ,buildViewConfig: function() {
        var me = this
        return {
                trackOver: false,
                plugins: {
                    ptype: 'gridviewdragdrop'
                }
            }
    }
    
    ,buildColumns: function() {
        return [
            {
                text: D.t("Block"),
                width: 40,
                sortable: true,
                dataIndex: 'block'
            },
            {
                text: D.t("Language"),
                width: 40,
                sortable: false,
                dataIndex: 'lng'
            },
            {
                text: D.t("Content type"),
                flex: 1,
                sortable: true,
                dataIndex: 'controller'
            },
            {
                text: D.t("Description"),
                flex: 1,
                sortable: false,
                dataIndex: 'descript'
            }
        ]
    }
        
    ,buildButtons: function() {
        return [{
            text: D.t('Add'),
            tooltip: D.t('Adding blocks'),
            iconCls:'fa fa-plus',
            disabled: true,
            action: 'addblock'
        }]
    }
    
})