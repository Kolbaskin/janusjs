Ext.define('Core.ExtraIcons', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.headericons',
    alternateClassName: 'Ext.ux.PanelHeaderExtraIcons',
    iconCls: '',
    headerButtons: [],
    init: function(panel) {
        this.panel = panel;
        this.callParent();
        panel.on('render', this.onAddIcons, this);
    },
    onAddIcons :function () {
        this.header = this.panel.getHeader();
        this.header.add(this.headerButtons);
   }
});
