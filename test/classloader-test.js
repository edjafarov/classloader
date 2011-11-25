var vows = require('vows'),
    assert = require('assert'),
    classloader = require("../src/classloader.js");


// Create a Test Suite
vows.describe('classloader test').addBatch({
    'classloader reads': {
        topic: classloader.read("./test_mocks/simpleClass.js"),
        'returns ClassObj with filename and source defined': function(Class) {
            assert.isNotNull(Class);
            assert.isNotNull(Class.fileName);
            assert.equal(Class.fileName, "./test_mocks/simpleClass.js");
            assert.isNotNull(Class.source);
        }
    },
    'classloader flushes and checks': {
        topic: function() {
            classloader.flush("./test_mocks/simpleClass.js");
            return classloader.check("./test_mocks/simpleClass.js");
        },
        'checked ClassObj should be false': function(isExists) {
            assert.isFalse(isExists);
        }

    },
    'classloader loads and checks': {
        topic: function() {
            classloader.read("./test_mocks/simpleClass.js");
            return classloader.check("./test_mocks/simpleClass.js");
        },
        'checked ClassObj should be there': function(Class) {
            assert.isObject(Class);
        }
    },
    'classloader compiles': {
        topic: function() {
            classloader.flush("./test_mocks/simpleClass.js");
            return classloader.compile("./test_mocks/simpleClass.js");
        },
        'checked ClassObj should be compiled': function(Class) {
            assert.isObject(Class);
            assert.isNotNull(Class.script);
        }
    },
    'classloader runs': {
        topic: function() {
            classloader.flush("./test_mocks/simpleClass.js");
            return classloader.run("./test_mocks/simpleClass.js");
        },
        'checked ClassObj should be runned': function(Class) {
            assert.isObject(Class);
            assert.isNotNull(Class.context);
            assert.isNotNull(Class.context["simpleClass"]);
        }
    },
    'classloader returns Class': {
        topic: function() {
            classloader.flush("./test_mocks/simpleClass.js");
            return classloader.getClass("./test_mocks/simpleClass.js");
        },
        'checked ClassObj should be runned': function(Class) {
            assert.isNotNull(Class);
            //assert.isFunction(Class);
        }
    },
    'simple function META analysis': {
        topic: function() {
            classloader.flush("./test_mocks/function.js");
            return classloader.compile("./test_mocks/function.js").meta;
        },
        'should contain resolved simpleFunction': function(meta) {
            assert.isTrue(meta.functions['simpleFunction'] != undefined);
            assert.equal(meta.functions['simpleFunction'].type, "function", "should be a function");
//            assert.length(meta.functions['simpleFunction'].comments, 1, "should contain a comment");
        },
        'should contain resolved innerSimpleFunction': function(meta) {
            assert.isTrue(meta.functions['innerSimpleFunction'] != undefined);
            assert.equal(meta.functions['innerSimpleFunction'].type, "function", "should be a function");
 //           assert.length(meta.functions['innerSimpleFunction'].comments, 1, "should contain a comment");
        },
        'should contain resolved innerSimpleFunctionEx': function(meta) {
            assert.isTrue(meta.functions['innerSimpleFunctionEx'] != undefined);
            assert.equal(meta.functions['innerSimpleFunctionEx'].type, "function", "should be a function");
//            assert.length(meta.functions['innerSimpleFunctionEx'].comments, 1, "should contain a comment");
        },
        'should contain resolved simpleFunctionEx': function(meta) {
            assert.isTrue(meta.functions['simpleFunctionEx'] != undefined);
            assert.equal(meta.functions['simpleFunctionEx'].type, "function", "should be a function");
//            assert.length(meta.functions['simpleFunctionEx'].comments, 1, "should contain a comment");
        }
    },
    'simpleClass META analysis': {
        topic: function() {
            classloader.flush("./test_mocks/simpleClass.js");
            return classloader.compile("./test_mocks/simpleClass.js").meta;
        },
        'properties and methods of class should be returned': function(meta) {
            assert.equal(meta.classes["simpleClass"].type,"class");
            assert.equal(meta.classes["simpleClass"].name, "simpleClass");
            assert.equal(meta.classes["simpleClass"].properties[0].name, "simpleInsideProperty");
            assert.equal(meta.classes["simpleClass"].properties[1].name, "simpleInsideMethod");
            assert.equal(meta.classes["simpleClass"].properties[2].name, "someMethod");
        }
    }


}).export(module);