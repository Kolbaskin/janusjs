/**
 * @class Core.WSockets
 * @extend Ext.ux.WebSocket
 * @author Max tushev
 * Websocket superclass
 */
Ext.define('Core.WSockets', {
    extend: 'Ext.ux.WebSocket'
    
    ,subscriptions: {}

    ,waitings: {}
    
    /**
     * @method
     * Receiving event message from socket and runs the callback function
     * @param {Object} message
     * @param {String} message.data
     */
    ,receiveEventMessage: function(message) {
    	var me = this;

		try {
			var msg = JSON.parse (message.data);
        } catch (err) {
    		Ext.Error.raise (err);
            return;
		} 
        
        if(msg.event && !!me.waitings[msg.event]) {
            if(!!me.debug) me.debug('Response', msg.data)
            me.waitings[msg.event](msg.data)
            delete me.waitings[msg.event]
        }

		me.fireEvent (msg.event, me, msg.data);
		me.fireEvent ('message', me, msg);

        if(msg.model) {               
            me.onModelDataChange(msg.model, msg.event, msg.data)
        }

	}
    
    /**
     * @method
     * Sending a request into websocket and getting a response
     *     
     *     @example
     *     Core.ws.request({
     *         model: 'Name.of.DataModel', // required
     *         action: 'Name_of_method', // required
     *         // other data is here
     *     }, function(response) {
     *         // actions with response data
     *     });
     * 
     * @param {Object} data
     * @param {Function} callback
     */
    ,request: function(data, callback) {
        var me = this;
        
        if(!me.isReady()) {
            setTimeout(function() {
                me.request(data, callback)
            }, 100)
            return;
        }
        var event = 'request-' + Math.random();
        if(!!callback) me.waitings[event] = callback  
        if(!!me.debug) me.debug('Request', data)
        
        me.sendEventMessage(event, data)
    }

    /**
     * @method
     * Subscribe to changes in the data in the model
     * @param {String} id The identification of the subscribe
     * @param {String} modelName
     * @param {Function} func The function that has been called when the data changed
     */
    ,subscribe: function(id, modelName, func) {
        if(!this.subscriptions[modelName]) this.subscriptions[modelName] = {}        
        this.subscriptions[modelName][id] = func
    }
    
    /**
     * @method
     * Unsubscribe from the data changes
     * @param {String} id The identification of the subscribe
     */
    ,unsubscribe: function(id) {
        for(var i in this.subscriptions) {            
            for(var j in this.subscriptions[i]) {
                if(j == id) delete this.subscriptions[i][j]
            }
        }
    }
    
    /**
     * @method
     * This method is called if there is current subscribe to the data model
     * @param {String} modelName The data model name
     * @param {String} action The name of the action
     * @param {Object} data
     */
    ,onModelDataChange: function(modelName, action, data) {
        if(this.subscriptions[modelName]) {
            for(var i in this.subscriptions[modelName]) {
                if(!!this.subscriptions[modelName][i])
                    this.subscriptions[modelName][i](action, data)
            }
        }
    }
})
