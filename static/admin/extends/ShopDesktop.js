
Ext.define('Desktop.extends.ShopDesktop', {
    extend: 'Ext.ux.desktop.Desktop'
    
    ,initComponent: function() {
        this.buildTaskBar()
        this.callParent();
    }
    
    ,buildTaskBar: function() {
         var me = this
            ,tbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig)
         
         me.tbar = []
         
         if(
            tbar.startMenu && 
            tbar.startMenu.items.items[0] &&
            tbar.startMenu.items.items[0].items &&
            tbar.startMenu.items.items[0].items.length
         ) {
             var items = tbar.startMenu.items.items[0].items.items
             for(var i=0;i<items.length;i++) {
                 if(items[i].menu) {
                    var menu_items = []                    
                    for(var j=0;j<items[i].menu.items.length;j++) {
                        if(items[i].menu.items.items[j].text != '&#160;') {                       
                            menu_items.push({
                                iconCls: items[i].menu.items.items[j].iconCls + '-32',
                                text: items[i].menu.items.items[j].text,
                                controller: items[i].menu.items.items[j].controller,
                                handler: items[i].menu.items.items[j].handler 
                            })    
                        }
                    }                    
                    me.tbar.push({
                        xtype: 'buttongroup',
                        title: items[i].text,
                        iconCls: items[i].iconCls,
                        defaults: {
                            xtype: 'button',
                            scale: 'large',
                            iconAlign:'top'
                        },
                        items: menu_items
                    })                    
                 }
             }  
         }
    }
    
    ,createWindow: function(config, cls) {
        if(config) config.maximized = true;
        return this.callParent(arguments)
    }
    
    ,getDefaultWindowConf: function() {
        return {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                maximized: true,
                minimizable: false,
                maximizable: false
            }       
    }
    
})