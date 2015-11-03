/**
 * @class Core.controller.MenuController
 * @extend Core.controller.Controller
 * @author Max Tushev
 * This is superclass of {@link Core.controller.Controller} to making a branch in the main menu
 * 
 *     @example
 *     Ext.define('Desktop.modules.mymenu.controller.Mymenu', {
 *         extend: 'Core.controller.MenuController',
 *   
 *         launcher: {
 *             text: 'Branch name',
 *             iconCls:'branchIcon',
 *             menu: {
 *                 items: [                    
 *                     { 
 *                        text: 'Item name',
 *                        iconCls:'itemIcon',
 *                        controller: 'Desktop.modules.my.controller.Name'
 *                     }
 *                 ]
 *             }
 *        }
 *     })
 * 
 */
Ext.define('Core.controller.MenuController', {
    extend: 'Core.controller.Controller',
    
    constructor: function() {
        this.init()
    },
    
    /**
     * @method
     * Running of a controller
     * @param {Object} menuItem
     */
    runController: function(el) {
        var contr = Ext.create(el.controllerName)
        contr.app = this.app
        this.app.createWindow(contr)
    },
    
    init: function(options) {
        var me = this
        this.launcher = Object.getPrototypeOf(me).launcher
        
        var func = function(obj) {
            if(!obj) return null;
            if(obj === '-') return '-';
            if(obj.menu) {
                for(var i=0;i<obj.menu.items.length;i++) {
                    obj.menu.items[i] = func(obj.menu.items[i])           
                }
                obj.handler = function() {return false;}
            } else {
                if(!!obj.controller) {
                    obj.controllerName = obj.controller+''
                    delete obj.controller;
                }
                if(!obj.handler) {
                    obj.handler = function(el) {me.runController(el)}    
                }     
            }
            return obj
        }        
        this.launcher = func(this.launcher)        
    }


});

