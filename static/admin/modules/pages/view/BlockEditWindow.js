Ext.define('Desktop.modules.pages.view.BlockEditWindow', {
    extend: 'Ext.form.Panel',
    
    titleIndex: 'descript',
    
    region: 'center',
    
    width:740,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    noPin: true,
    border: false,
    bodyBorder: false,
    
    initComponent: function() {
        this.items = {
            xtype: 'tabpanel',
            region: 'center',
            border: false,
            bodyBorder: false,
            items: this.buildItems() 
        }
        this.buttons = this.buildTbar()

        
        this.callParent();
    }
    
    
    ,buildItems: function() {
        return [{
            title: D.t('Content'),
            xtype: 'panel',
            itemId: 'module-panel',
            //collapsible: true,
            layout: 'border',
            items: [Ext.create('Desktop.modules.pages.view.HtmlEditor', {
                region: 'center',
                name: 'text'//,
                //plugin_ice: true
            })]
            
            
        },{
            title: D.t('Block settings'),
            xtype: 'panel',
            //collapsible: true,
            layout: 'anchor',
            bodyStyle: 'padding:10px;',
            itemId: 'block-sets',
            defaults: {
                xtype: 'textfield',
                labelWidth: 120
            },
            items: this.buildFormItems()
            //,tbar: this.buildFormButtons()
        }]
    }
    
    ,buildTbar: function() {
        return [
            {
                tooltip: D.t('Remove block'),
                iconCls: 'fa fa-trash',
                action: 'remove'
            },'->',{
                text: D.t('Save and close'),
                //iconCls: 'save',
                scale: 'medium',
                action: 'save'
            },
            {
                text: D.t('Save'),
                //iconCls: 'apply',
                scale: 'medium',
                action: 'apply'
            },'-',
            {
                text: D.t('Close'),
                //iconCls: 'close',
                scale: 'medium',
                action: 'close'
            }
            
            
            
        ]
    }
    
    ,buildFormItems: function() {
        return [{
                fieldLabel: D.t('Block number'),  
                xtype: 'numberfield',
                minValue: 1,
                value: 1,
                name: 'block',
                width: 200
            },{
                fieldLabel: D.t('Language'),  
                name: 'lng',
                width: 200
            },/*{                
                xtype: 'combo',
                anchor: '100%',
                store: Ext.create('Ext.data.ArrayStore', {
                    fields: ['name','model']
                }),
                fieldLabel: D.t("Conten type"),
                name: 'controller',
                queryMode: 'local',
                allowBlank: true,
                displayField: 'name',
                valueField: 'model'
            },*/{
                anchor: '100%',
                fieldLabel: D.t('Controller'),   
                name: 'controller'
            },{
                anchor: '100%',
                fieldLabel: D.t('Description'),   
                name: 'descript'
            },{
                hidden: true,   
                name: 'id'
            }
        ]
    }
    
})