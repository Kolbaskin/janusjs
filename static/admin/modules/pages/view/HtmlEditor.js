Ext.define('Desktop.modules.pages.view.HtmlEditor', {
    extend: 'Ext.ux.form.TinyMceTextArea',
    
    border: false,
    bodyBorder: false,
    
    editorCfg: {
        image: {
            width: 500,
            height: 300,
            tpl: '<tpl for="list"><img src="{src}" /></tpl>'
        }
    },
    
    tinyMCEConfig: {
        relative_urls : false,
    	content_css : "/style/text.css",
    	theme_advanced_styles: "Formated table=data;",
    	remove_linebreaks : false,
    	extended_valid_elements : "textarea[cols|rows|disabled|name|readonly|class]," + "iframe[src|title|width|height|allowfullscreen|frameborder]",
        plugins : "spellchecker,pagebreak,layer,table,save,insertdatetime,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,template,wordcount,link,anchor,code,imageext",
        toolbar : [         
            "undo redo | cut copy paste pastetext pasteword  | searchreplace | table | bullist numlist | link unlink anchor | print | ltr rtl | code"
            ,"styleselect formatselect | bold italic  underline strikethrough | alignleft aligncenter alignright alignjustify | imageext"
        ],
        toolbarMobile : [         
            "bold italic bullist link formatselect alignleft aligncenter alignright"
        ],
        image_advtab: true
        
    }
    
    ,constructor: function(cfg) {
        var me = this;
        this.tinyMCEConfig.setup = function(editor) {
            editor.userCfg = cfg.editorCfg || me.editorCfg  
        }
        
        if(!arguments[0].tinyMCEConfig) arguments[0].tinyMCEConfig = this.tinyMCEConfig;
        if(Ext.getBody().dom.clientWidth < 768 && arguments[0].tinyMCEConfig.toolbar) {
            arguments[0].tinyMCEConfig.toolbar = arguments[0].tinyMCEConfig.toolbarMobile    
        }
        
        this.callParent(arguments)
    }
    
})