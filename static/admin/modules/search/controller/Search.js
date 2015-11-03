/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.search.controller.Search', {
    extend: 'Core.controller.Controller',
    id:'search-win',

    launcher: {
        text: D.t('Search'),
        iconCls:'fa fa-search'
    }
    
    ,addControls: function(win) {
        
        var me = this
        me.control(win,{
            "[action=refresh]": {click: function() {me.refresh()}},
            "grid": {
                celldblclick: function(cell, td, i, rec) {
                    me.openRec(rec)
                }
            }
        })
    }
    
    ,openRec: function(rec) {
        var cName = rec.data.model.replace('.model.','.controller.').replace(/Model$/,'')
            ,controller = Ext.create(cName, {app: this.app});
                    
        if(!!controller.onSearchResultsClick)
            controller.onSearchResultsClick(rec.data)
        else
            controller.modify({data:{_id: rec.data._id}})
    }
});

