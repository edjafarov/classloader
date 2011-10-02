var util = require('util');
module.exports = function(scope, index, scopes, parser) {
    if (scope.type == CONST.FUNCTION || scope.type == CONST.METHOD || scope.type == CONST.INNER_METHOD) {
        var comment = new RegExp("(\\/\\*{2}([^\*]|[\\r\\n]|(\\*+([^\*\\/]|[\\r\\n])))*\\*+\\/)[\\t\\r\\n\\s]*" + scope.latestParsedRegExp.source);
        var annotation = new RegExp("@(.+)\\n", "g");
        var stringToTest = parser.sr.getString(0, scope.start);
        if (comment.test(stringToTest)) {
            scope.annotationSrc = comment.exec(stringToTest)[1];
            if (scope.annotationSrc) {
                scope.annotationSrc.match(annotation).forEach(

                function(annotationString) {
                    parseAnnotation(annotationString, scope, index, scopes, parser);
                });
            }
            if (scope.annotations) {
                for (annot in scope.annotations) {
                    parser.emit("annotationFunctionProcessor:" + annot, annot, scope, index, scopes, parser);
                }
            }
        }
    }
};
var annotationTokenReg = new RegExp("@(\\w+)");
var annotationVarsReg = new RegExp("\\((.*)\\)");

function parseAnnotation(annotationString, scope, index, scopes, parser) {
    var annotationToken = annotationTokenReg.exec(annotationString)[1];
    if (!scope.annotations) scope.annotations = {};
    if (!scope.annotations[annotationToken]) scope.annotations[annotationToken] = {};
    if (annotationVarsReg.test(annotationString)) {
        var vars = annotationVarsReg.exec(annotationString)[1];
        var varsArray = vars.split(",");
        varsArray.forEach(function(pair, i, pairs) {
            var res = pair.split("=");
            if (res[0] && res[1]) {
                scope.annotations[annotationToken][trim(res[0])] = trim(res[1]);
            }
        });
    };
}

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