
Ext.define('Desktop.modules.users.view.AccessPagesTree', {
    extend: 'Desktop.modules.pages.view.PagesTree',
    action: 'pages-access',
    
    model: Ext.create('Desktop.modules.pages.model.PagesModel'),
    
    buildColumns: function() {
        return [{
            xtype: 'treecolumn',
            text: D.t('Page'),
            flex: 1,
            //sortable: true,
            dataIndex: 'name'
        },{   
            text: D.t("Read access"),
            xtype : 'checkcolumn',
            sortable: false,
            menuDisabled: true,
            width: 95,
            dataIndex: 'read'
        },{   
            text: D.t("Add access"),
            xtype : 'checkcolumn',
            sortable: false,
            menuDisabled: true,
            width: 95,
            dataIndex: 'add'
        },{   
            text: D.t("Modify access"),
            xtype : 'checkcolumn',
            sortable: false,
            menuDisabled: true,
            width: 95,
            dataIndex: 'modify'
        },{   
            text: D.t("Protect"),
            xtype : 'checkcolumn',
            sortable: false,
            menuDisabled: true,
            width: 95,
            dataIndex: 'del'
        },{   
            text: D.t("Inherit"),
            xtype : 'checkcolumn',
            sortable: false,
            menuDisabled: true,
            width: 95,
            dataIndex: 'inherit'
        }]
    }
    
    ,buildButtons: function() {
        return null;    
    }
    
    
    
})