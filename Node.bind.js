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

    function Node(nodes){
        return {
            bind : function(dataPath){
                if(!nodes || !dataPath) return;
                if(!nodes.length){
                    nodes = [nodes];
                }
                for(var i = 0,len = nodes.length; i<len; i++){
                    //forEach node
                    var node            = nodes[i],
                        scopeElement    = node,
                        obj             = window,
                        nodeType        = node.nodeType,
                        path            = [],
                        dataArr,dataType,prop,data,scopeData,dataArrItem,nodeBindData,j,parentElement,childNodes,childBinding;

                    //get scopeElement
                    while(scopeElement){
                        nodeBindData    = scopeElement.nodeBindData;
                        if(nodeBindData && nodeBindData.scope){
                            scopeData   = scopeElement.nodeBindData.scope;
                            obj         = scopeData;
                            //register child binding path for repeat content to find child
                            //because path will not change after repeat content generated
                            childBinding    = scopeElement.nodeBindData.childBinding;
                            if(childBinding) childBinding.push({"nodePath": path, "dataPath": dataPath})
                            break;
                        }
                        //get node path of scopeElement
                        parentElement   = scopeElement.parentElement;
                        if(parentElement){
                            childNodes      = parentElement.childNodes;
                            for(j in childNodes){
                                if(childNodes[j]==scopeElement){
                                    path.push(Number(j));
                                }
                            }
                        }
                        scopeElement  = scopeElement.parentElement;
                    }
                    //console.log(scopeElement)
                    //get data
                    dataArr     = dataPath.replace(/\[/g,'.').replace(/\]/g,'').split('.');
                    prop        = dataArr.pop();
                    if(prop == "$i"){
                        prop    = nodeBindData.index - 1;
                    }
                    while(dataArr.length){
                        dataArrItem = dataArr.shift();
                        if(dataArrItem == "$i"){
                            obj = obj[nodeBindData.index];
                        }else{
                            obj = obj[dataArrItem];
                        }
                    }
                    data        = obj[prop];
                    dataType    = typeof(data);
                    //console.log(node,dataPath,prop,obj,obj[prop],data)
                    //handle function
                    function handle(func){
                        func(data);
                        //getter setter
                        var _data = data;
                        try{
                            Object.defineProperty(obj, prop, {
                                get : function(){
                                    return _data;
                                },
                                set : function(value){
                                    func(value);
                                    _data = value;
                                },
                                enumerable  : true
                            })
                        }catch(e){};
                    };

                    //ELEMENT handle
                    function ELEMENTHandle(){
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
                        }else if(dataType == "number" || dataType == "string"){//Number string
                            handle(function(value){
                                node.textContent    = value;
                            })
                        }else if(data == undefined || data == null){//undefined null
                            //replace class nodeBindShow with class nodeBindHidden
                        }else if(isObject(data)){//Object
                            //prototype chain
                            function prototypeData(){
                                for(k in data)  this[k] = data[k];
                            }
                            prototypeData.prototype = scopeData;
                            node.nodeBindData = {
                                "scope"         : new prototypeData(),
                                "childBinding"  : []
                            };
                        }else if(isArray(data)){//Array
                            var len             = data.length,
                                fragment        = document.createDocumentFragment(),
                                instances;
                            //change data to observable array
                            node.nodeBindData   = {
                                "scope"         : '',
                                "instances"     : [],
                                "childBinding"  : [],
                                "index"         : 1
                            }
                            instances   = node.nodeBindData.instances;
                            //handle exist getter setter ArrayObserve will store origin data (include getter setter) so both change and original getter setter will be triggered
                            ArrayObserve(obj, prop, (function(node){
                                return function(change){
                                    var type    = change.type,
                                        index   = Number(change.name) + 1,
                                        value   = change.value,
                                        tempNode,childNode,i,j,len,lastInstance,item,nodePath,childBinding;
                                    if(type == "new"){
                                        if(index != 1){
                                            tempNode    = node.cloneNode(true);
                                            tempNode.nodeBindData   = {
                                                "scope"     : change.object,
                                                "prototype" : node,
                                                "index"     : index
                                            }
                                            len = instances.length;
                                            if(len > 0){
                                                lastInstance    = instances[len - 1];
                                            }else{
                                                lastInstance    = node
                                            }
                                            node.parentNode.insertBefore(tempNode, lastInstance.nextSibling);
                                            instances.push(tempNode);

                                            //bind child bindings
                                            childNode       = tempNode;
                                            childBinding    = node.nodeBindData.childBinding;
                                            for(i=0; i<childBinding.length; i++){
                                                item        = childBinding[i];
                                                nodePath    = item.nodePath;
                                                for(j=nodePath.length - 1; j>=0; j--){
                                                    childNode   = childNode.childNodes[nodePath[j]];
                                                }
                                                //console.log(childNode,item.dataPath)
                                                NodeBind(childNode).bind(item.dataPath);
                                            }
                                        }
                                    }else if(type == "updated"){
                                        //do nothing
                                    }else if(type == "deleted"){
                                        var deleteNode = instances[index - 2];//one for 0 start ,one for node it self
                                        deleteNode.parentNode.removeChild(deleteNode);
                                        //delete instances[index - 2]
                                        instances.splice(index -2, 1);
                                    }
                                }
                            })(node));
                            node.nodeBindData.scope = obj[prop];
                        }else if(dataType == "function"){
                        }
                    };

                    function ATTRIBUTEHandle(){
                        if(dataType == "boolean"){//Boolean
                        }else if(dataType == "number" || dataType == "string"){//Number string
                        }else if(data == undefined || data == null){//undefined null
                        }else if(isObject(data)){//Object
                        }else if(isArray(data)){//Array
                        }
                    };

                    //handle data with nodeBindData scope
                    if(nodeType == 1){//ELEMENT
                        ELEMENTHandle();
                    }else if(nodeType == 2){//ATTRIBUTE
                        ATTRIBUTEHandle();
                    }
                }
            },
        }
    }
    window.NodeBind = Node;
})()
