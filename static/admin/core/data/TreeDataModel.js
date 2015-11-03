Ext.define('Core.data.TreeDataModel', {
    extend: 'Core.data.DataModel'
    
    ,idField: '_id'
    
    ,idProperty: '_id'

    /**
     * @scope: Client
     * @method
     * Reordering items in the pages tree
     * @public
     */
    ,reorder: function(params, callback) {
        this.runOnServer('reorder', params, callback)
    }
    
});