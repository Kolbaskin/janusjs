var crypto = require('crypto')
    ,fs = require('fs')    
    ,easyimg = require('easyimage')

Ext.define('Admin.model.Files',{
    extend: "Core.AbstractModel"
    
    ,getImage: function(params, callback) {
        var me = this;
        var noImg = function() {
            fs.readFile(__dirname + '/image_icon.png', function(e, file) {
                callback(file,null, 'png')
            })
        };
        [   
            
            function(call) {
                me.src.db.fieldTypes.ObjectID.getValueToSave({}, params._id, null, null, null, function(_id) {
                    call(_id)    
                })
            }
            
            ,function(_id, call) {
                var fields = {mtime:1}
                fields[params.field] = 1;
                
                me.src.db.collection(params.collection).findOne({_id: _id}, fields, function(e,data) {
                    if(data && data[params.field]) {  
                        call(data[params.field], data.mtime )
                    } else {
                        noImg(null)    
                    }
                })
            }
            ,function(data, mtime, call) {
                
                if(params.num && Ext.isArray(data)) {
                    data = data[params.num]  
                    if(!data) {
                        noImg(null)
                        return;
                    }
                }
                
                if(params.size == 'main') {
                    if(data['preview'] && data['preview'].buffer) call(data['preview'], mtime)
                    else if(data['img'] && data['img'].buffer) call(data['img'], mtime)
                    else noImg(null)
                } else
                if(data[params.size] && data[params.size].buffer) call(data[params.size], mtime)
                else noImg(null)
            }
            ,function(data, mtime) {
                callback(data.buffer, mtime, 'jpeg')    
            }
            
        ].runEach()    
    }
    
    ,createImage: function(path, sizes, callback) {
        var w1
            ,h1
            ,w2
            ,h2
            ,conf1 = {
                src:path, 
                dst:path,
                x:0, 
                y:0
            }
            ,conf2 = {
                src:path, 
                dst:path+'_small',
                x:0, 
                y:0
            }

        var resize = function() {    


            easyimg.thumbnail(conf1, function(err, image) {
                    if (err) {
                        callback(null, {code: 500});
                        return;
                    } 
                    if(conf2.width && conf2.height) {
                        easyimg.thumbnail(conf2, function(err, image_small) {
                            if (err) {
                                callback(null, {code: 500});
                                return;
                            }
                            callback({img: image, img_s:image_small});
                        });
                    } else {
                        callback({img: null , img_s:image});
                    }
            	}
            );
        }
        
        if(sizes) {
            sizes = sizes.split('x')
            if(sizes.length == 4) {        
                if(sizes[0]) {w2 = parseInt(sizes[0]);if(isNaN(w2)) w2=null;}
                if(sizes[1]) {h2 = parseInt(sizes[1]);if(isNaN(h2)) h2=null;}
                if(sizes[2]) {w1 = parseInt(sizes[2]);if(isNaN(w1)) w1=null;}
                if(sizes[3]) {h1 = parseInt(sizes[3]);if(isNaN(h1)) h1=null;}
            } else {
                if(sizes[0]) {w1 = parseInt(sizes[0]);if(isNaN(w1)) w1=null;}
                if(sizes[1]) {h1 = parseInt(sizes[1]);if(isNaN(h1)) h1=null;}
            }
        } else {
            w1 = 456
            h1 = 342
            w2 = 150
            h2 = 150    
        }
    
        var getSizes = function(w,h, callback) {
            easyimg.info(path, function(e, info) {
                if(info && info.width) {
                    if(!h) {
                        h = parseInt(info.height * w / info.width)    
                    } else if(!w) {
                        w = parseInt(info.width * h / info.height)
                    }
                    if(w > info.width) w = info.width
                    if(h > info.height) h = info.height
                }
                callback(w,h)
            })        
        }
    
        getSizes(w1, h1, function(w,h) {
            conf1.width = w
            conf1.height = h
    
            if(w2 || h2) {
                getSizes(w2, h2, function(w,h) {
    
                    conf2.width = w
                    conf2.height = h
                    resize()
                })
            } else {
                resize()
            }
        })
    }

    ,uploadImage: function(params, callback) {
        var me = this
            ,token
            ,dir = __dirname + '/../../../static/tmp/';
        
        [
            function(call) {
                
                
                if(params.tmpName) {
                    token = params.tmpName
                    
                    if(params.dir) {
                        fs.rename(dir + token, me.config.staticDir + '/' + params.dir + '/' + token, function(err) {
                            if(err)
                                callback(null)
                            else
                                call(me.config.staticDir + '/' + params.dir + '/' + token) 
                        })    
                    } else
                        call(dir + '/' + params.tmpName)
                } else {
                    
                    if(params.dir) 
                        dir = me.config.staticDir + '/' + params.dir                       
                                
                    crypto.randomBytes(32, function(ex, buf) {
                        token = buf.toString('hex');
                        var path = dir + '/' + token  
                        fs.writeFile(path, params.data, function (e) {
                            if (e) 
                                callback(null)
                            else 
                                call(path)                                
                        })
                    })
                }
            }

            ,function(path, call) {
                me.createImage(path, params.sizes, function(imgs, e) {
                    if (e) 
                        callback(null)
                    else {
                        imgs.img_s.name = token
  
                        callback(imgs.img_s);
                    }                        
                })    
            }
        ].runEach()
    }
    
    ,uploadFile: function(params, callback) {
        var me = this
            ,token;
        
        [
            function(call) {
                crypto.randomBytes(32, function(ex, buf) {
                    token = buf.toString('hex');
                    call(__dirname + '/../../../static/tmp/' + token)    
                })
            }
            ,function(path, call) {
                fs.writeFile(path, params.data, function (e) {
                    if (e) 
                        callback(null)
                    else 
                        call(path)                                
                })
            }
            ,function(path, call) {
                callback({name: token});
            }
            
            
        ].runEach()
    }
});