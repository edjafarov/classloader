var reader = require("../sourceReader.js");

var FUNCTION = "function\\s*([\\w_]*)\\s*\\(([^\\)]*?)\\)\\s*\\{$";
var ASSIGNED_TO = "[\\s\\.](\\w+)\\s*=\\s*";


var simpleFunction = new RegExp(FUNCTION);
var assignedFunction = new RegExp(ASSIGNED_TO + FUNCTION);

module.exports = function(scope, index, scopes, parser) {
    var stringToTest = reader(parser.meta.source).getString(0, scope.start);
    if (simpleFunction.test(stringToTest)) {
        scope.type = parser.c.FUNCTION;
        var parsed = simpleFunction.exec(stringToTest);
        // check if anonimous
        scope.latestParsed = parsed[0];
        scope.latestParsedRegExp = simpleFunction;
        scope.isAnonimous = !parsed[1];
        if (scope.isAnonimous && assignedFunction.test(stringToTest)) {
            //if anonimous try to get name of variable we assign the function to
            scope.functionName = assignedFunction.exec(stringToTest)[1];
        }
        else {
            scope.functionName = parsed[1];
        }
        scope.argumentsSrc = parsed[2];
    }
};