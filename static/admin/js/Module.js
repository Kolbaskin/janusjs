/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.Module', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
        this.init();
    },
    
    control: function(win, events) {
        var p = []
        for(var i in events) {
            p = win.query(i);
            if(!!p) {
                for(var j=0;j<p.length;j++) {
                    p[j].on(events[i])    
                }
            }
        }
    },

    init: Ext.emptyFn
});
