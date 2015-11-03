Ext.define('Core.Ajax', {
    extend: 'Ext.data.Connection',
    
    constructor: function() {
        var me = this;
        
        this.method = 'POST'
        this.callParent.apply(me,arguments);
        this.on("requestcomplete",me.onRequestComplete,me);
    }
    
    ,request: function() {
        
       
        
        arguments[0].url = Sess.url(arguments[0].url);
        if(!!arguments[0].jsonData) {
            if(!arguments[0].params) arguments[0].params = {}
            arguments[0].params.jsonData = JSON.stringify(arguments[0].jsonData)
            arguments[0].jsonData = null    
        }
        //arguments[0].method = 'POST'
        this.callParent(arguments);
    }
    
    ,uploadFiles: function(files, url, success) {
        var me = this,
            size = 0,
            curpos = 0,
            out = [];
        
        for(var i=0;i<files.length;i++) {
            if(files[i].size) size += files[i].size;
            else if(files[i].fileSize) {
                size += files[i].fileSize;
                files[i].size = files[i].fileSize
            }
        }
        
        var func = function(i) {
            
            var noShowmess, noClose, name
            
            if(files.length == 1) {
                noShowmess = false
                noClose = false
            } else
            if(i == (files.length-1)) {
                noShowmess = true
                noClose = false
            } else
            if(i == 0) {
                noShowmess = false
                noClose = true
            } else {
                noShowmess = true
                noClose = true
            }
            
            
            if(files[i].name!=null) name=files[i].name;
            else if(files[i].fileName!=null) name=files[i].fileName;
      
            me.upload(files[i], url+encodeURIComponent(name)+'/', function(data) {
               out.push(data.response) 
                             
               if(noClose) {
                   curpos += files[i].size
                   func(i+1)
               } else {
                   if(!!success) success(out)
               }
            }, size, curpos, noShowmess, noClose)    
        }
        
        func(0)
    }
    
    ,upload: function(file, url, success, size, curpos, noShowmess, noClose, progressLog) {
        url = Sess.url(url)
        
        if(progressLog) {
            
            url += (url.indexOf('?') == -1? '?':'&') + 'progressLog=' + progressLog    
        }
        
        if(!noShowmess) {
            Ext.MessageBox.show({
                 title: D.t('Wait'),
                 msg: D.t('Uploading file(s)...'),
                 progressText: D.t('Initialization...'),
    	         width:300,
    	         progress:true,
    	         closable:false
    	    });
        }
        
        var xhr = new XMLHttpRequest();     
        
        var name, showProg = true;
        
        if(!size) {
            if(file.size!=null) size=file.size;
            else if(file.fileSize!=null) size=file.fileSize;
        }
        
        if(!curpos) curpos = 0
        
        if(file.name!=null) name=file.name;
        else if(file.fileName!=null) name=file.fileName;
        
        
        var procInterval,
            dataPrepare = function() {
            Ext.MessageBox.updateProgress(0, D.t('Data being processed...'));
            if(!progressLog) {
                var ii=0, log = true;
                procInterval = setInterval(function() {
                    if(log) {
                        ii++;
                        if(ii>=100) log = false
                    } else {
                        ii--;
                        if(ii<=0) log = true
                    } 
                    Ext.MessageBox.updateProgress(ii/100, D.t('Data being processed...'));
                }, 20)
            }
        }        
        
        xhr.onprogress=function(e) {
            if(!showProg) return;
            
            var j=(e.position+curpos)/size,
                prc = Math.round(100*j)
            Ext.MessageBox.updateProgress(j, prc+'% ('+name+')');
            
            if(prc >=100) {
                dataPrepare()
                showProg = false
            }
            
        }
        
        xhr.upload.addEventListener("progress", function(e){ 
            if (showProg && e.lengthComputable) {		 
                var j=(e.loaded+curpos)/size,
                    prc = Math.round(100*j);
                Ext.MessageBox.updateProgress(j, prc+'% ('+name+')');
                if(prc >=100) {
                    dataPrepare()
                    showProg = false
                }
            }
        },false);	
        
        xhr.onload = function(e){	
            if(procInterval) clearInterval(procInterval)
            if(!showProg) showProg = true
            if(success!=null) {
                var o = {}
                try {
                    o = Ext.decode(e.currentTarget.responseText);
                } catch(e) {}
                success(o);
            }
            if(!noClose) {
                Ext.MessageBox.hide();
            }
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader("yode-action", "upload");
        xhr.send(file);
    }
    
    ,onRequestComplete: function(conn, response, options) {
        var o, me = this;
        try {
            o = Ext.decode(response.responseText);
        } catch(e) {o = null}
        if(o) {
            if(o.response) {
                if(!!options.succ) {
                    options.succ(o.response);
                }
            } else {                
                var data
                if(o.error) data = o.error
                
                if(!!options.faul) {
                    options.faul(data);
                } else me.ErrorMess(data)
            }
        } else {
             me.ErrorMess()
        }
        
    }
    
    ,ErrorMess: function(data) {
        var mess = 'Undefined server error';
        if(!!data) {
            if(!!data.code && data.code==401) {
                // if autarisation is error, jamp to login   
                location = '/admin.controller:login/';
                return false;
            }
            if(!!data.mess) mess = data.mess;
        }
        Ext.Msg.alert('Error!', mess);        
    }
})

Core.Ajax = Ext.create('Core.Ajax')