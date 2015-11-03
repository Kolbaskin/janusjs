

Ext.define('Desktop.modules.mainmenu.view.Menu', {
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
    
    initComponent: function() {
        this.items = [
            Ext.create('Desktop.modules.mainmenu.view.ItemsTree', {
               scope: this,
               border: false,
               region: 'center',
               model: this.model
               //width: 400,
               
            }),
            this.buildForm()
        ]
        this.callParent();
    }
    
    ,buildForm: function() {
        var me = this;

        return Ext.create('Desktop.modules.mainmenu.view.ItemEditForm', {                    
                    region: 'east',
                    width:400,
                    border: false,
                    split: true
                })
        
    }

    

    
    
})