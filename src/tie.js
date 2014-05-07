//;(function(document, window, undefined){
function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor)
        superClass.prototype.constructor = superClass;
}
function ArrayClone(arr){
    var _arr    = []
        ,len    = arr.length
        ;
    while(len--) _arr[len] = arr[len];
    return _arr;
}
function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}
function log(type, pubsubKey, receiveKey, receivePath){
    console.log("%c"+type+": "+pubsubKey.join("."), "color:red")
    console.log(" receive key: ", receiveKey.join("."));
    for(var i=0,p=[]; i<receivePath.length; i++) p.push(receivePath[i].key.join('.'));
    console.log(" receive path: ", p.join("->"));
}
function forEach(array, fn){
    for(var i = 0, len = array.length; i < len; ++i)
      fn(array[i], i, array)
}
function parseTemplate(str, inHandle, outHandle){
    var len = str.length
        ,parsed = []
        ,item = ''
        ,isIn = false
        ,has = false
        ,index = 0
        ,i
        ,letter
        ;
    for(i = 0 ;i < len ;i++) {
        letter = str[i];
        if(!isIn && letter === '{' && str[i+1] === '{'){//in
            if(item){
                parsed.push(outHandle(item ,index));
                index++;
                item = '';
            }
            i++;
            isIn = true;
            has = true;
        }else if(isIn && letter === '}' && str[i+1] === '}'){//out
            if(item){
                parsed.push(inHandle(item ,index));
                item = '';
                index++;
            }
            i++;
            isIn = false;
        }else{
            item += letter;
        }
    }
    if(item !== '') parsed.push(item);
    return parsed
}
////test
//console.log(parseTemplate("{{ab}}",function(path ,index){
//    console.log(index ,path)
//    return path
//},function(str ,index){
//    console.log(index ,str)
//    return str
//}))
//console.log(parseTemplate("ab",function(path ,index){
//    console.log(index ,path)
//    return path
//},function(str ,index){
//    console.log(index ,str)
//    return str
//}))
//console.log(parseTemplate("ab{{c}}",function(path ,index){
//    console.log(index ,path)
//    return path
//},function(str ,index){
//    console.log(index ,str)
//    return str
//}))
//console.log(parseTemplate("{{c}}c{{d}}",function(path ,index){
//    console.log(index ,path)
//    return path
//},function(str ,index){
//    console.log(index ,str)
//    return str
//}))
/*!
 * Small Walker - v0.1.1 - 5/5/2011
 * http://benalman.com/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
 
// Walk the DOM, depth-first (HTML order). Inside the callback, `this` is the
// element, and the only argument passed is the current depth. If the callback
// returns false, its children will be skipped.
// 
// Based on https://gist.github.com/240274
 
function walkTree(node, callback) {
  // This depth value will be incremented as the depth increases and
  // decremented as the depth decreases. The depth of the initial node is 0.
    var path   = []
        ,depth = 0
        ,skip,tmp
        ;
  // Always start with the initial element.
  do {
    if ( !skip ) {
      // Call the passed callback in the context of node, passing in the
      // current depth as the only argument. If the callback returns false,
      // don't process any of the current node's children.
      skip = callback.call(node, depth, path) === false;
    }
 
    if ( !skip && (tmp = node.firstChild) ) {
      // If not skipping, get the first child. If there is a first child,
      // increment the depth since traversing downwards.
      depth++;
      path.push(0);
    } else if ( tmp = node.nextSibling ) {
      // If skipping or there is no first child, get the next sibling. If
      // there is a next sibling, reset the skip flag.
      skip = false;
      path[path.length-1] ++;
    } else {
      // Skipped or no first child and no next sibling, so traverse upwards,
      tmp = node.parentNode;
      // and decrement the depth.
      depth--;
      // Enable skipping, so that in the next loop iteration, the children of
      // the now-current node (parent node) aren't processed again.
      skip = true;
      path.pop();
    }
 
    // Instead of setting node explicitly in each conditional block, use the
    // tmp var and set it here.
    node = tmp;
 
  // Stop if depth comes back to 0 (or goes below zero, in conditions where
  // the passed node has neither children nore next siblings).
  } while ( depth > 0 );
}
/*
 * =tieEqual
 * @about allow partial equal, means {a:1} equal {a:1 ,b:1} but {a:1 ,c:1} not equal {a:1 ,b:1}
 * */
function tieEqual(x,y){
    if(x === y)
        return true;// if both x and y are null or undefined and exactly the same
    //only object and array judge whole
    if ( ( isArray(x) || isObject(x) ) && ( isArray(y) || isObject(y) ) ) {
        var xmore = false
            ,k
            ;
        for( k in x ) {
            if( k in y ){//x has ,y has
                // Objects and Arrays must be tested recursively
                if( !tieEqual(x[k],  y[k]) ) {//not equal
                    return false;
                }
            }
            else {//x has ,y not
                xmore = true;//x more
            }
        }
        for( k in y ) {
            if( !( k in x ) && xmore ){//x more, y more
                return false
            }
        }
        //only x more ,only y more or x and y has same
        return true;
    }
    //if not object or array and !==
    return false
}
////test
////only judge given property
//console.log(tieEqual({a:1},{a:1})) //true
//console.log(tieEqual({a:1},{a:2})) //false
//console.log(tieEqual({a:1},{b:1})) //false
//console.log(tieEqual({a:{b:1}},{a:{b:1}})) //true
//console.log(tieEqual({a:{b:1}},{a:{b:2}})) //false
//console.log(tieEqual({a:{b:1}},{c:{b:1}})) //false
//console.log(tieEqual({a:{b:1}, c:2},{a:{b:1}})) //true
//console.log(tieEqual({a:{b:1}},{a:{b:1}, c:2})) //true
////if the same object pointer always equal
//var a = {a: {b:1}}
//    ,b = a
//    ;
//b.a.b=2;
//console.log(tieEqual(a,b))//true
//
//var a = {a: {b:document.createElement("div")}}
//    ,b = {a: {b:document.createElement("div")}}
//console.log(tieEqual(a,b))//fase
//var e = document.createElement("div")
//    ,a = {a: {b:e}}
//    ,b = {a: {b:e}}
//console.log(tieEqual(a,b))//true
//console.log(tieEqual({a:1}, {b:2}))//false
//console.log(tieEqual({a:1 ,b:1}, {b:1}))//true
//console.log(tieEqual({a:1 ,b:1}, {a:1 ,c:1}))//false
/*
 * =defaultArgument
 * *
function initArguments(_args){
    var args = arguments
        ,len = args.length - 1
        ;
    while(len--)
        if(_args[len] === undefined)
            _args[len] = args[len+1];
}
/*
 * =Path
 */
function Path(path){
    var parsed  = path || ""
        ;
    parsed  = parsed.replace(/['"\]]/gim, "").split(/[\.\[]['"]?/gim)
    parsed.origin   = path || "";
    return parsed
}
////test
//console.log(new Path())
//console.log(new Path("0"))
//console.log(new Path("path.to.value"))
//console.log(new Path("path['to'].value"))
//console.log(new Path('path["to"].value'))
//console.log(new Path("path[0].value"))
////console.log(new Path("path.to.value.<.value")) //todo
////console.log(new Path("path.to.value.<5.value")) //todo
//console.log(new Path("<1.path.to.value.value"))
//console.log(new Path("/.path.to.value.value"))
function get$Index(view) {
    //while( !(node instanceof TieScopeView) ) {
    //    forEach(node.contacts.values ,function (contact ,index ,contacts) {
    //        var parent = false
    //        forEach(contact.as ,function (item) {
    //            if(item == "parent") {
    //                parent = true
    //            }
    //        })
    //        if ( parent ) node = contact.node
    //    })
    //}
    //var scopeView = view
    //while(!(scopeView instanceof TieScopeView)) {
    //    scopeView = scopeView.contacts.get("parent")[0].node;
    //}
    scopeView = view.contacts.get("parent")[0].node;
    console.log("scopeView:", scopeView)
    if("instances" in scopeView) {
        console.log("instances")
        return 0;
    }
    else if("prototype" in scopeView){
        //var instances = scopeView.prototype.instances;
        console.log("instance", scopeView)
        return 1
    }
    return 0;
}
function generateViews(node) {
    walkTree(node, function(depth){
        var node = this
            ,ELEMENT_NODE = 1
            ,TEXT_NODE = 3
            ,nodeType = node.nodeType
            ;
        if(nodeType == ELEMENT_NODE){
            var attributes  = node.attributes
                ,len = attributes.length
                ,attribute,nodeName
                ;
            while(len--){
                attribute = attributes[len];
                nodeName = attribute.nodeName.toLowerCase();
                if(nodeName.match(/data-bind-(.*)/gim)){
                    var directive = RegExp.$1.split(/-/gim)
                        ,template = parseTemplate(
                            attribute.nodeValue
                            ,function(path){
                                //todo path.to.data path[to][data] path['to']["data"]
                                return path.split(/\./gim)
                            }
                            ,function(path){
                                return path
                            }
                        )
                        ,tplLen = template.length
                        ,path
                        ;
                    while(tplLen--){
                        path = template[tplLen];
                        if(isArray(path)){
                            var view;
                            if (directive[0] == "scope") {
                                view = new TieScopeView ( node ,nodeName ,tplLen ,path );
                            }
                            else if (directive[0] == "repeat") {
                                view = new TieRepeatView ( node ,nodeName ,tplLen ,path );
                            }
                            else if (directive[0] == "attribute") {
                                if (directive[1] == "class") {
                                    view = new TieAttributeClassView ( node ,nodeName ,tplLen ,path);
                                }
                            }
                            //console.log(view)
                        }
                    }
                }
            }
        }else if(nodeType == TEXT_NODE){
            var nodeValue = node.nodeValue;
            if(nodeValue.match(/\{\{.*\}\}/gim)) {
                var template = parseTemplate(
                        node.nodeValue
                        ,function(path){
                            return path.split(/\./gim)
                        }
                        ,function(path){
                            return path
                        }
                    )
                    ,tplLen = template.length
                    ,noticeModels = []
                    ,path
                    ;
                //console.log(template)
                while (tplLen--) {
                    path = template[tplLen];
                    if(isArray(path)){
                        var view = new TieTextNodeView ( node ,tplLen ,path ,node.nodeValue);
                        //console.log(view)
                    }
                }
            }
        }
    })
}
function removeViews(node) {

}
function generatePaths (template, pathTree) {
    var paths = []
    parseTemplate(
        template
        ,function(path){
            //todo path.to.data path[to][data] path['to']["data"]
            paths.push
            return path.split(/\./gim)
        }
        ,function(path){
            return path
        }
    );
}
function generateModel (template ,scopeModel) {
    var template = parseTemplate(
            template
            ,function(path){
                //todo path.to.data path[to][data] path['to']["data"]
                return path.split(/\./gim)
            }
            ,function(path){
                return path
            }
        )
        ,tplLen = template.length
        ,models = []
        ,path
        ;
    while(tplLen--){
        path = template[tplLen];
        if(isArray(path)){
            console.log(path.join())
            var arrayIndex = []
                ,view ,model ,childPath
                ;
            forEach(path ,function(item ,index) {
                if (item == "$index") {
                    arrayIndex.push(index)
                }
            })
            if (arrayIndex.length > 0) {
                var len = scopeModel.value.length;
                    ;
                while(len--) {
                    forEach(arrayIndex ,function (item) {
                        path[item] = len;
                    })
                    //model
                    model = new TieModel(scopeModel.value ,path[0]);
                    //console.log(model)
                    model.contacts.add(scopeModel,"parent")
                    scopeModel.contacts.add(model,"child")
                    childPath = ArrayClone(path);
                    childPath.shift();
                    model = model.getChildModel(childPath);
                    models.push(model)
                }
            }
            else {
                //model
                model = new TieModel(scopeModel.value ,path[0]);
                //console.log(model)
                model.contacts.add(scopeModel,"parent")
                scopeModel.contacts.add(model,"child")
                childPath = ArrayClone(path);
                childPath.shift();
                model = model.getChildModel(childPath);
                models.push(model)
            }
        }
    }
    return models
}
function generateModels(node ,rootModel) {
    var scopeModels = [rootModel]
        ,scopeDepths = [-1]
        ,noticeModels = []
        ,pathTree = {}
        ;
    walkTree(node, function(depth){
        var node = this
            ,ELEMENT_NODE = 1
            ,TEXT_NODE = 3
            ,nodeType = node.nodeType
            ;
        if(depth == scopeDepths[scopeDepths.length - 1]) {
            scopeModels.pop();
            scopeDepths.pop();
        }
        if(nodeType == ELEMENT_NODE){
            var attributes  = node.attributes
                ,len = attributes.length
                ,attribute,nodeName
                ;
            while(len--){
                attribute = attributes[len];
                nodeName = attribute.nodeName.toLowerCase();
                if(nodeName.match(/data-bind-(.*)/gim)){
                    var directive = RegExp.$1.split(/-/gim)
                        ;
                    forEach(generatePaths(
                        attribute.nodeValue
                    ),function(path){
                        paths.push(path);
                    })
                    if (directive[0] == "scope" || directive[0] == "repeat") {
                        scopeModels.push(noticeModels[0]);//todo scope is not child of window
                        scopeDepths.push(depth);
                    }
                }
            }
        }else if(nodeType == TEXT_NODE){
            var nodeValue = node.nodeValue;
            if(nodeValue.match(/\{\{.*\}\}/gim)) {
                //forEach(generateModel(
                //    node.nodeValue
                //    ,scopeModels[scopeModels.length - 1]
                //),function(model){
                //    noticeModels.push(model);
                //})
            }
        }
    })
    console.log(noticeModels,"\n")
    ////first time notice
    //forEach(noticeModels ,function(model){
    //    console.log("%c\n== first time notice","color:hsla(0,70%,50%,1);",model.constructor.name ,model ,model.key)
    //    model.receive(model.value ,"binding");
    //})
}
/*
 * =TieMap
 * */
function TieMap(){
    var that = this
        ;
    that.keys = [];
    that.values = [];
}
var TieMapPrototype = TieMap.prototype;
function TieMapKeyId(key){
    var that = this
        ,keys = that.keys
        ,len = keys.length
        ,ret = []
        ;
    while(len--)
        if(tieEqual(keys[len], key))
            ret.push(len)
    if(ret.length)
        return ret
}
/*
 * =TieMap.prototype.get
 * */
//todo multi get
TieMapPrototype.get = function(key){
    var that = this
        ,values = that.values
        ,ids = TieMapKeyId.call(that, key)
        ,ret = []
        ,len
        ;
    if(ids){
        len = ids.length
        while(len--) {
            ret.push(values[ids[len]])
        }
        if(ret.length == 1) {
            return ret[0]
        }
        else if(ret.length > 1) {
            return ret
        }
    }
}
/*
 * =TieMap.prototype.set
 * */
TieMapPrototype.set = function(key, value){
    var that = this
        ,keys = that.keys
        ,values = that.values
        ,ids = TieMapKeyId.call(that, key)
        ,len
        ;
    //console.log(ids, key ,keys, that)
    if ( ids ) {
        len = ids.length
        while (len--) {
            //console.log(keys[ids[len]])
            values[ids[len]] = value;
        }
    }
    else {
        keys.push(key);
        values.push(value);
    }
}
/*
 * =TieMap.prototype.has
 * */
TieMapPrototype.has = function(key, value){
    var that = this
        ,values = that.values
        ,id = TieMapKeyId.call(that, key)
        ;
    if(id >= 0) return true;
}
/*
 * =TieMap.prototype.remove
 * */
TieMapPrototype.remove = function(key){
    var that = this
        ,keys = that.keys
        ,values = that.values
        ,id = TieMapKeyId.call(that, key)
        ;
    if(id >= 0){
        keys.splice(id, 1);
        values.splice(id, 1);
    }
}
/*
 * =TieMap.prototype.clear
 * */
TieMapPrototype.clear = function(key){
    var that = this
        ;
    that.keys = [];
    that.values = [];
}
/*
 * =TieMap.prototype.forEach
 * */
TieMapPrototype.forEach = function(callback){
    var that = this
        ,keys = that.keys
        ,values = that.values
        ,keysLen = keys.length
        ,i
        ;
    for(i=0; i<keysLen; i++)
        callback.call(that, values[i], keys[i]);
}
////test
//var map = new TieMap();
////map.set(1,"value 1")
////map.set({id:{value: 1}},"id value 1")
////console.log(map.get({id:{value: 1}}))
////map.set({id: 1}, "id 1")
////map.delete({id: 1})
////map.delete({id: {value: 1}})
//var a = {}
//map.set(a,"value 1")
//map.set(a,"value 2")
//console.log(map.get(a))
//console.log(map)
/*
 * =TieContact
 * */
function TieContact(node){
    var that = this
        ;
    that.node = node;
    that.role = "";
    that.as = "";
}
var TieContactPrototype = TieContact.prototype;
/*
 * =TieContact.prototype.handle
 * */
TieContactPrototype.handle = function(){

};
/*
 * =TieParentContact
 * */
function TieParentContact(node){
    var that = this
        ;
    TieParentContact.superClass.constructor.apply(that,arguments);
    that.role = "parent";
    that.as = ["parent","binding"];
}
extend(TieParentContact, TieContact);
var TieParentContactPrototype = TieParentContact.prototype;
/*
 * =TieParentContact.prototype.handle
 * */
TieParentContactPrototype.handle = function(hostKey, receiveKey){
    var that = this
        ,len = hostKey.length
        ;
    while(len--) receiveKey.unshift(hostKey[len]);
    return receiveKey
}
/*
 * =TieChildContact
 * */
function TieChildContact(node){
    var that = this
        ;
    TieChildContact.superClass.constructor.apply(that,arguments);
    that.role = "child";
    that.as = ["child","binding"];
}
extend(TieChildContact, TieContact);
var TieChildContactPrototype = TieChildContact.prototype;
/*
 * =TieChildContact.prototype.handle
 * */
TieChildContactPrototype.handle = function(hostKey, receiveKey){
    var that = this
        ,contactKey = that.node.key
        ,len = contactKey.length
        ,match = true;
        ;
    if(len <= receiveKey.length){
        while(len--){
            if( receiveKey[len] !== contactKey[len] ){
                match = false;
                break;
            }
        }
        if(match){
            len = contactKey.length;
            while(len--) receiveKey.shift();
            return receiveKey
        }else{
            return false
        }
    }else{
        return false
    }
}
////test
//console.log(new TieParentContact)
/*
 * =TieBindingContact
 * */
function TieBindingContact(node){
    var that = this
        ;
    TieBindingContact.superClass.constructor.apply(that,arguments);
    that.role = "binding";
    that.as = ["parent","child","binding"];
}
extend(TieBindingContact, TieContact);
var TieBindingContactPrototype = TieBindingContact.prototype;
/*
 * =TieBindingContact.prototype.handle
 * */
TieBindingContactPrototype.handle = function(hostKey, receiveKey){
    return receiveKey
}
////test
//console.log(new TieParentContact)

/*
 * =TieContacts
 * */
function TieContacts(){
    var that = this;
    TieContacts.superClass.constructor.call(that);
}
extend(TieContacts, TieMap);
var TieContactsPrototype = TieContacts.prototype;
/*
 * =TieContacts.prototype.add
 * */
TieContactsPrototype.add = function(nodes, as){
    if(!isArray(nodes)) nodes = [nodes];
    var that = this
        ,len = nodes.length
        ,node
        ;
    while(len--){
        node = nodes[len];
        //console.log(that ,node)
        if(as == "parent")
            that.set.call(that ,node.target ,new TieParentContact(node));
        else if(as == "child")
            that.set.call(that ,node.target ,new TieChildContact(node));
        else if(as == "binding")
            that.set.call(that ,node.target ,new TieBindingContact(node));
    }
}
/*
 * =TieContacts.prototype.get
 * */
TieContactsPrototype.get = function(as){
    var that = this
        ,ret = []
        ;
    forEach(that.values ,function (value ,index ,values) {
        if ( as == "parent" && value instanceof TieParentContact
            || as == "child" && value instanceof TieChildContact
            || as == "binding" && value instanceof TieBindingContact
        ) {
            ret.push(value)
        }
    })
    return ret
}
/*
 * =TieContacts.prototype.clear
 * */
TieContactsPrototype.clear = function(as){
    var that = this
        ,removeContacts = []
        ,len
        ;
    if(as){//remove all contact with give key
        that.forEach(function(contact, contactKey){
            if(as == contact.role) removeContacts.push(contactKey);
        })
        len = removeContacts.length;
        while(len--)
            that.remove(removeContacts[len]);
    }else
        that.superClass.clear.apply(that, arguments)
}
////test
//console.log(new TieMap);
//console.log((new TieContacts).get("parent"));
/*
 * =TieNode
 */
var TieNodes = new TieMap;
function TieNode(target, key, value, nodes){
    nodes = nodes || TieNodes;
    var node = nodes.get(target)//always absolute target match
        ,that = this
        ;
    if(node){
        return node;
    }else{
        that.target = target;
        that.key = key;
        that.value = value;
        that.contacts = new TieContacts;
        nodes.set(target, that);
        return that;
    }
}
var TieNodePrototype = TieNode.prototype;
/*
 * =TieNode.prototype.recevie
 * */
TieNodePrototype.receive = function(message, as, key, path, from){
    var that = this
        ,message = message || ""
        ,key = key || []//todo key is string...
        ,path = path || []
        ,pathLen = path.length
        ,contacts = that.contacts
        ,cycle = false
        ;
    //console.log(this,'\n', this.key, "receive:", key, path, "as", as)
    console.log("%c<- " + this.constructor.name + " " + this.key.join(".") , "color:hsla(10,50%,50%,1); background: hsla(120,50%,60%,.1);" ,"receive as" ,as)
    console.log("   with" ,{ this: this, message: message ,key: key ,path: path })

    //check circle
    while(pathLen--)
        if(path[pathLen] === that)
            cycle = true;
    if(!cycle){
        //update
        if(key.length == 0 && path.length !== 0)
            that.update.call(that ,message);
        //send contacts
        contacts.forEach(function(contact, contactKey){
            var contactAs = contact.as
                ,len = contactAs.length
                ,route = false
                ;
            if(key.length == 0 && path.length == 0 && as == undefined )
                route = true;
            else
                while(len--)
                    if(contactAs[len] == as){
                        route = true
                        break;
                    }
            if(route && from !== contact.node)
                that.send.call(that, message, key, path, contact);
        })
    }
}
/*
 * =TieNode.prototype.send
 * */
TieNodePrototype.send = function(message, key, path, to){
    var that = this
        ,message = message || ""
        ,key = to.handle.call(to, that.key, ArrayClone(key||[]))
        ,path = ArrayClone(path||[])
        ,as = to.role
        ,node = to.node
        ;
    if(key){//if key is wrong, stop
        path.push(that);
        console.log("%c-> " + this.constructor.name + " " + this.key.join(".") , "color:hsla(120,40%,45%,1); background: hsla(0,50%,60%,.1);" ,"send to" ,as )
        console.log("   with" ,{ message: message ,to: to.node ,key: key ,path: path })
        //console.log(this,'\n', this.key, "send   :", key, path, "to",  to.node.key)
        node.receive.call(node, message, as, key, path, that);
    }
}
/*
 * =TieNode.prototype.update
 * */
TieNodePrototype.update = function(value){
    console.log("TieNode update")
    var that = this
        ;
    that.value = value;
}
//test
////  parent1     parent2
////  ^:  ^'-------. ^:
////  ::  '-------.: ::
////  :v          :v :v
//// child1      child2
//var parent1 = new TieNode("parent1", "parent1")
//    ,parent2 = new TieNode("parent2", "parent2")
//    ,child1 = new TieNode("child1", "child1")
//    ,child2 = new TieNode("child2", "child2")
//    ;
//parent1.contacts.add(child1, "child");
//child1.contacts.add(parent1, "parent");
//parent2.contacts.add(child2, "child");
//child2.contacts.add(parent2, "parent");
//parent1.contacts.add(child2, "child");
//child2.contacts.add(parent1, "parent");
//console.log(parent1,parent2,child1,child2)
//parent1.contacts.clear("child")
/*
 * =Model
 */
var TieModels = new TieMap;
function TieModel(object, property){
    var value = object[property]
        ,model = TieModels.get({object: object, property: property})
        ;
    if (!model) {
        model = TieModel.superClass.constructor.call(
            this
            ,{object: object, property: property}
            ,[property]
            ,value
            ,TieModels
        )
        //set property
        //todo multi property description
        model.set(value);
        //notice itself report
        //if report in Model constructor, parent-child relationship is still unestablished
        //console.log('\nexcute report '+property+' : \n')
        //node.excute("report",object[property]);
        model.watch();
    }
    return model
}
extend(TieModel, TieNode);
var TieModelPrototype  = TieModel.prototype;
/*
 * =TieModel.prototype.watch
 * */
TieModelPrototype.watch = function(){
    var model = this
        ,target = model.target
        ,object = target.object
        ,property = target.property
        ;
    //todo watch more than once
    Object.defineProperty(object, property, {
        get: function(){
            return model.value
        }
        ,set: function(value){
            console.log("set")
            model.value = value;
            model.set(value);
            console.log('\nmodel receive with nothing: \n')
            model.receive(value);
        }
    });
}
////test
//var o = {p: {p1: {p2: "p2v"}}}
//var ma = new Model(o, "p");
//console.log(ma)
/*
 * =TieModel set
 * @about create model for all children, walk children, call children report with empty path
 * */
TieModelPrototype.set = function(object){
    var model = this
        ,key,childModel
        ;
    if(typeof(object) == "object"){
        //clear children
        model.contacts.clear("child");
        for(key in object){
            //model.setProperty(key, object[key]);
            //build parent child relationship
            childModel = new TieModel(object, key);
            model.contacts.add(childModel, "child");
            childModel.contacts.add(model, "parent");
            //copy exist relationship

            //if report in Model constructor, parent-child relationship is still unestablished, so report after estableish parent-child relationship again
            console.log('\n%c== model set:' ,"color: hsla(0,70%,50%,1)",object ,key)
            childModel.receive(object[key]);
        }
    }
    //
}
/*
 * =TieModel setProperty
 * @about create model for all children, walk children, call children report with empty path
 * *
TieModelPrototype.setProperty = function(property, value){
    var model = this
        ,object = model.value
        ,key,childModel
        ;
    //build parent child relationship
    object[property] = value;
    childModel = new TieModel(object, property);
    model.contacts.add(childModel, "child");
    childModel.contacts.add(model, "parent");
    //copy exist relationship

    //if report in Model constructor, parent-child relationship is still unestablished, so report after estableish parent-child relationship again
    console.log('\nmodel receive with nothing: \n')
    childModel.receive(object[property]);
    return childModel
}
/*
 * =TieModel getChildModel(path)
 * */
TieModelPrototype.getChildModel = function(path){
    var model = this
        ,len = path.length
        ,object = model.value
        ,property ,i
        ;
    for( i = 0 ;i < len ;i++) {
        property = path[i];
        model = model.contacts.get({object :object ,property :property}).node;
        object = object[property];
    }
    return model
}
//test
//var a = {p: {p1: {p2: "p2v"}}}
//    ,ma = new TieModel(a, "p")
//    ,mb = new TieModel({_p:1},"_p")
//    ;
//console.log(a);
//console.log(ma);
//window.testData = {
//    path : {
//        to : {
//            obj : {
//                key : "value"
//            }
//        }
//    }
//}
//var mdata = new TieModel(window, "testData")
//console.log(mdata)
//console.log(mdata.getChildModel(["path","to","obj","key"]))
//console.log(new TieModel(window, "test"))
//console.log("\n\rmodify p2v:\n\r")
//a.p.p1.p2 = "modify p2v"
//tips: never bind contact to a child node, whose parent can be modify
//ma.contacts.get(["p1"]).node.contacts.add(mb, "binding")
//console.log("\n\rmodify p1v:\n\r")
//a.p.p1 = {p2: "modify p1v p2v"}
//console.log("\n\rcontinue modify p2v:\n\r")
//a.p.p1.p2 = "continue modify p2v"
//console.log("\n\rma update:\n\r")
//ma.update("new value")
//testArray = [9,3];
//var m = new TieModel(window, "testArray");
//console.log(m);
//m.receive("message" ,"binding" ,["$index"] );
/*
 * =test
 */
//todo multi parent
//tieNode publish report update
//                                     +~~~~~~~+ ------------publish--------> +~~~~~~~+ +~~~~~~+
//                              .----->|   a   |==============================|   k   |\|  c2  |
//                            report   +~~~~~~~+ <-------.                    +~~~~~~~+ +~~~~~~+
//                              :      /   ^   \       report                 /   :   \
//                          .>+~~~~~~~+ report +~~~~~~~+ :            +~~~~~~~+ update +~~~~~~~+
//                      report|   b   |<-. '---|   c   | @            |   l   |<--'    |   m   |
//                          : +~~~~~~~+report  +~~~~~~~+ :new         +~~~~~~~+------. +~~~~~~~+
//                  publish : /       \  :         ^   \ v             /     \     update
//         +~~~~~~~+ ---> +~~~~~~~+ +~~~~~~~+   report +~~~~~~~+ +~~~~~~~+ +~~~~~~~+  :
//         |   d   |======|   e   | |   f   |<.    '---|   g   | |   n   | |   o   |<-'
//       .-+~~~~~~~+<-.   +~~~~~~~+ +~~~~~~~+ :        +~~~~~~~+ +~~~~~~~+ +~~~~~~~+--.
//    publish// \\ publish    publish:  ||    :                  /            ||   publish
//       v  //   \\   @              v  || publish           +~~~~~~~+    +~~~~~~~+  :
//     +~~~~~~~+ +~~~~~~~+          +~~~~~~~+ :              |   p   |    |   q   |<-'
//     |   h   | |   i   |          |   j   |@'              +~~~~~~~+    +~~~~~~~+
//     +~~~~~~~+ +~~~~~~~+          +~~~~~~~+


//var nodes = {};
//(function(arr){
//    var len = arr.length
//        ;
//    while(len--) nodes[arr[len]] = new TieNode(arr[len], [arr[len]]);
//})("a,b,d,e,f,g,h,i,j,k,l,m,n,o,p,q".split(","))
//function bind(a,b){
//    a.contacts.add(b, "binding");
//    b.contacts.add(a, "binding");
//}
//function link(a,b){
//    a.contacts.add(b, "child");
//    b.contacts.add(a, "parent");
//}
//var c = {}
//nodes["c"] = new TieNode(["c"], c);
//nodes["c2"] = new TieNode(["c"], c);
//link(nodes.k,nodes.c2);
//link(nodes.a,nodes.b);
//link(nodes.b,nodes.e);
//bind(nodes.e,nodes.d);
//bind(nodes.d,nodes.h);
//bind(nodes.d,nodes.i);
//link(nodes.b,nodes.f);
//bind(nodes.f,nodes.j);
//link(nodes.a,nodes.c);
//link(nodes.c,nodes.g);
//bind(nodes.a,nodes.k);
//link(nodes.k,nodes.l);
//link(nodes.l,nodes.n);
//link(nodes.n,nodes.p);
//link(nodes.l,nodes.o);
//bind(nodes.o,nodes.q);
//link(nodes.k,nodes.m);
//console.log(TieNodes)
//console.log(nodes)
////console.log('\nnodes.a receive as binding: \n')
////nodes.a.receive("message","","","binding");
////console.log('\nnodes.a receive as child: \n')
////nodes.a.receive("message","","","child");
////console.log('\nnodes.a receive as parent: \n')
////nodes.a.receive("message","","","parent");
////console.log('\nnodes.c receive as child: \n')
////nodes.c.receive("message", "", "", "child");
////console.log('\nnodes.c receive as parent: \n')
////nodes.c.receive("message", "", "", "parent");
////console.log('\nnodes.j.receive as binding: \n')
////nodes.j.receive("message", "", "", "binding");
////console.log('\nnodes.i.receive as binding: \n')
////nodes.i.receive("message", "", "", "binding");
////console.log('\nnodes.o.receive as parent: \n')
////nodes.o.receive("message", "", "", "parent");
////console.log('\nnodes.o.receive with nothing: \n')
////nodes.o.receive("message");
////console.log('\nnodes.o.receive as child: \n')
////nodes.o.receive("message", "", "", "child");
////console.log('\nnodes.o.receive as child: \n')
////nodes.o.receive("message", "", [nodes.l], "child");

////multi parent
////model
//var objects = {
//    a : {
//        b: {
//            e: "ev"
//            ,f: "fv"
//        }
//        ,c: {
//            g: "gv"
//        }
//    }
//    ,d : "dv"
//    ,h : "hv"
//    ,i : "iv"
//    ,j : "jv"
//    ,k : {
//        l: {
//            n: {
//                p: "pv"
//            }
//            ,o: "ov"
//        }
//        ,m: "mv"
//    }
//    ,q : "qv"
//}
//;
//var models = {};
//(function(arr){
//    var len = arr.length
//        ,key
//        ;
//    while(len--){
//        key = arr[len];
//        function walk(obj){
//            if(typeof(obj) === "object")
//                for(var k in obj){
//                    if(k === key){
//                        console.log("%ccreate model: "+key, "color: red")
//                        console.log(obj)
//                        models[key] = new TieModel(obj, key);
//                        break;
//                    }else{
//                        walk(obj[k])
//                    }
//                }
//        }
//        //search objects and create model
//        walk(objects)
//    }
////})("a,b".split(","))
//})("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q".split(","))
//models.c2 = new TieModel(objects.a,"c");
//console.log(objects)
//function bind(a,b){
//    a.contacts.add(b, "binding");
//    b.contacts.add(a, "binding");
//}
//function link(a,b){
//    a.contacts.add(b, "child");
//    b.contacts.add(a, "parent");
//}
//link(models.a,models.b);
//link(models.b,models.e);
//bind(models.e,models.d);
//bind(models.d,models.h);
//bind(models.d,models.i);
//link(models.b,models.f);
//bind(models.f,models.j);
//link(models.a,models.c);
//link(models.c,models.g);
//bind(models.a,models.k);
//link(models.k,models.l);
//link(models.l,models.n);
//link(models.n,models.p);
//link(models.l,models.o);
//bind(models.o,models.q);
//link(models.k,models.m);
//link(models.k, models.c2)
//console.log(models)
//
////console.log('\nmodels.a.receive as binding: \n')
////models.a.receive("message","","","binding");
////console.log('\nmodels.a.receive as parent: \n')
////models.a.receive("message", "", "", "parent");
////console.log('\nmodels.a.receive as child: \n')
////models.a.receive("new a", "", "", "child");
////console.log('\nmodels.j.receive as binding: \n')
////models.j.receive("message", "", "", "binding");
////console.log('\nmodels.i.receive as binding: \n')
////models.i.receive("message", "", "", "binding");
////console.log('\nmodels.c.receive as parent: \n')
////models.c.receive("message", "", "", "parent");
////console.log('\nmodels.o.receive as parent: \n')
////models.o.receive("message", "", "", "parent");
//
////console.log('\nobjects.a change: \n')
////objects.a = "modify a";
////console.log('\nobjects.j change: \n')
////models.j.receive("modify j", "", "", "parent");
////console.log('\nobjects.j change: \n')
////objects.j = "modify j";
////console.log('\nobjects.i change: \n')
////objects.i = "modify i";
////console.log('\nobjects.a.c change: \n')
////objects.a.c = "modify c";
////console.log('\nobjects.k.l.o change: \n')
////objects.k.l.o = "modify o";
//console.log('\nobjects.a.b change: \n')
//tips: never bind contact to a child node, whose parent can be modify, if do all contacts must be reestablished
//objects.a.b = {
//    e: "modify e"
//    ,f: "modify f"
//};
/*
 * =TieViewSet
 * */
var TieViewSet = {}
/*
 * =View
 */
var TieViews = TieViewSet.view = new TieMap;
function TieView(
    node
    ,attribute//String
    ,pathIndex//Number
    ,key//Array
    ,originValue
    ,value
    ,views
){
    var that = TieView.superClass.constructor.call(
            this
            ,{node: node, attribute: attribute, index : pathIndex }
            ,key
            ,value || ""
            ,views || TieViews
        )
        ,contacts = that.contacts
        ;
    //delete that.contacts; //use TieScopeView.prototype.contacts, get from dom tree
    Object.defineProperty(that, "contacts", {
        get : function(){
            var parent = this.target.node
                ,parentScopeViews
                ,parentRepeatViews
                ;
            //get parent scope view
            while(parent
                && !(parentScopeViews = TieScopeViews.get({node: parent}))
                && !(parentRepeatViews = TieRepeatViews.get({node: parent}))
            ) {
                parent = parent.parentElement
            }
            contacts.remove("parent");
            if(parentRepeatViews) {
                contacts.add(parentRepeatViews, "parent");
            }
            else if ( parentScopeViews ) {
                contacts.add(parentScopeViews, "parent");
            }
            return contacts
        }
        ,set : function(value){ contacts = value }
    })
    that.originValue = originValue;
    return that
}
extend(TieView, TieNode);
var TieViewPrototype  = TieView.prototype;
/*
 * =TieView.prototype.update
 * *
TieViewPrototype.update = function(){

}
/**/
/*
 * =TieView.prototype.send
 * */
TieViewPrototype.send = function(message, receivekey, path, to){
    var that = this
        ,has$index = false
        ,view = to.node
        ,viewKey = view.key
        ,originKey = ArrayClone(viewKey)
        ,$index
        ;
    forEach(viewKey ,function (item ,index ,viewKey) {
        if (item == "$index") {
            if (!has$index) {
                ////if has $index means parent repeat view's index
                var scopeView = view.contacts.get("parent")[0].node;
                if("prototype" in scopeView){
                    var instances = scopeView.prototype.instances;
                    forEach(instances ,function (instance ,index) {
                        if (instance == scopeView) {
                            $index = index + 1;
                            return false;
                        }
                    })
                }
                else if("instances" in scopeView) {
                    $index = 0;
                }
            }
            viewKey[index] = $index;
            has$index = true;
        }
    })

    TieView.superClass.send.apply(that,arguments);
    //restore view.key
    if (has$index) view.key = originKey;
}
////test
//var view = new TieView(document, "attribute.class", 0, ["a","b"], {})
//console.log(view)
//var view2 = new TieView(document, "attribute.class", 0, ["a","b"], {})
//console.log(view2)
//console.log(view2 == view)
//console.log(TieViews)
/*
 * =ScopeView
 */
//TieScopeView use a TieMap for efficiency
var TieScopeViews = TieViewSet.scope = new TieMap;
function TieScopeView(
    element
    ,attribute//String
    ,pathIndex//Number
    ,key//Array
    ,value
    ,views
){
    var that = TieScopeView.superClass.constructor.call(
            this
            ,element
            ,attribute
            ,pathIndex || 0
            ,key
            ,""
            ,value || ""
            ,views || TieScopeViews
        )
        ,contacts = that.contacts
        ;
    //delete that.contacts; //use TieScopeView.prototype.contacts, get from dom tree
    //getter setter chain
    Object.defineProperty(that, "contacts", {
        get : function(){
            var scopeView = this
                ,target = scopeView.target
                ,element = target.node
                ,parent = element.parentElement
                ,childNodes = element.childNodes
                ;

            //get childNodes scope view
            //todo need faster
            contacts.remove("child");
            walkTree(element,function(depth, path){
                var node = this
                    ,type,childViews,views
                    ;
                for(type in TieViewSet){
                    views = TieViewSet[type]
                    if(type == "scope" || type == "repeat"){//todo repeat and scope together
                        if(node !== element
                            && (childViews = views.get({ node: node }))
                        ){
                            contacts.add(childViews, "child");
                            return false
                        }
                    }
                    else if (childViews = views.get({ node: node })) {
                        contacts.add(childViews, "child");
                    }
                }
            })
            return contacts
        }
        ,set : function(value){ contacts = value }
    })
    return that
}
extend(TieScopeView, TieView);
var TieScopeViewPrototype  = TieScopeView.prototype;
/*
 * =TieScopeView.prototype.update
 * *
TieScopeViewPrototype.update = function(){
    TieScopeView.superClass.update.apply(this ,arguments);
}
/**/
////test
//setTimeout(function(){
//    var parent = document.getElementById("parent")
//    var parentScope = new TieScopeView(parent, "scope", 0, ["path","to","parent"], {parent: "parent"})
//    var child = document.getElementById("child")
//    var scope = new TieScopeView(child, "scope", 0, ["path","to","object"], {child: "child"})
//    console.log(scope)
//    console.log(TieScopeViews)
//    console.log(TieViewSet)
//},0)
////todo HTMLElement.tieScope -> new TieScopeView
////todo add root html scope view
/*
 * =RepeatView
 */
//TieRepeatView use a TieMap for efficiency
var TieRepeatViews = TieViewSet.repeat = new TieMap;
function TieRepeatView(
    element
    ,attribute//String
    ,pathIndex//Number
    ,key//Array
    ,value
    ,views
){
    var that = TieRepeatView.superClass.constructor.call(
            this
            ,element
            ,attribute
            ,pathIndex || 0
            ,key
            ,value || ""
            ,views || TieRepeatViews
        )
        ,contacts = that.contacts
        ;
    ////delete that.contacts; //use TieScopeView.prototype.contacts, get from dom tree
    //Object.defineProperty(that, "contacts", {
    //    get : function(){
    //        var scopeView = this
    //            ,target = scopeView.target
    //            ,element = target.node
    //            ,parent = element.parentElement
    //            ,childNodes = element.childNodes
    //            ,parentRepeatViews
    //            ;
    //        console.log(2)
    //        //get parent scope view
    //        while(parent
    //            && !(parentRepeatViews = TieRepeatViews.get({node: parent}))
    //        )
    //            parent = parent.parentElement
    //        contacts.remove("parent");
    //        console.log(contacts)
    //        //if(parentRepeatViews) contacts.add(parentRepeatViews, "parent");

    //        //get childNodes scope view
    //        //todo need faster
    //        contacts.remove("child");
    //        walkTree(element,function(depth, path){
    //            var node = this
    //                ,type,childViews,views
    //                ;
    //            for(type in TieViewSet){
    //                views = TieViewSet[type]
    //                if(type == "scope" || type == "repeat"){//todo repeat and scope together
    //                    if(node !== element
    //                        && (childViews = views.get({ node: node }))
    //                    ){
    //                        contacts.add(childViews, "child");
    //                        return false
    //                    }
    //                }
    //                else if (childViews = views.get({ node: node })) {
    //                    contacts.add(childViews, "child");
    //                }
    //            }
    //        })
    //        return contacts
    //    }
    //    ,set : function(value){ contacts = value }
    //})

    return that
}
extend(TieRepeatView, TieScopeView);
var TieRepeatViewPrototype  = TieRepeatView.prototype;
/*
 * =TieRepeatView.prototype.update
 * */
TieRepeatViewPrototype.update = function(array){
    TieRepeatView.superClass.update.apply(this ,arguments);
    console.log("repeat view update")
    var that = this
        ,target = that.target
        ,node = target.node
        ,len = array.length
        ,lastInstance = node
        ,instances ,i ,newNode
        ;
    if(!("prototype" in that)) {//new view or view with instance property
        if(!("instances" in that)) {
            instances = that.instances = [];
        }
        for ( i = 1 ;i < len ;i++) {
            if ( instances[i-1] ) {
                lastInstance = instances[i-1];
            }else {
                newNode = node.cloneNode(true);
                lastInstance.parentNode.insertBefore(newNode, lastInstance.nextSibling);
                generateViews(newNode);
                TieRepeatViews.get({node: newNode}).prototype = that;
                instances.push(TieRepeatViews.get({node: newNode}));
                lastInstance = newNode;
            }
        }
    }
    //delete more
    len -= 2;
    if(len>0) while(++len<instances.length){//extra instance
        lastInstance    = instances[len];
        //todo remove models and views
        lastInstance.parentNode.removeChild(lastInstance);
        removeViews(lastInstance);
        instances[len] = undefined;
    }
}
/*
 * =TieAttributeView
 */
//TieScopeView use a TieMap for efficiency
var TieAttributeViews = TieViewSet.attribute = new TieMap;
function TieAttributeView(
    element
    ,attribute//String
    ,pathIndex//Number
    ,key//Array
    ,originValue
    ,value
    ,attributeViews
){
    var that = TieAttributeView.superClass.constructor.call(
            this
            ,element
            ,attribute
            ,pathIndex
            ,key
            ,originValue
            ,value || ""
            ,attributeViews || TieAttributeViews
        )
        ;

    return that
}
extend(TieAttributeView, TieView);
var TieAttributeViewPrototype  = TieAttributeView.prototype;
/*
 * =TieAttrubuteView.prototype.update
 * *
TieAttributeViewPrototype.update = function(){
    TieAttributeView.superClass.update.apply(this ,arguments);
    console.log("TieAttributeView update")
}
/**/
////test
//setTimeout(function(){
//    var parent = document.getElementById("parent")
//    var parentScope = new TieScopeView(parent, "scope", 0, ["path","to","parent"], {parent: "parent"})
//    var child = document.getElementById("child")
//    var attr = new TieAttributeView(child, "attribute", 0, ["path","to","child"], "attribute")
//    console.log(parentScope)
//    console.log(attr)
//    console.log(TieScopeViews)
//    console.log(TieViewSet)
//},0)
//
/*
 * =TieAttributeView
 */
//TieScopeView use a TieMap for efficiency
var TieAttributeClassViews = TieViewSet.attributeClass = new TieMap;
function TieAttributeClassView(
    element
    ,attribute//String
    ,pathIndex//Number
    ,key//Array
    ,value
){
    var that = TieAttributeClassView.superClass.constructor.call(
            this
            ,element
            ,attribute
            ,pathIndex
            ,key
            ,element.className
            ,value || ""
            ,TieAttributeClassViews
        )
        ;
    return that
}
extend(TieAttributeClassView, TieAttributeView);
var TieAttributeClassViewPrototype  = TieAttributeClassView.prototype;
/*
 * =TieAttrubuteClassView.prototype.update
 * */
TieAttributeClassViewPrototype.update = function(message){
    TieAttributeClassView.superClass.update.apply(this ,arguments);
    console.log("TieAttributeClassView update")
    var that = this
        ,target = that.target
        ,node = target.node
        ,attribute = node.getAttributeNode(target.attribute)
        ,value
        ;
    value = parseTemplate(
        attribute.nodeValue
        ,function(path ,index){
            var view = TieAttributeClassViews.get({ node : node ,index: index});
            console.log(view)
            if(view) {
                return view.value
            }
            else {
                return ""
            }
        }
        ,function(str ,index){
            return str
        }
    ).join("");
    console.log(value, attribute.nodeValue, TieAttributeClassViews)
    node.className = (that.originValue + ' ' + value)
        .replace(/ +/g,' ')
        .replace(/^\s+|\s+$/g, '')
    ;
}
/*
 * =TieTextNodeView
 */
//TieScopeView use a TieMap for efficiency
var TieTextNodeViews = TieViewSet.textNode = new TieMap;
function TieTextNodeView(
    node
    ,pathIndex//Number
    ,key//Array
    ,originValue
    ,value
){
    var that = TieTextNodeView.superClass.constructor.call(
            this
            ,node
            ,'nodeValue'
            ,pathIndex
            ,key
            ,originValue
            ,value || ""
            ,TieTextNodeViews
        )
        ;

    return that
}
extend(TieTextNodeView, TieView);
var TieTextNodeViewPrototype  = TieTextNodeView.prototype;
/*
 * =TieAttrubuteClassView.prototype.update
 * */
TieTextNodeViewPrototype.update = function(message){
    TieTextNodeView.superClass.update.apply(this ,arguments);
    console.log("update textNode with ", message)
    var that = this
        ,target = that.target
        ,node = target.node
        ;
    node.nodeValue = parseTemplate(
        that.originValue
        ,function(path ,index){
            var view = TieTextNodeViews.get({ node : node ,index: index});
            if(view) {
                return view.value
            }
            else {
                return ""
            }
        }
        ,function(str ,index){
            return str
        }
    ).join("");
}
/**/
//bootstrape
setTimeout(function(){
    //root model
    var win = window
        ,rootModel = new TieModel(win, "tieRootModel")
        ,rootView = new TieScopeView(
            document.documentElement
            ,"data-bind-scope"//String
            ,0//Number
            ,["tieRootView"]//Array
            ,win
        )
        ;
    rootModel.value = win;
    rootModel.contacts.add(rootView ,"binding")
    rootView.contacts.add(rootModel,"binding")
    //console.log(rootModel, rootView)
    generateViews(document.body);
    generateModels(document.body ,rootModel);
    console.log(rootView)
    console.log(rootModel)
})
/**/
//todo contacts get with cache
//})(document, window)
