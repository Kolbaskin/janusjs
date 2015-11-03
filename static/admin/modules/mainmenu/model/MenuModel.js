Ext.define('Desktop.modules.mainmenu.model.MenuModel', {    
     extend: "Core.data.TreeDataModel"
    
    ,root: {
        name: 'Index page',
        expanded: false
    }
    
    ,collection: 'mainmenu'
    ,removeAction: 'mark'

    ,fields: [
    {
        name: 'id',
        mapping: '_id',
        type: 'ObjectID',
        editable: false,
        visible: true
    },
    {
        name: 'pid',
        type: 'ObjectID',
        editable: true,
        visible: true
    },    
    {
        name: 'name',
        type: 'string',
        unique: true,
        editable: true,
        visible: true
    },
    {
        name: 'indx',
        type: 'int',
        sort: 'ASC',
        unique: true,
        editable: true,
        visible: true
    },
    {
        name: 'dir',
        type: 'string',
        editable: true,
        visible: true
    },
    {
        name: 'mtime',
        type: 'date',
        editable: true,
        visible: true
    } 
    ,
    {
        name: 'blocks',
        editable: true,
        visible: true
    }]
    
    ,afterReorder: function(data, callback) {
        var me = this;
        var func = function(i) {
            if(i>=data.length) {
                callback(data)
                return;
            }
            data[i].indx = 'auto'
            //data[i].parents = '/'
            me.write(data[i], function() {
                func(i+1)
            })
        }
        func(0)
    }
    
})

