Ext.define('Desktop.modules.debugger.controller.Debugger', {
    extend: 'Core.controller.Controller',
    id:'debugger-win',

    launcher: {
        text: D.t('Debugger'),
        iconCls:'fa fa-bug' 
    }
    
    ,createWindow : function(){
        var me = this,
            desktop = this.app.getDesktop()
        
        desktop.taskbar.tray.insert(0, {
            iconCls: 'debugger',
            tooltip: 'Debugger of the websocket (see in the browser console)',
            border: false,
            handler: function() {
                this.destroy(); 
                me.stopDebug();
            }
        })
        
        me.startDebug()
        
        return false;
    }
    
    ,addControls: function(win) {}
    
    ,startDebug: function(win) {
        var me = this;
        Core.ws.debug = function(title, data) {
            me.printData(title, data, win)
        }
    }
    
    ,stopDebug: function(win) {
        Core.ws.debug = null
    }
    
    ,printData: function(title, data, win) {
        console.log(title,': ',data)
    }

});