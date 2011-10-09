var jsparser = require("uglify-js").parser;
var traverse = require("traverse");
var util = require("util");
var emitter = new(require('events').EventEmitter)();

function walkUpToFind(what, current) {
    while (current.parent.node[0] != 'toplevel') {
        if (current.node[0].name == what) return current;
        current = current.parent;
    }
    return false;
}
module.exports = Object.create(emitter, {
    getMeta: {
        value: function(src) {
            var ast = jsparser.parse(src, false, true);
            //META all meta info here
            var MAP = {}
            traverse(ast).forEach(function(node) {
                switch (node) {
                case "defun":
                    {
                        //this guys will be able to become Classes
                        var newFunction = {
                            leafId: this.parent,
                            name: this.parent.parent.node[1],
                            arguments: this.parent.parent.node[2],
                            type: "function"
                        }
                        MAP[newFunction.name] = newFunction; //TODO: maybe scope overlap
                    };
                case "this":
                    {
                        if (this.parent.node[0] == "name") {
                            //if we stumble on this.{something} that means it is a class and it have property
                            var property = {
                                name: this.parent.parent.node[2]
                            };
                            var assign = walkUpToFind("assign", this);
                            if (assign) { //check comments before property
                                if (assign.node[0].start.comments_before && assign.node[0].start.comments_before.length > 0) {
                                    property.comments = assign.node[0].start.comments_before;
                                }
                                property.type = assign.node[3][0].name;
                            }
                            var classDeclaration = walkUpToFind("defun", this); //TODO: also need to check function
                            if (classDeclaration) {
                                var className = classDeclaration.node[1];
                                if (!MAP[className]) throw Error("we should have this function in MAP " + className);
                                MAP[className].type = "class";
                                if (!MAP[className].properties) MAP[className].properties = [];
                                MAP[className].properties.push(property);
                            }
                        }
                    };
                case "prototype":
                    {
                        if (this.parent.node[0] == "dot") { //every object have prototype but what I need have dot in parent
                            var className = this.parent.node[1][1];
                            var property = {
                                name: this.parent.parent.node[2]
                            };
                            var assign = walkUpToFind("assign", this);
                            if (assign) { //check comments before property
                                if (assign.node[0].start.comments_before && assign.node[0].start.comments_before.length > 0) {
                                    property.comments = assign.node[0].start.comments_before;
                                }
                                property.type = assign.node[3][0].name;
                            }
                            if (!MAP[className]) throw Error("we should have this function in MAP " + className);
                            MAP[className].type = "class";
                            if (!MAP[className].properties) MAP[className].properties = [];
                            MAP[className].properties.push(property);
                        }
                    }
                }
            });
            return MAP;
        }
    }
})