Ext.define('Desktop.modules.mainmenu.store.Store', {
    extend: 'Core.StoreTree',
    
    modelPath: 'Desktop.modules.mainmenu.model.MenuModel'

    
    ,folderSort: true
    ,sorters: [{
        property: 'indx',
        direction: 'ASC'
    }]
})
