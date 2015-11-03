/*!
 * Wpier
 * Copyright(c) 2013
 * 
 * 
 */

Ext.define('Desktop.modules.users.controller.Groups', {
    extend: 'Core.controller.Controller',
    id:'groups-win',

    launcher: {
        text: D.t('Admins groups'),
        iconCls:'fa fa-group'        
    }
    
    ,addFormControls: function(win) {
        var me = this
    
        me.control(win,{
            '[xtype=checkcolumn]':{
                headerclick: me.onCheckColumnsClick,
                checkchange: function(th, index, checked) {me.onCheckChange(th, index, checked, win)}
            },
            '[xtype=treepanel]':{
                load: function(th, node) {me.onLoadPageChilds(win, node)},
                beforeitemexpand: function(node) {
                    if(node.data.inherit) {
                        setTimeout(function() {node.collapse()},1000)
                        return false;
                    }
                }
            },
            '[action=model-access]': {
                celldblclick: function(cell, td, i, rec) {
                    me.getExtendedAccess(rec.data, function(exts) {
                        rec.data.ext = exts
                        rec.commit()
                    })                    
                }
            }
        })
        me.callParent(arguments)
    }
    
    // При изменении флага "наследовать", сворачиваем или разворачиваем дочек
    ,onCheckChange: function(th, index, checked, win) {    
        
        if(th.dataIndex != 'inherit') return;
        /*
        var me = this, store = win.down('[action=pages-access]').getStore()
        
        // Поиск узла, где кликнули по наследованию
        var recur = function(node, callback) {            
            if(index === 0) {
                callback(node)
                return false;
            }
            index--
            if(node.isExpanded()) {
                for(var i=0;i<node.childNodes.length;i++) {
                    if(!recur(node.childNodes[i], callback)) return false; 
                }
            }
            return true
        }
        recur(store.getRootNode(), function(node) {
            //if(checked) node.collapse()
            //else node.expand()
        })
        */
    }
    
    ,onCheckColumnsClick:function( ct, column, e, t, eOpts ) {
                
        var selAll = true
            ,store = ct.ownerCt.getStore()
            ,data = [];
        
        if(!store.each) return;
        
        store.each(function(r) {
            if(r.data[column.dataIndex]) {
                selAll = false;
                r.data[column.dataIndex] = false;                
                //r.commit()
            }
            data.push(r.data);
        })
        
        if(selAll) {
            data = []
            store.each(function(r) {
                r.data[column.dataIndex] = true;
                data.push(r.data);
                //r.commit()
            })
        }
        
        store.loadData(data)
        //store.commitChanges()
    }
    
    ,beforeSave: function(form, data) { 
        data = this.saveModelAccess(form, data)
        //data = this.savePageAccess(form, data)
        return data
    }
    
    ,saveModelAccess: function(form, data) {
        var stor = form.down("[action=model-access]").getStore()
        data.modelAccess = {}
        stor.each(function(r) {
            if(r.data.read || r.data.add || r.data.modify || r.data.del || r.data.ext)
                data.modelAccess[r.data.name] = {
                    read: r.data.read, 
                    add: r.data.add, 
                    modify: r.data.modify, 
                    del: r.data.del,
                    ext: r.data.ext
                }
        })
        return data        
    }
    
    ,beforeModify: function(form, data) { 
        this.modulesStartEdit(form, data)
        //this.pagesStartEdit(form, data)
    }
    
    ,modulesStartEdit: function(form, data) {
        var me = this, name, store = form.down('[action=model-access]').getStore(), out = []
        store.removeAll();        
        me.getModels(function(models) {
            if(data.modelAccess) {
                for(var i=0;i<models.length;i++) {
                    if(data.modelAccess[models[i].name]) {
                        models[i].read = data.modelAccess[models[i].name].read
                        models[i].add = data.modelAccess[models[i].name].add
                        models[i].modify = data.modelAccess[models[i].name].modify
                        models[i].del = data.modelAccess[models[i].name].del
                        models[i].ext = data.modelAccess[models[i].name].ext
                    } else {
                        models[i].read = false
                        models[i].add = false
                        models[i].modify = false
                        models[i].del = false
                    }
                    models[i].hname = D.t(models[i].name)
                }
            }
            
            store.add(models)
        })       
    }
        
    ,savePageAccess: function(form, data) {
        var me = this, store = form.down('[action=pages-access]').getStore()        
        if(!data.pagesAccess) data.pagesAccess = {}        
        var recur = function(node, del) {            
            //if(del || (!node.data.read && !node.data.add  && !node.data.modify  && !node.data.del)) {
            //     if(data.pagesAccess[node.data.id]) delete data.pagesAccess[node.data.id]
            //} else {          
                 data.pagesAccess[node.data.id] = {
                     read: node.data.read,
                     add: node.data.add,
                     modify: node.data.modify,
                     del: node.data.del,
                     inherit: node.data.inherit 
                 }
            //}
            node.eachChild(function(nd) {
                // если у страницы установлен флаг наследования,
                // удаляем из списка прав ссылки на всех дочек --
                // их права будут определяться по родителю
                recur(nd, (del? del:(node.data.inherit? true: false))) 
            })    
        }
        recur(store.getRootNode())
        return data
    }
    
    ,onLoadPageChilds: function(win, node) {
        
        var me = this, store = win.down('[action=pages-access]').getStore()
        if(store.curData) {

            me.pegesStatusRecur(node, store.curData)
        }
    }
    
    ,pegesStatusRecur: function(node, data) {
        var me = this;
        if(data.pagesAccess && data.pagesAccess[node.data.id]) {
             node.data.read = data.pagesAccess[node.data.id].read
             node.data.add = data.pagesAccess[node.data.id].add
             node.data.modify = data.pagesAccess[node.data.id].modify
             node.data.del = data.pagesAccess[node.data.id].del
             node.data.inherit = data.pagesAccess[node.data.id].inherit
        } else {
             node.data.read = false
             node.data.add = false
             node.data.modify = false
             node.data.del = false
             node.data.inherit = false    
        }
        node.commit() 
        if(node.data.inherit) node.collapse()
        node.eachChild(function(nd) {
            me.pegesStatusRecur(nd, data)
        })
    }
    
    ,pagesStartEdit: function(form, data) {        
        var me = this, store = form.down('[action=pages-access]').getStore()        
        store.curData = data        
        setTimeout(function() {
            me.pegesStatusRecur(store.getRootNode(), data)
        }, 500)
    }
    
    ,getModels: function(callback) {
        var me = this;
        me.model.getModules(function(modules) {
            var arr = [], name
            for(var i=0;i<modules.length;i++) {
                name = D.t(modules[i].name)
                if(name != '-') arr.push({name: modules[i].name, hname: name})
            }
            callback(arr)    
        })
    }
    
    ,getExtendedAccess: function(data, cb) {
        var me = this
            ,mName = data.name.replace(/-/g, '.')
            ,model = Ext.create(mName)

        if(model.accessSet) {
            Ext.create('Desktop.modules.users.view.ExtendedAccessWin', {
                accessSet: model.accessSet,
                values: data.ext,
                callback: cb
            }).show();    
        }
    }
    
});

