
Ext.define('Desktop.extends.AdminDesktop', {
    extend: 'Ext.ux.desktop.Desktop'

    ,initComponent: function() {
        
        var me = this;
        
        this.balanceButton = Ext.create('Ext.button.Button', {
            ui: 'info',
            scale: 'medium',
            text: D.t('Balance:') + ' ' + Sess.userData.balance,
            handler: function() {                
                Ext.create('Crm.modules.transact.controller.Transact', {
                    app: me.app
                }).createWindow().show()
            }
        })
        
        this.callParent(arguments)
    }

    ,initTaskBar: function() {
        var me = this;
        me.taskbarConfig.id = 'botBar'
        me.taskbar = Ext.create('Ext.ux.desktop.AgentTaskBar', me.taskbarConfig);
        me.bbar = me.taskbar
        me.tbar = {
            id: 'topBar',
            //height: 40,
            items: me.buildMenubar()
        }
        //me.rbar = me.buildHelpbar()
        me.taskbar.windowMenu = me.windowMenu; 
        me.helpModel = Ext.create('Crm.modules.help.model.HelpModel')
        me.balanceEventSubscribe()
    }
    
    ,balanceEventSubscribe: function() {
        var me = this;
        Core.ws.subscribe('balance', 'Crm.modules.users.model.UsersdbModel', function(act, data) {
            if(data._id ==  localStorage.getItem('uid')) {
                Sess.userData.balance = data.balance
                me.balanceButton.setText(D.t('Balance:') + ' ' + data.balance)
            }
        })
    }
    ,createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: D.t('Restore'), handler: me.onWindowMenuRestore, scope: me },
                { text: D.t('Minimize'), handler: me.onWindowMenuMinimize, scope: me },
                { text: D.t('Maximize'), handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: D.t('Create shortcut on desktop'), handler: me.onWindowMenuCreateShortcut, scope: me },
                //{ text: D.t('Create quick start icon'), handler: me.onWindowMenuCreateQuickStart, scope: me },
                '-',
                { text: D.t('Close'), handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    }
    
    ,buildMenubar: function() {
        var me = this
            ,items = [
                //this.buildStartMenu()
                /*,{
                    xtype: 'splitter', html: '&#160;',
                    height: 14, width: 2, 
                    cls: 'x-toolbar-separator x-toolbar-separator-horizontal'
                    
                }*/];
        
        this.buildGroupMenu().forEach(function(item) {
            if(item.controller) {
                item.handler = function() {
                    Ext.create(item.controller, {
                        app: me.app
                    }).createWindow().show()
                }
            }
            items.push(item)
        })

       items.push({
          id: 'aboutLabel',
          xtype: 'label',
          text: 'PSB.ISRB'
       },'->',
        this.buildStartMenu(),
        this.balanceButton,{
            xtype: 'button',
            scale: 'medium',
            text: Sess.userName,
            handler: function() {
                me.app.onProfile()
            }
        },{
            xtype: 'button',
            scale: 'medium',
            text: D.t('Exit'),
            handler: function() {
                me.app.onLogout()
            }
        })
        
        return items;
    }
    
    ,buildGroupMenu: function() {
        var me = this;
        return []
    }
    
    ,buildStartMenu: function() {
        return {
            xtype: 'button',
            ui: 'info',
            scale: 'medium',
            text: D.t('Menu'),
            menuAlign: 'tl-bl',
            tooltip: D.t('Menu'),
            menu: this.taskbar.startMenu
        }
    }
    
    ,createWindow: function(config, cls) {
    
        var me = this 
            win = me.callParent(arguments)
        
        win.on('show', function() {
            win.maximize()
        })

        return win;
    }

    ,addHelps: function(win) {
        var me = this
            ,wid = win.id.split(':')
        
        if(wid.length>1) wid = wid[0] + ':'
        else wid = wid[0]
        
        var l = localStorage.getItem('locale');
        if(!l || l.length!=2) l='en';
        
        me.showHelpWindow('', {
            winname: wid,
            event: 'show'            
        })
        
        me.helpModel.getHelpTexts(wid, l, function(res) {
            res.forEach(function(r) {
            
                if(!r.elm && r.ev == 'show')
                    me.showHelpWindow(r.txt, {_id: r._id})
                else {
                    if(!r.elm) {
                         win.on(r.ev, function() {me.showHelpWindow(r.txt, {_id: r._id})})
                    } else {
                        var el = win.down(r.elm)
                        if(el) {
                            el.on(r.ev, function() {me.showHelpWindow(r.txt, {_id: r._id})})   
                        }
                    }
                }
                    
            })
        })
    }
    
    ,showHelpWindow: function(txt, opt) {
        this.helpBar.opt = opt;
        this.helpBar.update('<p>' + txt.split('\n').join('</p><p>') + '</p>')    
    }
    
    ,buildHelpbar: function() {
        var me = this;
        var mesCntrl = Ext.create('Crm.modules.dashboard.controller.Dashboard')
        var messagesPanel = mesCntrl.buildAsChild({
            app: me.app
        })
        me.helpBar = messagesPanel.down('[name=helpBar]')
        return {
            resizable: true, 
            width: 250,
            split: true,
            border: false,
            bodyBorder: false,
            layout: 'border',
            resizeHandles: 'w',
            items: messagesPanel
        }
    }
})

Ext.define('Ext.ux.desktop.AgentTaskBar', {
    extend: 'Ext.ux.desktop.TaskBar',
    
    buildElements: function() {
        var me = this;
        
        me.startMenu = new Ext.ux.desktop.StartMenu(me.startConfig);
        
        me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());

        me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

        me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());
        
        me.QuickStartContextMenu = new Ext.menu.Menu({
          items: [
            {
                text: D.t('Remove shortcut'),
                handler: function() {me.removeQuickStartShortcut()}
            }
          ]
        })

        me.items = [
                    
            
            me.windowBar,
            '-',
            me.tray
        ];    
    }
    
});