/**
 * @author Max Tushev
 * @class Core.AbstractModel
 * AbstractModel is a base class for all YodeRT server models and controllers
 * 
 */
Ext.define('Core.AbstractModel',{
    extend: "Ext.Base"
    
    /**
     * @param {Object} src
     * @param {Object} src.db database object
     * @param {Object} src.mem memcached object
     * @param {Object} src.mailTransport 
     */
     
    /**
     * @param {Object} params get, post and cookies
     */
    
    
    /**
     * @param {Object} config configuration of the current project
     */
    
    
    
    ,constructor: function() {  
        
        this.models = {}
        
        this.params = {}
        
        if(arguments[0]) {
            for(var i in arguments[0]) {
                this[i] = arguments[0][i]    
            }
        }
        if(!this.config) this.config = {}
        if(!this.config.token) this.config.token = {}
        if(!this.config.token.lifetime) this.config.token.lifetime = 600
    }
    
    ,error: function(err) {
        console.log(err)
    }
    
    /**
     * @method
     * Server method.
     * Returns current class name
     */
    ,getControllerName: function() {
        return Object.getPrototypeOf(this).$className
    }
    
    /**
     * @method
     * Server method.
     * This method callings when current class is destroing
     * @param {String} method the name of method that used before destroying
     */
    ,destroy: function(method) {
        //console.log(this.getControllerName(),': ',method);
        //console.log(parseInt(process.memoryUsage().rss / 1024)/1024)
        delete this;  
    }
    
    /**
     * @method
     * Server method.
     * Run method in any model without including it.
     * Returns Object
     *     @example
     *     // use both params and callback
     *     this.callModel('MyProject.Model.Method', params, callback)
     *     
     *     // use without params
     *     this.callModel('MyProject.Model.Method', callback)
     *      
     *     // Apply the model callback result to template and send it into http
     *     this.callModel('MyProject.Model.Method', {param: 'param1'}).toTemplate('TemplateFilename')
     * 
     *     // Send the model callback result as JSON string in http
     *     this.callModel('MyProject.Model.Method', {param: 'param1'}).sendJSON()
     * @public
     * @param {String} modelName
     * @param {Object} attr optional
     * @param {Function} callback optional
     * 
     */
    ,callModel: function(modelName, attr1, attr2) {        
        var me = this
            ,callback
            ,params = me.params.params || {}
            ,method = me.buildFullClassName(modelName, 'model')
                        
        if(attr1) 
            if(Ext.isFunction(attr1)) 
                callback = attr1
            else 
                params = attr1
        
        if(attr2 && !callback) 
            callback = attr2; 
    
        if(!method[0]) {
            if(callback) 
                callback(null, {mess: 'Error method name'})
            return;
        }
  
        if(!me.models[method[0]]) {
            me.models[method[0]] = Ext.create(method[0], {
                response: me.response,
                request: me.request,
                params: params,
                src: me.src,
                config: me.config
            })
        };
        
        [
            function(call) {
                if(params && params.auth === '?') {
                    me.checkAuthorization(params, function(auth) {
                        params.auth = auth
                        call()
                    })
                } else call()
            }
            
            ,function(call) {
                me.models[method[0]][method[1]](params, function(data, err) {
                    if(callback) callback(data, err)
                    else
                        setTimeout(function() {if(callback) callback(data, err)},1)    
                })
            }
        ].runEach();
        
        return {
            toTemplate: function(tplName, call) {
                callback = function(data) {
                    me.tplApply(tplName, data, call)    
                }
            }
            ,sendJSON: function() {
                if(me.sendJSON) {
                    callback = function(data, err) {
                        me.sendJSON(data, err)    
                    }
                }
            }
        }
    }
    
    /**
     * @method
     * @private
     * Server method.
     * Getting full model name and method name from short notification
     * @param {String} name
     * @param {String} dir
     */
    ,buildFullClassName: function(name, dir) {
        var s = [];
        if(name.charAt(0) == '.') {
            s = this.self.getName().replace('.controller.','.' + dir + '.').split('.')
            s = s.slice(0,s.length-1)
            s = s.concat(name.substr(1).split('.'))
        } else {
            
            s = name.split('.')
        }
        var method = s[s.length-1]
        s = s.slice(0,s.length-1)
        name = s.join('.')
        return [name, method];
    }
    
    /**
     * @method
     * Server method.
     * Creating path to a class file from class name
     * @public
     * @param {String} className
     */
    ,getPathFromClassName: function(className) {
        var s = className.split('.')
            ,baseDir = Ext.Loader.getPath(s[0])
        
        s = s.splice(1)
        
        return baseDir + '/' + s.join('/')         
    }
    
    /**
     * @method
     * Server method.
     * Checking user autorisation.
     * 
     *     @example
     *     var params = {
     *         id: '1234',
     *         token: 'asdasdhui7y8wyhuiwq7387'
     *     }
     *     this.checkAuthorization(params, function(userId) {
     *         if(userId) 
     *             console.log('Ok')
     *         else
     *             console.log('Error')
     *     })
     * 
     * @param {Object}
     * @param {Function} callback
     */
    ,checkAuthorization: function(params, callback) {
        var me = this
            ,token = (params.token? params.token: (me.params && me.params.token? me.params.token:null))
            ,id = (params.id? params.id: (me.id && me.params.id? me.params.id:(params.uid? params.uid:null)))


            
        if(id && token) { 
            me.src.mem.get(token, function(e, r){
                if(r == id) {    
                    me.src.mem.set(token, id,  function(e, rr){               
                        me.src.db.fieldTypes.ObjectID.StringToValue(r, function(r) {
                            callback(r);
                        })
                    }, me.config.token.lifetime);
                } else 
                    callback(null);                
            });
        } else 
            callback(null);
    }

});