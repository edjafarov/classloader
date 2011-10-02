var sourceReader = require("./sourceReader.js")
module.exports = function(src) {
        var sr = sourceReader(src);
        var scopes = [];
        var id = 0;

        function findScopes(parentId) {
            if (sr.checkNext("}") == -1) {
                if (parentId == null) return true;
                throw new Error("could not find scope end. } expected");
            }
            if (sr.checkNext("{") == -1) {
                return sr.findNext("}");
            }
            else {
                if (sr.checkNext("{") < sr.checkNext("}")) {
                    var newScope = {
                        start: sr.findNext("{") + 1,
                        parentId: parentId
                    }
                    var localId = id++;
                    scopes[localId] = null;
                    newScope.end = findScopes(localId);
                    scopes[localId] = newScope;
                    return findScopes(parentId);
                }
                else {
                    return sr.findNext("}");
                }
            }
        }
        findScopes();
        return scopes;
    }