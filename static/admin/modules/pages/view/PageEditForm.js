Ext.define('Desktop.modules.pages.view.PageEditForm', {
    
    extend: 'Ext.form.Panel',
    
    requires: [
        'Desktop.core.widgets.ImageField'
    ],
    
    bodyStyle: 'padding: 5px;',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        xtype: 'fieldset',
        collapsible: true,
        collapsed: true,
        layout: 'anchor',
        defaults: {
            xtype: 'fieldcontainer',
            anchor: '100%',
            layout: 'hbox',
            defaults: {
                labelWidth: 120,
                xtype: 'textfield'                            
            }
        }
    },
    
    initComponent: function() {

        this.items = this.buildItems()  
        this.tbar = this.buildFormButtons(),
        this.callParent();
    },
    
    buildItems: function() {
        
        var btnlock = {
            xtype: 'button',
            iconCls: 'lock',
            //width: 25,
            hidden: true,
            action: 'field-lock'
        }
        
        return [
            this.buildPageSetsForm(btnlock)
            ,this.buildMetaForm(btnlock)
            ,this.buildOGForm(btnlock)
            ,this.buildNavForm()
        ]
    }
    
    
    
    ,buildPageSetsForm: function(btnlock) {
        var me = this;
        return {
            title: D.t('Page settings'),
            collapsed: false,
            items: [{
                items:[{   
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: '_id',
                    store: Ext.create('Core.data.ComboStore', {
                        dataModel: Ext.create('Desktop.modules.templates.model.TemplatesModel'),
                        scope: me,
                        autoLoad: false,
                        fieldSet: ['_id', 'name']
                    }),
                    name: 'tpl',
                    queryMode: 'local',
                    allowBlank: false,
                    flex: 1,
                    blankText: D.t('Select template'),
                    fieldLabel: D.t('Template')
                },btnlock]
            },
            {
                items:[{
                    name: 'name',
                    allowBlank: false,
                    flex: 1,
                    blankText: D.t('Enter page name'),
                    fieldLabel: D.t('Page name')
                },btnlock]
            },
            {
                items:[{
                    name: 'alias',
                    //allowBlank: false,
                    flex: 1,
                    blankText: D.t('Enter a name of the pege in the url'),
                    fieldLabel: D.t('Url alias')
                },btnlock]
            },
            {
                items:[{
                    name: 'access',
                    xtype: 'checkbox',
                    flex: 1,
                    fieldLabel: D.t('Access')
                },{
                    name: 'map',
                    xtype: 'checkbox',
                    flex: 1,
                    fieldLabel: D.t('Navigation')
                },]
            },
            {
                name: 'indx',
                xtype: 'textfield',
                hidden: true    
            },
            {
                name: '_id',
                xtype: 'textfield',
                hidden: true
            },
            {
                name: 'pid',
                xtype: 'textfield',
                hidden: true
            }]
        }    
    }
    
    ,buildMetaForm: function(btnlock) {
        return  {
            title: D.t('Meta data'),
            closable: true,
            closed: true,
            items: [{
                items:[{
                    name: 'metatitle',
                    flex: 1,
                    fieldLabel: D.t('Title')
                },btnlock]
            },
            {
                items:[{
                    name: 'metadesctiption',
                    flex: 1,
                    fieldLabel: D.t('Description')
                },btnlock]
            },
            {
                items:[{
                    name: 'metakeywords',
                    flex: 1,
                    fieldLabel: D.t('Keywords')
                },btnlock]
            }
            ]
        }   
    }
    
    ,buildOGForm: function(btnlock) {
        return {
            title: D.t('Open Graph properties'),
            closable: true,
            closed: true,
            items: [{
                items:[{
                    name: 'og_title',
                    flex: 1,
                    fieldLabel: D.t('Title')
                },btnlock]
            },
            {
                items:[{
                    name: 'og_desctiption',
                    flex: 1,
                    fieldLabel: D.t('Description')
                },btnlock]
            },
            {   
                width:170,
                items:[{      
                    xtype: 'imagefield',
                    fieldLabel: D.t('Image'),
                    tumbSizes: '500x',
                    width: 150,
                    height: 115,
                    name: 'og_img'
                }]
            }
            ]
        }    
    }
    
    ,buildNavForm: function(btnlock) {
        return {
            title: D.t('Navigation'),
            closable: true,
            closed: true,
            items: [{
                items:[{
                    name: 'nav_top',
                    xtype: 'checkbox',
                    flex: 1,
                    fieldLabel: D.t('Top menu')
                }]
            },{
                items:[{
                    name: 'nav_bottom',
                    xtype: 'checkbox',
                    flex: 1,
                    fieldLabel: D.t('Bottom menu')
                }]
            },{
                items:[{
                    name: 'nav_lng',
                    xtype: 'checkbox',
                    flex: 1,
                    fieldLabel: D.t('Language menu')
                }]
            }
            
            ]
        }    
    }

    
    ,buildFormButtons: function() {
        return [{
            text: D.t('Save'),
            tooltip: D.t('Save the page'),
            //iconCls: 'primary',
            disabled: true,
            action: 'formsave'
        },'->',{
            tooltip:D.t('Remove the page'),
            iconCls: 'fa fa-trash',
            disabled: true,
            action: 'formremove'
        }]
    }
    
})