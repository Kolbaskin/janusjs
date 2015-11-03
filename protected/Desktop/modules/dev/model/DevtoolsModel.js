/**
 * @author Max Tushev
 * @scope Server, Client
 * The model for Users module 
 * @private
 */
Ext.define('Desktop.modules.dev.model.DevtoolsModel', {    
    extend: "Core.data.DataModel"


    ,fields: [{
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'controller',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    },{
        name: 'description',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    }]
    
    ,getData: function(params, cb) {
        
        cb({total:2, list: [{name: 'Module 1', controller: 'Contr.qwewe', description: 'AAA'}, {name: 'Module 2', controller: 'Contr.qwew222e', description: 'AAAOOO'}]})
        
    }
})