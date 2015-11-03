Ext.define('Desktop.core.widgets.UploadField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.uploadfield'
    
    ,width: 200
    ,height: 25
    ,layout: 'hbox'

    ,initComponent: function() {     
        
        this.items = this.buildItems()

        this.Value = ''
        this.createContextMenu()
        
        
        this.callParent();
    }
    
    ,createContextMenu: function() {
        var me = this
        me.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [{
                text: D.t('Remove file'),
                iconCls: 'remove',
                handler: function() {me.removeFile()}
            }]
        });
    }
    
    ,showFile: function(fileName) {
        
        var me = this
            ,btn = me.down('[xtype=filefield]').button
            ,label = me.down('[xtype=label]');
            
           
            
        if(btn) {
            var bt = btn.getEl()
                ,lb = label.getEl()
                ,val;
                
            if(me.Value) {
                if(Ext.isString(me.Value)) {
                    try {
                        val = JSON.parse(me.Value)
                    } catch(e) {}
                } else {
                    val = me.Value;
                }
            }
            
                
            if(!val || !val.name) {
                label.setText('', false);
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                })
                lb.on('contextmenu', function(e) {
                     e.preventDefault();
                })
            } else {
                var link;
                if(val.tmpName)
                    link = '/Admin.Data.getFile/?name= ' + encodeURIComponent(val.name) + '&tmp=' + encodeURIComponent(val.tmpName)
                else
                if(val.file)
                    link = '/Admin.Data.getFile/?name= ' + encodeURIComponent(val.name) + '&file=' + encodeURIComponent(val.file)
                    
                label.setText('<a href="'+link+'">'+val.name+'</a>', false);
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                     me.contextMenu.show(bt);
                })
                lb.on('contextmenu', function(e) {
                     e.preventDefault();
                     me.contextMenu.show(lb);
                })
            }
        }    
    }
    
    ,buildItems: function() {
        var me = this
        
        var rec = []
        
        
        var func = function() {
            var w = parseInt(me.width/2)
            rec.push({
    
                xtype: 'filefield',
                msgTarget: 'side',
                allowBlank: true,
                buttonOnly: true,
                width: w + 10,
                height: me.height,
                //fieldStyle: 'width:'+ me.width +'px;height:' + me.height+'px;',
                buttonConfig: {
                    //tooltip: D.t('Select file'),
                    text: me.buttonText || D.t('Select file'),
                    width: w,
                    height: me.height
                },
                listeners: {
                    change: function(el) {
                        me.upload(el)
                    }    
                }
            },{
                xtype: 'label'
            },{
                xtype: 'textfield',
                inputType: 'hidden',
                name: me.name,
                listeners: {
                    boxready: function(e) {
                        me.showFile() 
                    },
                    change: function(e,v) {                      
                        var inp = me.down('[xtype=textfield]')
                        if(v && v != '-') {
                            me.Value = v
                            inp.inputEl.dom.value = ''
                        } else {
                            me.Value = ''
                            inp.inputEl.dom.value = '-'                           
                        }
                        me.showFile()
                        return false;
                    }
                }
            })   
        }
        
        func()
        
        return rec
    }
    
    
    ,upload: function(inp) {        
        var me = this;
        
        
        if(inp.fileInputEl.dom.files.length>0) {
            var fn = inp.fileInputEl.dom.files[0].name || inp.fileInputEl.dom.files[0].fileName;
            Core.Ajax.upload(inp.fileInputEl.dom.files[0], '/Admin.Data.uploadFile/', function(data) {
                if(data.response && data.response.name) {
                    var    img_inp = me.down('[xtype=textfield]')
                    me.Value = JSON.stringify({tmpName: data.response.name, name: fn})
                    me.showFile()
                    img_inp.inputEl.dom.value = me.Value
                    inp.fileInputEl.dom.value = ''
                }
            })                    
        }
    }
    
    ,removeFile: function() {
        this.down('[xtype=textfield]').setValue('-')
    }


})