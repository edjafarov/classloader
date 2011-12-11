/**
 * comment before simpleFunction
 * @simpleFunctionAnnotation(var1='var1Value',var2='var2Value')
 */
function simpleFunction(arg1, arg2){

    /*body of simpleFunction*/
    function innerSimpleFunction(arg1, arg2){
        /*definition*/
    }
    var innerVar = "";


    /**
     * comments before innerSimpleFunctionEx
     */
    var innerSimpleFunctionEx = function (){
        /*definition*/
    };

    globalVar = 10;
}

var globalScopeVar = "test";
/**
 * comment before simpleFunctionEx
 */
var simpleFunctionEx = function(arg3){
    /*body of simpleFunctionEx*/    
};