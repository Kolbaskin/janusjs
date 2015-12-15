Ext.define('Desktop.core.widgets.GridField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.gridfield'
    
    ,mixins: {
        field: 'Ext.form.field.Field'
    }
    
    ,requires: ['Core.grid.Action']
    
    ,border: false
    ,bodyBorder: true

    ,initComponent: function() {    
        var me = this;
        this.layout = 'border'

        this.cellEditing = this.buildCellEditing();
        this.store = this.buildStore(this.columns)
        this.items = this.buildGrid(this.columns)
        this.callParent();
    }
    
    ,buildCellEditing: function() {
        var me = this;
        return new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2,
            listeners : {
                beforeedit : function(editor, e) {
                    me.editedRecord = e.record;
                    me.fireEvent('beforeedit', editor, e);
                },
                edit : function(editor, e) {
                    me.fireEvent('edit', editor, e);
                }
            }
        });
    }
    
    ,setValue: function(value) {
        if(!value) value = []
        this.value = value
        this.store.loadData(value)
    }
    
    ,getValue: function() {
        var out = []
        this.store.each(function(r) {
            var log = false;
            for(var i in r.data) if(r.data[i]) {log=true;break}
            if(log) out.push(r.data)    
        })
        this.value = out
        return out;
    }
    
    ,getSubmitData: function() {
        var res = {}
        res[this.name] = this.getValue()
        return res
    }
    
    ,buildGrid: function(columns) {
        
        var me = this, uni = (new Date()).getTime();
        
        this.firstEditableColumn = null;
        for(var i=0;i<columns.length;i++) {
            if(columns[i].editor) {
                if(this.firstEditableColumn === null) this.firstEditableColumn = i;
                if(columns[i].editor === true)
                    columns[i].editor = {xtype: 'textfield'}
                columns[i].editor.submitValue = false
            }
        }
        
        columns.push({
            xtype: 'mactioncolumn',
            width: 30,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            
            items: [{
                tplWriteMode: 'overwrite',
                tooltip: D.t('Delete Row'),
                iconCls: 'fa fa-trash',
                scope: this,
                handler: function(grid, rowIndex, colIndex) {
                    me.store.remove(grid.getStore().getAt(rowIndex))
                }
            }]  
            
        })
        
        var grid = {
            xtype: 'grid',
            region: 'center',
            columns: columns,
            plugins: [this.cellEditing],
            store: this.store,
            tbar: this.buildTbar(),
            border: this.border,
            bodyBorder: this.bodyBorder,
            hideHeaders: this.hideHeaders,
            viewConfig: {
                trackOver: false,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: uni+'dnd',
                    dropGroup: uni+'dnd'
                }    
            },
            listeners: {
                cellkeydown: function(th, td, cellIndex, record, tr, rowIndex, e) {
                    me.keyDown(record, e)    
                },
                cellclick: function( th, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                    me.fireEvent('cellclick', th, td, cellIndex, record, tr, rowIndex, e, eOpts)    
                }
            }
        }
        
        if(me.gridCfg) Ext.apply(grid, me.gridCfg)
        
        return grid;
        
    }
    
    ,keyDown: function(rec, e) {
        if(e.keyCode == 6 || e.keyCode == 46) {
            this.store.remove(rec)  
            return;
        }
        if(e.keyCode == 13) {
            this.cellEditing.startEdit(rec,this.firstEditableColumn)
            return;
        }
    }

    ,buildStore: function(columns) {
        var me = this
            ,fields = []
        
        if(this.fields) fields = this.fields
        else {
            for(var i=0;i<columns.length;i++)
                fields.push(columns[i].dataIndex)
        }
        
        return Ext.create('Ext.data.Store', {
            fields: fields,
            data: []
        }) 
    }
    
    ,buildTbar: function() {
        var me = this;
        return [{
            text: D.t('Insert'),
            iconCls: 'fa fa-plus',
            handler: function() {
                me.insertRow()
            }
        },'->',{
            text: D.t('Clean'),
            handler: function() {
                me.cleanAll()
            }
        }]    
    }
    
    ,insertRow: function(data) {
        var log;
        if(!data) {
            log = true;
            data = {}
        }
        if(this.fireEvent('beforeinsert', this, data) === true) {
            var first = this.store.insert(0, data || {})[0]
            if(log) this.cellEditing.startEdit(first,this.firstEditableColumn)
        }
    }
    
    ,cleanAll: function() {
        this.store.loadData([])
    }

})