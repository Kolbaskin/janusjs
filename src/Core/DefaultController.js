Ext.define('Core.DefaultController',{
    extend: "Core.Controller"
    
    ,run: function() {
        var me = this;
        [
            function(call) {
                me.getPage(me.request.url, call)
            }
            
            // check autorisation if needed
            ,function(pageData, call) {
                if(pageData.access) {
                    me.checkAutorization(pageData, call)
                } else {
                    call(pageData)    
                }
            }
            
            // get template data
            ,function(pageData, call) {
                if(pageData.tpl) {
                    me.getTemplate(pageData.tpl, function(tpl) {
                        if(tpl) {
                            pageData.tpl = tpl
                            call(pageData)
                        } else {
                            me.error(500)
                        }
                    }) 
                } else {
                    me.error(500)
                }
            }
             
            // run main template controller
            ,function(pageData, call) {
                pageData.params = me.params
                if(pageData.tpl) {
                    if(pageData.tpl.controller) {
                        me.callModel(pageData.tpl.controller, pageData, function(data) {
                            if(data)
                                call(data)
                            else
                                call(pageData)
                        }) 
                    } else
                        call(pageData)
                } else {
                    me.error(500)
                }
            }
            
            ,function(pageData, call) {
                me.crumbs(pageData, call)
            }
            
            // run controllers in the blocks
            ,function(pageData, call) {
                me.runBlocks(pageData, call)
            }
            
            ,function(pageData, call) {
                me.tplReadAndApply(me.config.projectDir + '/protected/view/' + pageData.tpl.tpl, pageData, call)                
            }
            
            ,function(html) {
                me.sendHTML(html)
            }
            
        ].runEach()
    }
    
    ,checkAutorization: function(pageData, cb) {
        var me = this;
        if(me.params.gpc.uid && me.params.gpc.token) {
            me.checkAuthorization({
                id:me.params.gpc.uid,
                token: me.params.gpc.token
            }, function(auth) {
                if(!auth)
                    me.error({code: 401})
                else {    
                    pageData.auth = auth
                    cb(pageData)
                }
            })
        } else me.error({code: 401, mess: 'UID or token didn\'t found'})    
    }
    
    ,crumbs: function(pageData, cb) {
        var me = this;
        pageData.crumbs = [];
        if(pageData.parents) {
            if(Ext.isString(pageData.parents)) pageData.parents = JSON.parse(pageData.parents)
            me.src.db.collection('pages').find({_id: {$in: pageData.parents}}, {dir: 1, name: 1, _id: 1}).toArray(function(e, data) {
                if(data) {
                    data.splice(0,1)
                    pageData.crumbs = data;
                }
                cb(pageData)
            })
        } else {
            cb(pageData)    
        }
    }
    
    ,runBlocks: function(data, callback) {
        var me = this, blocks = [];
        
        if(data.blocks) {
            
            if(Ext.isString(data.blocks)) data.blocks = JSON.parse(data.blocks)
            
            me.params.pageData = data
            
            var fun = function(i) {
                if(i>=data.blocks.length) {
                    data.blocks = blocks
                    callback(data)
                    return
                }
                var block = data.blocks[i]
                if(!block.block) block.block = 1
                if(!blocks[block.block]) blocks[block.block] = []
                if(block.controller && block.controller.substr(0,5) !== 'name:') {
                    var cx = block.controller.split(':');
                    if(cx.length == 2 && !!me['__' + cx[0]]) {
                        me['__' + cx[0]](cx[1].trim(), function(res) {
                            blocks[block.block].push(res)
                            fun(i+1)
                        })
                    } else {
                        me.callModel(block.controller, me.params, function(res) {
                            blocks[block.block].push(res)
                            fun(i+1)
                        })
                    }
                } else {
                    blocks[block.block].push(block.text)
                    fun(i+1)
                }
            }
            fun(0);
        } else
            callback(data)
    }
    
    ,getPage: function(url, callback) {
        var me = this
            ,path = url.split('?')[0]
            ,find = {removed: {$ne: true}}
            ,page = ''
        if(path == '/' || !path) {
            find.root = true;
            //if(me.src.db.type == 'sql') find.root.push({dir: {$is:null}})           
        } else {
            find['dir'] = path.split('/')
            page = find['dir'][find['dir'].length-1]
            find['dir'][find['dir'].length-1] = ''
            find['dir'] = find['dir'].join('/')
        }

        
        me.src.db.collection('pages').findOne(find, {}, function(e, data) {
            if(data) {
                data.page = page
                callback(data)
            }
            else
                me.error(404)
        })
    }
    
    ,getTemplate: function(tplCode, callback) {
        var me = this;  
        me.src.db.collection('admin_templates').findOne({_id: tplCode}, {}, function(e, data) {
            callback(data)
        })
    }
    
    ,__include: function(name, cb) {
        this.src.db.collection('pages').findOne({'blocks.controller': 'name:'+name}, {blocks:1}, function(e,d) {
            if(d) {
                for(var i=0;i<d.blocks.length;i++) {
                    if(d.blocks[i].controller == 'name:'+name)  {
                        cb(d.blocks[i].text)
                        return;
                    }
                }
            } 
            cb('')
        })    
    }
    
})