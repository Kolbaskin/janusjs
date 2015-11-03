/**
 * @class Ext.ux.data.proxy.WebSocket
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * HTML5 WebSocket proxy
 *
 * <h1>How it works?</h1>
 * Ext.ux.data.proxy.WebSocket provides an interface between stores and readers/writers.
 * By default, this proxy communicates with the server through CRUD operations: each operation is identified by its name, as create, read, update and destroy (instead of delete).
 * Let's have a look to the first example:
 *
 *     Ext.define ('model', {
 *       extend: 'Ext.data.Model' ,
 *       fields: ['id', 'name', 'age'] ,
 *       proxy: {
 *         type: 'websocket' ,
 *         storeId: 'myStore',
 *         url: 'ws://localhost:8888' ,
 *         reader: {
 *           type: 'json' ,
 *           root: 'user'
 *         }
 *       }
 *     });
 *     
 *     var store = Ext.create ('Ext.data.Store', {
 *       model: 'model',
 *       storeId: 'myStore'
 *     });
 *
 * In the above example, a WebSocket proxy is defined into the model (the same thing can be done into stores): when a CRUD operation is made by its store (through sync/load methods), a 'create'/'read'/'update'/'destroy' event is sent to the server.
 * At this point, the server intercepts the event, parses the request, and then replies back with the same event.
 * If you want/need to specify your communication protocol (you wanna CRUD operations like 'createUsers','readUsers','updateUsers','destroyUsers'), just use the api configuration:
 *
 *       proxy: {
 *         type: 'websocket' ,
 *         storeId: 'myStore',
 *         url: 'ws://localhost:8888' ,
 *         api: {
 *           create:  'createUsers' ,
 *           read:    'readUsers' ,
 *           update:  'updateUsers' ,
 *           destroy: 'destroyUsers'
 *         } ,
 *         reader: {
 *           type: 'json' ,
 *           root: 'user'
 *         }
 *       }
 *
 * With this configuration, each sync/load operation made by the store will fire the right CRUD-overridden action.
 *
 * Reached this point, you can easily attach your store to grids and charts, and watch the WebSocket magic in action!
 */
Ext.define ('Ext.ux.data.proxy.WebSocket', {
	extend: 'Ext.data.proxy.Proxy' ,
	alias: 'proxy.pwebsocket' ,
	
	requires: ['Ext.ux.WebSocket'] ,
	
	/**
	 * @property {Object} callbacks
	 * @private
	 * Callbacks stack
	 */
	callbacks: {} ,
	
	config: {
		/**
		 * @cfg {String} storeId (required) Id of the store associated
		 */
		storeId: '' ,
		
		/**
		 * @cfg {Object} api CRUD operation for the communication with the server
		 */
		api: {
			create: 'create' ,
			read: 'read' ,
			update: 'update' ,
			destroy: 'destroy'
		} ,
		
		/**
		 * @cfg {String} url (required) The URL to connect the websocket
		 */
		url: '' ,
		
		/**
		 * @cfg {String} protocol The protocol to use in the connection
		 */
		protocol: null ,
		
		/**
		 * @cfg {Ext.ux.WebSocket} websocket An instance of Ext.ux.WebSocket (no needs to make a new one)
		 */
		websocket: null
	} ,
	
	/**
	 * Creates new Ext.ux.data.proxy.WebSocket
	 * @param {String/Object} config To instatiate this proxy, just define it on a model or a store.
	 * 
	 *     // *** On a Model ***
	 *     Ext.define ('model', {
     *       extend: 'Ext.data.Model' ,
     *       fields: ['id', 'name', 'age'] ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         url: 'ws://localhost:8888' ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
     *     
     *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore'
     *     });
	 *
	 *     // *** Or on a store ***
	 *     Ext.define ('model', {
     *       extend: 'Ext.data.Model' ,
     *       fields: ['id', 'name', 'age']
     *     });
     *     
     *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore' ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         url: 'ws://localhost:8888' ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
	 *
	 * In each case, a storeId has to be specified and of course a url for the websocket.
	 * If you already have an instance of Ext.ux.WebSocket, just use it in place of url:
	 *
	 *     var ws = Ext.create ('Ext.ux.WebSocket', 'ws://localhost:8888');
	 *     
	 *     var store = Ext.create ('Ext.data.Store', {
     *       model: 'model',
     *       storeId: 'myStore' ,
     *       proxy: {
     *         type: 'websocket' ,
     *         storeId: 'myStore',
     *         websocket: ws ,
     *         reader: {
     *           type: 'json' ,
     *           root: 'user'
     *         }
     *       }
     *     });
	 *
	 * @return {Ext.ux.WebSocket} An instance of Ext.ux.WebSocket or null if an error occurred.
	 */
	constructor: function (cfg) {
		var me = this;
        
        me.callParent(arguments)
        
        me.suff = (new Date()).getTime()+Math.random()
		
		// Requires a configuration
		if (Ext.isEmpty (cfg)) {
			Ext.Error.raise ('A configuration is needed!');
			return false;
		}
		
		me.initConfig (cfg);
		me.mixins.observable.constructor.call (me, cfg);
		
		// Requires a storeId
		if (Ext.isEmpty (me.getStoreId ())) {
			Ext.Error.raise ('The storeId field is needed!');
			return false;
		}
		
		if (Ext.isEmpty (cfg.websocket)) {
			me.ws = Ext.create ('Ext.ux.WebSocket', {
				url: me.getUrl () ,
				protocol: me.getProtocol () ,
				communicationType: 'event'
			});
		}
		else me.ws = me.getWebsocket ();
		
		// Forces the event communication
		if (me.ws.communicationType != 'event') {
			Ext.Error.raise ('Ext.ux.WebSocket must use event communication type (set communicationType to event)!');
			return false;
		}
		
		me.ws.on (me.getApi().create+me.suff, function (ws, data) {
			me.completeTask ('create', me.getApi().create, data);
		});
		
		me.ws.on (me.getApi().read+me.suff, function (ws, data) {
			me.completeTask ('read', me.getApi().read, data);
		});
		
		me.ws.on (me.getApi().update+me.suff, function (ws, data) {
			me.completeTask ('update', me.getApi().update, data);
		});
		
		me.ws.on (me.getApi().destroy+me.suff, function (ws, data) {
			me.completeTask ('destroy', me.getApi().destroy, data);
		});
	} ,
	
	/**
	 * @method create
	 * Starts a new CREATE operation (pull)
	 * The use of this method is discouraged: it's invoked by the store with sync/load operations.
	 * Use api config instead
	 */
	create: function (operation, callback, scope) {
		this.runTask (this.getApi().create, operation, callback, scope);
	} ,
	
	/**
	 * @method read
	 * Starts a new READ operation (pull)
	 * The use of this method is discouraged: it's invoked by the store with sync/load operations.
	 * Use api config instead
	 */
	read: function (operation, callback, scope) {
		this.runTask (this.getApi().read, operation, callback, scope);
	} ,
	
	/**
	 * @method update
	 * Starts a new CREATE operation (pull)
	 * The use of this method is discouraged: it's invoked by the store with sync/load operations.
	 * Use api config instead
	 */
	update: function (operation, callback, scope) {
		this.runTask (this.getApi().update, operation, callback, scope);
	} ,
	
	/**
	 * @method destroy
	 * Starts a new DESTROY operation (pull)
	 * The use of this method is discouraged: it's invoked by the store with sync/load operations.
	 * Use api config instead
	 */
	destroy: function (operation, callback, scope) {
		this.runTask (this.getApi().destroy, operation, callback, scope);
	} ,
	
	/**
	 * @method runTask
	 * Starts a new operation (pull)
	 * @private
	 */
	runTask: function (action, operation, callback, scope) {
		var me = this
            ,opid = Math.random()+'';

        action += me.suff


		scope = scope || me;
		// Callbacks store
		me.callbacks[opid] = {
			operation: operation ,
			callback: operation.callback ,
			scope: scope
		};
        
		// Treats 'read' as a string event, with no data inside
		if (action == me.getApi().read+me.suff) {
            var data = Ext.apply(operation, me.params)
		} else {
			var data = [];
			for (var i=0; i<operation.records.length; i++) {
				data.push (operation.records[i].data);
			}
		}
        data = Ext.apply(data, me.extraParams)
        if(!!this.ws.debug) this.ws.debug('Proxy request ('+action+')', data)
    	me.ws.send (action, data, opid);
	} ,
	
	/**
	 * @method completeTask
	 * Completes a pending operation (push/pull)
	 * @private
	 */
	completeTask: function (action, event, data) {
        if(!data || this.storeId != data.scope) return false;


        event +=  this.suff
        
        if(!!this.ws.debug) {
            this.ws.debug('Proxy response', data)
        }
        
        if(!this.reader || !this.reader.read) return false;
        
		var me = this 
        var resultSet = me.reader.read (data);
        
        var store = Ext.StoreManager.lookup (me.getStoreId ());
        
        if(!!store && !!store.prepData) {
            resultSet = store.prepData(resultSet)
        }
        
		// Server push case: the store is get up-to-date with the incoming data
		if (Ext.isEmpty (me.callbacks[data.opid])) {
            
			
			if (typeof store === 'undefined') {
				Ext.Error.raise ('Unrecognized store: check if the storeId passed into configuration is right.');
				return false;
			}
			store.loadData (resultSet.records);
		}
		// Client request case: a callback function (operation) has to be called
		else {
			var fun = me.callbacks[data.opid] ,
			    opt = fun.operation ,
			    records = opt.records || data;
			
			delete me.callbacks[data.opid];
			
			opt.resultSet = resultSet;
			opt.scope = fun.scope;
			
			opt.setCompleted ();
			opt.setSuccessful ();
            
            
            
			fun.callback.apply (fun.scope, [opt]);
		}
	}

});
