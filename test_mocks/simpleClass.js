/**
 * comment before simpleClass
 */
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
    this.simpleInsideMethod = function(arg){
        /*method body*/    
    };
}

/**
 * comment before someMethod
 */
simpleClass.prototype.someMethod = function(argument){
    /*some method body*/    
};

/**
 * Comment before simpleClass2
 */
function simpleClass2(){
    return {
        /**
        * comment before someSimple2Method
        */
        someSimple2Method:function(){
            /**someSimple2Method implementations*/
        },
        /**
        * comment before someSimple2property
        */
        someSimple2property: "someSimple2property"
    };
}