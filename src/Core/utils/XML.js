var xmldoc = require("xmldoc").XmlDocument;

Ext.define('Core.utils.XML',{
    extend: 'Core.AbstractModel'
    
    ,removeObjects: function(data, cb) {
        var me = this
            ,xmlDoc = new xmldoc(data.data)
            ,items = []
            ,ids = []
            ,nnn = 0
            ,results = {inserted: 0, updated: 0}
            ,model = Ext.create(data.cfg.dataModel, {src: me.src, config: me.config})
            
        if(data.cfg.rootNode) 
            items = xmlDoc.childNamed(data.cfg.rootNode).children
        else 
            items = xmlDoc.children
               
         var func = function() {
             if(nnn>=items.length) {
                 model.remove(ids, function() {
                    cb({removed: ids.length})    
                 })
                 return;
             }
             me.getRemoveObject(data.cfg, items[nnn], model, function(_id) {
                 if(_id) ids.push(_id);
                 nnn++;
                 func()
             })
         }
         func()    
    }
    
    ,getRemoveObject: function(cfg, item, model, cb) {
        var me = this
            ,srcData = this.readRecurNode(item)
            ,dstData = {};
       for(var key in cfg.bind) {
           dstData[key] = me.tplApply(cfg.bind[key], srcData)
       }                
       if(cfg.searchField && dstData[cfg.searchField]) {
           me.getRowId(cfg.searchField, dstData[cfg.searchField], model, function(_id) {
               if(_id) cb(_id)
               else cb(false)
           })
       } else cb(false)
    }
    
    ,upsertObjects: function(data, cb) {
        var me = this
            ,xmlDoc = new xmldoc(data.data)
            ,nnn1 = 0
            ,items = []
            ,results = {inserted: 0, updated: 0}
            ,model = Ext.create(data.cfg.dataModel, {src: me.src, config: me.config})
            
        if(data.cfg.rootNode) 
            items = xmlDoc.childNamed(data.cfg.rootNode).children
        else 
            items = xmlDoc.children
         var func11 = function() {
             if(nnn1>=items.length) {                 
                 //if(nnn == items.length) 
                 cb(results)
                 return;
             } else {
                 
                 var s = (100 * nnn1 / items.length) + '%';
                 me.src.db.collection('xmlreadlog').update({cod: '1'}, {log: s, cod: '1'}, {upsert: true}, function() {
                     me.upsertObject(data.cfg, items[nnn1], model, function(act) {
                        if(act && results[act] !== undefined) results[act]++;
                        nnn1++;
                        func11()
                     })
                 })

             }
         }
         func11()    
    }
    
    ,readRecurNode: function(node) {
        var me = this, data = '';
        if(node.val) {
            node.val = node.val.trim()
            data = node.val || {}
        }
        if(node.children && node.children.length) {
            if(!data) data = {}
            for(var i=0;i<node.children.length;i++) {
                if(data[node.children[i].name]) {
                    if(!Ext.isArray(data[node.children[i].name])) 
                        data[node.children[i].name] = [data[node.children[i].name]]
                    data[node.children[i].name].push(me.readRecurNode(node.children[i]))
                } else
                    data[node.children[i].name] = me.readRecurNode(node.children[i])                
            }
        }
        if(node.attr) for(var i in node.attr) data[i] = node.attr[i]
      
        return data;
    }
    
    ,upsertObject: function(cfg, item, model, cb) {
        
       
        
        var me = this
            ,srcData = this.readRecurNode(item)
            ,dstData = {};
        [
            function(next) {
                for(var key in cfg.bind) {
                    if(srcData[cfg.bind[key]] !== undefined) dstData[key] = srcData[cfg.bind[key]]
                    else dstData[key] = me.tplApply(cfg.bind[key], srcData)
                }                
                if(cfg.searchField && dstData[cfg.searchField]) {
                    me.getRowId(cfg.searchField, dstData[cfg.searchField], model, function(_id) {
                        if(_id) dstData._id = _id + ''
                        next(dstData)
                    })
                } else
                    next(dstData)
            }
            ,function(dstData) {

                model.write(dstData, function() {
                    cb(dstData._id? 'updated':'inserted');  
                }, {read: true, add: true, modify: true})    
            }
        ].runEach()
        
    }
    
    ,getRowId: function(field, val, model, cb) {
        var find = {}
        find[field] = val;
        find.removed = {$ne: true}
        
        this.src.db.collection(model.collection).findOne(find, {_id: 1}, function(e,d) {
//if(d) console.log('find[field]:', find, '  d:', !!d)
            cb(d? d._id:null)    
        })    
    }
    
    ,tplApply: function(tpl, data) {
        var vals = {}, name = '', i = 0, l = false, c, nms, val;
        
        while(i<tpl.length) {
            c = tpl.charAt(i);
            if(tpl.charAt(i) == '{') {
                l == true;
                name = '';
            } else if(tpl.charAt(i) == '}') {
                l == false;
                if(!vals[name] && vals[name] !== '') {
                    val = data;
                    name.split('.').forEach(function(n) {
                        if(val[n]) val = val[n]    
                    })
                    if(Ext.isString(val)) vals[name] = val
                    else vals[name] = '';
                }
            } else {
                name += c
            }
            i++
        }
        
        for(i in vals) {
            tpl = tpl.replace(new RegExp('{'+i+'}','g'), vals[i])        
        }
        return tpl;
    }
})