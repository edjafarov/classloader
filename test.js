var vows = require('vows'),
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
}).run()