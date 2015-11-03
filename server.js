var Yode = require("janusjs");

var config = {
    defaults: {
        port: {port},
        staticDir: 'static',
        protectedDir: 'protected'
    },
    projects: [{
        module: __dirname + '/{projectsDir}/{projectDir}',
        serverName: '{serverName}',
        nameSpace: '{nameSpace}'
    }]
}

Yode.serve(config)