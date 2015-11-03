Ext.define('Core.form.MultiCombo', {
    extend: 'Ext.ux.form.ItemSelector',
    
    alias: 'widget.multicombo',
    
    valueField: '_id',
    displayField: 'name',
    queryMode: 'local',
    fieldSet: '_id,name',
    
    imagePath: '/ext/examples/ux/css/images/',
    buttons: ['add', 'remove'],
	buttonsText: {add: D.t("Add"), remove: D.t("Remove")},
	msgTarget: 'side',
	fromTitle: D.t('Available'),
	toTitle: D.t('Selected')

    
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
            autoLoad: true,
            scope: this
        })
        /*
        this.store.on('ready', function(th, options) {
            me.store.load()
            //me.loadDataModel(me.store, options)                
                
        })
        */
        this.on('render', function(el) {
            
            
            el.bindStore(me.store)
            setTimeout(function() {
                alert(111)
               me.store.load(); 
            }, 5000)
            
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

})

