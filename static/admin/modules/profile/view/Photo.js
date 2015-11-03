Ext.define('Desktop.modules.profile.view.Photo', {
    extend: 'Desktop.core.widgets.ImageField',
    
    hideLibel: true,
    tumbSizes: '270x257',
    height: 270,
    width: 257,
    
    upload: function(inp) {        
        var me = this       
        if(inp.fileInputEl.dom.files.length>0) {
            
            var editor = Ext.create('Desktop.modules.goe.controller.Goe', {
                height: 500,
                resizeCfg: {
                    width: 800, 
                    height: 800
                },
                sizeCfg: {
                    width: 400,
                    height: 400
                }
            })
            editor.createWindow().show()
            editor.resizeFile(inp.fileInputEl.dom.files[0], function(file) {
                Core.Ajax.upload(file, '/Admin.Data.uploadImage/' + me.tumbSizes + '/', function(data) {
                    if(data.response && data.response.name) {
                        var    img_inp = me.down('[xtype=textfield]')
                        me.imageValue = '/tmp/'+data.response.name
                        me.showImage()
                        img_inp.inputEl.dom.value = data.response.name
                        inp.fileInputEl.dom.value = ''
                    }
                })
            })
        }
    }
})