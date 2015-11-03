/* extjs6 test */

require('proto_correct');

Ext = require("extjs-node");

Ext.BaseDir = __dirname;

var Paths = {
    Core: Ext.BaseDir + '/src/Core',
    Database: Ext.BaseDir + '/src/Database',
    Admin: Ext.BaseDir + '/protected/Admin',
    Desktop: Ext.BaseDir + '/protected/Desktop'
}

Ext.Loader.setConfig({
    enabled: true,
    paths: Paths
});

/*/ Замер потребления памяти
setInterval(function() {
   console.log(Math.round(process.memoryUsage().rss/1024/1024))
}, 1000)
//*/
exports.serve = function(conf, cb) {
    Ext.create('Core.Server', conf).serve(cb)
}
