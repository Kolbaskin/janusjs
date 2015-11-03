/*!
 * Copyright(c) 2006-2015.
 * 
 * 
 */

Ext.define('{{nameSpace}}.modules.{{parent}}.model.{{Name}}Model', {    
    extend: "Core.data.DataModel"

    ,collection: '{{Name}}'
    
    //,removeAction: 'remove'

    ,fields: [{
        name: '_id',
        type: 'ObjectID',
        visible: true
    },{
        name: 'indx',
        type: 'sortfield',
        sort: 1,
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'taxes',
        type: 'array',
        filterable: false,
        editable: true,
        visible: true
    }]

})

