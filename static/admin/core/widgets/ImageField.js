Ext.define('Desktop.core.widgets.ImageField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.imagefield'

    //,layout: 'hbox'

    ,tumbSizes: '220x130x460x330'
    
    ,imageDefaultValue: 'images/image_icon.png'
    ,width: 200
    ,buttonAlign: 'left'

    ,initComponent: function() {     
        if(this.buttonAlign == 'top' || this.buttonAlign == 'bottom') {
            this.layout = 'vbox'    
        }
        this.items = this.buildItems()

        this.imageValue = this.imageDefaultValue
        this.createContextMenu()
        
        
        this.callParent();
    }
    
    ,createContextMenu: function() {
        var me = this
        me.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [{
                text: D.t('Remove image'),
                iconCls: 'remove',
                handler: function() {me.removeImage()}
            }]
        });
    }
    
    ,showImage: function() {
        
        var me = this
            ,btn = me.down('[xtype=filefield]').button
            ,bsz
       
        if(btn) {
            var bt = btn.getEl()
            bt.setStyle('background','url(' + me.imageValue + '?_dc=' + (new Date()).getTime() + ') center center no-repeat')  
      
            if(me.imageValue == me.imageDefaultValue) {
                bsz = 'auto'
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                })
            } else {
                bsz = 'contain'
                bt.on('contextmenu', function(e) {
                     e.preventDefault();
                     me.contextMenu.show(bt);
                })
            }
            
            bt.setStyle('background-size',bsz)
            bt.setStyle('-webkit-background-size',bsz)
            bt.setStyle('-o-background-size',bsz)
            bt.setStyle('-moz-background-size',bsz)

        }    
    }
    
    ,buildItems: function() {
        var me = this
        
        
        if(!me.width || !me.height) {
            var sz = me.tumbSizes.split('x')
            if(sz[0]) sz[0] = parseInt(sz[0])
            if(sz[1]) sz[1] = parseInt(sz[1])
            if(!sz[0] || isNaN(sz[0])) sz[0] = 150
            if(!sz[1] || isNaN(sz[1])) sz[1] = 150
            
            if(!me.width) me.width = sz[0]
            if(!me.height) me.height = sz[1]
        }
        
        var rec = []
        
        
        var func = function() {
            
            rec.push({
    
                xtype: 'filefield',
                msgTarget: 'side',
                allowBlank: true,
                buttonOnly: true,
                width: me.width,
                height: me.height,
                fieldStyle: 'width:'+ me.width +'px;height:' + me.height+'px;',
                buttonConfig: {
                    tooltip: D.t('Select file'),
                    text: '',
                    width: me.width,
                    height: me.height
                },
                listeners: {
                    afterrender:function(el){
                        el.fileInputEl.set({
                            accept: 'image/jpeg,image/png,image/gif'
                        });
                    },
                    change: function(el) {
                        me.upload(el)
                    }    
                }
            },{
                xtype: 'textfield',
                hidden: true,
                name: me.name,
                listeners: {
                    boxready: function(e) {
                        me.showImage() 
                    },
                    change: function(e,v) {                      
                        var inp = me.down('[xtype=textfield]')
                        if(v && v != '-') {
                            me.imageValue = v + '?_dc=' + (new Date()).getTime()
                            inp.inputEl.dom.value = ''
                        } else {
                            me.imageValue = me.imageDefaultValue
                            inp.inputEl.dom.value = '-'                           
                        }
                        me.showImage()
                        return false;
                    }
                }
            })   
        }
        
        func()
        
        return rec
    }
    
    ,upload: function(inp) {        
        var me = this       
        if(inp.fileInputEl.dom.files.length>0) {
            Core.Ajax.upload(inp.fileInputEl.dom.files[0], '/Admin.Data.uploadImage/' + me.tumbSizes + '/', function(data) {
                if(data.response && data.response.name) {
                    var    img_inp = me.down('[xtype=textfield]')
                    me.imageValue = '/tmp/'+data.response.name
                    me.showImage()
                    img_inp.inputEl.dom.value = data.response.name
                    inp.fileInputEl.dom.value = ''
                }
            })                    
        }
    }
    
    ,removeImage: function() {
        this.down('[xtype=textfield]').setValue('-')
    }


})