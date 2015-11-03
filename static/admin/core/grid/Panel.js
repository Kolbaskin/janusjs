Ext.define('Core.grid.Panel', {
    extend: 'Ext.grid.Panel',
    
    loadMask: true,
    border: false,
    bodyBorder: true,
    multiSelect: true,
    
    pageSize: 25,
    
    stripeRows: true,
    viewConfig: {
        trackOver: false
    },
    
    plugins: [],
    
    requires: [
        'Ext.util.Format',
        'Ext.grid.RowNumberer',
        'Ext.ux.form.SearchField'
        ,'Ext.ux.form.field.ClearButton'
        ,'Ext.ux.form.field.OperatorButton'
        ,'Ext.ux.grid.column.ActionPro'
        ,'Ext.ux.grid.FilterBar'
        ,'Ext.ux.grid.AutoResizer'
    ],
    
    constructor: function(cnf) {
        if(cnf.model) this.model = cnf.model
        
        this.callParent(arguments);
    },
        
    initComponent: function() {
console.log('this.model', this.model)        
        if(!this.store) this.store = this.createStore()
    
console.log('this.store', this.store)    
        
        //this.getColumns()
        
    
        this.bbar = me.buildPaging()
        
        if(this.sortManually) this.viewConfig = this.buildViewConfig()
                                            
        this.callParent(arguments);
    },
    
    getColumns: function() {
        if(!this.columns) this.columns = this.buildColumns()
        
        if(this.filterbar) {     
            this.columns = {
                plugins: [{
                	ptype: 'gridautoresizer'
				}],
                items: this.columns//me.buildColumns()
            }
            
            this.plugins.push({
            	ptype: 'filterbar',
	        	renderHidden: false,
	        	showShowHideButton: true,
	        	showClearAllButton: true
			})
        }
    }
    
    /**
     * @method
     * The build paging panel
     */
    ,buildPaging: function() {
        var me = this;
        
        return  Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: D.t('Displaying topics {0} - {1} of {2}'),
            emptyMsg: D.t("No topics to display"),
            items: me.buildBbar()
        })   
    }
    
    /**
     * @method
     * Creating d-n-d config
     */
    ,buildViewConfig: function() {
        var me = this
        return {
            trackOver: false,
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: me.id+'dnd',
                dropGroup: me.id+'dnd'
            },
            listeners: {
                drop: function(node, data, dropRec, dropPosition) {
                    
                    var recs = []
                    
                    for(var i=0;i<data.records.length;i++) {
                        recs.push({_id: data.records[i].data._id, indx: data.records[i].data.indx})    
                    }
                    
                    var jData = {
                        records:  recs,
                        dropRec: {_id: dropRec.data._id, indx: dropRec.data.indx},
                        position: dropPosition  
                    }     
                    me.store.load({params:{reorder:JSON.stringify(jData)}})
                }
            }
        }
    }
    
    /**
     * @method
     * Creating store for the grid
     */
    ,createStore: function() {
        
        var me = this
  
        if(me.store) return Ext.create(me.store)
        
        if(me.columns && !me.fields) {
            me.fields = []
            if(me.sortManually) me.fields.push("indx")
            for(var i=0;i<me.columns.length;i++) {
                if(me.columns[i].dataIndex) {
                    me.fields.push(me.columns[i].dataIndex)    
                }
            }
        }
        
    
        return Ext.create('Core.data.Store', {
            filterParam: 'q',
            remoteFilter: true,
            dataModel: me.model,
            scope: this,
            pageSize: me.pageSize,
            fieldSet: me.fields
        })
        
    }


    /**
     * @method
     * Creating a bootom bar
     */
    ,buildBbar: function() {
        if(this.filterable || this.filterable) 
            
            return [{
                width: 300,
                emptyText: D.t('Search'),
                margin: '0 0 0 20',
                xtype: 'searchfield',
                store: this.store
            }]
        
        return null
    }
    
    
})