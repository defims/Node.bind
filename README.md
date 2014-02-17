#Node.bind

##How it works

this library use property assessor for exist property and dirty watch as fallback, dirty watch will inject event loop callback to check dirty.

##process:

    +------------------------------------------------------------+
    |   <div                                                     |\
    |       data-bind-textContent="{{obj.path[0].to[0].value}}"  | \
    |       data-bind-attribute-id=""                            +--+
    |       data-bind-attribute-class=""                            |
    |       data-bind-attribute-style=""                            |
    |       data-bind-attribute-style-top=""                        |
    |       data-bind-attribute-custom-define=""                    |
    |       data-bind-dataset-a-b=""                                |
    |       data-bind-event-click=""                                |
    |   ></div>                                                     |
    |   <input                                                      |
    |       data-bind-attribute-value=""                            |
    |   />                                                          |
    |   <ul>                                                        |
    |       <li                                                     |
    |           data-bind-repeat=""                                 |
    |       >elementArray</li>                                      |
    |   </ul>                                                       |
    +-------------------------------+-------------------------------+
                                    |
                                generate
                                    |
                                    V
                NodeBind(node(s), 'directive', scope, 'template')
                                    |
                                 compile
                                    |
                                    V
                             -->---->----->--
                          /                    \
                       change                render
                         |                      |
                         |                      v
                    +---------+            +--------+
                    |  model  |            |  view  |
                    +---------+            +--------+
                         ^                      |
                         |                      |
                       update                 change
                          \                    /
                             --<----<-----<--


##concepts

###scope

scope is mapping to markup.

the scopes of scope and repeat inhert form their parent element, because they define the scope.
root scope is window, it means define varible directly will affect the root scope.
others inhert form the nearest parentNode's scope.

chain inhert scope is nice (todo).

####markup statement example

    +---------------------------------------------------------------------------------------+
    |                                                                                       |
    |<-----------------+                                                                    |
    |                  |                                                                    |
    |   +--------------|----------------------------------------------------------------+   |
    |   |   <li data-repeat="{{array}}" data-attr-src="{{$index.foo.bar}}.jpg"></li>    |   |
    |   +-------------------------------------------------------------------------------+   |
    |                                                                                       |
    |<-----------------+                                                                    |
    |                  |                                                                    |
    |   +--------------|----------------------------+                                       |
    |   |   <div data-scope="{{object}}">           |                                       |
    |   |       {{a.b.c}} + {{a.b.d}} = {{a.b.e}}   |                                       |
    |   |       <span>{{a.b.f}}</span>              |                                       |
    |   |   </div>                                  |                                       |
    |   +-------------------------------------------+                                       |
    +---------------------------------------------------------------------------------------+

###model

model is javascript varible, it store object and property inside for observe.
it also provide method to refresh listener when object or property change.
the magic observer is assessor and callback inject.

###assessor

defineProperty is use for exist property , after compile NodeBind to model, model.refreshListener will be call, and defineProperty will be apply to the model.

###event loop

                                +----------+  +----------------+  +----------+        +---+
               threads          |  timer   |  |  event trigger |  |   ajax   |        |...|
                                +----------+  +----------------+  +----------+        +---+
                                     |               |                  |              |||
                                     v               v                  v              vvv
      -<-[javascript statement][timer callback][event callback][http request callback][...]-<-
    /                                                                                          \
    \                                      event loop                                          /
      ----------------------------------------------------------------------------------------

###callback inject

this library use aop(aspect oriented programming) in callback inject, so when callback fire, a dirty check function can be call.

      --<--[javascript statement][timer|event|http request callback + dirty check][...]--<--

###view

####markup statement example

        +--------------------------+    +----------------------------------------+
    <li | data-repeat="{{repeat}}" |    | data-attr-src="{{$index.foo.bar}}.jpg" | ></li>
        +--------------------------+    +----------------------------------------+
         +-------------------------+
    <div | data-scope="{{object}}" | >
         +-------------------------+
      +-----------------------------------+
      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
      +-----------------------------------+
            +---------+
      <span>|{{a.b.f}}|</span>
            +---------+
    </div>

this library just provide the NodeBind method for render, and the markup is just an example to explain what a view is.

####directive

directive tell view how to render

#####built-in directives

* scope
* repeat
* textContent
* attribute
* dataset
* event
* nodeValue

#####custom directive (todo)

###template

####markup statement example

                     +---------+                 +----------------------+
    <li data-repeat="|{{array}}|" data-attr-src="|{{$index.foo.bar}}.jpg|" ></li>
                     +---------+                 +----------------------+
                     +----------+
    <div data-scope="|{{object}}|" >
                     +----------+
      +-----------------------------------+
      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
      +-----------------------------------+
            +---------+
      <span>|{{a.b.f}}|</span>
            +---------+
    </div>

###path

####markup statement example

                       +-----+                     +--------------+
    <li data-repeat="{{|array|}}" data-attr-src="{{|$index.foo.bar|}}.jpg" ></li>
                       +-----+                     +--------------+
                       +------+
    <div data-scope="{{|object|}}" >
                       +------+
          +-----+       +-----+         +-----+
        {{|a.b.c|}} + {{|a.b.d|}}   = {{|a.b.e|}}
          +-----+       +-----+         +-----+
                +-----+
        <span>{{|a.b.f|}}</span>
                +-----+
    </div>

####built-in code

* $index $index is use as repeat inde

####filter (todo)

path can own filter

##node data

node data store in dom with nb prefix like:

    document.getElementById('scope').nbScope

###built-in node data

 * nbScope
 * nbViews
 * nbModels
 * nbEvents
 * nbInstances
 * nbPrototype
 * nbLastClass


##Usage

###generate

    walk the document and run  NodeBind by youself, you can use your favorate tag

###compile

    compile use the global api NodeBind like:

    NodeBind(node(s), 'directive', scope, 'template');
    NodeBind(node(s), 'directive', 'template');

######textContent

    @about   most usable directive, {{}} need for template parse, object is the scope of template,
             if it's undefined , it will search the parent element, top is window.
    @usage   ElementBind(element(s), 'directive', pathScope, 'template');

    NodeBind($('#textContent'), 'textContent', data, '{{obj.path[0].to[0].value}}');
    NodeBind($('#textContent1'), 'textContent', data.obj, '{{path[0].to[0].value}} and {{value}}');
    NodeBind($('#textContent2'), 'textContent', data.obj.path[0].to[0], '{{value}}');

######attribute

    @about   it will change the node's attribute,
             if directive is attribute.class and template binding data is Array,
             Array.join(' ') will be called before.
             if directive is attribute.style and template binding data is Object,
             Object will be rendered to "display: block;" like string.
             if directive is attribute.style, only the given style will be cover, others will remain
             other attribute will refer to original node.attributes
             always two way binding, multi template will be the same, always match the template.
    @usage   NodeBind(node(s), 'directive', pathScope, 'template');

    NodeBind($('#attributeId'), 'attribute.id', data.attribute, '{{id}}');
    NodeBind($('#attributeClass'), 'attribute.class', data.attribute, '{{class.string}}');
    NodeBind($('#attributeClass1'), 'attribute.class', data.attribute, '{{class.array}}');
    NodeBind($('#attributeClass2'), 'attribute.class', data.attribute, '{{class2}}');
    NodeBind($('#attributeStyle'), 'attribute.style', data.attribute, '{{style.string}}');
    NodeBind($('#attributeStyle1'), 'attribute.style', data.attribute, '{{style.object}}');
    NodeBind($('#attributeStyleTop'), 'attribute.style.top', data.attribute.styleTop, '{{top}}');
    NodeBind($('#attributeValue'), 'attribute.value', data.attribute, '{{value}}');
    NodeBind($('#attributeCustom'), 'attribute.custom.define', data.attribute, '{{custom}}');


######dataset

    @about   dataset.data.set.content will point to attribute data-data-set-content
    @usage   ElementBind(element(s), directive, pathScope, 'template');

    NodeBind($('#dataset'), 'dataset.data.set.content', data.dataset, '{{foo}}');



######event

    @about   it will bind event and will fixed some problem on different browsers,
             prefix free is supported in directive.
             if property is undefined, absolute event will be binded,
             property is relative.
             target event will be {{}}
             as event callback must be function, string template will be ignore,
             for example: '{{click}} click1 {{click2}}' --> [path,'click1',path]
             'click1' will be ignored
    @usage   ElementBind(element(s), 'directive', propertyScope, 'property');

    NodeBind($('#event'), 'event.click', data.event, '{{click}}');//will watch data.event.click
    //NodeBind($('#event1'), 'event.click', data.event.click);//keep data.event.click unwatch
    NodeBind($('#event2'), 'event.click', data.event, '{{click}}{{click2}}');
    NodeBind($('#event3'), 'event.transitionEnd', data.event, 'transitionEnd');


######scope

    @about   it will set model for element, and set element model will trigger scopeBinding,
             if parent element binded a scope, child binding will inhert it.
             it's a invisible directive, so no need for userdefined
             when call view.getScope , a scope chain will return
             root scope is window.
    @usage   scope:  ElementBind(element(s), 'directive', object);
             child:  ElementBind(element(s), 'directive', 'template');

    NodeBind($('#scope'), 'scope', data, '{{scope}}');//will watch data.scope
    //NodeBind($('#scope'), 'scope', data.scope);//keep data.scope unwatch
    NodeBind($('#scopeItem'), 'textContent', '{{path.to.data}}');


######repeat

    @about   it will repeat the element and bind the child bindings for new element,
             each repeat element will own a scope,
    @usage   NodeBind(element(s), 'directive', scope, 'template')

    NodeBind($('.repeat'), 'repeat', data, '{{arr}}');//watch data.arr
    NodeBind($('.repeat'), 'repeat', data.arr);//keep data.arr unwatch
    NodeBind($('.repeat .textContent'), 'textContent', '{{$index}}')
    NodeBind($('.repeat .textContent1'), 'textContent', '{{$index}}')


######nodeValue

    @about   actually, above directive is use for element, and this directive test textNode
             NodeBind(element(s), 'textContent', scope, 'template') will overwrite the children
             of element.

    NodeBind($('#textNode')[0].childNodes, 'nodeValue', data, '{{obj.path[0].to[0].value}}');


###custom binding (todo)

  @about    all directives will turn to call this function
            use for custom directive

    NodeBind.binding = function(element, directive, object, template){//custom bind for follow use
        if(directive == 'repeat'){
            console.log('hi')
            //handle
        }else ElementBind.prototype.bind.apply(this, arguments);
    }

###unbind (todo)

    @about   ElementBind will return a binding which can be use in ElementBind.unbind

    var bindId  = ElementBind($('#unbind'), 'textContent', data.textContent.path[0].to[0], 'value');
    ElementBind.unbind(bindId);

###utility

####NodeBind.walkTree
####NodeBind.core
####NodeBind.setTreeScope


##example
    see demo/

##roadmap

* view <=> model <=> model
* Object.observe as listener
* event callback scope modify support
* directly view modify support
