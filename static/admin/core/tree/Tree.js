Ext.define('Core.tree.Tree', {
    extend: 'Ext.tree.Panel',
    
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.data.proxy.WebSocket'
    ],    
    
    viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop',
                containerScroll: true,
                enableDrag: true,
                enableDrop: true
                ,appendOnly: false
                ,displayField: 'name'
                
            }
    },
    
    //useArrows: true,
    multiSelect: false,
    //singleExpand: true,
    rootVisible: false,
            
    initComponent: function() {    
        var me = this
            ,modelPath = Object.getPrototypeOf(me.model).$className
            ,id = 'store-' + (new Date()).getTime()+Math.random()
            
        
      
        this.store = Ext.create('Core.data.StoreTree', {
            //model: modelPath + '_inn',
            dataModel: modelPath,
            fieldSet: me.fieldSet,
            storeId: id,
            scope: me.scope,
            sorters: [{
                property: 'indx',
                direction: 'ASC'
            }],
    		root: me.rootNode()
        }) 
        
        
        this.tbar = this.buildButtons()
        this.columns = {items: this.buildColumns()}
        this.callParent();
    }
    
    ,rootNode: function() {
        return {
        	name: 'Root' ,
            expanded: true
    	}
    }
    
    ,buildColumns: function() {
        return [{
                xtype: 'treecolumn',
                text: D.t('Name'),
                flex: 1,
                //sortable: true,
                dataIndex: 'name'
            }]
    }
    
    ,buildButtons: function() {
        return []
    }
});