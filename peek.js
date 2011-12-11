var fs = require("fs");
var util = require ("util");
var jsparser = require("uglify-js").parser;

//var ast = jsparser.parse(fs.readFileSync("./test_mocks/simpleClass.js").toString(), false, true);

var classloader = require("./src/classloader.js");

//var obj=classloader.compile("./test_mocks/simpleClass.js");


console.log(util.inspect(classloader.preload("./test_mocks"), false, 7));

//console.log(util.inspect(ast, false, 7));
//console.log(util.inspect(obj.meta.functions, false,3));
