

Ext.define('Desktop.modules.templates.view.TemplatesList', {
    extend: 'Core.grid.GridWindow'
    
    ,filtrable: true
    ,sortManually: true
    
    ,buildColumns: function() {
        return [
            {
                text: D.t("Template name"),
                flex: 1,
                sortable: true,
                filter: true,
                dataIndex: 'name'
            },{
                text: D.t("Count of blocks"),
                flex: 1,
                sortable: true,
                dataIndex: 'blocks'
            }               
            
            ,{
                text: D.t("Template"),
                flex: 1,
                sortable: false,
                filter: true,
                dataIndex: 'tpl'
            }
            ,{
                text: D.t("Controller"),
                flex: 1,
                sortable: false,
                filter: true,
                dataIndex: 'controller'
            }
        ]        
    }
})