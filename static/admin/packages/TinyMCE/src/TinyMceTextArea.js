/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, browser:true */
/*global Ext, tinymce, tinyMCE */

/*-------------------------------------------------------------------
 Ext.ux.form.TinyMCETextArea

 ExtJS form field - a text area with integrated TinyMCE WYSIWYG Editor

 Version: 4.0.1
 Release date: 17.12.2013
 ExtJS Version: 4.2.1
 TinyMCE Version: 4.0.11
 License: LGPL v2.1 or later, Sencha License

 Author: Oleg Schildt
 E-Mail: Oleg.Schildt@gmail.com

 Copyright (c) 2013 Oleg Schildt

 Enhanced by Steve Drucker (sdrucker@figleaf.com):
 ExtJS Version: 4.2.1
 TinyMCE Version: 4.0.20

 - Added attributes to load plugins and associated buttons
 - Added ICE version control plugin support
 - Automatically loads TinyMCE from the CDN if not present
 - Added autoFocus param to prevent automatic focus on instantiation
 - Added dynamic show/hide of header & footer on focus / blur

 Following issues are covered:

 - Initialization in an initially visible and in an initially invisible tab.
 - Correct place occupation by the initialization in any ExtJS layout.
 - Correct resizing by the resizing of the underlying text area.
 - Activation and deactivation of the WYSIWYG editor.
 - Enabling and disabling of the WYSIWYG editor control.
 - ReadOnly state support.
 - Changing of WYSIWYG settings and CSS file for the editable contents on the fly.
 - Pre-formatting of the HTML text in visible and invisible modus.
 - Focusing of the WYSIWYG editor control.
 - Marking invalid.
 - Tracking dirty state.
 - Storing and restoring cursor position by inserting of a place holder over a popup window.
 -------------------------------------------------------------------*/

// load tinymce from cdn if local version is not pre-loaded


if (location.href.indexOf('ionp') == 0) {

    // for sencha architect

    Ext.define('Ext.ux.form.TinyMceTextArea', {
        extend: 'Ext.form.field.TextArea',
        alias: 'widget.tinymce'
    });

} else {

    // actually load the class

    Ext.define('Ext.ux.form.TinyMceTextArea', {

        extend: 'Ext.form.field.TextArea',
        alias: 'widget.tinymce',

        //-----------------------------------------------------------------

        /*
     Flag for tracking the initialization state
     */
        wysiwygIntialized: false,
        intializationInProgress: false,

        lastHeight: null,
        lastFrameHeight: null,

        /*
     This properties enables starting without WYSIWYG editor.
     The user can activate it later if he wants.
     */
        noWysiwyg: false,


        /*
     Config object for the TinyMCE configuration options
     */


        tinyMCEConfig: {},


        plugin_advlist: true,
        plugin_anchor: true,
        plugin_autolink: true,
        plugin_autoresize: false,
        plugin_autosave: false,
        plugin_bbcode: false,
        plugin_charmap: false,
        plugin_code: true,
        plugin_compat3x: false,
        plugin_contextmenu: true,
        plugin_directionality: false,
        plugin_emoticons: false,
        plugin_fullpage: false,
        plugin_fullscreen: true,
        plugin_hr: false,
        plugin_image: false,
        plugin_insertdatetime: false,
        plugin_legacyoutput: false,
        plugin_link: true,
        plugin_lists: false,
        plugin_importcss: false,
        plugin_media: false,
        plugin_nonbreaking: false,
        plugin_noneditable: false,
        plugin_pagebreak: false,
        plugin_paste: true,
        plugin_preview: false,
        plugin_print: false,
        plugin_save: false,
        plugin_searchreplace: true,
        plugin_spellchecker: false,
        plugin_table: true,
        plugin_textcolor: false,
        plugin_visualblocks: false,
        plugin_visualchars: false,
        plugin_wordcount: false,
        plugin_ice: false,
        plugin_icesearchreplace: false,
        statusbar: true,
        showFormattingToolbar: true,
        showEditorMenu: false,
        showCustomMenu: false,

        browserSpellCheck: true,
        autoFocus: false,
        hideToolbarOnBlur: true,
        
        languages: 'en',
        defaultLanguage: 'en',
        formattingToolbar: 'undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table code | removeformat',
        
        
        toolbar: [],

        font_formats: "Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;",

        cssUrls: null,

        customMenu: {
            edit: {
                title: 'Edit',
                items: 'undo redo | cut copy paste | selectall'
            },
            insert: {
                title: 'Insert',
                items: '|'
            },
            view: {
                title: 'View',
                items: 'visualaid'
            },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
            }
        },

        image_list: [],

        // ice specific

        iceUserName: 'anonymous',
        iceUserId: 0,

        //-----------------------------------------------------------------
        /*
        addEventss: function() {
            
            var ed = tinymce.get(this.getInputId());
          
            ed.on('GetContent', function(e) {
                console.log('get content', e);
            });
            
            ed.on('SetContent', function(e) {
                console.log('set content', e);
            });
            
        },
        */
        afterRender: function() {
            var me = this;

            me.callParent(arguments);

            //setTimeout(function() {me.addEventss();}, 500)  

            me.on('blur', function(elm, ev, eOpts) {

                var ctrl = document.getElementById(me.getInputId());

                if (me.wysiwygIntialized) {
                    var ed = tinymce.get(me.getInputId());

                    // In the HTML text modus, the contents should be
                    // synchronized upon the blur event.
                    if (ed && ed.isHidden()) {
                        if (ctrl) {
                            me.positionBeforeBlur = {
                                start: ctrl.selectionStart,
                                end: ctrl.selectionEnd
                            };
                        }

                        ed.load();
                    }
                } else {
                    if (ctrl) {
                        me.positionBeforeBlur = {
                            start: ctrl.selectionStart,
                            end: ctrl.selectionEnd
                        };
                    }
                }
            }, me);

            me.on('resize', function(elm, width, height, oldWidth, oldHeight, eOpts) {

                if (!me.noWysiwyg && !me.wysiwygIntialized) {
                    me.initEditor(height);
                } else {
                    me.syncEditorHeight(height);
                }
            }, me);


        },
        //-----------------------------------------------------------------
        syncEditorHeight: function(height) {
            var me = this;


            me.lastHeight = height;

            
            if (me.hideToolbarOnBlur && me.labelAlign == 'top') {
                height = height - ( me.labelEl.getHeight() + 3 );
                me.lastHeight = height;

            }

            if (!me.wysiwygIntialized || !me.rendered) {
                return;
            }

            var ed = tinymce.get(me.getInputId());

            // if the editor is hidden, we do not syncronize
            // because the size values of the hidden editor
            // are calculated wrong.

            if (!ed || ed.isHidden()) {
                return;
            }

            var edIframe = Ext.get(me.getInputId() + "_ifr");

            var parent = edIframe.up(".mce-edit-area");
            parent = parent.up(".mce-container-body");

            var newHeight = height;

            var edToolbar = parent.down(".mce-toolbar-grp");
            if (edToolbar)
                newHeight -= edToolbar.getHeight();

            var edMenubar = parent.down(".mce-menubar");
            if (edMenubar)
                newHeight -= edMenubar.getHeight();

            var edStatusbar = parent.down(".mce-statusbar");
            if (edStatusbar)
                newHeight -= edStatusbar.getHeight();

            me.lastFrameHeight = newHeight - 3;

            edIframe.setHeight(newHeight - 3);

            return newHeight - 3;
        },
        //-----------------------------------------------------------------
        initEditor: function(height) {

            var me = this, toolbar = Ext.clone(me.toolbar);

            if (me.noWysiwyg || me.intializationInProgress || me.wysiwygIntialized) {
                return;
            }

            me.intializationInProgress = true;

            if (!me.tinyMCEConfig) {
                me.tinyMCEConfig = {};
            } else {
                // We need clone, not reference.
                // The configuration of the wysiwyg might be passed as an object to
                // many editor instances. Through cloning, we prevent
                // side effects on other editors upon internal modifications
                // of the tinyMCEConfig
                var tmp_cfg = me.tinyMCEConfig;
                me.tinyMCEConfig = {};
                Ext.Object.merge(me.tinyMCEConfig, tmp_cfg);
            }

            me.tinyMCEConfig.mode = "exact";
            me.tinyMCEConfig.resize = false;

            // me.tinyMCEConfig.elements = me.getInputId();

            me.tinyMCEConfig.selector = 'textarea#' + me.getInputId();

            if (me.lastFrameHeight) {
                me.tinyMCEConfig.height = me.lastFrameHeight;
            } else {
                me.tinyMCEConfig.height = 30;
            }

            if (me.readOnly || me.isDisabled()) {
                me.tinyMCEConfig.readonly = true;
            }

            // This provides that the editor get focus 
            // by click on the label

            if (me.labelEl) {
                me.labelEl.on('click', function(ev, elm, opts) {
                    me.focus(false);
                }, me.labelEl);
            }

            // We have to override the setup method of the TinyMCE.
            // If the user has define own one, we shall not loose it.
            // Store it and call it after our specific actions.
            var user_setup = null;

            if (me.tinyMCEConfig.setup) {
                user_setup = me.tinyMCEConfig.setup;
            }

            // BEGIN: setup
            me.tinyMCEConfig.setup = function(ed) {

                ed.on('init', function(e) {
                    me.wysiwygIntialized = true;
                    me.intializationInProgress = false;

                    // This piece of code solves the problem of change propagation so that
                    // there is no need to call triggerSave

                    var setContent = ed.setContent;
                    ed.setContent = function() {
                        setContent.apply(ed, arguments);
                        ed.fire('change', {});
                    };

                    if (height) {
                        // setTimeout is a hack. The problem is that the editor
                        // it not really ready, when init fires.
                        setTimeout(function() {
                            me.syncEditorHeight(height);
                        }, 300);
                    }

                });

                // Catch and propagate the change event 

                ed.on('change', function(e) {
                    var oldval = me.getValue();
                    var newval = ed.getContent();

                    ed.save();

                    me.fireEvent('change', me, newval, oldval, {});

                    if (me.validateOnChange) {
                        me.validate();
                    }
                });

                // This ensures that the focusing the editor
                // bring the parent window to front

                // sdd: modified to not always grab focus by default

                ed.on('focus', function(e) {
                    var w = me.findParentByType('window');
                    if (w) w.toFront(true);

                    if (!me.tinyMCEConfig.auto_focus && !ed.initFocus) {
                        ed.initFocus = true;
                        var form = me.up('form');
                        if (form) {
                            form.down('field').focus(false, 1000);
                        }
                    }

                    // sdd - show header and footer

                    if (me.hideToolbarOnBlur) {

                        var height = me.getHeight();
                       
                        var toolbarEl = Ext.get(Ext.fly(this.editorContainer.id).select('.mce-toolbar-grp').elements[0]);
                        toolbarEl.setVisibilityMode(Ext.Element.DISPLAY);
                        toolbarEl.show();

                        var footerEl = Ext.get(this.editorContainer.id).select('.mce-statusbar');
                        if (footerEl.elements.length > 0) {
                            footerEl = Ext.get(footerEl.elements[0]);
                            footerEl.setVisibilityMode(Ext.Element.DISPLAY);
                            footerEl.show();
                        }

                        if (height > 0) {
                            me.syncEditorHeight(height);
                        }
                    }

                });

                // sdd - hide toolbar and footer
                if (me.hideToolbarOnBlur) {
                    ed.on('blur', function(e) {

                        var toolbarEl = Ext.get(Ext.fly(this.editorContainer.id).select('.mce-toolbar-grp').elements[0]);
                        toolbarEl.setVisibilityMode(Ext.Element.DISPLAY);
                        toolbarEl.hide();

                        var footerEl = Ext.get(this.editorContainer.id).select('.mce-statusbar');
                        if (footerEl.elements.length > 0) {
                            footerEl = Ext.get(footerEl.elements[0]);
                            footerEl.setVisibilityMode(Ext.Element.DISPLAY);
                            footerEl.hide();
                        }

                        if (me.getHeight() > 0) {
                            me.syncEditorHeight(me.getHeight());
                        }
                    });
                }

                if (user_setup) {
                    user_setup(ed);
                }

            };
            // END: setup


            // added more helper configs by sdd
            var plugins = [];
            for (var i in me) {
                if (i.indexOf('plugin_') == 0) {
                    if (me[i])
                        plugins.push(i.substring(7));
                }
            }

            // linking / autolinking

            if (Ext.Array.contains(plugins, "link")) {
                toolbar.push("|");
                toolbar.push("link");
                plugins.push('autolink');
                me.plugin_autolink = true;
            }

            // support directionality rtl/ltr

            if (Ext.Array.contains(plugins, "directionality")) {
                toolbar.push("|");
                toolbar.push("ltr");
                toolbar.push("rtl");
            }

            // emoticon support
            if (Ext.Array.contains(plugins, "emoticons")) {
                toolbar.push("| emoticons");
            }

            if (Ext.Array.contains(plugins, "fullpage")) {
               toolbar.push("| fullpage");
            }

            if (Ext.Array.contains(plugins, "fullscreen")) {
                toolbar.push("| fullscreen");
            }

            if (Ext.Array.contains(plugins, "insertdatetime")) {
                toolbar.push("insertdatetime");
            }

            if (Ext.Array.contains(plugins, "nonbreaking")) {
                toolbar.push("| nonbreaking");
                Ext.applyIf(me.tinyMCEConfig, {
                    nonbreaking_force_tab: true
                });
            }

            if (Ext.Array.contains(plugins, "noneditable")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    nonbreaking_leave_contenteditable: true
                });
            }

            if (Ext.Array.contains(plugins, "pagebreak")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    pagebreak_separator: "<br style='page-break-after:always'>"
                });
            }

            if (Ext.Array.contains(plugins, "paste")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    paste_as_text: true,
                    paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,ul,li,p"
                });
            }

            if (Ext.Array.contains(plugins, "preview")) {
                toolbar.push("| preview");
            }

            if (Ext.Array.contains(plugins, "print")) {
                toolbar.push("| print");
            }

            if (Ext.Array.contains(plugins, "save")) {
                toolbar.push("| save");
            }

            if (Ext.Array.contains(plugins, "searchreplace")) {
                toolbar.push("| searchreplace");
            }

            if (Ext.Array.contains(plugins, "table")) {
                Ext.applyIf(me.tinyMCEConfig, {
                    tools: "| inserttable"
                });
            }

            if (Ext.Array.contains(plugins, "textcolor")) {
                toolbar.push("| forecolor backcolor");
            }

            if (Ext.Array.contains(plugins, "visualchars")) {
                toolbar.push("| visualchars");
            }

            if (Ext.Array.contains(plugins, "wordcount")) {
                me.statusbar = true;
            }

            // ice version control plugin

            if (Ext.Array.contains(plugins, "ice")) {

                Ext.applyIf(me.tinyMCEConfig, {
                    ice: {
                        user: {
                            name: me.iceUserName,
                            id: me.iceUserId
                        },
                        preserveOnPaste: 'p,a[href],i,em,b,span',
                        deleteTag: 'delete',
                        insertTag: 'insert'
                    },
                    extended_valid_elements: "p,span[*],delete[*],insert[*]"
                });

                toolbar.push(' | ice_togglechanges ice_toggleshowchanges iceacceptall icerejectall iceaccept icereject');

            }

            if (Ext.Array.contains(plugins, "wordcount")) {
                me.statusbar = true;
            }

            // apply toolbar

            if (me.showFormattingToolbar) {

                // remove dups from autogenerated toolbar
                var ftb = Ext.Array.unique(me.formattingToolbar.split(' '));
                Ext.Array.remove(ftb, '|');
                toolbar = Ext.Array.difference(toolbar, ftb)

                // apply merged toolbar
                Ext.applyIf(me.tinyMCEConfig, {
                    toolbar1: me.formattingToolbar + ' ' + toolbar.join(' ')
                });

            } else {

                Ext.applyIf(me.tinyMCEConfig, {
                    toolbar1: toolbar.join(' ')
                });

            }

            if (me.showEditorMenu) {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: true
                });
            } else {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: false
                });
            }

            if (me.showCustomMenu) {
                Ext.applyIf(me.tinyMCEConfig, {
                    menubar: true,
                    menu: me.editorMenu
                });
            }

            if (me.cssUrls) {
                Ext.applyIf(me.tinyMCEConfig, {
                    content_css: me.cssUrls
                });
            }

            if (me.autoFocus) {
                Ext.applyIf(me.tinyMCEConfig, {
                    auto_focus: me.getInputId()
                });
            }

            Ext.applyIf(me.tinyMCEConfig, {
                image_list: me.image_list,
                plugins: plugins.join(' '),
                font_formats: me.font_formats,
                statusbar: me.statusbar,
                browser_spellcheck: me.browserSpellCheck,
            });

            tinymce.init(me.tinyMCEConfig);

            me.intializationInProgress = false;
            me.wysiwygIntialized = true;

        },
        //-----------------------------------------------------------------
        getEditor: function() {
            var me = this;
        },
        //-----------------------------------------------------------------
        isEditorHidden: function() {
            var me = this;

            if (!me.wysiwygIntialized) {
                return true;
            }

            var ed = tinymce.get(me.getInputId());
            if (!ed) {
                return true;
            }

            return ed.isHidden();
        },
        //-----------------------------------------------------------------
        showEditor: function() {
            var me = this;

            me.storedCursorPosition = null;

            if (!me.wysiwygIntialized) {
                me.noWysiwyg = false;
                me.initEditor(me.getHeight());
                return;
            }

            var ed = tinymce.get(me.getInputId());
            if (!ed) {
                return;
            }

            ed.show();

            ed.nodeChanged();

            if (me.lastHeight) {
                me.syncEditorHeight(me.lastHeight);
            }

            // me.focus();
        },
        //-----------------------------------------------------------------
        hideEditor: function() {
            var me = this;

            if (!me.wysiwygIntialized) {
                return;
            }

            var ed = tinymce.get(me.getInputId());
            if (!ed) {
                return;
            }

            var node = ed.selection.getNode();

            if (!node || node.nodeName === "#document" || node.nodeName === "BODY" || node.nodeName === "body") {
                ed.hide();

                return;
            }

            // otherwise try to position the cursor

            var marker = '<a id="_____sys__11223___"></a>';
            ed.selection.collapse(true);
            ed.execCommand('mceInsertContent', 0, marker);

            ed.hide();

            var ctrl = document.getElementById(me.getInputId());

            var pos = -1;
            var txt = "";

            if (ctrl) {
                txt = ctrl.value;
                pos = txt.indexOf(marker);
            }

            if (pos !== -1) {
                var re = new RegExp(marker, "g");
                txt = txt.replace(re, "");
                ctrl.value = txt;

                if (ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                }
            }
        },
        //-----------------------------------------------------------------
        toggleEditor: function() {
            var me = this;

            if (!me.wysiwygIntialized) {
                me.showEditor();
                return;
            }

            var ed = tinymce.get(me.getInputId());

            if (ed.isHidden()) {
                me.showEditor();
            } else {
                me.hideEditor();
            }
        },
        //-----------------------------------------------------------------
        removeEditor: function() {
            var me = this;

            if (me.intializationInProgress) {
                return me;
            }

            if (!me.wysiwygIntialized) {
                return me;
            }

            var ed = tinymce.get(me.getInputId());
            if (ed) {
                ed.save();
                ed.destroy(false);
            }

            me.wysiwygIntialized = false;

            return me;
        }, //removeEditor
        //-----------------------------------------------------------------
        // Sometimes, the editor should be reinitilized on the fly, e.g.
        // if the body css has been changed (in a CMS the user changed
        // the design template of a page opened in the editor).
        // This method removes the editor from the textarea, adds the
        // changed properties to the base config object and initializes
        // the editor again.
        //-----------------------------------------------------------------
        reinitEditor: function(cfg) {
            var me = this;

            if (me.noWysiwyg || me.intializationInProgress) {
                return me;
            }

            if (!me.tinyMCEConfig) {
                me.tinyMCEConfig = {};
            }
            if (!cfg) {
                cfg = {};
            }


            Ext.apply(me.tinyMCEConfig, cfg);

            if (!me.wysiwygIntialized) {
                return me;
            }

            var hidden = true;

            var ed = tinymce.get(me.getInputId());
            if (ed) {
                hidden = ed.isHidden();
                ed.save();
                ed.destroy(false);
            }

            me.wysiwygIntialized = false;

            if (!hidden) {
                me.initEditor(me.getHeight());
            }

            return me;
        },
        //-----------------------------------------------------------------
        setValue: function(v) {
            var me = this;

            var res = me.callParent(arguments);

            if (me.wysiwygIntialized) {
                // The editor does some preformatting of the HTML text
                // entered by the user.
                // The method setValue sets the value of the textarea.
                // We have to load the text into editor for the
                // preformatting and then to save it back to the textarea.

                var ed = tinymce.get(me.getInputId());
                if (ed) {
                    ed.load();
                    ed.save();
                }
            }

            return res;
        },
        //-----------------------------------------------------------------
        focus: function(selectText, delay) {
            var me = this;

            if (me.isDisabled()) {
                return me;
            }

            if (delay) {
                if (isNaN(delay)) {
                    delay = 10;
                }

                setTimeout(function() {
                    me.focus.call(me, selectText, false);
                }, delay);
                return me;
            }

            if (!me.wysiwygIntialized) {
                return me.callParent(arguments);
            }

            var ed = tinymce.get(me.getInputId());

            if (ed && !ed.isHidden()) {
                me.callParent(arguments);

                ed.focus();
            } else {
                return me.callParent(arguments);
            }

            return me;
        },
        //-----------------------------------------------------------------
        enable: function(silent) {
            var me = this;
            var result = me.callParent(arguments);

            if (!result) {
                return result;
            }

            if (me.tinyMCEConfig.readonly) {
                me.reinitEditor({
                    readonly: false
                });
            }

            return result;
        },
        //-----------------------------------------------------------------
        disable: function(silent) {
            var me = this;
            var result = me.callParent(arguments);

            if (!result) {
                return result;
            }

            if (me.readOnly) {
                me.reinitEditor({
                    readonly: true
                });
            }

            return result;
        },
        //-----------------------------------------------------------------
        setReadOnly: function(readOnly) {
            var me = this;

            var result = me.callParent(arguments);

            if (readOnly !== me.tinyMCEConfig.readonly) {
                me.reinitEditor({
                    readonly: readOnly
                });
            }

            return result;
        }, // setReadOnly
        //-----------------------------------------------------------------
        storeCurrentSelection: function() {
            var me = this;

            var wwg_mode = false;

            var ed = tinymce.get(me.getInputId());

            if (me.wysiwygIntialized) {
                if (ed && !ed.isHidden()) {
                    wwg_mode = true;
                }
            }

            var ctrl = document.getElementById(me.getInputId());

            if (wwg_mode) {
                me.storedCursorPosition = ed.selection.getBookmark('simple');
            } else if (ctrl) {
                me.storedCursorPosition = me.positionBeforeBlur;
            }
        }, // storeCurrentSelection
        //-----------------------------------------------------------------
        restoreCurrentSelection: function() {
            var me = this;

            if (!me.storedCursorPosition) {
                return;
            }

            var wwg_mode = false;

            var ed = tinymce.get(me.getInputId());

            if (me.wysiwygIntialized) {
                if (ed && !ed.isHidden()) {
                    wwg_mode = true;
                }
            }

            var ctrl = document.getElementById(me.getInputId());

            if (wwg_mode) {
                ed.selection.moveToBookmark(me.storedCursorPosition);
            } else if (ctrl) {
                ctrl.setSelectionRange(me.storedCursorPosition.start, me.storedCursorPosition.end);
            }
        }, // restoreCurrentSelection
        //-----------------------------------------------------------------
        insertText: function(txt) {
            var me = this;

            var wwg_mode = false;

            var ed = tinymce.get(me.getInputId());

            if (me.wysiwygIntialized) {
                if (ed && !ed.isHidden()) {
                    wwg_mode = true;
                }
            }

            var ctrl = document.getElementById(me.getInputId());

            if (wwg_mode) {
                ed.focus();
                ed.execCommand('mceInsertContent', 0, txt);
            } else if (ctrl) {
                ctrl.focus();

                var start = ctrl.selectionStart + txt.length;

                ctrl.value = ctrl.value.slice(0, ctrl.selectionStart) + txt + ctrl.value.slice(ctrl.selectionEnd);

                ctrl.setSelectionRange(start, start);
            }
        }, // insertText
        //-----------------------------------------------------------------
        beforeDestroy: function() {
            var me = this;

            var ed = tinymce.get(me.getInputId());

            if (ed) ed.destroy(false);
        },
        //-----------------------------------------------------------------
        renderActiveError: function() {

            var me = this,
                activeError = me.getActiveError(),
                hasError = !! activeError;

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (!edIframe) {
                return me.callParent(arguments);
            }

            var ed = tinymce.get(me.getInputId());
            if (!ed) {
                return me.callParent(arguments);
            }

            var parent = edIframe.up(".mce-edit-area");
            parent = parent.up(".mce-container-body");

            if (!parent) {
                return me.callParent(arguments);
            }

            parent = parent.up(".mce-tinymce");

            if (!parent) {
                return me.callParent(arguments);
            }

            if (me.rendered && !me.isDestroyed && !me.preventMark) {

                var evHandler = function(args) {
                    me.clearInvalid();
                };

                // Add/remove invalid class
                if (hasError) {
                    parent.addCls('tinymce-error-field');

                    ed.on('keydown', evHandler);
                    ed.on('change', evHandler);
                } else {
                    parent.removeCls('tinymce-error-field');

                    ed.off('keydown', evHandler);
                    ed.off('change', evHandler);
                }
            }

            return me.callParent(arguments);
        }
        //-----------------------------------------------------------------
    });

}