Ext.define('Desktop.modules.users.view.GroupsForm', {
    extend: 'Core.form.DetailForm',
    
    titleIndex: 'name',
    width: 550,
    height: 400,
    region: 'center',
    layout: 'border',
    defaults: {
        margin: '0',
    }
    
    ,buildItems: function() {
        var me = this;
        
        return [{
            xtype: 'tabpanel',
            region: 'center',
            items: [
                me.buildForm()
                ,me.modulesAccessTree()
                ,me.pagesAccessTree()
            ]
        }]
    }
    
    ,buildForm: function() {
        return {
            xtype: 'panel',
            title: D.t('Description'),
            defaults: {
                xtype: 'textfield',
                margin: '5',
                width: 500,
                labelWidth: 200
            },
            items: [
            {
                name: 'name',
                fieldLabel: D.t('Group name')
            },{
                name: 'description',
                fieldLabel: D.t('Description')
            },{
                name: 'desktopClassName',
                fieldLabel: D.t('Desktop class name')
            },{
                name: 'autorun',
                xtype: 'textarea',
                height: 60,
                fieldLabel: D.t('Autorun')
            }]
        }
    }
    
    ,modulesAccessTree: function() {
        return {
            xtype: 'grid',
            action: 'model-access',
            title: D.t('Modules'),
            store: Ext.create("Ext.data.Store", {
                fields: ['name', 'hname', 'read', 'add', 'modify', 'del', 'ext']                
            }),            
            columns: [
                {   
                    text: D.t("Model name"),
                    flex: 1,
                    menuDisabled: true,
                    sortable: true,
                    dataIndex: 'hname'
                    //renderer: function(v) {return D.t(v.trim())}
                },{   
                    text: D.t("Read access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'read'
                },{   
                    text: D.t("Add access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'add'
                },{   
                    text: D.t("Modify access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'modify'
                },{   
                    text: D.t("Delete access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'del'
                }
            ]
        }
    }
    
    ,pagesAccessTree: function() {
        return Ext.create('Desktop.modules.users.view.AccessPagesTree', {            
            title: D.t('Pages')
        })
    }
})