module.exports = function(scope, index, scopes, parser) {
    if (scope.type == CONST.FUNCTION || scope.type == CONST.METHOD || scope.type == CONST.INNER_METHOD) {
        if (scope.argumentsSrc) {
            var argumentsList = scope.argumentsSrc.split(",");
            scope.arguments = [];
            argumentsList.forEach(function(arg) {
                var parsed = /\/\*\*([\w@]*)\*\/\s*(\w*)/.exec(arg);
                if (parsed) {
                    scope.arguments.push({
                        name: parsed[2],
                        annotationSrc: parsed[1]
                    });
                }else{
                    scope.arguments.push({
                        name: arg,
                    });
                }
            });
        }
    }
};