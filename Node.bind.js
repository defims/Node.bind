//Node.bind
//Node().bind()
;(function(){
    /*
     * = isObject
     */
    function isObject(object){
        return Object.prototype.toString.call(object) == "[object Object]"
    }
    /*
     * = isArray
     */
    function isArray(object){
        return Object.prototype.Object.prototype.toString.call(object) == "[object Array]"
    }
    /*
     * =Node
     * @param node string
     *
     */
//    var num         = 0,
//        bindings    = {};

    function Node(node){
        return {
            bind : function(data){
                console.log(node);
                var nodeType    = node.nodeType;
                if(nodeType == 1){//ELEMENT
                    if(isObject(data)){//Object
                        //var id = num++;
                        //bindings[id] = {
                        //    scope   : data,
                        //    node    : node
                        //}
                        node.__data = data;
                        console.log(node)
                    }else if(isArray(data)){
                        
                    }
                }
            },
        }
    }
    window.NodeBind = Node;
})()
