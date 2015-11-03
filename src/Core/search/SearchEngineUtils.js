Ext.define('Core.search.SearchEngineUtils', {
    extend: "Core.data.DataModel"
        
    ,resaveIndexData: function(callback) {
        var me = this
            ,dbLog = me.src.db.collection('search_index_errors');
            
        var cb = function() {
            console.log('fin: SearchEngineUtils')
        }
        
        ;[
            function(next) {
                dbLog.find({},{}).toArray(function(e,d) {
                    if(d && d.length) 
                        next(d)
                    else
                        cb()
                })
            }
            ,function(data, next) {
                data.prepEach(function(item, clb) {
                    me.resaveIndexOne(item, clb) 
                }, next)
            }
            ,function(data, next) {
                var ids = []
                data.each(function(d) {if(d) ids.push(d)})
                if(ids.length)
                    next(ids)
                else
                    cb()                
            }
            ,function(ids) {
                dbLog.remove({_id: {$in: ids}}, {multi: true}, function() {cb()})
            }
        ].runEach()
    }
    
    ,resaveIndexOne: function(item, cb) {
        if(!this.src.elasticsearch) {cb();return;}
        
        var me = this
            ,client = this.src.elasticsearch;
        
        var checkIndex = function(cbb) {
            client.exists({
                index: item.data.index,
                type: item.data.type,
                id: item.data.id    
            }, function(err, isSet) {
                if(isSet)
                    cbb(1)
                else if(!err)
                    cbb(0)
                else
                    cbb(-1)
            })
        };
        
        var funcs = {
            'delete': function() {
                [
                    function(next) {
                        checkIndex(function(log) {
                            if(log === 1)
                                next()
                            else if(log === 0)
                                cb(item._id)
                            else
                                cb(null)
                        })
                    }
                    ,function() {
                        client.delete(item.data, function(error) {
                            if(error)
                                cb(null)
                            else
                                cb(item._id)
                        })
                    }
                ].runEach()
            },
            'update': function() {
                [
                    function(next) {
                        checkIndex(function(log) {
                            if(log === 1)
                                next()
                            else if(log === 0) {
                                item.data.body = item.data.body.doc
                                item.data.op_type = "insert"
                                funcs.create()
                            }
                            else
                                cb(null)
                        })
                    }
                    ,function() {
                        client.update(item.data, function(error) {
                            if(error)
                                cb(null)
                            else
                                cb(item._id)
                        })
                    }
                ].runEach()
            },
            'create': function() {
                [
                    function(next) {
                        checkIndex(function(log) {
                            if(log === 0)
                                next()
                            else if(log === 1) {
                                item.data.body = {
                                    doc : item.data.body
                                }
                                item.data.op_type = "update"
                                funcs.update()
                            } else
                                cb(null)
                        })
                    }
                    ,function() {
                        client.create(item.data, function(error) {
                            if(error)
                                cb(null)
                            else
                                cb(item._id)
                        })
                    }
                ].runEach()
            }
        }
        funcs[item.act]()  
    }
})