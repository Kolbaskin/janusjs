Ext.define('Desktop.modules.users.view.PublUsersForm', {
    extend: 'Desktop.core.DetailForm',
    
    titleIndex: 'fname',
    
    buildItems: function() {
        return [
        {
            name: 'name',
            labelWidth:200,
            width: 500,
            fieldLabel: D.t('Имя')
        },{
            name: 'fname',
            labelWidth:200,
            width: 500,
            fieldLabel: D.t('Фамилия')
        },{
            name: 'phone',
            labelWidth:200,
            width: 500,
            fieldLabel: D.t('Телефон')
        },{
            name: 'email',
            labelWidth:200,
            width: 500,
            fieldLabel: D.t('Email')
        },{
            xtype: 'combo',
            labelWidth:200,
            width: 500,
            name: 'status',
            fieldLabel: D.t('Статус'),
            valueField: 'code',
            displayField: 'name',
            queryMode: 'local',
            store: Ext.create("Ext.data.ArrayStore", {
                fields: ['code','name'],
                data: [['1','Специалист'], ['2','Частное лицо']]
            })
        },{
            xtype: 'combo',
            labelWidth:200,
            width: 500,
            name: 'region',
            fieldLabel: D.t('Регион'),
            valueField: 'code',
            displayField: 'name',
            queryMode: 'local',
            store: Ext.create("Ext.data.ArrayStore", {
                fields: ['code','name'],
                data: [['1','Москва'], ['2','Московская область']]
            })
        },{
            xtype: 'checkbox',
            labelWidth:200,
            width: 500,
            name: 'activated',
            fieldLabel: D.t('Активирован')
        },{
            name: 'ads1',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('продажи квартир')
        },{
            name: 'ads2',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('аренда квартир')
        },{
            name: 'ads3',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('продажи домов')
        },{
            name: 'ads4',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('продажи участков')
        },{
            name: 'ads5',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('аренда домов')
        },{
            name: 'ads6',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('продажа коммерческой недв.')
        },{
            name: 'ads7',
            labelWidth:200,
            width: 260,
            fieldLabel: D.t('аренда коммерческой недв.')
        }
        ]
    }
    
})