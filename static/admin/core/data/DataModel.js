/**
 * @class Core.data.DataModel
 * 
 *
 * Main data model class for admin modules. Client side path of the class is an extend of  {@link Ext.data.Model}. 
 * Server side path is an extend of {@link Core.AbstractModel}. 
 * 
 *     @example
 *     Ext.define('MyProjectNamespace.mymodule.model.mymoduleModel', {
 *         extend: 'Core.data.DataModel',
 *         
 *         // Client method calls server method
 *         myMethod: function(data, callback) {
 *             // your actions on server side
 *             // here you can use methods of server side path of Core.data.DataModel
 *             this.runOnServer('myMethod', data, callback)
 *         },
 * 
 *         // Server method that called by client method
 *         $myMethod: function(data, callback) {
 *             // your actions on server side
 *             // here you can use methods of server side path of Core.data.DataModel
 *             
 *             callback(result)
 *         }
 *     })
 * 
 */
Ext.define('Core.data.DataModel', {
    extend: 'Core.data.Model'
        
    /**
     * @method
     * Client method
     * 
     * Run method on server model
     * @param {String} action
     * @param {Object} data optional
     * @param {Function} callback optional
     * @private
     */
    ,runOnServer: function(action, p1, p2) {
        var me = this
            ,req = {
               model: Object.getPrototypeOf(me).$className, 
               action: action
            }
            ,cb;
        if(Ext.isFunction(p1)) cb = p1
        else
        if(p1) {
            for(var i in p1) req[i] = p1[i]
        }
        if(!cb && !!p2) cb = p2   
        Core.ws.request(req,
            function(data) {   
                if(!!cb) cb(data)
            }
        )
    }
    
    ,getPermissions: function(callback, nm, data) {  

        this.runOnServer('getPermissions', data, callback)
    }
    
    /**
     * @method
     * Client method
     * 
     * Getting one record
     * @param {String} id
     * @param {Function} callback
     * 
     */
    ,readRecord: function(id, callback) {        
        this.runOnServer('read', {filters: [{property:"_id", value: id}]}, function(data) {
            var res = {}
            if(data && data.list && data.list[0]) {
                res = data.list[0]    
            }        
            callback(res)
        })
    }
    
    /**
     * @method
     * Client method
     * 
     * Getting all records
     * @param {Function} callbacl
     * @param {Object} params
     * 
     */
    ,readAll: function(callback, params) {   
        if(!params) params = params
        this.runOnServer('read', params, callback)
    }
    

    ,write: function(data, callback) {  
        this.runOnServer('write', data, callback)
    }
    
    ,copy: function(id, callback) {        
        this.runOnServer('copy', {_id: id}, callback)
    }
    
    ,remove: function(data, callback) {   
        this.runOnServer('remove', {records: data}, callback)
    }
    
    ,getNewObjectId: function(cb) {
        this.runOnServer('getNewObjectId', {}, cb)    
    }
    
    ,exportData: function(filters) {
        var me = this, filt = []
        if(filters && filters.items && filters.items.length) {
            for(var i=0;i<filters.items.length;i++) {
                filt.push({
                    operator: filters.items[i].operator,
                    property: filters.items[i].property,
                    type: filters.items[i].type,
                    value: filters.items[i].value
                })
            }
        }
        me.runOnServer('exportData', {filters: filt}, function(data) {          
            if(data && data.file) 
                location = '/Admin.Data.getXls/?file=' + encodeURIComponent(data.file) + '&name=' + me.collection + '.xlsx'    
        })
    }
    
    ,importCsvLine: function(rec, cb) {
        var me = this, data = {}, log = false;       
        for(var i=1;i<me.fields.items.length;i++) {
            if(me.fields.items[i] && rec[i-1] != undefined && rec[i-1] != null) {
                data[me.fields.items[i].name] = rec[i-1]
                log = true;
            } 
        }
        if(log) {
            data.noChangeModel = true
            me.write(data, cb)
        } else cb()
    }
});