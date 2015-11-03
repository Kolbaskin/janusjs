exports.collection = 'users'

exports.fields = [
    {
        name: '_id',
        type: 'ObjectID',
        visible: true
    },
    {
        name: 'name',
        type: 'string',
        filterable: true,
        //unique: true,
        editable: true,
        visible: true
    },
    {
        name: 'fname',
        type: 'string',
        filterable: true,
        unique: true,
        editable: true,
        visible: true
    },
    {
        name: 'phone',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },
    {
        name: 'email',
        type: 'string',
        filterable: true,
        vtype: 'email',
        editable: true,
        visible: true
    },
    {
        name: 'status',
        type: 'string',
        editable: true,
        visible: true
    },
    {
        name: 'region',
        type: 'string',
        editable: true,
        visible: false
    }
    ,
    {
        name: 'activated',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'ads1',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads2',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads3',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads4',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads5',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads6',
        type: 'int',
        editable: true,
        visible: false
    },{
        name: 'ads7',
        type: 'int',
        editable: true,
        visible: false
    }
        
]