Ext.define('Desktop.modules.debugger.view.DebuggerList', {
    extend: 'Ext.window.Window',
    
    width:900,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    initComponent: function() {
        var me = this;
        
        me.tbar = me.buildTbar()
        
        me.items = me.buildWorkArea()
        
        me.callParent();
    }
    
    ,buildTbar: function() {
        return [{
            text: 'Start',
            action: 'start'
        },'-',{
            text: 'Stop',
            action: 'stop',
            disabled: true
        },'-',{
            text: 'Clean',
            action: 'clean',
            disabled: true
        }]
    }
    
    ,buildWorkArea: function() {
        return [{
            region: 'center',
            xtype: 'textarea',
            name: 'outarea'
        }]
    }
})