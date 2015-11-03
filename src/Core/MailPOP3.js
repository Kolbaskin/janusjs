var POP3Client = require("poplib");
var MailParser = require("mailparser").MailParser;

Ext.define("Core.MailPOP3",{
    
    constructor: function(cfg) {
        
        var me = this;
        this.client = new POP3Client(cfg.port, cfg.host, (cfg.params || {
            tlserrs: false,
            enabletls: cfg.ssl,
            debug: false
        })); 
        this.client.on("error", function(err) {
            if (err.errno === 111) console.log("Unable to connect to server");
            else console.log("Server error occurred");
            console.log(err);
            if(!!cfg.callback) cfg.callback(false)
        });
        
        this.client.on("connect", function() {
            if(!!cfg.callback) cfg.callback(true)
        });
    }
    
    ,readMailBox: function(user, pass, rawCb, cb) {
        var me = this;
        this.client.on("login", function(status, rawdata) {
            if (status) {
                me.list(rawCb, cb)
            } else {
                cb(false)
                me.client.quit();
            }
        });
        
        this.client.login(user, pass);
    }
    
    ,list: function(rawCb, cb) {
        var me = this, cnt, currentmsg = 0, totalmsgcount;
        me.client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
            if (status === false) {
                me.client.quit();
            } else {
                if (msgcount > 0) {
                    totalmsgcount = msgcount; 
                    currentmsg = 1;
                    me.client.retr(1);
                }
                else {
                    me.client.quit();
                }
        
            }
        });
        me.client.on("retr", function(status, msgnumber, data, rawdata) {
            if (status === true) {

                currentmsg += 1;
               
                me.client.dele(msgnumber);

                me.prepareData(rawdata, function(data) {
                    rawCb(data, function() {
                        me.client.dele(msgnumber);
                    })
                })
            } else {
                me.client.rset();
            }
        });
        me.client.on("dele", function(status, msgnumber, data, rawdata) {
            if (status === true) {
        		if (currentmsg > totalmsgcount)
        			me.client.quit();
        		else
        			me.client.retr(currentmsg);
        	} else {
        		me.client.rset();
        
        	}
        });
        
        me.client.on("rset", function(status,rawdata) {
            me.client.quit();
        });
        
        me.client.on("quit", function(status, rawdata) {
            cb()        
        });
        me.client.list();
    }
    
    ,prepareData: function(data, cb) {
        var mailparser = new MailParser({
            //streamAttachments: true,
            unescapeSMTP: true,
            defaultCharset: 'utf-8',
            showAttachmentLinks:true    
        });
        mailparser.on("end", function(mail_object){         
            cb(mail_object); 
        });
        mailparser.write(data);
        mailparser.end();
    }
})
