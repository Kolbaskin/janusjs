/**
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 * @class Ext.ux.desktop.StartMenu
 */
Ext.define('Ext.ux.desktop.StartMenu', {
    extend: 'Ext.menu.Menu',

    // We want header styling like a Panel
    baseCls: Ext.baseCSSPrefix + 'panel',

    // Special styling within
    cls: 'x-menu ux-start-menu',
    bodyCls: 'ux-start-menu-body',

    defaultAlign: 'bl-tl',

    iconCls: 'user',

    bodyBorder: true,

    width: 300,

    initComponent: function() {
        var me = this;

        me.layout.align = 'stretch';
        
        me.menu = me.checkAccess(me.menu)
     
        me.items = me.menu;
        
        

        me.callParent();

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: 'right',
            cls: 'ux-start-menu-toolbar',
            vertical: true,
            width: 100,
            layout: {
                align: 'stretch'
            }
        }, me.toolConfig));

        me.addDocked(me.toolbar);

        delete me.toolItems;
    },

    addMenuItem: function() {
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
    },

    addToolItem: function() {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    },

    
    checkAccess: function(menu) {
        if(!Sess.superuser) {                      
            var func = function(items) {
                var i = items.length-1
                    ,model
                while(i>=0) {
                    if(items[i]) {
                        if(items[i].menu) {
                            items[i].menu.items = func(items[i].menu.items)
                                                  
                            if(items[i].menu.items.length == 0) items.splice(i,1)
                            else {
                                 // подчистим разделители 
                                 var j = items[i].menu.items.length-1, k 
                                 while(j>0) {
                                     k = j-1
                                     while(k>=0 && items[i].menu.items[k] == '-') {
                                        items[i].menu.items.splice(k,1)
                                        k--
                                     }
                                     j--
                                 }
    
                                 if(items[i].menu.items.length == 0 ||
                                    (items[i].menu.items.length == 1 && items[i].menu.items[0] == '-')) {
                                     items.splice(i,1)
                                 }
                                 
                            }
                        } else if(Sess.modelAccess) {
                            model = '';
                            if(items[i].model) {
                                if(Ext.isString(items[i].model)) 
                                    model = items[i].model
                                else
                                    model = Object.getPrototypeOf(items[i].model).$className
                            } else if(items[i].controller) {
                                // если в запускателе явно не указана модель,
                                // попробуем ее определить по названию контроллера
                                model = items[i].controller.replace('.controller.', '.model.') + 'Model'
                            }
                            
                            if(model) {
                                model = model.replace(/\./g, '-')
                                if(!Sess.modelAccess[model]) items.splice(i,1)
                            }
                        }
                    }
                    i--    
                }
                return items
            }            
            return func(menu)
        } 
        return menu
    }
}); // StartMenu
