var fs = require('fs'), 
    cls = Ext.create('Core.ProjectServer', {
        "debug": true,
        "mongo": {
            "db_name": "test",
            "port": 27017,
            "host": "localhost",
            "user": "",
            "pass": ""
        },
        "memcache": {
            "host": "localhost",
            "port": 11211
        },
        "token": {
            "lifetime": 86400,
            "len": 32,
            "sessPassLen": 3
        }
    });

ProjectServ = cls;


describe("Core.ProjectServer", function() { 
    
    describe("init", function() {
        it("this.init()", function (done) {            
            cls.init(function() {
                setTimeout(function() {
                    //console.log(cls.sources) 
                    assert.isFunction(cls.sources.db.collection)
                    assert.isObject(cls.sources.db.fieldTypes)
                    assert.isObject(cls.sources.mem.conn)
                    done()
                }, 1000)
            })            
        });
    })
    
    describe("checkMimeHeader", function() {
        it("this.checkMimeHeader('/test.htc')", function () {            
            assert.equal(cls.checkMimeHeader('/test.htc'), 'text/x-component')            
        });
    })
    
    describe("getInputData", function() {
        it("this.getInputData(req, res) GET", function (done) {            
            cls.getInputData({
                url: '/Core.Test.test/?a=1&b=2',
                method: 'GET',
                headers: {}
            },{
                end: function(data) {
                    assert.equal(data, '{"response":{"gpc":{"a":"1","b":"2"},"cookies":{}}}')
                    done()                    
                },
                writeHead: function(code, text, header) {}
            })           
        });
        
        it("this.getInputData(req, res) POST", function (done) { 
            cls.getInputData({
                url: '/Core.Test.test/?a=1&b=2',
                method: 'POST',
                headers: {cookie: "c=3;"},
                on: function(act, cb) {
                    if(act == 'end') cb()
                    if(act == 'data') cb('d=5&f=6')
                }
            },{
                
                end: function(data) {
                    assert.equal(data, '{"response":{"gpc":{"a":"1","b":"2","d":"5","f":"6","c":"3","":""},"fullData":[100,61,53,38,102,61,54],"cookies":{"c":"3","":""}}}')
                    done()                    
                },
                writeHead: function(code, text, header) {}
            })
        });
        
        it("this.getInputData(req, res) GET with COOKIE", function (done) {            
            cls.getInputData({
                url: '/Core.Test.test/?a=1&b=2',
                method: 'GET',
                headers: {cookie: "c=3;"}
            },{
                end: function(data) {
                    assert.equal(data, '{"response":{"gpc":{"a":"1","b":"2","c":"3","":""},"cookies":{"c":"3","":""}}}')
                    done()                    
                },
                writeHead: function(code, text, header) {}
            })
        });
        
        it("this.getInputData(req, res) POST yode-action:upload", function (done) { 
            cls.getInputData({
                url: '/Core.Test.test/?a=1&b=2',
                method: 'POST',
                headers: {'yode-action': 'upload'},
                on: function(act, cb) {
                    if(act == 'end') cb()
                    if(act == 'data') cb('test')
                }
            },{
                
                end: function(data) {
                    data = JSON.parse(data)
                    assert.isDefined(data.response.tmpName)
                    var s = fs.readFileSync(__dirname + '/../../static/tmp/'+data.response.tmpName)
                    assert.equal(s.toString(),'test');
                    done() 
                    setTimeout(function() {fs.unlinkSync(__dirname + '/../../static/tmp/'+data.response.tmpName)}, 500)
                },
                writeHead: function(code, text, header) {}
            })
        });

    });
    
    
    describe("isExistsModule", function() {
        it("this.isExistsModule('Core.test') not exists", function (done) {            
            cls.isExistsModule('Core.test', function(res) {
                assert.isFalse(res)    
                done()
            })
        });
        it("this.isExistsModule('Core.ProjectServer') exists", function (done) {            
            cls.isExistsModule('Core.ProjectServer', function(res) {
                assert.isTrue(res)   
                done()
            })
        });
    });
    
    

    
});
