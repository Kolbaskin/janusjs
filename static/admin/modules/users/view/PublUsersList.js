

Ext.define('Desktop.modules.users.view.PublUsersList', {
    extend: 'Desktop.core.GridWindow',
    
    filterable: true,
    
    buildColumns: function() {
        return [
                new Ext.grid.RowNumberer(),                
                {
                    text: D.t("Имя"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    text: D.t("Фамилия"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'fname'
                },{
                    text: D.t("Email"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'email'
                },{
                    text: D.t("Статус"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'status',
                    renderer: function(v) {
                        if(v=='1') return 'Специалист'    
                        return 'Частное лицо' 
                    }
                },{
                    text: D.t("Регион"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'region',
                    renderer: function(v) {
                        if(v=='1') return 'Москва'    
                        return 'Мос. область' 
                    }
                },{
                    text: D.t("Активирован"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'activated',
                    renderer: function(v) {
                        if(v===true) return 'Активный' 
                        if(v===false) return 'Заблокирован'
                        return 'Не актив.' 
                    }
                }
            ]        
    }
    
})