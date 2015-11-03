Ext.define('Desktop.modules.templates.model.TemplatesModel', {    
     extend: "Core.data.DataModel"
    
    ,collection: 'admin_templates'

    ,fields: [{
        name: '_id',
        type: 'ObjectID',
        visible: true
    },{
        name: 'name',
        type: 'string',
        filterable: true,
        unique: true,
        editable: true,
        visible: true
    },{
        name: 'blocks',
        type: 'number',
        editable: true,
        filterable: true,
        visible: true
    },{
        name: 'tpl',
        type: 'string',
        editable: true,
        filterable: true,
        visible: true
    },{
        name: 'controller',
        type: 'string',
        editable: true,
        filterable: true,
        visible: true
    },{
        name: 'img',
        type: 'image',
        editable: true,
        visible: true
    },{
        name: 'indx',
        type: 'sortfield',
        sort: 1,
        filterable: true,
        editable: true,
        visible: true
    }]
})