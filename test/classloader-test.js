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
    },
    'classloader returns Class': {
        topic: function() {
            classloader.flush("./test/simpleClass.js");
            return classloader.getClass("./test/simpleClass.js");
        },
        'checked ClassObj should be runned': function(Class) {
            assert.isNotNull(Class);
            assert.isFunction(Class);
        }
    },
    'simple function META analysis': {
        topic: function() {
            classloader.flush("./test/function.js");
            return classloader.compile("./test/function.js").meta;
        },
        'should contain resolved simpleFunction': function(meta) {
            assert.isTrue(meta['simpleFunction'] != undefined);
            assert.equal(meta['simpleFunction'].type, "function");
        },
        'should contain resolved innerSimpleFunction': function(meta) {
            assert.isTrue(meta['innerSimpleFunction'] != undefined);
            assert.equal(meta['innerSimpleFunction'].type, "function");
        },
        'should contain resolved innerSimpleFunctionEx': function(meta) {
            assert.isTrue(meta['innerSimpleFunctionEx'] != undefined);
            assert.equal(meta['innerSimpleFunctionEx'].type, "function");
        },
        'should contain resolved simpleFunctionEx': function(meta) {
            assert.isTrue(meta['simpleFunctionEx'] != undefined);
            assert.equal(meta['simpleFunctionEx'].type, "function");
        },
        
    },
    'simpleClass META analysis': {
        topic: function() {
            classloader.flush("./test/simpleClass.js");
            return classloader.compile("./test/simpleClass.js").meta;
        },
        'properties and methods of class should be returned': function(meta) {
            assert.equal(meta["simpleClass"].type,"class");
            assert.equal(meta["simpleClass"].name, "simpleClass");
            assert.equal(meta["simpleClass"].properties[0].name, "simpleInsideProperty");
            assert.equal(meta["simpleClass"].properties[1].name, "simpleInsideMethod");
            assert.equal(meta["simpleClass"].properties[2].name, "someMethod");
        }
    }


}).export(module);