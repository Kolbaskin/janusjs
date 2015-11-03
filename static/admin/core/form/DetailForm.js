/**
 * @class Core.form.DetailForm
 * @extend Ext.form.Panel
 * @author Max Tushev
 * This is a main class for a detail forms.
 * 
 *     @example
 *     Ext.define('myNamespace.module.myModule.view.myModuleForm', {
 *         extend: 'Core.form.DetailForm',
 *         buildItems: function() {
 *             return [
 *                 {
 *                     name: 'fieldName',
 *                     fieldLabel: 'Field label'
 *                 },
 *                 {
 *                     name: 'fieldName1',
 *                     fieldLabel: 'Field label 1',
 *                     xtype: 'textarea'
 *                 }
 *             ]
 *         }
 *     });
 * 
 */
Ext.define('Core.form.DetailForm', {
    extend: 'Ext.form.Panel',
    
    defaults: {
        labelWidth: 90,
        xtype: 'textfield',
        margin: '5'
    },
    
    border: false,
    bodyBorder: false,
        
    initComponent: function() {        
        var me = this;
        var items = this.buildItems() 
        this.items = Ext.isArray(items)? items: [items] 
        this.items.push({xtype: 'textfield', name: '_id', hidden: true})        
        
                
        this.tbar = this.buildTbar()        
        this.buttons = this.buildButtons()   
        
        this.on('afterrender', function() {
            var sel = me.down('[startFocus=true]');
            if(sel) {
                setTimeout(function() {
                    sel.focus();
                }, 1000)
            }
        })

        this.callParent();
    }
    
    /**
     * @method
     * Returns form items
     */
    ,buildItems: function() {
        return []
    }
    
    /**
     * @method
     */
    ,buildTbar: function() {
        return null
    }
    
    /**
     * @method
     */
    ,buildButtons: function() {
        if(Ext.getBody().dom.clientWidth < Ext.mobileMaxWidth) {
            return this.buildButtonsMobile()    
        }
        return this.buildButtonsDesktop() 
    }
    
    ,buildButtonsDesktop: function() {
        return [
            {tooltip: D.t('Remove this record'), iconCls:'fa fa-trash', action: 'remove'},
            '->',
            {text: D.t('Save and close'), scale: 'medium', action: 'formsave'},
            {text: D.t('Save'), scale: 'medium',action: 'formapply'},
            '-',
            {text: D.t('Close'), scale: 'medium',action: 'formclose'}            
            
        ]    
    }
    
    ,buildButtonsMobile: function() {
        return [
            {tooltip: D.t('Remove the record'), iconCls:'fa fa-trash', action: 'remove'},
            '->',
            {text: D.t('Save'), scale: 'medium', action: 'formsave'},
            {text: D.t('Close'), scale: 'medium',action: 'formclose'}            
            
        ]    
    }
    
    /**
     * @method
     */
    ,buildButtonsPined: function() {
        return [
            {
                text: D.t('Save'),
                action: 'formapply'
                //iconCls: 'save'
                //,ui: 'primary'
            }
        ]
    }

    ,setValues: function(row) {
        this.rowId = row._id
        this.getForm().setValues(row)    
    }
    
    ,getValues: function() {
        var vals = this.getForm().getValues()    
        vals._id = this.rowId
        return vals;
    }
    
    ,setRowId: function(id) {
        this.rowId = id;
    }

})