Ext.define('Ext.ux.desktop.HotkeyProccessor', {
    
    init: function(app) {
        var me = this;
        
        this.app = app;
        
        new Ext.KeyMap( Ext.getBody(), [
        /* Ctrl+S  (Only save current window data) */
        {
            key: "s",
            ctrl:true,
            shift: false,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=formapply]', 'click')
            }
        }
        /* Ctrl+Shift+S (Save and close) */
        ,{
            key: "s",
            ctrl:true,
            shift: true,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=formsave]', 'click')
            }
        }
        /* Ctrl+P  (Print) */
        ,{
            key: "p",
            ctrl:true,
            shift: false,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=print]', 'click')
            }
        }
        /* Delete * /
        ,{
            key: Ext.EventObject.DELETE,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=remove]', 'click')
            }
        }
        / * Insert * /
        ,{
            key: Ext.EventObject.INSERT,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=add]', 'click')
            }
        }
        /* Ctrl+R  (Refresh) */
        ,{
            key: "r",
            ctrl:true,
            shift: false,
            fn: function( e, ele ){
                me.findAndFire(ele, '[action=refresh]', 'click')
            }
        }
        ]);
        
    }
    
    ,findComponentByElement: function(node) {
        var topmost = document.body,
            target = node,
            cmp;
     
        while (target && target.nodeType === 1 && target !== topmost) {
            cmp = Ext.getCmp(target.id);
            if (cmp) return cmp;
            target = target.parentNode;
        }
        return null;
    }
    
    ,findAndFire: function(ele, element, event, opt) {
        var target = ele.target
            ,elm = this.findComponentByElement(target)
        if(!elm) {
            //elm = this.app.getDesktop().getActiveWindow()
            return true;        
            //console.log('mce-modal-block:',document.getElementById('mce-modal-block'))
        } else {
            ele.preventDefault();
            elm = elm.up('window')
            if(!elm)
               elm = this.app.getDesktop().getActiveWindow() 
        }
        if(elm) {
            elm = elm.down(element)
            if(elm) {
                elm.fireEvent(event, opt)
            }                
        }
    }
    
    
});