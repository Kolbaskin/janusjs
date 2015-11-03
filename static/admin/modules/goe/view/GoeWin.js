Ext.define('Desktop.modules.goe.view.GoeWin', {
    extend: 'Ext.window.Window',    
    resizable: false,
    modal: true,
    minimizable: false,
    maximizable: false,
    width:640,
    height:420,
    animCollapse:false,
    constrainHeader:true,
    layout: 'column',
    bodyStyle: 'padding-top: 20px;',
    defaults: {
        border: false,
        bodyBorder: false
    },

    initComponent: function() {
        
        this.minimizable = false;
        this.maximizable = false;
        
        if(Ext.getBody().dom.clientWidth < Ext.mobileMaxWidth) {
            this.maximized = true;    
        }
        
        
        this.buttons = this.buildButtons()
        this.items = [{
            columnWidth: .5,
            html: '&nbsp;'
        },{
            width: 300,
            name: 'center'
        },{
            columnWidth: .5,
            html: '&nbsp;'
        }
        ]
        this.callParent(arguments)
    }
    
    ,buildButtons: function() {
        return [
            {
                tooltip: D.t('Rotate left'),
                iconCls: 'fa fa-undo',
                //scale: 'medium',
                xtype: 'button',
                action: 'rotate_left'
            },{
                tooltip: D.t('Rotate right'),
                iconCls: 'fa fa-repeat',
                //scale: 'medium',
                xtype: 'button',
                action: 'rotate_right'
            },'->',{
                text: D.t('Accept'), 
                scale: 'medium',
                action: 'accept'},
            '-',
            {text: D.t('Close'), scale: 'medium',action: 'formclose'}
            
            
        ]    
    }

})