/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.templates.controller.Templates', {
    extend: 'Core.controller.Controller',
    id:'templates-win',

    launcher: {
        text: D.t('Templates'),
        iconCls:'fa fa-html5',
        model: 'templates-DataModel'
    }
});

