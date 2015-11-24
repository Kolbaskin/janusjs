/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.Desktop
 * @extends Ext.panel.Panel
 * <p>This class manages the wallpaper, shortcuts and taskbar.</p>
 */
Ext.define('Ext.ux.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', // dataview
        'Ext.window.Window',

        'Ext.ux.desktop.TaskBar',
        'Ext.ux.desktop.Wallpaper'
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    /**
     * @cfg {Array|Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Ext.ux.desktop.ShorcutModel ShortcutModel}.
     */
    shortcuts: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    //floating: true,

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link shortcutItemSelect} will probably also need to changed.
     */
    
    quickStartIconSize: 40,
     
    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-desktop-shortcut" id="{name}-shortcut" title="{name}">',
                '<div class="ux-desktop-shortcut-icon {iconCls}">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
                '</div>',
                '<span class="ux-desktop-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,
    
    initComponent: function () {
        var me = this;

        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.initTaskBar()

        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            { xtype: 'wallpaper', id: me.id+'_wallpaper' },
            me.createDataView()
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }
        
        mainViewportPanel = me;
        
    },
    
    initTaskBar: function() {
        var me = this;
        me.taskbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig);
        me.bbar = me.taskbar
        me.taskbar.windowMenu = me.windowMenu; 
    },

    afterRender: function () {
        var me = this;
        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);
    
        if(me.autorun) setTimeout(function() {me.autorun()}, 500)
    },

    //------------------------------------------------------
    // Overrideable configuration creation methods

    createDataView: function () {
        var me = this;
        
        var menu = new Ext.menu.Menu({
          items: [
            {
                text: D.t('Edit'),
                handler: function() {me.editShortcut(menu)}
            },{
                text: D.t('Remove shortcut'),
                handler: function() {me.removeShortcut(menu)}
            }
          ]
        });
        
        var view = Ext.create('DesktopView', {
            //xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0, y: 0,   
            tpl: new Ext.XTemplate(me.shortcutTpl),
            listeners: {
                itemcontextmenu: function (view, record, el, index, e, eOpts) {                                
                    menu.view = view
                    menu.rec = record
                    menu.showAt(e.getXY());
                    e.stopEvent()
                }
            }

        });

        return view;
    },
    
    removeShortcut: function(menu) {
        
        var dset = Sess.getState('desktop')
        if(dset.shortcuts) {
            for(var i=0;i<dset.shortcuts.length;i++) {
                if(dset.shortcuts[i].module == menu.rec.data.module) {
                    dset.shortcuts.splice(i,1)
                    Sess.setState('desktop', dset)        
                    break;    
                }
            }                    
        }
        menu.view.getStore().remove(menu.rec)
        //console.log(this)    
    },
    
    editShortcut: function(menu) {
        D.p('Rename', '', menu.rec.data.name, function(t) {
            menu.rec.data.name = t
            menu.rec.commit()
            var dset = Sess.getState('desktop')
            if(dset.shortcuts) {
                for(var i=0;i<dset.shortcuts.length;i++) {
                    if(dset.shortcuts[i].module == menu.rec.data.module) {
                        dset.shortcuts[i] = menu.rec.data
                        Sess.setState('desktop', dset)        
                        return;    
                    }
                }                    
            }
        })
    },

    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
                { text: 'Tile', handler: me.tileWindows, scope: me, minWindows: 1 },
                { text: 'Cascade', handler: me.cascadeWindows, scope: me, minWindows: 1 })

        return ret;
    },

    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: D.t('Restore'), handler: me.onWindowMenuRestore, scope: me },
                { text: D.t('Minimize'), handler: me.onWindowMenuMinimize, scope: me },
                { text: D.t('Maximize'), handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: D.t('Create shortcut on desktop'), handler: me.onWindowMenuCreateShortcut, scope: me },
                { text: D.t('Create quick start icon'), handler: me.onWindowMenuCreateQuickStart, scope: me },
                '-',
                { text: D.t('Close'), handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function (e,x) {
        var me = this, menu = me.contextMenu;
        
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function (menu) {
        var me = this, count = me.windows.getCount();

        menu.items.each(function (item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function (dataView, record) {
        
        var me = this, module, win;
        if(record.data.controller) {
            var contr = Ext.create(record.data.controller)
            contr.app = me.app
            if(record.data._id) 
                contr.modify({data: {_id: record.data._id}})
            else
                win = me.app.createWindow(contr)
        } else {
            module = me.app.getModule(record.data.module),
            win = module && module.createWindow();
        }
        if (win) {
            me.restoreWindow(win);
        }
    },

    onWindowClose: function(win) {
        var me = this;
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
        items[4].setDisabled(!!win.noShortcut);
        
        var log = !!win.noShortcut
        
        if(!log) {
            var form = win.down('form')
            if(form) log = !!form.rowId
        }
        
        items[5].setDisabled(log);
        
    },

    onWindowMenuClose: function () {
        var me = this, win = me.windowMenu.theWin;

        win.close();
    },
    
    onWindowMenuCreateQuickStart: function() {
        var me = this, win = me.windowMenu.theWin;
        var sh = { name: win.title, iconCls: win.iconCls, module: win.id, controllerName: (win.controllerName || null) }
 
        var b = me.taskbar.quickStart.add(Ext.applyIf(sh, {
            handler: function() {
                me.taskbar.onQuickStartClick(this)
            }     
        }))
        
        b.getEl().on('contextmenu', function(e) {
            me.taskbar.onQuickStartContextMenu(e, b)
        });
        
        
        me.taskbar.quickStart.setWidth(me.taskbar.quickStart.width + me.quickStartIconSize)
        
        
        var dset = Sess.getState('desktop')
        if(!dset) dset = {}
        if(!dset.quickStart) dset.quickStart = []
        dset.quickStart.push(sh)
        Sess.setState('desktop', dset)
    },
    
    onWindowMenuCreateShortcut: function() {
        var me = this, win = me.windowMenu.theWin;
        var sh = { name: win.title, iconCls: win.iconCls, module: win.id, controller: (win.controllerName || null) }
            ,form = win.down('form')
            
        if(form && form.rowId) {
            sh._id = form.rowId             
        }
        
        
        var dset = Sess.getState('desktop')
        if(!dset) dset = {}
        if(!dset.shortcuts) dset.shortcuts = []
        
        dset.shortcuts.push(sh)
        Sess.setState('desktop', dset, function() {
            me.shortcutsView.getStore().add(Ext.clone(sh))
        })
    },

    onWindowMenuHide: function (menu) {
        setTimeout(function() {menu.theWin = null;}, 100)
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
        win.toFront();

    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function () {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd, resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function (wallpaper, stretch) {
        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0, y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },
    
    getDefaultWindowConf: function() {
        return {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true
            }       
    },

    createWindow: function(config, cls) {
        var me = this, win, cfg = Ext.applyIf(config || {}, me.getDefaultWindowConf());
        cls = cls || 'Ext.window.Window';
 
        cfg.scope = me

        

        win = me.add(new Ext.create(cls,cfg));
        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;
        win.on({
            activate: function() {me.updateActiveWindow(1)},
            show: function() {me.updateActiveWindow(2)},
            destroy: function() {
                
            },//me.updateActiveWindow(3)},
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });
        win.on({
            boxready: function () {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });
        
        // replace normal window close w/fadeOut animation:
        win.doClose = function ()  {
            window.location = "#";
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        win.destroy();
                        
                    }
                }
            });
        };
        return win;
    },

    getActiveWindow: function () {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);              
            }
        });
    },

    updateActiveWindow: function (x) {
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        
        if(activeWindow)
            me.app.hashProcessor.changeHash(activeWindow.id, x)
        
        
        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el && last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },
    
    ready: function() {
        this.setDefaultTray()
        this.setUserSettings()            
    },
    
    setDefaultTray: function() {
        var StatusButton = Ext.create('Ext.button.Button', {
            tooltip: 'offline',
            border: false
        })
        var setOnline = function(online) {
            if(online) {
                StatusButton.setIconCls('fa fa-wifi')
                StatusButton.setTooltip('online')
            } else {
                StatusButton.setIconCls('offl')
                StatusButton.setTooltip('offline')
            }
        }
        Core.ws.on('open', function() {
            setOnline(true)
        })
        Core.ws.on('close', function() {
            setOnline(false)
        })
        setOnline(Core.ws.isReady())    
        this.taskbar.tray.insert(0, StatusButton)
    },
    
    setUserSettings: function() {
        var me = this
            ,dset = Sess.getState('desktop')
        if(dset) {
            setTimeout(function(){
                me.setWallpaper(dset.wallPaper, dset.stretch);
                if(dset.shortcuts) {
                    me.shortcutsView.getStore().add(Ext.clone(dset.shortcuts))
                }
                if(dset.quickStart) {
                    var w = 0
                    var fn = function(b) {
                        var el = b.getEl()
                        if(el){
                            el.on('contextmenu', function(e) {
                                me.taskbar.onQuickStartContextMenu(e, b)
                            });
                        }
                    }
                    for(var i=0;i<dset.quickStart.length;i++) {
                        w +=  me.quickStartIconSize;
                        dset.quickStart[i].handler = function() {
                            me.taskbar.onQuickStartClick(this)
                        }
                        fn(me.taskbar.quickStart.add(dset.quickStart[i]))                                            
                    }
                    me.taskbar.quickStart.setWidth(w);
                }
            }, 500)
        }
    }
    
    ,autorun: function() {
        
        if(this.app.autorunStr) {
            var me = this, runs = me.app.autorunStr.split('/n')
            for(var i=0;i<runs.length;i++) {
                Ext.create(runs[i],{
                    app: me.app
                }).autorun()
            }
        }
        
        var cmd = location.href.split('#')[1]
        
        if(cmd) {
            
            cmd = decodeURIComponent(cmd)
            
            try {
                cmd = JSON.parse(cmd)
            } catch(e) {return;}
            
            if(cmd && cmd.controller) {
                var ctr = Ext.create(cmd.controller,{app: this.app})
                
                if(cmd.data) {
                    ctr.modify(cmd, null)
                } else {
                    ctr.createWindow().show().maximize(true)
                }
            }
        } 
        
    }
});


Ext.define('DesktopView', {
    extend : 'Ext.view.View',
    requires : [
        'Ext.ux.DataView.Draggable'
    ],
    mixins: {
        draggable: 'Ext.ux.DataView.Draggable'
    },
    initComponent: function() {
        this.mixins.draggable.init(this, {
            ddConfig: {
                ddGroup: 'deskGroup'
            }
        });
        this.on('render', function(el) {
            Ext.create('DeskDropZone', {view: el})    
        })
        this.callParent(arguments);
    }
});

Ext.define('DeskDropZone', {
    extend: 'Ext.view.DropZone',
    ddGroup: 'deskGroup',
    handleNodeDrop : function(data, record, position, e) {
        var view = this.view,
            store = view.getStore(),
            index, records, i, len;

        store.remove(data.records);

        index = store.indexOf(record);
        if (position !== 'before') {
            index++;
        }
        store.insert(index, data.records);
        view.getSelectionModel().select(data.records);
        
        var recs = []
        store.each(function(r) {
            recs.push(r.data)            
        })
        var dset = Sess.getState('desktop')
        dset.shortcuts =  recs
        Sess.setState('desktop', dset)        
    }
});