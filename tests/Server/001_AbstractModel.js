
var res = {},
    cls = Ext.create('Core.AbstractModel', {
        config: ProjectServ.config,
        src: ProjectServ.sources
    });

describe("Core.AbstractModel", function() { 
    
    describe("buildFullClassName", function() {
        it("this.buildFullClassName('Test1.test2.test3', '')", function () {
            assert.deepEqual(cls.buildFullClassName('Test1.test2.test3', 'view'), [ 'Test1.test2', 'test3' ]);            
        });
        it("this.buildFullClassName('.test', '')", function () {
            assert.deepEqual(cls.buildFullClassName('.test', 'view'), [ 'Core', 'test' ]);            
        })
    })
    describe("getPathFromClassName", function() {
        it("this.getPathFromClassName('Test1.test2.test3')", function () {
            assert.deepEqual(cls.getPathFromClassName('Test1.test2.test3'), 'Test1.js/test2/test3');            
        });
        it("this.getPathFromClassName('.test3')", function () {
            assert.deepEqual(cls.getPathFromClassName('.test3'), '.js/test3');            
        });
    })
    describe("checkAuthorization", function() {
        it("this.checkAuthorization({token: '123', id:'56044399377be0305f8b4567'}, cb)", function (done) {
            var token = '123', id = '56044399377be0305f8b4567'
            cls.src.mem.set(token, id,  function(e, rr){               
                cls.checkAuthorization({token: token, id:id}, function(res) {
                    cls.src.db.fieldTypes.ObjectID.StringToValue(id, function(r) {
                        assert.deepEqual(res, r);
                        done();
                    })
                })
            }, 100);
            //assert.deepEqual(cls.getPathFromClassName('Test1.test2.test3'), 'Test1.js/test2/test3');            
        });

    })
});