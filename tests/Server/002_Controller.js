require('http_codes')

var res = {},
    cls = Ext.create('Core.Controller', {
        config: {
            errorRedirect:  {404:'testLink'}   
        },
        src: {},
        response: {
            end: function(mess) {res.mess = mess},
            writeHead: function(code, text, header) {res.code = code; res.text = text; res.header = header;},
            
        }
    });

describe("Core.Controller", function() {
    
    describe("run", function() {
        it("Class.run('test') -> Class.$test()", function () {
            cls.$test = function() {return 3;}
            assert.equal(cls.run('test'),3);
        });
    })
    
    
    describe("error", function() {
        it("Error 500 (Number)", function () {
            cls.error(500)
            assert.deepEqual(res, { 
                code: 500,
                text: 'Internal Server Error',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: '' 
            });
        })
        it("Error {code: 500} (Object)", function () {
            cls.error(500)
            assert.deepEqual(res, { 
                code: 500,
                text: 'Internal Server Error',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: '' 
            });
        })
        it("Error redirect by config", function () {
            cls.error(404)
            assert.deepEqual(res, { code: 302,
              text: 'Found',
              header: { Location: 'testLink' },
              mess: undefined 
            });
        })
    })
    
    describe("end", function() {
        it("this.end(data)", function () {
            cls.end('test: 123')
            assert.deepEqual(res, {code: 200, text: 'OK', header: {}, mess: 'test: 123'});
        });
        it("this.end(data) with cookies", function () {
            
            cls.response.Cookie = {
                foo: 1,
                bar: 2
            }
            cls.end('test: 123')
            //console.log(res)
            assert.deepEqual(res, {code: 200, text: 'OK', header: { 'Set-Cookie': [ 'foo=1', 'bar=2' ] }, mess: 'test: 123'});
        });
    })
    
    describe("setCookie", function() {
        it("this.setCookie(key, value)", function () {
            cls.setCookie('test', 123)
            assert.equal(cls.response.Cookie.test, '123;');
        });
        
        it("this.setCookie(key, value, expdays)", function () {
            cls.setCookie('test', 123, 0)
            assert.equal(cls.response.Cookie.test, '123;');
        });
        
        it("this.setCookie(key, value, expdays, domain)", function () {
            cls.setCookie('test', 123, 0, 'my.domain')
            assert.equal(cls.response.Cookie.test, '123;domain=my.domain;');
        });
        
        it("this.setCookie(key, value, expdays, domain, path)", function () {
            cls.setCookie('test', 123, 0, 'my.domain', '/')
            assert.equal(cls.response.Cookie.test, '123;domain=my.domain;path=/;');
        });

    })
    
    describe("sendJSON", function() {
        it("this.sendJSON({}, 403)", function () {
            cls.sendJSON({}, 403)
            assert.deepEqual(res, {
                code: 403,
                text: 'Forbidden',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: ''
            });
        });
        it("this.sendJSON({test:123})", function () {
            cls.sendJSON({test:123})
            assert.deepEqual(res, {
                code: 200,
                text: 'OK',
                header: 
               { 'Set-Cookie': [ 'foo=1', 'bar=2', 'test=123;domain=my.domain;path=/;' ],
                 'Content-Type': 'application/json;utf-8',
                 'Content-Length': 25 },
                mess: '{"response":{"test":123}}'
            });
        });
    })
    
    describe("sendXML", function() {
        it("this.sendXML({}, 403)", function () {
            cls.sendXML({}, 403)
            assert.deepEqual(res, {
                code: 403,
                text: 'Forbidden',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: ''
            });
        });
        it("this.sendXML('<test>123</test>')", function () {
            cls.sendXML('<test>123</test>')
            assert.deepEqual(res, {
                code: 200,
                text: 'OK',
                header: 
               { 'Set-Cookie': [ 'foo=1', 'bar=2', 'test=123;domain=my.domain;path=/;' ],
                 'Content-Type': 'application/xml;utf-8',
                 'Content-Length': 16 },
                mess: '<test>123</test>'
            });
        });
        it("this.sendXML({test:123})", function () {
            cls.sendXML({test:123})
            assert.deepEqual(res, {
                code: 200,
                text: 'OK',
                header: 
               { 'Set-Cookie': [ 'foo=1', 'bar=2', 'test=123;domain=my.domain;path=/;' ],
                 'Content-Type': 'application/xml;utf-8',
                 'Content-Length': 16 },
                mess: '<test>123</test>'
            });
        });
    })
    
    describe("sendHTML", function() {
        it("this.sendHTML({}, 403)", function () {
            cls.sendHTML({}, 403)
            assert.deepEqual(res, {
                code: 403,
                text: 'Forbidden',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: ''
            });
        });
        it("this.sendHTML('<test>123</test>')", function () {
            cls.sendHTML('<test>123</test>')
            assert.deepEqual(res, {
                code: 200,
                text: 'OK',
                header: 
               { 'Set-Cookie': [ 'foo=1', 'bar=2', 'test=123;domain=my.domain;path=/;' ],
                 'Content-Type': 'text/html;charset=utf-8',
                 'Content-Length': 16 },
                mess: '<test>123</test>'
            });
        });
        it("this.sendHTML(123)", function () {
            cls.sendHTML(123)
            assert.deepEqual(res, {
                code: 200,
                text: 'OK',
                header: 
               { 'Set-Cookie': [ 'foo=1', 'bar=2', 'test=123;domain=my.domain;path=/;' ],
                 'Content-Type': 'text/html;charset=utf-8',
                 'Content-Length': 3 },
                mess: '123'
            });
        });
    })
    
    describe("buildFullClassName", function() {
        it("this.buildFullClassName('')", function () {
            cls.sendHTML({}, 403)
            assert.deepEqual(res, {
                code: 403,
                text: 'Forbidden',
                header: { 'Content-Type': 'text/html;charset=utf-8' },
                mess: ''
            });
        });
    })

});