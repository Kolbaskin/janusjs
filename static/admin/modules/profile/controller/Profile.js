/*!
 * Wpier
 * Copyright(c) 2013
 * 
 * 
 */

Ext.define('Desktop.modules.profile.controller.Profile', {
    extend: 'Core.controller.Controller'
    ,id:'profile-win'

    ,launcher: {
        text: D.t('User profile'),
        iconCls:'fa fa-user'        
    }
    
    ,modelsAll: null
    
    ,createWindow: function() {
        var me = this
        me.model.getMyInfo(function(data) {
            me.mainWin.down('form').getForm().setValues(data)
        })
        return this.callParent();
    }
    
    ,addFormControls: function(win) {        
        var me = this        
        this.control(win, {
            "[name=login]": {
                change: function(el, val) {
                    me.checkLogin(el, val)                    
                }
            }
        })        
        this.callParent(arguments);
    }
    
    ,checkLogin: function(el, val) {
        var me = this
        me.model.checkLogin(val, function(data) {
            var o
            if(data && data.success) {
                el.validator = function() {return true;}
                el.clearInvalid()
                o = me.mainWin.down('[action=formsave]')
                if(o) o.setDisabled(false)
                o = me.mainWin.down('[action=formapply]')
                if(o) o.setDisabled(false)                    
            } else {                    
                el.validator = function() {return el.busyText;}
                el.markInvalid(el.busyText)
                o = me.mainWin.down('[action=formsave]')
                if(o) o.setDisabled(true)
                o = me.mainWin.down('[action=formapply]')
                if(o) o.setDisabled(true)
            }
        })
    }
    ,addControls: function(win) {        
        this.addFormControls(win)
    }
});

