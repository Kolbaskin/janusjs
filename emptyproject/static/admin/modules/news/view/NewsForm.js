Ext.define('Crm.modules.news.view.NewsForm', {
    extend: 'Core.form.DetailForm'
    
    ,titleIndex: 'name'
    
    ,layout: 'border'
    
    ,border: false
    ,bodyBorder: false
    
    ,height: 450
    ,width: 750
    
    ,buildItems: function() {
        return [{
            xtype: 'panel',
            region: 'north',
            border: false,
            bodyBorder: false,
            layout: 'anchor',
            bodyStyle: 'padding: 5px;',
            items: [{
                name: 'name',
                anchor: '100%',
                xtype: 'textfield',
                fieldLabel: 'Title'
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'datefield',
                    fieldLabel: 'Date start',
                    name: 'date_start',
                    flex: 1,
                    margins: '0 10 0 0'
                },{
                    xtype: 'datefield',
                    fieldLabel: 'Date finish',
                    name: 'date_end',
                    flex: 1
                }]
            },{
                xtype: 'textarea',
                anchor: '100%',
                height: 60,
                name: 'stext',
                emptyText: 'Announce'
            }]  
        },
            this.fullText()
        ]
    }
    
    ,fullText: function() {
        return Ext.create('Desktop.modules.pages.view.HtmlEditor', {
                hideLabel: true,
                region: 'center',
                name: 'text'
            })
    }
})