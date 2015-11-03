/**
 * @class Core.data.StoreTree
 * @extend Ext.data.TreeStore
 * @private
 * @author Max Tushev <maximtushev@gmail.ru>
 * This is a class for store for tree panel. Use Core.data.StoreTree like as {@link Core.data.Store}  
 */
Ext.define('Core.data.StoreTree', {
    extend: 'Ext.data.TreeStore'
    ,autoLoad: false
    ,constructor: function(options) {
        
        this.wsModel = model = Ext.create('Ext.data.TreeModel', {
             fields: this.initModel({
                dataModel: options.dataModel || this.dataModel,
                fieldSet: options.fieldSet || this.fieldSet
            })
        })
        
        options.autoLoad = false;
        this.rootOpt = options.root;
        
        this.wsProxy = this.createProxy({
            dataModel: options.dataModel || this.dataModel,
            fieldSet: options.fieldSet || this.fieldSet
        })

        this.initDataGetter(options)
                
        this.callParent(options)
    }
    /*
    ,constructor: function(options) {
               
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
        this.dataActionsSubscribe(options)
        this.callParent(options);

    }
    */
    ,initDataGetter: function() {
        var me = this;
                 
        setTimeout(function() {
            me.setModel(me.wsModel)
            me.setProxy(me.wsProxy)
            me.createReader()
            
            var root = me.setRoot(me.rootOpt)
            //root.load();
            //if(me.autoLoad) {
                //me.load();
                //}
        }, 100)

    }
    
    ,createReader: function() {
        var p = this.getProxy();
        p.setReader(Ext.create('Ext.data.reader.Json', {
             rootProperty: 'list'
             ,totalProperty: 'total'
             ,successProperty: 'success'
        }))
    }
    
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
            fields = me.dataModel.fields.items
        }
        return fields;
    }
    
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
     * Subscribing this store to the server model events
     */
    ,dataActionsSubscribe: function(cfg) {
        var me = this
            ,wid = (cfg.scope? cfg.scope.id: cfg.modelPath);
        
        if(cfg.scope) {
            // remove subscription when container is closed
            cfg.scope.on('destroy', function() {
                Core.ws.unsubscribe(wid)    
            })        
        }
        Core.ws.subscribe(wid, cfg.modelPath, function(action, data) {
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
        //this.insert(0, data)
    }
    
    /**
     * @method
     * The action for updating
     * @paramn {Object} data
     */
    ,updateData: function(data) {        
        var me = this       
        var func = function(nodes) {
            for(var i=0;i<nodes.length;i++) {
                if(nodes[i].childNodes && nodes[i].childNodes.length)  func(nodes[i].childNodes)
                for(var j=0;j<data.length;j++) {
                    if(data[j]._id == nodes[i].data._id) {
                        Ext.apply(nodes[i].data, data[j])
                        nodes[i].commit();
                        break;
                    }
                }
            }
        }
        if(data.length)
            func(me.getRootNode().childNodes)
    }
    
    /**
     * @method
     * The action for removing
     * @paramn {Object} data
     */
    ,removeData: function(data) { 
        // action to removing data
    }

});