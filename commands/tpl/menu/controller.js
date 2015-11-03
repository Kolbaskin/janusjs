/*!
 * Copyright(c) 2006-2015.
 * 
 * 
 */

Ext.define('{{nameSpace}}.modules.{{parent}}.controller.{{Name}}', {
    extend: 'Core.controller.MenuController',
    
    launcher: {
        text: D.t('{{Title}}'),
        iconCls:'{{Icon}}',
        menu: {
            items: [{
                text: D.t('Countries'),
                iconCls:'dirs',
                controller: 'Crm.modules.dirs.controller.Countries'
            }]
        }
    }
    


});

