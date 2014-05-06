###process
---
#### Model  report
                                     +~~~~~~~+ ------------publish--------> +~~~~~~~+
                              .----->| Model |==============================| Scope |
                            report   +~~~~~~~+ <-------.                    +~~~~~~~+
                              :      /   ^   \       report                 /   :   \
                          .>+~~~~~~~+ report +~~~~~~~+ :            +~~~~~~~+ update +~~~~~~~+
                      report| Model |<-. '---| Model | @            | Scope |<--'    | Scope |
                          : +~~~~~~~+report  +~~~~~~~+ :new         +~~~~~~~+------. +~~~~~~~+
                  publish : /       \  :         ^   \ v             /     \     update
         +~~~~~~~+ ---> +~~~~~~~+ +~~~~~~~+   report +~~~~~~~+ +~~~~~~~+ +~~~~~~+  :
         | Scope |======| Model | | Model |<.    '---| Model | | Scope | | View |<-'
       .-+~~~~~~~+<-.   +~~~~~~~+ +~~~~~~~+ :        +~~~~~~~+ +~~~~~~~+ +~~~~~~+--.
    publish// \\ publish    publish:  ||    :                  /            ||   publish
       v  //   \\   @              v  || publish           +~~~~~~~+    +~~~~~~~+  :
     +~~~~~~~+ +~~~~~~~+          +~~~~~~~+ :              | Scope |    | Model |<-'
     | Model | | Model |          | Model |@'              +~~~~~~~+    +~~~~~~~+
     +~~~~~~~+ +~~~~~~~+          +~~~~~~~+

#### View  report
                                     +~~~~~~~+ <-----------publish--------- +~~~~~~~+
                                .----| Model |==============================| Scope |
                              update +~~~~~~~+ --------.                .-->+~~~~~~~+
                                v    /       \       update       report:   /       \
                          .--+~~~~~~~+       +~~~~~~~+ :            +~~~~~~~+        +~~~~~~~+
                      update | Model |       | Model |<:         .--| Scope |<-----. | Scope |
                          :  +~~~~~~~+       +~~~~~~~+ :new   update+~~~~~~~+      : +~~~~~~~+
                 publish  v  /       \               \ v         v  /       \   report
         +~~~~~~~+<-----+~~~~~~~+ +~~~~~~~+          +~~~~~~~+ +~~~~~~~+ +~~~~~~+  :
         | Scope |======| Model | | Model |          | Model | | Scope | | View |@-:
      .--+~~~~~~~+--.   +~~~~~~~+ +~~~~~~~+          +~~~~~~~+ +~~~~~~~+ +~~~~~~+  :
    publish// \\ publish                                       /    :       ||  publish
      v   //   \\   v                                    +~~~~~~~+  :   +~~~~~~~+  :
     +~~~~~~~+ +~~~~~~~+                                 | Scope |update| Model |<-'
     | Model | | Model |                                 +~~~~~~~+<-'   +~~~~~~~+
     +~~~~~~~+ +~~~~~~~+

####triangle relationship

                  .-------.
                  :       v
                  +~~~~~~~+
          .------>| Scope |<-------.
          : .-----+~~~~~~~+------. :
          : v       publish      v :
    .->+~~~~~~~+               +~~~~~~+<-.
    :  | Model |-------------->| View |  :
    '--+~~~~~~~+<--------------+~~~~~~+--'

###TieMap
---
keep unique

* get (key [,defaultValue])

    only match the given property i.e : {a:1} equal {b:2}

* set (key, value)
* has (key)
* delete (key)
* clear ()
* forEach (callback)

###TieContact
---

* node TieNode
* role ""
    use as receive parameter in send  
    role of TieNode, i.e. parent means TieContact is TieNode's parent
* as ""
    use for routing, if receive parameter as is in TieContact.as, send
* handle
    receive message handle

###TieContacts extend TieMap
---
store TieContact with TieNode's target as key

###TieNode
---
keep unique, ignore binding same type, forward bindings with original path, ignore cycle, use a TieMap instance to store all TieNode instances, and promise unique.

     value,key,path +~~~~~~+ value,key,path
    --------------->| key  |---------------->
                    | edge |
                    +~~~~~~+

* TieNode (target, key, value, nodes)

    keep unique with a TieMap  
    nodes is used to store TieNode and keep unique, if empty, a global one will be use

* target {}

    use to promise unique, proxy target
    different instance use different key.for example,  
    model: `{object: {}, property: ""}`  
    view: `{node: Element, attribute: ""}`  

* key []

    use in send receive

* value {}

    store value  
    as host's getter setter value to sync host  

* contacts TieContacts

    use TieNode target as key.  
    there are different types of contact. for example,  
    `{node1.target : ParentContact, node2.target : ChildContact, node3.target : BindingContact}`  

* receive (message, as, from)

    from is instance of TieNode
    as values like `parent` `child` `binding`, empty means itself  
    if key is empty and as is not empty, updateMe  
    if key, path and as is empty, call all send  
    if path is circle, ignore  
    if key is not empty, path is not circle and as is not empty, call match send with clone of receive key and path  

* send (message, to)

    call to's key handle function,for example  
    to is instance of TieContact
    parents: unshift key,  
    children: shift key,  
    bindings: translate key.  
    get as value from to's role and call receive with clone of receive value, key and path.  

* update (value)

    always be overwrited  
    update proxy's value and render host  

###TieModel extend TieNode
---
TieModel bind View means absolute bind  

* TieModel ({object, property})

    set key

* set ()

    create model for children and watch, walk children, call children change with empty path

* update

    modify object[property] value

* watch

    watch object[property] change  
    if object[property] is array, use setInterval or setTimeout to detect array.length change  

* getChildModel (path)

    get child model with path  

###TieItem
---

###TieFilter
---

###TiePath
---
* TiePath (origin)

    set origin

* origin String
* path [TieItem|String]

###TieTemplate
---

* TieTemplate (origin)

    set origin

* origin String
* filter TieFilter
* template [TiePath|String]

###TieView extend TieNode
---

repeat element means cloneNode and all things

* TieView ({node : Node, attribute : attribute, index : pathIndex})

    ignore node deep equal

* contacts

    get from dom tree

* type "TieView"
* originValue

    use to store origin node value i.e attribute.class replace textNode replace

* update ()

###TieScopeView extend TieView
---

* type "TieScopeView"
* update ()

###markup

* path
    * path.to.value         =>  ["path", "to", "value"]
    * path["to"].value      =>  ["path", "to", "value"] //  /\[['"]?/gim are same as /\./gim, /['"]\]/gim will be ignore
    * path[0].value         =>  ["path", "0", "value"]  //number and string will be exchanged
    * path.to.value.<.value =>  ["path", "to", "value"]
    * <.to.value            =>  ["to", "value"]         //hange to parent scope
    * <2.to.value           =>  ["to", "value"]         //hange to parent's parent scope
    * /.to.value            =>  ["to", "value"]         //hange to root scope
* template
    * "{{path.to.value}} is {{path.to.another}}"
* directive attribute
    * data-bind-textContent
