var fs = require('fs');
var config = require(process.cwd() + '/config.json');

exports.help = {
    format: 'ytools mk [moduleName] [keys]',
    ex: 'ytools mk MyModule -d moduledir -i myIcon -n "Module title"',
    keys: {
        '-d': 'directory in the modules catalogue',
        '-i': 'icon css class name',
        '-n': 'human name for the module',
        '-t': 'template name, variants: blank, tab, menu (default: blank)'
    }
}


var tplType = 'blank'
var Title = ''
var Icon = 'dirs'

var prepFile = function(src, name, prnt) {
    return src.replace(/{{Name}}/g, name)
            .replace(/{{parent}}/g, prnt)
            .replace(/{{nameSpace}}/g, config.nameSpace)   
            .replace(/{{Title}}/g, Title)
            .replace(/{{Icon}}/g, Icon)
}

var mkfile = function(tpl, file, name, prnt, cb) {
    fs.readFile(__dirname + '/tpl/' + tplType + '/' + tpl + '.js', function(e,c) {
        if(e) {
            cb()
        } else {
            fs.writeFile(file, prepFile(c.toString(), name, prnt), function() {
                cb()    
            })    
        }
    })
}

exports.run = function(params, dirs) {
    
    var prnt = dirs.d || params[0].toLowerCase() 
    
    if(dirs.t) tplType = dirs.t
    if(dirs.i) Icon = dirs.i
    if(dirs.n) Title = dirs.n
    
    var dir = 'static/admin/modules/' + prnt;
    
    [
        function(next) {
            fs.mkdir(dir, function() {
                next()    
            })
        }
        ,function(next) {
            fs.mkdir(dir + '/controller', function() {
                next()    
            })
        }
        ,function(next) {
            fs.mkdir(dir + '/model', function() {
                next()    
            })
        }
        ,function(next) {
            fs.mkdir(dir + '/view', function() {
                next()    
            })
        }
        ,function(next) {
            mkfile('controller', dir + '/controller/' + params[0] + '.js', params[0], prnt, next)
        }
        ,function(next) {
            mkfile('model', dir + '/model/' + params[0] + 'Model.js', params[0], prnt, next)
        }
        ,function(next) {
            mkfile('list', dir + '/view/' + params[0] + 'List.js', params[0], prnt, next)
        }
        ,function(next) {
            mkfile('form', dir + '/view/' + params[0] + 'Form.js', params[0], prnt, next)
        }
        ,function(next) {
            if(dirs.m) {
                mkfile('manifest', dir + '/manifest.json', params[0], prnt, next)
            } else next()
        }
        ,function() {
            console.log('Module ', params[0], ' created.');
        }
    ].runEach()
    
    
}