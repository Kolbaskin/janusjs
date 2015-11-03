Ext.define('Desktop.core.widgets.MessagesDateColumn', 
{
    extend:'Ext.grid.column.Date'

    ,alias: 'widget.messagedatecolumn'
     
    ,constructor: function() { 
        var me = this;
        me.renderer = function(v,m,r) {
            if(!!me.rend) me.rend(v,m,r)
            return me.prepDate(v)
        }
        this.callParent(arguments)
    }
    
    ,prepDate: function(v) {
        v = new Date(v)
        var cur = new Date(Ext.Date.format(new Date(), 'm/d/Y'))
        if(v<cur) return Ext.Date.format(v, 'j M');
        return Ext.Date.format(v, 'H:i');
    }
});