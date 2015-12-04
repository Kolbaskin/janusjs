Ext.define('Desktop.modules.users.view.UsersForm', {
    extend: 'Core.form.DetailForm',
    
    titleIndex: 'login',
    
    requires: [
        'Ext.ux.form.ItemSelector'
    ],
    
    defaults: {
        labelWidth: 150,
        anchor: '100%',
        xtype: 'textfield'
    },
    layout: 'anchor',
    width: 500,
    bodyStyle: 'padding: 10px',
    
    buildItems: function() {
        return [
        {
            name: 'login',
            fieldLabel: D.t('Login')
        },
        {
            name: 'email',
            fieldLabel: D.t('Email')
        },
        {
            name: 'pass',
            inputType: 'password',
            fieldLabel: D.t('Password')
        },
        this.buildGroupCombo(),
        this.buildXGroups(),
        {
            xtype: 'checkbox',
            uncheckedValue: 0,
            name: 'dblauth',
            fieldLabel: D.t('Session password')
        },{
            xtype: 'checkbox',
            uncheckedValue: 0,
            name: 'act1',
            fieldLabel: D.t('Модератор компаний')
        }
        ]
    }
    
    ,buildGroupCombo: function() {
        var me = this;
        return {
            xtype: 'combo',
            name: 'groupid',
            fieldLabel: D.t('Main group'),
            valueField: '_id',
            displayField: 'name',
            queryMode: 'local',
            
            store: Ext.create('Core.data.ComboStore', {
                dataModel: Ext.create('Desktop.modules.users.model.GroupsModel'),
                fieldSet: ['_id', 'name'],
                scope: me
            })
        }
    }
    
    
    ,buildXGroups: function() {
        return {
            xtype: 'tagfield',
            fieldLabel: D.t('Extended groups'),
            store: Ext.create('Core.data.Store', {
                dataModel: 'Desktop.modules.users.model.GroupsModel',
                fieldSet: '_id,name'    
            }),
            displayField: 'name',
            valueField: '_id',
            queryMode: 'local',
            name: 'xgroups',
            filterPickList: true
        }
        
        
        
    }  
    
})