
Ext.define('Desktop.extends.UserDesktop', {
    extend: 'Desktop.extends.AdminDesktop'


    ,buildMenubar: function() {
        var me = this
            ,items = [];
        
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
       },'->',{
            xtype: 'button',
            scale: 'medium',
            text: 'Мои покупки',
            handler: function() {
                Ext.create('Crm.modules.shop.controller.BasketUser', {
                    app: me.app
                }).createWindow().show()
            } 
       },
        //this.buildStartMenu(),
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
    
})
