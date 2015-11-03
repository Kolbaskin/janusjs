Ext.define('Desktop.modules.pages.view.PagesTree', {
    extend: 'Core.tree.Tree'
    
    ,buildColumns: function() {
        return [{
                xtype: 'treecolumn',
                text: D.t('Page'),
                flex: 1,
                //sortable: true,
                dataIndex: 'name'
            },{
                text: D.t('Web path'),
                flex: 1,
                dataIndex: 'dir'
                //,sortable: true
            },{
                text: D.t('Last modified'),
                width: 110,
                renderer : Ext.util.Format.dateRenderer('d.m.y H:i'),
                dataIndex: 'mtime'
                //,sortable: true
            }, {
                text: D.t('Add'),
                width: 65,
                menuDisabled: true,
                //xtype: 'actioncolumn',
                tooltip: D.t('Add page'),
                align: 'center',
                dataIndex: 'aAccess',
                renderer: function(v, m, r) {
                    if(r.data && r.data.aAccess && r.data.aAccess.add) 
                        return '<span class="fa fa-plus"></span>'
                    return ''
                }
                
            },{
                text: D.t('Access'),
                width: 65,
                dataIndex: 'access',
                menuDisabled: true,
                align: 'center',
                renderer: function(v, m) {
                    return '<span class="fa fa-'+(v === true? 'lock':'unlock')+'"></span>'
                }
            },{
                text: D.t('Sitemap'),
                width: 65,
                dataIndex: 'map',
                menuDisabled: true,
                align: 'center',
                renderer: function(v, m) {
                    //m.tdCls = (v === true? 'page-in-map':'')
                    if(v === true) return '<span class="fa fa-map-pin"></span>'
                    return '';
                }
            }]
    }
    
    ,buildButtons: function() {
        return [{
            tooltip:D.t('Reload the tree'),
            iconCls:'fa fa-refresh',
            action: 'refreshpages'
        }]
    }
});