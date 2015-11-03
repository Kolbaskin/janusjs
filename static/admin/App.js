/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
 
var onTop = new Ext.WindowGroup;
onTop.zseed = 10000;

Ext.define('Desktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: Modules.requires,
    
    constructor: function(cnfg) {
      
        if(cnfg) {
            for(var i in cnfg) this[i] = cnfg[i]  
        }
        this.callParent();
    },
    
    init: function() {
        var me = this        
        this.callParent();
        if(!!this.onDesktopReady)
            this.onDesktopReady()
    },

    getModules : function(){
        var a = [], me = this;  
        for(var i=3;i<me.requires.length;i++) {
            a.push(new me.requires[i]())
        }
        return a
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: D.t('Change Settings'), handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: Modules.shortcuts
            }),

            wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: Sess.userName,
            iconCls: Sess.userIconCls,
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text: D.t('Settings'),
                        iconCls:'fa fa-cogs',
                        handler: me.onSettings,
                        scope: me
                    },{
                        text: D.t('Profile'),
                        iconCls:'fa fa-user',
                        handler: me.onProfile,
                        scope: me
                    },
                    '->',
                    {
                        text: D.t('Logout'),
                        iconCls:'fa fa-sign-out',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: Modules.quickStart ,
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        
        var w = new Ext.window.Window({
            manager: onTop,
            modal: true,
            width: 300,
            height:140,
            title: D.t('Logout'),
            bodyStyle: 'padding:10px;text-align:center;',
            items: {
                border: false,
                html: D.t('Are you sure you want to logout?')
            },
            buttons: [
                {
                    text: D.t('Logout'),
                    iconCls: 'fa fa-sign-out',
                    scale: 'medium',
                    handler: function() {
                        localStorage.removeItem('uid');
                        localStorage.removeItem('token');                
                        location = "login.html"
                    }
                },
                {
                    text: D.t('Close'),
                    scale: 'medium',
                    handler: function() {
                        w.close();        
                    }
                }
                ]
        }).show();
    },

    onProfile: function () {
        Ext.create('Desktop.modules.profile.controller.Profile',{
            controller: 'Desktop.modules.profile.controller.Profile',
            app: this
        }).createWindow().show()
    },

    onSettings: function () {
        var dlg = new Desktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
