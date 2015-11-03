Ext.define('Desktop.modules.search.model.SearchModel', {    
    extend: "Core.data.DataModel"
    
    ,search: function(query, modelName, cb) {
        
        var me = this
            ,dbName = me.config.searchIndex || me.config.mongo.db_name
            ,client = me.src.elasticsearch
            ,opt = {
                index: dbName,
                //from: (pageNum - 1) * perPage,
                size: 200,
                body: {
                    "query": {
                      "simple_query_string": {
                         "query": query,
                         "fields": [
                            "title^3",
                            "descript"
                         ]
                      }
                    }
               }
            };
            
        if(modelName) opt.type = modelName   
        
        client.search(opt).then(function (body) {
            var out = [];
            
            body.hits.hits.each(function(res) {
                out.push({
                    _id: res._id,
                    model: res._type,
                    title: res._source.title,
                    descript: res._source.descript
                })     
            })
            
            cb(out)
            
            
        }, function (error) {
            console.trace(error.message);
        });
    }
    
    ,getData: function(params, cb) {
        var me = this
            ,query
            ,client = me.src.elasticsearch;
        
        var fin = function() {
            cb({total:0, list:[]})    
        };
        
        [
            function(next) {
                if(
                    params && 
                    params.filters && 
                    params.filters[0] && 
                    params.filters[0].property == 'query' && 
                    params.filters[0].value
                ){
                    query = params.filters[0].value.replace(/\s/g,'+');
                    next()
                } else {
                    fin()    
                }
            }
            ,function(next) {
                me.search(query, null, next)    
            }
            ,function(results, next) {
                me.checkResultsAccess(results, next)
            }
            ,function(results) {
                cb({total: results.length, list: results})
            }
        ].runEach()     
            
        
    }
    
    ,checkResultsAccess: function(results, cb) {
        cb(results)
    }
    
})