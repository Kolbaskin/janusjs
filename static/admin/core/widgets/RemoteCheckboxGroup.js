Ext.define('Desktop.core.widgets.RemoteCheckboxGroup',{
    extend: 'Ext.form.CheckboxGroup'
    ,alias: 'widget.RemoteCheckboxGroup'

    ,initComponent: function() {
        if(this.store) {
            this.buildFromStore()    
        } else
        if(this.model) {
            this.buildFromModel()
        }
        this.callParent();
    }
    
    ,buildFromStore: function() {
       var me = this

       me.store.load({
            scope: this,
            callback: function(records, operation, success) {
                var data = []
                for(var i=0;i<records.length;i++) {
                    data.push(records[i].data)    
                }
                me.buildCheckboxes(data)
            }
        });
    }
    
    ,buildFromModel: function() {
        
    }
    
    ,buildCheckboxes: function(data) {
        var me = this;
        setTimeout(function() {
            if(me.valueField && me.displayField) {
                for(var i=0;i<data.length;i++) {
                    me.add({ boxLabel: data[i][me.displayField], name: me.name, inputValue: data[i][me.valueField] }) 
                }
            }
        }, 100)
    }
    /*
    ,getValue: function() {
        var me = this
            
            ,res = []
        for(var i=0;i<me.items.length;i++) {
            if(me.items.items[i].checked) res.push(me.items.items[i].inputValue)
        }
        me.value = res
        return res
    }
    */
})
    

