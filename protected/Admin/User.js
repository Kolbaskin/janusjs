Ext.define('Admin.User',{
    extend: "Core.Controller"
    
    ,$login: function() {
        var me = this; 
        
        me.callModel('.model.User.getAutorization', {
            collection: 'admin_users', 
            find: {login: me.params.gpc.login, removed: {$ne: true}}, 
            password: me.params.gpc.pass
        }).sendJSON()        
    }
    
    ,$loginStepTwo: function() {
        var me = this;        
        me.callModel('.model.User.enter2step', me.params.gpc).sendJSON()
    }
    
    ,$getModulesList: function() {
        this.params.gpc.auth = '?'
        this.callModel('.model.Modules.getUserModules', this.params.gpc).sendJSON()
    }
    
    ,$getAllModulesList: function() {
        this.params.gpc.auth = '?'
        this.callModel('.model.Modules.getAllModules', this.params.gpc).sendJSON()
    }
    
    ,$getUserInfo: function() {
        this.params.gpc.auth = '?'
        this.callModel('.model.User.getUserInfo', this.params.gpc).sendJSON()
    }
    
    ,$setUserSets: function() {
        this.params.gpc.auth = '?'
        this.callModel('.model.User.setUserSets', this.params.gpc).sendJSON()
    }
    
    ,$testAuth: function() {
        var me = this;
        me.checkAuthorization(me.params.gpc, function(auth) {
            me.sendJSON({result: auth});
        })
    }
    
})