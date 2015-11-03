Ext.define('Core.form.DependedCombo', {
    extend: 'Ext.form.ComboBox',
    
    alias: 'widget.dependedcombo',
    
    valueField: '_id',
    displayField: 'name',
    queryMode: 'local',
    fieldSet: '_id,name'
    
    ,constructor: function(cfg) {
        if(!!cfg.constr) {
            cfg.constr(this)
        }
        this.callParent(arguments)
    }
    
    ,initComponent: function() {
        var me = this;
        this.store = Ext.create('Core.data.ComboStore', {
            dataModel: this.dataModel,
            fieldSet: this.fieldSet,
            autoLoad: false,
            scope: this
        })
        
        this.store.on('ready', function(th, options) {
            if(me.parentEl) {
                me.bindToParent(me.store, options)                    
            } else {
                me.loadDataModel(me.store, options)                   
            }    
        })

        this.callParent(arguments)
    }
    
    
    ,loadDataModel: function(store, options, pid) {
        var me  =this, find = {};
        if(pid && me.parentField) {
            find = {filters: [{property: me.parentField, value: pid}]}    
        }
        if(Ext.isString(store.dataModel)) {
            store.dataModel = Ext.create(store.dataModel)
        }

        store.dataModel.readAll(function(data) {
            
            var list = [];

            data.list.forEach(function(r) {
                var v = r[me.displayField]
                                
                var x = v.split(' ');
                if(x.length>1 && x[0].length<3) x.splice(0,1) 
                
                var o = {_id: r._id, name: x.join(' ')}
                
                for(var i in r) {
                    if(!o[i]) o[i] = r[i]    
                }
                o[me.valueField] = r[me.valueField]
                
                list.push(o)    
            })   
            list.sort(function(a,b) {
                return a.name>b.name? 1:-1
            })
            store.loadData(list)
    			var cval = me.getValue()
				if(cval) 
				    me.setValue(cval)         
            else if(me.defaultValue) {
                //me.setValue(me.defaultValue)
            }
            
        }, find)
        if(options.scope) store.scope = options.scope        
        store.dataActionsSubscribe()
    }
    
    ,bindToParent: function(store, options) {
        var me = this;
        setTimeout(function() {
            var el = (Ext.isString(me.parentEl)? me.up('form').down('[name=' + me.parentEl + ']'):me.parentEl)            
            
            el.on('change', function(e,x,y,z) {
                me.setValue('')
                me.defaultValue = ''
                me.parentOnChange(e,x, store, options)
            })
            
            me.checkParentValue(el, store, options)
            
        }, 500)
        
    }
    
    ,checkParentValue: function(parentElement, store, options) {
        var me = this
            ,val = parentElement.getValue()
        if(val) {
            me.defaultValue = me.getValue()
            me.parentOnChange(parentElement,val, store, options, true)
        } 
    }
    
    ,parentOnChange: function(e, x, store, options) {
        var _id
            ,me = this
            ,val = '';
            
        if(e.valueField !== '_id') {
            e.store.each(function(r) {
                if(r.data[e.valueField] == x) {
                    _id = r.data._id    
                }
            })    
        } else {
            _id = x    
        }
        
        if(_id) {
            me.loadDataModel(store, options, _id)
        } else {
            me.store.loadData([])
        }
        me.fireEvent('change', me, '','')
    }

})

