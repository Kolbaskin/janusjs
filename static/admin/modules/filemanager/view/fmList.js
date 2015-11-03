

Ext.define('Desktop.modules.filemanager.view.fmList', {
    extend: 'Ext.window.Window',
    
    width:900,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    initComponent: function() {
        var me = this;
        this.items = [
            Ext.create('Desktop.modules.filemanager.view.FilesList', {
               title: '',//D.t('Files list'), 
               region: 'center',
               model: me.model
               //width: 400,
               
            }),
            {
                xtype: 'panel',
                region: 'east',
                width: 200,
                split: true,
                itemId: 'preview',
                title: ''//D.t('Preview')
            }
        ]
        this.callParent();
    }    
})