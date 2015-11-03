/**
 * @class Core.data.Store
 * @extend Ext.data.Store
 * @private
 * @author Max Tushev <maximtushev@gmail.ru>
 * 
 * Yode data store base class.
 * 
 *     @example *     
 *     var store = Ext.create('Core.data.Store',{
 *         dataModel: 'My.Model.Class.Name',
 *         scope: window, // Specify a link to window there this store is used
 *         fieldSet: ['_id', 'name'] // List the fields that you need
 *     })
 */
Ext.define('Core.data.BufferedStore', {
    extend: 'Ext.data.BufferedStore',
    
    //sorters: 'level',
    //filters: [],
    /*
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*'        
    ],
      */  
    //buffered: true,
    leadingBufferZone: 50,
    pageSize: 25,  
      
    constructor: function(options) {                
        
        //Ext.apply(this, options)
       
        if(options.autoLoad === undefined) options.autoLoad = true
        
        if(!options) options = {}

        this.wsModel = Ext.create('Ext.data.Model', {
             fields: this.initModel({
                dataModel: options.dataModel || this.dataModel,
                fieldSet: options.fieldSet || this.fieldSet
            })
        })
        //options.data = []
        
        options.remoteSort = true
        options.remoteGroup = true
        options.remoteFilter = true

        
             
        this.wsProxy = this.createProxy({
            dataModel: options.dataModel || this.dataModel,
            fieldSet: options.fieldSet || this.fieldSet
        })
        
        if(options.scope) this.scope = options.scope
        
        this.initDataGetter(options) 
        
        this.callParent(options);

    }
    

    
    /**
     * @method
     * @private
     * Setting up proxy and reader
     * @param {Object} options
     */ 
    ,initDataGetter: function() {
        var me = this;
                    
        setTimeout(function() {
            me.setModel(me.wsModel)
            me.setProxy(me.wsProxy)
            //me.createReader()
            //if(me.autoLoad) {
                me.load();
                //}
        }, 100)
        
                
        me.dataActionsSubscribe()
    }
    
    /**
     * @method
     * @private
     * Model initialisation
     * @param {Object} options
     */
    ,initModel: function(options) {
        var me = this
            ,modelPath
            ,fields = []
        
        me.id = 'store-' + (new Date()).getTime()+Math.random();
       
        if(options.dataModel) {
            if(Ext.isString(options.dataModel)) {
                me.dataModel = Ext.create(options.dataModel)
                me.modelPath = options.dataModel
            } else {    
                me.dataModel = options.dataModel
                me.modelPath = Object.getPrototypeOf(options.dataModel).$className
                
            }
        }
        
            
        if(options.fieldSet) {
            if(Ext.isString(options.fieldSet))
                options.fieldSet = options.fieldSet.split(',')
            fields = [{name: '_id'}] 
            
            for(var i=0;i<options.fieldSet.length;i++) 
                fields.push({name: options.fieldSet[i]})
        } else {
            fields = options.dataModel.fields.items
        }
        return fields;
    }
    
    /**
     * @method
     * @private
     * @param {Object} options
     */
    ,createProxy: function(options) {
        var me = this;
    
        
        return Ext.create('Ext.ux.data.proxy.WebSocket',{
            storeId: me.id,
            websocket: Core.ws,
            params: {
                model: me.modelPath,
                scope: me.id,
                fieldSet: options.fieldSet   
            },
            reader: {
                 type: 'json',
                 rootProperty: 'list'
                 ,totalProperty: 'total'
                 ,successProperty: 'success'
            },
            simpleSortMode: true
            ,filterParam: 'query'
            ,remoteFilter: true
        })
    }
    
    /**
     * @method
     * @private
     */
    ,createReader: function() {
        var p = this.getProxy();
        p.setReader(Ext.create('Ext.data.reader.Json', {
             rootProperty: 'list'
             ,totalProperty: 'total'
             ,successProperty: 'success'
        }))
    }
    /*
    ,createFiltersCollection: function() {
        var x = this.getData();
        if(!!x.getFilters) return x.getFilters()
        return Ext.create('Ext.util.FilterCollection', {filters: []});
    }
    
    ,createSortersCollection: function() {
        var x = this.getData();
        if(!!x.getSorters) return x.getSorters()
        return Ext.create('Ext.util.Sorter', {property: '_id'});
    }
    */
    /**
     * @method
     * Subscribing this store to the server model events
     */
    ,dataActionsSubscribe: function() {
        var me = this
            ,wid = (me.scope? me.scope.id: me.modelPath);
        
        if(me.scope) {
            // remove subscription when window is closed
            me.scope.on('destroy', function() {
                Core.ws.unsubscribe(wid)    
            })        
        }
        Core.ws.subscribe(wid, me.modelPath, function(action, data) {
            me.onDataChange(action, data)
        })
    }
    
    /**
     * @method
     * This method fires when the model data has been changed on the server
     * @param {String} action one of ins, upd or remove
     * @param {Object} data
     */
    ,onDataChange: function(action, data) {
        var me = this
        if(!Ext.isArray(data)) data = [data]
        switch(action) {
            case 'ins'   : me.insertData(data);break;
            case 'upd'   : me.updateData(data);break;
            case 'remove': me.removeData(data);break;
        }   
    }
    
    /**
     * @method
     * The action for inserting
     * @paramn {Object} data
     */
    ,insertData: function(data) {
        this.reload()
    }
    
    /**
     * @method
     * The action for updating
     * @paramn {Object} data
     */
    ,updateData: function(data) {        
        this.reload()
    }
    
    /**
     * @method
     * The action for removing
     * @paramn {Object} data
     */
    ,removeData: function(data) { 
        this.reload()
    }
});