/**
 * @author Max Tushev <maximtushev@gmail.com>
 * @class Database.drivers.Oracle.Collection
 * @extend: Database.drivers.Mysql.Collection
 * The connector to Oracle database, Collection class
 */
Ext.define("Database.drivers.Oracle.Collection", {
    extend: 'Database.drivers.Mysql.Collection'
    
    ,prepRowNames: function(row) {
        var out = {}
        for(var i in row) {
            out[i.toLowerCase()] = row[i]   
        }
        return out;
    }
    
    ,query: function(cfg, callback) {

        if(!cfg.table) 
            cfg.table = this.collection 
        
        var res, me = this;
        
        if(cfg.type == "delete") {
            cfg.type = "select"
            res = this.db.queryBuild(cfg)
            res.query = res.query.replace('select *','delete')
        } else {            
            res = this.db.queryBuild(cfg)
        }
        var reader = this.db.conn.reader(res.query, res.values)
        
        var result = []
        
        var doRead = function(cb) {
            reader.nextRow(function(err, row) {
                if (err) return cb(err);
                if (row) {
                    result.push(me.prepRowNames(row))
                    return doRead(cb)
                } else {
                    return cb();
                }
            })
        }
        
        doRead(function(err) {
            callback(err, result)
        });

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