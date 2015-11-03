/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */


Ext.define('Desktop.modules.users.controller.Users', {
    extend: 'Core.controller.Controller',
    id:'users-win',

    launcher: {
        text: D.t('Users'),
        iconCls:'fa fa-users'        
    }
    
    ,addFormControls: function(win) {
        var me = this
        
        me.control(win,{
            "[name=login]": {change: function(el, val) {me.checkLogin(win, el, val)}}
        })

        me.callParent(arguments)
    }
    
    ,checkLogin: function(win, el, val) {
        if(!val) return;
        var me = this
        me.model.checkUnicLogin({
            _id: win.down('form').rowId,
            login: val
        }, function(res) {
            if(res && res.isset) {               
                el.markInvalid(D.t('Duplicate login'))
            } else {
                el.clearInvalid()
            }
        })
    }
    
    ,beforeSave: function(form, data, cb) {
        this.model.checkUnicLogin({
            _id: data._id,
            login: data.login
        }, function(res) {
            if(res && res.isset) {               
                D.a('Error!', 'Duplicate login')
                cb(false)
            } else {
                cb(data)
            }
        })
        return false;
    }
    
});

