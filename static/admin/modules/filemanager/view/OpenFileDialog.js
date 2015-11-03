Ext.define('Desktop.modules.filemanager.view.OpenFileDialog', {
    extend: 'Ext.window.Window',
    
    modal:true,
    title: D.t('Open file'),
    iconCls: 'dlg-openfile',
    width: 750,
    height:450,
    layout: 'border',
    closeAction: 'hide', 
    
    initComponent: function() {
        this.items = [
            Ext.create('Desktop.modules.filemanager.view.FilesList', {
               title: '',//D.t('Files list'), 
               region: 'center'
               //width: 400,
               
            }),
            {
                xtype: 'panel',
                region: 'east',
                width: 200,
                split: true,
                itemId: 'preview',
                title: D.t('Preview')
            } 
        ]
        
        this.buttons = [
            {
                text: D.t('Open'),
                action: 'open'
            },
            {
                text: D.t('Close'),
                action: 'winclose'
            }
        ]
        this.callParent();
    }
    
    
    
});