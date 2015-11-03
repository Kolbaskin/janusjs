var http_codes = require('http_codes')
    ,fs = require('fs')
    
/**
 * @author Max Tushev
 * @class Core.Controller
 * @extend Core.AbstractModel
 * This is superclass of {@link Core.AbstractModel}. Use it for website controllers.
 * Method that starts from char "$" is accessible from http request:
 * 
 *     @example
 *     Ext.define('MyProject.model.MyModel', {
 *         extend: 'Core.AbstractModel',
 *         $hello: function(params, callback) {
 *              callback({text: 'Hello world'})
 *         }
 *     })
 * 
 * Now, you can call method "hello" outside:
 * http://example.com/MyProject.model.MyModel.hello/
 * 
 */
Ext.define('Core.Controller',{
    extend: "Core.AbstractModel"
    
    /**
     * @param {Object}
     * Default http heders
     */
    
    /**
     * @param {Object}
     * Default http response code (default: 200)
     */
    
    /**
     * @param {Object}
     * Default http response status (default: 200)
     */
    
    ,constructor: function(cfg) {
        
        this.headers = {};
        this.headCode = 200;
        this.headStatus = 'OK';
        
        this.callParent(arguments)    
    }
    
    
    /**
     * @param {Object}
     * Default response charset (default: utf-8)
     */
    ,charset: 'utf-8'
        
    /**
     * @method
     * @private
     * Runs public model method
     * @param {String} action
     */
    ,run: function(action) {
        var me = this
            ,method = '$' + action;        
        if(me[method] && {}.toString.call(me[method]) == '[object Function]') {
            return me[method]()
        } else {
            me.error({code:404})
        }
    }
    
    /**
     * @method
     * @public
     * Send error response to http canel
     *     @example
     *     // Send default message on 401 error (authorisation required)
     *     me.error(401)
     *     
     *     // Send detail message in error request
     *     me.error({code: 401, mess: 'Login please!'})
     * 
     * @param {Object} param
     * @param {Number} param.code http error code
     * @param {String} param.mess details message
     */
    ,error: function(param) {
        if(Ext.isNumber(param)) param = {code: param}
        
        var me = this
            ,code = param.code || 500
            ,mess = param.mess || ''
            ,text = ''
            ,headers = {'Content-Type': 'text/html;charset=' + this.charset}

        if(!code) code = 500         
        if(http_codes.httpCodes[code]) {
            text = http_codes.httpCodes[code]
        }   
        
        if(this.config.errorRedirect && this.config.errorRedirect[code]) {
            this.response.writeHead(302, http_codes.httpCodes[302], {
               'Location': me.config.errorRedirect[code] 
            });
            this.response.end()
        } else {            
            this.response.writeHead(code, text, headers);
            this.response.end(mess)
        }
        this.destroy()
    }

    /**
     * @method
     * @private
     * Adding new header
     * @param {String} key
     * @param {String} val
     */
    ,header: function(key, val) {
        this.headers[key] = val
    }
    
    /**
     * @method
     * @private
     * Ending http response
     * @param {String} data
     */
    ,end: function(data) {
        if(!this.headers) this.headers['Content-Type'] = 'text/html;charset=' + this.charset
        
        if(this.response && this.response.Cookie) {
            this.headers['Set-Cookie'] = []
            for(var i in this.response.Cookie) {
                this.headers['Set-Cookie'].push(i + '=' + this.response.Cookie[i])
            }
        }
        
        this.response.writeHead(this.headCode, this.headStatus, this.headers); 
        this.response.end(data)
        this.destroy()
    }
    
    /**
     * @method
     * @private
     * Set cookie
     * @param {String} key
     * @param {String} value
     * @param {String} exdays
     * @param {String} domain
     * @param {String} path
     */
    ,setCookie: function(key, value, exdays, domain, path) {
        if(!this.response.Cookie) this.response.Cookie = {}
        
        var cookieText = value + ';'
        
        if(exdays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate() + exdays);
            cookieText += 'expires='+exdate.toUTCString()+';'
        }
        if(domain)
            cookieText += 'domain='+domain+';'
        if(path)
            cookieText += 'path='+path+';'
                
        this.response.Cookie[key] = cookieText;
    }
    
    
    /**
     * @method
     * @public
     * Send JSON data into http chanel
     * @param {Object} data
     * @param {Object} error
     */
    ,sendJSON: function(data, err) {

        if(err) {
            this.error(err)
            return;
        }
        this.headers['Content-Type'] = 'application/json;' + this.charset
        var jStr = '';
        try {
            jStr = JSON.stringify({response:data})
        } catch(e) {}
        this.headers['Content-Length'] = Buffer.byteLength(jStr, 'utf8')
        this.end(jStr)
    }
    
    /**
     * @method
     * @public
     * Send XML data into http chanel
     * @param {Object} data
     * @param {Object} error
     */
    ,sendXML: function(data, err) {

        if(err) {
            this.error(err)
            return;
        }
        if(Ext.isObject(data)) {
            data = require('jstoxml').toXML(data)
        }
        data += '';
        this.headers['Content-Type'] = 'application/xml;' + this.charset
        this.headers['Content-Length'] = Buffer.byteLength(data, 'utf8')
        this.end(data)
    }
    
    /**
     * @method
     * @public
     * Send HTML string into http chanel
     * @param {String} data
     * @param {Object} error
     */
    ,sendHTML: function(data, err) {
        if(err) {
            this.error(err)
            return;
        }
        data += '';
        this.headers['Content-Type'] = 'text/html;charset=' + this.charset
        this.headers['Content-Length'] = Buffer.byteLength(data, 'utf8')
        this.end(data)
    }
    
    /**
     * @method
     * @public
     * Send image data into http chanel
     * @param {Buffer} data
     * @param {Object} error
     */
    ,sendImage: function(data, type) {
        if(!type) type = 'jpeg'
        this.headers['Content-Type'] = 'image/' + type
        this.headers['Content-Length'] = data.length
        this.end(data)        
    }
    
    /**
     * @method
     * @public
     * Send plain text into http chanel
     * @param {String} data
     * @param {Object} error
     */
    ,sendText: function(data, err) {
        if(err) {
            this.error(err)
            return;
        }
        this.headers['Content-Type'] = 'text/plain;' + this.charset
        this.headers['Content-Length'] = Buffer.byteLength(data, 'utf8')
        this.end(data)
    }
      
    /**
     * @method
     * @public
     * Applying data into template and sending html-string into http chanel
     * @param {String} tplName
     * @param {Object} data
     * @param {Function} callback
     * 
     */
    ,tplApply: function(tplName, data, callback) {
        var me = this
            ,method = me.buildFullClassName(tplName, 'view')
            ,path = me.getPathFromClassName(method[0]);
            
        me.tplReadAndApply(path + '/' + method[1] + '.tpl', data, callback)    
    }
    
    ,tplReadAndApply: function(filePath, data, callback) {


        var me = this, tplName = filePath;
        
        var callEnd = function(data) {
            if(callback) callback(data)
            else me.sendHTML(data)
        };
        
        [
            function(call) {
                if(Ext.templatesCache && Ext.templatesCache[tplName]) {
                    callEnd(Ext.templatesCache[tplName].apply(data))
                } else {
                    call();    
                }
            }
            
            ,function(call) {
              
                fs.readFile(filePath, 'utf8', function (err, htm) {
                    if (err) 
                        console.log(err);
                    else
                        call(htm)
                })
            }
            
            ,function(htm, call) {
                me.tplIncludes(filePath, htm, function(htm) {                  
                    call(htm)                   
                })
            }
            
            ,function(htm, call) {
                me.tplGetCode(htm, function(htm, code) {                    
                    call(htm, code) 
                })    
            }
            
            ,function(htm, code, call) {
                
                var tpl = Ext.create('Ext.XTemplate', htm, code).compile()
                if(!me.config.debug) {
                    if(!Ext.templatesCache) Ext.templatesCache = {}
                    Ext.templatesCache[tplName] = tpl;
                }
                callEnd(tpl.apply(data))
            }
        ].runEach()
    }
    
    /**
     * @method
     * @private
     * Getting JS-code from HTML-template
     * @param {String} html input html code
     * @param {Function} callback
     */
    ,tplGetCode: function(htm, callback) {
        var code = {}
        htm = htm.replace(/>>>CODE>>>((.|\n)*)<<<CODE<<</i, function(p1, cod) {
            if(cod) {
                eval('cod = ' + cod)
                for(var i in cod) {
                    code[i] = cod[i]
                }
            }
            return "";
        })
        callback(htm, code)
    }
    
    /**
     * @method
     * @private
     * Create template html with include blocks
     * @param {String} dir
     * @param {String} htm
     * @param {Function} callback
     */
    ,tplIncludes: function(dir, htm, callback) {
        var d = dir.split('/')
        d.splice(-1,1)
        dir = d.join('/') + '/'
        var recur = function(str) {
            return s = str.replace(/\{\{include[\s]{1,}[\'\"]([\w\.\/]{1,})[\'\"]\}\}/gi, function(p1,path) {
                if(fs.existsSync(dir + path)) {
                    return recur(fs.readFileSync(dir + path, 'utf8'));
                }
                return "";
            })
        }
        callback(recur(htm))
    }
    
    ,$WADL: function() {
        var k, out = ''
        for(var i in this) {
            if(!!this[i].aboutObject) {
                k = i.replace('$','')
                out += '<resource path=".'+k+'/">'
                if(!Ext.isArray(this[i].aboutObject)) this[i].aboutObject = [this[i].aboutObject]
                this[i].aboutObject.each(function(item) {
                    out += '<method name="' + (item.method || 'GET')  + '">'
                    if(item.request) {
                        out += '<request>'
                        item.request.each(function(param) {
                            out += '<param name="' + param.name + '" type="' + (param.type || 'string')+ '" ' + (param.style? 'style="' + param.style + '"':'') + ' required="' + (!!param.required) + '" '+ (param.default? 'default=" + param.default + "':'') +'>'
                            if(param.options) {
                                param.options.each(function(option) {
                                    out += '<option value="' + option + '" />'    
                                })    
                            }
                            out += '</param>'
                        })
                        out += '</request>'
                    }
                    if(item.response) {
                        if(item.response.length>1) out += '<responses>'
                        item.response.each(function(resp) {
                            out += '<response status="' + resp.status + '">'
                            if(resp.representation) {
                                out += '<representation mediaType="' + (resp.representation.mediaType? resp.representation.mediaType: 'application/json') + '"'
                                
                                if(resp.representation.element) {
                                    if(Ext.isString(resp.representation.element)) 
                                        out += ' element="' + resp.representation.element + '">'
                                    else {
                                        out += '><element>'
                                        for(var j in resp.representation.element) {
                                            out += '<' + j + '>' + resp.representation.element[j] + '</' + j + '>'    
                                        }
                                        out += '</element>'
                                    }
                                }
                                out += '</representation>'
                            }
                            out += '</response>'
                        })
                        if(item.response.length>1) out += '</responses>'
                    }
                    out += '</method>'
                })
                out += '</resource>';    
            }
        }
        
        var xml = '<?xml version="1.0" encoding="UTF-8" ?><resources base="http://' + this.request.headers.host + '/' + Object.getPrototypeOf(this).$className + '">' + out + '</resources>'
        //console.log(xml)
        this.sendXML(xml)
    }
    
    
})