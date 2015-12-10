require('proto_correct');

Ext = require("extjs-node");

Ext.BaseDir = __dirname + "/../";

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

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path'),
    chai = require('chai');
    
assert = chai.assert;
mocha = new Mocha();

exports.runTests = function(dir) {

    var files = fs.readdirSync(dir).filter(function(file){
        return file.substr(-3) === '.js';
    
    })
    
    files.sort()
    
    files.forEach(function(file){
        mocha.addFile(
            path.join(dir, file)
        );
    });
    mocha.run(function(failures){
      process.on('exit', function () {
        process.exit(failures);
      });
    });
}