/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.mainmenu.controller.Menu', {
    extend: 'Desktop.modules.pages.controller.Pages',
    id:'mainmenu-win',

    launcher: {
        text: D.t('Main menu'),
        iconCls:'fa fa-sitemap',
        model: 'mainmenu-MenuModel'
    },
    mainView: 'Desktop.modules.mainmenu.view.Menu'
    
    ,addControls: function(win) {
        var me = this
    
        me.control(win,{
            '[action=refreshpages]': {click: function(bt) {me.refreshTree(bt)}},
            '[action=formsave]': {click: function() {me.save(win, false)}},  
            '[action=formremove]': {click: function() {me.removePage()}},
            'actioncolumn': {click: function(g, ri, ci, aitm, event, record, raw) {
                me.addPage(record);return false;
            }},
            'treepanel': {
                'cellclick': function(c, t, ci, r) {me.cellClick(c, t, ci, r);}
            }
        })
        win.down('treepanel').getView().on('drop', function (m, d, o, p, e) {return me.dropPage(m, d, o, p, e)})
        win.down('treepanel').getView().on('beforedrop', me.beforeDropPage)
        
    }
    
    ,setButtonsDisabled: function(evn) {

    }
    
    ,cellClick: function ( cell, td, cellIndex, record) {
        var me = this        
        
        me.startPageEdit(record, cell.up('window').down('form'))
       
    }
    
    ,beforeSave: function(form, data, callback) {
        return data;
    }
    
    ,startPageEdit: function(record, form) {
        var me = this
        me.currentRow = record;
        me.currentAct = 'edit';
        record.data._id = (record.data.id == 'root'? record.raw._id:record.data.id)
        me.getRecord(record, function(record) {
            record.data.id = record.data._id
            me.formSetValues(form, record.data)
            me.dirAutoComplite = false
        })
    }
    
    ,setFormToAccess: function(form, data) {        

    }
    
});

