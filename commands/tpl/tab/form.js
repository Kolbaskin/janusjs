Ext.define('{{nameSpace}}.modules.{{parent}}.view.{{Name}}Form', {
    extend: 'Core.form.DetailForm'
    
    ,titleIndex: 'name'
    ,noPin: true
    
    ,width: 500
    ,height: 300
    
    ,layout: 'border'

    ,buildItems: function() {
        
        return [{
            xtype: 'tabpanel',
            region: 'center',
            border: false,
            bodyBorder: false,
            defaults: {
                xtype: 'panel'    
            },
            margin: '0',
            items: [
                this.buildDescriptions(),
                this.buildTabDocs()
            ]
        }]
    }
    ,buildTabDocs: function() {
        return {
            xtype: 'panel',
            title: D.t('Attacments'),
            layout: 'border',
            childModule: {
                controller: 'Crm.modules.docs.controller.Docs',
                outKey: '_id',
                inKey: 'prop_id'
            }
        }
    }
    
    ,buildDescriptions: function() {
        return {
            xtype: 'panel',
            title: D.t('Description'),
            tabname: 'description',
            layout: 'anchor',
            bodyStyle: 'padding: 5px;',
            defaults: {anchor: '100%'},
            items: []
        }   
    }
    
    
})