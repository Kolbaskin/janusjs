Ext.define('Core.controller.TreeController', {
    extend: 'Core.controller.Controller'
    
    ,addControls: function(win) {
        var me = this    
        me.control(win,{
            '[action=refreshpages]': {click: function(bt) {me.refreshTree(bt)}},
            '[action=formsave]': {click: function() {me.save(win, false)}},  
            '[action=formremove]': {click: function() {me.removePage()}}
        })
        win.down('treepanel').getView().on('drop', function (m, d, o, p, e) {return me.dropPage(m, d, o, p, e)})
        
        me.callParent(arguments)
    }
    
    ,refreshTree: function(bt) {
        bt.up('treepanel').getStore().load()
    }
    ,removePage: function() {
        
        if(this.currentRow && this.currentRow.data.aAccess.del) {
            return;    
        }
        
        var me = this
            ,form = me.mainWin.down("form")
            ,id = form.down("[name=_id]").getValue()
            ,store = me.mainWin.down("treepanel").getStore();
                
        me.removeRows([id], store, function() {
            form.getForm().reset()
            if(me.currentRow) me.currentRow.remove()
        })    
    }
    ,dropPage: function (node, data, overModel, pos, e) {         

        var me = this
            ,rec = {
                //name: data.records[0].data.name,
                //dir: data.records[0].data.dir,
                indx: 0
            }
            ,new_dir
            ,recs = []
            ,indexes = {}
        
        
        if(pos == 'append') {
        // вставляем в дочерний подуровень         
            rec.pid = overModel.internalId
            //new_dir = overModel.data.dir
            //me.currentRow = overModel.appendChild(rec)
        } else {
            rec.pid = overModel.parentNode.internalId
            if(pos == 'before' ) {                
                rec.indx = overModel.data.index
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index, rec)
            } else
            if(pos == 'after') {
                rec.indx = overModel.data.index+1                
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index+1, rec)
            }
            for(var i=0;i<overModel.parentNode.childNodes.length;i++) {
                indexes[overModel.parentNode.childNodes[i].data.id] = overModel.parentNode.childNodes[i].data.index
            }
        }

        for(var i=0;i<data.records.length;i++) {
            rec._id = data.records[i].data.id
            rec.alias = data.records[i].data.alias
            if(rec._id != rec.pid) {
                recs.push(rec)
            }
        }

        if(recs.length>0) {
            
            me.model.reorder({
                recs:recs,
                indexes: indexes
            },function(out) {
                if(out && out.data) for(var i = 0;i<out.data.length;i++) {
                    for(var j = 0;j<data.records.length;j++) {
                        if(data.records[j].data.id == out.data[i]._id) {
                             data.records[j].data.dir = out.data[i].dir
                             data.records[j].commit()
                             break;
                        }
                    }
                } 
            })
        } 
        return true;
    }
})