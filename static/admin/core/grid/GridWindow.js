/**
 * @class Core.grid.GridWindow
 * @extend Ext.window.Window
 * @author Max Tushev
 * This is main view class.
 * 
 *     @example
 *     Ext.define('myNamespace.module.myModule.view.myModuleList', {
 *         extend: 'Core.form.DetailForm',
 *         buildColumns: function() {
 *             return [
 *                 {
 *                     dataIndex: 'fieldName1',
 *                     sortable: true,    
 *                     text: 'Column name 1'
 *                 },
 *                 {
 *                     dataIndex: 'fieldName2',
 *                     sortable: true,
 *                     text: 'Column name 2'
 *                 }
 *             ]
 *         }
 *     });
 * 
 */
Ext.define('Core.grid.GridWindow', {
    extend: 'Ext.window.Window',    
    
    /**
     * @param {Boolean} filterbar
     */
    
    /**
     * @param {Number} width
     */ 
    width:740,
    /**
     * @param {Number} height
     */ 
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    /**
     * @param {Mixed} model
     */ 
    model: null,
    /**
     * @param {Number} pageSize
     */ 
    pageSize: 50,
    
    /**
     * @param {Boolean} filterable
     */ 
    filterable: null,
    
    
    
    requires: [
        'Ext.util.Format',
        'Ext.grid.RowNumberer',
        'Ext.ux.form.SearchField'
        ,'Ext.ux.form.field.ClearButton'
        ,'Ext.ux.form.field.OperatorButton'
        ,'Ext.ux.grid.column.ActionPro'
        //,'Ext.ux.grid.FilterBar'
        ,'Ext.ux.grid.AutoResizer'
    ],
    
    constructor: function(cnf) {
        if(cnf.model) this.model = cnf.model
        
        this.callParent(arguments);
    },
        
    initComponent: function() {
   
        
        this.columns = this.buildColumns()
        
        this.store = this.createStore()
        
        this.items = this.buildItems()
        
        this.menuContext = this.buildContextMenu()
        
            
        this.bodyBorder = false
        this.border = false
        
        if(!!this.buildMainTbar) this.tbar = this.buildMainTbar()
                                            
        this.callParent();
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
                    var savedOptions = Ext.clone(me.store.proxy.extraParams)
                    
                    if(!me.store.proxy.extraParams) me.store.proxy.extraParams = {}
                    me.store.proxy.extraParams.reorder = JSON.stringify(jData)
                    
                    me.store.reload(function() {
                        me.store.proxy.extraParams =  savedOptions   
                    });
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
     * Creating the window items. By default the items array contents only one grid.
     */
    ,buildItems: function() {
        return  this.buildGrid()   
    }
    

    /**
     * @method
     * The grid configuration 
     */
    ,buildGrid: function() {    
        var me = this;

        var grid = {
            border: true,
            xtype: 'grid',
            action: 'maingrid',
            region: 'center',
            name: 'main-grid',
            loadMask: true,
            border: false,
            bodyBorder: true,
            
            tbar: me.buildTbar(),
            bbar: me.buildPaging(),
            
            multiSelect: true,

            stripeRows: true,
            viewConfig: {
                trackOver: false
            },
            plugins: [],
            store: me.store
            
        }
        
        if(this.sortManually) grid.viewConfig = this.buildViewConfig()
        
        if(this.filterbar) { 
            grid.columns = {
                plugins: [{
        			ptype: 'gridautoresizer'
				}],
                items: me.buildColumns()
            }
            grid.plugins.push('gridfilters')
            /*
            grid.plugins.push({
            	ptype: 'filterbar',
	        	renderHidden: false,
	        	showShowHideButton: true,
	        	showClearAllButton: true
			})
            */
        } else {
        
            grid.columns = me.buildColumns()                
        }
        return grid
        
    }
    
    /**
     * @method
     * The build paging panel
     */
    ,buildPaging: function() {
        //var me = this;
        
        return  Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: D.t('Displaying topics {0} - {1} of {2}'),
            emptyMsg: D.t("No topics to display"),
            items: this.buildBbar()
        })   
    }
    
    /**
     * @method
     * The toolbar configuration 
     */
    ,buildTbar: function() {
        return [{
            text: D.t('Add'),
            tooltip: D.t('Add a new row'),
            iconCls:'fa fa-plus',
            scale: 'medium',
            //ui: 'success',
            action: 'add'
        }, '-', {
            //text:D.t('Reload'),
            tooltip:D.t('Reload data'),
            //ui: 'reload',
            //scale: 'medium',
            iconCls:'fa fa-refresh',
            action: 'refresh'
        },'->',{
            //text:D.t('Remove'),
            tooltip:D.t('Remove selected items'),
            iconCls:'fa fa-trash',
            action: 'remove'
        }]
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
    
    /**
     * @method
     * Creating a context menu
     */
    ,buildContextMenu: function() {
        var items = [{
                text: D.t('Copy'),
                action: 'copyitem'
            },{
                text: D.t('Paste'),
                disabled: true,
                action: 'pasteitem'
            }]
            
        if(this.sortManually)
            items.splice(1,0, {
                text: D.t('Cut'),
                action: 'cutitem'
            })
        
        return Ext.create('Ext.menu.Menu', {
            items: items
        });
    }
    
    
})