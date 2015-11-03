Ext.define('Admin.Access',{
    extend: "Core.Controller"
    
    ,$checkModel: function() {
        this.params.gpc.auth = '?'
        this.callModel('.model.Modules.checkAccess', this.params.gpc).sendJSON()
    }
    
});