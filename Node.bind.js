(function(document, window, undefined){
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
ItemPrototype.get   = function(node){
}
/*
 * =Path
 * */
function Path(path){
    var self    = this;
    self.origin = path;//"$index.foo.bar"
    self.parsed = self.parse(path);//[Item, "foo", "bar"]
};
var PathPrototype   = Item.prototype;
/*
 * =Path.prototype.get
 * @about   path.getObjectProperty then return object[property] for example: scope + parsed:[Item, "foo", "bar"] --> scope[0].foo.bar --> "value"
 * */
PathPrototype.get   = function(node, scope){
}
/*
 * =Path.prototype.set
 * @about   set origin = path --> path.parse(path) --> bind path
 * */
PathPrototype.set   = function(path){

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
}
/*
 * =Path.prototype.bind
 * @about   path.getObjectProperty then modify binding binding[model1, View] --> [model2, View], remove empty models
 * */
PathPrototype.bind  = function(view, scope){
}
/*
 * =Path.prototype.unbind
 * @about   path.getObjectProperty then remove binding binding[model, View]
 * */
PathPrototype.unbind  = function(view, scope){
}
/*
 * =Path.prototype.getObjectProperty
 * @about   walk all items and Item.get() --> get object property from scope, node is used in Item
 * */
PathPrototype.getObjectProperty = function(node, scope){

}
/*
 * Template
 * */
function Template   = function(template){
    var self    = this;
    self.origin = template;//"{{$index.foo.bar}} is {{obj.prop}}"
    self.parsed = self.parse(template);//[Path," is ",Path]
}
var TemplatePrototype   = Template.prototype;
/*
 * =Template.prototype.get
 * @about   get scope --> walk path and call path.get(node, scope) --> join Template.parsed for example: [Path," is ",Path] --> "value is nice"
 * */
TemplatePrototype.get   = function(node){
}
/*
 * =Template.prototype.set
 * @about   set template.origin = template --> parse template.origin
 * */
TemplatePrototype.set   = function(template){
    
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

}
/*
 * =Template.prototype.parse
 * @about   parse value for example "{{$index.foo.bar}} is {{obj.prop}}" --> [Path, " is ", Path]
 * */
TemplatePrototype.parse = function(value){

}
/*
 * =Template.prototype.bind
 * @about   template.getScope --> walk all path and call path.bind(view, scope)
 * */
TemplatePrototype.bind  = function(view){
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
DirectivePrototype.parse    = function(){

}
/*
 * =View
 * @about   View <-- Template: "{{$index.foo.bar}} is {{obj.prop}}" <-- Path: "$index.foo.bar" <-- Item: 0
 * */
function View(node, directive, scope, template){
    var self        = this;
    self.node       = node;
    self.directive  = new Directive(directive);
    self.template   = new Template(template);
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
    
}
/*
 * =View.prototype.render
 * @about   according directive render template.get()
 * */
ViewPrototype.render    = function(){

}
/*
 * =View.prototype.bind
 * @about   call view.template.bind()
 * * */
ViewPrototype.bind  = function(){
}
/*
 * =View.prototype.unbind
 * @about   call view.unbind()
 * */
ViewPrototype.unbind    = function(){

}
/*
 * =View.prototype.listener
 * @about   if view change, this function will call
 * */
viewPrototype.listener  = function(){

}
/*
 * =View.prototype.refreshListener
 * @about   refresh listener
 * */
ViewPrototype.refreshListener   = function(){

}
/*
 * =Model
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
 * =Model.prototype.refreshListener
 * @about   refresh model listener
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
BindingsPrototype.bind  = function(model, view){

}
/*
 * =Bindings.prototype.unbind
 * @about   match binding, if has remove
 * */
BindingsPrototype.unbind    = function(model, view){

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
})(document, window)
