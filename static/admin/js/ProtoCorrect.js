Array.prototype.sortRand = function() {
    this.sort(function() {
        return (Math.round(Math.random())-0.5); 
    })    
}



Array.prototype.runEach = function(callback) {
    var ar = this
        ,i = 0
        
    var goto = function(x) {
        i += x-1    
    }
        
    var func = function() {
        if(i >= ar.length || !ar[i]) {
            if(!!callback) callback.apply(null, arguments)
            return;
        }        
        var args = []
        for(var j=0;j<arguments.length;j++) args.push(arguments[j])
        
        args.push(func)
        args.push(goto)
    
        ar[i++].apply(null, args)
        
    }    
    func()  
}
        
JSON.stringifyFormat = function(obj) {
    var str = JSON.stringify(obj)
        ,i = 0
        ,out = ""
        ,n = 0
        ,q = false
        ,j
        ,l = str.length;
        
    while(i<l) {
        if(str.charAt(i) == '"') {
            out += '"'
            q = !q
        } else
        if(str.charAt(i) == '{') {
            out += '{\n';
            n++;
            for(j=0;j<n;j++) out += '    '
        } else
        if(str.charAt(i) == '}') {
            out += '\n'
            n--;
            for(j=0;j<n;j++) out += '    '
            out += '}\n';
            for(j=0;j<n;j++) out += '    '
        } else 
        if(str.charAt(i) == ',' && !q) {
            out += ',\n';
            for(j=0;j<n;j++) out += '    '
        } else
            out += str.charAt(i);
        i++;
    }
    return out;
}

Function.prototype.nextCall = function() {
    if(this.i === undefined) this.i = 0;
    this.i++;
    if(this.i === 50) {
        var a = arguments, me = this;
        this.i = 0;
        setImmediate(function() {
            me.apply(me, a)
        })
    } else {
        this.apply(this, arguments)
    }
}