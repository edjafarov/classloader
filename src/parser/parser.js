var emitter = new(require('events').EventEmitter)();
module.exports = Object.create(emitter, {
    c: {
        value: {
            UNDEFINED: "undefined",
            FUNCTION: "function",
            OBJECT: "object",
            METHOD: "method",
            INNER_METHOD: "inner_method",
            INNER_FUNCTION: "inner_function",
            PROTOTYPED: "prototyped",
            STATIC: "static"
        }
    },
    r: {
        value: {
            FUNCTION: "function\\s*([\\w_]*)\\s*\\(([^\\)]*?)\\)\\s*\\{$",
            PROTOTYPE: "\\.prototype\\.(\\w+)\\s*=\\s*",
            SOME: "\\s(\\w+)",
            LOCAL: "\\sthis\\.(\\w+)\\s*=\\s*",
            OBJECT: "\\s*[=:]\\s*{$",
            ASSIGNED_TO: "[\\s\\.](\\w+)\\s*=\\s*"
        }
    },
    meta: {
        value: {},
        writable: true
    },
    scopes: {
        value: [],
        writable: true
    },
    processors: {
        value: [
        require("./processors/functionProcessor.js")//, 
//        require("./processors/prototypeFunctionProcessor.js"), 
//        require("./processors/inConstructorFunctionProcessor.js"), 
//        require("./processors/functionArgumentsParser.js"), 
//        require("./processors/annotationFunctionProcessor.js"), 
//        require("./processors/inheritanceProcessor.js")
        ],
        writable: true
    },
    parse: {
        value: function(src) {
            this.scopes = this.parseScopes(src); 
            this.meta.source = src;
            this.processScopes();
            this.meta.scopes = this.scopes;
            return this.meta;
        }
    },
    parseScopes: {
        value: require("./scopesParser.js")
    },
    pushProcessor: {
        value: function(processor) {
            this.processors.push(processor);
        }
    },
    processScopes: {
        value: function() {
            var self = this;
            this.processors.forEach(
            function(processor) {
                self.scopes.forEach(

                function(s, i, ss) {
                    processor(s, i, ss, self);
                });
            });
        }
    }
});