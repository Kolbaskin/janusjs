Ext.define('{{nameSpace}}.modules.{{parent}}.view.{{Name}}Form', {
    extend: 'Core.form.DetailForm'
    
    ,titleIndex: 'name'
    
    ,layout: 'border'
    
    ,border: false
    ,bodyBorder: false
    
    ,height: 450
    ,width: 750
    
    ,buildItems: function() {
        return [{
            xtype: 'panel',
            region: 'north',
            border: false,
            bodyBorder: false,
            layout: 'anchor',
            bodyStyle: 'padding: 5px;',
            height: 50,
            items: [{
                name: 'name',
                anchor: '100%',
                xtype: 'textfield',
                fieldLabel: D.t('Title')
            }]  
        },
            this.taxesTable()
        ]
    }
    
    ,taxesTable: function() {
        return Ext.create('Desktop.core.widgets.GridField', {
                hideLabel: true,
                region: 'center',
                name: 'taxes',
                fields: ['price1','price2','tax','abater'],
                columns: [{
                    text: D.t("Price from"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'price1',
                    editor: {
                        xtype: 'numberfield'    
                    }
                }
                ]
            })
    }
})