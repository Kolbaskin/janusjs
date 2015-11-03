/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.Settings', {
    extend: 'Ext.window.Window',

    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',
        'Ext.ux.desktop.Wallpaper',
        'Desktop.WallpaperModel'
    ],

    layout: 'anchor',
    title: 'Change Settings',
    modal: true,
    width: 640,
    height: 480,
    border: false,

    initComponent: function () {
        var me = this;

        me.selected = me.desktop.getWallpaper();
        me.stretch = me.desktop.wallpaper.stretch;
        
        me.preview = Ext.create('widget.wallpaper');
        me.preview.setWallpaper(me.selected);
        me.tree = me.createTree();

        me.buttons = [
            { text: D.t('Accept'), scale: 'medium', handler: me.onOK, scope: me },
            { text: D.t('Cancel'), scale: 'medium', handler: me.close, scope: me }
        ];

        me.items = [
            {
                anchor: '0 -30',
                border: false,
                layout: 'border',
                items: [
                    me.tree,
                    {
                        xtype: 'panel',
                        //title: 'Preview',
                        region: 'center',
                        layout: 'fit',
                        items: [ me.preview ]
                    }
                ]
            },
            {
                xtype: 'checkbox',
                boxLabel: 'Stretch to fit',
                checked: me.stretch,
                listeners: {
                    change: function (comp) {
                        me.stretch = comp.checked;
                    }
                }
            }
        ];

        me.callParent();
    },

    createTree : function() {
        var me = this;

        var child = function(img) {
            return { img: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true, setType: 'wallpaper' };
        }
        
        var childTheme = function(theme) {
            return { img: theme + '.png', text: theme, iconCls: '', leaf: true, setType: 'theme' };
        }

        var tree = new Ext.tree.Panel({
            //title: 'Desktop Background',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            width: 150,
            region: 'west',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: { fn: this.setInitialSelection, delay: 100 },
                select: this.onSelect,
                scope: this
            },
            store: new Ext.data.TreeStore({
                model: 'Desktop.WallpaperModel',
                root: {
                    expanded: true,
                    children:[{
                        text: D.t('Wallpaper'),
                        expanded: true,
                        children:[
                            { text: "None", iconCls: '', leaf: true },
                            child('Blue-Sencha.jpg'),
                            child('Dark-Sencha.jpg'),
                            child('Wood-Sencha.jpg'),
                            child('desk.jpg'),
                            child('rocks.jpg'),
                            child('rocks1.jpg'),
                            child('car.jpg'),
                            child('girl.jpg'),
                            child('space.jpg'),
                            child('dragon.jpg'),
                            child('city.jpg')
                            
                        ]
                    },{
                        text: D.t('Themes'),
                        expanded: false,
                        children:[
                            childTheme('aria'),
                            childTheme('classic'),
                            childTheme('crisp'),
                            childTheme('gray'),
                            childTheme('neptune')                      
                            
                        ]
                    }
                ]}
            })
        });

        return tree;
    },

    getTextOfWallpaper: function (path) {
        var text = path, slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash+1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');
        return text;
    },

    onOK: function () {
        var me = this;
        if (me.selected) {
            me.desktop.setWallpaper(me.selected, me.stretch);
            Sess.setState('desktop', {wallPaper: me.selected, stretch:me.stretch})
        }
        
        if(me.selectedTheme) {
            localStorage.setItem('DefaultTheme', me.selectedTheme)
            if(confirm(D.t('To apply the changes require a restart Yode. Restart?'))) {
                location = './'
            }
        }
        
        me.destroy();
    },

    onSelect: function (tree, record) {
        var me = this;
        
        if(!record.data.leaf) return;
        
        if (record.data.img) {
            if(record.raw.setType == 'wallpaper') {
                me.selected = 'wallpapers/' + record.data.img;
                me.selectedTheme = '';
            } else {
                me.selectedTheme = record.data.text;
                me.selected = '';
                me.preview.setWallpaper('themes/' + record.data.img);
                return;
            }
        } else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }

        me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function () {
        var s = this.desktop.getWallpaper();
        if (s) {
            var path = '/Wallpaper/' + this.getTextOfWallpaper(s);
            this.tree.selectPath(path, 'text');
        }
    }
});
