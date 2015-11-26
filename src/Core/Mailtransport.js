var nodemailer = require("nodemailer")

Ext.define("Core.Mailtransport",{
    
    type: null,
    server: null,
    mailer: null,
    
    constructor: function(cfg) {
        this.type = cfg.type
        this.server = cfg.server
        this.mailer = nodemailer.createTransport(cfg.type, cfg.server);    
    }
    
    ,sendMail: function(data, cb) {
        if(!data.to) {
            cb()
            return;
        }
        var me = this, emails = []
        
        if(Ext.isString(data.to))
            emails = data.to.replace(/;/g, ',').replace(/\s/g, '').split(',')
        else
            data.to.each(function(e) {emails.push(e)})
        var f = function(i) {
            if(i>=emails.length) {
                cb()
                return;
            }
            data.to = emails[i];
            if(me.isEmail(data.to)) {
                me.mailer.sendMail(data, function(e,d) {
                    f(i+1)    
                })
            } else {
                f(i+1)    
            }
        }
        f(0)
    }
    
    ,isEmail: function(str) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str)    
    }
    
})
