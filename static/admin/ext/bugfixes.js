isLoading = false;
isLoadingTout = null;
mainViewportPanel = null;

Ext.mobileMaxWidth = 768;

Ext.onReady(function () {
        
    Ext.override('Ext.data.LocalStore', {
        createFiltersCollection: function() {
            return this.getData().getFilters();
        }
    
    })

    
    Ext.override(Ext.selection.Model, {
        storeHasSelected: function (record) {
            var store = this.store,
                records,
                len, id, i;
            if (record.hasId() && store.getById(record)) {
                return true;
            }

            if (store.data instanceof Ext.util.LruCache) {
                var result = false;
                store.data.forEach(function (rec) {
                    return !(result = (record.internalId === rec.internalId));
                });
                return result;
            }

            records = store.data.items;
            len = records.length;
            id = record.internalId;
            for (i = 0; i < len; ++i) {
                if (id === records[i].internalId) {
                    return true;
                }
            }
            return false;
        }
    });
    
    Ext.define('Ext.override.grid.ViewDropZone', {
        override: 'Ext.grid.ViewDropZone',
    	handleNodeDrop: function()
    	{
    		var sm = this.view.getSelectionModel(),
    			onLastFocusChanged = sm.onLastFocusChanged;
    
    		sm.onLastFocusChanged = Ext.emptyFn;
    		this.callParent(arguments);
    		sm.onLastFocusChanged = onLastFocusChanged;
    	}
    });
    
    Ext.override(Ext.window.Window, {
        border: false,
        bodyBorder: false,
        
        bodyStyle: 'background: #ffffff',
        fitContainer: function(animate) {
            var me = this,
                parent = me.floatParent,
                container = parent ? parent.getTargetEl() : me.container,
                newBox = container.getViewSize(false),
                newPosition = container.getXY();            
            newBox.x = newPosition[0];
            newBox.y = newPosition[1];
            me.setBox(newBox, animate);
        }
    });
    
    var rCfg = {}
    
    rCfg['width < ' + Ext.mobileMaxWidth] = {hideLabel: true}
    rCfg['width >= ' + Ext.mobileMaxWidth] = {hideLabel: false}
    
    Ext.override(Ext.form.field.Base, {
        plugins: 'responsive',
        responsiveConfig: rCfg,
        initComponent: function() {
            if(this.fieldLabel && !this.emptyText) this.emptyText = this.fieldLabel;
            this.callParent(arguments)
        }
        
    });
    
    Ext.override(Ext.form.field.Date, {
        initComponent: function(cfg) {
            if(!this.format || this.format == 'm/d/Y' || this.format == 'm/d/y') {
                this.format = D.t('m/d/Y')
            }
            this.submitFormat = 'c'
            this.altFormats = 'c|m/d/Y|m/d/y'
            this.callParent(arguments)
        }
    })
    Ext.override(Ext.grid.column.Date, {
        initComponent: function() {
            if(!this.format) this.format = D.t('m/d/Y')
            this.callParent(arguments)
        }
    })
   
    Ext.override(Ext.form.field.Checkbox, {
        initComponent: function() {
            this.uncheckedValue = false
            this.callParent(arguments)
        }
    })

    Ext.override(Ext.util.Renderable, {
        afterRender : function() {
            var me = this,
                data = {},
                protoEl = me.protoEl,
                target = me.el,
                item, pre, hide, contentEl;
    
            me.finishRenderChildren();
            
            
            
            if (me.contentEl) {
                pre = Ext.baseCSSPrefix;
                hide = pre + 'hide-';
                contentEl = Ext.get(me.contentEl);
                contentEl.removeCls([pre+'hidden', hide+'display', hide+'offsets', hide+'nosize']);
                me.getContentTarget().appendChild(contentEl.dom);
            }
    
            if(protoEl) protoEl.writeTo(data);
            
            
            
            
            item = data.removed;
            if (item) {
                target.removeCls(item);
            }
            
            item = data.cls;
            if (item.length) {
                target.addCls(item);
            }
            
            item = data.style;
            if (data.style) {
                target.setStyle(item);
            }
            
            me.protoEl = null;
    
            
            if (!me.ownerCt) {
                me.updateLayout();
            }
        }
    })
    
    Ext.override(Ext.menu.Menu, {
        onMouseLeave: function(e) {
        var me = this;
    
    
        // BEGIN FIX
        var visibleSubmenu = false;
        me.items.each(function(item) { 
            if(item.menu && item.menu.isVisible()) { 
                visibleSubmenu = true;
            }
        })
        if(visibleSubmenu) {
            //console.log('apply fix hide submenu');
            return;
        }
        // END FIX
    
    
        me.deactivateActiveItem();
    
    
        if (me.disabled) {
            return;
        }
    
    
        me.fireEvent('mouseleave', me, e);
        }
    });
    
    
    
    Ext.isMobile = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
    
})
