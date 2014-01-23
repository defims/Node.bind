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
 * @about   get scope --> walk path and call path.get(node, scope) --> join Template.parsed for example: [Path," is ",Path] --> "value is nice"
 * */
TemplatePrototype.getValue   = function(node){
    var self            = this
        ,parsedTemplate = self.parsed
        ,len            = parsedTemplate.length
        ,result         = ''
        ,scope          = self.getScope(node)
        ,path
        ;
    while(len--){
        path = parsedTemplate[len];
        if(path.getValue) path = path.getValue(node, scope);
        result = result + path;
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
 * @about   for all child paths owns same scope
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
        ,scope          = self.getScope(node)
        ,path
        ;
    while(len--){
        path    = parsedTemplate[len];
        if(path.bind) path.bind(view, node, scope);
    }
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
    self.directive  = new Directive(directive);
    self.template   = new Template(template);
    self.refresh();
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
 * */
ViewPrototype.refresh   = function(){
    var self = this;
    self.render();
    self.bind();
}
/*
 * =View.prototype.render
 * @about   according directive render template.get()
 *          if directive.type is repeat, keep instances number --> clone views to new instance with new node --> find and set scope --> trigger scope setter
 * */
ViewPrototype.render    = function(){
    var self                = this
        ,node               = self.node
        ,nodeType           = node.nodeType
        ,parsedDirective    = self.directive.parsed
        ,type               = parsedDirective.type.toLowerCase()
        ,detail             = parsedDirective.detail
        ,template           = self.template
        ,value              = template.getValue(node)
        ,ELEMENT_NODE       = 1
        ,TEXT_NODE          = 3
        ;
    if(type == "textcontent"){
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
    }
}
/*
 * =View.prototype.bind
 * @about   call view.template.bind() --> get bindings --> get from NodeBind.bindings --> match modify model or add binding
 *          bind function create model
 * * */
ViewPrototype.bind  = function(){
    var self                = this
        ,node               = self.node
        ;
    self.template.bind(self, node);
}
/*
 * =View.prototype.unbind
 * @about   call view.unbind()
 * */
ViewPrototype.unbind    = function(){

}
/*
 * =View.prototype.listener
 * @about   if view change, view.listener will call
 * */
ViewPrototype.listener  = function(){

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
    var self    = this;
    self.object     = object;
    self.property   = property;
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
 * =Model.prototype.updateViews
 * @about bindings.getViews --> render
 * */
ModelPrototype.updateViews  = function(){

}
/*
 * =Model.prototype.listener
 * @about   if model change model.listener will be call
 * */
ModelPrototype.listener = function(){

}
/*
 * =Model.prototype.refreshListener
 * @about   refresh model listener, if model change model.updateViews
 *          only need to notice change status, no detail needed, view will get what it need itself.
 *          if object[property] is array, watch it's new and delete, else watch it's change.
 * */
ModelPrototype.refreshListener  = function(){
    
}
/*
 * =Bindings
 * */
function Bindings(){
    var self        = this;
    self.bindings   = [];
}
var BindingsPrototype   = Bindings.prototype;
/*
 * =Bindigns.prototype.bind
 * @about   match binding, if new create
 * */
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
 * */
BindingsPrototype.unbind    = function(object, property, view){

}
/*
 * =Bindings.prototype.getModels
 * @about   find match models
 * */
BindingsPrototype.getModels = function(view){

}
/*
 * =Bindings.prototype.getViews
 * @about find match views
 * */
BindingsPrototype.getViews  = function(model){

}
/*
 * =NodeBind
 * */
function NodeBind(nodes, directive, scope, template){
    var nodesLen,node,views,view;
    if(!nodes.length) nodes = [nodes];
    if(!template && typeof(scope) == 'string'){//NodeBind(node(s), 'directive', template);
        template    = scope;
        scope       = undefined;
    }
    nodesLen    = nodes.length;
    while(nodesLen--){
        node    = nodes[nodesLen];
        NodeBind.setScope(node, scope);//for absolute scope
        view    = new View(node, directive, scope, template);
        views   = node.nbViews = node.nbViews || [];
        views.push(view);
    }
}
/*
 * =setScope
 * @about   //if node is a element, set data-scope on it.
 *          find all one level views refresh, if view's directive is scope or repeat, change it's scope and continue to refresh
 * */
NodeBind.setScope   = function(node, scope){
    if(!scope) return
    node.nbScope    = scope;
}
NodeBind.bindings   = new Bindings;
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
