Ext.define('Core.controller.ControllerImages', {
    extend: 'Core.controller.Controller'
         
    ,addFormControls: function(win) {
        var me = this    
        me.control(win,{
            '[action=upload]':{change: function(th, val) {me.upload(th.up('grid'), th)}},
            '[action=removePhoto]':{click: function(th, val) {me.delPhoto(th.up('grid'))}},
            '[action=removeAllPhoto]':{click: function(th, val) {me.delAllPhoto(th.up('grid'))}}
            
        })
        me.callParent(arguments)
    }
    
    ,delPhoto: function(g) {
        var sm = g.getSelectionModel()        
        g.getStore().remove(sm.selected.items) 
    }
    
    ,delAllPhoto: function(g) {
        g.getStore().removeAll() 
    }    
    
    ,upload: function(grid, inp) {        
        var me = this
        if(inp.fileInputEl.dom.files.length>0) {
            
            var sizes = (grid.imgSizes? grid.imgSizes:'220x130x460x330')
            
            Core.Ajax.uploadFiles(inp.fileInputEl.dom.files, '/admin.models.fileOperations:upload/' + sizes + '/', function(data) {
                if(data && data.length) {
                    var s = grid.getStore()
                        ,l = sizes.split('x')
                    for(var i=0;i<data.length;i++) {
                        s.add({preview: '/tmp/'+data[i].name + (l>2? '_small':''), img: data[i].name});
                    }                    
                }
            })                    
        }
    }
    
    ,beforeSave: function(form, data) {             
        var grids = form.query("grid");//.getStore()
        
        for(var i=0;i<grids.length;i++) {
            if(grids[i].name) {
                data[grids[i].name] = []
                grids[i].getStore().each(function(r) {
                    data[grids[i].name].push(r.data)
                })
            }
        }
        return data        
    }
    
    ,beforeModify: function(form, data) {
        var grids = form.query("grid")//.getStore()
            ,stor
        for(var i=0;i<grids.length;i++) {
            if(grids[i].name) {
                stor = grids[i].getStore()
                stor.removeAll();
                if(data[grids[i].name]) {
                    for(var j=0;j<data[grids[i].name].length;j++) {
                        if(data[grids[i].name][j].preview) {
                            data[grids[i].name][j].img = null
                            data[grids[i].name][j].num = j
                        }
                        stor.add(data[grids[i].name][j])    
                    }
                }
            }
        }
 
    }
    
    ,detailFormReconfig: function(cnf) {
          cnf.layout = 'border'
          cnf.width = 650
          cnf.height = 400
          cnf.tools = null
          return cnf
    }

});