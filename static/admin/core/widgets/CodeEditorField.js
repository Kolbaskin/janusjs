Ext.define('Desktop.core.widgets.CodeEditorField',{
    extend: 'Ext.panel.Panel'
    ,alias: 'widget.codeeditorfield'

    ,parser: 'html'

    ,layout: 'border'
    
    
    
    ,initComponent: function() {     
        var me = this
        
        me.items = this.buildItems()
        me.listeners = {
            resize: function() {
                if(!me.editor) {
                    try {
                        me.editor = me.down('[xtype=AceEditor]')
                    } catch(e){}
                }
                if(me.editor && me.editor.editor) {
                    
                    me.editor.editor.resize()
                }
            }
        }
        this.tbar = me.buildTbar()
        this.callParent();
    }
    
    ,buildItems: function() {
        var me = this
            //,editor = 

        var setVal = function(v) {
            if(!me.hiddenInput) me.hiddenInput = me.down('[xtype=textfield]')
            if(me.setTimer) clearTimeout(me.setTimer) 
            me.setTimer = setTimeout(function() {                
                me.noChange = true
                me.hiddenInput.setValue(v)
            }, 1000)
        }
        
        var tryTout
        ,tryChange = function(v) {
            if(!me.editor) me.editor = me.down('[xtype=AceEditor]')
            if(tryTout) clearTimeout(tryTout)
            if(!me.noChange) {
                if(me.editor.editor) {
                    me.noChange = true
                    me.editor.setValue(v)                    
                } else {
                    tryTout = setTimeout(function() {tryChange(v)}, 1000)
                    return;
                }
            }
            me.noChange = false;    
        }
                        
        return [
            {
                region: 'center',
        		xtype: 'AceEditor',
                margin:0,
    			//theme: 'ambiance',
    			printMargin: false,
    			useWrapMode: true,
                fontSize: '13px',
    			sourceCode: me.sourceCode || '',
    			parser: me.parser
                ,listeners: {
                    change: function(x) {
                         setVal(x.getValue())  
                    }
                }
    		},{
                region: 'north',
                xtype: 'textfield',
                inputType: 'hidden',
                name: me.name
                ,listeners: {
                    change: function(e,v) {
                        tryChange(v)                        
                    }
                }
            }
        ]
    }
    
    ,buildTbar: function() {
        var me = this
        return [
            {
                text: D.t('Insert file'),
                iconCls: 'dlg-openfile',
                handler: function() {
                    me.insertFile()
                }
            }/*,{
                text: D.t('Insert Youtube'),
                iconCls: 'youtube',
                handler: function() {
                    me.insertYoutube()
                }
            }*/    
        ]
    }
    
    ,insertFile: function() {
        var me = this
        
        Ext.create('Desktop.modules.filemanager.controller.fm').openfile(function(files) {
            var s = []
            for(var i=0;i<files.length;i++) s.push(files[i].id)
            me.editor.editor.insert(s.join(','))    
        })
    }
    /*
    ,insertYoutube: function() {
        var me = this
        D.p('Inserting','Enter Youtube code','',function(s) {
            me.editor.editor.insert('<div id="game_video"><iframe width="300" height="225" src="//www.youtube.com/embed/' + s + '?rel=0" frameborder="0" allowfullscreen></iframe></div>')
        })
    }
    */
})