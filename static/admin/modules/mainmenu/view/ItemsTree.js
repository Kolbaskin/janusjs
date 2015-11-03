Ext.define('Desktop.modules.mainmenu.view.ItemsTree', {
    extend: 'Core.tree.Tree'
    
    ,bodyBorder: true
    
    ,buildColumns: function() {
        return [{
                xtype: 'treecolumn',
                text: D.t('Item'),
                flex: 1,
                //sortable: true,
                dataIndex: 'name'
            },{
                text: D.t('Web path'),
                flex: 1,
                dataIndex: 'dir'
                //,sortable: true
            },{
                text: D.t('Add'),
                width: 65,
                menuDisabled: true,
                xtype: 'actioncolumn',
                tooltip: D.t('Add page'),
                align: 'center',
                renderer: function(v, m, r) {
                    if(!r.data.aAccess.add) return ''
                    m.tdCls = 'add'
                }
            }]
    }
    
    ,buildButtons: function() {
        return [{
            tooltip:D.t('Reload items'),
            ui: 'reload',
            //iconCls:'refresh',
            action: 'refreshpages'
        }]
    }
});