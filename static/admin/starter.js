Core = {}

GlobalLoadingMask = document.createElement('div')
GlobalLoadingMask.className = 'global-loading'
//document.body.appendChild(GlobalLoadingMask)

Modules = {
    requires: [
        "Ext.window.MessageBox", 
        "Ext.ux.desktop.ShortcutModel", 
        "Desktop.Settings"
    ], 
    shortcuts: [],//{ name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' }],
    quickStart: []//{ name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' }] // ---//----
}

Modules.defaultCoun = Modules.requires.length

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Extensible': 'Extensible',
        'Ext': 'ext/src',
        'Ext.ux': 'ext/src/ux',
        'Ext.ux.desktop': 'js',
        'Ext.ux.form.TinyMceTextArea': 'packages/TinyMCE/src/TinyMceTextArea.js',
        Desktop: '',
        Core: 'core'
	}
});
    
Ext.ClassManager.addNameAlternateMappings({
  "Ext.ux.form.TinyMceTextArea": [],

  "Ext.ux.form.TinyMceTextArea": [
    "widget.tinymce"
  ]
});
    
Ext.require([ 'Core.Ajax' ]);

var myDesktopApp,
    initLoad = true;

Ext.themeName = 'crisp'

Ext.onReady(function () {

    var id = localStorage.getItem('uid') || 0
        ,token = localStorage.getItem('token') || 0
        ,CommandLine = location.href.split('#')[1]
    
    Ext.QuickTips.init();
    Ext.tip.Tip.prototype.minWidth = 'auto';
    Ext.form.Field.prototype.msgTarget = 'side';
    
    if(id && token) {
        var uriArr = location.href.split('/')
            ,host = uriArr[2]
            ,protocole = uriArr[0] == 'https:'? 'wss':'ws';
        Core.ws = Ext.create('Core.WSockets', {
            url: protocole + "://" + host + "/?token=" + token + "&id=" + id ,
            protocol: "yode-protocol",
            communicationType: 'event'
        })

    } else {
        location = 'login.html' + (CommandLine? '#' + CommandLine:'');
        return;
    }

    
    Core.Ajax.request({
        url: 'User.getModulesList',                                
        succ: function(data){
            if(data.success === false) {
                location = 'login.html' + (CommandLine? '#' + CommandLine:'');
                return;
            }
            
            var nameSpace, toLoad = []
            for(var i=0;i<data.length;i++) {
                nameSpace = data[i].controller.split('.')[0]
                if(nameSpace != 'Desktop' && toLoad.indexOf(nameSpace) == -1) {
                    toLoad.push(nameSpace)
                    Ext.Loader.setPath(nameSpace, '')
                }
                Modules.requires.push(data[i].controller)
            }   

            Ext.require('Desktop.App', function() {
                Core.Ajax.request({
                    url: 'User.getUserInfo',
                    succ: function(data){
                        Sess.userName = data.login
                        Sess.states = data.sets
                        Sess.superuser = !!data.superuser
                        Sess.userData = data;
                        if(!Sess.superuser && data.group && data.group.modelAccess) 
                            Sess.modelAccess = data.group.modelAccess
                        else
                            Sess.modelAccess = {}
                        myDesktopApp = new Desktop.App({
                            desktopClassName: (data.group && data.group.desktopClassName? data.group.desktopClassName:null),
                            autorunStr: (data.group && data.group.autorun? data.group.autorun:""),
                            onDesktopReady: function() {
                                //document.body.removeChild(GlobalLoadingMask)
                                Ext.create('Ext.ux.desktop.HashProccessor').init(myDesktopApp)
                            }
                        });
                        
                        Ext.create('Ext.ux.desktop.HotkeyProccessor').init(myDesktopApp)
                    }
                })                    
            })
                         
        }, callback: function(a1, a2, a3) {
            if(a3.status == 401) {
                location = 'login.html' + (CommandLine? '#' + CommandLine:'');    
            }
        }
    })    
});



Sess = { 
            
    url: function(url, noslash) {            
        var id = localStorage.getItem('uid') || 0
            ,token = localStorage.getItem('token') || 0;
        
        if(url.charAt(0) == '/') return url + (noslash? '':'/') + '?id='+id+'&token='+token;
        
        return '/Admin.'+url+'/?id='+id+'&token='+token;
    },
    userName: '',
    userIconCls: 'user',
    loaded: {},
    makeGuid: function() {
        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                     .toString(16)
                     .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    },
    states: {},
    getState: function(winId) {
        if(Sess.states && Sess.states[winId]) return  Sess.states[winId]
        return null
    },
    
    setState: function(winId, sets, cb) {
        if(!Sess.states || Ext.isArray(Sess.states)) Sess.states = {}
        if(!Sess.states[winId]) Sess.states[winId] = {}
        for(var i in sets) {
            Sess.states[winId][i] = sets[i]
        }
        Core.Ajax.request({
            url: 'User.setUserSets',
            jsonData: Sess.states,
            succ: cb
        })
        
    }
}

