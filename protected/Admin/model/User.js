var crypto = require('crypto')

Ext.define('Admin.model.User',{
    extend: "Core.AbstractModel"
    
    /**
     * Private login method
     **/    
    ,getAutorization: function(params, callback) {
        
        var collection = this.src.db.collection(params.collection)
            ,mail = this.src.mailTransport
            ,config = this.config
            ,mem = this.src.mem
            ,pass = params.password
            ,lifetime = (params.lifetime || config.token.lifetime)
            ,exp = config.exp || false
            ,me = this
            ,passField = params.passField || 'pass'
            ,idField = this.config.idField || '_id'
        collection.findOne(params.find, function(e, r) {
           
            if(r) {
                
                if(r[passField] == crypto.createHash(config.hashtype).update(pass).digest('hex')) {
  
                    if(r.activated === false) {
                        callback({status: 'blocked'})
                        return;
                    }
                    
                    // login success
                    // generate token and put it into memcoache
                    crypto.randomBytes(config.token.len, function(ex, buf) {
                        var token = buf.toString('hex')
                            
                        if(exp == 'true')  lifetime = 30*86400 // секунд в месяце
     
                        mem.set(token, r[idField], function(er, res) {
                            if(res=='STORED') { 
                                // if good   
                        
                                if(r.email && r.dblauth) {
                        
                                    // if needed dbl authorisation, making session pass and sending it      
                                    crypto.randomBytes(config.token.sessPassLen, function(ex, buf) {
                                        var sess = buf.toString('hex');
                                        mem.set(token, sess, function(er, res) {
                            
                                            if(res=='STORED') {
                                                mail.sendMail({
                                                    from: config.mail.from,
                                                    to: r.email,
                                                    subject: config.mail.loginAuthSubject,
                                                    text: config.mail.loginAuthBody.replace('${pass}', sess)
                                                });
                                                callback({id: r[idField], token: token, dblauth: true}, null); 
                                            } else {
                                                callback(null, {code: 500}); // if memcache error
                                            }
                                        }, lifetime);
                                    });
                                } else {
                                    callback({id: r[idField], token: token, dblauth: false, user: r}, null); 
                                }
                            
                            } else {
                           
                                callback(null, {mess: 500}); // if memcache error
                            }
                        }, lifetime);
                        
                    });    
                    
                } else {
                    // login fault
                    callback(null, {code: 401});
                }
            } else callback(null, e);        
        }) 
    }
    
    /**
     * Private login method
     **/
    ,enter2step: function(data, callback) {
        
        var me = this
            ,mem = me.src.mem
            ,lifetime = me.config.token.lifetime
        
        mem.get(data.token, function(e, r){
            if(r == data.pass) {      
                mem.set(data.token, data.id,  function(e, r){
                    if(r == 'STORED') {                 
                        callback(data, null);
                    } else callback(null, {mess: 'Internal server error'}); // if memcache error
                }, lifetime);
            }
        });
    }
    
    /**
     * Get user info
     **/
    ,getUserInfo: function(params, cb) { 
        
        var me = this;
    
        var callback = function(data, err) {
            if(data && data.xgroups && data.xgroups.length) {
                me.getExtendedPermissions(data, cb)
            } else
                cb(data, err)
        }
    
        if(!params.auth) {
            callback(null, {code: 401}); 
            return;
        }
        
        
        me.src.db.collection('admin_users').findOne({_id: params.auth}, {}, function(e, data) {       
            if(data) {   
                me.src.db.fieldTypes.object.getDisplayValue(null, data, 'sets', function(sets) {
                    data.sets = sets
                    me.src.db.collection('groups').findOne({
                        _id: data.groupid
                    }, {
                        modelAccess:1, 
                        pagesAccess: 1, 
                        desktopClassName: 1, autorun: 1
                    }, function(e, gdata) {
                        if(gdata) {    
                            [
                                function(call) {
                                    me.src.db.fieldTypes.object.getDisplayValue(null, gdata, 'modelAccess', function(val) {
                                        gdata.modelAccess = val
                                        call()
                                    })
                                }
                                ,function(call) {
                                    me.src.db.fieldTypes.object.getDisplayValue(null, gdata, 'pagesAccess', function(val) {
                                        gdata.pagesAccess = val
                                        call()
                                    })
                                }
                                ,function(call) {
                                    data.group = gdata
                                    callback(data)
                                }
                            ].runEach()
                            return;
                        } 
                        callback(data)                    
                    })
                })
            }
            else callback(null, e)
        })    
    }
    
    /**
     * Saving user settings
     **/
    ,setUserSets: function(params, callback) { 
        var me = this;
        me.src.db.fieldTypes.object.getValueToSave(null, params.jsonData, null, null, null, function(setData) {
            me.src.db.collection('admin_users').update({_id: params.auth}, {$set:{sets:setData}}, function(e, data) {
                callback({ok:true})    
            }) 
        })
    }
    
    /**
     * Get user access rates
     **/
    ,getUserAccessRates: function(params, callback) { 
        if(!params.auth) {
            callback(null, {code: 401}); 
            return;
        }
        var me = this;
        me.getUserInfo(params, function(data) {
            if(data.superuser) {
                callback({superuser: true})
            } else {               
                if(data) {                    
                    callback(data.group)
                } else {
                    callback(null, e)
                }
            }    
        })
    }
    /**
     * Get extended permissions
     */
    ,getExtendedPermissions: function(data, cb) {
        var me = this;
        [
            function(next) {
                me.src.db.collection('groups').find({
                    _id: {$in: data.xgroups}
                }, {
                    modelAccess:1, 
                    pagesAccess: 1
                })
                .toArray(function(e, d) {
                    if(d && d.length)
                        next(d)
                    else
                        cb(data)
                })
            }
            ,function(xgroups) {
                xgroups.each(function(grp) {
                    if(grp && grp.modelAccess) 
                        for(var i in grp.modelAccess) {
                            if(data.group.modelAccess[i]) 
                                data.group.modelAccess[i] = me.apllyXPermissions(data.group.modelAccess[i], grp.modelAccess[i]) 
                            else
                                data.group.modelAccess[i] = grp.modelAccess[i]
                                
                            
                        }
                    if(grp && grp.pagesAccess)
                        for(var i in grp.pagesAccess) {
                            if(data.group.pagesAccess[i]) 
                                data.group.pagesAccess[i] = me.apllyXPermissions(data.group.pagesAccess[i], grp.pagesAccess[i])    
                            else
                                data.group.pagesAccess[i] = grp.pagesAccess[i]
                        }
                })
                cb(data)
            }
        ].runEach();
    }
    
    ,apllyXPermissions: function(curData, xData) {
        var me = this;
        if(!curData) curData = {}
        for(var i in xData) {
            if(curData[i] && Ext.isObject(curData[i]))
                curData[i] = me.apllyXPermissions(curData[i], xData[i])
            else
            if(xData[i] === true || xData[i] === 'on')
                curData[i] = true;
        }
        return curData;
    }
})