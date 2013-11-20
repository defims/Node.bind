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
        return Object.prototype.toString.call(object) == "[object Array]"
    }
    /*
     * =Node
     * @param node string *
     */
//    var num         = 0,
//        bindings    = {};

    function Node(node){
        return {
            bind : function(parent, dataName){
                console.log(node);
                if(!node || !parent || !dataName) return;

                var data        = parent[dataName],
                    nodeType    = node.nodeType,
                    dataType    = typeof(data),
                    handle      = function(func){
                        func(data);
                        //getter setter
                        Object.defineProperty(parent, dataName, {
                            set : function(value){
                                func(value);
                            }
                        })
                    }
                //handle data with nodeBindDat scope
                node.nodeBindData   = {};

                if(nodeType == 1){//ELEMENT
                    if(dataType == "boolean"){//Boolean
                        handle(function(value){
                            if(value){
                                node.style.display  = 'block';
                                //replace class nodeBindHidden with class nodeBindShow
                            }else{
                                node.style.display  = 'none';
                                //replace class nodeBindShow with class nodeBindHidden
                            }
                        });
                    }else if(dataType == "number" || dataType == "string"){//Number staring
                        handle(function(value){
                            node.textContent    = value;
                        })
                    }else if(data == undefined || data == null){
                        //replace class nodeBindShow with class nodeBindHidden
                    }else if(isObject(data)){//Object
                        node.nodeBindData = {
                            "scope" : data
                        };
                    }else if(isArray(data)){//Array

                        var len             = data.length,
                            fragment        = document.createDocumentFragment(),
                            tempNode,i,instances;

                        node.nodeBindData   = {
                            "scope"     : data[0],
                            "instances" : []
                        }

                        instances   = node.nodeBindData.instances;
                        for(i=1; i<data.length; i++){
                            tempNode    = node.cloneNode(true);
                            tempNode.nodeBindData   = {
                                "scope"     : data[i],
                                "prototype" : node
                            }
                            instances.push(tempNode);
                            fragment.appendChild(tempNode);
                        }
                        node.parentNode.insertBefore(fragment, node.nextSibling);

                    }
                }
            },
        }
    }
    window.NodeBind = Node;
})()
