//alert(1);

Config = {
    
    DefaultTheme: 'crisp',
    
    tinyCfg: {
    	// General options
		theme : "advanced",

		skin: "extjs",
        inlinepopups_skin: "extjs",
		
        // Original value is 23, hard coded.
        // with 23 the editor calculates the height wrong.
        // With these settings, you can do the fine tuning of the height
        // by the initialization.
        theme_advanced_row_height: 27,
        delta_height: 1,
        
        schema: "html5",
        
        plugins : "codeeditor,insertobject,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist",
        
		// Theme options fullscreen,|,,code,help,
		theme_advanced_buttons1 : "codeedit,cleanup,help,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,search,replace,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,|,forecolor,backcolor",
		theme_advanced_buttons2 : "bullist,numlist,|,outdent,indent,blockquote,|,link,unlink,anchor,insertobject,|,tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl",
		//theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		//theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,|,insertdate,inserttime,preview",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
    
		// Example content CSS (should be your site CSS)
		content_css : "/style/text.css",
        
        convert_urls: false,
        relative_urls: false,
        remove_script_host: false
	},
    tinyCfgShort: {
        // General options
		theme : "advanced",

		skin: "extjs",
        inlinepopups_skin: "extjs",
		
        // Original value is 23, hard coded.
        // with 23 the editor calculates the height wrong.
        // With these settings, you can do the fine tuning of the height
        // by the initialization.
        theme_advanced_row_height: 27,
        delta_height: 1,
        
        schema: "html5",
        
        plugins : ",insertobject,autolink,lists,style,save,advlink,searchreplace,paste,directionality,noneditable,template,wordcount,advlist",
        
		// Theme options fullscreen,|,,code,help,
		theme_advanced_buttons1 : "cleanup,|,cut,copy,paste,pastetext,pasteword,|,undo,redo,|,search,replace,|,bold,italic,underline,|,formatselect,bullist,numlist,link,unlink,",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
    
		// Example content CSS (should be your site CSS)
		content_css : "/style/text.css",
        
        convert_urls: false,
        relative_urls: false,
        remove_script_host: false
	}

}