
Ext.define('{{nameSpace}}.modules.{{parent}}.view.{{Name}}List', {
    extend: 'Core.grid.GridWindow',
    
    sortManually: true,
    
    filterbar: true,
    
    buildColumns: function() {
        return [{
            text: D.t("Title"),
            flex: 1,
            sortable: true,
            dataIndex: 'name',
            filter: true
        }]        
    }
    
    
})