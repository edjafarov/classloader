var util = require ("util");

var classloader = require("../src/classloader.js");

var obj=classloader.compile("./test/simpleClass.js");

console.log(util.inspect(obj.meta, false,7));