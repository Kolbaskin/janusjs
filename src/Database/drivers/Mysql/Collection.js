/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Drivers.db.Mysql.Collection
 * @extend: Drivers.db.Collection
 * The connector to MySQL database, Collection class
 */
Ext.define("Database.drivers.Mysql.Collection", {
    extend: 'Database.Collection'
        
    ,query: function(cfg, callback) {

        if(!cfg.table) 
            cfg.table = this.collection 
        
        var res;
        
        if(cfg.type == "delete") {
            cfg.type = "select"
            res = this.db.queryBuild(cfg)
            res.query = res.query.replace('select *','delete')
        } else {      
            res = this.db.queryBuild(cfg)
        }

//console.log('res:', res)
        
        this.db.conn.query(res.query, res.values, function(e, result) {
            callback(e, result, res)
        })
    }
    
    ,insert: function(data, callback) {
        
        var me = this, results = [];
        
        if(!Ext.isArray(data)) data = [data]
        
        var func = function(i) {
            if(i>=data.length) {
                callback(null, data)
                return;
            }
            
            me.query({
                type: 'insert',
                values: data[i]
            }, function(err, result, res) {
                if(result && result.insertId) {
                    data[i]._id = result.insertId;
                    func(i+1)
                } else {
                    callback(err, result)
                }
            })
        }
        func(0)
    }
    

    ,update: function(where, data, p1, p2) {
        this.query({
                 type: 'update',
                 condition: where,
                 modifier: data //.$set
        }, function(e, result) {
            
            if(!!p1 && Ext.isFunction(p1)) p1(e, result)
            else
            if(!!p2 && Ext.isFunction(p2)) p2(e, result)
        })
    }
    
    ,find: function(where, fields, callback) {
        if(!!callback) {
            this.query({
                     type: 'select',
                     condition: where,
                     fields: fields
            }, function(e, result, res) {
                callback(e, result, res)
            })
        } else {
            return Ext.create('Database.drivers.Mysql.Query',{
                 collection: this,
                 query: {
                    type: 'select',
                    condition: where,
                    fields: fields
                 }
            })    
        }
    }
    
    ,findOne: function(where, p1, p2) {
        var me = this
            ,flds = Ext.isFunction(p1)? {}:p1
            ,call = Ext.isFunction(p1)? p1:p2

        me.find(where, flds, function(err, result, res) {
            if(result && result[0])
                call(null, result[0], res)
            else
                call(null, {}, res)
        })    
    }
    
    ,remove: function(where, callback) {
        this.query({
            type: 'delete',
            condition: where
        }, function(e, result, res) {
            callback(e, result, res)
        })
    }
    
    ,columns: function(callback) {
        this.db.conn.query("SHOW COLUMNS FROM " + this.collection, function(e, res) {
            var out = {}
            if(res) {
                res.each(function(r) {
                    out[r.Field] = r
                }) 
            }
            callback(out)
        })
    }
})

Ext.define("Database.drivers.Mysql.Query", {
    extend: 'Ext.Base'
    
    ,constructor: function(cfg) {
        Ext.apply(this, cfg)
        this.callParent()
    }
    
    ,sort: function(sorts, cb) {
        this.query.sort = sorts
        return this;
    }
    
    ,skip: function(start, cb) {
        this.query.offset = start
        return this;
    }
    
    ,limit: function(limit, cb) {
        this.query.limit = limit
        return this;
    }
    
    ,toArray: function(cb) {
        var me = this;
        me.collection.query(me.query, cb)
    }
    
})