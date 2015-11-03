
Ext.define('Crm.modules.news.view.NewsList', {
    extend: 'Core.grid.GridWindow',
    
    sortManually: true,
    
    filterbar: true,
    
    buildColumns: function() {
        return [{
            text: 'Title',
            flex: 1,
            sortable: true,
            dataIndex: 'name',
            filter: true
        },{
            text: 'Date start',
            flex: 1,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'date_start',
            filter: true
        },{
            text: 'Date finish',
            flex: 1,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'date_end',
            filter: true
        }]        
    }
    
    
})