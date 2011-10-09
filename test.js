/*var vows = require('vows'),
    assert = require('assert'),
    ClassLoader=require("ClassLoader");

// Create a Test Suite
vows.describe('ClassLoader test').addBatch({
    'ClassLoader.getClassName': {
        topic: ClassLoader.getClassName("./test/TestClass.js"),

        'we get TestClass': function (topic) {
            console.log(topic);
            assert.equal (topic, "TestClass");
        }
    }
}).run()*/
var jsp = require("uglify-js").parser;
var util = require("util");
var fs = require("fs");
var ast = jsp.parse(fs.readFileSync("./test/tst.js").toString(),true, true);
//var tok = jsp.tokenizer(fs.readFileSync("./test/tst.js").toString(),true);
console.log(util.inspect(ast,false,null));
//console.log(util.inspect(tok.next(),false,null));
