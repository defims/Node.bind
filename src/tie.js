;(function(document, window, undefined){

    /*
     * Copyright 2012 The Polymer Authors. All rights reserved.
     * Use of this source code is governed by a BSD-style
     * license that can be found in the LICENSE file.
     */

    if (typeof WeakMap === 'undefined') {
      (function() {
        var defineProperty = Object.defineProperty;
        var counter = Date.now() % 1e9;

        var WeakMap = function() {
          this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
        };

        WeakMap.prototype = {
          set: function(key, value) {
            var entry = key[this.name];
            if (entry && entry[0] === key)
              entry[1] = value;
            else
              defineProperty(key, this.name, {value: [key, value], writable: true});
          },
          get: function(key) {
            var entry;
            return (entry = key[this.name]) && entry[0] === key ?
                entry[1] : undefined;
          },
          delete: function(key) {
            this.set(key, undefined);
          }
        };

        window.WeakMap = WeakMap;
      })();
    }

    function extend(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;
        if(superClass.prototype.constructor == Object.prototype.constructor)
            superClass.prototype.constructor = superClass;
    }
    // object.watch
    function watch(object ,prop, handler) {
        var
          _value = object[prop]
        , getter = function () {
            return _value;
        }
        , setter = function (value) {
            var oldValue = _value;
            _value = value;
            return handler(value);
        }
        ;

        if (delete this[prop]) { // can't watch constants
            Object.defineProperty(object, prop, {
                  get: getter
                , set: setter
                , enumerable: true
                , configurable: true
            });
        }
    }
    //var obj = {p : 1}
    //watch(obj, "p", function() {
    //    console.log(1)
    //})
    //obj.p = 2
    //console.log(obj)
    function cloneArray(array) {
        return array.length >0 ? array.join("*").split("*") : []
    }
    function unwatch(object ,prop) {
        var val = object[prop];
        delete object[prop]; // remove accessors
        object[prop] = val;
    }
    function isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    }
    function isObject(o) {
      return Object.prototype.toString.call(o) === '[object Object]';
    }
    function forEach(array, fn){
        if(array && array.length) {
            for(var i = 0, len = array.length; i < len; ++i) {
                if(fn) fn(array[i], i, array)
            }
        }
    }
    function walkDOM(node, func ,depth) {
        depth = depth || 0;
        func(node ,depth);
        node = node.firstChild;
        while (node) {
            walkDOM(node, func ,depth++);
            node = node.nextSibling;
        }
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
     
    function walkDOM(node, callback) {
      var skip, tmp;
      // This depth value will be incremented as the depth increases and
      // decremented as the depth decreases. The depth of the initial node is 0.
      var depth = 0;
     
      // Always start with the initial element.
      do {
        if ( !skip ) {
          // Call the passed callback in the context of node, passing in the
          // current depth as the only argument. If the callback returns false,
          // don't process any of the current node's children.
          skip = callback(node, depth) === false;
        }
     
        if ( !skip && (tmp = node.firstChild) ) {
          // If not skipping, get the first child. If there is a first child,
          // increment the depth since traversing downwards.
          depth++;
        } else if ( tmp = node.nextSibling ) {
          // If skipping or there is no first child, get the next sibling. If
          // there is a next sibling, reset the skip flag.
          skip = false;
        } else {
          // Skipped or no first child and no next sibling, so traverse upwards,
          tmp = node.parentNode;
          // and decrement the depth.
          depth--;
          // Enable skipping, so that in the next loop iteration, the children of
          // the now-current node (parent node) aren't processed again.
          skip = true;
        }
     
        // Instead of setting node explicitly in each conditional block, use the
        // tmp var and set it here.
        node = tmp;
     
      // Stop if depth comes back to 0 (or goes below zero, in conditions where
      // the passed node has neither children nore next siblings).
      } while ( depth > 0 );
    }
    function walkObject(o, func ,propertyPath ,objectPath) {
        propertyPath = propertyPath || [];
        objectPath = objectPath || [];
        objectPath.push(o);
        for (var i in o) {
            var newPropertyPath = cloneArray(propertyPath);
            newPropertyPath.push(i);
            func(o ,i ,newPropertyPath);
            if (o[i] !== null && typeof(o[i]) == "object") {
                var find = false
                    ;
                forEach(objectPath ,function(item) {
                    if(item === o[i]) {
                        find = true;
                    }
                })
                if(!find) walkObject(o[i] ,func ,newPropertyPath ,objectPath);
            }
        }
    }
    function find(object ,paths ,create) {
        var len = paths.length - 1
            ,ret = {property: paths[len]}
            ,i,path
            ;
        for (i = 0; i < len; ++i) {
            path = paths[i]
            if (path in object) {
                object = object[path]
            }
            else if(create) {
                object = object[path] = {}
            }
            else {
                return
            }
        }
        ret.object = object;
        return ret
    }
    function bind(binding ,path ,target ,index) {
        var current = binding
            ,defineProperty = Object.defineProperty
            ,_binding
            //,parent
            ;
        forEach(path ,function(item) {
            //parent = current;
            current = current[item] = current[item] || {}
            //if(!current.parent){
            //    defineProperty(current, "parent" ,{
            //        enumerable: false
            //        ,configurable: false
            //        ,writable: true
            //        ,value: parent
            //    })
            //}
        })
        _binding = current.binding;
        if(!_binding){
            _binding = [];
            defineProperty(current, "binding" ,{
                enumerable: false
                ,configurable: false
                ,writable: true
                ,value: _binding
            })
        }
        current.binding.push({index: index,target: target});

        defineProperty(target ,"binding" ,{
             enumerable: false
            ,configurable: false
            ,writable: true
            ,value: _binding
        })
    }
    function parsePath(str) {
        var path;
        if(str.charAt(0) == '.') {//.path.to.value
            str = str.slice(1)
        }
        if(str == "") {//.
            path = []
        }
        else {//path.to.value
            path = str.split(/\./gim);
        }
        return path
    }
    function processPath(path ,$$index) {
        forEach(path ,function(item ,index) {
            if(item == "$$index") {
                path[index] = $$index;
            }
        })
    }
    window.tie = function tie(node ,model ,tieTree) {
        var tieNodeTree = !!tieTree;
        if(!node || !model) return
        tieTree = tieTree || {}

        //tie.find(tieTree ,path ,function() {
        //    
        //} ,true)
        var treeObject = tieTree;
        tie.walkModel(model ,function(object ,property ,path) {
            console.log(path)
            tie.find(o)
        })

        if(tieNodeTree) {
            //tie node and tieTree
        }
        return {node: node ,model: model ,tieTree: tieTree}
        //retie need garbage recycle
        //var rootBinding = new Binding
        //    ;

        //views
        //tie.createViews(rootNode ,rootBinding);

        //models
        //tie.createModels(rootScope ,rootBinding);

        //return rootBinding
    }
    tie.createTieTree = function(node ,model) {
        
    }
    tie.walkModel = function(o ,callback ,propertyPath ,objectPath) {
        propertyPath = propertyPath || [];
        objectPath = objectPath || [];
        objectPath.push(o);
        for (var i in o) {
            var newPropertyPath = cloneArray(propertyPath);
            newPropertyPath.push(i);
            callback(o ,i ,newPropertyPath);
            if (o[i] !== null && typeof(o[i]) == "object") {
                var find = false
                    ;
                forEach(objectPath ,function(item) {
                    if(item === o[i]) {
                        find = true;
                    }
                })
                if(!find) walkObject(o[i] ,callback ,newPropertyPath ,objectPath);
            }
        }
    }
    tie.find = function(object ,paths ,create) {
        var len = paths.length - 1
            ,ret = {property: paths[len]}
            ,i,path
            ;
        for (i = 0; i < len; ++i) {
            path = paths[i]
            if (path in object) {
                object = object[path]
            }
            else if(create) {
                object = object[path] = {}
            }
            else {
                return
            }
        }
        ret.object = object;
        return ret
    }
    tie.createViews = function(scopeNode ,scopeBinding) {
        function walk(node ,scopeBinding ,scopeElement ,$$index) {
            var views = []
                ,repeatView ,scopeView
                ;
            if (node.nodeType === 1) {
                forEach(node.attributes ,function(attribute) {
                    if(attribute.nodeName.match(/data-tie-(.*)/gim)) {
                        var $1 = RegExp.$1;
                        view = new View(node ,$1.split(/-/gim) ,attribute.nodeValue)
                        if($1 == "scope") {
                            scopeView = view;
                        }
                        else if($1 == "repeat") {
                            repeatView = view;
                        }
                        else {
                            views.push(view);
                        }
                    }
                })
            }
            else if (node.nodeType === 3) {
                var nodeValue = node.nodeValue;
                if(nodeValue.match(/{{[\$\w\.]+}}/gim)) {
                    views.push(new View(node ,["textcontent"] ,nodeValue));
                }
                //todo view change update model
            }
            if(repeatView) {
                view.scopeElement = scopeElement;
                view.scopeBinding = scopeBinding;
                forEach(repeatView.template.paths ,function(path ,index) {
                    if(path !== undefined) {
                        processPath(path ,$$index);
                        var objProp = find(scopeBinding ,path ,true)
                            ,obj = objProp.object
                            ,prop = objProp.property
                            ,instances,prototype
                            ;

                        bind(scopeBinding ,path ,view ,index);

                        scopeBinding = obj[prop] = obj[prop] || {};
                        scopeElement = node;
                        //find node $$index
                        if((prototype = prototypeNodes.get(node))
                            && (instances = repeatNodes.get(prototype))) {
                            forEach(instances ,function(instance ,index) {
                                if(instance == node) {
                                    $$index = index + 1;
                                }
                            })
                        }
                        else {
                            $$index = 0;
                        }
                    }
                })
            }

            if(scopeView) {
                view.scopeElement = scopeElement;
                view.scopeBinding = scopeBinding;
                forEach(scopeView.template.paths ,function(path ,index) {
                    if(path !== undefined) {
                        processPath(path ,$$index);
                        var objProp = find(scopeBinding ,path ,true)
                            ,obj = objProp.object
                            ,prop = objProp.property
                            ;

                        bind(scopeBinding ,path ,view ,index);

                        scopeBinding = obj[prop] = obj[prop] || {};
                        scopeElement = node;
                    }
                })
            }

            forEach(views ,function(view){//todo view change update model
                view.scopeElement = scopeElement;
                view.scopeBinding = scopeBinding;
                forEach(view.template.paths ,function(path ,index) {
                    if(path !== undefined) {
                        processPath(path ,$$index);
                        bind(scopeBinding ,path ,view ,index);
                    }
                })
            })

            node = node.firstChild;
            while(node) {
                walk(node, scopeBinding ,scopeElement ,$$index);
                node = node.nextSibling;
            }
        }
        //todo tie element is not scope or repeat element
        walk(scopeNode ,(scopeBinding || new Binding) ,null ,0);

        return scopeBinding;
    }
    tie.createModels = function(object ,scopeBinding) {
        function walk(o ,scopeBinding ,path) {
            var i ,model;
            path.push(o);
            for (i in o) {
                scopeBinding[i] = scopeBinding[i] || {};
                model = new Model(object ,i);
                //model.path = cloneArray(path);
                bind(scopeBinding ,[i] ,model ,0);
                function update(value) {
                    //notice binding todo multiply path ,multi parent
                    //like var a = {b: 1},c = {c:a},d = {d: a}
                    forEach(model.binding ,function(binding) {
                        if(binding !== model) {
                            //console.log(binding ,value)
                            binding.target.update(binding.index ,value);
                        }
                    })
                }
                watch(o ,i ,function(value) {
                    if(model.value !== value) {
                        if(typeof(value) == "object") {
                            console.log(value)
                            walk(value ,scopeBinding ,path);
                            update(value);
                        }
                    }
                });
                update(o[i]);
                //avoid circle like var a = {b:a};
                if (o[i] !== null && typeof(o[i]) == "object") {
                    var find = false
                        ;
                    forEach(path ,function(item) {
                        if(item === o[i]) {
                            find = true;
                        }
                    })
                    if(!find) walk(o[i] ,scopeBinding[i] ,path);
                }
            }
        }
        walk(object ,(scopeBinding || new Binding) ,[]);
        //if(rootObject) {
        //    function update(value) {
        //        //notice binding todo multiply path ,multi parent
        //        //like var a = {b: 1},c = {c:a},d = {d: a}

        //        if(model.value !== value) {
        //            if(typeof(value) == "object") {
        //                //createModels(value ,path ,objectPath);
        //            }
        //            //console.log(value ,path)
        //            forEach(model.binding ,function(binding){
        //                console.log(binding)
        //                if(binding !== model) {
        //                    binding.update(value);
        //                }
        //            })
        //        }
        //    }
        //    walkObject(rootObject ,function(object ,property ,path) {
        //        var model = new Model(object ,property);
        //        bind(rootBinding ,path ,model);

        //        watch(object ,property ,update);
        //        //update(object[property]);
        //    })
        //}
    }
    tie.handle = {}
    tie.handle.textcontent = function(view) {
        view.node.textContent = view.value.join("");
    }
    tie.handle.attribute = {};
    tie.handle.attribute.class = function(view) {
        var attributeClass = node.tieValues.attribute.class
            ,originAttribute = node.tieOrigins.attribute
            ;
        //store origin class
        if(originAttribute.class == undefined) originAttribute.class = node.className || "";
        attributeClass[index] = value//.object[value.property];
        if(originAttribute.class == "") {
            node.className = attributeClass.join("");
        }
        else {
            node.className = originAttribute.class + " " + attributeClass.join("");
        }
    }
    var repeatNodes = new WeakMap
        ,prototypeNodes = new WeakMap
        ;
    tie.handle.repeat = function(view) {
        var node = view.node
            ,value = view.value[0]
            ,instances = repeatNodes.get(node) || []
            ,add = value.length - instances.length - 1
            ,lastInstance = instances[instances.length - 1] || node
            ,newNode,fragment,i
            ;
        repeatNodes.set(node ,instances);
        //walk and create new dom views
        if(add > 0) {//append after
            fragment = document.createDocumentFragment();
            for(i = 1; i <= add; i++) {
                newNode = node.cloneNode(true);
                fragment.appendChild(newNode);
                instances.push(newNode);
                prototypeNodes.set(newNode ,node);
                tie.createViews(newNode ,view.scopeBinding);
            }
            lastInstance.parentElement.insertBefore(fragment ,lastInstance.nextSibling)
        }
        else {//remove exist
        }
    }



    function Template(str) {
        var that = this
            ,parsed = str.split(/({{[\$\w\.]+)}}/gim)
            ,index = 0
            ;
        that.paths = [];
        that.strings = [];
        forEach(parsed, function(item) {
            if(item.charAt(0) == '{' && item.charAt(1) == '{') {
                that.paths[index++] = parsePath(item.slice(2));
            }
            else if(item.charAt(0)){
                that.strings[index++] = item;
            }
        })
    }
    //Template.prototype.index = function(path) {
    //    return index
    //}
    //console.log(new Template)
    //use a weakmap to store value in node, avoid polute dom
    var nodes = new WeakMap;
    function View(node ,directive ,template ,scope) {
        var that = this
            ,current
            ;
        that.node = node;
        that.directive = directive;
        that.template = new Template(template);
        that.value = [];
        //init value with template string
        forEach(that.template.strings ,function(item ,index) {
            if(item !== "" && item !== undefined) {
                that.value[index] = item
            }
        })
        nodes.set(node, that);
    }
    View.prototype.update = function(index ,value) {
        var that = this
            ,fn = find(tie.handle ,that.directive)
            ;
        fn = fn.object[fn.property];
        if(typeof(path) == "string") {
            path = parsePath(path);
        }
        forEach(that.template.paths ,function(path) {
            if(path) {
                that.value[index] = value;
            }
        })
        fn(that);
    }
    function Model(object ,property) {
        var that = this
            ;
        that.object = object || {};
        that.property = property || "";
        that.value = object[property];
    }
    Model.prototype.update = function(path ,value ,rootBinding) {
        return
        //console.log("update" ,value)
        var that = this
            ;
        if(that.value !== value) {
            console.log("really update")
            that.value = value;
            that.object[that.property] = value;
        }
    }

    function Binding() {}
    Binding.prototype.update = function(path ,value) {
        var that = this
            ,node = find(that ,path)
            ;
        console.log(path)
        if(node !== undefined && (node = node.object[node.property])){
            forEach(node.binding ,function(binding) {
                binding.update(path ,value)
            })
        }
    }


})(document, window)
