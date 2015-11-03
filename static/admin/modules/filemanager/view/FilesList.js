

Ext.define('Desktop.modules.filemanager.view.FilesList', {
    extend: 'Core.tree.Tree'
    ,multiSelect: true
    ,buildColumns: function() {
        return [{
            xtype: 'treecolumn',
            text: D.t('Files'),
            flex: 1,
            sortable: true,
            dataIndex: 'filename'
        },{
            text: D.t('Type'),
            width: 60,
            sortable: true,
            dataIndex: 'type'
        },{
            text: D.t('Size'),
            width: 60,
            sortable: true,
            dataIndex: 'size',
            renderer: function(v) {
                if(v<1024) return v
                else {
                    v = parseInt(v/1024)
                    if(v<1024) return v+'K'
                    v = parseInt(v/1024)
                    return v+'M'
                }
            }
        },{
            text: D.t('Last updated'),
            width: 120,
            sortable: true,
            dataIndex: 'mtime',
            renderer: Ext.util.Format.dateRenderer('d.m.y H:i'),
            field: {
                xtype: 'datefield'
            }
        }]
    }
    
    ,buildButtons: function() {
        return [{
            xtype: 'fileuploadfield',
            buttonOnly: true,
            hideLabel: true,
            buttonText: D.t('Upload'),           
            buttonConfig: {
                iconCls:'upload'
            },
            action: 'upload',
            listeners: {
                render: function (me, eOpts) {
                    Ext.get(me.id+'-button-fileInputEl').dom.multiple = true
                }
            }
        },'-',{
            text: D.t('Refresh'),
            tooltip:D.t('Refresh files list'),
            iconCls:'refresh',
            action: 'refreshfiles'
        },'-',{
            text: D.t('Create dir'),
            tooltip:D.t('Create new directory'),
            iconCls:'newitem',
            action: 'newdir'
        },'->',{
            text: D.t('Remove'),
            tooltip:D.t('Remove selected directories or files'),
            iconCls:'remove',
            action: 'removefile'
        }]
    }
    
})