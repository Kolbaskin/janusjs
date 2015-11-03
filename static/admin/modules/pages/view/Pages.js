

Ext.define('Desktop.modules.pages.view.Pages', {
    extend: 'Ext.window.Window',
    
    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],
    
    width:900,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    defaults: {
        border: false,
        bodyBorder: false
    },
    
    initComponent: function() {
        this.items = [
            Ext.create('Desktop.modules.pages.view.PagesTree', {
               //title: D.t('Pages tree'), 
               scope: this,
               region: 'center',
               model: this.model,
               border: false,
               bodyBorder: true
               //width: 400,
               
            }),
            this.buildForm()
        ]
        this.callParent();
    }
    
    ,buildForm: function() {
        var me = this;

        return {
            border: false,            
            //title: D.t('Page editor'),
            xtype: 'panel',
            region: 'east',
            width:400,
            split: true,
            border: false,
            action: 'EditorsPanel',
            //collapsible: true,
            //hideCollapseTool: true,
            layout: 'border',
            disabled: true,
            items: [
                Ext.create('Desktop.modules.pages.view.PageEditForm', { 
                    border: false,
                    bodyBorder: true,
                    region: 'center'
                }),
                Ext.create('Desktop.modules.pages.view.PageEditBlocks', {  
                    border: false,
                    bodyBorder: true,
                    region: 'south',
                    collapsible: true,
                    height: 200,
                    split: true
                })

            ]
        }
        
    }

    

    
    
})