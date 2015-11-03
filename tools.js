require("proto_correct");
console.log('Yode command line v0.0.1')

if(process.argv[2]) {
    var params = [], dirs = {}
    for(var i = 3;i<process.argv.length;i++) {
        if(process.argv[i].charAt(0) == '-') {
            dirs[process.argv[i].substr(1)] =  process.argv[i+1] || 1;
            i++;
        } else 
            params.push(process.argv[i])
    }
    
    if(dirs.h) {
        
        var help = require(__dirname + '/commands/' + process.argv[2]).help;  
        
        if(help) {
            if(help.format) console.log('Format: ', help.format)
            if(help.ex) console.log('Example: ', help.ex)
            if(help.keys) {
                console.log('Keys:')
                for(var i in help.keys)
                    console.log(i,'    ', help.keys[i])
            }
        }
        
    } else {
        require(__dirname + '/commands/' + process.argv[2]).run(params, dirs)
    }
}