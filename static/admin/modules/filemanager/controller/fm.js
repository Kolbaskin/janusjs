/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.filemanager.controller.fm', {
    extend: 'Core.controller.Controller',
    id:'filemanager-win',
    
    rootDir: 'uploads',
    
    launcher: {
        text: D.t('File manager'),
        iconCls:'fa fa-folder-open-o',
        model: 'filemanager-fm' 
    },
   
    //mainView: 'Desktop.modules.filemanager.view.Win',
    
    addControls: function(win) {
        var me = this
            ,tree = win.down('treepanel')
            ,treeView = tree.getView()
            ,record_id = treeView.id + '-record-'
        
        // Добавим Д-н-Д к корневому элементу
        setTimeout(function() {
            me.addDnDtoNode(win, record_id + tree.getRootNode().internalId)
            me.addDnDtoNode(win, treeView.id, record_id + tree.getRootNode().internalId)            
        }, 1000);
        
        me.control(win,{
            '[action=refreshfiles]': {click: function(bt) {me.refreshTree(bt)}},
            '[action=newdir]': {click:function(){me.newDir(win)}},
            '[action=open]': {click:function(){me.open(win)}},
            '[action=winclose]': {click:function(){win.close()}},
            '[action=removefile]': {click:function(){me.removeItem(win)}},
            'treepanel': {
                'cellclick': function(c, t, ci, r) {me.cellClick(win, r);},
                'load': function(tree, node) {me.treeOnLoad(win, treeView, node)}
            },
            '[action=upload]':{change: function(th, val) {
                me.upload(win, th)}
            }
        })
        
        
        
        me.callParent(arguments)
    }
    
    ,refreshTree: function(bt) {
        bt.up('treepanel').getStore().load()
    }
    
    ,openfile: function(success) {        
        var me = this
            ,win = Ext.create('Desktop.modules.filemanager.view.OpenFileDialog');
        
        win.success = success
        
        me.addControls(win);
        
        me.control(win,{
            'treepanel': {
                'celldblclick': function(c, t, ci, r) {
                    win.success([r.data]);
                    win.close()
                }
            }
        })
        win.show()   
    }
    
    ,open: function(win) {
        var sm = win.down('treepanel').getSelectionModel();
        if(win.success) {
            var files = []
            for(var i=0;i<sm.selected.length;i++) {
               files.push(sm.selected.items[i].data); 
            }
            win.success(files)
            win.close()
        }
    }
    
    ,cellClick: function(win, r) {
        var p = win.down('#preview'),
            ex = '',
            img = '',
            i = r.data.filename.length-1;
            
        while(i>0 && r.data.filename.charAt(i) != '.') i--;
        
        ex = r.data.filename.substr(i+1).toLowerCase()
        if(!r.data.leaf) {
            img = '/admin/images/icons/file_dir.png'
        } else
        if(ex == 'html' || ex == 'htm') {
            img = '/admin/images/icons/file_html.png'    
        } else
        if(ex == 'doc' || ex == 'docx' ||  ex == 'rtf') {
            img = '/admin/images/icons/file_doc.png'    
        } else
        if(ex == 'xls' || ex == 'xlsx') {
            img = '/admin/images/icons/file_xls.png'    
        } else
        if(ex == 'pdf') {
            img = '/admin/images/icons/file_pdf.png'    
        } else
        if(ex == 'png' || ex == 'jpg' ||  ex == 'jpeg' ||  ex == 'gif') {
            img = '/' + this.rootDir + r.data.id    
        } else {
            img = '/admin/images/icons/file_all.png'
        }
        
        p.update('<table width="100%" height="100%"><tr><td align="center"><img src="'+img+'?_dc='+Math.random()+'" width="128" /><br><br>'+r.data.filename+'</td></tr></table>');
    }
    
    ,getSelectedPath: function(win) {
        var tree = win.down('treepanel')
            
        var sm = tree.getSelectionModel()
            ,path = ''
            ,parent = tree.getRootNode()
        
        if(sm.selected.length>0) {
                
            path = sm.selected.items[0].data.id    
            if(sm.selected.items[0].data.leaf) {
            // if selected a file    
                var i = path.length-1;
                while(i>0 && path.charAt(i) != '/') i--;
                path = path.substr(0,i);
                parent = sm.selected.items[0].parentNode
            } else {
                parent = sm.selected.items[0]    
            }
        }
        return {parent: parent, path: path}
    }
    
    ,newDir: function(win) {//, parent) {
        var me = this
        
        D.p('Create a directory', 'New directory name', [], function(name) {
            
            var p = me.getSelectedPath(win)
            
            me.model.newDir({name: name, path: p.path}, function(data) {
                p.parent.appendChild(data)
                p.parent.expand()
                me.treeOnLoad(win, win.down('treepanel').getView(), p.parent)
            })
        })    
    }
    
    ,upload: function(win, inp, files, parent) {        
        var me = this
            ,p

        if(!parent) {
            p = me.getSelectedPath(win)
        } else {
            p = {
                path: parent.internalId
            }
            if(parent.isLeaf()) p.parent = parent.parent
            else p.parent = parent
        }
        
        if(inp) files = inp.fileInputEl.dom.files
        
        if(files.length>0) {
            me.model.uploadFiles(files, p.path, function(data) {
                if(data) {
                    p.parent.appendChild(data)
                    p.parent.expand()
                    me.treeOnLoad(win, win.down('treepanel').getView(), p.parent)
                }
            })

            /*
            Core.Ajax.uploadFiles(files, 'models.fm:upload/'+encodeURIComponent(p.path)+'/', function(data) {
                if(data && data.length) {
                    if(data[0].success === false) {
                        setTimeout(function() {
                            D.a('File can not be uploaded!', 'Maybe you are trying to upload a file into an archive?')
                        }, 100)
                    } else {    
                        p.parent.appendChild(data)
                        p.parent.expand()
                        me.treeOnLoad(win, win.down('treepanel').getView(), p.parent)
                    }                    
                } 
            })
            */
        }
    }
    
    ,removeItem: function(win) {
        var me = this
            ,tree = win.down('treepanel')
            ,sm = tree.getSelectionModel()
            ,sel = []
            
        for(var i=0;i<sm.selected.length;i++) {
            sel.push(sm.selected.items[i].data.id)    
        }
        if(sel.length>0) {
            D.c('Removing', 'You are removing %s file(s). Are You shure?', [sel.length], function() {
                me.model.removeFiles(sel, function(data) {
                    if(data.success) {
                        for(var i=sm.selected.length-1;i>=0;i--) {
                            sm.selected.items[i].remove()    
                        }
                    }
                })
            })    
        }
    }
    
    ,treeOnLoad: function(win, treeView, node) {
        var me = this
            ,record_id = treeView.id + '-record-'
        setTimeout(function() {            
            for(var i=0;i<node.childNodes.length;i++) {
                if(node.childNodes[i].data.type !== "") {
                    me.addDnDtoNode(win, record_id + node.childNodes[i].internalId, record_id + node.internalId)
                } else {
                    me.addDnDtoNode(win, record_id + node.childNodes[i].internalId)
                }
            }
        }, 1000)        
    }
    
    ,addDnDtoNode: function(win, id, target_id) {
    
        var me = this
            ,ob = document.getElementById(id)
            ,ob1
        
        if(!ob) return;
        if(!target_id) {
            ob1 = ob
            target_id = id
        } else ob1 = document.getElementById(target_id)

        ob.ondragleave = function(event) {
            event.stopPropagation(); 
            event.preventDefault();
            if(ob1.svCls) {
                ob1.className = ob.svCls
                ob1.svCls = null
            }
        }
        
        ob.ondragover = function(event) {            
            event.stopPropagation();
        	if(Ext.isWebKit) event.dataTransfer.dropEffect='copy';
        	event.preventDefault();
            if(!ob1.svCls) ob1.svCls = ob1.className 
            ob1.className = 'x-grid-row  x-grid-data-row x-grid-row-over x-grid-row-focused'            
        } 
        
        ob.ondrop = function(event) {
            event.stopPropagation(); 
            event.preventDefault();
            if(!!target_id.split) target_id = target_id.split('-record-')
            if(ob1.svCls) {
                ob1.className = ob.svCls
                ob1.svCls = null
            }
            me.doDrop(event, target_id[1], win)
        }       
    }
    
    ,doDrop: function(event, nodeId, win) {
        var me = this
            ,dt = event.dataTransfer
            ,node = win.down('treepanel').getStore().getNodeById(nodeId); 

        if(dt.files.length>0) {             
            me.upload(win, null, dt.files, node)
        }
    }

});

