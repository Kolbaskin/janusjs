Ext.define('Desktop.core.widgets.CodeEditor', {
    extend:'Ext.panel.Panel'
    
    ,alias: 'widget.codeeditorpanel'
    ,layout: 'border'
    ,bodyStyle: 'background: #ffffff;'
    
    ,mode: 'text/html'
    
    ,mixins: {
        field: 'Ext.form.field.Field'
    }    
    
    ,initComponent: function() {
        this.items = this.buildEditor() 
        this.callParent()
    }
    
    ,buildEditor: function() {
        this.Editor = Ext.create('Ext.ux.form.field.CodeMirror', {
            region: 'center',
            xtype: 'codemirror',
            mode: this.mode,
            enableMatchBrackets: false,
            showAutoIndent:     false,
            showLineNumbers: false,
            showModes: false,
            enableLineWrapping: true,
            hideLabel: true
        })
        return this.Editor;
    }
    
    ,getValue: function() {
        return this.Editor.getValue();
    }

 
    ,setValue: function(value) {  
        this.Editor.setValue(value)
    }
    
    ,getSubmitData: function() {
        var res = {}
        res[this.name] = this.getValue()
        return res
    }
    
})
