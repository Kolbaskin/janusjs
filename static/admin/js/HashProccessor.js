Ext.define('Ext.ux.desktop.HashProccessor', {
    
    isGo: true,
    
    init: function(app) {
        
        var me = this;
        
        app.hashProcessor = this;
        this.app = app
        
        setTimeout(function(){
            me.onHashChange({newURL: window.location.href})  
        }, 1000)
        
        window.onhashchange = function(opt){
            me.onHashChange(opt)
        }
        
    }
    
    ,onHashChange: function(opt) {
        if(this.isGo) {
            var hash = opt.newURL.split('#!')
            if(hash[1]) {
                this.runController(hash[1])    
            }
        } else
            this.isGo = true;
    }
    
    ,runController: function(runStr) {
        var paths = runStr.split('_')            
        Ext.create(paths[0].replace(/-/g,'.'), {
            app: this.app,
            listeners: {
                ready: function(contr) {
                    if(paths[1]) 
                        contr.modify({data:{_id: paths[1]}})
                    else
                        contr.app.createWindow(contr)
                }
            }
        })
    }  
    
    ,changeHash: function(hash, x) {
        if(x == 3) {
            window.location = '#'
            return;
        }
        if(this.isGo && window.location.href.split('#!')[1] != hash) { 
            window.location = '#!' + hash
            this.isGo = false;
        }
    }
})