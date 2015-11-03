Ext.define('Core.search.SearchEngine', {
    extend: "Ext.Base"
    
    ,constructor: function(cfg) {  
        this.client = cfg.model.src.elasticsearch;
        this.model = cfg.model;
        
    }
    
    ,indexer: function(data, cb) {
        var me = this
            ,i = 0;
        if(!Ext.isArray(data)) data = [data];
        
        var f = function() {
            if(i>=data.length) {
                cb(data);
                return;
            }
            me.indexerOne(data[i], function() {
                i++;
                f();
            })
        }
        f()
    }
    
    ,remove: function(ids, cb) {
        var me = this
            ,i = 0;
        
        if(!Ext.isArray(ids)) ids = [ids];
        
        var f = function() {
            if(i>=ids.length) {
                cb();
                return;
            }
            me.removeOne(ids[i], function() {
                i++;
                f();
            })
        }
        f()
    }
    
    ,indexerOne: function(data, cb) {
        var me = this
            ,iData = {
                //analyzer:'index_ru',
                index: me.model.config.searchIndex || me.model.config.mongo.db_name,
                type: me.model.getName(),
                id: data._id+'',
                refresh: true,
                timestamp: (new Date()).getTime()
            }
            ,body = {};
        [
            function(next) {
                if(!me.client || !me.model.searchCfg) cb();
                else next()
            }
            ,function(next) {
                var tpl;
                if(me.model.searchCfg.titleTpl) {
                    tpl = Ext.create('Ext.XTemplate', me.model.searchCfg.titleTpl);
                    body.title = tpl.apply(data)
                }
                if(me.model.searchCfg.titleTpl) {                   
                    tpl = Ext.create('Ext.XTemplate', me.model.searchCfg.descriptTpl);
                    body.descript = tpl.apply(data)
                }
                next()
            }
            ,function(next) {
                if(me.model.searchCfg.indexFields) {
                    me.model.searchCfg.indexFields.forEach(function(fld) {
                        if(data) {
                            body[fld] = data[fld]
                        }
                    }) 
                }
                next()
            }
            ,function(next) {
                me.client.exists({
                    index: iData.index,
                    type: iData.type,
                    id: iData.id    
                }, function(err, isSet) {
                    if(isSet) {
                        iData.body = {doc: body}
                        me.client.update(iData, function (error, response) {
                            if(error) {error.iData = iData;error.act = 'update';}
                            me.fixNoInexedData(iData, error, 'update', function() {cb(error)})                            
                        })
                    } else {
                        iData.body = body
                        me.client.create(iData, function (error, response) {
                            if(error) {error.iData = iData;error.act = 'create';}
                            me.fixNoInexedData(iData, error, 'create', function() {cb(error)})
                        })
                    }
                })
                                    
            }
        ].runEach()
    }
    
    ,removeOne: function(id, cb) {
        if(!this.client) {cb();return;}
        var me = this
            ,iData = {
                index: me.model.config.searchIndex || me.model.config.mongo.db_name,
                type: me.model.getName(),
                id: id+'',
                refresh: true
            }
        me.client.delete(iData, function(error) {
            me.fixNoInexedData(iData, error, 'delete', function() {cb()})
        })
    }
    
    ,fixNoInexedData: function(data, error, act, cb) {
        var me = this, dbLog = this.model.src.db.collection('search_index_errors');
        
        [
            function(next) {
                dbLog.remove({
                    'data.id': data.id    
                }, function(e,d) {
                    if(error)
                        next()
                    else
                        cb()
                })
            }
            ,function() {
                dbLog.insert({
                    data: data,
                    error: error,
                    act: act
                },function() {cb();})
            }
        ].runEach()       
    }

  
})