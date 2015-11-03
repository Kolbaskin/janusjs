/*!
 * Copyright(c) 2006-2015.
 * 
 * 
 */

Ext.define('Crm.modules.news.model.NewsModel', {    
    extend: "Core.data.DataModel"

    ,collection: 'news'
    
    ,removeAction: 'remove'

    ,fields: [{
        name: '_id',
        type: 'ObjectID',
        visible: true
    },{
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'date_start',
        type: 'date',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'date_end',
        type: 'date',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'stext',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'text',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    }]

})

