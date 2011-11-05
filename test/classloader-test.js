var vows = require('vows'),
    assert = require('assert'),
    classloader = require("../src/classloader.js");


// Create a Test Suite
vows.describe('classloader test').addBatch({
    'classloader reads': {
        topic: classloader.read("./test/simpleClass.js"),
        'returns ClassObj with filename and source defined': function(Class) {
            assert.isNotNull(Class);
            assert.isNotNull(Class.fileName);
            assert.equal(Class.fileName, "./test/simpleClass.js");
            assert.isNotNull(Class.source);
        }
    },
    'classloader flushes and checks': {
        topic: function() {
            classloader.flush("./test/simpleClass.js");
            return classloader.check("./test/simpleClass.js");
        },
        'checked ClassObj should be false': function(isExists) {
            assert.isFalse(isExists);
        }

    },
    'classloader loads and checks': {
        topic: function() {
            classloader.read("./test/simpleClass.js");
            return classloader.check("./test/simpleClass.js");
        },
        'checked ClassObj should be there': function(Class) {
            assert.isObject(Class);
        }
    },
    'classloader compiles': {
        topic: function() {
            classloader.flush("./test/simpleClass.js");
            return classloader.compile("./test/simpleClass.js");
        },
        'checked ClassObj should be compiled': function(Class) {
            assert.isObject(Class);
            assert.isNotNull(Class.script);
        }
    },
    'classloader runs': {
        topic: function() {
            classloader.flush("./test/simpleClass.js");
            return classloader.run("./test/simpleClass.js");
        },
        'checked ClassObj should be runned': function(Class) {
            assert.isObject(Class);
            assert.isNotNull(Class.context);
            assert.isNotNull(Class.context["simpleClass"]);
        }
    }
    

}).run();