Ext.define('Desktop.core.widgets.DateTime', 
{
    extend:'Ext.form.FieldContainer'
    ,mixins: 
    {    field: 'Ext.form.field.Field'
    }
    ,alias: 'widget.xdatetime'
        
    ,combineErrors: true
    ,msgTarget: 'under'
    
    ,layout: 'hbox'
    ,dateFormat: 'Y-m-d'
    ,timeFormat: 'H:i:s'
    ,dateTimeFormat: 'c'
    ,dateCfg:{}
    ,timeCfg:{}
    ,btnCfg:{}
        
    ,btnNowText: 'Set now'
    ,btnClearText: 'Clear'

    ,readOnly: false // ReadOnly
    
    // internal
    ,dateValue: null // Holds the actual date  
    ,dateField: null
    ,timeField: null
    ,btnField: null

    ,initComponent: function()
    {    var me = this;        
        me.items = me.itmes || [];
        me.items.push(Ext.apply(
        {    xtype: 'datefield',
             format: me.dateFormat,
             flex: 1,
             submitValue: false,
             listeners:
            {    change: Ext.bind(this.onChange, this)           
            }
         }, me.dateCfg));
        me.items.push(Ext.apply(
        {    xtype: 'timefield',
            format: me.timeFormat,
            flex: 1,
            submitValue: false,
             listeners:
             {    change: Ext.bind(this.onChange, this)    
             }
        }, me.timeCfg));
        
        
        if (me.btnNowText && !me.readOnly)
        {    me.items.push(
                Ext.apply(
                {    xtype: 'button',
                    text: me.btnNowText,
                    flex: 0,
                    autoWidth: false,                    
                    handler: Ext.bind(this.onBtnClick, this)
                })
            );
        }
        
    
        me.callParent();
        
        me.dateField = me.down('datefield');
        me.timeField = me.down('timefield');
        me.btnField = me.down('button');
           me.initField();
    }
 
    ,getValue: function() 
    {     var value = null,
                date = Ext.Date.format(new Date(this.dateField.getValue()), 'Y-m-d'),
                time = this.timeField.getSubmitValue();

        if(date)
        {    if(time)
            {    var format = this.getFormat()
                value = Ext.Date.parse(date + ' ' + time, 'Y-m-d H:i:s')
            }
            else
            {    value = this.dateField.getValue()
            }
        }
        return value;
    }
    
    ,getSubmitValue: function()
    {    var value = this.getValue();
        return value ? Ext.Date.format(value, this.dateTimeFormat) : null;

    }
 
    ,setValue: function(value) 
    {   // if (Ext.isString(value))
       // {    value = Ext.Date.parse(value, this.dateTimeFormat);
        //}
        value = new Date(value)
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    }
    
    ,getFormat: function()
    {    return (this.dateField.submitFormat || this.dateField.format) + " " + (this.timeField.submitFormat || this.timeField.format)
    }
    
    ,updateBtn: function()
    {    if (!this.btnField) return;
        if (this.getSubmitValue() === null)
        {    this.btnField.setText(this.btnNowText);
        }
        else
        {    this.btnField.setText(this.btnClearText);
        }
    }
    
    ,onBtnClick: function(btn, e)
    {    if (this.getSubmitValue() == null)
        {    this.setValue(new Date());
        }
        else
        {    this.setValue(null);
        }
    }
    
    ,onChange: function( field, newValue, oldValue, options )
    {    this.updateBtn();        
    }
    
    // Bug? A field-mixin submits the data from getValue, not getSubmitValue
    ,getSubmitData: function() {
           var me = this,
           data = null;
           if (!me.disabled && me.submitValue && !me.isFileUpload()) {
               data = {};
               data[me.getName()] = '' + me.getSubmitValue();
           }
           return data;
           }
});