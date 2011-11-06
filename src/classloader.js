var emitter = new(require('events').EventEmitter)();
var fs = require("fs");
var vm = require("vm");
var path = require("path");



var Class = Object.create(null, {
    fileName: {
        writable: true,
        enumerable: true,
        configurable: true
    },
    meta: {
        writable: true,
        enumerable: true,
        configurable: true
    },
    source: {
        writable: true,
        enumerable: true,
        configurable: true
    },
    script: {
        writable: true,
        enumerable: true,
        configurable: true
    },
    dependancies: {
        writable: true,
        enumerable: true,
        configurable: true
    },
    context: {
        writable: true,
        enumerable: false,
        configurable: true
    },
    clas: {
        writable: true,
        enumerable: true,
        configurable: true
    }
})
// cache
var classes = {};
var ClassLoader = Object.create(emitter, {
    read: {
        value: function(filePath) {
            //already cached
            if (this.check(filePath)) return this.check(filePath);
            try {
                var source = fs.readFileSync(filePath).toString();
                var newClass = Object.create(Class);
                newClass.fileName = filePath;
                newClass.source = source;
                classes[filePath] = newClass;
                return newClass;
            }
            catch (e) {
                console.log("Probably file was not found while reading: " + e);
            }
            
        }
        //TODO: path variable should refer to some dir where all of them locate and probably read should try to find there. If lazyload on.
        //TODO: path normalizing/resolving so avoid duplicates of classes
    },
    check: {
        value: function(filePath) {
            return classes[filePath]?classes[filePath]:false;
        }
    },
    flush:{
        value: function(filePath){
            delete classes[filePath];
            }
        },
    compile: {
        value: function(fileName) {
            var cl = this.read(fileName);
            if (cl.script) return cl;
            this.emit("compile", cl);
            var script = vm.createScript(cl.source, cl.fileName);
            cl.script = script;
            return cl;
        }
        
    }
    ,
    run: {
        value: function(fileName) {
            var cl = this.compile(fileName);
            if (cl.clas) return cl;
            if (!cl.context){
                var dirName = path.dirname(fileName);
                cl.context = {};
                for(key in global){
                    cl.context[key] = global[key];
                }
                cl.context.require = require;
                cl.context.global = cl.context;
                cl.context.__filename = fileName;
                cl.context.__dirname = dirName;                
                var moduleConstr = module.constructor;
                var resolvedFilename = moduleConstr._resolveFilename(fileName)[0];
                var newmodule = new moduleConstr(resolvedFilename, module);
                cl.context.exports = newmodule.exports;
                cl.context.module = newmodule;
                cl.context.module.filename = resolvedFilename;
                cl.context.module.paths = moduleConstr._nodeModulePaths(path.dirname(fileName));
                
                cl.context.root = root; 
                this.emit("run", cl);
                cl.script.runInNewContext(cl.context);    
            }
        
            return cl;
        }
    }
    ,
    getClass:{
        value: function(fileName){
            var cl = this.run(fileName);
            
            if(!checkExports(cl.context.exports) && !checkExports(cl.context.module.exports)){
                //throw Error("no exports to return from: " + fileName);
                return false;
            }
            if(checkExports(cl.context.exports))return cl.context.exports;
            if(checkExports(cl.context.module.exports))return cl.context.module.exports;
        }    
    },
    parser:{
        value: require("./parser/metaBuilder.js")
    }
});

ClassLoader.on("compile",function(cl){
        cl.meta = this.parser.getMeta(cl.source);
    });

function checkExports(exp){
    if(typeof(exp)=="object"){
        return Object.keys(exp).length > 0;
    }else{
        return exp != null;
    }
}

/* TODO: this could be interesting for auto resolving dependancies
var vm=require("vm");

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    console.error("There was an internal error in Node's debugger. " +
        'Please report this bug.');
    console.error(err.message);
    console.error(err.stack);
});


vm.createScript("var k=goo").runInNewContext({});
*/



module.exports=ClassLoader;