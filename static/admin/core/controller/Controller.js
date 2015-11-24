/**
 * @class Core.controller.Controller
 * @author Max Tushev <maximtushev@gmail.ru>
 * 
 * Yode base desktop controller class. It provides all actions with UI controls on a client side. 
 * 
 *     @example
 *     // Base easy controller pattern 
 *     // Use it if your module provides only base actions: show rows, add, edit and delete row
 *     Ext.define('prjNamespace.mymodule.controller.MyModule', {
 *         extend: 'Core.controller.Controller',
 *         
 *         // An optional param. Specify it if you want to run your module only once.
 *         id:'mycontroller-win',
 *         
 *         // Required object.
 *         launcher: {
 *             text: D.t('My module name'),
 *             iconCls:'myModuleIconClass'
 *         }
 *         
 *     })
 * 
 * If you need to add more actions, use next pattern:
 *     
 *     @example
 *     Ext.define('prjNamespace.mymodule.controller.MyModule', {
 *         extend: 'Core.controller.Controller',
 *         
 *         // An optional param. Specify it if you want to run your module only once.
 *         id:'mycontroller-win',
 *         
 *         // Required object.
 *         launcher: {
 *             text: D.t('My module name'),
 *             iconCls:'myModuleIconClass'
 *         },
 * 
 *         // Adding actions to a grid view
 *         // Example for button like this: {xtype: 'button', text: 'My button', action: 'myActionOnGrid'}
 *         addControls: function(win) {
 *             var me = this
 *             me.control(win,{
 *                 "[action=myActionOnGrid]": {click: function() {me.myActionOnGrid()}},
 *             })
 *             me.callParent()
 *         },
 *         myActionOnGrid: function() {
 *             // some code
 *         },
 * 
 *         // Adding actions to a form view
 *         addFormControls: function(win) {
 *             var me = this
 *             me.control(win,{
 *                 "[action=myActionOnForm]": {click: function() {me.myActionOnForm()}},
 *             })
 *             me.callParent(arguments)
 *         },
 *         myActionOnForm: function() {
 *             // some code
 *         }
 *     })
 */
Ext.define('Core.controller.Controller', {
    extend: 'Ext.ux.desktop.Module'
    ,requires: ['Core.ExtraIcons']
    
    ,mainWin: null
    
    /**
     * @param {String} mainView
     * Main view classname (default: calculate from the controller className)
     *     
     *     @example
     *     prjNamespace.mymodule.controller.MyModule => prjNamespace.mymodule.view.MyModuleList
     * 
     */
    ,mainView: null
    
    /**
     * @param {String} detailFormView
     * Form view classname (default: calculate from the controller className)
     *     
     *     @example
     *     prjNamespace.mymodule.controller.MyModule => prjNamespace.mymodule.view.MyModuleForm
     * 
     */
    ,detailFormView: null
    
    /**
     * @param {Core.data.model} model
     * Module model (default: calculate from the controller className)
     *     
     *     @example
     *     prjNamespace.mymodule.controller.MyModule => prjNamespace.mymodule.model.MyModuleModel
     * 
     */
    ,model: null
    
    ,constructor: function() {
        if(!this.modelName) {            
            this.modelName = this.getControllerName().replace('.controller.', '.model.') + 'Model'
            
        }
        if(!this.model)
            this.model = Ext.create(this.modelName)
        this.id = this.getControllerId();    
        this.callParent(arguments)
    }
    
    ,getControllerId: function() {
        return this.getControllerName().replace(/\./g,'-')    
    }
    
    /**
     * @method 
     * @private
     * Initialisation defaults grid view, form view and model.
     */
    ,init: function() {
        var name = this.getControllerName().replace('.controller.', '.view.')
        if(!this.mainView) {            
            this.mainView = name + 'List'
        }
        if(!this.detailFormView) {
            this.detailFormView = name + 'Form'
        }
        if(this.model && this.launcher) {
            this.launcher.model = this.model
        }
        

        this.getPermissions()
    },
    
    /**
     * @method
     * Getting the model permissions
     */
    getPermissions: function(cb) {        
        var me = this 
        var f = function() {
            me.setAccessControls(me.Permissions, me.mainWin)
            if(!!cb) cb()
            me.fireEvent('ready', me);
        }
        if(me.Permissions) {
            f()
        } else {
            me.model.getPermissions(function(perm) {
                me.Permissions = perm
                f()
            })
        }
    },
    
    removeElement: function(selector,win) {
        if(!win) win = this.mainWin;
        var o = win.down(selector)
        if(o) o.ownerCt.remove(o)    
    },  
    
    /**
     * @method
     * Setting up UI dependencies of a model permissions
     * @param {Object} permissions
     * Ex.: {read: true, add: true, modify: true, del: true}
     */
    setAccessControls: function(permis) {
        var me = this;

        if(permis && me.mainWin) {
            if(!permis.add) {
                me.removeElement("[action=add]")
                me.removeElement("[action=formapply]")
                me.removeElement("[action=formsave]")
            }
            
            if(!permis.del) {
                me.removeElement("[action=remove]")
            }

        }
    },
    
    setFormAccessControls: function(permis, win) {
        var me = this,o;
        if(permis) {
            if(!permis.add  && !permis.modify) {
                me.removeElement("[action=formapply]", win)
                me.removeElement("[action=formsave]", win)
                
                var objs = win.query('[name]')
                if(objs) objs.forEach(function(o) {
                    if(!!o.setReadOnly)
                        o.setReadOnly(true)
                })
            }
            
            if(!permis.del) {
                me.removeElement("[action=remove]", win)
            }

        }    
    },
    
    /**
     * @method
     * Getting this controller name
     */
    getControllerName: function() {
        return Object.getPrototypeOf(this).$className
    },

    /**
     * @method
     * Creating window
     */
    createWindow : function(){
        var me = this,
            desktop = this.app.getDesktop(),
            win = desktop.getWindow(me.id),
            state = Sess.getState(me.id);
                
        if(!win){
            
            var sets = Sess.getState(me.id)
            win = desktop.createWindow({
                id: me.id,                
                title: (me.titlePrefix? me.titlePrefix + ': ':'') + me.launcher.text, 
                //maximized: !!(sets && sets.maximize),
                iconCls: me.launcher.iconCls,
                model: me.model,
                listeners: {
                    destroy: function() {delete me;}    
                }
            }, me.mainView);

            me.addControls(win)
            me.mainWin = win
            
            
            
            setTimeout(function() {                
                if(sets && sets.maximize) {
                    win.maximize()
                    win.on('restore', function(th, w, h) {th.center()})
                }
                setTimeout(function() {
                    win.on('maximize', function() {Sess.setState(me.id,{maximize: true})})
                    win.on('resize', function(th, w, h) {Sess.setState(me.id,{maximize: false})})
                    
                }, 100)
            }, 100)
            
            if(sets && sets.formPin && me.detailFormView) {
                me.pinDetailForm(null, me.detailFormView)  
            }
        }       
        return win;
    }
    
    /**
     * @method
     * Binding actions to a main window controls
     * @param {Ext.window.Window} win
     */
    ,addControls: function(win) {
        
        var me = this
        me.control(win,{            
            "[action=add]": {click: function() {me.add()}},
            "[action=refresh]": {click: function() {me.refresh()}},
            "[action=remove]": {click: function() {me.remove()}}, 
            'form field': {change: function(fl, v) {me.formFieldsChange(fl,v);}},
            "[action=import]":{change: function(th, val) {me.importCsv(th, win)}},
            "grid": {
                cellkeydown: function(cell, td, i, rec, tr, rowIndex, e, eOpts) {
                    if(e.keyCode == 13) {
                        if(!me.innerDetailForm) me.modify(rec, null)
                        else me.modifyInside(rec)
                    }
                },
                celldblclick: function(cell, td, i, rec) {
                    if(!me.innerDetailForm) me.modify(rec, null)
                    else me.innerDetailForm.expand()                    
                },
                cellclick: function(cell, td, i, rec) {
                    if(Ext.isTouchDevice) me.modify(rec, null)
                    else
                    if(me.innerDetailForm) me.modifyInside(rec)
                },
                itemcontextmenu: function(view, record, item, index, e, options){                
                     e.stopEvent();
                     if(win.menuContext) {
                         win.menuContext.record = record;
                         win.menuContext.showAt(e.xy);
                     }
                }
            }
        })
        win.on('activate', function() {me.setFocusToGrid(win)})
        if(win.menuContext) {
            me.popupMenuControls(win);
        }
        me.setAccessControls(me.Permissions, win)
        me.buildChildPanels(win, {})
    }
    

    /**
     * @method
     * Binding actions to a grip popup menu items
     * @param {Ext.window.Window} win
     */
    ,popupMenuControls: function(win) {
        var me = this
        me.control(win.menuContext,{   
            "[action=copyitem]": {click: function() {me.copyRecord(win.menuContext)}},
            "[action=pasteitem]": {click: function() {me.pasteRecord(win.menuContext)}}
        }) 
        
        win.menuContext.on('show', function(m) {
            m.down("[action=pasteitem]").setDisabled(false)    
        })
        
    }
    
    /**
     * @method
     * Binding actions to a form controls
     * @param {Ext.window.Window} win
     */
    ,addFormControls: function(win) {
        var me = this
        me.setAccessControls(me.Permissions)
        
        me.control(win,{
            "[action=formsave]": {click: function() {me.save(win, true)}},
            "[action=formapply]": {click: function() {me.save(win, false)}},
            "[action=formclose]": {click: function() {win.close()}},
            "[action=remove]": {click: function() {me.removeFormRecord(win)}}
        })

        me.setFormAccessControls(me.Permissions, win)
    }
    
    ,removeFormRecord: function(win) {
        var me = this
            ,form = win.down('form')
            ,data = form.getValues();
        me.removeRows([data._id], function() {
            me.fireEvent('remove', form, data);
            win.close()
        }, form.messages)
            
    }
    
    ,logEdit: true
    
    /**
     * @method
     * @private
     * Setting up a button disabled
     * @param {String} selector
     * @param {Boolean} disable
     */
    ,setButtonDisabled: function(selector, disable) {
        var el = this.mainWin.down(selector)
        if(el) el.setDisabled(disable)
    }
    
    /**
     * @method
     * @private
     * Setting up buttons disabled/enabled depending on the event 
     * @param {String} event
     */
    ,setButtonsDisabled: function(evn) {
        var me = this          
        
        if(evn == 'open') {
            me.setButtonDisabled('[action=formsave]',true)
            me.setButtonDisabled('[action=formremove]',false)
        }
        
        if(evn == 'new') {
            me.setButtonDisabled('[action=formsave]',true)
            me.setButtonDisabled('[action=formremove]',true)
        }
        
        if(evn == 'edit') {
            me.setButtonDisabled('[action=formsave]',false)
        }
    }
    
    /**
     * @method
     * @private
     * This method fires when one of a field of a form has been changed.
     */
    ,formFieldsChange: function(fl) {
        if(this.logEdit) this.setButtonsDisabled('edit')
    }
    
    /**
     * @method
     * Setting values in form fields.
     * @param {Ext.form.FormPanel} form
     * @param {Object} data
     */     
    ,formSetValues: function(form, data) {
        if(form) {
            this.logEdit = false;
            this.setButtonsDisabled('open')
            
            var f = form.getForm();
            f.reset()
            f.setValues(data)  
            this.logEdit = true;
        }
    }
    
    /**
     * @method
     * Adding a new data record and starting to edit it
     */
    ,add: function(rec, cb) {
        var me = this;
        
        if(!rec) rec = {data:{}}
        if(me.parentParams) {
            rec.data[me.parentParams.parentField] = me.parentParams.parentCode;
        }
   
        me.model.getNewObjectId(function(_id) {
            rec.data._id = _id;
            
            if(me.innerDetailForm) {
                var g = me.mainWin.down('grid')
                    ,s = (g? g.getStore():null)
                if(s) {
                    me.innerDetailForm.expand()
                    me.modifyInside(rec, true)
                }
            } else {
                
                me.modify(rec, null, true, cb)
            }
        })
        
    }
    
    /**
     * @method
     * Getting a data record from module model
     * @param {Object} record
     * @param {Function} callback
     */
    ,getRecord: function(rec, callback) {
        
        var me = this
        if(me.LocalFormData || !rec || !rec.data || !rec.data._id) {
            callback(rec)           
        } else {
            me.model.readRecord(rec.data._id, function(data) {
                for(var i in data) 
                    rec.data[i] = data[i]
                if(me.parentParams && rec.data) {
                    rec.data[me.parentParams.parentField] = me.parentParams.parentCode;
                }
                callback(rec)
            })
        }
        
    }
    
    /**
     * @method
     * Getting a data record and fires this._modifyInside method to modify a data record into an inside form
     * @param {Object} record
     * @param {Boolean} innerCall if true then the permissions doesn't work.
     * @param {Function} callback returns pointer to a form
     */
    ,modifyInside: function(rec, innerCall, callback) { 
        var me = this
        me.getRecord(rec, function(rec) {      
            me._modifyInside(rec, innerCall)
            me.buildChildPanels(me.innerDetailForm, rec)
            if(!!callback) callback(me.innerDetailForm)
        })
    }   
    
    /**
     * @method
     * @private
     * Modifying a data record into an inside form (Fires by this.modifyInside method)
     * @param {Object} record
     * @param {Boolean} innerCall if true then the permissions doesn't work.
     */
    ,_modifyInside: function(rec, innerCall) { 
        
        if(!innerCall && this.Permissions && !this.Permissions.modify) return;
        
        this.innerDetailForm.record = rec
       
        if(!!this.beforeModify && this.beforeModify(this.innerDetailForm, (rec && rec.data? rec.data:{})) === false) return false;
        
        this.innerDetailForm.app = this.app
        
        this.innerDetailForm.getForm().reset()
        if(rec) this.innerDetailForm.setValues(rec.data);
        
        
        
        var t = this.innerDetailForm.down('textfield')
        if(t) t.focus()
        
    }
    
    ,buildDetailWindowTitle: function(titleIndex, record) {
        return (record[titleIndex] || D.t('blank'))+' - '+this.launcher.text;
    }
        
    /**
     * @method
     * Getting a data record and starting to modify it into an separate form
     * @param {Object} record
     * @param {String} formClassName
     * @param {Boolean} innerCall if true then the permissions doesn't work.
     * @param {Function} callback returns pointer to a form
     */    
    ,modify: function(rec, formClassName, innerCall, callback) {    
        //if(!innerCall && this.Permissions && !this.Permissions.modify) return;
        
        if(!rec.data) rec.data = {}
        
        var me = this
            ,_id = (rec.data._id? rec.data._id : (rec.data.id? rec.data.id : null))
            ,desktop = this.app.getDesktop()
            ,wid = me.id.split(':')[0]+'_'+(_id || 'new-'+Math.random())
            ,win = desktop.getWindow(wid);
        
        //location = '#!' + wid
        
        if(!win) {
            var form = me.buildDetailForm(formClassName || me.detailFormView, rec)            
                ,titleIndx = form.titleIndex || 'name'
                
                ,tools = (form.noPin? null:[{
                    type: 'pin',
                    handler: function() {me.pinDetailForm(win)}
                }]);

           
            me.getRecord(rec, function(rec) {
                if(me.fireEvent('beforemodify', form, rec.data)===false || (!!me.beforeModify && me.beforeModify(form, rec.data) === false)) return false;
                
                form.record = rec
                var wcnf = {
                    id: wid,
                    title: me.buildDetailWindowTitle(titleIndx, rec.data), 
                    iconCls: me.launcher.iconCls,
                    //resizable: false,
                    //maximizable: false,
                    border: false,
                    bodyBorder: false,
                    items: form,
                    tools:tools,
                    layout: 'fit'
                }
                
                if(!!me.detailFormReconfig) wcnf = me.detailFormReconfig(wcnf)
                                        
                win = desktop.createWindow(wcnf).show();
                win.controllerName = me.getControllerName()
                me.addFormControls(win)                 
                
                if(!!form.setValues) form.setValues(rec.data);
                else {
                    var inForm = form.down('form')
                    if(inForm && !!inForm.setValues) inForm.setValues(rec.data);                    
                }
                
                me.buildChildPanels(form, rec)
                if(!!callback) callback(form)
                
                if(!!me.afterModify) me.afterModify(form, rec.data) 
                me.fireEvent('modify', form, rec.data);
            })
        } else {
            win.show()  
        }
        return win
    }
    
    ,buildDetailForm: function(formClassName, record) {
        return Ext.create(formClassName, {
            model: this.model, 
            app: this.app,
            Permissions: this.Permissions
        })
    }
    
    /**
     * @method
     * Removing selectet records.
     * @param {Ext.window.Window} win grid window
     */
    ,remove: function(win) {
        var grid = this.mainWin.down('grid')
            ,me = this
            ,store = grid.getStore()
            ,sm = grid.getSelectionModel()
            ,data = []
            ,records = [];
                
        if(sm.selected.length>0) { 
            for(var i=0;i<sm.selected.length;i++) {
                data.push(sm.selected.items[i].data._id)
                records.push(sm.selected.items[i].data)
            }
            me.removeRows(data, function() {
                var i = sm.selected.items[0].index;
                store.reload()
                //store.remove(sm.selected.items)
                //sm.select(i)
                //sm.deselect(sm.selected.items);
                //store.load()
                /*function(records, operation, success) {
                    if(i>=records.length) i = records.length - 1;
                    setTimeout(function() {
                        sm.select(i)
                        var v = grid.getView()
                        if(v && !!v.selectRow) v.selectRow(i)
                    }, 100)
                })
                */
                me.fireEvent('remove', records);
            })
        }
        
    }
    
    /**
     * @method
     * @private
     * Removing data rows
     * @param {Array} data
     * @param {Core.data.Store} store
     * @param {Function} callback
     */
    ,removeRows: function(data, callback, messages) {
        var me = this
        if(data.length>0) {            
            
            D.c('Removing', (messages && messages.remove? messages.remove: 'Delete %s row(s)?'),[data.length], function() {
                me.model.remove(data, callback)
            })
            return true
        }
        return false
    }
    
    /**
     * @method
     * Reloading a grid store
     */
    ,refresh: function() {
        var grid = this.mainWin.down('grid')
            
        if(grid) {
            grid.getStore().load();
        }
    }
    
    /**
     * @method
     * Saving a data record
     * @param {Ext.window.Window} win
     * @param {Boolean} closewin if true the window will be closed
     * @param {Function} callback
     */
    ,save: function(win, closewin, callback) {
        var me = this,
            form = win.down('form');
            data = {};
        
        var sb1 = win.down('[action=formsave]')
            ,sb2 = win.down('[action=formapply]')
        
        if(sb1 && !!sb1.setDisabled) sb1.setDisabled(true)
        if(sb2 && !!sb2.setDisabled) sb2.setDisabled(true)
        
        if(form) {
            data = form.getValues()    
        }
        
        var setButtonsStatus = function() {
            if(sb1 && !!sb1.setDisabled) sb1.setDisabled(false)
            if(sb2 && !!sb2.setDisabled) sb2.setDisabled(false)
        }

        var saveF = function(data) {
            me.model.write(data, function(data) {
                setButtonsStatus()
                if(me.fireEvent('save', form, data) === false || (!!me.afterSave && me.afterSave(win, data) === false)) {
                    if(callback) callback(data)
                    return;
                }
                if(closewin) win.close()
                else {
                    if(!!form.setRowId) {
                        if(data.record && data.record._id && !form.rowId) form.setRowId(data.record._id)
                    } else {
                        var idf = form.down('[name=_id]')
                        if(data.record && data.record._id && idf.getValue()=='') idf.setValue(data.record._id)   
                    }
                    me.setButtonsDisabled('open')                    
                }
                    
                if(callback) callback(data)
            })
        }
        
        if(!!me.beforeSave) {
            // beforeSave может вернуть результат или ретурном или
            // в калбэк. В случае калбэка, в ретурн нужно отправить false
            var d = me.beforeSave(form, data, function(data) {
                if(data === false) {
                    setButtonsStatus()
                    me.setButtonsDisabled('open');
                    return false;
                }
                saveF(data);
            })
            if(d === false) {
                return false;
            }
            saveF(d);
        } else {
            saveF(data);    
        }      
    }
    
    /**
     * @method
     * @private
     * Creating integrated form
     * @param {Ext.window.Window} win
     * @param {String} formCls
     */
    ,pinDetailForm: function(win, formCls) {
        var me = this
            ,form
            ,fconf = {
                region: 'south', 
                height: 200, 
                split: true,
                model: me.model,
                collapsible: true,
                //title: D.t('Row Editor'),
                tools:[
                    {
                        type: 'unpin',//toparentwin',
                        scope: this,
                        handler: function() {me.unpinDetailForm()}
                    }
                ],
                buildButtons: function() {return null},
                buildTbar: function(){
                    if(this.buildButtonsPined) return this.buildButtonsPined()
                }                
            }
        
        if(formCls) {
            form = fconf = Ext.create(formCls, fconf)
        } else {
            form = win.down('form')           
            fconf = form.cloneConfig(fconf)
        }
        
        me.mainWin.insert(0, fconf)
        me.addFormControls(me.mainWin)
        me.innerDetailForm = me.mainWin.down('form')
        me.innerDetailForm.setValues(form.getValues())
        me.innerDetailForm.record = form.record
        if(win) win.close();
        Sess.setState(me.id,{formPin: true})
    }
    
    /**
     * @method
     * @private
     * Removing integrated form
     */
    ,unpinDetailForm: function() {
        var form = this.mainWin.down('form');
        
        if(form && form.record) {
            this.modify(form.record)
        }  
        this.mainWin.remove(form)
        this.innerDetailForm = null
        Sess.setState(this.id,{formPin: false})
    }
    
    /**
     * @method
     * Creating depended module window
     * @param {Object} params
     * @param {String} params.parentField
     * @param {String} params.parentCode
     */
    ,showAsChild: function(params) {
        this.buildAsChild(params).show()
    }
    
    ,buildAsChild: function(params) {
        this.app = params.app  
              
        if(params && params.parentField) {      
            this.parentParams = {
                parentField: params.parentField,
                parentCode: params.parentCode
            }
        }
        
        this.id += ':' + params.parentCode
        
        if(params.title) this.titlePrefix = params.title
        
        var me = this,
            win,
            state = Sess.getState(me.id);
                
        var sets = Sess.getState(me.id)
            
        win = Ext.create(me.mainView, {
                model: me.model                
        });

        me.addControls(win)
        me.mainWin = win
            
        setTimeout(function() {                
            win.on('maximize', function() {Sess.setState(me.id,{maximize: true})})
            win.on('resize', function(th, w, h) {Sess.setState(me.id,{maximize: false})})
        }, 100)
            
        if(win.store && this.parentParams) {       
            win.store.wsProxy.extraParams = this.parentParams 
        }                
        return win
    }
    
    ,buildChildPanels: function(form, rec) {
        var me = this, items = form.query('[childModule]')

        if(items && items.length) {
             for(var i=0;i<items.length;i++) {
                 me.buildChildPanel(items[i], rec)
             }
        }
    }
    
    ,buildChildPanel: function(panel, rec) {
        var me = this, cwin;
        
        if(panel.childModule.outKey) panel.setDisabled(!(rec && rec.data && rec.data[panel.childModule.outKey]))
        
        if(!panel.items || !panel.items.length) {
            
            if(!panel.childModule.params) panel.childModule.params = {}
            
            if(!panel.childModule.noInheritPermissions) panel.childModule.params.Permissions = me.Permissions

            var cntr = Ext.create(panel.childModule.controller, panel.childModule.params)
           
            var prm = {
                title: '',
                app: me.app
            }
            
            if(panel.childModule.inKey) {
                prm.parentField = panel.childModule.inKey;
            }
            if(panel.childModule.outKey) {
                prm.parentCode = rec.data[panel.childModule.outKey];
            } else
            if(panel.childModule.parentCode) {
                prm.parentCode = panel.childModule.parentCode
            }
        
            var win = cntr.buildAsChild(prm)
        
            panel.add(win.items.items)
            cntr.mainWin = panel
        } else {
            cwin = panel.items[0];
        }
    }
    
    /**
     * @method
     * Copying a data record
     * @param {Ext.menu.Menu} menu
     */
    ,copyRecord: function(menu) {  
        //var pasteButton = menu.down('[action=pasteitem]')
        //if(pasteButton) {

        if(!Ext.clipboard) Ext.clipboard = {}
        Ext.clipboard[Object.getPrototypeOf(this.model).$className] = menu.record.data._id;
            
            
          //  pasteButton.setDisabled(false)
        //    menu.clipboardItemId = menu.record.data._id + ''
        //}
    }
    
    /**
     * @method
     * Paste a data record
     * @param {Ext.menu.Menu} menu
     */
    ,pasteRecord: function(menu) {
        var me = this
            ,modelName = Object.getPrototypeOf(this.model).$className;
        
        if(Ext.clipboard && Ext.clipboard[modelName]) {
            me.model.copy(Ext.clipboard[modelName], function(data) {
                me.refresh()
                if(me.innerDetailForm) me.modifyInside({data: data}) 
                else me.modify({data: data})
            })
        }
    }
    
    ,importCsv: function(th, win) {        
        var me = this;       
        if(th.fileInputEl.dom.files.length>0) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var contents = event.target.result;
                me.importCsvContent(contents);
            };
            reader.readAsText(th.fileInputEl.dom.files[0]);
        }    
    }
    
    ,importCsvContent: function(data) {
        var me = this
            ,len = data.length
            ,rec
            ,line = "";
            
        Ext.MessageBox.show({
           msg: D.t('Saving your data, please wait...'),
           progressText: D.t('Saving...'),
           width:300,
           wait:true,
           waitConfig: {interval:200},
           //icon:'ext-mb-download', 
           iconHeight: 50
       });    
        
        var f = function(i) {
            if(i>=len) {
                Ext.MessageBox.hide();
                return;
            }
            var c = data.charAt(i);
            if(c == '\n') {
                if(line) {
                    rec = line.split(';')
                    me.model.importCsvLine(rec, function() {
                       line = '';
                       var x = i/len
                       Ext.MessageBox.updateProgress(x, Math.round(100*x)+'% ' + D.t('completed'));
                       f(i+1)
                       
                    })
                } else {
                    f(i+1)
                }
            } else {
                if(c!='\r') line += c;
                f(i+1)
            }            
        }
        f(0)
    }
    
    ,setFocusToGrid: function(win) {
        var me = this
            ,grid = win.down('grid');
        if(!grid) return;
        var sm = grid.getSelectionModel()
            ,selected = sm.getSelection() 
        if(selected.length) {
            setTimeout(function() {grid.getView().focusRow(selected[0])}, 100)
        } else {
            sm.select(0)
            setTimeout(function() {grid.getView().focusRow(0)}, 100)
        }
    }
    
    ,autorun: function() {
        this.createWindow().show().maximize(true)    
    }
});

