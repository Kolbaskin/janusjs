Ext.define('Core.form.BoxSelect', {
    extend: 'Ext.ux.form.field.BoxSelect',
    
    displayField: 'query',
    valueField: 'name',
    pageSize: 25,
    editable: true,
    triggerAction: 'all',
    queryParam: 'query',
    queryMode: 'local',
    remoteFilter: true,
    forceSelection: false,
    createNewOnEnter: true,
    createNewOnBlur: true,
    hideTrigger: true,
    allowBlank: true,
    //height: 30,
    dataModel: '',//Crm.modules.users.model.UsersModel',
    fieldSet: '_id,name',
    
    initComponent: function() {
        this.model = Ext.create(this.dataModel)
        this.store = this.createStore()
        this.labelTpl = this.buildLabelTpl()
        this.listConfig = this.buildlistConfig()
        this.callParent(arguments)    
    }
    
    ,buildLabelTpl: function() {
        return [
            '<tpl if="fname">{name}</tpl>',
            '<tpl if="query">{query}</tpl>'
        ]    
    }
    
    ,buildlistConfig: function() {
        return {
            tpl: [
            '<ul><tpl for="."><li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '">',
            '<tpl if="fname">{name}</tpl>',
            '</li></tpl></ul>'
            ]
        }    
    }
    
    ,setValue: function(val, doSelect) {
        var me = this
      
        if(!me.loaded && val) {
            if(Ext.isArray(val) && Ext.isObject(val[0])) {
                var out = [], data = [];
                for(var i=0;i<val.length;i++) {
                    out.push(val[i].address)
                    data.push({
                        _id: val[i].address,
                        email: val[i].address,
                        fname: val[i].name
                    })
                }
                me.loaded = true;
                me.store.loadData(data)
                me.setValue(out, doSelect, true);
                me.autoSize();
                return false;
            } else if(Ext.isString(val)) val = val.split(',')
            
            me.model.readAll(function(data) {
                    me.loaded = true;
                    me.store.loadData(data.list)
                    me.setValue(val, doSelect, true);
                    me.autoSize();
            },{fieldSet: me.fieldSet, filters: [{property: '_id', value: val.join(',')}]});
            return false;
        } 
        
        return this.callParent(arguments)    
        
    }
    
    ,createStore: function() {
        return Ext.create('Core.data.Store', {
            filterParam: 'query',
            remoteFilter: true,
            dataModel: this.dataModel,
            scope: this,
            autoLoad: true,
            
            listeners: {
                beforeload: function(x,y,z) {    
                    if(y.filters && y.filters[0] && y.filters[0].property == 'query' && y.filters[0].value && y.filters[0].value.length>1){}
                    else
                        return false;
                }
            },

            fieldSet: this.fieldSet
        })
    }
})