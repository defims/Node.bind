(function(document, window, undefined){
/*
 * =flag
 * scope flag => data-scope node.scope
 * view flag => node.views []
 * repeat flag => data-repeat
 *
 *
 * scope:
 *  +-------------------------------------------------------------------------------+
 *  |   <li data-repeat="{{array}}" data-attr-src="{{$index.foo.bar}}.jpg"></li>    |
 *  +-------------------------------------------------------------------------------+
 *  +-------------------------------------------+
 *  |   <div><!--node.scope=object-->           |
 *  |       {{a.b.c}} + {{a.b.d}} = {{a.b.e}}   |
 *  |       <span>{{a.b.f}}</span>              |
 *  |   </div>                                  |
 *  +-------------------------------------------+
 *
 *
 * view:
 *      +--------------------------+    +----------------------------------------+
 *  <li | data-repeat="{{repeat}}" |    | data-attr-src="{{$index.foo.bar}}.jpg" | ></li>
 *      +--------------------------+    +----------------------------------------+
 *  <div><!--node.scope=object-->
 *      +-----------------------------------+
 *      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
 *      +-----------------------------------+
 *            +---------+
 *      <span>|{{a.b.f}}|</span>
 *            +---------+
 *  </div>
 *
 *
 *
 * template:
 *                   +---------+                 +----------------------+
 *  <li data-repeat="|{{array}}|" data-attr-src="|{{$index.foo.bar}}.jpg|" ></li>
 *                   +---------+                 +----------------------+
 *  <div><!--node.scope=object-->
 *      +-----------------------------------+
 *      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
 *      +-----------------------------------+
 *            +---------+
 *      <span>|{{a.b.f}}|</span>
 *            +---------+
 *  </div>
 *
 *
 *
 * path:
 *                     +-----+                     +--------------+
 *  <li data-repeat="{{|array|}}" data-attr-src="{{|$index.foo.bar|}}.jpg" ></li>
 *                     +-----+                     +--------------+
 *  <div><!--node.scope=object-->
 *        +-----+       +-----+         +-----+
 *      {{|a.b.c|}} + {{|a.b.d|}}   = {{|a.b.e|}}
 *        +-----+       +-----+         +-----+
 *              +-----+
 *      <span>{{|a.b.f|}}</span>
 *              +-----+
 *  </div>
 *
 * node add:
 * nbScope
 * nbViews
 * nbModels
 *
 * circle:
 *
 * View --> Model
 * view change --> view.change --> match model --> model.update
 *
 * View <-- Model
 * model change --> model.change --> match view --> view.render
 *
 * Model --> Model
 * model change --> model.change --> match model --> model.update
 * */
/*
 * =utility
 * */
var utility = {}
/*
 *  =utility.path2Array
 *  @param  path        {String}
 *  @return pathArray   {Array}
 * */
utility.path2Array  = function(path){
    return path.replace(/^\[/g,'').replace(/\[/g,'.').replace(/\]/g,'').split('.');
}
/*
 * =Filter
 * */
function Filter(filter){

}
var FilterPrototype = Filter.prototype;
/*
 * =Filter.prototype.render
 * */
FilterPrototype.render  = function(){

}
/*
 * =Filter.prototype.compile
 * */
FilterPrototype.compile = function(){

}
/*
 * =Item
 * */
function Item(item){
    var self = this;
    self.origin = item;//$index
}
var ItemPrototype   = Item.prototype;
/*
 * =Item.prototype.get
 * @about   get value from node for example: $index + node --> 0
 * */
ItemPrototype.getValue   = function(node){
    var self    = this
        ,origin = self.origin
        ,result
        ;
    if(origin == "$index"){
        //get from node
        var find        = false
            ,scopeNode  = node
            ;
        //find scope node
        while(scopeNode){
            if(scopeNode.nbPrototype || scopeNode.nbInstances){
                find    = true;
                break;
            }
            scopeNode    = scopeNode.parentElement;
        }
        result = 0;
        //get $index
        if(find && scopeNode.nbPrototype){
            while(scopeNode){
                if ( scopeNode.nbPrototype ) result --;
                if ( scopeNode.nbInstances ) break;
                scopeNode   = scopeNode.previousSibling;//get previous instance
            }
            result = -result;
        }
    }else{
        result  = origin
    }
    return result
}
/*
 * =Path
 * @filter  each path has its own filter
 * */
function Path(path){
    var self        = this
        ,splitPath  = path.split('|')
        ,path       = splitPath[0]
        ,filter     = splitPath[1]
        ;
    self.origin = path;                 //"$index.foo.bar|Number"
    self.path   = '';                   //"$index.foo.bar"
    self.filter = new Filter(filter);   //"Number"
    self.parsed = self.parse(path);     //[Item, "foo", "bar"]
};
var PathPrototype   = Path.prototype;
/*
 * =Path.prototype.set
 * @about   set origin = path --> path.parse(path) --> bind path
 * */
PathPrototype.set   = function(path){

}
/*
 * =Path.prototype.get
 * @about   path.getObjectProperty then return object[property] for example: scope + parsed:[Item, "foo", "bar"] --> scope[0].foo.bar --> "value"
 * */
PathPrototype.getValue = function(node, scope){
    var self        = this
        ,objProp    = self.getObjectProperty(node, scope)
        ;
    return objProp.object[objProp.property] || ''
}
/*
 * =Path.prototype.setValue
 * @about         path.getObjectProperty from scope then set object[property] = value
 * */
PathPrototype.setValue = function(node, scope, value){
}
/*
 * =Path.prototype.parse
 * @about   parse path for example "$index.foo.bar" --> [Item, "foo", "bar"]
 *          path.bind model
 * */
PathPrototype.parse = function(path){
    var pathArr = utility.path2Array(path)
        ,len    = pathArr.length
        ,item;
    while(len--){
        item    = pathArr[len];
        if(item.charAt(0) == '$') pathArr[len] = new Item(item);
    }
    return pathArr
}
/*
 * =Path.prototype.bind
 * @about   path.getObjectProperty then generate binding [model, view]
 * */
PathPrototype.bind  = function(view, node, scope){
    var self        = this
        ,objProp    = self.getObjectProperty(node, scope)
        ;
    NodeBind.bindings.bind(objProp.object, objProp.property, view);
}
/*
 * =Path.prototype.unbind
 * @about   path.getObjectProperty then remove binding binding[model, View], and return binding
 * */
PathPrototype.unbind  = function(view, scope){
}
/*
 * =Path.prototype.getObjectProperty
 * @about   walk all items and Item.get() --> get object property from scope, node is used in Item
 * */
PathPrototype.getObjectProperty = function(node, scope){
    var self        = this
        ,parsedPath = self.parsed
        ,len        = parsedPath.length - 1
        ,object     = scope
        ,item       = parsedPath[len]
        ,property   = item
        ,i
        ;
        if(item.getValue) property = item.getValue(node)
    for( i=0; i<len; i++){
        item    = parsedPath[i];
        if(item.getValue) item = item.getValue(node);
        object = object[item]
        if(!object) return {"object": {}, "property": undefined}
    }
    return {"object": object, "property": property}
}
/*
 * Template
 * */
function Template(template){
    var self    = this;
    self.origin = template;//"{{$index.foo.bar}} is {{obj.prop}}"
    self.parsed = self.parse(template);//[Path," is ",Path]
}
var TemplatePrototype   = Template.prototype;
/*
 * =Template.prototype.set
 * @about   set template.origin = template --> parse template.origin
 * */
TemplatePrototype.set   = function(template){
    
}
/*
 * =Template.prototype.get
 * @about   get scope --> walk path and call path.get(node, scope) --> join Template.parsed for example: [Path," is ",Path] --> ["value", " is ", "nice"]
 *          Path value can be object
 * */
TemplatePrototype.getValue   = function(node, scope){
    var self            = this
        ,parsedTemplate = self.parsed
        ,len            = parsedTemplate.length
        ,result         = []
        ,scope          = scope || self.getScope(node)
        ,path
        ;
    while(len--){
        path = parsedTemplate[len];
        if(path.getValue) path = path.getValue(node, scope);
        result.unshift(path);
    }
    if(result.length) return result//NodeBind(node(s), 'directive', scope, 'template')
    else return [scope]//NodeBind(node(s), 'directive', scope, '') or NodeBind(node(s), 'directive', scope)
    //always return array
}
/*
 * =Template.prototype.setValue
 * @about   matchset for example origin: "{{$index.foo.bar}} is {{obj.prop}}" --> get path "{{$index.foo.bar}}" and path.setValue(value)
 * */
TemplatePrototype.setValue   = function(value){

}
/*
 * =Template.prototype.get scope
 * @about   all child paths owns same scope
 * */
TemplatePrototype.getScope  = function(node){
    var find    = false
        ,win    = window
        ,scope
        ;
    while(node){
        scope   = node.nbScope;
        if(scope){
            find    = true;
            break;
        }
        node    = node.parentElement;
    }
    if(!find){
        win.nbScope = win
        scope       = win.nbScope;
    }
    return scope
}
/*
 * =Template.prototype.parse
 * @about   parse value for example "{{$index.foo.bar}} is {{obj.prop}}" --> [Path, " is ", Path]
 * */
TemplatePrototype.parse = function(str){
    var len     = str.length,
        parsed  = [],
        item    = '',
        isIn    = false,
        letter;
    while(len--){
        letter  = str[len];
        if(isIn && letter == '{' && str[len-1] == '{'){//out
            len--;
            if(item) parsed.unshift(new Path(item));
            item    = '';
            isIn    = false;
        }else if(!isIn && letter == '}' && str[len-1] == '}'){//in
            len--;
            if(item) parsed.unshift(item);
            item    = '';
            isIn    = true;
        }else{
            item    = letter + item;
        }
    }
    return parsed
}
/*
 * =Template.prototype.bind
 * @about   template.getScope --> walk all path and call path.bind(view, scope) --> return bindings
 * */
TemplatePrototype.bind  = function(view, node){
    var self            = this
        ,parsedTemplate = view.template.parsed
        ,len            = parsedTemplate.length
        ,scope          = view.scope || self.getScope(node)
        ,path
        ;
    while(len--){
        path    = parsedTemplate[len];
        if(path.bind) path.bind(view, node, scope);
    }
}
/*
 * =Template.prototype.getObjectProperty
 * @about   get all path's object property
 * */
TemplatePrototype.getObjectProperty  = function(view, node){
    var self            = this
        ,parsedTemplate = view.template.parsed
        ,len            = parsedTemplate.length
        ,scope          = view.scope || self.getScope(node)
        ,objProps       = []
        ,path
        ;
    while(len--){
        path    = parsedTemplate[len];
        if(path.bind) objProps.push(path.getObjectProperty(node, scope));
    }
    if(objProps.length) return objProps//NodeBind(node(s), 'directive', scope, 'template')
    else return [{"object": scope, "property": ''}]//NodeBind(node(s), 'directive', scope, '') or NodeBind(node(s), 'directive', scope
}
/*
 * =Template.prototype.unbind
 * @about   walk all path and call path.unbind(view, scope)
 * */
TemplatePrototype.unbind    = function(view){

}
/*
 * =Directive
 * */
function Directive(directive){
    var self    = this;
    self.origin = directive;
    self.parsed = self.parse(directive);
}
var DirectivePrototype  = Directive.prototype;
/*
 * =Direcitve.prototype.parse
 * @about   "attribute.style.top" --> {type: "attribute", detail: ["style","top"]}
 * */
DirectivePrototype.parse    = function(directive){
    var directiveArr   = utility.path2Array(directive);
    return {
        "type"      : directiveArr.shift(),
        "detail"    : directiveArr
    }
}
//console.log(new Directive("attribute.style.top"))
//{
//  origin: "attribute.style.top"
//  ,parsed: {
//      type    : "attribute"
//      ,detail : ["style", "top"]
//  }
//}
/*
 * =View
 * @about   View <-- Template: "{{$index.foo.bar}} is {{obj.prop}}" <-- Path: "$index.foo.bar" <-- Item: 0
 *          node.nbViews will store views
 *          since view use refresh technology, setTimeout can be use for refresh like kindle
 *          keep global unique always
 *          view member can be store in element dataset like data-nb-attribute-style-top="{{foo.bar}}em", data-nb-directive="template", and other node will be data-nb-childnode-1-directive="template", which is used for coping
 * */
function View(node, directive, scope, template){
    var self        = this;
    self.node       = node;
    self.scope      = scope;
    self.directive  = new Directive(directive);
    self.template   = new Template(template);
    self.bindings   = [];
    self.refreshListener();
    //self.refresh();
}
var ViewPrototype   = View.prototype;
/*
 * =View.prototype.set
 * */
ViewPrototype.set   = function(node, directive, scope, template){

}
/*
 * =View.prototype.refresh
 * @about   View.render and View.bind
 * *
ViewPrototype.refresh   = function(){
    var self = this;
    self.render();
    //model.bind(view, view.refresh);
}
/*
 * =View.prototype.render
 * @about   according directive render template.get()
 *          if directive.type is repeat, keep instances number --> clone models and views to new instance with new node --> two way bind model and view --> find and set scope
 * */
ViewPrototype.render    = function(){//according to directive.type,render view.
    var self                = this
        ,node               = self.node
        ,nodeType           = node.nodeType
        ,parsedDirective    = self.directive.parsed
        ,type               = parsedDirective.type.toLowerCase()
        ,detail             = parsedDirective.detail
        ,template           = self.template
        ,value              = template.getValue(node, self.scope)
        ,ELEMENT_NODE       = 1
        ,TEXT_NODE          = 3
        ;
    if(type == "scope"){
        if(nodeType == ELEMENT_NODE){
            value   = value[0];
            NodeBind.setTreeScope(node, value);//for absolute scope
        }
    }else if(type == "repeat"){
        value   = value[0];//todo multi template
        var len         = value.length
            ,instances  = node.nbInstances  = node.nbInstances || []
            ,i,item,newNode
            ;

        //todo when node is textNode
        for(i=0; i<len; i++){
            if(i==0){//prototype
                lastInstance    = node;
                //set scope
                NodeBind.setTreeScope(lastInstance, value);
            }else if(instances[i-1]){//exist instance
                lastInstance    = instances[i-1];
                //set scope
                NodeBind.setTreeScope(lastInstance, value);
            }else{//new instance
                //clone node tree
                newNode             = node.cloneNode(true);
                lastInstance.parentNode.insertBefore(newNode, lastInstance.nextSibling);
                newNode.nbPrototype = node;
                newNode.nbScope     = node.nbScope;
                instances.push(newNode);
                //walk all child nodes and copy models and views --> render
                NodeBind.walkTree(node, function(depth, path){
                    var currNode    = this
                        ,nbViews,viewsLen,nbView,pathLen,i,currNewNode
                        ;
                    if(currNode != node && (nbViews = currNode.nbViews)){
                        //find match node in new node
                        currNewNode = newNode;
                        for(i=0,pathLen = path.length; i<pathLen; i++)
                            currNewNode = currNewNode.childNodes[path[i]];
                        viewsLen    = nbViews.length;
                        while(viewsLen--){
                            nbView  = nbViews[viewsLen];
                            //create and bind view model for current new node, it will cause render
                            NodeBind.core(
                                currNewNode
                                ,nbView.directive.origin
                                ,nbView.scope
                                ,nbView.template.origin
                            )
                        }
                    }
                })
                lastInstance = newNode;
            }
        }
        //delete more
        len -= 2;
        while(++len<instances.length){//extra instance
            lastInstance    = instances[len];
            //todo remove models and views
            lastInstance.parentNode.removeChild(lastInstance)
            instances[len] = undefined;
        }
    }else if(type == "textcontent"){
        value   = value.join('');
        if(nodeType == ELEMENT_NODE){
            if(node.textContent != value) node.textContent  = value;
        }else if(nodeType == TEXT_NODE){
            if(node.nodeValue != value) node.nodeValue = value;
        }
    }else if(type == "attribute"){
        if(nodeType == ELEMENT_NODE){
            var attribute   = detail[0];
            if(attribute == 'id' && node.id != value){//attribute.id
                node.id = value;
            }else if(attribute == 'class'){//attribute.class
                var len     = value.length
                    ,result = []
                    ,attrItem, attrType
                    ;
                while(len--){
                    attrItem    = value[len];
                    attrType    = Object.prototype.toString.call(attrItem);
                    if( attrType === '[object Array]' ){//['class1', 'class2']
                        result.push(attrItem.join(' '))
                    }else if( attrType === '[object Object]' ){//{'a': 'class1', 'b': 'class2'}
                        var str = ''
                            ,k
                            ;
                        for(k in attrItem) str += ' ' + attrItem[k];
                        result.push(str)
                    }else{
                        result.push(attrItem)
                    }
                }
                if( node.className != result ) node.className = result;
            }else if(attribute == 'style'){//attribute.style
                console.log(value,node.style)
                if(detail[1]){//attributes.style.*
                    var valueLen    = value.length
                        ,detailLen  = detail.length - 1
                        ,style      = node.style
                        ,lastItem   = detail[detailLen]
                        ,item,i,style,lastItem
                        ;
                    //search all and set style for example ['1em','2em']
                    //template is [path, '2em']
                    //which means the first item is observable, the second is fixed, sometimes it's useful
                    //search style attribute
                    for(i=1; i<detailLen; i++) style = style[detail[i]];
                    while(valueLen--) style[lastItem]  = value[valueLen];
                }else{//attributes.style
                    var len = value.length
                        ,item
                        ;
                    //search all and set style for example ['display: block','width: 2em']
                    //template is [path, 'width: 2em']
                    //which means the first item is observable, the second is fixed, sometimes it's useful
                    while(len--){
                        item    = value[len];
                        if(typeof(item) == 'string'){//'display:block; width:2em;'
                            var v   = item.split(';')
                                ,l  = v.length
                                ,item2
                                ;
                            while(l--){
                                item2    = v[l].split(':');
                                node.style[item2[0].replace(' ','')]  = item2[1];
                            }
                        }else if(Object.prototype.toString.call(item) == '[object Object]'){
                        //{"display": 'block', 'width': '2em'}
                            var k;
                            for(k in item) node.style[k] = item[k];
                        }
                        //array will be ignored
                    }
                }
            }else if(attribute == 'value'){//attribute.value
                node.value  = value
            }else{//attribute.other
                var detailLen   = detail.length - 1
                    ,valueLen   = value.length
                    ,attribute  = node.attributes
                    ,lastItem   = detail[detailLen]
                    ,i,item
                    ;
                for(i=0; i<detailLen; i++){
                    item    = detail[i];
                    if(!attribute[item]) attribute[item] = {};
                    attribute = attribute[item];
                }
                while(valueLen--) attribute[lastItem]    = value[valueLen];
            }
        }else if(nodeType == TEXT_NODE){
            //if(node.nodeValue != value) node.nodeValue = value;
        }
    }else if(type == "dataset"){
        var detailLen   = detail.length
            ,valueLen   = value.length
            ,key        = detail[0]
            ,i
            ;
        for(i=1; i<detailLen; i++)  key += '-'+detail[i];
        while(valueLen--) node.setAttribute('data-'+key, value[valueLen])
    }else if(type == "event"){
        var valueLen    = value.length
            ,events     = node.nbEvents = node.nbEvents || []
            ,eventName  = detail[0]
            ,item
            ;
        //delete old events
        while(events.length) node.removeEventListener(eventName, events.pop());
        while(valueLen--){
            item    = value[valueLen];
            if(typeof(item) == 'function'){
                events.push(item);
                node.addEventListener(eventName, item);
            }
        }
    }else if(type == "nodevalue"){
        value   = value.join('');
        if(nodeType == ELEMENT_NODE){
            if(node.textContent != value) node.nodeValue    = value;
        }else if(nodeType == TEXT_NODE){
            if(node.nodeValue != value) node.nodeValue = value;
        }
    }
}
/*
 * =Model.prototype.getBinding
 * @about   get binding from model.bindings and match target key
 * */
ViewPrototype.getBinding   = function(target){
    var self        = this
        ,bindings   = self.bindings
        ,len        = bindings.length
        ,has        = false
        ,binding
        ;
    while(len--){
        binding = bindings[len];
        if(binding.target == target){
            has = true;
            break;
        }
    }
    if(!has){
        binding = {
            "target"    : target
            ,"callback" : undefined
        }
        bindings.push(binding)
    }
    return binding
}
/*
 * =View.prototype.bind
 * @about   put into view.bindings for call when view.change
 *          A <- B if B change call A's function --> B.bind(A)
 * * */
ViewPrototype.bind  = function(target, callback){
    var self        = this
        ,binding    = self.getBinding(target)
        ;
    binding.callback    = callback;
}
/*
 * =View.prototype.unbind
 * @about   remove from view.bindings
 * */
ViewPrototype.unbind    = function(target){

}
/*
 * =View.prototype.getObjectProperty
 * @about   get all object and Property, template.getObjectProperty <-- path.getObjectProperty
 * */
ViewPrototype.getObjectProperty  = function(){
     var self                = this
        ,node               = self.node
        ;
    return self.template.getObjectProperty(self, node);
}
/*
 * =View.prototype.change
 * @about   if view change, view.change will be called
 *          change template.origin to RegExp --> get path match value --> match binding in bindings --> call binding.callback
 * */
ViewPrototype.change    = function(){

}
/*
 * =View.prototype.refreshListener
 * @about   refresh listener
 *          if rerange elements --> moved scope change
 * */
ViewPrototype.refreshListener   = function(){

}
var models  = [];
/*
 * =Model
 * @about   keep global unique always
 * */
function Model(object, property){
    var len         = models.length
        ,self       = this
        ,model
        ;
    //model must be singleton
    while(len--){
        model   = models[len];
        if(model.object == object && model.property == property) return model
    }
    self.object     = object;
    self.property   = property;
    self.bindings   = [];//[target: view|model, callback: render|update]
    self.refreshListener();
    models.push(self);
}
var ModelPrototype  = Model.prototype;
/*
 * =Model.prototype.get
 * @about   return model.object[model.property]
 * */
ModelPrototype.get  = function(){

}
/*
 * =Model.prototype.set
 * @about   set model.object[model.property] = value
 * */
ModelPrototype.set  = function(value){

}
/*
 * =Model.prototype.update
 * @about   this method is used in other target's binding[target: target, callback: update] for calling back
 *          this method can be override, for complex need.
 * */
ModelPrototype.update   = function(){//model.object[model.property] = value;

}
/*
 * =Model.prototype.change
 * @about   if model change model.this method will be call
 * */
ModelPrototype.change   = function(){
    var self    = this
        ,bindings   = self.bindings
        ,len        = bindings.length
        ,binding
        ;
    while(len--){
        binding = bindings[len];
        binding.callback.call(binding.target)//render
    }
}
/*
 * =Observable Array Property
 * @about   use observable fallback will be slow in generate ObservableArrayPrototype
 * *
function ObservableArrayPrototype(){
    var len             = 99//99999
    //http://exodia.net/javascript/2013/06/21/V8%E5%BC%95%E6%93%8E%E5%AF%B9JS%E6%95%B0%E7%BB%84%E7%9A%84%E4%B8%80%E4%BA%9B%E5%AE%9E%E7%8E%B0%E4%BC%98%E5%8C%96.html
    //Math.pow(2, 32) - 1 will be the max, but it's too slow
        ,self           = this
        ,defineProperty = Object.defineProperty
        ;
    //console.time('observable Array Prototype');
    //console.profile('observable Array Prototype');
    while(len--) defineProperty(self, len, {
        set    : (function(len){
            return function(value){
                console.log('set [i]',this,value,value.index,value.value)
                this.length = {
                    'flag'      : 'NodeBind_new_item'
                    ,'length'   : len + 1
                    ,'value'    : value
                }
            }
        })(len)
    });
    //console.profileEnd('observable Array Prototype');
    //console.timeEnd('observable Array Prototype');
}
ObservableArrayPrototype.prototype   = Array.prototype;
ObservableArrayPrototype.constructor = Array;
/*
 * =Observable Array
 * *
function ObservableArray(array, callback){
    var len         = array.length
        ,_length    = 0
        ,self       = this
        ,item
        ;

    Object.defineProperty(self, 'length',{
        get: function(){ return _length },
        set: function(value){
            //console.log('set length',value,value.value)
            var oldLength   = _length;
            if(value.flag && value.flag == 'NodeBind_new_item'){
                //self[value.length-1] = value.value;
                var length      = value.length
                    ,firstSet   = false
                    ,desc
                    ;
                value       = value.value;
                if(value.flag && value.flag == 'NodeBind_first_set'){
                    value       = value.value;
                    firstSet    = true;
                }
                desc    = Object.getOwnPropertyDescriptor(self, length-1);
                if(!(desc && desc.set))
                Object.defineProperty(self, length-1, {
                    value           : value
                    ,writable       : true
                    ,enumerable     : true
                    ,configurable   : true
                })
                _length = length;
                if(!firstSet) callback.call(self);
            }else{
                _length = value;
            }
        }
    })
    while(len--){
        self[len]  = {
            "flag"      : "NodeBind_first_set"
            ,"value"    : array[len]
        }
        console.log(len, self, self[len])
    }
    console.log(self)
    //notice new once
    self.length = array.length
}
ObservableArray.prototype   = new ObservableArrayPrototype;
ObservableArray.constructor = ObservableArrayPrototype;
//window.ArrayObserve = ArrayObserve;
/**
var a = [1,2,4];
var b = new ObservableArray(a, function(){
    console.log(this, 'change')
});
console.log(b)
setTimeout(function(){
    b[5] = 'new value'
},300)
/**/

/*
 * dirty check with event loop callback inject
 * /

/*
 * =check if a and b is equal
 * */
function isEqual(a, b) {
    var p, t;
    if(typeof a === 'object' && typeof b === 'object'){
        for (p in a) {
          if (typeof b[p] === 'undefined') return false;
          if (b[p] && !a[p]) return false;
          t = typeof a[p];
          if (t === 'object' && !isEqual(a[p], b[p])) return false;
          if (t === 'function' && (typeof b[p] === 'undefined' || a[p].toString() !== b[p].toString()))
            return false;
          if (a[p] !== b[p]) return false;
        }
        for (p in b)
          if (typeof a[p] === 'undefined') return false;

        return true;
    }else return a === b
};
/*
 * =clone
 * */
function clone(src){
    function mixin(dest, source, copyFunc) {
        var name, s, i, empty = {};
        for(name in source){
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.  For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype
            s = source[name];
            if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }
        return dest;
    }

    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]")
        // null, undefined, any non-object, or function
        return src; // anything

    //if(src.nodeType && "cloneNode" in src){
    //    // DOM Node
    //    return src.cloneNode(true); // Node
    //}
    if(src instanceof Date){
        // Date
        return new Date(src.getTime()); // Date
    }
    if(src instanceof RegExp){
        // RegExp
        return new RegExp(src);   // RegExp
    }
    var r, i, l;
    if(src instanceof Array){
        // array
        r = [];
        for(i = 0, l = src.length; i < l; ++i){
            if(i in src){
                r.push(clone(src[i]));
            }
        }
        // we don't clone functions for performance reasons
        //      }else if(d.isFunction(src)){
        //          // function
        //          r = function(){ return src.apply(this, arguments); };
    }else{
        // generic objects
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, clone);
}
/*
 * =dirty check
 * @about   because dirty is slow, only use it for polyfill
 * */
var watchList   = [];
function dirtyWatch(object, property, callback){
    watchList.push({
        "object"    : object
        ,"property" : property
        ,"callback" : callback
        ,"clone"    : clone(object[property])
    });
}
/*
 * =check
 * */
function check(){
    //console.log('i am check',watchList)
    var len = watchList.length
        ,item,obj
        ;
    while(len--){
        item    = watchList[len];
        obj     = item.object[item.property];
        if ( !isEqual(item.clone, obj) ){
            item.clone  = clone(obj);
            item.callback();
        }
    }
}
/*
 * =after
 * use aop for func
 * */
function after( self, func ){
    return function(){
        var _this       = this
            ,_arguments = arguments
            ;
        try{
            self.apply( _this, _arguments);
        }finally{
            func.apply( _this, _arguments);
        }
    }
}
/*
 * =inject callback argument with check function
 * */
_o = [];
_a = [];
function checkAfterCallback(object, property){
    var origin  = object[property];
    object[property]    = function(){
        var args    = arguments
            ,len    = args.length
            ,arg,_callback,callback
            ;
        //handle funtion argument
        while(len--){
            arg = args[len];
            if(typeof(arg) == 'function') {
                _callback   = args[len];
                callback    = after(arg, check);
                args[len]   = callback;
                //because callback is a function pointer, so keep the link of origin and after
                //which is useful when overwrite built-in method
                //because different node can own same event callback
                //an array is needed
                callback.nbOriginCallback   = callback.nbOriginCallback || [];
                callback.nbOriginCallback.push( _callback );
                _callback.nbAfterCallback   = _callback.nbAfterCallback || [];
                _callback.nbAfterCallback.push( callback );
            }
        }
        origin.apply(this, args);
    }
}

//timers inject
checkAfterCallback(window,'setTimeout')
checkAfterCallback(window,'setInterval')
//events inject
checkAfterCallback(EventTarget.prototype, 'addEventListener')
var proto                   = EventTarget.prototype
    _removeEventListener    = proto.removeEventListener
    ;
proto.removeEventListener   = after(_removeEventListener, function(eventName, callback){
    var nbAfter = callback.nbAfterCallback
        ,len    = nbAfter.length
        ;
    //as one origin event callback may has many inject callback, but each inject callback match to only one node, others will be ignore, for example
    //NodeBind($('#event'), 'event.click', data.event, '{{click}}')
    //NodeBind($('#event1'), 'event.click', data.event, '{{click}}')
    //data.event.click will has two inject after callback, but each of them match unique node

    while(len--) _removeEventListener.call(this, eventName, nbAfter[len]);
    check();
})
//ajax


/*
 * =Model.prototype.refreshListener
 * @about   refresh model listener, if model change call model.change
 *          only need to notice change status, no detail needed, view will get what it need itself.
 *          if object[property] is array, watch it's new and delete, else watch it's change.
 * */
ModelPrototype.refreshListener  = function(){
    var self        = this
        ,object     = self.object
        ,property   = self.property
        ,_value     = object[property]
        ;
    if(property == '') return//only watch definate property
    //checkList.push({
    //    "object"            : object
    //    ,"property"         : property
    //    ,"clone"            : objectClone(object[property])
    //    ,"dirtyCallback"    : function(){ self.change.call(self) }
    //})
    //listen object[property] = new value
    //console.log(self,object, property)
    if(typeof(object) == "object" && property != null && property != undefined){
        function observeArray(object, property){//observe object[property][i]
            //todo if type of object[property] is Array, listen object[property][i]'s new and delete
            //use presudo array length getter setter
            //no need to watch object[property][i]'s modify, because child bind will cause defineProperty for object[property][i], so ArrayObserve's 9999 max limit can be avoid
            if( Object.prototype.toString.call( object[property] ) === '[object Array]' ){
                //replace with observable array
                //observable array run slow
                //object[property] = new ObservableArray( value, function(){
                //    self.change();
                //});
                //use dirty check for array new and delete
                dirtyWatch( object[property], 'length', function(){
                    self.change.call(self)
                })
            }
        }
        Object.defineProperty(object, property, {//observe object[property]
            get     : function(){
                return _value
            },
            set    : function(value){
                var oldValue    = _value
                _value          = value;
                observeArray(object, property);
                self.change();
            },
            configurable : true
        })
        observeArray(object, property);
    }
}
/*
 * =Model.prototype.getBinding
 * @about   get binding from model.bindings and match target key
 * */
ModelPrototype.getBinding   = function(target){
    var self        = this
        ,bindings   = self.bindings
        ,len        = bindings.length
        ,has        = false
        ,binding
        ;
    while(len--){
        binding = bindings[len];
        if(binding.target == target){
            has = true;
            break;
        }
    }
    if(!has){
        binding = {
            "target"    : target
            ,"callback" : undefined
        }
        bindings.push(binding)
    }
    return binding
}
/*
 * =Model.prototype.bind
 * @about   put into model.bindings for call when model.change
 *          A <- B if B change call A's function --> B.bind(A)
 * */
ModelPrototype.bind = function(target, callback){
    var self        = this
        ,binding    = self.getBinding(target)
        ;
    binding.callback    = callback;
}
/*
 * =Model.prototype.unbind
 * @about   remove from model.bindings
 * */
ModelPrototype.unbind   = function(){

}
/*
 * =Bindings
 * *
function Bindings(){
    var self        = this;
    self.bindings   = [];
}
var BindingsPrototype   = Bindings.prototype;
/*
 * =Bindigns.prototype.bind
 * @about   match binding, if new create
 * *
BindingsPrototype.bind  = function(object, property, view){
    console.log(arguments)
    var self        = this
        ,bindings   = self.bindings
        ,len        = bindings.length
        ,binding
        ;
    while(len--){
        binding = bindings[len];
        
    }
}
/*
 * =Bindings.prototype.unbind
 * @about   match binding, if has remove
 * *
BindingsPrototype.unbind    = function(object, property, view){

}
/*
 * =Bindings.prototype.getModels
 * @about   find match models
 * *
BindingsPrototype.getModels = function(view){

}
/*
 * =Bindings.prototype.getViews
 * @about find match views
 * *
BindingsPrototype.getViews  = function(model){

}

/*
 * =NodeBind
 * @about   handle parameters and call NodeBindCore
 * */
function NodeBind(nodes, directive, scope, template){
    var nodesLen,node,views,view,objProps,objProp,len,model;
    if(!nodes.length) nodes = [nodes];
    if(!template ){
        if( typeof scope == 'string'){//NodeBind(node(s), 'directive', template);
            template    = scope;
            scope       = undefined;
        }else{//NodeBind(node(s), 'scope', scope)
            template    = '';
        }
    }
    //if scope isn't empty, scope will be stored in view.scope as private scope
    nodesLen    = nodes.length;
    while(nodesLen--) NodeBind.core(nodes[nodesLen], directive, scope, template);
}
/*
 * =NodeBind.core
 * @about   create model view --> two way bind model view --> render view
 *          bind with single node and right parameters
 * */
NodeBind.core   = function(node, directive, scope, template){
    var views,view,models,model,objProps,objProp,len;
    //create view
    view    = new View(node, directive, scope, template);
    views   = node.nbViews = node.nbViews || [];
    views.push(view);
    //create model
    models  = node.nbModels = node.nbModels || [];
    objProps    = view.getObjectProperty();
    len         = objProps.length;
    while(len--){
        objProp = objProps[len];
        model   = new Model(objProp.object, objProp.property)
        models.push(model);
        //two way bind model and view
        view.bind(model, model.update);
        model.bind(view, view.render);
    }
    //render
    view.render()
}
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
 
NodeBind.walkTree   = function(node, callback) {
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
 * =setTreeScope
 * @about   //if node is a element, set data-scope on it.
 *          set nbScope --> find all one level views refresh, if view's directive is scope or repeat, change it's scope and continue to refresh
 *          refresh means get view object property, new/modify model, model.refreshListener and render
 *          only handle relative view.
 *
 * */
NodeBind.setTreeScope   = function(node, scope){
    if(!scope) return
    node.nbScope    = scope;
    var nbScope,nbViews,nbView,viewLen,nbModels,nbModel,modelLen,mobjProps,objProp,object,property
        ;
    //walk all children
    NodeBind.walkTree( node, function(depth){
        currNode    = this;
        if(currNode != node && (nbViews = currNode.nbViews)){
            viewLen = nbViews.length;
            //clean all models
            nbModels = currNode.nbModels = [];//memory clean todo
            while(viewLen--){
                nbView      = nbViews[viewLen];
                //todo repeat scope view
                //clean view bindings
                objProps    = nbView.getObjectProperty();
                len         = objProps.length;
                while(len--){
                    objProp     = objProps[len];
                    //create new model
                    nbModel   = new Model(objProp.object, objProp.property)
                    nbModels.push(nbModel);
                    //two way bind
                    nbView.bind(nbModel, nbModel.update);
                    nbModel.bind(nbView, nbView.render);
                }
                //render
                nbView.render();
            }
        }
    });
}
//NodeBind.bindings   = new Bindings;
//NodeBind.utility    = utility;
/*
NodeBind.compile    = function(element){
    var children    = element.getElementsByTagName("*")
        ,len        = children.length
        ,child
        ;
    while(len--){
        child   = children[len];

    }
}
*/
window.NodeBind = NodeBind;

/*
 *  = walkDocumentTree
 *  @callback   {function}
 * *
function walkDocumentTree(callback){
    var allElements =   'all' in document ?
                        document.all :
                        allElements = document.getElementByTagName('*'),
        len         = allElements.length;
    while(len--) callback(allElements[len]);
}
/**/
/*
 *  =bootstrap
 *
 * *
var attachEvent = 'attachEvent',
    addEventListener = 'addEventListener',
    readyEvent = 'DOMContentLoaded';
if( !document[addEventListener] )
    addEventListener =  document[attachEvent]
                        ? (readyEvent = 'onreadystatechange') && attachEvent
                            : '';
window['domReady'] = function(f) {
    /in/.test(document.readyState)
        ? !addEventListener
            ? setTimeout(function() { window['domReady'](f); }, 9)
            : document[addEventListener](readyEvent, f, false)
        : f();
};
domReady(function(){
    walkDocumentTree(function(element){//can extract for repeat
        //if element.model change
        var attributes  = element.attributes
            ,len        = attributes.length
            ,attribute,directive,directiveLen
            ;
        while(len--){
            attribute   = attributes[len];
            if(attribute.nodeName.match(/data-bind-(.*)/gim)){
                directive       = RegExp.$1.replace(/-/gim,'.');
                NodeBind(element, directive, attribute.nodeValue)
            }
        }
    });
    NodeBind.compile(document);
});
/**/
})(document, window)
