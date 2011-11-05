
function simpleClass(){
    /**
     * comment before privateProperty
     */
    var privateProperty = "someProperty";
    /**
     * comment before simpleInsideProperty
     */
    this.simpleInsideProperty = "something";
    
    /**
     * comment before simpleInsideMethod
     */
    this.simpleInsideMethod = function(){
        /*method body*/    
    };
}

/**
 * comment before someMethod
 */
simpleClass.prototype.someMethod = function(){
    /*some method body*/    
}