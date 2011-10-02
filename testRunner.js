var classloader = require("./src/classloader.js");

classloader.on("compile", function(cl){console.log(cl.source)});

console.log(classloader.getClass("./src/test.js"));