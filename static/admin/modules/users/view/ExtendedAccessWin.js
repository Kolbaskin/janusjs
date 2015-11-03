Ext.define('Desktop.modules.users.view.ExtendedAccessWin', {
    extend: 'Ext.window.Window'
    
    ,modal: true
    ,width: 300
    ,height: 250
    ,bodyStyle: 'background: #ffffff;padding: 5px;overflow-y: auto;'
    ,layout: 'border'
    
    ,initComponent: function() {
        var me = this;
        
        this.title = D.t('Extended permissions');
        this.items = {
            xtype: 'form',
            region: 'center',
            layout: 'anchor',
            border: false,
            bodyBorder: false,
            listeners: {
                render: function(frm) {
                    setTimeout(function() {
                        frm.getForm().setValues(me.values)  
                    },100)
                }
            },
            defaults: {
                xtype: 'checkbox',
                anchor: '100%',
                labelWidth: 200
            },
            items: []
        }
        
        for(var i in this.accessSet) {          
            this.items.items.push({
                name: i,
                fieldLabel: D.t(this.accessSet[i])
            })
        }
        
        this.buttons = this.buildButtons()
        
        this.callParent(arguments)
    }
    
    ,buildButtons: function() {
        var me = this;
        return [{
            text: D.t('Accept'),
            ui: 'primary',
            scale: 'medium',
            handler: function() {me.accept()}
        },{
            text: D.t('Cancel'),
            scale: 'medium',
            handler: function() {me.close()}
        }]
    }
    
    ,accept: function() {
        this.callback(this.down('form').getValues())
        this.close()
    }
    
});