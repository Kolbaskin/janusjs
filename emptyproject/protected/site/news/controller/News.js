Ext.define('Crm.site.news.controller.News',{
    extend: "Core.Controller"
    
    ,show: function(params, cb) {
        if(params.pageData.page) 
            this.showOne(params, cb)
        else
            this.showList(params, cb)
    }
    
    ,showOne: function(params, cb) {
        var me = this;
        Ext.create('Crm.modules.news.model.NewsModel', {
            scope: me
        }).getData({
            filters: [{property: '_id', value: params.pageData.page}]
        }, function(data) {
            me.tplApply('.one', data && data.list && data.list[0]? data.list[0]:{}, cb)            
        }); 
    }
    
    ,showList: function(params, cb) {
        var me = this;
        Ext.create('Crm.modules.news.model.NewsModel', {
            scope: me
        }).getData({
            filters: []    
        }, function(data) {
            me.tplApply('.list', data, cb)            
        }); 
    }

});