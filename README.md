#Node.bind

##How it works

this library use defineProperty for exist property and dirty watch for others, dirty watch will inject event loop callback to check dirty.

##Usage

##concepts

###scope

    +-------------------------------------------------------------------------------+
    |   <li data-repeat="{{array}}" data-attr-src="{{$index.foo.bar}}.jpg"></li>    |
    +-------------------------------------------------------------------------------+
    +-------------------------------------------+
    |   <div><!--node.nbScope=object-->         |
    |       {{a.b.c}} + {{a.b.d}} = {{a.b.e}}   |
    |       <span>{{a.b.f}}</span>              |
    |   </div>                                  |
    +-------------------------------------------+

###view

        +--------------------------+    +----------------------------------------+
    <li | data-repeat="{{repeat}}" |    | data-attr-src="{{$index.foo.bar}}.jpg" | ></li>
        +--------------------------+    +----------------------------------------+
    <div><!--node.nbScope=object-->
      +-----------------------------------+
      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
      +-----------------------------------+
            +---------+
      <span>|{{a.b.f}}|</span>
            +---------+
    </div>

###template

                     +---------+                 +----------------------+
    <li data-repeat="|{{array}}|" data-attr-src="|{{$index.foo.bar}}.jpg|" ></li>
                     +---------+                 +----------------------+
    <div><!--node.nbScope=object-->
      +-----------------------------------+
      | {{a.b.c}} + {{a.b.d}} = {{a.b.e}} |
      +-----------------------------------+
            +---------+
      <span>|{{a.b.f}}|</span>
            +---------+
    </div>

###path

                       +-----+                     +--------------+
    <li data-repeat="{{|array|}}" data-attr-src="{{|$index.foo.bar|}}.jpg" ></li>
                       +-----+                     +--------------+
    <div><!--node.nbScope=object-->
          +-----+       +-----+         +-----+
        {{|a.b.c|}} + {{|a.b.d|}}   = {{|a.b.e|}}
          +-----+       +-----+         +-----+
                +-----+
        <span>{{|a.b.f|}}</span>
                +-----+
    </div>

##node data

 nbScope
 nbViews
 nbModels
 nbEvents

##process:

    +---------------------------------------------------------------+
    |   <div                                                        |
    |       data-bind-textContent="{{obj.path[0].to[0].value}}"     |
    |       data-bind-attribute-id=""                               |
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
    +---------------------------------------------------------------+
                                    |
                                generate
                                    |
                                    V
                NodeBind(node(s), 'directive', scope, 'template')
                                    |
                                 compile
                                    |
                                    V
                                ---------
                              /           \
                             |             v
                            model        view
                             ^             |
                              \           /
                                ---------

###example
    see demo/
