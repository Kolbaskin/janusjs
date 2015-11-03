/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('Desktop.modules.pages.controller.Main', {
    extend: 'Core.controller.MenuController',
    
    launcher: {
        text: D.t('Site tools'),
        menu: {
            items: [                    
            {
                text: D.t('Pages'),
                controllerName: 'Desktop.modules.pages.controller.Pages'
            },{
                text: D.t('Main menu'),
                controllerName: 'Desktop.modules.mainmenu.controller.Menu'
            },{
                text: D.t('Templates'),
                controllerName: 'Desktop.modules.templates.controller.Templates'
            },{
                text: D.t('File manager'),
                controllerName: 'Desktop.modules.filemanager.controller.fm'
            },'-',{
                text: D.t('Rebuilding of search index'),
                model: 'pages-SearchReindex',
                handler: function() {
                    D.c('Rebuilding of search index', 'Old indexes will be removed. Are You sure?', [], function() {
                        Core.Ajax.request({
                            url:'/search.engine:rebuildAll',
                            callback: function(a1, a2, a3) {
                                D.a('Search index was rebuilt.')
                            }
                        })
                    })
                }
            },{
                text: D.t('Debugger'),
                controllerName: 'Desktop.modules.debugger.controller.Debugger'
            },{
                text: D.t('Search'),
                controllerName: 'Desktop.modules.search.controller.Search'
            }
            ]
        }
    }
    


});

