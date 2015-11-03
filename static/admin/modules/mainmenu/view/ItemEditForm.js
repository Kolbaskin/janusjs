Ext.define('Desktop.modules.mainmenu.view.ItemEditForm', {
    extend: 'Ext.form.Panel',
    bodyStyle: 'padding: 5px;',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        xtype: 'fieldset',
        layout: 'anchor',
        defaults: {
            labelWidth: 120,
            xtype: 'textfield',
            anchor: '100%'            
        }
    },
    
    initComponent: function() {

        this.items = this.buildItems()  
        this.tbar = this.buildFormButtons()
        this.callParent();
    },
    
    buildItems: function() {
        
        return [
        {
            title: D.t('Item settings'),
            items: [
            {
                name: 'name',
                allowBlank: true,
                blankText: D.t('Enter item name'),
                fieldLabel: D.t('Item name')
            },
            {
                name: 'dir',
                allowBlank: true,
                blankText: D.t('Enter a path to the page in a browser'),
                fieldLabel: D.t('Web path')
            },
            /*{
                name: 'indx',
                allowBlank: true,
                blankText: D.t('Index of menu or sort index for items'),
                fieldLabel: D.t('Index')
            },*/
            {
                name: '_id',
                inputType: 'hidden'
            },
            {
                name: 'pid',
                inputType: 'hidden'
            }]
        }
        ]
    }
    
    ,buildFormButtons: function() {
        return [{
            text: D.t('Save'),
            tooltip: D.t('Save item'),
            ui:'primary',
            //disabled: true,
            action: 'formsave'
        },'->',{
            tooltip:D.t('Remove the item'),
            ui:'remove',
            //disabled: true,
            action: 'formremove'
        }]
    }
    
})