/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.users.controller.Main', {
    extend: 'Core.controller.MenuController',
    id:'users-menu-win',    
    launcher: {
        text: D.t('Users'),
        menu: {
            items: [{
                text: D.t('Admins'),
                controller: 'Desktop.modules.users.controller.Users'
            },{
                text: D.t('Admins groups'),
                controller: 'Desktop.modules.users.controller.Groups'
            },{
                text: D.t('User logs'),
                controller: 'Desktop.modules.logs.controller.Logs'
            },'-',{
                text: D.t('Users on site'),
                controller: 'Desktop.modules.users.controller.PublUsers'
            }]
        }
    }        
});

