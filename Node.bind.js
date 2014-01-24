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
        while(scopeNode){
            if(scopeNode.nbPrototype || scopeNode.nbInstances){
                find    = true;
                break;
            }
            scopeNode    = scopeNode.parentElement;
        }
        result = 0;
        if(find && scopeNode.nbPrototype){
            console.log(scopeNode)
            while(scopeNode && scopeNode.nbPrototype){
                result --;
                scopeNode   = scopeNode.prevSibling;
            }
            result = -result;
        }
    }else{
        result  = origin
    }
    console.log(result)
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
        //result = result + path;
        result.push(path);
    }
    return result
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
    console.log('get scope')
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
    return objProps
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
    //self.refresh();
    self.render();
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
    if(type == "textcontent"){
        value   = value.join();
        if(nodeType == ELEMENT_NODE){
            if(node.textContent != value) node.textContent  = value;
        }else if(nodeType == TEXT_NODE){
            if(node.nodeValue != value) node.nodeValue = value;
        }
    }else if(type == "scope"){
        if(nodeType == ELEMENT_NODE){
            console.log(value)
            //NodeBind.setScope(node, value);//for absolute scope
        }
    }else if(type == "repeat"){
        value   = value[0];
        console.log(value)
        var len         = value.length
            ,instances  = node.nbInstances  = node.nbInstances || []
            ,i,item,newNode
            ;

        //todo when modify element
        for(i=0; i<len; i++){
            if(i==0){//prototype
                lastInstance    = node;
            }else if(instances[i-1]){//exist instance
                lastInstance    = instances[i-1];
            }else{//new instance
                newNode             = node.cloneNode(true);
                newNode.nbPrototype = node;
                lastInstance.parentNode.insertBefore(newNode, lastInstance.nextSibling);
                lastInstance        = newNode;
                instances.push(lastInstance);
            }
        }
        /*delete more to do
         *
        len -= 2;
        while(++len<instances.length){//extra instance
            lastInstance    = instances[len];
            //todo remove models and views
            lastInstance.parentNode.removeChild(lastInstance)
            delete instances[len];
        }
        /**/
    }
}
/*
 * =View.prototype.bind
 * @about   put into view.bindings for call when view.change
 *          A <- B if B change call A's function --> B.bind(A)
 * * */
ViewPrototype.bind  = function(target, callback){
    var self                = this
        ,node               = self.node
        ;
    //self.template.bind(self, node);
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
/*
 * =Model
 * @about   keep global unique always
 * */
function Model(object, property){
    var self        = this;
    self.object     = object;
    self.property   = property;
    self.bindings   = [];//[target: view|model, callback: render|update]
    self.refreshListener();
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
ModelPrototype.change   = function(change){
    var self    = this
        ,bindings   = self.bindings
        ,len        = bindings.length
        ,binding
        ;
    while(len--){
        binding = bindings[len];
        binding.callback.call(binding.target, change.value)
    }
}
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
    //listen object[property] = new value
    if(object && property)
    Object.defineProperty(object, property, {
        get     : function(){
            return _value
        },
        set    : function(value){
            var oldValue    = _value
            _value          = value;
            self.change({
                "object"    : object
                ,"property" : property
                ,"oldValue" : oldValue
                ,"value"    : value
            })
        }
    })
    //if type of object[property] is Array, listen object[property][i] new , modify , delete
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
    if(!template && typeof(scope) == 'string'){//NodeBind(node(s), 'directive', template);
        template    = scope;
        scope       = undefined;
    }
    nodesLen    = nodes.length;
    while(nodesLen--) NodeBind.core(nodes[nodesLen], directive, scope, template)
}
/*
 * =NodeBind.core
 * @about   bind with single node and right parameters
 * */
NodeBind.core   = function(node, directive, scope, template){
    //scope
    NodeBind.setScope(node, scope);//for absolute scope
    //view
    view    = new View(node, directive, scope, template);
    views   = node.nbViews = node.nbViews || [];
    views.push(view);
    //model
    objProps    = view.getObjectProperty();
    len         = objProps.length;
    while(len--){
        objProp = objProps[len];
        model   = new Model(objProp.object, objProp.property)
        models  = node.nbModels = node.nbModels || [];
        models.push(model);
        //two way bind
        view.bind(model, model.update);
        model.bind(view, view.render);
    }
}
/*
 * =setScope
 * @about   //if node is a element, set data-scope on it.
 *          find all one level views refresh, if view's directive is scope or repeat, change it's scope and continue to refresh
 *          refresh means get view object property, new/modify model, model.refreshListener
 *          only handle relative view.
 * */
NodeBind.setScope   = function(node, scope){
    if(!scope) return
    node.nbScope    = scope;
}
//NodeBind.bindings   = new Bindings;
NodeBind.utility    = utility;
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
