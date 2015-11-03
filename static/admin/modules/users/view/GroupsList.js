

Ext.define('Desktop.modules.users.view.GroupsList', {
    extend: 'Core.grid.GridWindow',
    
    //store: "Desktop.modules.users.store.GroupStore",
    filterable: true,
    
    buildColumns: function() {
        return [                
                {
                    text: D.t("Group name"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    text: D.t("Description"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'description'
                }
            ]        
    }
    
})