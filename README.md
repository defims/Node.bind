#Node.bind

##Usage:

* when call Node(node).bind(targetName), if target type is Function,Array or Object , bind function will get the address of target, and detect changes of it. if target type is Number,String or Boolean, a copy of target will be translate. so type of bind function'argument is a string.
* $i means the repeat index

###example

html:

    <div class='elementArray'>
        <div class="arrayChild">elementArray</div>
    </div>

js:

    var data ={
        arr     : [1,2,3,4]
    };
    NodeBind(document.getElementsByClassName('elementArray')).bind('data.arr');
    NodeBind(document.getElementsByClassName('arrayChild')).bind('$i');
    data.arr.push(5);
    data.arr.push(6);
    data.arr.push(9);

render:

    <div class="elementArray">
        <div class="arrayChild">1</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">2</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">3</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">4</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">5</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">6</div>
    </div>
    <div class="elementArray">
        <div class="arrayChild">9</div>
    </div>

##Node Binding Rule:

* ELEMENT.bind
    * Array:
        * repeat this ELEMENT to Array.length, set scope to each repeated ELEMENT.

    * Object:
        * set scope to this ELEMENT.

    * Boolean:
        * set visiblity of this ELEMENT.

    * Undefined,Null:
        * hide this ELEMENT.

    * Number,String:
        * set textContent of this ELEMENT.

    * Function:
        * set handle function of this ELEMENT, observe(target, callback) method can be call in the function.

* ATTRIBUTE.bind
    * Array:
        * if ATTRIBUTE is class and Array item is Number,String,Boolean,Undefined or Null, nodeValue of ATTRIBUTE will be setted as Array.join(' ').

    * Object:
        * if ATTRIBUTE is style and Object item is Number,String,Boolean,Undefined or Null, nodeValue of ATTRIBUTE will be set css like string of this Object.
        * if ATTRIBUTE is dataset and Object item is Number,String,Boolean,Ubdefined or Null, dataset of ELEMENT will be set.

    * Boolean:
        * if ATTRIBUTE is checked, nodeValue will be toggle to checked or empty.
        * if ATTRIBUTE is disabled, nodeValue will be toggle to empty or disabled.
        * if ATTRIBUTE is readonly, nodeValue will be toggle to readonly or empty.
        * otherwise,toggle nodeValue of this ATTRIBUTE empty or not.

    * Undefined,Null:
        * set nodeValue of this ATTRIBUTE empty.

    * Number,String:
        * set nodeValue of this ATTRIBUTE.

    * Function:
        * set handle function of this ATTRIBUTE, observe(target, callback) method can be call in the function.

* TEXT.bind
    * Array:
        * if Array item is Number,String,Boolean,Undefined or Null, nodeValue of TEXT will be setted as Array.join().

    * Object:
        * set nodeValue of TEXT JSON.stringify(Object).

    * Boolean:
        * set nodeValue of this TEXT 'true' or 'false'.

    * Undefined,Null:
        * set nodeValue of this TEXT empty.

    * Number,String:
        * set nodeValue of this TEXT.

    * Function:
        * set handle function of this ATTRIBUTE, observe(target, callback) method can be call in the function.

* CDATASECTION.bind
    * ignore

* ENTITYREFERENCE.bind
    * ignore

* ENTITY
    * ignore

* PROCESSINGINSTRUCTION.bind
    * ignore

* COMMENT.bind
    * ignore

* DOCUMENT.bind
    * ignore

* DOCUMENTTYPE.bind
    * ignore

* DOCUMENTFRAGMENT.bind
    * ignore
#Node.bind

##Node Binding Rule:

* ELEMENT.bind
    * Array:
        * repeat to Array.length with a DOCUMENTFRAGMENT wraped this ELEMENT, set scope to each repeated ELEMENT.

    * Object:
        * set scope to this ELEMENT.

    * Boolean:
        * set visiblity of this ELEMENT.

    * Undefined,Null:
        * hide this ELEMENT.

    * Number,String:
        * set textContent of this ELEMENT.

    * Function:
        * set handle function of this ELEMENT, observe(target, callback) method can be call in the function.

* ATTRIBUTE.bind
    * Array:
        * if ATTRIBUTE is class and Array item is Number,String,Boolean,Undefined or Null, nodeValue of ATTRIBUTE will be setted as Array.join(' ').

    * Object:
        * if ATTRIBUTE is style and Object item is Number,String,Boolean,Undefined or Null, nodeValue of ATTRIBUTE will be set css like string of this Object.
        * if ATTRIBUTE is dataset and Object item is Number,String,Boolean,Ubdefined or Null, dataset of ELEMENT will be set.

    * Boolean:
        * if ATTRIBUTE is checked, nodeValue will be toggle to checked or empty.
        * if ATTRIBUTE is disabled, nodeValue will be toggle to empty or disabled.
        * if ATTRIBUTE is readonly, nodeValue will be toggle to readonly or empty.
        * otherwise,toggle nodeValue of this ATTRIBUTE empty or not.

    * Undefined,Null:
        * set nodeValue of this ATTRIBUTE empty.

    * Number,String:
        * set nodeValue of this ATTRIBUTE.

    * Function:
        * set handle function of this ATTRIBUTE, observe(target, callback) method can be call in the function.

* TEXT.bind
    * Array:
        * if Array item is Number,String,Boolean,Undefined or Null, nodeValue of TEXT will be setted as Array.join().

    * Object:
        * set nodeValue of TEXT JSON.stringify(Object).

    * Boolean:
        * set nodeValue of this TEXT 'true' or 'false'.

    * Undefined,Null:
        * set nodeValue of this TEXT empty.

    * Number,String:
        * set nodeValue of this TEXT.

    * Function:
        * set handle function of this ATTRIBUTE, observe(target, callback) method can be call in the function.

* CDATASECTION.bind
    * ignore

* ENTITYREFERENCE.bind
    * ignore

* ENTITY
    * ignore

* PROCESSINGINSTRUCTION.bind
    * ignore

* COMMENT.bind
    * ignore

* DOCUMENT.bind
    * ignore

* DOCUMENTTYPE.bind
    * ignore

* DOCUMENTFRAGMENT.bind
    * ignore

* NOTATION.bind
    * ignore
