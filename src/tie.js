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
        for(var i = 0, len = array.length; i < len; ++i) {
            fn(array[i], i, array)
        }
    }
    function walkDOM(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkDOM(node, func);
            node = node.nextSibling;
        }
    }
    function walkObject(o, func ,propertyPath ,valuePath) {
        propertyPath = propertyPath || [];
        valuePath = valuePath || [];
        valuePath.push(o);
        for (var i in o) {
            var newPropertyPath = propertyPath.length > 0 ? propertyPath.join("*").split("*") : propertyPath;
            newPropertyPath.push(i);
            func(o ,i ,newPropertyPath);
            if (o[i] !== null && typeof(o[i]) == "object") {
                var find = false
                    ;
                forEach(valuePath ,function(item) {
                    if(item === o[i]) {
                        find = true;
                    }
                })
                if(!find) walkObject(o[i],func,newPropertyPath ,valuePath);
            }
        }
    }
    function find(object ,paths) {
        var len = paths.length - 1
            ,ret = {property: paths[len]}
            ,i,path
            ;
        for (i = 0; i < len; ++i) {
            path = paths[i]
            if (path in object) {
                object = object[path]
            } else {
                return
            }
        }
        ret.object = object;
        return ret
    }
    function Model(object ,property) {
        var that = this
            ;
        that.object = object || {};
        that.property = property || "";
    }
    Model.prototype.update = function(value) {
        var that = this
            ;
        that.object[that.property] = value;
    }
    var handle = {}
    handle.textcontent = function(node ,value ,index) {
        var textcontent = node.tieValues.textcontent
            ;
        textcontent[index] = value;//.object[value.property];
        node.textContent = textcontent.join("");
    }
    handle.attribute = {};
    handle.attribute.class = function(node ,value ,index) {
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
    handle.repeat = function(node ,value ,index) {
        console.log(node)
    }
    function View(directive ,node ,index) {
        var that = this
            ;
        that.directive = directive || [];
        that.node = node || null;
        that.index = index || -1;
    }
    View.prototype.update = function(value) {
        var that = this
            ,fn = find(handle ,that.directive)
            ;
        fn.object[fn.property](that.node ,value ,that.index)
    }
    function Template(directive ,node) {
        
    }
    var nodes = new WeakMap;
    function createView(node ,directive ,template ,views) {
        views = views || {};
        var view = {a:1};
        var parsedTpl = template.replace(/{{([\w\.]+)}}/gim, function(match ,path ,index) {
            console.log(arguments)
            var view = views[path] = views[path] || [];
            view.push(new View);
            console.log(views)
        })
        nodes.set(node, view);
        console.log(arguments);
        console.log(nodes);
    }
    function createModel(node ,directive ,template ,views) {
    }
    /*
    function createView(node ,directive ,template ,views) {
        if(!template.match(/{{.*?}}/gim)) return
        //store initial value
        var tieValues = node.tieValues = node.tieValues || {}
            ,tieOrigins = node.tieOrigins = node.tieOrigins || {}
            ,tieValue = tieValues
            ,tieOrigin = tieOrigins
            ,len = directive.length - 1
            ,i = 0
            ,item
            ;
        for (i=0 ;i<len ;++i) {
            item = directive[i];
            if(!(item in tieValue)) {
                tieValue[item] = tieValue[item] || {}
                tieOrigin[item] = tieOrigin[item] || {}
            }
            tieValue = tieValue[item]
            tieOrigin = tieOrigin[item]
        }
        tieValue = tieValue[directive[len]] =  tieValue[directive[len]] || [];
        //render template
        forEach(template.split(/({{.*?}})/gim), function(path ,index) {
            if(path.match(/{{.*?}}/gim)) {
                var token = path.slice(2,-2)
                    ,path = token.split(/\./gim)
                    ,view = views[token]
                    ,fn = find(handle ,directive)
                    ;
                if(!view) view = views[token] = [];
                var has = false
                forEach(view, function(item) {
                    if(item.directive.join(".") === directive.join(".")
                        && item.node === node
                        && item.index === index
                    ){
                        has = true;
                    }
                })
                if(!has) {
                    view.push(new View(directive ,node ,index))
                }
            }
            else if(path !== ""){
                tieValue[index] = path;
            }
        })
    }
    */
    function tie(node ,scope) {//simple dom template without repeat directive
        //retie need garbage recycle
        var views = {}
            ,models = {}
            ;

        //views
        if(node) walkDOM(node, function (node) {
            if (node.nodeType === 1) {
                var attributes = node.attributes;
                forEach(attributes ,function(attribute) {
                    if(attribute.nodeName.match(/data-bind-(.*)/gim)) {
                        var directive = RegExp.$1.split(/-/gim)
                        createView(node ,directive ,attribute.nodeValue ,views);
                        //todo view change update model
                    }
                })
            }
            else if (node.nodeType === 3) {
                createView(node ,["textcontent"] ,node.nodeValue ,views);
                //todo view change update model
            }
        });

        //models
        if(scope) walkObject(scope ,function(object ,property ,path) {
            return
            console.log(object ,property ,path)
            var token = path.join(".");
            models[token] = new Model(object ,property);
            function update(value) {
                var view = views[token];
                if(view) {
                    forEach(view ,function(item) {
                        item.update(value)
                    })
                }
            }
            watch(object ,property ,update)
            update(object[property])
        })

        return {views: views ,models: models}
    }
    window.tie = tie;

})(document, window)
