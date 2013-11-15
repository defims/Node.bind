//Node.bind
//Node().bind()
;(function(){
    /*
     * =Node
     * @param node string
     *
     */
    function Node(node){
        return {bind : function(prop, obj, key){
            console.log(node);
            //
        }}
    }
    window.NodeBind = Node;
})()
