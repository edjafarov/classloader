var jsparser = require("uglify-js").parser;
var traverse = require("traverse");
var util = require("util");
var emitter = new(require('events').EventEmitter)();




var Item = Object.create(null,{
    context : {
        writable: true,
        enumerable: true,
        configurable: true //variable,function,method,property,class
    },
    type : {
        writable: true,
        enumerable: true,
        configurable: true //variable,function,method,property,class
    },
    properties :{
        writable: true,
        enumerable: true, 
        configurable: true
    },
    astLeaf : {
        writable: true,
        enumerable: false, //show hide for debug
        configurable: true
    },
    name : {
        writable: true,
        enumerable: true,
        configurable: true
    },
    arguments : {
        writable: true,
        enumerable: true,
        configurable: true
    },
    comments : {
        value: []
    },
    Super : {
        value : undefined //reference to superclass/method
    }

});



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

            //TODO: this kinda wierd. Need to understand clonong of objects better to proceed
            var META = {
                globals : {},
                functions : {},
                classes : {},
                methods :{}
            };


            var ast = jsparser.parse(src, false, true);
            traverse(ast).forEach(function(node) {
                switch (node) {
                case "defun":
                    {
                        //this guys will be able to become Classes
                        var newFunction = Object.create(Item);
                        newFunction.name = this.parent.parent.node[1];
                        newFunction.arguments = this.parent.parent.node[2];
                        newFunction.type = "function";
                        newFunction.astLeaf = this.parent;
                        if(this.parent.node.start.comments_before.length > 0 ){
                            newFunction.comments = this.parent.node.start.comments_before;
                            newFunction.annotations = parseAnnotations(newFunction.comments);
                        }


                        // check if global
                        if(this.parent.parent.parent.parent.node[0]=='toplevel'){
                            META.globals[newFunction.name] = newFunction;
                        }

                        META.functions[newFunction.name] = newFunction; //could be overlapped
                    }
                case "var":
                    {
                        var newItem = Object.create(Item);
                        if(this.parent.parent.node[1] instanceof Array){
                           if(this.parent.parent.node[1][0][1][0].name == "function"){
                               newItem.name = this.parent.parent.node[1][0][0];
                               newItem.arguments = this.parent.parent.node[1][0][1][2];
                               newItem.type = "function";
                               newItem.astLeaf = this.parent.parent;
                               META.functions[newItem.name] = newItem;

                               if(this.parent.node.start.comments_before.length > 0 ){
                                   newItem.comments = this.parent.node.start.comments_before;
                                   newItem.annotations = parseAnnotations(newItem.comments);
                               }

                               //TODO: check if global
                                if(this.parent.parent.parent.parent.node[0]=='toplevel'){
                                    META.globals[newItem.name] = newItem;
                                }                               
                            }
                        }

                        //this guys will be able to become Classes


                    }
                case "this":
                    {
                        var newItem = Object.create(Item);
                        if (this.parent.node[0] == "name") {
                            //if we stumble on this.{something} that means it is a class and it have property
                            var property = {
                                name: this.parent.parent.node[2]
                            };
                            var assign = walkUpToFind("assign", this);
                            if (assign) { //check comments before property
                                if (assign.node[0].start.comments_before && assign.node[0].start.comments_before.length > 0) {
                                    property.comments = assign.node[0].start.comments_before;
                                    property.annotations = parseAnnotations(property.comments);
                                }
                                property.type = assign.node[3][0].name;
                                if(property.type == "function"){
                                    property.arguments = this.parent.parent.node[3];
                                }
                            }
                            
                            var classDeclaration = walkUpToFind("defun", this); //TODO: also need to check function
                            if (classDeclaration) {
                                var className = classDeclaration.node[1];
                                if (!META.functions[className] && !META.classes[className]) throw Error("we should have this function in MAP " + className);
                                META.functions[className].type = "class";
                                if (!META.functions[className].properties) META.functions[className].properties = [];
                                property.classRef = className;
                                META.methods[property.name] = property;
                                META.functions[className].properties.push(property);
                                if (!META.classes[className]) META.classes[className] = META.functions[className];
                            }
                        }
                    }
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
                                    property.annotations = parseAnnotations(property.comments);
                                }
                                property.type = assign.node[3][0].name;
                                if(property.type == "function"){
                                    property.arguments = assign.node[3][2];
                                }
                            }
                            if (!META.functions[className]) throw Error("we should have this function in META " + className);
                            META.functions[className].type = "class";
                            if (!META.functions[className].properties) META.functions[className].properties = [];
                            property.classRef = className;
                            META.methods[property.name] = property;
                            META.functions[className].properties.push(property);
                            if (!META.classes[className]) META.classes[className] = META.functions[className];
                        }
                    }
                }
            });
            return META;
        }
    }
});

var ANNOT_TOKEN_REG = new RegExp("@(\\w+)");
var ANNOT_VARS_REG = new RegExp("\\((.*)\\)");
var ANNOTATION_REG = new RegExp("@(.+)\\n", "g");

function parseAnnotations(comment){
    var annot;
    for(var i=0; i< comment.length; i++){
        var checkAnnot = comment[i].value.match(ANNOTATION_REG);
        if(checkAnnot){
            checkAnnot.forEach(
                function(annotationString){
                    var annotationToken = ANNOT_TOKEN_REG.exec(annotationString)[1];
                    if(!annot) annot = {};
                    annot[annotationToken] = {};
                    if(ANNOT_VARS_REG.test(annotationString)){
                        var vars = ANNOT_VARS_REG.exec(annotationString)[1];
                        var varsArray = vars.split(",");
                        varsArray.forEach(function(pair, i, pairs) {
                            var res = pair.split("=");
                            if (res[0] && res[1]) {
                                annot[annotationToken][trim(res[0])] = trim(res[1]);
                            }
                        })
                    }
                }
            );
        }

    }
    return annot;
}

//todo: need to cleanup following code - looks ugly
function trim(str) {
    str = str.replace(/^[\s"']+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/[^\s"']/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}
