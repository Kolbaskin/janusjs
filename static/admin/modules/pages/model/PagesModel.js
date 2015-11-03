Ext.define('Desktop.modules.pages.model.PagesModel', {    
     extend: "Core.data.TreeDataModel"
    
    ,root: {
        name: 'Index page',
        expanded: false
    }
    
    ,collection: 'pages'
    ,removeAction: 'mark'
    
    ,searchCfg: {
        titleTpl: '{name}',
        descriptTpl: '<tpl if="metadesctiption">{metadesctiption}</tpl><tpl if="!metadesctiption && blocks"><tpl for="blocks"><tpl if="text">{[values.text.replace(/(<([^>]+)>)/ig," ")]}</tpl></tpl></tpl>',
        indexFields: ['dir','metatitle','metadesctiption','metakeywords']
    }
    
    ,fields: [{
        name: 'id',
        mapping: '_id',
        type: 'ObjectID',
        editable: false,
        visible: true
    },{
        name: 'pid',
        type: 'ObjectID',
        editable: true,
        visible: true
    },{
        name: 'aAccess',
        type: 'object',
        editable: false,
        visible: true,
        emptySave: true
    },{
        name: 'parents',
        type: 'parentpages',
        editable: true,
        visible: true,
        emptySave: true
    },{
        name: 'tpl',
        type: 'ObjectID',
        editable: true,
        visible: true
    },{
        name: 'name',
        type: 'string',
        unique: true,
        editable: true,
        visible: true
    },{
        name: 'metatitle',
        type: 'string',
        unique: true,
        editable: true,
        visible: true
    },{
        name: 'metadesctiption',
        type: 'string',
        unique: true,
        editable: true,
        visible: true
    },{
        name: 'metakeywords',
        type: 'string',
        unique: true,
        editable: true,
        visible: true
    },{
        name: 'dir',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'alias',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'mtime',
        type: 'date',
        editable: true,
        visible: true
    },{
        name: 'blocks',
        type: 'array',
        items: [
            {name: 'id', type: 'string'},
            {name: 'block', type: 'string'},
            {name: 'lng', type: 'string'},
            {name: 'controller', type: 'string'},
            {name: 'descript', type: 'string'},
            {name: 'text', type: 'richtext'}
        ],
        //search_index_fields: ['text'],
        editable: true,
        visible: true
    },{
        name: 'access',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'map',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'indx',
        type: 'sortfield',
        sort: 'ASC',
        editable: true,
        visible: true
    },{
        name: 'og_img',
        type: 'image',
        editable: true,
        visible: true
    },{
        name: 'og_desctiption',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'og_title',
        type: 'string',
        editable: true,
        visible: true
    },{
        name: 'nav_top',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'nav_bottom',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'nav_lng',
        type: 'boolean',
        editable: true,
        visible: true
    },{
        name: 'locales',
        type: 'array',
        filterable: false,
        editable: true,
        visible: true
    }]
    /*
    ,$searchBuildDocUrl: function(data, callback) {
        callback(data.dir)   
    }
    */
    
    // need moved records saving for rebuild parents links
    
    
    ,afterReorder: function(data, cb) {
        var me = this;
        var func = function(i) {
            if(i>=data.length) {
                cb(data)
                return;
            }
            me.write(data[i], function() {
                func(i+1)
            }, {add: true, modify: true}, ['parents', 'dir'])
        }
        func(0)
    }
    
    ,getUserAccess: function(cb) {
        var me = this
            ,out = {su: false, access: {}};
        [
            function(next) {
                if(me.user) {
                    me.src.db.collection('admin_users').findOne({_id: me.user.id}, {groupid: 1, superuser: 1}, function(e,r) {
                        if(r) {
                            if(r.superuser) {
                                out.su = true
                                cb(out)    
                            } else if(r.groupid) {
                                next(r.groupid)    
                            } else {
                                cb(out)    
                            }
                        } else
                            cb(out)
                    })
                } else
                    cb(out)
            }
            
            ,function(groupid, next) {
                me.src.db.collection('groups').findOne({_id: groupid}, {pagesAccess: 1}, function(e,d) {
                    if(d && d.pagesAccess) {
                        out.access = d.pagesAccess
                    }  
                    cb(out)
                })
            }
        ].runEach()
    }
    
    ,builData: function(data, callback) {
        var me = this
            ,i = 0
            ,superUser = false
            ,pagesAccess = {};
        
        if(!data) {
            callback([])
            return;
        };
        
        me.getUserAccess(function(acc) {
            var func = function() {
                if(i>=data.length) {
                    callback(data)
                    return;
                }
                me.prepRecord(data[i], function(rec) {
                    rec.aAccess = me.checkAccess(rec, acc)
                    data[i] = rec;
                    i++;
                    func(i)
                })
            }
            func()
        })
    }
    
    ,checkAccess: function(rec, acc) {
        var me = this;
        
        if(acc.su)  
            return {read: true, add: true, modify: true, del: false};
        
        var i = 0, id = rec._id;
        
        if(acc.access[id])
            return acc.access[id]
        
        while(!acc.access[id] && i<rec.parents.length) 
            id = rec.parents[i++]    

        if(acc.access[id] && acc.access[id].inherit)
            return acc.access[id]
        
        return {read: false, add: false, modify: false, del: false};
    }
    
    /**
     * @scope: Client
     * @method
     * Changing page permissions
     * @public
     */
    ,chmod: function(params, callback) {
        this.runOnServer('chmod', params, callback)
    }
    /**
     * @scope: Server
     * @method
     * Changing page permissions
     * @public
     */
    ,$chmod: function(params, callback) {
        this.changeBool(params._id, 'access', params.permis, callback)    
    }
    
    /**
     * @scope: Client
     * @method
     * Changing page status in sitemap
     * @public
     */
    ,toSitemap: function(params, callback) {
        this.runOnServer('toSitemap', params, callback)
    }
    /**
     * @scope: Server
     * @method
     * Changing page status in sitemap
     * @public
     */
    ,$toSitemap: function(params, callback) {
        this.changeBool(params._id, 'map', params.map, callback)    
    }
    
    /**
     * @scope: Server
     * @method
     * Changing boolen param
     * @private
     */
    ,changeBool: function(id, paramName, value, callback) {
        
        var me = this
            ,set = {};
        
        [
            function(next) {
                if(Ext.isString(id)) {
                    me.db.fieldTypes.ObjectID.getValueToSave(me, id, null, null, null, function(id) {
                        next(id)
                    })
                } else
                    next(id)
            }
            
            ,function(id) {
                set[paramName] = value
                me.src.db.collection('pages').update({_id: id}, {$set:set}, function(e,r) {
                    set._id = id
                    me.changeModelData(Object.getPrototypeOf(me).$className, 'upd', set)
                    callback({success: true})
                })
            }
        ].runEach()
    }
    
    ,writeBlock: function(data, callback) {
        this.runOnServer('writeBlock', data, callback)
    }
    
    ,$writeBlock: function(data, cb) {
        var me = this;
        
        [
            function(next) {
                me.getPermissions(function(permis) {
                    if(permis.modify || permis.add) 
                        next()    
                    else
                        cb({success: false, mess: 'permiss'})

                })    
            }
            ,function(next) {
                me.src.db.collection('pages').findOne({
                    _id: me.db.fieldTypes.ObjectID.getValueToSave(me, data._id)
                }, {_id: 1, blocks: 1}, function(e,d) {
                    if(d) 
                        next(d)    
                    else
                        cb({success: false})
                })
            }
            ,function(rec) {
                for(var i=0;i<rec.blocks.length;i++) {
                    if(rec.blocks[i].id == data.block.id) {
                         rec.blocks[i] = data.block
                         break;
                    }
                }
                if(i == rec.blocks.length) {
                    rec.blocks.push(data.block)
                }
                me.src.db.collection('pages').update({
                    _id: rec._id    
                },{$set: {blocks: rec.blocks}}, function(e,d) {
                    cb({success: true})
                })
            }
        ].runEach()
    }
    
})

