if (typeof bravojs == 'undefined') { bravojs = {}; }
if (typeof window != 'undefined' && typeof bravojs.url == 'undefined') {
bravojs.url = window.location.protocol + '//' + window.location.host + '/ace/AceEditor.js';
} else if(typeof importScripts != 'undefined' && typeof bravojs.url == 'undefined') {
bravojs.url = location;
}
bravojs.mainModuleDir = /^(https?|resource):\/(.*?)\.js$/.exec(bravojs.url)[2];
bravojs.mainContext = bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09';
bravojs.platform = 'browser';
function dump() { (bravojs.dump || bravojs.print).apply(null, arguments); };

// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson
// dantman Daniel Friesen

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

// Brings an environment as close to ECMAScript 5 compliance
// as is possible with the facilities of erstwhile engines.

// ES5 Draft
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf

// NOTE: this is a draft, and as such, the URL is subject to change.  If the
// link is broken, check in the parent directory for the latest TC39 PDF.
// http://www.ecma-international.org/publications/files/drafts/

// Previous ES5 Draft
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
// This is a broken link to the previous draft of ES5 on which most of the
// numbered specification references and quotes herein were taken.  Updating
// these references and quotes to reflect the new document would be a welcome
// volunteer project.

//
// Array
// =====
//

// ES5 15.4.3.2 
if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Array]";
    };
}

// ES5 15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function(block, thisObject) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
          throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }

        return res;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function (block /*, thisp */) {
        var values = [];
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                values.push(this[i]);
        return values;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function (block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (!block.call(thisp, this[i]))
                return false;
        return true;
    };
}

// ES5 15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function (block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                return true;
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            } while (true);
        }

        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        // no value to return if no initial value, empty array
        if (len == 0 && arguments.length == 1)
            throw new TypeError();

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError();
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (value /*, fromIndex */ ) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || 0;
        if (i >= length)
            return -1;
        if (i < 0)
            i += length;
        for (; i < length; i++) {
            if (!Object.prototype.hasOwnProperty.call(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (value /*, fromIndex */) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || length;
        if (i < 0)
            i += length;
        i = Math.min(i, length - 1);
        for (; i >= 0; i--) {
            if (!Object.prototype.hasOwnProperty.call(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
// 

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function (object) {
        return object.__proto__;
        // or undefined if not available in this engine
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    Object.getOwnPropertyDescriptor = function (object) {
        return {}; // XXX
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function (object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5 
if (!Object.create) {
    Object.create = function(prototype, properties) {
        if (typeof prototype != "object" || prototype === null)
            throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
        function Type() {};
        Type.prototype = prototype;
        var object = new Type();
        if (typeof properties !== "undefined")
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
if (!Object.defineProperty) {
    Object.defineProperty = function(object, property, descriptor) {
        var has = Object.prototype.hasOwnProperty;
        if (typeof descriptor == "object" && object.__defineGetter__) {
            if (has.call(descriptor, "value")) {
                if (!object.__lookupGetter__(property) && !object.__lookupSetter__(property))
                    // data property defined and no pre-existing accessors
                    object[property] = descriptor.value;
                if (has.call(descriptor, "get") || has.call(descriptor, "set"))
                    // descriptor has a value property but accessor already exists
                    throw new TypeError("Object doesn't support this action");
            }
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(has.call(descriptor, "writable") ? descriptor.writable : true) ||
                !(has.call(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(has.call(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */
            else if (typeof descriptor.get == "function")
                object.__defineGetter__(property, descriptor.get);
            if (typeof descriptor.set == "function")
                object.__defineSetter__(property, descriptor.set);
        }
        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function(object, properties) {
        for (var property in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function (object) {
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function (object) {
        return object;
    };
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function (object) {
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function (object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function (object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function (object) {
        return true;
    };
}

// ES5 15.2.3.14
if (!Object.keys) {
    Object.keys = function (object) {
        var keys = [];
        for (var name in object) {
            if (Object.prototype.hasOwnProperty.call(object, name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a subset of the ISO-8601 standard.
// Useful in Atom, among other things.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function() {
        return (
            this.getFullYear() + "-" +
            (this.getMonth() + 1) + "-" +
            this.getDate() + "T" +
            this.getHours() + ":" +
            this.getMinutes() + ":" +
            this.getSeconds() + "Z"
        ); 
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function (key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString != "function")
            throw new TypeError();
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("T00:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length === 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format
        var isoDateExpression = new RegExp("^" +
            "(?:" + // optional year-month-day
                "(" + // year capture
                    "(?:[+-]\\d\\d)?" + // 15.9.1.15.1 Extended years
                    "\\d\\d\\d\\d" + // four-digit year
                ")" +
                "(?:-" + // optional month-day
                    "(\\d\\d)" + // month capture
                    "(?:-" + // optional day
                        "(\\d\\d)" + // day capture
                    ")?" +
                ")?" +
            ")?" + 
            "(?:T" + // hour:minute:second.subsecond
                "(\\d\\d)" + // hour capture
                ":(\\d\\d)" + // minute capture
                "(?::" + // optional :second.subsecond
                    "(\\d\\d)" + // second capture
                    "(?:\\.(\\d\\d\\d))?" + // milisecond capture
                ")?" +
            ")?" +
            "(?:" + // time zone
                "Z|" + // UTC capture
                "([+-])(\\d\\d):(\\d\\d)" + // timezone offset
                // capture sign, hour, minute
            ")?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle the ISO dates we use
        // TODO review specification to ascertain whether it is
        // necessary to implement partial ISO date strings.
        Date.parse = function(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // recognize times without dates before normalizing the
                // numeric values, for later use
                var timeOnly = match[0] === undefined;
                // parse numerics
                for (var i = 0; i < 10; i++) {
                    // skip + or - for the timezone offset
                    if (i === 7)
                        continue;
                    // Note: parseInt would read 0-prefix numbers as
                    // octal.  Number constructor or unary + work better
                    // here:
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // Date objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i === 1)
                        match[i]--;
                }
                // if no year-month-date is provided, return a milisecond
                // quantity instead of a UTC date number value.
                if (timeOnly)
                    return ((match[3] * 60 + match[4]) * 60 + match[5]) * 1000 + match[6];

                // account for an explicit time zone offset if provided
                var offset = (match[8] * 60 + match[9]) * 60 * 1000;
                if (match[6] === "-")
                    offset = -offset;

                return NativeDate.UTC.apply(this, match.slice(0, 7)) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// 
// Function
// ========
// 

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
var slice = Array.prototype.slice;
if (!Function.prototype.bind) {
    Function.prototype.bind = function (that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        // XXX this gets pretty close, for all intents and purposes, letting 
        // some duck-types slide
        if (typeof target.apply != "function" || typeof target.call != "function")
            return new TypeError();
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        var args = slice.call(arguments);
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var self = Object.create(target.prototype);
                target.apply(self, args.concat(slice.call(arguments)));
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.call.apply(
                    target,
                    args.concat(slice.call(arguments))
                );

            }

        };
        // 5. Set the [[TargetFunction]] internal property of F to Target.
        // extra:
        bound.bound = target;
        // 6. Set the [[BoundThis]] internal property of F to the value of
        // thisArg.
        // extra:
        bound.boundTo = that;
        // 7. Set the [[BoundArgs]] internal property of F to A.
        // extra:
        bound.boundArgs = args;
        bound.length = (
            // 14. If the [[Class]] internal property of Target is "Function", then
            typeof target == "function" ?
            // a. Let L be the length property of Target minus the length of A.
            // b. Set the length own property of F to either 0 or L, whichever is larger.
            Math.max(target.length - args.length, 0) :
            // 15. Else set the length own property of F to 0.
            0
        )
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

//
// String
// ======
//

// ES5 15.5.4.20
if (!String.prototype.trim) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    String.prototype.trim = function () {
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
}


/**
 *  This file implements BravoJS, a CommonJS Modules/2.0 environment.
 *
 *  Copyright (c) 2010, PageMail, Inc.
 *  Wes Garland, wes@page.ca
 *  MIT License
 *
 *    - Initial implementation
 *
 *  Copyright (c) 2011, Christoph Dorn
 *  Christoph Dorn, christoph@christophdorn.com
 *  MIT License
 *
 *    - Added package and mappings support
 *    - Various tweaks
 *
 */

function bravojs_init(bravojs,    /**< Namespace object for this implementation */
                      window)
{
try {

bravojs.window = window;

if (!bravojs.hasOwnProperty("errorReporter"))
{
  bravojs.errorReporter = function bravojs_defaultDrrorReporter(e)
  {
    if (typeof alert != "undefined")
        alert(" * BravoJS: " + e + "\n" + e.stack);
    throw(e);
  }
}

/** Reset the environment so that a new main module can be loaded */
bravojs.reset = function bravojs_reset(mainModuleDir, plugins)
{
  if (!mainModuleDir)
  {
    if (typeof bravojs.mainModuleDir != "undefined")
      mainModuleDir = bravojs.mainModuleDir;
    else
      mainModuleDir = bravojs.dirname(bravojs.URL_toId(window.location.href + ".js", true));
  }

  bravojs.requireMemo 			= {};	/**< Module exports, indexed by canonical name */
  bravojs.pendingModuleDeclarations	= {};	/**< Module.declare arguments, indexed by canonical name */
  bravojs.mainModuleDir 		= mainModuleDir;
  bravojs.plugins = plugins || [];
  bravojs.contexts = {};
  bravojs.activeContexts = [];

  delete bravojs.Module.prototype.main;
  delete bravojs.scriptTagMemo;
  delete bravojs.scriptTagMemoIE;

  /* The default context. Needed before bravojs.Module() can be called. */
  bravojs.makeContext("_");

  /** Extra-module environment */
  bravojs.module = window.module = new bravojs.Module('', []);
  bravojs.require = window.require = bravojs.requireFactory(bravojs.mainModuleDir, [], bravojs.module);

  /* Module.declare function which handles main modules inline SCRIPT tags.
   * This function gets deleted as soon as it runs, allowing the module.declare
   * from the prototype take over. Modules created from this function have
   * the empty string as module.id.
   */
  bravojs.module.declare = function main_module_declare(dependencies, moduleFactory)
  {
    if (typeof dependencies === "function")
    {
      moduleFactory = dependencies;
      dependencies = [];
    }

    bravojs.initializeMainModule(dependencies, moduleFactory, '');
  }
}

/** Print to text to stdout */
function bravojs_print()
{
  var output="";
  var i;
  var stdout;

  for (i=0; i < arguments.length; i++)
    output += arguments[i] + (i===arguments.length - 1 ? "" : " ");
  output.replace(/\t/, "        ");

  if (typeof window.document != "undefined" && (stdout = window.document.getElementById('stdout')))
  {
    output += "\n";

    if (typeof stdout.value !== "undefined")
    {
      stdout.value += output;
      if (stdout.focus)
        stdout.focus();

      if (stdout.tagName === "TEXTAREA")
        stdout.scrollTop = stdout.scrollHeight;
    }
    else
    {
      if (typeof stdout.innerText !== "undefined")
      {
        stdout.innerText = stdout.innerText.slice(0,-1) + output + " "; 	/* IE normalizes trailing newlines away */
      }
      else
        stdout.textContent += output;
    }
  }
  else if (typeof console === "object" && console.print)
  {
    console.print(output);
  }
  else if (typeof console === "object" && console.log)
  {
    console.log(output);
  }
  // WebWorker
  else if (typeof importScripts === "function" && typeof postMessage === "function")
  {
      postMessage({type: "log", data: output});
  }
  else
    alert(" * BravoJS stdout: " + output);
}
if (typeof bravojs.print === "undefined")
    bravojs.print = bravojs_print;

bravojs.registerPlugin = function(plugin)
{
    plugin.bravojs = bravojs;
    bravojs.plugins.push(plugin);
    if (typeof plugin.init == "function")
      plugin.init();
}

bravojs.callPlugins = function(method, args)
{
  var i, ret;
  for (i = 0 ; i < bravojs.plugins.length ; i++ )
  {
    if (typeof bravojs.plugins[i][method] != "undefined" &&
        typeof (ret = bravojs.plugins[i][method].apply(bravojs.plugins[i], args)) != "undefined")
        break;
  }
  return ret;
}

/** Canonicalize path, compacting slashes and dots per basic UNIX rules.
 *  Treats paths with trailing slashes as though they end with INDEX instead.
 *  Not rigorous.
 */
bravojs.realpath = function bravojs_realpath(path, index)
{
  if (typeof index === "undefined")
    index = "INDEX";
  if (typeof path !== "string")
    path = path.toString();

  var oldPath = path.split('/');
  var newPath = [];
  var i;

  if (path.charAt(path.length - 1) === '/' && index)
    oldPath.push(index);

  for (i = 0; i < oldPath.length; i++)
  {
    if (oldPath[i] == '.' || !oldPath[i].length)
      continue;
    if (oldPath[i] == '..')
    {
      if (!newPath.length)
	throw new Error("Invalid module path: " + path);
      newPath.pop();
      continue;
    }
    newPath.push(oldPath[i]);
  }

  newPath.unshift('');
  return newPath.join('/');
}

/** Extract the non-directory portion of a path */
bravojs.basename = function bravojs_basename(path)
{
  if (typeof path !== "string")
    path = path.toString();

  var s = path.split('/').slice(-1).join('/');
  if (!s)
    return path;
  return s;
}

/** Extract the directory portion of a path */
bravojs.dirname = function bravojs_dirname(path)
{
  if (typeof path !== "string")
    path = path.toString();

  if (path.charAt(path.length - 1) === '/')
    return path.slice(0,-1);

  var s = path.split('/').slice(0,-1).join('/');
  if (!s)
    return ".";

  return s;
}

/** Turn a module identifier and module directory into a canonical
 *  module.id.
 */
bravojs.makeModuleId = function makeModuleId(relativeModuleDir, moduleIdentifier)
{
  return bravojs.contextForId(relativeModuleDir, true).resolveId(moduleIdentifier, relativeModuleDir);
}

/** Turn a script URL into a canonical module.id */
bravojs.URL_toId = function URL_toId(moduleURL, relaxValidation)
{
  var i;

  /* Treat the whole web as our module repository.
   * 'http://www.page.ca/a/b/module.js' has id '/www.page.ca/a/b/module'. 
   */
  i = moduleURL.indexOf("://");
  if (i == -1)
    throw new Error("Invalid module URL: " + moduleURL);
  id = moduleURL.slice(i + 2);

  id = bravojs.realpath(id);
  if ((i = id.indexOf('?')) != -1)
    id = id.slice(0, i);
  if ((i = id.indexOf('#')) != -1)
    id = id.slice(0, i);

  if (!relaxValidation && (id.slice(-3) != ".js"))
    throw new Error("Invalid module URL: " + moduleURL);
  id = id.slice(0,-3);

  return id;
}

/** Normalize a dependency array so that only unique and previously unprovided 
 *  dependencies appear in the output list. The output list also canonicalizes
 *  the module names relative to the current require. Labeled dependencies are
 *  unboxed.
 *  If relativeModuleDir is set it is used to resolve relative dependencies.
 */
bravojs.normalizeDependencyArray = function bravojs_normalizeDependencyArray(dependencies, relativeModuleDir)
{
  var normalizedDependencies = [];
  var i, label;

  function addNormal(moduleIdentifier)
  {
    var id = moduleIdentifier;

    if (typeof id != "string" || id.charAt(0) != "/")
      id = bravojs.contextForId(relativeModuleDir, true).resolveId(id, relativeModuleDir);

    if (id === null)
      return;

    if (bravojs.requireMemo[id] || bravojs.pendingModuleDeclarations[id])
      return;

    normalizedDependencies.push(id);
  }

  for (i=0; i < dependencies.length; i++)
  {
    if (dependencies[i])
    {
      switch(typeof dependencies[i])
      {
        case "object":
          for (label in dependencies[i])
          {
            if (dependencies[i].hasOwnProperty(label))
              addNormal(dependencies[i][label]);
          }
          break;

        case "string":
          addNormal(dependencies[i]);
          break;

        default:
          throw new Error("Invalid dependency array value at position " + (i+1));
      }
    }
  }

  return normalizedDependencies;
}

/** Get a context for a given module ID used to resolve the ID.
 * Plugins should override this function to provide additional contexts.
 */
bravojs.contextForId = function bravojs_contextForId(id, onlyCreateIfDelimited)
{
  return bravojs.contexts["_"];
}

/** Make a new context used to resolve module IDs. */
bravojs.makeContext = function bravojs_makeContext(id)
{
  return bravojs.contexts[id] = new bravojs.Context(id);
}

/** A Context object used to resolve IDs. */
bravojs.Context = function bravojs_Context(id)
{
  this.id = id;
}

bravojs.Context.prototype.resolveId = function bravojs_Context_resolveId(moduleIdentifier, relativeModuleDir)
{
  var id;

  if (moduleIdentifier === '')  /* Special case for main module */
    return '';

  if (typeof moduleIdentifier !== "string")
    throw new Error("Invalid module identifier: " + moduleIdentifier);

  if (moduleIdentifier.charAt(0) === '/')
  {
    /* Absolute path. Not required by CommonJS but it makes dependency list optimization easier */
    id = moduleIdentifier;
  }
  else
  if ((moduleIdentifier.indexOf("./") == 0) || (moduleIdentifier.indexOf("../") == 0))
  {
    /* Relative module path -- relative to relativeModuleDir */
    id = relativeModuleDir + "/" + moduleIdentifier;
  }
  else
  {
    /* Top-level module. Since we don't implement require.paths,
     *  make it relative to the main module.
     */
    id = bravojs.mainModuleDir + "/" + moduleIdentifier;
  }

  return bravojs.realpath(id);
}

/** Provide a module to the environment 
 *  @param	dependencies		A dependency array
 *  @param	moduleFactoryFunction	The function which will eventually be invoked
 *					to decorate the module's exports. If not specified,
 *					we assume the factory has already been memoized in
 *					the bravojs.pendingModuleDeclarations object.
 *  @param	id			The module.id of the module we're providing
 *  @param	callback		Optional function to run after the module has been
 *					provided to the environment
 */
bravojs.provideModule = function bravojs_provideModule(dependencies, moduleFactory, 
						       id, callback)
{
  /* Memoize the the factory, satistfy the dependencies, and invoke the callback */
  if (moduleFactory)
    bravojs.require.memoize(id, dependencies, moduleFactory);

  if (dependencies)
  {
    bravojs.module.provide(bravojs.normalizeDependencyArray(dependencies, id?bravojs.dirname(id):bravojs.mainModuleDir), callback);
  }
  else
  {
    if (callback)
      callback();
  }
}

/** Initialize a module. This makes the exports object available to require(),
 *  runs the module factory function, and removes the factory function from
 *  the pendingModuleDeclarations object.
 */
bravojs.initializeModule = function bravojs_initializeModule(id)
{
  var moduleDir     = id ? bravojs.dirname(id) : bravojs.mainModuleDir;
  var moduleFactory = bravojs.pendingModuleDeclarations[id].moduleFactory;
  var dependencies  = bravojs.pendingModuleDeclarations[id].dependencies;
  var require, exports, module;

  delete bravojs.pendingModuleDeclarations[id];

  exports = bravojs.requireMemo[id] = {};
  module  = new bravojs.Module(id, dependencies);

  if (typeof module.augment == "function")
    module.augment();

  require = bravojs.requireFactory(moduleDir, dependencies, module);

  moduleFactory(require, exports, module);
}

/** Search the module memo and return the correct module's exports, or throw.
 *  Searching the module memo will initialize a matching pending module factory.
 */
bravojs.requireModule = function bravojs_requireModule(parentModuleDir, moduleIdentifier)
{
  /* Remove all active contexts as they are not needed any more (load cycle complete) */
  bravojs.activeContexts = [];

  var id = bravojs.makeModuleId(parentModuleDir, moduleIdentifier);

  var exports = bravojs.callPlugins("requireModule", [id]);
  if (typeof exports != "undefined")
  {
    if (exports === true)
      return bravojs.requireMemo[id];
    return bravojs.requireMemo[id] = exports;
  }

  /* If id is false the module is not available */
  if (id === false)
    return null;

  if (!bravojs.requireMemo[id] && bravojs.pendingModuleDeclarations[id])
    bravojs.initializeModule(id);

  if (id === null || !bravojs.requireMemo[id])
    throw new Error("Module " + id + " is not available.");

  return bravojs.requireMemo[id];
}

/** Create a new require function, closing over it's path so that relative
 *  modules work as expected.
 */
bravojs.requireFactory = function bravojs_requireFactory(moduleDir, dependencies, module)
{
  var deps, i, label;

  function getContextSensitiveModuleDir()
  {
    var contextId;
    if (bravojs.activeContexts.length > 0)
      contextId = bravojs.activeContexts[bravojs.activeContexts.length-1].id;
    if (typeof contextId == "undefined" || !contextId)
      contextId = moduleDir;
    else
    if (contextId == "_")
      contextId = bravojs.mainModuleDir;
    return contextId;
  }

  function addLabeledDep(moduleIdentifier)
  {
    deps[label] = function bravojs_labeled_dependency() 
    { 
      return bravojs.requireModule(getContextSensitiveModuleDir(), moduleIdentifier);
    }
  }

  if (dependencies)
  {
    for (i=0; i < dependencies.length; i++)
    {
      if (typeof dependencies[i] !== "object")
	continue;

      for (label in dependencies[i])
      {
	if (dependencies[i].hasOwnProperty(label))
	{
	  if (!deps)
	    deps = {};
	  addLabeledDep(dependencies[i][label]);
	}
      }
    }
  }

  var newRequire = function require(moduleIdentifier) 
  {
    if (deps && deps[moduleIdentifier])
      return deps[moduleIdentifier]();
    return bravojs.requireModule(getContextSensitiveModuleDir(), moduleIdentifier);
  };

  var ret = bravojs.callPlugins("newRequire", [{
      module: module,
      deps: deps,
      getContextSensitiveModuleDir: getContextSensitiveModuleDir
  }]);
  if (typeof ret != "undefined")
    newRequire = ret;

  newRequire.paths = [bravojs.mainModuleDir];

  if (typeof bravojs.platform != "undefined")
      newRequire.platform = bravojs.platform;

  newRequire.id = function require_id(moduleIdentifier, unsanitized)
  {
    var contextId = getContextSensitiveModuleDir(),
        context = bravojs.contextForId(contextId, true);
        id = context.resolveId(moduleIdentifier, contextId);
    if (unsanitized)
      return id;
    return bravojs.callPlugins("sanitizeId", [id]) || id;
  }

  newRequire.uri = function require_uri(moduleIdentifierPath)
  {
    var basename = bravojs.basename(moduleIdentifierPath),
        parts = basename.split(".");
    var uri = window.location.protocol + "/" + newRequire.id(moduleIdentifierPath, true);
    if (parts.length > 1)
        uri += "." + parts.slice(1).join(".");
    return uri;
  }

  newRequire.canonicalize = function require_canonicalize(moduleIdentifier)
  {
    var id = bravojs.makeModuleId(getContextSensitiveModuleDir(), moduleIdentifier);

    if (id === '')
      throw new Error("Cannot canonically name the resource bearing this main module");

    return window.location.protocol + "/" + id + ".js";
  }

  newRequire.memoize = function require_memoize(id, dependencies, moduleFactory)
  {
    bravojs.pendingModuleDeclarations[id] = { moduleFactory: moduleFactory, dependencies: dependencies };
  }

  newRequire.isMemoized = function require_isMemoized(id)
  {
    return (bravojs.pendingModuleDeclarations[id] || bravojs.requireMemo[id]) ? true : false;
  }

  newRequire.getMemoized = function require_getMemoized(id)
  {
    return bravojs.pendingModuleDeclarations[id] || bravojs.requireMemo[id];
  }

  bravojs.callPlugins("augmentNewRequire", [newRequire, {
      module: module,
      getContextSensitiveModuleDir: getContextSensitiveModuleDir
  }]);

  return newRequire;
}

/** Module object constructor 
 *
 *  @param	id		The canonical module id
 *  @param	dependencies	The dependency list passed to module.declare
 */
bravojs.Module = function bravojs_Module(id, dependencies)
{
  this._id       = id;
  this.id        = bravojs.callPlugins("sanitizeId", [id]) || id;
  this["protected"] = void 0;
  this.dependencies = dependencies;
  this.print = bravojs.print;

  var i, label;

  /* Create module.deps array */
  this.deps = {};

  for (i=0; i < dependencies.length; i++)
  {
    if (typeof dependencies[i] === "string")
      continue;

    if (typeof dependencies[i] !== "object")
      throw new Error("Invalid " + typeof dependencies[i] + " element in dependency array at position " + i);

    /* Labeled dependency object */
    for (label in dependencies[i])
    {
      if (dependencies[i].hasOwnProperty(label))
      {
        this.deps[label] = function bravojs_lambda_module_deps() 
        {
          bravojs.requireModule(bravojs.dirname(id), dependencies[i][label]);
        };
      }
    }
  }
}

/** A module.declare suitable for use during DOM SCRIPT-tag insertion.
 * 
 *  The general technique described below was invented by Kris Zyp.
 *
 *  In non-IE browsers, the script's onload event fires as soon as the 
 *  script finishes running, so we just memoize the declaration without
 *  doing anything. After the script is loaded, we do the "real" work
 *  as the onload event also supplies the script's URI, which we use
 *  to generate the canonical module id.
 * 
 *  In IE browsers, the event can fire when the tag is being inserted
 *  in the DOM, or sometime thereafter. In the first case, we read a 
 *  memo we left behind when we started inserting the tag; in the latter,
 *  we look for interactive scripts.
 *
 *  Event			Action		
 *  -------------------------   ------------------------------------------------------------------------------------
 *  Inject Script Tag		onload event populated with URI
 *				scriptTagMemo populated with URI
 *  IE pulls from cache		cname derived in module.declare from scriptTagMemo, invoke provideModule
 *  IE pulls from http		cname derived in module.declare from script.src, invoke provideModule
 *  Non-IE loads script		onload event triggered, most recent incomplete module.declare is completed, 
 *				deriving the cname from the onload event.
 */
bravojs.Module.prototype.declare = function bravojs_Module_declare(dependencies, moduleFactory)
{
  var stm;

  if (typeof dependencies === "function")
  {
    moduleFactory = dependencies;
    dependencies = [];
  }

  stm = bravojs.scriptTagMemo;
  if (stm && stm.id === '')		/* Static HTML module */
  {
    delete bravojs.scriptTagMemo;
    bravojs.provideModule(dependencies, moduleFactory, stm.id, stm.callback);    
    return;
  }

  if (stm)
    throw new Error("Bug");

  if (document.addEventListener)	/* non-IE, defer work to script's onload event which will happen immediately */
  {
    bravojs.scriptTagMemo = { dependencies: dependencies, moduleFactory: moduleFactory };
    return;
  }

  stm = bravojs.scriptTagMemoIE;
  delete bravojs.scriptTagMemoIE;

  if (stm && stm.id) 			/* IE, pulling from cache */
  {
    bravojs.provideModule(dependencies, moduleFactory, stm.id, stm.callback);
    return;
  }

  /* Assume IE fetching from remote */
  var scripts = document.getElementsByTagName("SCRIPT");
  var i;

  for (i = 0; i < scripts.length; i++)
  {
    if (scripts[i].readyState === "interactive")
    {
      bravojs.provideModule(dependencies, moduleFactory, bravojs.URL_toId(scripts[i].src), stm.callback);
      return;
    }
  }

  throw new Error("Could not determine module's canonical name from script-tag loader");
}

/** A module.provide suitable for a generic web-server back end.  Loads one module at
 *  a time in continuation-passing style, eventually invoking the passed callback.
 * 
 *  A more effecient function could be written to take advantage of a web server
 *  which might aggregate and transport more than one module per HTTP request.
 *
 *  @param	dependencies	A dependency array
 *  @param	callback	The callback to invoke once all dependencies have been
 *				provided to the environment. Optional.
 */
bravojs.Module.prototype.provide = function bravojs_Module_provide(dependencies, callback)
{
  var self = arguments.callee;

  if ((typeof dependencies !== "object") || (dependencies.length !== 0 && !dependencies.length))
    throw new Error("Invalid dependency array: " + dependencies.toString());

  dependencies = bravojs.normalizeDependencyArray(dependencies, (this._id)?this._id:bravojs.mainModuleDir);

  if (dependencies.length === 0)
  {
    if (callback)
      callback();
    return;
  }

  bravojs.activeContexts.push(bravojs.contextForId(dependencies[0], true));

  bravojs.module.load(dependencies[0], function bravojs_lambda_provideNextDep() { self(dependencies.slice(1), callback) });

  bravojs.activeContexts.pop();
}

/** A module.load suitable for a generic web-server back end. The module is
 *  loaded by injecting a SCRIPT tag into the DOM.
 *
 *  @param	moduleIdentifier	Module to load
 *  @param	callback		Callback to invoke when the module has loaded.
 *
 *  @see	bravojs_Module_declare
 */
bravojs.Module.prototype.load = function bravojs_Module_load(moduleIdentifier, callback)
{
  if (window.module.hasOwnProperty("declare"))
    delete window.module.declare;

  var script = document.createElement('SCRIPT');
  script.setAttribute("type","text/javascript");
  script.setAttribute("src", bravojs.require.canonicalize(moduleIdentifier) + "?1");

  if (document.addEventListener)	/* Non-IE; see bravojs_Module_declare */
  {
    script.onload = function bravojs_lambda_script_onload()
    {
      /* stm contains info from recently-run module.declare() */
      var stm = bravojs.scriptTagMemo;
      if (typeof stm === "undefined")
        throw new Error("Module '" + moduleIdentifier + "' did not invoke module.declare!");

      delete bravojs.scriptTagMemo;

      if (typeof moduleIdentifier == "object")
      {
        /* The id is a mapping locator and needs to be resolved. */
        moduleIdentifier = bravojs.makeModuleId(bravojs.mainModuleDir, moduleIdentifier);
      }

      bravojs.activeContexts.push(bravojs.contextForId(moduleIdentifier, true));

      bravojs.provideModule(stm.dependencies, stm.moduleFactory, bravojs.require.id(moduleIdentifier, true), function()
      {
        callback(moduleIdentifier);
      });

      bravojs.activeContexts.pop();
    }

    script.onerror = function bravojs_lambda_script_onerror() 
    { 
      var id = bravojs.require.id(moduleIdentifier, true);
      bravojs.pendingModuleDeclarations[id] = null;	/* Mark null so we don't try to run, but also don't try to reload */
      callback();
    }
  }
  else
  {
    bravojs.scriptTagMemoIE = { moduleIdentifier: moduleIdentifier, callback: callback };

    script.onreadystatechange = function bravojs_lambda_script_onreadystatechange()
    {
      if (this.readyState != "loaded")
        return;

      /* failed load below */
      var id = bravojs.require.id(moduleIdentifier, true);

      if (!bravojs.pendingModuleDeclarations[id] && !bravojs.requireMemo[id] && id === bravojs.scriptTagMemoIE.moduleIdentifier)
      {
        bravojs.pendingModuleDeclarations[id] = null;	/* Mark null so we don't try to run, but also don't try to reload */
        callback();
      }
    }
  }

  document.getElementsByTagName("HEAD")[0].appendChild(script);
}

bravojs.Module.prototype.eventually = function(cb) { cb(); };

/** Shim the environment to have CommonJS ES-5 requirements (if needed),
 *  the execute the callback
 */
bravojs.es5_shim_then = function bravojs_es5_shim_then(callback)
{
  if (!Array.prototype.indexOf)
  {
    /* Load ES-5 shim into the environment before executing the main module */
    var script = document.createElement('SCRIPT');
    script.setAttribute("type","text/javascript");
    script.setAttribute("src", bravojs.dirname(bravojs.url) + "/global-es5.js?1");

    if (document.addEventListener)
      script.onload = callback;
    else
    {
      script.onreadystatechange = function() 
      {
	if (this.readyState === "loaded")
	  callback();
      }
    }

    document.getElementsByTagName("HEAD")[0].appendChild(script);
  }
  else
  {
    callback();
  }
}

/** Reload a module, violating the CommonJS singleton paradigm and
 *  potentially introducing bugs in to the program using this function --
 *  as references to the previous instance of the module may still be
 *  held by the application program.
 */
bravojs.reloadModule = function(id, callback)
{
  delete bravojs.pendingModuleDeclarations[id];
  delete bravojs.requireMemo[id];
  bravojs.module.provide([id], callback);
}

/** Main module bootstrap */
bravojs.initializeMainModule = function bravojs_initializeMainModule(dependencies, moduleFactory, moduleIdentifier)
{
  if (bravojs.module.hasOwnProperty("declare"))		/* special extra-module environment bootstrap declare needs to go */
    delete bravojs.module.declare;

  if (bravojs.module.constructor.prototype.main)
    throw new Error("Main module has already been initialized!");

  bravojs.es5_shim_then
  (
    (function() 
     {
       bravojs.provideModule(dependencies, moduleFactory, moduleIdentifier, function bravojs_lambda_requireMain() { bravojs.module.constructor.prototype.main = bravojs.require(moduleIdentifier); })
     })
  ); 
}

/** Run a module which is not declared in the HTML document and make it the program module.
 *  @param	dependencies		[optional]	A list of dependencies to sastify before running the mdoule
 *  @param	moduleIdentifier	moduleIdentifier, relative to dirname(window.location.href). This function
 *					adjusts the module path such that the program module's directory is the
 *					top-level module directory before the dependencies are resolved.
 *  @param	callback		[optional]	Callback to invoke once the main module has been initialized
 */
bravojs.runExternalMainModule = function bravojs_runExternalProgram(dependencies, moduleIdentifier, callback)
{
  if (arguments.length === 1 || typeof moduleIdentifier === "function")
  {
    callback = moduleIdentifier;
    moduleIdentifier = dependencies;
    dependencies = [];
  }

  delete bravojs.module.declare;

  if (moduleIdentifier.charAt(0) === '/')
    bravojs.mainModuleDir = bravojs.dirname(moduleIdentifier);
  else
    bravojs.mainModuleDir = bravojs.dirname(bravojs.URL_toId(window.location.href + ".js"), true) + "/" + bravojs.dirname(moduleIdentifier);

  moduleIdentifier = bravojs.basename(moduleIdentifier);

  bravojs.es5_shim_then(
      function() {
	bravojs.module.provide(dependencies.concat([moduleIdentifier]), 
		       function bravojs_runMainModule() {
			 bravojs.initializeMainModule(dependencies, '', moduleIdentifier);
			 if (callback)
			   callback(); 
		       })
	    });
}

bravojs.reset();

if (typeof bravojs.url === "undefined")
{
/** Set the BravoJS URL, so that BravoJS can load components
 *  relative to its install dir.  The HTML script element that
 *  loads BravoJS must either have the ID BravoJS, or be the
 *  very first script in the document.
 */ 
(function bravojs_setURL()
{
  var i;
  var checkBasename = false;
  var script;

  script = document.getElementById("BravoJS");
  if (!script)
  {
    checkBasename = true;
    script = document.getElementsByTagName("SCRIPT")[0];
  }

  bravojs.url = script.src;
  i = bravojs.url.indexOf("?");
  if (i !== -1)
    bravojs.url = bravojs.url.slice(0,i);
  i = bravojs.url.indexOf("#");
  if (i !== -1)
    bravojs.url = bravojs.url.slice(0,i);

  if (checkBasename && bravojs.basename(bravojs.url) !== "bravo.js")
    throw new Error("Could not determine BravoJS URL. BravoJS must be the first script, or have id='BravoJS'");
})();
}

/** Diagnostic Aids */
var print   = bravojs.print;
if (!window.onerror)
{
  window.onerror = function window_onerror(message, url, line) 
  { 
    var scripts, i;

    print("\n * Error: " + message + "\n" + 
          "      in: " + url + "\n" + 
          "    line: " + line);  
  }
}

} catch(e) { bravojs.errorReporter(e); }

}

if (typeof exports !== "undefined")
{
    exports.BravoJS = function(context)
    {
        context = context || {};

        var window = {
            location: {
                protocol: "memory:",
                href: "memory:/" + ((typeof context.mainModuleDir != "undefined")?context.mainModuleDir:"/bravojs/")
            }
        };

        var bravojs = {
            mainModuleDir: context.mainModuleDir || void 0,
            platform: context.platform || void 0,
            url: window.location.href,
            print: (context.api && context.api.system && context.api.system.print) || void 0,
            errorReporter: (context.api && context.api.errorReporter) || void 0,
            XMLHttpRequest: (context.api && context.api.XMLHttpRequest) || void 0,
            DEBUG: context.DEBUG || void 0
        };

        bravojs_init(bravojs, window);

        context.bravojs = bravojs;
    }
}
else
{
    if (typeof bravojs === "undefined")
      bravojs = {};
    bravojs_init(bravojs, (typeof window != "undefined")?window:this);
}

/**
 *  This file implements a bravojs core plugin to add
 *  package and package mappings support.
 *
 *  Copyright (c) 2011, Christoph Dorn
 *  Christoph Dorn, christoph@christophdorn.com
 *  MIT License
 *
 *  To use: Load BravoJS, then layer this plugin in
 *  by loading it into the extra-module environment.
 */

(function packages() {

var Plugin = function()
{
}

Plugin.prototype.init = function()
{
    var bravojs = this.bravojs;

    /** Get a context for a given module ID used to resolve the ID. If a package
     *  prefix is found a context specific to the package is returned, otherwise
     *  the default context is returned.
     */
    bravojs.contextForId = function packages_bravojs_contextForId(id, onlyCreateIfDelimited)
    {
        if (typeof id == "undefined")
            return bravojs.contexts["_"];

        id = id.replace(/^\w*!/, "");

        var parts = id.split("@/"),
            id = parts[0];

        if (/@$/.test(id))
            id = id.substring(0, id.length-1);

        var ret = bravojs.callPlugins("contextForId", [id]);
        if (typeof ret != "undefined")
            id = ret;

        if (parts.length == 1 && typeof bravojs.contexts[id] != "undefined")
            return bravojs.contexts[id];

        if (typeof bravojs.contexts[id] == "undefined")
        {
            if (onlyCreateIfDelimited === true && parts.length == 1)
                return bravojs.contexts["_"];

            bravojs.makeContext(id);
        }

        return bravojs.contexts[id];
    };

    bravojs.hasContextForId = function packages_bravojs_hasContext(id)
    {
        id = id.replace(/^\w*!/, "");
        var parts = id.split("@/");
        if (parts.length == 2)
            id = parts[0];
        if (/@$/.test(id))
            id = id.substring(0, id.length-1);
        return (typeof bravojs.contexts[id] != "undefined");
    }

    bravojs.makeContext = function packages_bravojs_makeContext(id)
    {
        id = id.replace(/^\w*!/, "");
        bravojs.contexts[id] = new bravojs.Context(id);
        /* The id so far is path-based. If the context/package descriptor specifies a UID we map
         * the same context to the UID as well.
         */
        if (typeof bravojs.contexts[id].uid != "undefined")
           bravojs.contexts[bravojs.contexts[id].uid] = bravojs.contexts[id];
        return bravojs.contexts[id];
    }

    bravojs.Context = function packages_bravojs_Context(id)
    {
        this.id = id;

        // We do not need to do anything for the default context
        if (this.id == "_")
            return;

        id = this.id + "@/package.json";

        if (bravojs.require.isMemoized(id))
        {
            this.descriptor = bravojs.require.getMemoized(id).moduleFactory();
        }
        else
        {
            this.descriptor = bravojs.callPlugins("loadPackageDescriptor", [id]);
            var self = this;
            bravojs.require.memoize(id, [], function()
            {
                return self.descriptor;
            });
        }

        this.libDir = this.descriptor.directories && this.descriptor.directories.lib;
        if (typeof this.libDir != "string")
            this.libDir = "lib";
    
        this.uid = this.descriptor.uid || void 0;
        if (typeof this.uid != "undefined")
        {
            var m = this.uid.match(/^https?:\/\/(.*)$/);
            if (!m)
                throw new Error("uid property '" + this.uid + "' must be a non-resolving or resolving URL with http or https protocol in: " + id);
            this.uid = m[1];  // strip the protocol prefix
        }
    }

    /** Get a map where labels point to package IDs for all declared mappings */
    bravojs.Context.prototype.getNormalizedMappings = function packages_bravojs_Context_getNormalizedMappings()
    {
        if (this.id == "_")
            throw new Error("Cannot get mappings for default context");
    
        if (typeof this.normalizedMappings != "undefined")
            return this.normalizedMappings;

        this.normalizedMappings = {};

        if (typeof this.descriptor.mappings != "undefined")
        {
            for (var label in this.descriptor.mappings)
            {
                this.normalizedMappings[label] = bravojs.callPlugins("normalizeLocator", [this.descriptor.mappings[label], this]).location;
            }
        }
        return this.normalizedMappings;
    }

    bravojs.Context.prototype.resolveId = function packages_bravojs_Context_resolveId(moduleIdentifier, relativeModuleDir, descriptor)
    {
        // Pull out plugin if applicable
        var plugin;
        if (typeof moduleIdentifier == "string")
        {
            var m = moduleIdentifier.match(/^(\w*)!(.*)$/);
            if (m)
            {
                plugin = m[1];
                moduleIdentifier = m[2];
            }
        }

        try {
            var ret = bravojs.callPlugins("normalizeModuleIdentifier", [moduleIdentifier, relativeModuleDir, descriptor, this]);
            
            // happens if mapping is ignored
            if (ret === false)
                return false;
            
            if (typeof ret != "undefined")
                moduleIdentifier = ret;
        }
        catch(e)
        {
            var mappings = (typeof this.descriptor != "undefined" && typeof this.descriptor.mappings != "undefined")?JSON.stringify(this.descriptor.mappings):"{}";            
            throw new Error(e + " => " + e.stack + "\nUnable to resolve moduleIdentifier '" + JSON.stringify(moduleIdentifier) + "' against context '" + this.id + "' (mappings: " + mappings + ") and relativeModuleDir '" + relativeModuleDir + "'.");
        }

        if (moduleIdentifier === null || moduleIdentifier === "")
            return moduleIdentifier;

        if (moduleIdentifier.charAt(0) == "/")
            return ((typeof plugin != "undefined")?plugin+"!":"") + moduleIdentifier;

        if (moduleIdentifier.charAt(0) == ".")
            return ((typeof plugin != "undefined")?plugin+"!":"") + bravojs.realpath(relativeModuleDir + "/" + moduleIdentifier);

        if (this.id == "_")
            return ((typeof plugin != "undefined")?plugin+"!":"") + bravojs.realpath(bravojs.mainModuleDir + "/" + moduleIdentifier);

        return ((typeof plugin != "undefined")?plugin+"!":"") + bravojs.realpath(relativeModuleDir + "/" + moduleIdentifier);
    }

    /** Run just before providing Module to moduleFactory function in bravojs.initializeModule() */
    bravojs.Module.prototype.augment = function bravojs_Module_augment()
    {
        if (this._id === "")
            return;
    
        var context = bravojs.contextForId(this._id, true);
        /* Only add extra module properties if context represents a package (i.e. not default '_' context) */
        if (context.id == "_")
            return;

        /* If context supplies a UID use it over the path-based ID for the package ID */
        this.pkgId = context.id;
    
        /* Normalized mappings are simply a map where labels point to package IDs */
        this.mappings = context.getNormalizedMappings();

        this.hashId = calcMD5(this.id);
    }

    // We need to reset bravojs to use the Context object from above (but keep registered plugins)
    bravojs.reset(null, bravojs.plugins);
}

Plugin.prototype.requireModule = function(id)
{
    if (!id)
        return;
    
    // The text plugins need special handeling
    if (id.match(/^text!/))
    {
        if (!bravojs.requireMemo[id] && bravojs.pendingModuleDeclarations[id])
        {
            bravojs.requireMemo[id] = bravojs.pendingModuleDeclarations[id].moduleFactory();
        }
        if (!bravojs.requireMemo[id])
            throw new Error("Module " + id + " is not available.");
        return true;
    }
}

Plugin.prototype.newRequire = function(helpers)
{
    var bravojs = this.bravojs;

    var newRequire = function packages_require(moduleIdentifier) 
    {
        // RequireJS compatibility. Convert require([], callback) to module.load([], callback).
        if (Object.prototype.toString.call(moduleIdentifier) == "[object Array]" && arguments.length == 2)
        {
            if (moduleIdentifier.length > 1)
               throw new Error("require([], callback) with more than one module in [] is not supported yet!");
            if (typeof bravojs.mainContext == "undefined")
                throw new Error("Cannot resolve ID for ASYNC require. bravojs.mainContext used to resolve ID not set!");
            // Load IDs are resolved against the default context. To resolve against a different
            // context use module.load([], callback).
            moduleIdentifier = bravojs.contextForId(bravojs.mainContext).resolveId(moduleIdentifier[0], helpers.getContextSensitiveModuleDir());
            var callback = arguments[1];
            bravojs.module.load(moduleIdentifier, function(id)
            {
                callback(newRequire(id));
            });
            return;
        }
        if (helpers.deps && helpers.deps[moduleIdentifier])
            return helpers.deps[moduleIdentifier]();
        return bravojs.requireModule(helpers.getContextSensitiveModuleDir(), moduleIdentifier);
    };
    return newRequire;
}

Plugin.prototype.augmentNewRequire = function(newRequire, helpers)
{
    var bravojs = this.bravojs;

    newRequire.pkg = function packages_require_pkg(packageIdentifierPath)
    {
        if (typeof helpers.module != "undefined" && typeof helpers.module.mappings != "undefined")
        {
            if (typeof helpers.module.mappings[packageIdentifierPath] != "undefined")
                packageIdentifierPath = helpers.module.mappings[packageIdentifierPath];
        }
        var context = bravojs.contextForId(packageIdentifierPath);
        return {
            id: function(moduleIdentifier, unsanitized)
            {
                if (typeof moduleIdentifier == "undefined")
                    return context.id;
                else
                {
                    var id = context.resolveId(moduleIdentifier, helpers.getContextSensitiveModuleDir());
                    if (unsanitized)
                        return id;
                    return bravojs.callPlugins("sanitizeId", [id]) || id;
                }
            }
        }
    }

    newRequire.canonicalize = function packages_require_canonicalize(moduleIdentifier)
    {
        var id = bravojs.makeModuleId(helpers.getContextSensitiveModuleDir(), moduleIdentifier);

        if (id === '')
            throw new Error("Cannot canonically name the resource bearing this main module");

        /* Remove package/module ID delimiter */
        id = bravojs.callPlugins("sanitizeId", [id]) || id;

        /* Some IDs may refer to non-js files */
        if (bravojs.basename(id).indexOf(".") == -1)
            id += ".js";

        return bravojs.window.location.protocol + "/" + id;
    }

    newRequire.nameToUrl = function(moduleIdentifier)
    {
        if (arguments.length >= 2 && arguments[1] !== null)
            throw new Error("NYI - Second argument to require.nameToUrl() must be 'null'!");
        else
        if (arguments.length >= 3 && arguments[2] != "_")
            throw new Error("NYI - Third argument to require.nameToUrl() must be '_'!");
        throw new Error("NYI - require.nameToUrl()");
/*
        var parts = moduleIdentifier.split("/");
        if (parts.length == 0)
        {
        }
        else
        {
        }
*/
    }
}

Plugin.prototype.sanitizeId = function(id)
{
    return id.replace(/@\//, "/").replace(/@$/, "");
}

/**
 * Load a package descriptor from the server.
 * 
 * NOTE: This function will block until the server returns the response!
 *       Package descriptors should be memoized before booting the program
 *       for better loading performance.
 */
Plugin.prototype.loadPackageDescriptor = function(id)
{
    // NOTE: Do NOT use require.canonicalize(id) here as it will cause an infinite loop!
    var URL = window.location.protocol + "/" + bravojs.realpath(id.replace(/@\/+/g, "\/"));

    // TODO: Get this working in other browsers
    var req = new (this.bravojs.XMLHttpRequest || XMLHttpRequest)();
    req.open("GET", URL, false);
    req.send(null);
    if(req.status == 200)
    {
        try
        {
            return JSON.parse(req.responseText);
        }
        catch(e)
        {
            throw new Error("Error parsing package descriptor from URL '" + URL + "': " + e);
        }
    }
    else
        throw new Error("Error loading package descriptor from URL: " + URL);
}

/**
 * Given a mappings locator normalize it according to it's context by
 * setting an absolute path-based location property.
 */
Plugin.prototype.normalizeLocator = function(locator, context)
{
    if (typeof locator.provider != "undefined")
    {
        // do nothing
//        locator.location = locator.provider;
    }
    else
    if (typeof locator.location != "undefined")
    {
        if ((locator.location.indexOf("./") == 0) || (locator.location.indexOf("../") == 0))
        {
            locator.location = this.bravojs.realpath(((context.id!="_")?context.id:this.bravojs.mainModuleDir) + "/" + locator.location, false) + "/";
        }
    }
    else
    if (typeof locator.id != "undefined")
    {
        if (locator.id.charAt(0) != "/")
            locator.id = this.bravojs.mainModuleDir + "/" + locator.id;
    }
    else
    if (typeof locator.catalog != "undefined" || typeof locator.archive != "undefined")
    {
        if (typeof locator.catalog != "undefined" && typeof locator.name == "undefined")
            throw new Error("Catalog-based mappings locator does not specify 'name' property: " + locator);

        var ret = this.bravojs.callPlugins("resolveLocator", [locator]);
        if (typeof ret == "undefined")
            throw new Error("Unable to resolve package locator: " + JSON.stringify(locator));

        locator.location = ret;

        if (typeof id == "undefined")
            throw new Error("Mappings locator could not be resolved by plugins: " + locator);
    }

    if (typeof locator.location != "undefined" && locator.location.charAt(locator.location.length-1) == "/")
        locator.location = locator.location.substring(0, locator.location.length -1);

    return locator;
}

/**
 * Given a moduleIdentifier convert it to a top-level ID
 */
Plugin.prototype.normalizeModuleIdentifier = function(moduleIdentifier, relativeModuleDir, descriptor, context)
{
    if (moduleIdentifier === '')  /* Special case for main module */
        return '';

    var self = this,
        bravojs = this.bravojs,
        originalModuleIdentifier = moduleIdentifier;

    function finalNormalization(moduleIdentifier)
    {
        moduleIdentifier = moduleIdentifier.replace(/{platform}/g, bravojs.require.platform);

        var parts = moduleIdentifier.replace(/\.js$/, "").split("@/");

        if (parts.length == 1)
            return moduleIdentifier;

        var context = bravojs.contextForId(parts[0]);
        // Resolve mapped modules
        if (typeof context.descriptor.modules != "undefined" && typeof context.descriptor.modules["/" + parts[1]] != "undefined")
        {
            var locator = self.normalizeLocator(context.descriptor.modules["/" + parts[1]], context);
            if (typeof locator.available != "undefined" && locator.available === false)
                return null;

            if (typeof locator.module != "undefined")
                moduleIdentifier = bravojs.contextForId(locator.location).resolveId("./" + locator.module);
        }

        // Give opportunity to verify resolved ID to discover missing mappings for example
        var ret = bravojs.callPlugins("verifyModuleIdentifier", [moduleIdentifier, {
            moduleIdentifier: originalModuleIdentifier,
            relativeModuleDir: relativeModuleDir,
            context: context
        }]);
        if (typeof ret != "undefined")
            moduleIdentifier = ret;
        if (/\.js$/.test(moduleIdentifier))
            moduleIdentifier = moduleIdentifier.substring(0, moduleIdentifier.length-3);
        return moduleIdentifier;
    }

    if (moduleIdentifier === null)
    {
        if (typeof context.descriptor == "undefined" || typeof context.descriptor.main == "undefined")
            throw new Error("'main' property not set in package descriptor for: " + this.id);
        return finalNormalization(context.id + "@/" + context.descriptor.main);
    }
    else
    if (typeof moduleIdentifier === "object")
    {
        // We have a mappings locator object
        moduleIdentifier = this.normalizeLocator(moduleIdentifier, context);

        var id;
        if (typeof moduleIdentifier.location != "undefined")
        {
            id = moduleIdentifier.location;
        }
        else
        if (typeof moduleIdentifier.id != "undefined")
        {
            id = moduleIdentifier.id;
        }
        else
            throw new Error("Invalid mapping: " + moduleIdentifier);

        if (typeof moduleIdentifier.descriptor != "undefined" && typeof moduleIdentifier.descriptor.main != "undefined")
            return finalNormalization(this.bravojs.realpath(id + "@/" + moduleIdentifier.descriptor.main, false));

        var context = this.bravojs.contextForId(id);
        if (typeof context.descriptor == "undefined" || typeof context.descriptor.main == "undefined")
            throw new Error("'main' property not set in package descriptor for: " + context.id);

        return finalNormalization(this.bravojs.realpath(context.id + "@/" + context.descriptor.main, false));
    }

    // See if moduleIdentifier matches a mapping alias exactly
    if (typeof context.descriptor != "undefined" &&
        typeof context.descriptor.mappings != "undefined" &&
        typeof context.descriptor.mappings[moduleIdentifier] != "undefined")
    {
        if (typeof context.descriptor.mappings[moduleIdentifier].available != "undefined" && context.descriptor.mappings[moduleIdentifier].available === false)
        {
            // If mapping is not available we return a null ID
            return null;
        }
        else
        if (typeof context.descriptor.mappings[moduleIdentifier].module != "undefined")
        {
            var mappedContextId = this.normalizeLocator(context.descriptor.mappings[moduleIdentifier], context).location,
                mappedContext = this.bravojs.contextForId(mappedContextId),
                mappedModule = context.descriptor.mappings[moduleIdentifier].module;

            mappedModule = mappedModule.replace(/^\./, "");

            if (mappedModule.charAt(0) == "/")
            {
                return finalNormalization(mappedContext.id + "@" + mappedModule);
            }
            else
            {
                return mappedContext.resolveId("./" + context.descriptor.mappings[moduleIdentifier].module, null);
            }
        }
        else
            throw new Error("Unable to resolve ID '" + moduleIdentifier + "' for matching mapping as 'module' property not defined in mapping locator!");
    }

    var moduleIdentifierParts = moduleIdentifier.split("@/");

    // If module ID is absolute we get appropriate context
    if (moduleIdentifierParts.length == 2)
        context = this.bravojs.contextForId(moduleIdentifierParts[0]);

    // NOTE: relativeModuleDir is checked here so we can skip this if we want a module from the package
    if (typeof context.descriptor != "undefined" &&
        typeof context.descriptor["native"] != "undefined" &&
        context.descriptor["native"] === true &&
        relativeModuleDir)
    {
        return finalNormalization(moduleIdentifierParts.pop());
    }
    else
    if (moduleIdentifier.charAt(0) == "/")
        return finalNormalization(moduleIdentifier);

    // From now on we only deal with the relative (relative to context) ID
    moduleIdentifier = moduleIdentifierParts.pop();

    if (moduleIdentifier.charAt(0) == "." && relativeModuleDir)
        return finalNormalization(this.bravojs.realpath(relativeModuleDir + "/" + moduleIdentifier, false));
    else
    if (context && context.id == "_")
        return finalNormalization(this.bravojs.realpath(this.bravojs.mainModuleDir + "/" + moduleIdentifier, false));

    var parts;
    if (typeof context.descriptor != "undefined" &&
        typeof context.descriptor.mappings != "undefined" &&
        (parts = moduleIdentifier.split("/")).length > 1 &&
        typeof context.descriptor.mappings[parts[0]] != "undefined")
    {
        var normalizedLocator = this.normalizeLocator(context.descriptor.mappings[parts[0]], context),
            mappedContextId;

        if (normalizedLocator.available === false)
            return false;

        if (typeof normalizedLocator.provider != "undefined")
            mappedContextId = normalizedLocator.id;
        else
            mappedContextId = normalizedLocator.location;

        var mappedContext = this.bravojs.contextForId(mappedContextId),
            mappedDescriptor = void 0;

        if (typeof context.descriptor.mappings[parts[0]].descriptor != "undefined")
            mappedDescriptor = context.descriptor.mappings[parts[0]].descriptor;

        // Make ID relative and do not pass relativeModuleDir so ID is resolved against root of package without checking mappings
        parts[0] = ".";
        return mappedContext.resolveId(parts.join("/"), null, mappedDescriptor);
    }

    var libDir = context.libDir;
    if (typeof descriptor != "undefined" && typeof descriptor.directories != "undefined" && typeof descriptor.directories.lib != "undefined")
    {
        libDir = descriptor.directories.lib;
    }

    return finalNormalization(this.bravojs.realpath(context.id + "@/" + ((libDir)?libDir+"/":"") + moduleIdentifier, false));
}

if (typeof bravojs != "undefined")
{
    // In Browser
    bravojs.registerPlugin(new Plugin());
}
else
if (typeof exports != "undefined")
{
    // On Server
    exports.Plugin = Plugin;
}


var calcMD5 = function() {
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
return function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

}();

})();

/**
 *  This file implements a bravojs core plugin to add
 *  dynamic module and package loading support where the server
 *  given a module or package ID will return the requested
 *  module (main module for package) and all dependencies
 *  in a single file.
 *
 *  Copyright (c) 2011, Christoph Dorn
 *  Christoph Dorn, christoph@christophdorn.com
 *  MIT License
 *
 *  To use: Load BravoJS, then layer this plugin in
 *  by loading it into the extra-module environment.
 */

(function packages_loader() {

bravojs.module.constructor.prototype.load = function packages_loader_load(moduleIdentifier, callback)
{
    var uri;
    
    if (typeof moduleIdentifier == "object")
    {
        if (typeof moduleIdentifier.id != "undefined")
        {
            var pkg = bravojs.contextForId(moduleIdentifier.id);
            uri = pkg.resolveId(null);
        }
        else
        if (typeof moduleIdentifier.location != "undefined")
        {
            uri = bravojs.mainModuleDir + moduleIdentifier.location.substring(bravojs.mainModuleDir.length);
        }
        else
            throw new Error("NYI");
    }
    else
    if (moduleIdentifier.charAt(0) != "/")
    {
        if (moduleIdentifier.charAt(0) != ".")
        {
            // resolve mapped ID
            uri = bravojs.contextForId(this._id).resolveId(moduleIdentifier).replace(bravojs.mainModuleDir, bravojs.mainModuleDir);
        }
        else
            throw new Error("Cannot load module by relative ID: " + moduleIdentifier);
    }
    else
    {
        uri = bravojs.mainModuleDir + moduleIdentifier.substring(bravojs.mainModuleDir.length);
    }

    var lookupURI = uri;
    if (/\.js$/.test(lookupURI))
        lookupURI = lookupURI.substring(0, lookupURI.length-3);

    if (bravojs.require.isMemoized(lookupURI))
    {
        callback(lookupURI);
        return;
    }

    if (!/\.js$/.test(uri) && !/\/$/.test(uri))
        uri += ".js";

    // Encode ../ as we need to preserve them (servers/browsers will automatically normalize these directory up path segments)
    uri = uri.replace(/\.{2}\//g, "__/");

    // WebWorker
    if (typeof importScripts === "function")
    {
        // Remove hostname
        uri = uri.replace(/^\/[^\/]*\//, "/");

        importScripts(uri);
        
        if (typeof __bravojs_loaded_moduleIdentifier == "undefined")
            throw new Error("__bravojs_loaded_moduleIdentifier not set by server!");

        var id = __bravojs_loaded_moduleIdentifier;

        delete __bravojs_loaded_moduleIdentifierl

        // all modules are memoized now so we can continue
        callback(id);
        return;
    }

    var URL = window.location.protocol + "/" + uri;

    // We expect a bunch of modules wrapped with:
    //  require.memoize('ID', [], function (require, exports, module) { ... });

    var script = document.createElement('SCRIPT');
    script.setAttribute("type","text/javascript");
    script.setAttribute("src", URL);

    /* Fake script.onload for IE6-8 */
    script.onreadystatechange = function()
    {
        var cb;        
        if (this.readyState === "loaded")
        {
            cb = this.onload;
            this.onload = null;
            setTimeout(cb,0);
        }
    }

    script.onload = function packages_loader_onload()
    {
        this.onreadystatechange = null;
        
        if (typeof window.__bravojs_loaded_moduleIdentifier == "undefined")
            throw new Error("__bravojs_loaded_moduleIdentifier not set by server!");
        
        var id = window.__bravojs_loaded_moduleIdentifier;
        
        delete window.__bravojs_loaded_moduleIdentifierl

        // all modules are memoized now so we can continue
        callback(id);
    }
    
    /* Supply errors on browsers that can */
    script.onerror = function fastload_script_error()
    {
        if (typeof console != "undefined")
            console.error("Error contacting server URL = " + script.src);
        else
            alert("Error contacting server\nURL=" + script.src);
    }

    document.getElementsByTagName("HEAD")[0].appendChild(script);
};

})();

require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09@/package.json'), [], function() { return {"uid":"http://github.com/cadorn/ace-extjs/packages/ace-editor/","main":"main.js","directories":{"lib":""},"contexts":{"top":{"/main":{"include":{"github.com/ajaxorg/pilot/@/lib/pilot/index":{},"github.com/ajaxorg/ace/@/lib/ace/defaults":{},"github.com/ajaxorg/cockpit/@/lib/cockpit/index":{},"github.com/ajaxorg/ace/":{},"github.com/cadorn/ace-extjs/packages/ace-editor/@/demo":{}}}}},"mappings":{"worker":{"location":"" + bravojs.mainModuleDir + "/b339f0b799f23466a9fb3ac92af4cb7e572604a6"},"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09@/main'), ['pilot/fixoldbrowsers','pilot/plugin_manager','pilot/settings','pilot/environment','pilot/canon','pilot/event','ace/editor','ace/virtual_renderer','ace/edit_session','ace/undomanager','ace/theme/textmate','ace/mode/text'], function (require, exports, module)
{
    var env,
        launchCallback;
    exports.main = function()
    {
        exports.init();
    }
    exports.init = function(callback)
    {
        var plugins = [
            "pilot/index",
            "cockpit/index",
            "ace/defaults"
        ];
        var catalog = require("pilot/plugin_manager").catalog;
        catalog.registerPlugins(plugins).then(function()
        {
            env = require("pilot/environment").create();
            catalog.startupPlugins({ env: env }).then(function()
            {
                if (typeof callback != "undefined")
                    callback(env);
                if (typeof launchCallback != "undefined")
                    launchCallback(env);
            });
        });
    }
    exports.module = function(id)
    {
        return require(id);
    }
    exports.launch = function(callback)
    {
        if (typeof callback == "string")
        {
            if (callback == "demo")
            {
                callback = function(env)
                {
                    module.load(require.id("./demo", true), function(id)
                    {
                        require(id).launch(env);
                    });
                }
            }
            else
                throw new Error("Unknown editor configuration: " + callback);
        }

        if (typeof env != "undefined")
            callback(env);
        else
            launchCallback = callback;
    }
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/package.json'), [], function() { return {"name":"pilot","description":"Pilot is a small library used in the creation of Ace editor.","version":"0.1.1","homepage":"http://github.com/ajaxorg/pilot","engines":{"node":">= 0.1.102","teleport":">=0.2.0"},"author":"Fabian Jakobs <fabian@ajax.org>","main":"lib/pilot/index.js","repository":{"type":"git","url":"http://github.com/ajaxorg/ace.git"},"overlay":{"teleport":{"directories":{"lib":"lib/pilot"}}},"licenses":[{"type":"LGPLv3","url":"http://www.gnu.org/licenses/lgpl-3.0.txt"}],"uid":"https://github.com/ajaxorg/pilot/","directories":{"lib":"lib/pilot"},"mappings":{"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/package.json'), [], function() { return {"name":"ace","description":"Ajax.org Code Editor is a full featured source code highlighting editor that powers the Cloud9 IDE","version":"0.1.6","homepage":"http://github.com/ajaxorg/ace","engines":{"node":">= 0.2.0"},"author":"Fabian Jakobs <fabian@ajax.org>","main":"","repository":{"type":"git","url":"http://github.com/ajaxorg/ace.git"},"overlay":{"teleport":{"directories":{"lib":"lib/ace","dependencies":{"cockpit":">=0.1.1","pilot":">=0.1.1"}}}},"dependencies":[{"id":"github.com/cadorn/ace-extjs/packages/ace-editor/","descriptor":{"directories":{"lib":"modules"}},"location":"/Users/cadorn/pinf/workspaces/github.com/cadorn/ace-extjs/packages/ace-editor"}],"licenses":[{"type":"MPL","url":"http://www.mozilla.org/MPL/"},{"type":"GPL","url":"http://www.gnu.org/licenses/gpl.html"},{"type":"LGPL","url":"http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html"}],"directories":{"lib":"lib/ace"},"uid":"https://github.com/ajaxorg/ace/","contexts":{"top":{"/":{"include":{"/lib/ace/range":{},"/lib/ace/tokenizer":{},"/lib/ace/mode/text":{},"/lib/ace/mode/matching_brace_outdent":{},"/lib/ace/mode/doc_comment_highlight_rules":{}},"load":{"/lib/ace/mode/*":{},"/lib/ace/theme/*":{}}}}},"modules":{"/lib/ace/worker/worker_client":{"module":"modules/ace/worker/worker_client","location":"" + bravojs.mainModuleDir + "/a3d9ddf257e98144c883cd2dbc03ab62243dbc09","descriptor":{"contexts":{"top":{"/main":{"include":{"github.com/cadorn/ace-extjs/packages/ace-editor/@/demo":{}}}}}}}},"mappings":{"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"},"asyncjs":{"available":false}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/fixoldbrowsers'), [], function (require, exports, module) {
// vim:set ts=4 sts=4 sw=4 st:
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- tlrobinson Tom Robinson Copyright (C) 2009-2010 MIT License (Narwhal Project)
// -- dantman Daniel Friesen Copyright(C) 2010 XXX No License Specified
// -- fschaefer Florian Schäfer Copyright (C) 2010 MIT License
// -- Irakli Gozalishvili Copyright (C) 2010 MIT License

/*!
    Copyright (c) 2009, 280 North Inc. http://280north.com/
    MIT License. http://github.com/280north/narwhal/blob/master/README.md
*/

(typeof define === "function" ? define : function($) { $(); })(function(require, exports, module, undefined) {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-050.pdf
 *
 * NOTE: this is a draft, and as such, the URL is subject to change.  If the
 * link is broken, check in the parent directory for the latest TC39 PDF.
 * http://www.ecma-international.org/publications/files/drafts/
 *
 * Previous ES5 Draft
 * http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf
 * This is a broken link to the previous draft of ES5 on which most of the
 * numbered specification references and quotes herein were taken.  Updating
 * these references and quotes to reflect the new document would be a welcome
 * volunteer project.
 *
 * @module
 */

/*whatsupdoc*/

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://www.ecma-international.org/publications/files/drafts/tc39-2009-025.pdf

if (!Function.prototype.bind) {
    var slice = Array.prototype.slice;
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        // XXX this gets pretty close, for all intents and purposes, letting
        // some duck-types slide
        if (typeof target.apply !== "function" || typeof target.call !== "function")
            return new TypeError();
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        var args = slice.call(arguments);
        // 4. Let F be a new native ECMAScript object.
        // 9. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 10. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 11. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 12. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        // 13. The [[Scope]] internal property of F is unused and need not
        //   exist.
        var bound = function bound() {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.

                var self = Object.create(target.prototype);
                target.apply(self, args.concat(slice.call(arguments)));
                return self;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the list
                //   boundArgs in the same order followed by the same values as
                //   the list ExtraArgs in the same order. 5.  Return the
                //   result of calling the [[Call]] internal method of target
                //   providing boundThis as the this value and providing args
                //   as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.call.apply(
                    target,
                    args.concat(slice.call(arguments))
                );

            }

        };
        bound.length = (
            // 14. If the [[Class]] internal property of Target is "Function", then
            typeof target === "function" ?
            // a. Let L be the length property of Target minus the length of A.
            // b. Set the length own property of F to either 0 or L, whichever is larger.
            Math.max(target.length - args.length, 0) :
            // 15. Else set the length own property of F to 0.
            0
        )
        // 16. The length own property of F is given attributes as specified in
        //   15.3.5.1.
        // TODO
        // 17. Set the [[Extensible]] internal property of F to true.
        // TODO
        // 18. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // 19. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Value]]: null,
        //   [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]:
        //   false}, and false.
        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property.
        // XXX can't delete it in pure-js.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);

var defineGetter, defineSetter, lookupGetter, lookupSetter, supportsAccessors;
// If JS engine supports accessors creating shortcuts.
if ((supportsAccessors = owns(prototypeOfObject, '__defineGetter__'))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}


//
// Array
// =====
//

// ES5 15.4.3.2
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}

// ES5 15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach =  function forEach(block, thisObject) {
        var len = +this.length;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }
    };
}

// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var len = +this.length;
        if (typeof fun !== "function")
          throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }

        return res;
    };
}

// ES5 15.4.4.20
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(block /*, thisp */) {
        var values = [];
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                values.push(this[i]);
        return values;
    };
}

// ES5 15.4.4.16
if (!Array.prototype.every) {
    Array.prototype.every = function every(block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (!block.call(thisp, this[i]))
                return false;
        return true;
    };
}

// ES5 15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function some(block /*, thisp */) {
        var thisp = arguments[1];
        for (var i = 0; i < this.length; i++)
            if (block.call(thisp, this[i]))
                return true;
        return false;
    };
}

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var len = +this.length;
        if (typeof fun !== "function")
            throw new TypeError();

        // no value to return if no initial value and an empty array
        if (len === 0 && arguments.length === 1)
            throw new TypeError();

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len)
                    throw new TypeError();
            } while (true);
        }

        for (; i < len; i++) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var len = +this.length;
        if (typeof fun !== "function")
            throw new TypeError();

        // no value to return if no initial value, empty array
        if (len === 0 && arguments.length === 1)
            throw new TypeError();

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0)
                    throw new TypeError();
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this)
                rv = fun.call(null, rv, this[i], i, this);
        }

        return rv;
    };
}

// ES5 15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(value /*, fromIndex */ ) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || 0;
        if (i >= length)
            return -1;
        if (i < 0)
            i += length;
        for (; i < length; i++) {
            if (!owns(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

// ES5 15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(value /*, fromIndex */) {
        var length = this.length;
        if (!length)
            return -1;
        var i = arguments[1] || length;
        if (i < 0)
            i += length;
        i = Math.min(i, length - 1);
        for (; i >= 0; i--) {
            if (!owns(this, i))
                continue;
            if (value === this[i])
                return i;
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || object.constructor.prototype;
        // or undefined if not available in this engine
    };
}

// ES5 15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object !== "object" && typeof object !== "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return undefined;

        var despriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        despriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
if (!Object.create) {
    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = { "__proto__": null };
        } else {
            if (typeof prototype !== "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (typeof properties !== "undefined")
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
if (!Object.defineProperty) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if (typeof object !== "object" && typeof object !== "function")
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if (typeof object !== "object" || object === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object === "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        return true;
    };
}

// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if (
            typeof object !== "object" && typeof object !== "function"
            || object === null
        )
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// Format a Date object as a string according to a subset of the ISO-8601 standard.
// Useful in Atom, among other things.
if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        return (
            this.getUTCFullYear() + "-" +
            (this.getUTCMonth() + 1) + "-" +
            this.getUTCDate() + "T" +
            this.getUTCHours() + ":" +
            this.getUTCMinutes() + ":" +
            this.getUTCSeconds() + "Z"
        );
    }
}

// ES5 15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
        // This function provides a String representation of a Date object for
        // use by JSON.stringify (15.12.3). When the toJSON method is called
        // with argument key, the following steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ToPrimitive(O, hint Number).
        // 3. If tv is a Number and is not finite, return null.
        // XXX
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof this.toISOString !== "function")
            throw new TypeError();
        // 6. Return the result of calling the [[Call]] internal method of
        // toISO with O as the this value and an empty argument list.
        return this.toISOString();

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// 15.9.4.2 Date.parse (string)
// 15.9.1.15 Date Time String Format
// Date.parse
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (isNaN(Date.parse("T00:00"))) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length === 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format
        var isoDateExpression = new RegExp("^" +
            "(?:" + // optional year-month-day
                "(" + // year capture
                    "(?:[+-]\\d\\d)?" + // 15.9.1.15.1 Extended years
                    "\\d\\d\\d\\d" + // four-digit year
                ")" +
                "(?:-" + // optional month-day
                    "(\\d\\d)" + // month capture
                    "(?:-" + // optional day
                        "(\\d\\d)" + // day capture
                    ")?" +
                ")?" +
            ")?" +
            "(?:T" + // hour:minute:second.subsecond
                "(\\d\\d)" + // hour capture
                ":(\\d\\d)" + // minute capture
                "(?::" + // optional :second.subsecond
                    "(\\d\\d)" + // second capture
                    "(?:\\.(\\d\\d\\d))?" + // milisecond capture
                ")?" +
            ")?" +
            "(?:" + // time zone
                "Z|" + // UTC capture
                "([+-])(\\d\\d):(\\d\\d)" + // timezone offset
                // capture sign, hour, minute
            ")?" +
        "$");

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate)
            Date[key] = NativeDate[key];

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle the ISO dates we use
        // TODO review specification to ascertain whether it is
        // necessary to implement partial ISO date strings.
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                match.shift(); // kill match[0], the full match
                // recognize times without dates before normalizing the
                // numeric values, for later use
                var timeOnly = match[0] === undefined;
                // parse numerics
                for (var i = 0; i < 10; i++) {
                    // skip + or - for the timezone offset
                    if (i === 7)
                        continue;
                    // Note: parseInt would read 0-prefix numbers as
                    // octal.  Number constructor or unary + work better
                    // here:
                    match[i] = +(match[i] || (i < 3 ? 1 : 0));
                    // match[1] is the month. Months are 0-11 in JavaScript
                    // Date objects, but 1-12 in ISO notation, so we
                    // decrement.
                    if (i === 1)
                        match[i]--;
                }
                // if no year-month-date is provided, return a milisecond
                // quantity instead of a UTC date number value.
                if (timeOnly)
                    return ((match[3] * 60 + match[4]) * 60 + match[5]) * 1000 + match[6];

                // account for an explicit time zone offset if provided
                var offset = (match[8] * 60 + match[9]) * 60 * 1000;
                if (match[6] === "-")
                    offset = -offset;

                return NativeDate.UTC.apply(this, match.slice(0, 7)) + offset;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

//
// String
// ======
//

// ES5 15.5.4.20
if (!String.prototype.trim) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
}

});
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/plugin_manager'), ['pilot/promise'], function (require, exports, module) {


var Promise = require("pilot/promise").Promise;

exports.REASONS = {
    APP_STARTUP: 1,
    APP_SHUTDOWN: 2,
    PLUGIN_ENABLE: 3,
    PLUGIN_DISABLE: 4,
    PLUGIN_INSTALL: 5,
    PLUGIN_UNINSTALL: 6,
    PLUGIN_UPGRADE: 7,
    PLUGIN_DOWNGRADE: 8
};

exports.Plugin = function(name) {
    this.name = name;
    this.status = this.INSTALLED;
};

exports.Plugin.prototype = {
    /**
     * constants for the state
     */
    NEW: 0,
    INSTALLED: 1,
    REGISTERED: 2,
    STARTED: 3,
    UNREGISTERED: 4,
    SHUTDOWN: 5,

    install: function(data, reason) {
        var pr = new Promise();
        if (this.status > this.NEW) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.install) {
                pluginModule.install(data, reason);
            }
            this.status = this.INSTALLED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    register: function(data, reason) {
        var pr = new Promise();
        if (this.status != this.INSTALLED) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.register) {
                pluginModule.register(data, reason);
            }
            this.status = this.REGISTERED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    startup: function(data, reason) {
        reason = reason || exports.REASONS.APP_STARTUP;
        var pr = new Promise();
        if (this.status != this.REGISTERED) {
            pr.resolve(this);
            return pr;
        }
        require([this.name], function(pluginModule) {
            if (pluginModule.startup) {
                pluginModule.startup(data, reason);
            }
            this.status = this.STARTED;
            pr.resolve(this);
        }.bind(this));
        return pr;
    },

    shutdown: function(data, reason) {
        if (this.status != this.STARTED) {
            return;
        }
        pluginModule = require(this.name);
        if (pluginModule.shutdown) {
            pluginModule.shutdown(data, reason);
        }
    }
};

exports.PluginCatalog = function() {
    this.plugins = {};
};

exports.PluginCatalog.prototype = {
    registerPlugins: function(pluginList, data, reason) {
        var registrationPromises = [];
        pluginList.forEach(function(pluginName) {
            var plugin = this.plugins[pluginName];
            if (plugin === undefined) {
                plugin = new exports.Plugin(pluginName);
                this.plugins[pluginName] = plugin;
                registrationPromises.push(plugin.register(data, reason));
            }
        }.bind(this));
        return Promise.group(registrationPromises);
    },

    startupPlugins: function(data, reason) {
        var startupPromises = [];
        for (var pluginName in this.plugins) {
            var plugin = this.plugins[pluginName];
            startupPromises.push(plugin.startup(data, reason));
        }
        return Promise.group(startupPromises);
    }
};

exports.catalog = new exports.PluginCatalog();

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/promise'), ['pilot/console','pilot/stacktrace'], function (require, exports, module) {


var console = require("pilot/console");
var Trace = require('pilot/stacktrace').Trace;

/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var ERROR = -1;
var PENDING = 0;
var SUCCESS = 1;

/**
 * We give promises and ID so we can track which are outstanding
 */
var _nextId = 0;

/**
 * Debugging help if 2 things try to complete the same promise.
 * This can be slow (especially on chrome due to the stack trace unwinding) so
 * we should leave this turned off in normal use.
 */
var _traceCompletion = false;

/**
 * Outstanding promises. Handy list for debugging only.
 */
var _outstanding = [];

/**
 * Recently resolved promises. Also for debugging only.
 */
var _recent = [];

/**
 * Create an unfulfilled promise
 */
Promise = function () {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];

    // Debugging help
    this._id = _nextId++;
    //this._createTrace = new Trace(new Error());
    _outstanding[this._id] = this;
};

/**
 * Yeay for RTTI.
 */
Promise.prototype.isPromise = true;

/**
 * Have we either been resolve()ed or reject()ed?
 */
Promise.prototype.isComplete = function() {
    return this._status != PENDING;
};

/**
 * Have we resolve()ed?
 */
Promise.prototype.isResolved = function() {
    return this._status == SUCCESS;
};

/**
 * Have we reject()ed?
 */
Promise.prototype.isRejected = function() {
    return this._status == ERROR;
};

/**
 * Take the specified action of fulfillment of a promise, and (optionally)
 * a different action on promise rejection.
 */
Promise.prototype.then = function(onSuccess, onError) {
    if (typeof onSuccess === 'function') {
        if (this._status === SUCCESS) {
            onSuccess.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onSuccessHandlers.push(onSuccess);
        }
    }

    if (typeof onError === 'function') {
        if (this._status === ERROR) {
            onError.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onErrorHandlers.push(onError);
        }
    }

    return this;
};

/**
 * Like then() except that rather than returning <tt>this</tt> we return
 * a promise which
 */
Promise.prototype.chainPromise = function(onSuccess) {
    var chain = new Promise();
    chain._chainedFrom = this;
    this.then(function(data) {
        try {
            chain.resolve(onSuccess(data));
        } catch (ex) {
            chain.reject(ex);
        }
    }, function(ex) {
        chain.reject(ex);
    });
    return chain;
};

/**
 * Supply the fulfillment of a promise
 */
Promise.prototype.resolve = function(data) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data, 'resolve');
};

/**
 * Renege on a promise
 */
Promise.prototype.reject = function(data) {
    return this._complete(this._onErrorHandlers, ERROR, data, 'reject');
};

/**
 * Internal method to be called on resolve() or reject().
 * @private
 */
Promise.prototype._complete = function(list, status, data, name) {
    // Complain if we've already been completed
    if (this._status != PENDING) {
        console.group('Promise already closed');
        console.error('Attempted ' + name + '() with ', data);
        console.error('Previous status = ', this._status,
                ', previous value = ', this._value);
        console.trace();

        if (this._completeTrace) {
            console.error('Trace of previous completion:');
            this._completeTrace.log(5);
        }
        console.groupEnd();
        return this;
    }

    if (_traceCompletion) {
        this._completeTrace = new Trace(new Error());
    }

    this._status = status;
    this._value = data;

    // Call all the handlers, and then delete them
    list.forEach(function(handler) {
        handler.call(null, this._value);
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;

    // Remove the given {promise} from the _outstanding list, and add it to the
    // _recent list, pruning more than 20 recent promises from that list.
    delete _outstanding[this._id];
    _recent.push(this);
    while (_recent.length > 20) {
        _recent.shift();
    }

    return this;
};

/**
 * Takes an array of promises and returns a promise that that is fulfilled once
 * all the promises in the array are fulfilled
 * @param group The array of promises
 * @return the promise that is fulfilled when all the array is fulfilled
 */
Promise.group = function(promiseList) {
    if (!(promiseList instanceof Array)) {
        promiseList = Array.prototype.slice.call(arguments);
    }

    // If the original array has nothing in it, return now to avoid waiting
    if (promiseList.length === 0) {
        return new Promise().resolve([]);
    }

    var groupPromise = new Promise();
    var results = [];
    var fulfilled = 0;

    var onSuccessFactory = function(index) {
        return function(data) {
            results[index] = data;
            fulfilled++;
            // If the group has already failed, silently drop extra results
            if (groupPromise._status !== ERROR) {
                if (fulfilled === promiseList.length) {
                    groupPromise.resolve(results);
                }
            }
        };
    };

    promiseList.forEach(function(promise, index) {
        var onSuccess = onSuccessFactory(index);
        var onError = groupPromise.reject.bind(groupPromise);
        promise.then(onSuccess, onError);
    });

    return groupPromise;
};

exports.Promise = Promise;
exports._outstanding = _outstanding;
exports._recent = _recent;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/console'), [], function (require, exports, module) {

    
/**
 * This object represents a "safe console" object that forwards debugging
 * messages appropriately without creating a dependency on Firebug in Firefox.
 */

var noop = function() {};

// These are the functions that are available in Chrome 4/5, Safari 4
// and Firefox 3.6. Don't add to this list without checking browser support
var NAMES = [
    "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd",
    "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"
];

if (typeof(window) === 'undefined') {
    // We're in a web worker. Forward to the main thread so the messages
    // will show up.
    NAMES.forEach(function(name) {
        exports[name] = function() {
            var args = Array.prototype.slice.call(arguments);
            var msg = { op: 'log', method: name, args: args };
            postMessage(JSON.stringify(msg));
        };
    });
} else {
    // For each of the console functions, copy them if they exist, stub if not
    NAMES.forEach(function(name) {
        if (window.console && window.console[name]) {
            exports[name] = Function.prototype.bind.call(window.console[name], window.console);
        } else {
            exports[name] = noop;
        }
    });
}

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/stacktrace'), ['pilot/useragent','pilot/console'], function (require, exports, module) {

    
var ua = require("pilot/useragent");
var console = require('pilot/console');

// Changed to suit the specific needs of running within Skywriter

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Øyvind Sean Kinsey http://kinsey.no/blog
//
// Information and discussions
// http://jspoker.pokersource.info/skin/test-printstacktrace.html
// http://eriwen.com/javascript/js-stack-trace/
// http://eriwen.com/javascript/stacktrace-update/
// http://pastie.org/253058
// http://browsershots.org/http://jspoker.pokersource.info/skin/test-printstacktrace.html
//

//
// guessFunctionNameFromLines comes from firebug
//
// Software License Agreement (BSD License)
//
// Copyright (c) 2007, Parakey Inc.
// All rights reserved.
//
// Redistribution and use of this software in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.
//
// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.
//
// * Neither the name of Parakey Inc. nor the names of its
//   contributors may be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Parakey Inc.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.



/**
 * Different browsers create stack traces in different ways.
 * <strike>Feature</strike> Browser detection baby ;).
 */
var mode = (function() {

    // We use SC's browser detection here to avoid the "break on error"
    // functionality provided by Firebug. Firebug tries to do the right
    // thing here and break, but it happens every time you load the page.
    // bug 554105
    if (ua.isGecko) {
        return 'firefox';
    } else if (ua.isOpera) {
        return 'opera';
    } else {
        return 'other';
    }

    // SC doesn't do any detection of Chrome at this time.

    // this is the original feature detection code that is used as a
    // fallback.
    try {
        (0)();
    } catch (e) {
        if (e.arguments) {
            return 'chrome';
        }
        if (e.stack) {
            return 'firefox';
        }
        if (window.opera && !('stacktrace' in e)) { //Opera 9-
            return 'opera';
        }
    }
    return 'other';
})();

/**
 *
 */
function stringifyArguments(args) {
    for (var i = 0; i < args.length; ++i) {
        var argument = args[i];
        if (typeof argument == 'object') {
            args[i] = '#object';
        } else if (typeof argument == 'function') {
            args[i] = '#function';
        } else if (typeof argument == 'string') {
            args[i] = '"' + argument + '"';
        }
    }
    return args.join(',');
}

/**
 * Extract a stack trace from the format emitted by each browser.
 */
var decoders = {
    chrome: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        return stack.replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^[^\(]+?[\n$]/gm, '').
                replace(/^\s+at\s+/gm, '').
                replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').
                split('\n');
    },

    firefox: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        // stack = stack.replace(/^.*?\n/, '');
        stack = stack.replace(/(?:\n@:0)?\s+$/m, '');
        stack = stack.replace(/^\(/gm, '{anonymous}(');
        return stack.split('\n');
    },

    // Opera 7.x and 8.x only!
    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}',
            lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, i, j, len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) +
                ' -- ' +
                lines[i + 1].replace(/^\s+/, '');
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    // Safari, Opera 9+, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], j = 0, fn, args;

        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments']);
            stack[j++] = fn + '(' + stringifyArguments(args) + ')';

            //Opera bug: if curr.caller does not exist, Opera returns curr (WTF)
            if (curr === curr.caller && window.opera) {
                //TODO: check for same arguments if possible
                break;
            }
            curr = curr.caller;
        }
        return stack;
    }
};

/**
 *
 */
function NameGuesser() {
}

NameGuesser.prototype = {

    sourceCache: {},

    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (!req) {
            return;
        }
        req.open('GET', url, false);
        req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req.send('');
        return req.responseText;
    },

    createXMLHTTPObject: function() {
	    // Try XHR methods in order and store XHR factory
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {}
        }
    },

    getSource: function(url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            var frame = stack[i], m = reStack.exec(frame);
            if (m) {
                var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                if (file && lineno) {
                    var functionName = this.guessFunctionName(file, lineno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessFunctionName: function(url, lineNo) {
        try {
            return this.guessFunctionNameFromLines(lineNo, this.getSource(url));
        } catch (e) {
            return 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
    },

    guessFunctionNameFromLines: function(lineNo, source) {
        var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
        var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
        // Walk backwards from the first line in the function until we find the line which
        // matches the pattern above, which is the function definition
        var line = '', maxLines = 10;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i] + line;
            if (line !== undefined) {
                var m = reGuessFunction.exec(line);
                if (m) {
                    return m[1];
                }
                else {
                    m = reFunctionArgNames.exec(line);
                }
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};

var guesser = new NameGuesser();

var frameIgnorePatterns = [
    /http:\/\/localhost:4020\/sproutcore.js:/
];

exports.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex);
};

/**
 * Create a stack trace from an exception
 * @param ex {Error} The error to create a stacktrace from (optional)
 * @param guess {Boolean} If we should try to resolve the names of anonymous functions
 */
exports.Trace = function Trace(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);

    if (guess) {
        this._stack = guesser.guessFunctions(this._stack);
    }
};

/**
 * Log to the console a number of lines (default all of them)
 * @param lines {number} Maximum number of lines to wrote to console
 */
exports.Trace.prototype.log = function(lines) {
    if (lines <= 0) {
        // You aren't going to have more lines in your stack trace than this
        // and it still fits in a 32bit integer
        lines = 999999999;
    }

    var printed = 0;
    for (var i = 0; i < this._stack.length && printed < lines; i++) {
        var frame = this._stack[i];
        var display = true;
        frameIgnorePatterns.forEach(function(regex) {
            if (regex.test(frame)) {
                display = false;
            }
        });
        if (display) {
            console.debug(frame);
            printed++;
        }
    }
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/useragent'), [], function (require, exports, module) {


var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;
var av = navigator.appVersion;

/** Is the user using a browser that identifies itself as Windows */
exports.isWin = (os == "win");

/** Is the user using a browser that identifies itself as Mac OS */
exports.isMac = (os == "mac");

/** Is the user using a browser that identifies itself as Linux */
exports.isLinux = (os == "linux");

exports.isIE = ! + "\v1";

/** Is this Firefox or related? */
exports.isGecko = exports.isMozilla = window.controllers && window.navigator.product === "Gecko";

/** oldGecko == rev < 2.0 **/
exports.isOldGecko = exports.isGecko && /rv\:1/.test(navigator.userAgent);

/** Is this Opera */
exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";

/** Is the user using a browser that identifies itself as WebKit */
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

/**
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: 'LINUX',
    MAC: 'MAC',
    WINDOWS: 'WINDOWS'
};

/**
 * Return an exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS['MAC'];
    } else if (exports.isLinux) {
        return exports.OS['LINUX'];
    } else {
        return exports.OS['WINDOWS'];
    }
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/settings'), ['pilot/console','pilot/oop','pilot/types','pilot/event_emitter','pilot/catalog'], function (require, exports, module) {


/**
 * This plug-in manages settings.
 */

var console = require('pilot/console');
var oop = require('pilot/oop');
var types = require('pilot/types');
var EventEmitter = require('pilot/event_emitter').EventEmitter;
var catalog = require('pilot/catalog');

var settingExtensionSpec = {
    name: 'setting',
    description: 'A setting is something that the application offers as a ' +
            'way to customize how it works',
    register: 'env.settings.addSetting',
    indexOn: 'name'
};

exports.startup = function(data, reason) {
    catalog.addExtensionSpec(settingExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(settingExtensionSpec);
};


/**
 * Create a new setting.
 * @param settingSpec An object literal that looks like this:
 * {
 *   name: 'thing',
 *   description: 'Thing is an example setting',
 *   type: 'string',
 *   defaultValue: 'something'
 * }
 */
function Setting(settingSpec, settings) {
    this._settings = settings;

    Object.keys(settingSpec).forEach(function(key) {
        this[key] = settingSpec[key];
    }, this);

    this.type = types.getType(this.type);
    if (this.type == null) {
        throw new Error('In ' + this.name +
            ': can\'t find type for: ' + JSON.stringify(settingSpec.type));
    }

    if (!this.name) {
        throw new Error('Setting.name == undefined. Ignoring.', this);
    }

    if (!this.defaultValue === undefined) {
        throw new Error('Setting.defaultValue == undefined', this);
    }

    if (this.onChange) {
        this.on('change', this.onChange.bind(this))
    }

    this.set(this.defaultValue);
}
Setting.prototype = {
    get: function() {
        return this.value;
    },

    set: function(value) {
        if (this.value === value) {
            return;
        }

        this.value = value;
        if (this._settings.persister) {
            this._settings.persister.persistValue(this._settings, this.name, value);
        }

        this._dispatchEvent('change', { setting: this, value: value });
    },

    /**
     * Reset the value of the <code>key</code> setting to it's default
     */
    resetValue: function() {
        this.set(this.defaultValue);
    }
};
oop.implement(Setting.prototype, EventEmitter);


/**
 * A base class for all the various methods of storing settings.
 * <p>Usage:
 * <pre>
 * // Create manually, or require 'settings' from the container.
 * // This is the manual version:
 * var settings = plugins.catalog.getObject('settings');
 * // Add a new setting
 * settings.addSetting({ name:'foo', ... });
 * // Display the default value
 * alert(settings.get('foo'));
 * // Alter the value, which also publishes the change etc.
 * settings.set('foo', 'bar');
 * // Reset the value to the default
 * settings.resetValue('foo');
 * </pre>
 * @constructor
 */
function Settings(persister) {
    // Storage for deactivated values
    this._deactivated = {};

    // Storage for the active settings
    this._settings = {};
    // We often want sorted setting names. Cache
    this._settingNames = [];

    if (persister) {
        this.setPersister(persister);
    }
};

Settings.prototype = {
    /**
     * Function to add to the list of available settings.
     * <p>Example usage:
     * <pre>
     * var settings = plugins.catalog.getObject('settings');
     * settings.addSetting({
     *     name: 'tabsize', // For use in settings.get('X')
     *     type: 'number',  // To allow value checking.
     *     defaultValue: 4  // Default value for use when none is directly set
     * });
     * </pre>
     * @param {object} settingSpec Object containing name/type/defaultValue members.
     */
    addSetting: function(settingSpec) {
        var setting = new Setting(settingSpec, this);
        this._settings[setting.name] = setting;
        this._settingNames.push(setting.name);
        this._settingNames.sort();
    },

    addSettings: function addSettings(settings) {
        Object.keys(settings).forEach(function (name) {
            var setting = settings[name];
            if (!('name' in setting)) setting.name = name;
            this.addSetting(setting);
        }, this);
    },

    removeSetting: function(setting) {
        var name = (typeof setting === 'string' ? setting : setting.name);
        setting = this._settings[name];
        delete this._settings[name];
        util.arrayRemove(this._settingNames, name);
        settings.removeAllListeners('change');
    },

    removeSettings: function removeSettings(settings) {
        Object.keys(settings).forEach(function(name) {
            var setting = settings[name];
            if (!('name' in setting)) setting.name = name;
            this.removeSettings(setting);
        }, this);
    },

    getSettingNames: function() {
        return this._settingNames;
    },

    getSetting: function(name) {
        return this._settings[name];
    },

    /**
     * A Persister is able to store settings. It is an object that defines
     * two functions:
     * loadInitialValues(settings) and persistValue(settings, key, value).
     */
    setPersister: function(persister) {
        this._persister = persister;
        if (persister) {
            persister.loadInitialValues(this);
        }
    },

    resetAll: function() {
        this.getSettingNames().forEach(function(key) {
            this.resetValue(key);
        }, this);
    },

    /**
     * Retrieve a list of the known settings and their values
     */
    _list: function() {
        var reply = [];
        this.getSettingNames().forEach(function(setting) {
            reply.push({
                'key': setting,
                'value': this.getSetting(setting).get()
            });
        }, this);
        return reply;
    },

    /**
     * Prime the local cache with the defaults.
     */
    _loadDefaultValues: function() {
        this._loadFromObject(this._getDefaultValues());
    },

    /**
     * Utility to load settings from an object
     */
    _loadFromObject: function(data) {
        // We iterate over data rather than keys so we don't forget values
        // which don't have a setting yet.
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var setting = this._settings[key];
                if (setting) {
                    var value = setting.type.parse(data[key]);
                    this.set(key, value);
                } else {
                    this.set(key, data[key]);
                }
            }
        }
    },

    /**
     * Utility to grab all the settings and export them into an object
     */
    _saveToObject: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].type.stringify(this.get(key));
        }.bind(this));
    },

    /**
     * The default initial settings
     */
    _getDefaultValues: function() {
        return this.getSettingNames().map(function(key) {
            return this._settings[key].spec.defaultValue;
        }.bind(this));
    }
};
exports.settings = new Settings();

/**
 * Save the settings in a cookie
 * This code has not been tested since reboot
 * @constructor
 */
function CookiePersister() {
};

CookiePersister.prototype = {
    loadInitialValues: function(settings) {
        settings._loadDefaultValues();
        var data = cookie.get('settings');
        settings._loadFromObject(JSON.parse(data));
    },

    persistValue: function(settings, key, value) {
        try {
            var stringData = JSON.stringify(settings._saveToObject());
            cookie.set('settings', stringData);
        } catch (ex) {
            console.error('Unable to JSONify the settings! ' + ex);
            return;
        }
    }
};

exports.CookiePersister = CookiePersister;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/oop'), [], function (require, exports, module) {


exports.inherits = (function() {
    var tempCtor = function() {};
    return function(ctor, superCtor) {
        tempCtor.prototype = superCtor.prototype;
        ctor.super_ = superCtor.prototype;
        ctor.prototype = new tempCtor();
        ctor.prototype.constructor = ctor;
    }
}());

exports.mixin = function(obj, mixin) {
    for (var key in mixin) {
        obj[key] = mixin[key];
    }
};

exports.implement = function(proto, mixin) {
    exports.mixin(proto, mixin);
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/types'), [], function (require, exports, module) {


/**
 * Some types can detect validity, that is to say they can distinguish between
 * valid and invalid values.
 * TODO: Change these constants to be numbers for more performance?
 */
var Status = {
    /**
     * The conversion process worked without any problem, and the value is
     * valid. There are a number of failure states, so the best way to check
     * for failure is (x !== Status.VALID)
     */
    VALID: {
        toString: function() { return 'VALID'; },
        valueOf: function() { return 0; }
    },

    /**
     * A conversion process failed, however it was noted that the string
     * provided to 'parse()' could be VALID by the addition of more characters,
     * so the typing may not be actually incorrect yet, just unfinished.
     * @see Status.INVALID
     */
    INCOMPLETE: {
        toString: function() { return 'INCOMPLETE'; },
        valueOf: function() { return 1; }
    },

    /**
     * The conversion process did not work, the value should be null and a
     * reason for failure should have been provided. In addition some completion
     * values may be available.
     * @see Status.INCOMPLETE
     */
    INVALID: {
        toString: function() { return 'INVALID'; },
        valueOf: function() { return 2; }
    },

    /**
     * A combined status is the worser of the provided statuses
     */
    combine: function(statuses) {
        var combined = Status.VALID;
        for (var i = 0; i < statuses.length; i++) {
            if (statuses[i].valueOf() > combined.valueOf()) {
                combined = statuses[i];
            }
        }
        return combined;
    }
};
exports.Status = Status;

/**
 * The type.parse() method returns a Conversion to inform the user about not
 * only the result of a Conversion but also about what went wrong.
 * We could use an exception, and throw if the conversion failed, but that
 * seems to violate the idea that exceptions should be exceptional. Typos are
 * not. Also in order to store both a status and a message we'd still need
 * some sort of exception type...
 */
function Conversion(value, status, message, predictions) {
    /**
     * The result of the conversion process. Will be null if status != VALID
     */
    this.value = value;

    /**
     * The status of the conversion.
     * @see Status
     */
    this.status = status || Status.VALID;

    /**
     * A message to go with the conversion. This could be present for any status
     * including VALID in the case where we want to note a warning for example.
     * I18N: On the one hand this nasty and un-internationalized, however with
     * a command line it is hard to know where to start.
     */
    this.message = message;

    /**
     * A array of strings which are the systems best guess at better inputs than
     * the one presented.
     * We generally expect there to be about 7 predictions (to match human list
     * comprehension ability) however it is valid to provide up to about 20,
     * or less. It is the job of the predictor to decide a smart cut-off.
     * For example if there are 4 very good matches and 4 very poor ones,
     * probably only the 4 very good matches should be presented.
     */
    this.predictions = predictions || [];
}
exports.Conversion = Conversion;

/**
 * Most of our types are 'static' e.g. there is only one type of 'text', however
 * some types like 'selection' and 'deferred' are customizable. The basic
 * Type type isn't useful, but does provide documentation about what types do.
 */
function Type() {
};
Type.prototype = {
    /**
     * Convert the given <tt>value</tt> to a string representation.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     */
    stringify: function(value) { throw new Error("not implemented"); },

    /**
     * Convert the given <tt>str</tt> to an instance of this type.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     * @return Conversion
     */
    parse: function(str) { throw new Error("not implemented"); },

    /**
     * The plug-in system, and other things need to know what this type is
     * called. The name alone is not enough to fully specify a type. Types like
     * 'selection' and 'deferred' need extra data, however this function returns
     * only the name, not the extra data.
     * <p>In old bespin, equality was based on the name. This may turn out to be
     * important in Ace too.
     */
    name: undefined,

    /**
     * If there is some concept of a higher value, return it,
     * otherwise return undefined.
     */
    increment: function(value) {
        return undefined;
    },

    /**
     * If there is some concept of a lower value, return it,
     * otherwise return undefined.
     */
    decrement: function(value) {
        return undefined;
    },

    /**
     * There is interesting information (like predictions) in a conversion of
     * nothing, the output of this can sometimes be customized.
     * @return Conversion
     */
    getDefault: function() {
        return this.parse('');
    }
};
exports.Type = Type;

/**
 * Private registry of types
 * Invariant: types[name] = type.name
 */
var types = {};

/**
 * Add a new type to the list available to the system.
 * You can pass 2 things to this function - either an instance of Type, in
 * which case we return this instance when #getType() is called with a 'name'
 * that matches type.name.
 * Also you can pass in a constructor (i.e. function) in which case when
 * #getType() is called with a 'name' that matches Type.prototype.name we will
 * pass the typeSpec into this constructor. See #reconstituteType().
 */
exports.registerType = function(type) {
    if (typeof type === 'object') {
        if (type instanceof Type) {
            if (!type.name) {
                throw new Error('All registered types must have a name');
            }
            types[type.name] = type;
        }
        else {
            throw new Error('Can\'t registerType using: ' + type);
        }
    }
    else if (typeof type === 'function') {
        if (!type.prototype.name) {
            throw new Error('All registered types must have a name');
        }
        types[type.prototype.name] = type;
    }
    else {
        throw new Error('Unknown type: ' + type);
    }
};

exports.registerTypes = function registerTypes(types) {
    Object.keys(types).forEach(function (name) {
        var type = types[name];
        type.name = name;
        exports.registerType(type);
    });
};

/**
 * Remove a type from the list available to the system
 */
exports.deregisterType = function(type) {
    delete types[type.name];
};

/**
 * See description of #exports.registerType()
 */
function reconstituteType(name, typeSpec) {
    if (name.substr(-2) === '[]') { // i.e. endsWith('[]')
        var subtypeName = name.slice(0, -2);
        return new types['array'](subtypeName);
    }

    var type = types[name];
    if (typeof type === 'function') {
        type = new type(typeSpec);
    }
    return type;
}

/**
 * Find a type, previously registered using #registerType()
 */
exports.getType = function(typeSpec) {
    if (typeof typeSpec === 'string') {
        return reconstituteType(typeSpec);
    }

    if (typeof typeSpec === 'object') {
        if (!typeSpec.name) {
            throw new Error('Missing \'name\' member to typeSpec');
        }
        return reconstituteType(typeSpec.name, typeSpec);
    }

    throw new Error('Can\'t extract type from ' + typeSpec);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/event_emitter'), [], function (require, exports, module) {


var EventEmitter = {};

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners || !listeners.length) return;

    var e = e || {};
    e.type = eventName;

    for (var i=0; i<listeners.length; i++) {
        listeners[i](e);
    }
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners) {
      var listeners = this._eventRegistry[eventName] = [];
    }
    if (listeners.indexOf(callback) == -1) {
        listeners.push(callback);
    }
};

EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners) {
      return;
    }
    var index = listeners.indexOf(callback);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
}

exports.EventEmitter = EventEmitter;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/catalog'), [], function (require, exports, module) {



var extensionSpecs = {};

exports.addExtensionSpec = function(extensionSpec) {
    extensionSpecs[extensionSpec.name] = extensionSpec;
};

exports.removeExtensionSpec = function(extensionSpec) {
    if (typeof extensionSpec === "string") {
        delete extensionSpecs[extensionSpec];
    }
    else {
        delete extensionSpecs[extensionSpec.name];
    }
};

exports.getExtensionSpec = function(name) {
    return extensionSpecs[name];
};

exports.getExtensionSpecs = function() {
    return Object.keys(extensionSpecs);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/environment'), ['pilot/settings'], function (require, exports, module) {



var settings = require("pilot/settings").settings;

/**
 * Create an environment object
 */
function create() {
    return {
        settings: settings
    };
};

exports.create = create;


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/canon'), ['pilot/console','pilot/stacktrace','pilot/oop','pilot/useragent','pilot/keys','pilot/event_emitter','pilot/typecheck','pilot/catalog','pilot/types','pilot/types','pilot/lang'], function (require, exports, module) {


var console = require('pilot/console');
var Trace = require('pilot/stacktrace').Trace;
var oop = require('pilot/oop');
var useragent = require('pilot/useragent');
var keyUtil = require('pilot/keys');
var EventEmitter = require('pilot/event_emitter').EventEmitter;
var typecheck = require('pilot/typecheck');
var catalog = require('pilot/catalog');
var Status = require('pilot/types').Status;
var types = require('pilot/types');
var lang = require('pilot/lang');

/*
// TODO: this doesn't belong here - or maybe anywhere?
var dimensionsChangedExtensionSpec = {
    name: 'dimensionsChanged',
    description: 'A dimensionsChanged is a way to be notified of ' +
            'changes to the dimension of Skywriter'
};
exports.startup = function(data, reason) {
    catalog.addExtensionSpec(commandExtensionSpec);
};
exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};
*/

var commandExtensionSpec = {
    name: 'command',
    description: 'A command is a bit of functionality with optional ' +
            'typed arguments which can do something small like moving ' +
            'the cursor around the screen, or large like cloning a ' +
            'project from VCS.',
    indexOn: 'name'
};

exports.startup = function(data, reason) {
    // TODO: this is probably all kinds of evil, but we need something working
    catalog.addExtensionSpec(commandExtensionSpec);
};

exports.shutdown = function(data, reason) {
    catalog.removeExtensionSpec(commandExtensionSpec);
};

/**
 * Manage a list of commands in the current canon
 */

/**
 * A Command is a discrete action optionally with a set of ways to customize
 * how it happens. This is here for documentation purposes.
 * TODO: Document better
 */
var thingCommand = {
    name: 'thing',
    description: 'thing is an example command',
    params: [{
        name: 'param1',
        description: 'an example parameter',
        type: 'text',
        defaultValue: null
    }],
    exec: function(env, args, request) {
        thing();
    }
};

/**
 * A lookup hash of our registered commands
 */
var commands = {};

/**
 * A lookup has for command key bindings that use a string as sender.
 */
var commmandKeyBinding = {};

/**
 * Array with command key bindings that use a function to determ the sender.
 */
var commandKeyBindingFunc = { };

function splitSafe(s, separator, limit, bLowerCase) {
    return (bLowerCase && s.toLowerCase() || s)
        .replace(/(?:^\s+|\n|\s+$)/g, "")
        .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
}

function parseKeys(keys, val, ret) {
    var key,
        hashId = 0,
        parts  = splitSafe(keys, "\\-", null, true),
        i      = 0,
        l      = parts.length;

    for (; i < l; ++i) {
        if (keyUtil.KEY_MODS[parts[i]])
            hashId = hashId | keyUtil.KEY_MODS[parts[i]];
        else
            key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
    }

    if (ret == null) {
        return {
            key: key,
            hashId: hashId
        }   
    } else {
        (ret[hashId] || (ret[hashId] = {}))[key] = val;
    }
}

var platform = useragent.isMac ? "mac" : "win";
function buildKeyHash(command) {
    var binding = command.bindKey,
        key = binding[platform],
        ckb = commmandKeyBinding,
        ckbf = commandKeyBindingFunc

    if (!binding.sender) {
        throw new Error('All key bindings must have a sender');   
    }
    if (!binding.mac && binding.mac !== null) {
        throw new Error('All key bindings must have a mac key binding');
    }
    if (!binding.win && binding.win !== null) {
        throw new Error('All key bindings must have a windows key binding');
    }
    if(!binding[platform]) {
        // No keymapping for this platform.
        return;   
    }
    if (typeof binding.sender == 'string') {
        var targets = splitSafe(binding.sender, "\\|", null, true);
        targets.forEach(function(target) {
            if (!ckb[target]) {
                ckb[target] = { };
            }
            key.split("|").forEach(function(keyPart) {
                parseKeys(keyPart, command, ckb[target]);        
            });
        });
    } else if (typecheck.isFunction(binding.sender)) {
        var val = {
            command: command,
            sender:  binding.sender
        };
        
        keyData = parseKeys(key);
        if (!ckbf[keyData.hashId]) {
            ckbf[keyData.hashId] = { };
        }
        if (!ckbf[keyData.hashId][keyData.key]) {
            ckbf[keyData.hashId][keyData.key] = [ val ];   
        } else {
            ckbf[keyData.hashId][keyData.key].push(val);
        }
    } else {
        throw new Error('Key binding must have a sender that is a string or function');   
    }
}

function findKeyCommand(env, sender, hashId, textOrKey) {
    // Convert keyCode to the string representation.
    if (typecheck.isNumber(textOrKey)) {
        textOrKey = keyUtil.keyCodeToString(textOrKey);
    }
    
    // Check bindings with functions as sender first.    
    var bindFuncs = (commandKeyBindingFunc[hashId]  || {})[textOrKey] || [];
    for (var i = 0; i < bindFuncs.length; i++) {
        if (bindFuncs[i].sender(env, sender, hashId, textOrKey)) {
            return bindFuncs[i].command;
        }
    }
    
    var ckbr = commmandKeyBinding[sender]
    return ckbr && ckbr[hashId] && ckbr[hashId][textOrKey];
}

function execKeyCommand(env, sender, hashId, textOrKey) {
    var command = findKeyCommand(env, sender, hashId, textOrKey);
    if (command) {
        return exec(command, env, sender, { });   
    } else {
        return false;
    }
}

/**
 * A sorted list of command names, we regularly want them in order, so pre-sort
 */
var commandNames = [];

/**
 * This registration method isn't like other Ace registration methods because
 * it doesn't return a decorated command because there is no functional
 * decoration to be done.
 * TODO: Are we sure that in the future there will be no such decoration?
 */
function addCommand(command) {
    if (!command.name) {
        throw new Error('All registered commands must have a name');
    }
    if (command.params == null) {
        command.params = [];
    }
    if (!Array.isArray(command.params)) {
        throw new Error('command.params must be an array in ' + command.name);
    }
    // Replace the type
    command.params.forEach(function(param) {
        if (!param.name) {
            throw new Error('In ' + command.name + ': all params must have a name');
        }
        upgradeType(command.name, param);
    }, this);
    commands[command.name] = command;

    if (command.bindKey) {
        buildKeyHash(command);   
    }

    commandNames.push(command.name);
    commandNames.sort();
};

function upgradeType(name, param) {
    var lookup = param.type;
    param.type = types.getType(lookup);
    if (param.type == null) {
        throw new Error('In ' + name + '/' + param.name +
            ': can\'t find type for: ' + JSON.stringify(lookup));
    }
}

function removeCommand(command) {
    var name = (typeof command === 'string' ? command : command.name);
    delete commands[name];
    lang.arrayRemove(commandNames, name);
};

function getCommand(name) {
    return commands[name];
};

function getCommandNames() {
    return commandNames;
};

/**
 * Default ArgumentProvider that is used if no ArgumentProvider is provided
 * by the command's sender.
 */
function defaultArgsProvider(request, callback) {
    var args  = request.args,
        params = request.command.params;

    for (var i = 0; i < params.length; i++) {
        var param = params[i];

        // If the parameter is already valid, then don't ask for it anymore.
        if (request.getParamStatus(param) != Status.VALID ||
            // Ask for optional parameters as well.
            param.defaultValue === null) 
        {
            var paramPrompt = param.description;
            if (param.defaultValue === null) {
                paramPrompt += " (optional)";
            }
            var value = prompt(paramPrompt, param.defaultValue || "");
            // No value but required -> nope.
            if (!value) {
                callback();
                return;
            } else {
                args[param.name] = value;
            }           
        }
    }
    callback();
}

/**
 * Entry point for keyboard accelerators or anything else that wants to execute
 * a command. A new request object is created and a check performed, if the
 * passed in arguments are VALID/INVALID or INCOMPLETE. If they are INCOMPLETE
 * the ArgumentProvider on the sender is called or otherwise the default 
 * ArgumentProvider to get the still required arguments.
 * If they are valid (or valid after the ArgumentProvider is done), the command
 * is executed.
 * 
 * @param command   Either a command, or the name of one
 * @param env       Current environment to execute the command in
 * @param sender    String that should be the same as the senderObject stored on 
 *                  the environment in env[sender]
 * @param args      Arguments for the command
 * @param typed     (Optional)
 */
function exec(command, env, sender, args, typed) {
    if (typeof command === 'string') {
        command = commands[command];
    }
    if (!command) {
        // TODO: Should we complain more than returning false?
        return false;
    }

    var request = new Request({
        sender: sender,
        command: command,
        args: args || {},
        typed: typed
    });
    
    /**
     * Executes the command and ensures request.done is called on the request in 
     * case it's not marked to be done already or async.
     */
    function execute() {
        command.exec(env, request.args, request);
        
        // If the request isn't asnync and isn't done, then make it done.
        if (!request.isAsync && !request.isDone) {
            request.done();
        }
    }
    
    
    if (request.getStatus() == Status.INVALID) {
        console.error("Canon.exec: Invalid parameter(s) passed to " + 
                            command.name);
        return false;   
    } 
    // If the request isn't complete yet, try to complete it.
    else if (request.getStatus() == Status.INCOMPLETE) {
        // Check if the sender has a ArgsProvider, otherwise use the default
        // build in one.
        var argsProvider;
        var senderObj = env[sender];
        if (!senderObj || !senderObj.getArgsProvider ||
            !(argsProvider = senderObj.getArgsProvider())) 
        {
            argsProvider = defaultArgsProvider;
        }

        // Ask the paramProvider to complete the request.
        argsProvider(request, function() {
            if (request.getStatus() == Status.VALID) {
                execute();
            }
        });
        return true;
    } else {
        execute();
        return true;
    }
};

exports.removeCommand = removeCommand;
exports.addCommand = addCommand;
exports.getCommand = getCommand;
exports.getCommandNames = getCommandNames;
exports.findKeyCommand = findKeyCommand;
exports.exec = exec;
exports.execKeyCommand = execKeyCommand;
exports.upgradeType = upgradeType;


/**
 * We publish a 'output' event whenever new command begins output
 * TODO: make this more obvious
 */
oop.implement(exports, EventEmitter);


/**
 * Current requirements are around displaying the command line, and provision
 * of a 'history' command and cursor up|down navigation of history.
 * <p>Future requirements could include:
 * <ul>
 * <li>Multiple command lines
 * <li>The ability to recall key presses (i.e. requests with no output) which
 * will likely be needed for macro recording or similar
 * <li>The ability to store the command history either on the server or in the
 * browser local storage.
 * </ul>
 * <p>The execute() command doesn't really live here, except as part of that
 * last future requirement, and because it doesn't really have anywhere else to
 * live.
 */

/**
 * The array of requests that wish to announce their presence
 */
var requests = [];

/**
 * How many requests do we store?
 */
var maxRequestLength = 100;

/**
 * To create an invocation, you need to do something like this (all the ctor
 * args are optional):
 * <pre>
 * var request = new Request({
 *     command: command,
 *     args: args,
 *     typed: typed
 * });
 * </pre>
 * @constructor
 */
function Request(options) {
    options = options || {};

    // Will be used in the keyboard case and the cli case
    this.command = options.command;

    // Will be used only in the cli case
    this.args = options.args;
    this.typed = options.typed;

    // Have we been initialized?
    this._begunOutput = false;

    this.start = new Date();
    this.end = null;
    this.completed = false;
    this.error = false;
};

oop.implement(Request.prototype, EventEmitter);

/**
 * Return the status of a parameter on the request object.
 */
Request.prototype.getParamStatus = function(param) {
    var args = this.args || {};
    
    // Check if there is already a value for this parameter.
    if (param.name in args) {
        // If there is no value set and then the value is VALID if it's not
        // required or INCOMPLETE if not set yet.
        if (args[param.name] == null) {
            if (param.defaultValue === null) {
                return Status.VALID;
            } else {
                return Status.INCOMPLETE;   
            } 
        }
        
        // Check if the parameter value is valid.
        var reply,
            // The passed in value when parsing a type is a string.
            argsValue = args[param.name].toString();
        
        // Type.parse can throw errors. 
        try {
            reply = param.type.parse(argsValue);
        } catch (e) {
            return Status.INVALID;   
        }
        
        if (reply.status != Status.VALID) {
            return reply.status;   
        }
    } 
    // Check if the param is marked as required.
    else if (param.defaultValue === undefined) {
        // The parameter is not set on the args object but it's required,
        // which means, things are invalid.
        return Status.INCOMPLETE;
    }
    
    return Status.VALID;
}

/**
 * Return the status of a parameter name on the request object.
 */
Request.prototype.getParamNameStatus = function(paramName) {
    var params = this.command.params || [];
    
    for (var i = 0; i < params.length; i++) {
        if (params[i].name == paramName) {
            return this.getParamStatus(params[i]);   
        }
    }
    
    throw "Parameter '" + paramName + 
                "' not defined on command '" + this.command.name + "'"; 
}

/**
 * Checks if all required arguments are set on the request such that it can
 * get executed.
 */
Request.prototype.getStatus = function() {
    var args = this.args || {},
        params = this.command.params;

    // If there are not parameters, then it's valid.
    if (!params || params.length == 0) {
        return Status.VALID;
    }

    var status = [];
    for (var i = 0; i < params.length; i++) {
        status.push(this.getParamStatus(params[i]));        
    }

    return Status.combine(status);
}

/**
 * Lazy init to register with the history should only be done on output.
 * init() is expensive, and won't be used in the majority of cases
 */
Request.prototype._beginOutput = function() {
    this._begunOutput = true;
    this.outputs = [];

    requests.push(this);
    // This could probably be optimized with some maths, but 99.99% of the
    // time we will only be off by one, and I'm feeling lazy.
    while (requests.length > maxRequestLength) {
        requests.shiftObject();
    }

    exports._dispatchEvent('output', { requests: requests, request: this });
};

/**
 * Sugar for:
 * <pre>request.error = true; request.done(output);</pre>
 */
Request.prototype.doneWithError = function(content) {
    this.error = true;
    this.done(content);
};

/**
 * Declares that this function will not be automatically done when
 * the command exits
 */
Request.prototype.async = function() {
    this.isAsync = true;
    if (!this._begunOutput) {
        this._beginOutput();
    }
};

/**
 * Complete the currently executing command with successful output.
 * @param output Either DOM node, an SproutCore element or something that
 * can be used in the content of a DIV to create a DOM node.
 */
Request.prototype.output = function(content) {
    if (!this._begunOutput) {
        this._beginOutput();
    }

    if (typeof content !== 'string' && !(content instanceof Node)) {
        content = content.toString();
    }

    this.outputs.push(content);
    this.isDone = true;
    this._dispatchEvent('output', {});

    return this;
};

/**
 * All commands that do output must call this to indicate that the command
 * has finished execution.
 */
Request.prototype.done = function(content) {
    this.completed = true;
    this.end = new Date();
    this.duration = this.end.getTime() - this.start.getTime();

    if (content) {
        this.output(content);
    }
    
    // Ensure to finish the request only once.
    if (!this.isDone) {
        this.isDone = true;
        this._dispatchEvent('output', {});   
    }
};
exports.Request = Request;


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/keys'), ['pilot/oop'], function (require, exports, module) {


var oop = require("pilot/oop");

/**
 * Helper functions and hashes for key handling.
 */
var Keys = (function() {
    var ret = {
        MODIFIER_KEYS: {
            16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
        },

        KEY_MODS: {
            "ctrl": 1, "alt": 2, "option" : 2,
            "shift": 4, "meta": 8, "command": 8
        },

        FUNCTION_KEYS : {
            8  : "Backspace",
            9  : "Tab",
            13 : "Return",
            19 : "Pause",
            27 : "Esc",
            32 : "Space",
            33 : "PageUp",
            34 : "PageDown",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
            44 : "Print",
            45 : "Insert",
            46 : "Delete",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

        PRINTABLE_KEYS: {
           32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
           54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
           66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
           73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
           80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
           87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
          188: ',', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\',
          221: ']', 222: '\"'
        }
    };

    // A reverse map of FUNCTION_KEYS
    for (i in ret.FUNCTION_KEYS) {
        var name = ret.FUNCTION_KEYS[i].toUpperCase();
        ret[name] = parseInt(i, 10);
    }

    // Add the MODIFIER_KEYS, FUNCTION_KEYS and PRINTABLE_KEYS to the KEY
    // variables as well.
    oop.mixin(ret, ret.MODIFIER_KEYS);
    oop.mixin(ret, ret.PRINTABLE_KEYS);
    oop.mixin(ret, ret.FUNCTION_KEYS);

    return ret;
})();
oop.mixin(exports, Keys);

exports.keyCodeToString = function(keyCode) {
    return (Keys[keyCode] || String.fromCharCode(keyCode)).toLowerCase();
}

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/typecheck'), [], function (require, exports, module) {


var objectToString = Object.prototype.toString;

/**
 * Return true if it is a String
 */
exports.isString = function(it) {
    return it && objectToString.call(it) === "[object String]";
};

/**
 * Returns true if it is a Boolean.
 */
exports.isBoolean = function(it) {
    return it && objectToString.call(it) === "[object Boolean]";
};

/**
 * Returns true if it is a Number.
 */
exports.isNumber = function(it) {
    return it && objectToString.call(it) === "[object Number]" && isFinite(it);
};

/**
 * Hack copied from dojo.
 */
exports.isObject = function(it) {
    return it !== undefined &&
        (it === null || typeof it == "object" ||
        Array.isArray(it) || exports.isFunction(it));
};

/**
 * Is the passed object a function?
 * From dojo.isFunction()
 */
exports.isFunction = function(it) {
    return it && objectToString.call(it) === "[object Function]";
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/lang'), [], function (require, exports, module) {


exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
     return new Array(count + 1).join(string);
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '')
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, ''); 
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

/**
 * splice out of 'array' anything that === 'value'
 */
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.deferredCall = function(fcn) {

    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred = function(timeout) {
        if (!timer) {
            timer = setTimeout(callback, timeout || 0);
        }
        return deferred;
    }

    deferred.schedule = deferred;
    
    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };
    
    return deferred;
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/event'), ['pilot/keys','pilot/useragent','pilot/dom'], function (require, exports, module) {


var keys = require("pilot/keys");
var useragent = require("pilot/useragent");
var dom = require("pilot/dom");

exports.addListener = function(elem, type, callback) {
    if (elem.addEventListener) {
        return elem.addEventListener(type, callback, false);
    }
    if (elem.attachEvent) {
        var wrapper = function() {
            callback(window.event);
        };
        callback._wrapper = wrapper;
        elem.attachEvent("on" + type, wrapper);
    }
};

exports.removeListener = function(elem, type, callback) {
    if (elem.removeEventListener) {
        return elem.removeEventListener(type, callback, false);
    }
    if (elem.detachEvent) {
        elem.detachEvent("on" + type, callback._wrapper || callback);
    }
};

/**
* Prevents propagation and clobbers the default action of the passed event
*/
exports.stopEvent = function(e) {
    exports.stopPropagation(e);
    exports.preventDefault(e);
    return false;
};

exports.stopPropagation = function(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
};

exports.preventDefault = function(e) {
    if (e.preventDefault)
        e.preventDefault();
    else
        e.returnValue = false;
};

exports.getDocumentX = function(e) {
    if (e.clientX) {        
        return e.clientX + dom.getPageScrollLeft();
    } else {
        return e.pageX;
    }
};

exports.getDocumentY = function(e) {
    if (e.clientY) {
        return e.clientY + dom.getPageScrollTop();
    } else {
        return e.pageY;
    }
};

/**
 * @return {Number} 0 for left button, 1 for middle button, 2 for right button
 */
exports.getButton = function(e) {
    if (e.type == "dblclick")
        return 0;
    else if (e.type == "contextmenu")
        return 2;
        
    // DOM Event
    if (e.preventDefault) {
        return e.button;
    }
    // old IE
    else {
        return {1:0, 2:2, 4:1}[e.button];
    }
};

if (document.documentElement.setCapture) {
    exports.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            return exports.stopPropagation(e);
        }

        function onReleaseCapture(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            exports.removeListener(el, "mousemove", eventHandler);
            exports.removeListener(el, "mouseup", onReleaseCapture);
            exports.removeListener(el, "losecapture", onReleaseCapture);

            el.releaseCapture();
        }

        exports.addListener(el, "mousemove", eventHandler);
        exports.addListener(el, "mouseup", onReleaseCapture);
        exports.addListener(el, "losecapture", onReleaseCapture);
        el.setCapture();
    };
}
else {
    exports.capture = function(el, eventHandler, releaseCaptureHandler) {
        function onMouseMove(e) {
            eventHandler(e);
            e.stopPropagation();
        }

        function onMouseUp(e) {
            eventHandler && eventHandler(e);
            releaseCaptureHandler && releaseCaptureHandler();

            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", onMouseUp, true);

            e.stopPropagation();
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
    };
}

exports.addMouseWheelListener = function(el, callback) {
    var listener = function(e) {
        if (e.wheelDelta !== undefined) {
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / 8;
                e.wheelY = -e.wheelDeltaY / 8;
            } else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / 8;
            }
        }
        else {
            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            } else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
        }
        callback(e);
    };
    exports.addListener(el, "DOMMouseScroll", listener);
    exports.addListener(el, "mousewheel", listener);
};

exports.addMultiMouseDownListener = function(el, button, count, timeout, callback) {
    var clicks = 0;
    var startX, startY;

    var listener = function(e) {
        clicks += 1;
        if (clicks == 1) {
            startX = e.clientX;
            startY = e.clientY;

            setTimeout(function() {
                clicks = 0;
            }, timeout || 600);
        }

        if (exports.getButton(e) != button
          || Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)
            clicks = 0;

        if (clicks == count) {
            clicks = 0;
            callback(e);
        }
        return exports.preventDefault(e);
    };

    exports.addListener(el, "mousedown", listener);
    useragent.isIE && exports.addListener(el, "dblclick", listener);
};

function normalizeCommandKeys(callback, e, keyCode) {
    var hashId = 0;
    if (useragent.isOpera && useragent.isMac) {
        hashId = 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0)
            | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
    } else {
        hashId = 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0)
            | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
    }

    if (keyCode in keys.MODIFIER_KEYS) {
        switch (keys.MODIFIER_KEYS[keyCode]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = 0;
    }

    if (hashId & 8 && (keyCode == 91 || keyCode == 93)) {
        keyCode = 0;
    }

    // If there is no hashID and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    if (hashId == 0 && !(keyCode in keys.FUNCTION_KEYS)) {
        return false;
    }

    return callback(e, hashId, keyCode);
}

exports.addCommandKeyListener = function(el, callback) {
    var addListener = exports.addListener;
    if (useragent.isOldGecko) {
        // Old versions of Gecko aka. Firefox < 4.0 didn't repeat the keydown
        // event if the user pressed the key for a longer time. Instead, the
        // keydown event was fired once and later on only the keypress event.
        // To emulate the 'right' keydown behavior, the keyCode of the initial
        // keyDown event is stored and in the following keypress events the
        // stores keyCode is used to emulate a keyDown event.
        var lastKeyDownKeyCode = null;
        addListener(el, "keydown", function(e) {
            lastKeyDownKeyCode = e.keyCode;
        });
        addListener(el, "keypress", function(e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    } else {
        var lastDown = null;

        addListener(el, "keydown", function(e) {
            lastDown = e.keyIdentifier || e.keyCode;
            return normalizeCommandKeys(callback, e, e.keyCode);
        });

        // repeated keys are fired as keypress and not keydown events
        if (useragent.isMac && useragent.isOpera) {
            addListener(el, "keypress", function(e) {
                var keyId = e.keyIdentifier || e.keyCode;
                if (lastDown !== keyId) {
                    return normalizeCommandKeys(callback, e, e.keyCode);
                } else {
                    lastDown = null;
                }
            });
        }
    }
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/dom'), [], function (require, exports, module) {


var XHTML_NS = "http://www.w3.org/1999/xhtml";

exports.createElement = function(tag, ns) {
    return document.createElementNS ?
           document.createElementNS(ns || XHTML_NS, tag) :
           document.createElement(tag);
};

exports.setText = function(elem, text) {
    if (elem.innerText !== undefined) {
        elem.innerText = text;
    }
    if (elem.textContent !== undefined) {
        elem.textContent = text;
    }
};

if (!document.documentElement.classList) {
    exports.hasCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        return classes.indexOf(name) !== -1;
    };

    /**
    * Add a CSS class to the list of classes on the given node
    */
    exports.addCssClass = function(el, name) {
        if (!exports.hasCssClass(el, name)) {
            el.className += " " + name;
        }
    };

    /**
    * Remove a CSS class from the list of classes on the given node
    */
    exports.removeCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        while (true) {
            var index = classes.indexOf(name);
            if (index == -1) {
                break;
            }
            classes.splice(index, 1);
        }
        el.className = classes.join(" ");
    };

    exports.toggleCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g), add = true;
        while (true) {
            var index = classes.indexOf(name);
            if (index == -1) {
                break;
            }
            add = false;
            classes.splice(index, 1);
        }
        if(add)
            classes.push(name);

        el.className = classes.join(" ");
        return add;
    };
} else {
    exports.hasCssClass = function(el, name) {
        return el.classList.contains(name);
    };

    exports.addCssClass = function(el, name) {
        el.classList.add(name);
    };

    exports.removeCssClass = function(el, name) {
        el.classList.remove(name);
    };

    exports.toggleCssClass = function(el, name) {
        return el.classList.toggle(name);
    };
}

/**
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
exports.setCssClass = function(node, className, include) {
    if (include) {
        exports.addCssClass(node, className);
    } else {
        exports.removeCssClass(node, className);
    }
};

exports.importCssString = function(cssText, doc){
    doc = doc || document;

    if (doc.createStyleSheet) {
        var sheet = doc.createStyleSheet();
        sheet.cssText = cssText;
    }
    else {
        var style = doc.createElementNS ?
                    doc.createElementNS(XHTML_NS, "style") :
                    doc.createElement("style");

        style.appendChild(doc.createTextNode(cssText));

        var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
        head.appendChild(style);
    }
};

exports.getInnerWidth = function(element) {
    return (parseInt(exports.computedStyle(element, "paddingLeft"))
            + parseInt(exports.computedStyle(element, "paddingRight")) + element.clientWidth);
};

exports.getInnerHeight = function(element) {
    return (parseInt(exports.computedStyle(element, "paddingTop"))
            + parseInt(exports.computedStyle(element, "paddingBottom")) + element.clientHeight);
};

if (window.pageYOffset !== undefined) {
    exports.getPageScrollTop = function() {
        return window.pageYOffset;
    };

    exports.getPageScrollLeft = function() {
        return window.pageXOffset;
    };
}
else {
    exports.getPageScrollTop = function() {
        return document.body.scrollTop;
    };

    exports.getPageScrollLeft = function() {
        return document.body.scrollLeft;
    };
}

exports.computedStyle = function(element, style) {
    if (window.getComputedStyle) {
        return (window.getComputedStyle(element, "") || {})[style] || "";
    }
    else {
        return element.currentStyle[style];
    }
};

exports.scrollbarWidth = function() {

    var inner = exports.createElement("p");
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = exports.createElement("div");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.height = "150px";

    outer.appendChild(inner);

    var body = document.body || document.documentElement;
    body.appendChild(outer);

    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    body.removeChild(outer);

    return noScrollbar-withScrollbar;
};

/**
 * Optimized set innerHTML. This is faster than plain innerHTML if the element
 * already contains a lot of child elements.
 *
 * See http://blog.stevenlevithan.com/archives/faster-than-innerhtml for details
 */
exports.setInnerHtml = function(el, innerHtml) {
    var element = el.cloneNode(false);//document.createElement("div");
    element.innerHTML = innerHtml;
    el.parentNode.replaceChild(element, el);
    return element;
};

exports.setInnerText = function(el, innerText) {
    if (document.body && "textContent" in document.body)
        el.textContent = innerText;
    else
        el.innerText = innerText;

};

exports.getInnerText = function(el) {
    if (document.body && "textContent" in document.body)
        return el.textContent;
    else
         return el.innerText || el.textContent || "";
};

exports.getParentWindow = function(document) {
    return document.defaultView || document.parentWindow;
};

exports.getSelectionStart = function(textarea) {
    // TODO IE
    var start;
    try {
        start = textarea.selectionStart || 0;
    } catch (e) {
        start = 0;
    }
    return start;
};

exports.setSelectionStart = function(textarea, start) {
    // TODO IE
    return textarea.selectionStart = start;
};

exports.getSelectionEnd = function(textarea) {
    // TODO IE
    var end;
    try {
        end = textarea.selectionEnd || 0;
    } catch (e) {
        end = 0;
    }
    return end;
};

exports.setSelectionEnd = function(textarea, end) {
    // TODO IE
    return textarea.selectionEnd = end;
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/editor'), ['pilot/fixoldbrowsers','pilot/oop','pilot/event','pilot/lang','pilot/useragent','ace/keyboard/textinput','ace/mouse_handler','ace/keyboard/keybinding','ace/edit_session','ace/search','ace/range','pilot/event_emitter'], function (require, exports, module) {


require("pilot/fixoldbrowsers");

var oop = require("pilot/oop");
var event = require("pilot/event");
var lang = require("pilot/lang");
var useragent = require("pilot/useragent");
var TextInput = require("ace/keyboard/textinput").TextInput;
var MouseHandler = require("ace/mouse_handler").MouseHandler;
//var TouchHandler = require("ace/touch_handler").TouchHandler;
var KeyBinding = require("ace/keyboard/keybinding").KeyBinding;
var EditSession = require("ace/edit_session").EditSession;
var Search = require("ace/search").Search;
var Range = require("ace/range").Range;
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Editor =function(renderer, session) {
    var container = renderer.getContainerElement();
    this.container = container;
    this.renderer = renderer;

    this.textInput  = new TextInput(renderer.getTextAreaContainer(), this);
    this.keyBinding = new KeyBinding(this);

    // TODO detect touch event support
    if (useragent.isIPad) {
        //this.$mouseHandler = new TouchHandler(this);
    } else {
        this.$mouseHandler = new MouseHandler(this);
    }

    this.$blockScrolling = 0;
    this.$search = new Search().set({
        wrap: true
    });

    this.setSession(session || new EditSession(""));
};

(function(){

    oop.implement(this, EventEmitter);

    this.$forwardEvents = {
        gutterclick: 1,
        gutterdblclick: 1
    };

    this.$originalAddEventListener = this.addEventListener;
    this.$originalRemoveEventListener = this.removeEventListener;

    this.addEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.addEventListener(eventName, callback);
        } else {
            return this.$originalAddEventListener(eventName, callback);
        }
    };

    this.removeEventListener = function(eventName, callback) {
        if (this.$forwardEvents[eventName]) {
            return this.renderer.removeEventListener(eventName, callback);
        } else {
            return this.$originalRemoveEventListener(eventName, callback);
        }
    };

    this.setKeyboardHandler = function(keyboardHandler) {
        this.keyBinding.setKeyboardHandler(keyboardHandler);
    };

    this.getKeyboardHandler = function() {
        return this.keyBinding.getKeyboardHandler();
    };

    this.setSession = function(session) {
        if (this.session == session) return;

        if (this.session) {
            var oldSession = this.session;
            this.session.removeEventListener("change", this.$onDocumentChange);
            this.session.removeEventListener("changeMode", this.$onChangeMode);
            this.session.removeEventListener("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.removeEventListener("changeTabSize", this.$onChangeTabSize);
            this.session.removeEventListener("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.removeEventListener("changeWrapMode", this.$onChangeWrapMode);
            this.session.removeEventListener("onChangeFold", this.$onChangeFold);
            this.session.removeEventListener("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.removeEventListener("changeBackMarker", this.$onChangeBackMarker);
            this.session.removeEventListener("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.removeEventListener("changeAnnotation", this.$onChangeAnnotation);
            this.session.removeEventListener("changeOverwrite", this.$onCursorChange);

            var selection = this.session.getSelection();
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);

            this.session.setScrollTopRow(this.renderer.getScrollTopRow());
        }

        this.session = session;

        this.$onDocumentChange = this.onDocumentChange.bind(this);
        session.addEventListener("change", this.$onDocumentChange);
        this.renderer.setSession(session);

        this.$onChangeMode = this.onChangeMode.bind(this);
        session.addEventListener("changeMode", this.$onChangeMode);

        this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
        session.addEventListener("tokenizerUpdate", this.$onTokenizerUpdate);

        this.$onChangeTabSize = this.renderer.updateText.bind(this.renderer);
        session.addEventListener("changeTabSize", this.$onChangeTabSize);

        this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
        session.addEventListener("changeWrapLimit", this.$onChangeWrapLimit);

        this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
        session.addEventListener("changeWrapMode", this.$onChangeWrapMode);

        this.$onChangeFold = this.onChangeFold.bind(this);
        session.addEventListener("changeFold", this.$onChangeFold);

        this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
        this.session.addEventListener("changeFrontMarker", this.$onChangeFrontMarker);

        this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
        this.session.addEventListener("changeBackMarker", this.$onChangeBackMarker);

        this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
        this.session.addEventListener("changeBreakpoint", this.$onChangeBreakpoint);

        this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
        this.session.addEventListener("changeAnnotation", this.$onChangeAnnotation);

        this.$onCursorChange = this.onCursorChange.bind(this);
        this.session.addEventListener("changeOverwrite", this.$onCursorChange);

        this.selection = session.getSelection();
        this.selection.addEventListener("changeCursor", this.$onCursorChange);

        this.$onSelectionChange = this.onSelectionChange.bind(this);
        this.selection.addEventListener("changeSelection", this.$onSelectionChange);

        this.onChangeMode();

        this.onCursorChange();
        this.onSelectionChange();
        this.onChangeFrontMarker();
        this.onChangeBackMarker();
        this.onChangeBreakpoint();
        this.onChangeAnnotation();
        this.renderer.scrollToRow(session.getScrollTopRow());
        this.renderer.updateFull();

        this._dispatchEvent("changeSession", {
            session: session,
            oldSession: oldSession
        });
    };

    this.getSession = function() {
        return this.session;
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.resize = function() {
        this.renderer.onResize();
    };

    this.setTheme = function(theme) {
        this.renderer.setTheme(theme);
    };

    this.setStyle = function(style) {
        this.renderer.setStyle(style)
    };

    this.unsetStyle = function(style) {
        this.renderer.unsetStyle(style)
    }

    this.$highlightBrackets = function() {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }

        // perform highlight async to not block the browser during navigation
        var self = this;
        this.$highlightPending = true;
        setTimeout(function() {
            self.$highlightPending = false;

            var pos = self.session.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                var range = new Range(pos.row, pos.column, pos.row, pos.column+1);
                self.session.$bracketHighlight = self.session.addMarker(range, "ace_bracket");
            }
        }, 10);
    };

    this.focus = function() {
        // Safari needs the timeout
        // iOS and Firefox need it called immediately
        // to be on the save side we do both
        // except for IE
        var _self = this;
        if (!useragent.isIE) {
            setTimeout(function() {
                _self.textInput.focus();
            });
        }
        this.textInput.focus();
    };

    this.blur = function() {
        this.textInput.blur();
    };

    this.onFocus = function() {
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._dispatchEvent("focus");
    };

    this.onBlur = function() {
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._dispatchEvent("blur");
    };

    this.onDocumentChange = function(e) {
        var delta = e.data;
        var range = delta.range;

        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            var lastRow = range.end.row;
        else
            lastRow = Infinity;
        this.renderer.updateLines(range.start.row, lastRow);

        // update cursor because tab characters can influence the cursor position
        this.renderer.updateCursor();
    };

    this.onTokenizerUpdate = function(e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    this.onCursorChange = function(e) {
        this.renderer.updateCursor();

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }

        // move text input over the cursor
        // this is required for iOS and IME
        this.renderer.moveTextAreaToCursor(this.textInput.getElement());

        this.$highlightBrackets();
        this.$updateHighlightActiveLine();
    };

    this.$updateHighlightActiveLine = function() {
        var session = this.getSession();

        if (session.$highlightLineMarker) {
            session.removeMarker(session.$highlightLineMarker);
        }
        session.$highlightLineMarker = null;

        if (this.getHighlightActiveLine() && (this.getSelectionStyle() != "line" || !this.selection.isMultiLine())) {
            var cursor = this.getCursorPosition(),
                foldLine = this.session.getFoldLine(cursor.row);
            var range;
            if (foldLine) {
                range = new Range(foldLine.start.row, 0, foldLine.end.row + 1, 0);
            } else {
                range = new Range(cursor.row, 0, cursor.row+1, 0);
            }
            session.$highlightLineMarker = session.addMarker(range, "ace_active_line", "line");
        }
    };

    this.onSelectionChange = function(e) {
        var session = this.getSession();

        if (session.$selectionMarker) {
            session.removeMarker(session.$selectionMarker);
        }
        session.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        }

        this.onCursorChange(e);

        if (this.$highlightSelectedWord)
            this.session.getMode().highlightSelection(this);
    };

    this.onChangeFrontMarker = function() {
        this.renderer.updateFrontMarkers();
    };

    this.onChangeBackMarker = function() {
        this.renderer.updateBackMarkers();
    };

    this.onChangeBreakpoint = function() {
        this.renderer.setBreakpoints(this.session.getBreakpoints());
    };

    this.onChangeAnnotation = function() {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };

    this.onChangeMode = function() {
        this.renderer.updateText()
    };

    this.onChangeWrapLimit = function() {
        this.renderer.updateFull();
    };

    this.onChangeWrapMode = function() {
        this.renderer.onResize(true);
    };

    this.onChangeFold = function() {
        // TODO: This might be too much updating. Okay for now.
        this.renderer.updateFull();
    };

    this.getCopyText = function() {
        if (!this.selection.isEmpty()) {
            return this.session.getTextRange(this.getSelectionRange());
        }
        else {
            return "";
        }
    };

    this.onCut = function() {
        if (this.$readOnly)
            return;

        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange())
            this.clearSelection();
        }
    };

    this.insert = function(text) {
        if (this.$readOnly)
            return;

        var session = this.session;
        var mode = session.getMode();

        var cursor = this.getCursorPosition();
        text = text.replace("\t", this.session.getTabString());

        // remove selected text
        if (!this.selection.isEmpty()) {
            var cursor = this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }
        else if (this.session.getOverwrite()) {
            var range = new Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        this.clearSelection();

        var lineState     = session.getState(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, session.getLine(cursor.row), text);
        var line          = session.getLine(cursor.row);
        var lineIndent    = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
        var end           = session.insert(cursor, text);

        var lineState = session.getState(cursor.row);

        // TODO disabled multiline auto indent
        // possibly doing the indent before inserting the text
        // if (cursor.row !== end.row) {
        if (session.getDocument().isNewLine(text)) {
            this.moveCursorTo(cursor.row+1, 0);

            var size = session.getTabSize();
            var minIndent = Number.MAX_VALUE;

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var indent = 0;

                line = session.getLine(row);
                for (var i = 0; i < line.length; ++i)
                    if (line.charAt(i) == '\t')
                        indent += size;
                    else if (line.charAt(i) == ' ')
                        indent += 1;
                    else
                        break;
                if (/[^\s]/.test(line))
                    minIndent = Math.min(indent, minIndent);
            }

            for (var row = cursor.row + 1; row <= end.row; ++row) {
                var outdent = minIndent;

                line = session.getLine(row);
                for (var i = 0; i < line.length && outdent > 0; ++i)
                    if (line.charAt(i) == '\t')
                        outdent -= size;
                    else if (line.charAt(i) == ' ')
                        outdent -= 1;
                session.remove(new Range(row, 0, row, i));
            }
            session.indentRows(cursor.row + 1, end.row, lineIndent);
        } else {
            if (shouldOutdent) {
                mode.autoOutdent(lineState, session, cursor.row);
            }
        };
    }

    this.onTextInput = function(text) {
        this.keyBinding.onTextInput(text);
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };

    this.setOverwrite = function(overwrite) {
        this.session.setOverwrite(overwrite);
    };

    this.getOverwrite = function() {
        return this.session.getOverwrite();
    };

    this.toggleOverwrite = function() {
        this.session.toggleOverwrite();
    };

    this.setScrollSpeed = function(speed) {
        this.$mouseHandler.setScrollSpeed(speed);
    };

    this.getScrollSpeed = function() {
        return this.$mouseHandler.getScrollSpeed()
    };

    this.$selectionStyle = "line";
    this.setSelectionStyle = function(style) {
        if (this.$selectionStyle == style) return;

        this.$selectionStyle = style;
        this.onSelectionChange();
        this._dispatchEvent("changeSelectionStyle", {data: style});
    };

    this.getSelectionStyle = function() {
        return this.$selectionStyle;
    };

    this.$highlightActiveLine = true;
    this.setHighlightActiveLine = function(shouldHighlight) {
        if (this.$highlightActiveLine == shouldHighlight) return;

        this.$highlightActiveLine = shouldHighlight;
        this.$updateHighlightActiveLine();
    };

    this.getHighlightActiveLine = function() {
        return this.$highlightActiveLine;
    };

    this.$highlightSelectedWord = true;
    this.setHighlightSelectedWord = function(shouldHighlight) {
        if (this.$highlightSelectedWord == shouldHighlight)
            return;

        this.$highlightSelectedWord = shouldHighlight;
        if (shouldHighlight)
            this.session.getMode().highlightSelection(this);
        else
            this.session.getMode().clearSelectionHighlight(this);
    };

    this.getHighlightSelectedWord = function() {
        return this.$highlightSelectedWord;
    };

    this.setShowInvisibles = function(showInvisibles) {
        if (this.getShowInvisibles() == showInvisibles)
            return;

        this.renderer.setShowInvisibles(showInvisibles);
    };

    this.getShowInvisibles = function() {
        return this.renderer.getShowInvisibles();
    };

    this.setShowPrintMargin = function(showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };

    this.getShowPrintMargin = function() {
        return this.renderer.getShowPrintMargin();
    };

    this.setPrintMarginColumn = function(showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };

    this.getPrintMarginColumn = function() {
        return this.renderer.getPrintMarginColumn();
    };

    this.$readOnly = false;
    this.setReadOnly = function(readOnly) {
        this.$readOnly = readOnly;
    };

    this.getReadOnly = function() {
        return this.$readOnly;
    };

    this.removeRight = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty()) {
            this.selection.selectRight();
        }
        this.session.remove(this.getSelectionRange())
        this.clearSelection();
    };

    this.removeLeft = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.removeWordRight = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectWordRight();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.removeWordLeft = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.removeToLineStart = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectLineStart();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.removeToLineEnd = function() {
        if (this.$readOnly)
            return;

        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };

    this.splitLine = function() {
        if (this.$readOnly)
            return;

        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n");
        this.moveCursorToPosition(cursor);
    };

    this.transposeLetters = function() {
        if (this.$readOnly)
            return;

        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column == 0)
            return;

        var line = this.session.getLine(cursor.row);
        if (column < line.length) {
            var swap = line.charAt(column) + line.charAt(column-1);
            var range = new Range(cursor.row, column-1, cursor.row, column+1)
        }
        else {
            var swap = line.charAt(column-1) + line.charAt(column-2);
            var range = new Range(cursor.row, column-2, cursor.row, column)
        }
        this.session.replace(range, swap);
    };

    this.indent = function() {
        if (this.$readOnly)
            return;

        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row || range.start.column < range.end.column) {
            var rows = this.$getSelectedRows();
            session.indentRows(rows.first, rows.last, "\t");
        } else {
            var indentString;

            if (this.session.getUseSoftTabs()) {
                var size        = session.getTabSize(),
                    position    = this.getCursorPosition(),
                    column      = session.documentToScreenColumn(position.row, position.column),
                    count       = (size - column % size);

                indentString = lang.stringRepeat(" ", count);
            } else
                indentString = "\t";
            return this.onTextInput(indentString);
        }
    };

    this.blockOutdent = function() {
        if (this.$readOnly)
            return;

        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };

    this.toggleCommentLines = function() {
        if (this.$readOnly)
            return;

        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows()
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    this.removeLines = function() {
        if (this.$readOnly)
            return;

        var rows = this.$getSelectedRows();
        this.session.remove(new Range(rows.first, 0, rows.last+1, 0));
        this.clearSelection();
    };

    this.moveLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };

    this.moveLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    };

    this.moveText = function(range, toPosition) {
        if (this.$readOnly)
            return null;

        return this.session.moveText(range, toPosition);
    };

    this.copyLinesUp = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };

    this.copyLinesDown = function() {
        if (this.$readOnly)
            return;

        this.$moveLines(function(firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };


    this.$moveLines = function(mover) {
        var rows = this.$getSelectedRows();

        var linesMoved = mover.call(this, rows.first, rows.last);

        var selection = this.selection;
        selection.setSelectionAnchor(rows.last+linesMoved+1, 0);
        selection.$moveSelection(function() {
            selection.moveCursorTo(rows.first+linesMoved, 0);
        });
    };

    this.$getSelectedRows = function() {
        var range = this.getSelectionRange().collapseRows();

        return {
            first: range.start.row,
            last: range.end.row
        };
    };

    this.onCompositionStart = function(text) {
        this.renderer.showComposition(this.getCursorPosition());
    };

    this.onCompositionUpdate = function(text) {
        this.renderer.setCompositionText(text);
    };

    this.onCompositionEnd = function() {
        this.renderer.hideComposition();
    };


    this.getFirstVisibleRow = function() {
        return this.renderer.getFirstVisibleRow();
    };

    this.getLastVisibleRow = function() {
        return this.renderer.getLastVisibleRow();
    };

    this.isRowVisible = function(row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };

    this.$getVisibleRowCount = function() {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    };

    this.$getPageDownRow = function() {
        return this.renderer.getScrollBottomRow();
    };

    this.$getPageUpRow = function() {
        var firstRow = this.renderer.getScrollTopRow();
        var lastRow = this.renderer.getScrollBottomRow();

        return firstRow - (lastRow - firstRow);
    };

    this.selectPageDown = function() {
        var row = this.$getPageDownRow() + Math.floor(this.$getVisibleRowCount() / 2);

        this.scrollPageDown();

        var selection = this.getSelection();
        var leadScreenPos = this.session.documentToScreenPosition(selection.getSelectionLead());
        var dest = this.session.screenToDocumentPosition(row, leadScreenPos.column);
        selection.selectTo(dest.row, dest.column);
    };

    this.selectPageUp = function() {
        var visibleRows = this.renderer.getScrollTopRow() - this.renderer.getScrollBottomRow();
        var row = this.$getPageUpRow() + Math.round(visibleRows / 2);

        this.scrollPageUp();

        var selection = this.getSelection();
        var leadScreenPos = this.session.documentToScreenPosition(selection.getSelectionLead());
        var dest = this.session.screenToDocumentPosition(row, leadScreenPos.column);
        selection.selectTo(dest.row, dest.column);
    };

    this.gotoPageDown = function() {
        var row = this.$getPageDownRow();
        var column = this.getCursorPositionScreen().column;

        this.scrollToRow(row);
        this.getSelection().moveCursorToScreen(row, column);
    };

    this.gotoPageUp = function() {
        var row = this.$getPageUpRow();
        var column = this.getCursorPositionScreen().column;

       this.scrollToRow(row);
       this.getSelection().moveCursorToScreen(row, column);
    };

    this.scrollPageDown = function() {
        this.scrollToRow(this.$getPageDownRow());
    };

    this.scrollPageUp = function() {
        this.renderer.scrollToRow(this.$getPageUpRow());
    };

    this.scrollToRow = function(row) {
        this.renderer.scrollToRow(row);
    };

    this.scrollToLine = function(line, center) {
        this.renderer.scrollToLine(line, center);
    };

    this.centerSelection = function() {
        var range = this.getSelectionRange();
        var line = Math.floor(range.start.row + (range.end.row - range.start.row) / 2);
        this.renderer.scrollToLine(line, true);
    };

    this.getCursorPosition = function() {
        return this.selection.getCursor();
    };

    this.getCursorPositionScreen = function() {
        return this.session.documentToScreenPosition(this.getCursorPosition());
    };

    this.getSelectionRange = function() {
        return this.selection.getRange();
    };


    this.selectAll = function() {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    };

    this.clearSelection = function() {
        this.selection.clearSelection();
    };

    this.moveCursorTo = function(row, column) {
        this.selection.moveCursorTo(row, column);
    };

    this.moveCursorToPosition = function(pos) {
        this.selection.moveCursorToPosition(pos);
    };


    this.gotoLine = function(lineNumber, row) {
        this.selection.clearSelection();

        this.$blockScrolling += 1;
        this.moveCursorTo(lineNumber-1, row || 0);
        this.$blockScrolling -= 1;

        if (!this.isRowVisible(this.getCursorPosition().row)) {
            this.scrollToLine(lineNumber, true);
        }
    },

    this.navigateTo = function(row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };

    this.navigateUp = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(-times, 0);
    };

    this.navigateDown = function(times) {
        this.selection.clearSelection();
        times = times || 1;
        this.selection.moveCursorBy(times, 0);
    };

    this.navigateLeft = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };

    this.navigateRight = function(times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    };

    this.navigateLineStart = function() {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };

    this.navigateLineEnd = function() {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };

    this.navigateFileEnd = function() {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };

    this.navigateFileStart = function() {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };

    this.navigateWordRight = function() {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };

    this.navigateWordLeft = function() {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };

    this.replace = function(replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        this.$tryReplace(range, replacement);
        if (range !== null)
            this.selection.setSelectionRange(range);
    },

    this.replaceAll = function(replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return;

        var selection = this.getSelectionRange();
        this.clearSelection();
        this.selection.moveCursorTo(0, 0);

        this.$blockScrolling += 1;
        for (var i = ranges.length - 1; i >= 0; --i)
            this.$tryReplace(ranges[i], replacement);

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;
    },

    this.$tryReplace = function(range, replacement) {
        var input = this.session.getTextRange(range);
        var replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };

    this.getLastSearchOptions = function() {
        return this.$search.getOptions();
    };

    this.find = function(needle, options) {
        this.clearSelection();
        options = options || {};
        options.needle = needle;
        this.$search.set(options);
        this.$find();
    },

    this.findNext = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = false;
        this.$search.set(options);
        this.$find();
    };

    this.findPrevious = function(options) {
        options = options || {};
        if (typeof options.backwards == "undefined")
            options.backwards = true;
        this.$search.set(options);
        this.$find();
    };

    this.$find = function(backwards) {
        if (!this.selection.isEmpty()) {
            this.$search.set({needle: this.session.getTextRange(this.getSelectionRange())});
        }

        if (typeof backwards != "undefined")
            this.$search.set({backwards: backwards});

        var range = this.$search.find(this.session);
        if (range) {
            this.gotoLine(range.end.row+1, range.end.column);
            this.selection.setSelectionRange(range);
        }
    };

    this.undo = function() {
        this.session.getUndoManager().undo();
    };

    this.redo = function() {
        this.session.getUndoManager().redo();
    };

}).call(Editor.prototype);


exports.Editor = Editor;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/textinput'), ['pilot/event','pilot/useragent','pilot/dom'], function (require, exports, module) {


var event = require("pilot/event");
var useragent = require("pilot/useragent");
var dom = require("pilot/dom");

var TextInput = function(parentNode, host) {

    var text = dom.createElement("textarea");
    text.style.left = "-10000px";
    parentNode.appendChild(text);

    var PLACEHOLDER = String.fromCharCode(0);
    sendText();

    var inCompostion = false;
    var copied = false;
    var tempStyle = '';

    function sendText(valueToSend) {
        if (!copied) {
            var value = valueToSend || text.value;
            if (value) {
                if (value.charCodeAt(value.length-1) == PLACEHOLDER.charCodeAt(0)) {
                    value = value.slice(0, -1);
                    if (value)
                        host.onTextInput(value);
                } else
                    host.onTextInput(value);
            }
        }
        copied = false;

        // Safari doesn't fire copy events if no text is selected
        text.value = PLACEHOLDER;
        text.select();
    }

    var onTextInput = function(e) {
        if (useragent.isIE && text.value.charCodeAt(0) > 128) return;
        setTimeout(function() {
            if (!inCompostion)
                sendText();
        }, 0);
    };

    var onCompositionStart = function(e) {
        inCompostion = true;
        if (!useragent.isIE) {
            sendText();
            text.value = "";
        };
        host.onCompositionStart();
        if (!useragent.isGecko) setTimeout(onCompositionUpdate, 0);
    };

    var onCompositionUpdate = function() {
        if (!inCompostion) return;
        host.onCompositionUpdate(text.value);
    };

    var onCompositionEnd = function() {
        inCompostion = false;
        host.onCompositionEnd();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    var onCopy = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText)
            text.value = copyText;
        else
            e.preventDefault();
        text.select();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    var onCut = function(e) {
        copied = true;
        var copyText = host.getCopyText();
        if(copyText) {
            text.value = copyText;
            host.onCut();
        } else
            e.preventDefault();
        text.select();
        setTimeout(function () {
            sendText();
        }, 0);
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));
    event.addListener(text, "keypress", onTextInput);
    if (useragent.isIE) {
        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inCompostion && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)|0) < 129) {
                return;
            };
            inCompostion ? onCompositionUpdate() : onCompositionStart();
        });
    };
    event.addListener(text, "textInput", onTextInput);
    event.addListener(text, "paste", function(e) {
        // Some browsers support the event.clipboardData API. Use this to get
        // the pasted content which increases speed if pasting a lot of lines.
        if (e.clipboardData && e.clipboardData.getData) {
            sendText(e.clipboardData.getData("text/plain"));
            e.preventDefault();
        } else
        // If a browser doesn't support any of the things above, use the regular
        // method to detect the pasted input.
        {
            onTextInput();
        }
    });
    if (!useragent.isIE) {
        event.addListener(text, "propertychange", onTextInput);
    };

    if (useragent.isIE) {
        event.addListener(text, "beforecopy", function(e) {        
            var copyText = host.getCopyText();
            if(copyText)
                clipboardData.setData("Text", copyText);
            else
                e.preventDefault();
        });
        event.addListener(parentNode, "keydown", function(e) {
            if (e.ctrlKey && e.keyCode == 88) {
                var copyText = host.getCopyText();
                if (copyText) {
                    clipboardData.setData("Text", copyText);
                    host.onCut();
                }
                event.preventDefault(e)
            }
        });
    }
    else {
        event.addListener(text, "copy", onCopy);
        event.addListener(text, "cut", onCut);
    }

    event.addListener(text, "compositionstart", onCompositionStart);
    if (useragent.isGecko) {
        event.addListener(text, "text", onCompositionUpdate);
    };
    if (useragent.isWebKit) {
        event.addListener(text, "keyup", onCompositionUpdate);
    };
    event.addListener(text, "compositionend", onCompositionEnd);

    event.addListener(text, "blur", function() {
        host.onBlur();
    });

    event.addListener(text, "focus", function() {
        host.onFocus();
        text.select();
    });

    this.focus = function() {
        host.onFocus();
        text.select();
        text.focus();
    };

    this.blur = function() {
        text.blur();
    };

    this.getElement = function() {
        return text;
    };

    this.onContextMenu = function(mousePos, isEmpty){
        if (mousePos) {
            if(!tempStyle)
                tempStyle = text.style.cssText;
            text.style.cssText = 'position:fixed; z-index:1000;' +
                    'left:' + (mousePos.x - 2) + 'px; top:' + (mousePos.y - 2) + 'px;'

        }
        if (isEmpty)
            text.value='';
    }

    this.onContextMenuClose = function(){
        setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            sendText();
        }, 0);
    }
};

exports.TextInput = TextInput;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mouse_handler'), ['pilot/event','pilot/dom'], function (require, exports, module) {


var event = require("pilot/event");
var dom = require("pilot/dom");

var STATE_UNKNOWN = 0;
var STATE_SELECT = 1;
var STATE_DRAG = 2;

var DRAG_TIMER = 250; // milliseconds
var DRAG_OFFSET = 5; // pixels

var MouseHandler = function(editor) {
    this.editor = editor;
    event.addListener(editor.container, "mousedown", function(e) {
        editor.focus();
        return event.preventDefault(e);
    });
    event.addListener(editor.container, "selectstart", function(e) {
        return event.preventDefault(e);
    });
    
    var mouseTarget = editor.renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "mousedown", this.onMouseDown.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseTripleClick.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 4, 600, this.onMouseQuadClick.bind(this));
    event.addMouseWheelListener(mouseTarget, this.onMouseWheel.bind(this));
};

(function() {

    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    };
    
    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    };

    this.$getEventPosition = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);
        var pos = this.editor.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, this.editor.session.getLength()-1));
        return pos;
    };

    this.$distance = function(ax, ay, bx, by) {
        return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    };

    this.onMouseDown = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);
        var pos = this.$getEventPosition(e);
        var editor = this.editor;
        var self = this;
        var selectionRange = editor.getSelectionRange();
        var selectionEmpty = selectionRange.isEmpty();
        var state = STATE_UNKNOWN;
        var inSelection = false;
    
        var button = event.getButton(e);
        if (button !== 0) {
            if (selectionEmpty) {
                editor.moveCursorToPosition(pos);
            }
            if(button == 2) {
                editor.textInput.onContextMenu({x: pageX, y: pageY}, selectionEmpty);
                event.capture(editor.container, function(){}, editor.textInput.onContextMenuClose);
            }
            return;
        } else {
            inSelection = !editor.getReadOnly()
                && !selectionEmpty
                && selectionRange.contains(pos.row, pos.column);
        }

        if (!inSelection) {
            // Directly pick STATE_SELECT, since the user is not clicking inside
            // a selection.
            onStartSelect(pos);
        }

        editor.renderer.scrollCursorIntoView();
    
        var mousePageX, mousePageY;
        var overwrite = editor.getOverwrite();
        var mousedownTime = (new Date()).getTime();
        var dragCursor, dragRange;
    
        var onMouseSelection = function(e) {
            mousePageX = event.getDocumentX(e);
            mousePageY = event.getDocumentY(e);
        };
    
        var onMouseSelectionEnd = function() {
            clearInterval(timerId);
            if (state == STATE_UNKNOWN)
                onStartSelect(pos);
            else if (state == STATE_DRAG)
                onMouseDragSelectionEnd();
                
            self.$clickSelection = null;
            state = STATE_UNKNOWN;
        };

        var onMouseDragSelectionEnd = function() {
            dom.removeCssClass(editor.container, "ace_dragging");
            editor.session.removeMarker(dragSelectionMarker);

            if (!self.$clickSelection) {
                if (!dragCursor) {
                    editor.moveCursorToPosition(pos);
                    editor.selection.clearSelection(pos.row, pos.column);
                }
            }

            if (!dragCursor)
                return;

            if (dragRange.contains(dragCursor.row, dragCursor.column)) {
                dragCursor = null;
                return;
            }

            editor.clearSelection();
            var newRange = editor.moveText(dragRange, dragCursor);
            if (!newRange) {
                dragCursor = null;
                return;
            }

            editor.selection.setSelectionRange(newRange);
        };
    
        var onSelectionInterval = function() {
            if (mousePageX === undefined || mousePageY === undefined)
                return;

            if (state == STATE_UNKNOWN) {
                var distance = self.$distance(pageX, pageY, mousePageX, mousePageY);
                var time = (new Date()).getTime();

                
                if (distance > DRAG_OFFSET) {
                    state = STATE_SELECT;
                    var cursor = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
                    cursor.row = Math.max(0, Math.min(cursor.row, editor.session.getLength()-1));
                    onStartSelect(cursor);
                } else if ((time - mousedownTime) > DRAG_TIMER) {
                    state = STATE_DRAG;
                    dragRange = editor.getSelectionRange();
                    var style = editor.getSelectionStyle();
                    dragSelectionMarker = editor.session.addMarker(dragRange, "ace_selection", style);
                    editor.clearSelection();
                    dom.addCssClass(editor.container, "ace_dragging");
                }

            }
            
            if (state == STATE_DRAG)
                onDragSelectionInterval();
            else if (state == STATE_SELECT)
                onUpdateSelectionInterval();
        };
    
        function onStartSelect(pos) {
            if (e.shiftKey)
                editor.selection.selectToPosition(pos)
            else {
                if (!self.$clickSelection) {
                    editor.moveCursorToPosition(pos);
                    editor.selection.clearSelection(pos.row, pos.column);
                }
            }
            state = STATE_SELECT;
        }
        
        var onUpdateSelectionInterval = function() {
            var cursor = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
            cursor.row = Math.max(0, Math.min(cursor.row, editor.session.getLength()-1));
    
            if (self.$clickSelection) {                
                if (self.$clickSelection.contains(cursor.row, cursor.column)) {
                    editor.selection.setSelectionRange(self.$clickSelection);
                } else {
                    if (self.$clickSelection.compare(cursor.row, cursor.column) == -1) {
                        var anchor = self.$clickSelection.end;
                    } else {
                        var anchor = self.$clickSelection.start;
                    }
                    editor.selection.setSelectionAnchor(anchor.row, anchor.column);
                    editor.selection.selectToPosition(cursor);
                }
            }
            else {
                editor.selection.selectToPosition(cursor);
            }
    
            editor.renderer.scrollCursorIntoView();
        };

        var onDragSelectionInterval = function() {
            dragCursor = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
            dragCursor.row = Math.max(0, Math.min(dragCursor.row,
                                                  editor.session.getLength() - 1));

            editor.moveCursorToPosition(dragCursor);
        };

        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);
    
        return event.preventDefault(e);
    };
    
    this.onMouseDoubleClick = function(e) {
        var pos = this.$getEventPosition(e);
        this.editor.moveCursorToPosition(pos);
        this.editor.selection.selectWord();
        this.$clickSelection = this.editor.getSelectionRange();
    };
    
    this.onMouseTripleClick = function(e) {
        var pos = this.$getEventPosition(e);
        this.editor.moveCursorToPosition(pos);
        this.editor.selection.selectLine();
        this.$clickSelection = this.editor.getSelectionRange();
    };
    
    this.onMouseQuadClick = function(e) {
        this.editor.selectAll();
        this.$clickSelection = this.editor.getSelectionRange();
    };
    
    this.onMouseWheel = function(e) {
        var speed = this.$scrollSpeed * 2;
    
        this.editor.renderer.scrollBy(e.wheelX * speed, e.wheelY * speed);
        return event.preventDefault(e);
    };


}).call(MouseHandler.prototype);

exports.MouseHandler = MouseHandler;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/keybinding'), ['pilot/useragent','pilot/keys','pilot/event','pilot/settings','pilot/canon','ace/commands/default_commands'], function (require, exports, module) {


var useragent = require("pilot/useragent");
var keyUtil  = require("pilot/keys");
var event = require("pilot/event");
var settings  = require("pilot/settings").settings;
var canon = require("pilot/canon");
require("ace/commands/default_commands");

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = { };
    this.$keyboardHandler = null;
};

(function() {
    this.setKeyboardHandler = function(keyboardHandler) {
        if (this.$keyboardHandler != keyboardHandler) {
            this.$data = { };
            this.$keyboardHandler = keyboardHandler;
        }
    };

    this.getKeyboardHandler = function() {
        return this.$keyboardHandler;
    };

    this.$callKeyboardHandler = function (e, hashId, keyOrText, keyCode) {
        var env = {editor: this.$editor},
            toExecute;

        if (this.$keyboardHandler) {
            toExecute =
                this.$keyboardHandler.handleKeyboard(this.$data, hashId, keyOrText, keyCode, e);
        }

        // If there is nothing to execute yet, then use the default keymapping.
        if (!toExecute || !toExecute.command) {
            if (hashId != 0 || keyCode != 0) {
                toExecute = {
                    command: canon.findKeyCommand(env, "editor", hashId, keyOrText)
                }
            } else {
                toExecute = {
                    command: "inserttext",
                    args: {
                        text: keyOrText
                    }
                }
            }
        }

        if (toExecute) {
            var success = canon.exec(toExecute.command,
                                        env, "editor", toExecute.args);
            if (success) {
                return event.stopEvent(e);
            }
        }
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        this.$callKeyboardHandler(e, hashId, keyString, keyCode);
    };

    this.onTextInput = function(text) {
        this.$callKeyboardHandler({}, 0, text, 0);
    }

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/commands/default_commands'), ['pilot/lang','pilot/canon'], function (require, exports, module) {


var lang = require("pilot/lang");
var canon = require("pilot/canon");

function bindKey(win, mac) {
    return {
        win: win,
        mac: mac,
        sender: "editor"
    };
}

canon.addCommand({
    name: "null",
    exec: function(env, args, request) {  }
});

canon.addCommand({
    name: "selectall",
    bindKey: bindKey("Ctrl-A", "Command-A"),
    exec: function(env, args, request) { env.editor.selectAll(); }
});
canon.addCommand({
    name: "removeline",
    bindKey: bindKey("Ctrl-D", "Command-D"),
    exec: function(env, args, request) { env.editor.removeLines(); }
});
canon.addCommand({
    name: "gotoline",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function(env, args, request) {
        var line = parseInt(prompt("Enter line number:"));
        if (!isNaN(line)) {
            env.editor.gotoLine(line);
        }
    }
});
canon.addCommand({
    name: "togglecomment",
    bindKey: bindKey("Ctrl-7", "Command-7"),
    exec: function(env, args, request) { env.editor.toggleCommentLines(); }
});
canon.addCommand({
    name: "findnext",
    bindKey: bindKey("Ctrl-K", "Command-G"),
    exec: function(env, args, request) { env.editor.findNext(); }
});
canon.addCommand({
    name: "findprevious",
    bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
    exec: function(env, args, request) { env.editor.findPrevious(); }
});
canon.addCommand({
    name: "find",
    bindKey: bindKey("Ctrl-F", "Command-F"),
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        env.editor.find(needle);
    }
});
canon.addCommand({
    name: "replace",
    bindKey: bindKey("Ctrl-R", "Command-Option-F"),
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        env.editor.replace(replacement, {needle: needle});
    }
});
canon.addCommand({
    name: "replaceall",
    bindKey: bindKey("Ctrl-Shift-R", "Command-Shift-Option-F"),
    exec: function(env, args, request) {
        var needle = prompt("Find:");
        if (!needle)
            return;
        var replacement = prompt("Replacement:");
        if (!replacement)
            return;
        env.editor.replaceAll(replacement, {needle: needle});
    }
});
canon.addCommand({
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function(env, args, request) { env.editor.undo(); }
});
canon.addCommand({
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function(env, args, request) { env.editor.redo(); }
});
canon.addCommand({
    name: "overwrite",
    bindKey: bindKey("Insert", "Insert"),
    exec: function(env, args, request) { env.editor.toggleOverwrite(); }
});
canon.addCommand({
    name: "copylinesup",
    bindKey: bindKey("Ctrl-Alt-Up", "Command-Option-Up"),
    exec: function(env, args, request) { env.editor.copyLinesUp(); }
});
canon.addCommand({
    name: "movelinesup",
    bindKey: bindKey("Alt-Up", "Option-Up"),
    exec: function(env, args, request) { env.editor.moveLinesUp(); }
});
canon.addCommand({
    name: "selecttostart",
    bindKey: bindKey("Alt-Shift-Up", "Command-Shift-Up"),
    exec: function(env, args, request) { env.editor.getSelection().selectFileStart(); }
});
canon.addCommand({
    name: "gotostart",
    bindKey: bindKey("Ctrl-Home|Ctrl-Up", "Command-Home|Command-Up"),
    exec: function(env, args, request) { env.editor.navigateFileStart(); }
});
canon.addCommand({
    name: "selectup",
    bindKey: bindKey("Shift-Up", "Shift-Up"),
    exec: function(env, args, request) { env.editor.getSelection().selectUp(); }
});
canon.addCommand({
    name: "golineup",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function(env, args, request) { env.editor.navigateUp(args.times); }
});
canon.addCommand({
    name: "copylinesdown",
    bindKey: bindKey("Ctrl-Alt-Down", "Command-Option-Down"),
    exec: function(env, args, request) { env.editor.copyLinesDown(); }
});
canon.addCommand({
    name: "movelinesdown",
    bindKey: bindKey("Alt-Down", "Option-Down"),
    exec: function(env, args, request) { env.editor.moveLinesDown(); }
});
canon.addCommand({
    name: "selecttoend",
    bindKey: bindKey("Alt-Shift-Down", "Command-Shift-Down"),
    exec: function(env, args, request) { env.editor.getSelection().selectFileEnd(); }
});
canon.addCommand({
    name: "gotoend",
    bindKey: bindKey("Ctrl-End|Ctrl-Down", "Command-End|Command-Down"),
    exec: function(env, args, request) { env.editor.navigateFileEnd(); }
});
canon.addCommand({
    name: "selectdown",
    bindKey: bindKey("Shift-Down", "Shift-Down"),
    exec: function(env, args, request) { env.editor.getSelection().selectDown(); }
});
canon.addCommand({
    name: "golinedown",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function(env, args, request) { env.editor.navigateDown(args.times); }
});
canon.addCommand({
    name: "selectwordleft",
    bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
    exec: function(env, args, request) { env.editor.getSelection().selectWordLeft(); }
});
canon.addCommand({
    name: "gotowordleft",
    bindKey: bindKey("Ctrl-Left", "Option-Left"),
    exec: function(env, args, request) { env.editor.navigateWordLeft(); }
});
canon.addCommand({
    name: "selecttolinestart",
    bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "gotolinestart",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function(env, args, request) { env.editor.navigateLineStart(); }
});
canon.addCommand({
    name: "selectleft",
    bindKey: bindKey("Shift-Left", "Shift-Left"),
    exec: function(env, args, request) { env.editor.getSelection().selectLeft(); }
});
canon.addCommand({
    name: "gotoleft",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function(env, args, request) { env.editor.navigateLeft(args.times); }
});
canon.addCommand({
    name: "selectwordright",
    bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
    exec: function(env, args, request) { env.editor.getSelection().selectWordRight(); }
});
canon.addCommand({
    name: "gotowordright",
    bindKey: bindKey("Ctrl-Right", "Option-Right"),
    exec: function(env, args, request) { env.editor.navigateWordRight(); }
});
canon.addCommand({
    name: "selecttolineend",
    bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "gotolineend",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function(env, args, request) { env.editor.navigateLineEnd(); }
});
canon.addCommand({
    name: "selectright",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function(env, args, request) { env.editor.getSelection().selectRight(); }
});
canon.addCommand({
    name: "gotoright",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function(env, args, request) { env.editor.navigateRight(args.times); }
});
canon.addCommand({
    name: "selectpagedown",
    bindKey: bindKey("Shift-PageDown", "Shift-PageDown"),
    exec: function(env, args, request) { env.editor.selectPageDown(); }
});
canon.addCommand({
    name: "pagedown",
    bindKey: bindKey(null, "PageDown"),
    exec: function(env, args, request) { env.editor.scrollPageDown(); }
});
canon.addCommand({
    name: "gotopagedown",
    bindKey: bindKey("PageDown", "Option-PageDown|Ctrl-V"),
    exec: function(env, args, request) { env.editor.gotoPageDown(); }
});
canon.addCommand({
    name: "selectpageup",
    bindKey: bindKey("Shift-PageUp", "Shift-PageUp"),
    exec: function(env, args, request) { env.editor.selectPageUp(); }
});
canon.addCommand({
    name: "pageup",
    bindKey: bindKey(null, "PageUp"),
    exec: function(env, args, request) { env.editor.scrollPageUp(); }
});
canon.addCommand({
    name: "gotopageup",
    bindKey: bindKey("PageUp", "Option-PageUp"),
    exec: function(env, args, request) { env.editor.gotoPageUp(); }
});
canon.addCommand({
    name: "selectlinestart",
    bindKey: bindKey("Shift-Home", "Shift-Home"),
    exec: function(env, args, request) { env.editor.getSelection().selectLineStart(); }
});
canon.addCommand({
    name: "selectlineend",
    bindKey: bindKey("Shift-End", "Shift-End"),
    exec: function(env, args, request) { env.editor.getSelection().selectLineEnd(); }
});
canon.addCommand({
    name: "del",
    bindKey: bindKey("Delete", "Delete|Ctrl-D"),
    exec: function(env, args, request) { env.editor.removeRight(); }
});
canon.addCommand({
    name: "backspace",
    bindKey: bindKey(
        "Ctrl-Backspace|Command-Backspace|Option-Backspace|Shift-Backspace|Backspace",
        "Ctrl-Backspace|Command-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function(env, args, request) { env.editor.removeLeft(); }
});
canon.addCommand({
    name: "removetolinestart",
    bindKey: bindKey(null, "Option-Backspace"),
    exec: function(env, args, request) { env.editor.removeToLineStart(); }
});
canon.addCommand({
    name: "removetolineend",
    bindKey: bindKey(null, "Ctrl-K"),
    exec: function(env, args, request) { env.editor.removeToLineEnd(); }
});
canon.addCommand({
    name: "removewordleft",
    bindKey: bindKey(null, "Alt-Backspace|Ctrl-Alt-Backspace"),
    exec: function(env, args, request) { env.editor.removeWordLeft(); }
});
canon.addCommand({
    name: "removewordright",
    bindKey: bindKey(null, "Alt-Delete"),
    exec: function(env, args, request) { env.editor.removeWordRight(); }
});
canon.addCommand({
    name: "outdent",
    bindKey: bindKey("Shift-Tab", "Shift-Tab"),
    exec: function(env, args, request) { env.editor.blockOutdent(); }
});
canon.addCommand({
    name: "indent",
    bindKey: bindKey("Tab", "Tab"),
    exec: function(env, args, request) { env.editor.indent(); }
});
canon.addCommand({
    name: "inserttext",
    exec: function(env, args, request) {
        env.editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    }
});
canon.addCommand({
    name: "centerselection",
    bindKey: bindKey(null, "Ctrl-L"),
    exec: function(env, args, request) { env.editor.centerSelection(); }
});
canon.addCommand({
    name: "splitline",
    bindKey: bindKey(null, "Ctrl-O"),
    exec: function(env, args, request) { env.editor.splitLine(); }
});
canon.addCommand({
    name: "transposeletters",
    bindKey: bindKey("Ctrl-T", "Ctrl-T"),
    exec: function(env, args, request) { env.editor.transposeLetters(); }
});

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/edit_session'), ['pilot/oop','pilot/lang','pilot/event_emitter','ace/selection','ace/mode/text','ace/range','ace/document','ace/background_tokenizer','ace/edit_session/folding'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Selection = require("ace/selection").Selection;
var TextMode = require("ace/mode/text").Mode;
var Range = require("ace/range").Range;
var Document = require("ace/document").Document;
var BackgroundTokenizer = require("ace/background_tokenizer").BackgroundTokenizer;

var EditSession = function(text, mode) {
    this.$modified = true;
    this.$breakpoints = [];
    this.$frontMarkers = {};
    this.$backMarkers = {};
    this.$markerId = 1;
    this.$rowCache = [];
    this.$rowCacheSize = 1000;
    this.$wrapData = [];
    this.$foldData = [];
    this.$foldData.toString = function() {
        var str = "";
        this.forEach(function(foldLine) {
            str += "\n" + foldLine.toString();
        });
        return str;
    }
    this.$docChangeCounter = 0;

    if (text instanceof Document) {
        this.setDocument(text);
    } else {
        this.setDocument(new Document(text));
    }

    this.selection = new Selection(this);
    if (mode)
        this.setMode(mode);
    else
        this.setMode(new TextMode());
};


(function() {

    oop.implement(this, EventEmitter);

    this.setDocument = function(doc) {
        if (this.doc)
            throw new Error("Document is already set");

        this.doc = doc;
        doc.on("change", this.onChange.bind(this));
        doc.on("changeStart", this.onChangeStart.bind(this));
        doc.on("changeEnd",   this.onChangeEnd.bind(this));
        this.on("changeFold", this.onChangeFold.bind(this));
    };

    this.getDocument = function() {
        return this.doc;
    };

    this.onChangeStart = function() {
        this.$docChangeCounter ++;
    };

    this.$resetRowCache = function(row) {
        if (row == 0) {
            this.$rowCache = [];
            return;
        }
        var rowCache = this.$rowCache;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow >= row) {
                rowCache.splice(i, rowCache.length);
                return;
            }
        }
    }

    this.onChangeEnd = function() {
        this.$docChangeCounter --;
        if (this.$docChangeCounter == 0
            && !this.$fromUndo && this.$undoManager)
        {
            if (this.$deltasFold.length) {
                this.$deltas.push({
                    group: "fold",
                    deltas: this.$deltasFold
                });
                this.$deltasFold = [];
            }
            if (this.$deltasDoc) {
                this.$deltas.push({
                    group: "doc",
                    deltas: this.$deltasDoc
                });
                this.$deltasDoc = [];
            }
            this.$informUndoManager.schedule();
        }
    };

    this.onChangeFold = function(e) {
        var fold = e.data;
        this.$resetRowCache(fold.start.row);
    };

    this.onChange = function(e) {
        var delta = e.data;
        this.$modified = true;

        this.$resetRowCache(delta.range.start.row);

        var removedFolds = this.$updateInternalDataOnChange(e);
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltasDoc.push(delta);
            if (removedFolds && removedFolds.length != 0) {
                this.$deltasFold.push({
                    action: "removeFolds",
                    folds:  removedFolds
                });
            }
        }

        this.bgTokenizer.start(delta.range.start.row);
        this._dispatchEvent("change", e);
    };

    this.setValue = function(text) {
        this.doc.setValue(text);
        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];
        this.getUndoManager().reset();
    };

    this.getValue =
    this.toString = function() {
        return this.doc.getValue();
    };

    this.getSelection = function() {
        return this.selection;
    };

    this.getState = function(row) {
        return this.bgTokenizer.getState(row);
    };

    this.getTokens = function(firstRow, lastRow) {
        return this.bgTokenizer.getTokens(firstRow, lastRow);
    };

    this.setUndoManager = function(undoManager) {
        this.$undoManager = undoManager;
        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];

        if (this.$informUndoManager) {
            this.$informUndoManager.cancel();
        }

        if (undoManager) {
            var self = this;
            this.$syncInformUndoManager = function() {
                self.$informUndoManager.cancel();
                if (self.$deltas.length > 0)
                    undoManager.execute({
                        action : "aceupdate",
                        args   : [self.$deltas, self]
                    });
                self.$deltas = [];
            }
            this.$informUndoManager =
                lang.deferredCall(this.$syncInformUndoManager);
        }
    };

    this.$defaultUndoManager = {
        undo: function() {},
        redo: function() {},
        reset: function() {}
    };

    this.getUndoManager = function() {
        return this.$undoManager || this.$defaultUndoManager;
    },

    this.getTabString = function() {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };

    this.$useSoftTabs = true;
    this.setUseSoftTabs = function(useSoftTabs) {
        if (this.$useSoftTabs === useSoftTabs) return;

        this.$useSoftTabs = useSoftTabs;
    };

    this.getUseSoftTabs = function() {
        return this.$useSoftTabs;
    };

    this.$tabSize = 4;
    this.setTabSize = function(tabSize) {
        if (isNaN(tabSize) || this.$tabSize === tabSize) return;

        this.$modified = true;
        this.$tabSize = tabSize;
        this._dispatchEvent("changeTabSize");
    };

    this.getTabSize = function() {
        return this.$tabSize;
    };

    this.isTabStop = function(position) {
        return this.$useSoftTabs && (position.column % this.$tabSize == 0);
    };

    this.$overwrite = false;
    this.setOverwrite = function(overwrite) {
        if (this.$overwrite == overwrite) return;

        this.$overwrite = overwrite;
        this._dispatchEvent("changeOverwrite");
    };

    this.getOverwrite = function() {
        return this.$overwrite;
    };

    this.toggleOverwrite = function() {
        this.setOverwrite(!this.$overwrite);
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = [];
        for (var i=0; i<rows.length; i++) {
            this.$breakpoints[rows[i]] = true;
        }
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoints = function() {
        this.$breakpoints = [];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.setBreakpoint = function(row) {
        this.$breakpoints[row] = true;
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.clearBreakpoint = function(row) {
        delete this.$breakpoints[row];
        this._dispatchEvent("changeBreakpoint", {});
    };

    this.getBreakpoints = function() {
        return this.$breakpoints;
    };

    this.addMarker = function(range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range : range,
            type : type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz : clazz,
            inFront: !!inFront
        }

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._dispatchEvent("changeFrontMarker")
        } else {
            this.$backMarkers[id] = marker;
            this._dispatchEvent("changeBackMarker")
        }

        return id;
    };

    this.removeMarker = function(markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this._dispatchEvent(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    };

    this.getMarkers = function(inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    /**
     * Error:
     *  {
     *    row: 12,
     *    column: 2, //can be undefined
     *    text: "Missing argument",
     *    type: "error" // or "warning" or "info"
     *  }
     */
    this.setAnnotations = function(annotations) {
        this.$annotations = {};
        for (var i=0; i<annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            if (this.$annotations[row])
                this.$annotations[row].push(annotation);
            else
                this.$annotations[row] = [annotation];
        }
        this._dispatchEvent("changeAnnotation", {});
    };

    this.getAnnotations = function() {
        return this.$annotations;
    };

    this.clearAnnotations = function() {
        this.$annotations = {};
        this._dispatchEvent("changeAnnotation", {});
    };

    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.tokenRe = /^[\w\d]+/g;
    this.nonTokenRe = /^(?:[^\w\d]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FFF\uF900-\uFAFF\u3400-\u4DBF])+/g;

    this.getWordRange = function(row, column) {
        var line = this.getLine(row);

        var inToken = false;
        if (column > 0) {
            inToken = !!line.charAt(column - 1).match(this.tokenRe);
        }

        if (!inToken) {
            inToken = !!line.charAt(column).match(this.tokenRe);
        }

        var re = inToken ? this.tokenRe : this.nonTokenRe;

        var start = column;
        if (start > 0) {
            do {
                start--;
            }
            while (start >= 0 && line.charAt(start).match(re));
            start++;
        }

        var end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new Range(row, start, row, end);
    };

    this.setNewLineMode = function(newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };

    this.getNewLineMode = function() {
        return this.doc.getNewLineMode();
    };

    this.$useWorker = true;
    this.setUseWorker = function(useWorker) {
        if (this.$useWorker == useWorker)
            return;

        if (useWorker && !this.$worker && window.Worker)
            this.$worker = mode.createWorker(this);

        if (!useWorker && this.$worker) {
            this.$worker.terminate();
            this.$worker = null;
        }

        this.$useWorker = useWorker;
    };

    this.getUseWorker = function() {
        return this.$useWorker;
    };

    this.onReloadTokenizer = function(e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._dispatchEvent("tokenizerUpdate", e);
    };

    this.$mode = null;
    this.setMode = function(mode) {
        if (this.$mode === mode) return;

        if (this.$worker)
            this.$worker.terminate();

        if (this.$useWorker && typeof Worker !== "undefined" && !require.noWorker)
            this.$worker = mode.createWorker(this);
        else
            this.$worker = null;

        var tokenizer = mode.getTokenizer();

        if(tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function(e) {
                _self._dispatchEvent("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());
        this.bgTokenizer.start(0);

        this.$mode = mode;
        this._dispatchEvent("changeMode");
    };

    this.getMode = function() {
        return this.$mode;
    };

    this.$scrollTop = 0;
    this.setScrollTopRow = function(scrollTopRow) {
        if (this.$scrollTop === scrollTopRow) return;

        this.$scrollTop = scrollTopRow;
        this._dispatchEvent("changeScrollTop");
    };

    this.getScrollTopRow = function() {
        return this.$scrollTop;
    };

    this.getWidth = function() {
        this.$computeWidth();
        return this.width;
    };

    this.getScreenWidth = function() {
        this.$computeWidth();
        return this.screenWidth;
    };

    this.$computeWidth = function(force) {
        if (this.$modified || force) {
            this.$modified = false;

            var lines = this.doc.getAllLines();
            var longestLine = 0;
            var longestScreenLine = 0;

            for ( var i = 0; i < lines.length; i++) {
                var foldLine = this.getFoldLine(i),
                    line, len;

                line = lines[i];
                if (foldLine) {
                    var end = foldLine.range.end;
                    line = this.getFoldDisplayLine(foldLine);
                    // Continue after the foldLine.end.row. All the lines in
                    // between are folded.
                    i = end.row;
                }
                len = line.length;
                longestLine = Math.max(longestLine, len);
                if (!this.$useWrapMode) {
                    longestScreenLine = Math.max(
                        longestScreenLine,
                        this.$getStringScreenWidth(line)[0]
                    );
                }
            }
            this.width = longestLine;

            if (this.$useWrapMode) {
                this.screenWidth = this.$wrapLimit;
            } else {
                this.screenWidth = longestScreenLine;
            }
        }
    };

    /**
     * Get a verbatim copy of the given line as it is in the document
     */
    this.getLine = function(row) {
        return this.doc.getLine(row);
    };

    this.getLines = function(firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };

    this.getLength = function() {
        return this.doc.getLength();
    };

    this.getTextRange = function(range) {
        return this.doc.getTextRange(range);
    };

    this.findMatchingBracket = function(position) {
        if (position.column == 0) return null;

        var charBeforeCursor = this.getLine(position.row).charAt(position.column-1);
        if (charBeforeCursor == "") return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            return null;
        }

        if (match[1]) {
            return this.$findClosingBracket(match[1], position);
        } else {
            return this.$findOpeningBracket(match[2], position);
        }
    };

    this.$brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{"
    };

    this.$findOpeningBracket = function(bracket, position) {
        var openBracket = this.$brackets[bracket];

        var column = position.column - 2;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);

        while (true) {
            while(column >= 0) {
                var ch = line.charAt(column);
                if (ch == openBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column -= 1;
            }
            row -=1;
            if (row < 0) break;

            var line = this.getLine(row);
            var column = line.length-1;
        }
        return null;
    };

    this.$findClosingBracket = function(bracket, position) {
        var closingBracket = this.$brackets[bracket];

        var column = position.column;
        var row = position.row;
        var depth = 1;

        var line = this.getLine(row);
        var lineCount = this.getLength();

        while (true) {
            while(column < line.length) {
                var ch = line.charAt(column);
                if (ch == closingBracket) {
                    depth -= 1;
                    if (depth == 0) {
                        return {row: row, column: column};
                    }
                }
                else if (ch == bracket) {
                    depth +=1;
                }
                column += 1;
            }
            row +=1;
            if (row >= lineCount) break;

            var line = this.getLine(row);
            var column = 0;
        }
        return null;
    };

    this.insert = function(position, text) {
        return this.doc.insert(position, text);
    };

    this.remove = function(range) {
        return this.doc.remove(range);
    };

    this.undoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = deltas.length - 1; i != -1; i--) {
            delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.revertDeltas(delta.deltas);
                lastUndoRange =
                    this.$setUndoSelection(delta.deltas, true, lastUndoRange);
            } else {
                delta.deltas.forEach(function(foldDelta) {
                    this.addFolds(foldDelta.folds);
                }, this);
            }
        }
        this.$fromUndo = false;
    },

    this.redoChanges = function(deltas) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = 0; i < deltas.length; i++) {
            delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.applyDeltas(delta.deltas);
                lastUndoRange =
                    this.$setUndoSelection(delta.deltas, false, lastUndoRange);
            }
        }
        this.$fromUndo = false;
    },

    this.$setUndoSelection = function(deltas, isUndo, lastUndoRange) {
        function isInsert(delta) {
            var insert =
                delta.action == "insertText" || delta.action == "insertLines";
            return isUndo ? !insert : insert;
        }

        var delta = deltas[0];
        var range;
        var lastDeltaIsInsert = false;
        if (isInsert(delta)) {
            range = delta.range.clone();
            lastDeltaIsInsert = true;
        } else {
            range = Range.fromPoints(delta.range.start, delta.range.start);
            lastDeltaIsInsert = false;
        }

        for (var i = 1; i < deltas.length; i++) {
            delta = deltas[i];
            if (isInsert(delta)) {
                if (range.compare(delta.range.start) == -1) {
                    range.setStart(delta.range.start);
                }
                if (range.compare(delta.range.end) == 1) {
                    range.setEnd(delta.range.end);
                }
                lastDeltaIsInsert = true;
            } else {
                if (range.compare(delta.range.start) == -1) {
                    range =
                        Range.fromPoints(delta.range.start, delta.range.start);
                }
                lastDeltaIsInsert = false;
            }
        }

        // Check if this range and the last undo range has something in common.
        // If true, merge the ranges.
        if (lastUndoRange != null) {
            var cmp = lastUndoRange.compareRange(range);
            if (cmp == 1) {
                range.setStart(lastUndoRange.start);
            } else if (cmp == -1) {
                range.setEnd(lastUndoRange.end);
            }
        }

        if (!range.isEmpty()) {
            this.selection.setSelectionRange(range);
        } else {
            this.selection.moveCursorToPosition(range.start);
        }
        return range;
    },

    this.replace = function(range, text) {
        return this.doc.replace(range, text);
    };

    /**
     * Move a range of text from the given range to the given position.
     *
     * @param fromRange {Range} The range of text you want moved within the
     * document.
     * @param toPosition {Object} The location (row and column) where you want
     * to move the text to.
     * @return {Range} The new range where the text was moved to.
     */
    this.moveText = function(fromRange, toPosition) {
        var text = this.getTextRange(fromRange);
        this.remove(fromRange);

        var toRow = toPosition.row;
        var toColumn = toPosition.column;

        // Make sure to update the insert location, when text is removed in
        // front of the chosen point of insertion.
        if (!fromRange.isMultiLine() && fromRange.start.row == toRow &&
            fromRange.end.column < toColumn)
            toColumn -= text.length;

        if (fromRange.isMultiLine() && fromRange.end.row < toRow) {
            var lines = this.doc.$split(text);
            toRow -= lines.length - 1;
        }

        var endRow = toRow + fromRange.end.row - fromRange.start.row;
        var endColumn = fromRange.isMultiLine() ?
                        fromRange.end.column :
                        toColumn + fromRange.end.column - fromRange.start.column;

        var toRange = new Range(toRow, toColumn, endRow, endColumn);

        this.insert(toRange.start, text);

        return toRange;
    };

    this.indentRows = function(startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row=startRow; row<=endRow; row++) {
            this.insert({row: row, column:0}, indentString);
        }
    };

    this.outdentRows = function (range) {
        var rowRange = range.collapseRows();
        var deleteRange = new Range(0, 0, 0, 0);
        var size = this.getTabSize();

        for (var i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            var line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            for (var j = 0; j < size; ++j)
                if (line.charAt(j) != ' ')
                    break;
            if (j < size && line.charAt(j) == '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            this.remove(deleteRange);
        }
    };

    this.moveLinesUp = function(firstRow, lastRow) {
        if (firstRow <= 0) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow - 1, removed);
        return -1;
    };

    this.moveLinesDown = function(firstRow, lastRow) {
        if (lastRow >= this.doc.getLength()-1) return 0;

        var removed = this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow+1, removed);
        return 1;
    };

    this.duplicateLines = function(firstRow, lastRow) {
        var firstRow = this.$clipRowToDocument(firstRow);
        var lastRow = this.$clipRowToDocument(lastRow);

        var lines = this.getLines(firstRow, lastRow);
        this.doc.insertLines(firstRow, lines);

        var addedRows = lastRow - firstRow + 1;
        return addedRows;
    };

    this.$clipRowToDocument = function(row) {
        return Math.max(0, Math.min(row, this.doc.getLength()-1));
    };

    // WRAPMODE
    this.$wrapLimit = 80;
    this.$useWrapMode = false;
    this.$wrapLimitRange = {
        min : null,
        max : null
    };

    this.setUseWrapMode = function(useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);

            // If wrapMode is activaed, the wrapData array has to be initialized.
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = [];
                for (i = 0; i < len; i++) {
                    this.$wrapData.push([]);
                }
                this.$updateWrapData(0, len - 1);
            }

            this._dispatchEvent("changeWrapMode");
        }
    };

    this.getUseWrapMode = function() {
        return this.$useWrapMode;
    };

    // Allow the wrap limit to move freely between min and max. Either
    // parameter can be null to allow the wrap limit to be unconstrained
    // in that direction. Or set both parameters to the same number to pin
    // the limit to that value.
    this.setWrapLimitRange = function(min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange.min = min;
            this.$wrapLimitRange.max = max;
            this.$modified = true;
            // This will force a recalculation of the wrap limit
            this._dispatchEvent("changeWrapMode");
        }
    };

    // This should generally only be called by the renderer when a resize
    // is detected.
    this.adjustWrapLimit = function(desiredLimit) {
        var wrapLimit = this.$constrainWrapLimit(desiredLimit);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 0) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0)
                this._dispatchEvent("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

    this.$constrainWrapLimit = function(wrapLimit) {
        var min = this.$wrapLimitRange.min;
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        var max = this.$wrapLimitRange.max;
        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        // What would a limit of 0 even mean?
        return Math.max(1, wrapLimit);
    };

    this.getWrapLimit = function() {
        return this.$wrapLimit;
    };

    this.getWrapLimitRange = function() {
        // Avoid unexpected mutation by returning a copy
        return {
            min : this.$wrapLimitRange.min,
            max : this.$wrapLimitRange.max
        };
    };

    this.$updateInternalDataOnChange = function(e) {
        var useWrapMode = this.$useWrapMode;
        var len;
        var action = e.data.action;
        var firstRow = e.data.range.start.row,
            lastRow = e.data.range.end.row,
            start = e.data.range.start,
            end = e.data.range.end;
        var removedFolds = null;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + (e.data.lines.length);
            } else {
                lastRow = firstRow;
            }
            len = e.data.lines.length;
        } else {
            len = lastRow - firstRow;
        }

        if (len != 0) {
            if (action.indexOf("remove") != -1) {
                useWrapMode && this.$wrapData.splice(firstRow, len);

                var foldLines = this.$foldData;
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                var foldLine = this.getFoldLine(lastRow);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= lastRow) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args;
                if (useWrapMode) {
                    args = [firstRow, 0];
                    for (var i = 0; i < len; i++) args.push([]);
                    this.$wrapData.splice.apply(this.$wrapData, args);
                }

                // If some new line is added inside of a foldLine, then split
                // the fold line up.
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column)
                    // Inside of the foldLine range. Need to split stuff up.
                    if (cmp == 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        foldLine.shiftRow(len);
                        foldLine.addRemoveChars(
                            lastRow, 0, end.column - start.column);
                    } else
                    // Infront of the foldLine but same row. Need to shift column.
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    // Nothing to do if the insert is after the foldLine.
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            // Realign folds. E.g. if you add some new chars before a fold, the
            // fold should "move" to the right.
            var column;
            len = Math.abs(e.data.range.start.column - e.data.range.end.column);
            if (action.indexOf("remove") != -1) {
                // Get all the folds in the change range and remove them.
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.$lines.length) {
            console.error("The length of doc.$lines and $wrapData have to be the same!");
        }

        useWrapMode && this.$updateWrapData(firstRow, lastRow);

        return removedFolds;
    };

    this.$updateWrapData = function(firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;
        var tokens;
        var foldLine;

        var row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lang.stringTrimRight(lines[row]));
            } else {
                tokens = [];
                foldLine.walk(
                    function(placeholder, row, column, lastColumn) {
                        var walkTokens;
                        if (placeholder) {
                            walkTokens = this.$getDisplayTokens(
                                            placeholder, tokens.length);
                            walkTokens[0] = PLACEHOLDER_START;
                            for (var i = 1; i < walkTokens.length; i++) {
                                walkTokens[i] = PLACEHOLDER_BODY;
                            }
                        } else {
                            walkTokens = this.$getDisplayTokens(
                                lines[row].substring(lastColumn, column),
                                tokens.length);
                        }
                        tokens = tokens.concat(walkTokens);
                    }.bind(this),
                    foldLine.end.row,
                    lines[foldLine.end.row].length + 1
                );
                // Remove spaces/tabs from the back of the token array.
                while (tokens.length != 0
                    && tokens[tokens.length - 1] >= SPACE)
                {
                    tokens.pop();
                }
            }
            wrapData[row] =
                this.$computeWrapSplits(tokens, wrapLimit, tabSize);

            row = this.getRowFoldEnd(row) + 1;
        }
    };

    // "Tokens"
    var CHAR = 1,
        CHAR_EXT = 2,
        PLACEHOLDER_START = 3,
        PLACEHOLDER_BODY =  4,
        SPACE = 10,
        TAB = 11,
        TAB_SPACE = 12;

    this.$computeWrapSplits = function(tokens, wrapLimit, tabSize) {
        if (tokens.length == 0) {
            return [];
        }

        var tabSize = this.getTabSize();
        var splits = [];
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);

            // The document size is the current size - the extra width for tabs
            // and multipleWidth characters.
            var len = displayed.length;
            displayed.join("").
                // Get all the TAB_SPACEs.
                replace(/12/g, function(m) {
                    len -= 1;
                }).
                // Get all the CHAR_EXT/multipleWidth characters.
                replace(/2/g, function(m) {
                    len -= 1;
                });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            // This is, where the split should be.
            var split = lastSplit + wrapLimit;

            // If there is a space or tab at this split position, then making
            // a split is simple.
            if (tokens[split] >= SPACE) {
                // Include all following spaces + tabs in this split as well.
                while (tokens[split] >= SPACE)  {
                    split ++;
                }
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Check if split is inside of a placeholder. Placeholder are
            // not splitable. Therefore, seek the beginning of the placeholder
            // and try to place the split beofre the placeholder's start.
            if (tokens[split] == PLACEHOLDER_START
                || tokens[split] == PLACEHOLDER_BODY)
            {
                // Seek the start of the placeholder and do the split
                // before the placeholder. By definition there always
                // a PLACEHOLDER_START between split and lastSplit.
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] == PLACEHOLDER_START) {
                        // split++; << No incremental here as we want to
                        //  have the position before the Placeholder.
                        break;
                    }
                }

                // If the PLACEHOLDER_START is not the index of the
                // last split, then we can do the split
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }

                // If the PLACEHOLDER_START IS the index of the last
                // split, then we have to place the split after the
                // placeholder. So, let's seek for the end of the placeholder.
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] != PLACEHOLDER_BODY)
                    {
                        break;
                    }
                }

                // If spilt == tokens.length, then the placeholder is the last
                // thing in the line and adding a new split doesn't make sense.
                if (split == tokens.length) {
                    break;  // Breaks the while-loop.
                }

                // Finally, add the split...
                addSplit(split);
                continue;
            }

            // === ELSE ===
            // Search for the first non space/tab/placeholder token backwards.
            for (split; split != lastSplit - 1; split--) {
                if (tokens[split] >= PLACEHOLDER_START) {
                    split++;
                    break;
                }
            }
            // If we found one, then add the split.
            if (split > lastSplit) {
                addSplit(split);
                continue;
            }

            // === ELSE ===
            split = lastSplit + wrapLimit;
            // The split is inside of a CHAR or CHAR_EXT token and no space
            // around -> force a split.
            addSplit(lastSplit + wrapLimit);
        }
        return splits;
    }

    /**
     * @param
     *   offset: The offset in screenColumn at which position str starts.
     *           Important for calculating the realTabSize.
     */
    this.$getDisplayTokens = function(str, offset) {
        var arr = [];
        var tabSize;
        offset = offset || 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            // Tab
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            }
            // Space
            else if(c == 32) {
                arr.push(SPACE);
            }
            // full width characters
            else if (isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    }

    /**
     * Calculates the width of the a string on the screen while assuming that
     * the string starts at the first column on the screen.
     *
     * @param string str String to calculate the screen width of
     * @return array
     *      [0]: number of columns for str on screen.
     *      [1]: docColumn position that was read until (useful with screenColumn)
     */
    this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0) {
            return [0, 0];
        }
        if (maxScreenColumn == null) {
            maxScreenColumn = screenColumn +
                str.length * Math.max(this.getTabSize(), 2);
        }
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            // tab
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            }
            // full width characters
            else if (isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break
            }
        }

        return [screenColumn, column];
    }

    this.getRowLength = function(row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    }

    this.getRowHeight = function(config, row) {
        return this.getRowLength(row) * config.lineHeight;
    }

    this.getScreenLastRowColumn = function(screenRow) {
        // Note: This won't work if someone has more then
        // 1.7976931348623158e+307 characters in one row. But I think we can
        // live with this limitation ;)
        return this.screenToDocumentColumn(screenRow, Number.MAX_VALUE / 10)
    };

    this.getDocumentLastRowColumn = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    };

    this.getDocumentLastRowColumnPosition = function(docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    };

    this.getRowSplitData = function(row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };

    /**
     * Returns the width of a tab character at screenColumn.
     */
    this.getScreenTabSize = function(screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };

    this.screenToDocumentRow = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };

    this.screenToDocumentColumn = function(screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };

    this.screenToDocumentPosition = function(screenRow, screenColumn) {
        var line;
        var docRow = 0;
        var docColumn = 0;
        var column;
        var foldLine;
        var foldLineRowLength;
        var row = 0;
        var rowLength = 0;
        var splits = null;
        var split = 0;

        var rowCache = this.$rowCache;
        var doCache = !rowCache.length;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].screenRow < screenRow) {
                row = rowCache[i].screenRow;
                docRow = rowCache[i].docRow;
                doCache = i == rowCache.length - 1;
            }
        }
        var docRowCacheLast = docRow;

        while (row <= screenRow) {
            if (doCache
                && docRow - docRowCacheLast > this.$rowCacheSize) {
                rowCache.push({
                    docRow: docRow,
                    screenRow: row
                });
                docRowCacheLast = docRow;
            }
            rowLength = this.getRowLength(docRow);
            if (row + rowLength - 1 >= screenRow) {
                break;
            } else {
                row += rowLength;
                docRow = this.getRowFoldEnd(docRow) + 1;
            }
        }

        splits = this.$wrapData[docRow] || [];
        foldLine = this.getFoldLine(docRow);
        line = foldLine
                ? this.getFoldDisplayLine(foldLine)
                : this.getLine(docRow);

        if (this.$useWrapMode) {
            docColumn = split = splits[screenRow - row - 1] || 0;
            line = line.substring(split);
        }

        docColumn += this.$getStringScreenWidth(line, screenColumn)[1];

        // Need to do some clamping action here.
        if (this.$useWrapMode) {
            column = splits[screenRow - row]
            if (docColumn >= column) {
                // We remove one character at the end such that the docColumn
                // position returned is not associated to the next row on the
                // screen.
                docColumn = column - 1;
            }
        } else {
            docColumn = Math.min(docColumn, line.length);
        }

        if (foldLine) {
            return foldLine.idxToPosition(docColumn);
        }

        return {
            row: docRow,
            column: docColumn
        }
    };

    this.documentToScreenPosition = function(docRow, docColumn) {
        // Normalize the passed in arguments.
        if (docColumn == null) {
            docColumn = docRow.column;
            docRow = docRow.row;
        }

        var wrapData;

        // Special case in wrapMode if the doc is at the end of the document.
        if (this.$useWrapMode) {
            wrapData = this.$wrapData;
            if (docRow > wrapData.length - 1) {
                return {
                    row: this.getScreenLength(),
                    column: wrapData.length == 0
                        ? 0
                        : (wrapData[wrapData.length - 1].length - 1)
                };
            }
        }

        var screenRow = 0,
            screenColumn = 0,
            foldStartRow = null,
            fold = null,
            folds,
            comp,
            foldLine = null;

        // Clamp the docRow position in case it's inside of a folded block.
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        var rowEnd, row = 0;
        var rowCache = this.$rowCache;
        //
        var doCache = !rowCache.length;
        for (var i = 0; i < rowCache.length; i++) {
            if (rowCache[i].docRow < docRow) {
                screenRow = rowCache[i].screenRow;
                row = rowCache[i].docRow;
                doCache = i == rowCache.length - 1;
            }
        }
        var docRowCacheLast = row;

        while (row < docRow) {
            if (doCache
                && row - docRowCacheLast > this.$rowCacheSize) {
                rowCache.push({
                    docRow: row,
                    screenRow: screenRow
                });
                docRowCacheLast = row;
            }

            rowEnd = this.getRowFoldEnd(row);
            if (rowEnd >= docRow) {
                break;
            }
            screenRow += this.getRowLength(row);
            row = rowEnd + 1;
        }

        // Calculate the text line that is displayed in docRow on the screen.
        var textLine = "";
        foldLine = this.getFoldLine(docRow);
        // Check if the final row we want to reach is inside of a fold.
        if (!foldLine) {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        } else {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        }

        // Clamp textLine if in wrapMode.
        if (this.$useWrapMode) {
            var wrapRow = wrapData[foldStartRow];
            var screenRowOffset = 0;
            while (textLine.length >= wrapRow[screenRowOffset]) {
                screenRow ++;
                screenRowOffset++;
            }
            textLine = textLine.substring(
                wrapRow[screenRowOffset - 1] || 0,  textLine.length);
        }

        return {
            row: screenRow,
            column: this.$getStringScreenWidth(textLine)[0]
        };
    };

    this.documentToScreenColumn = function(row, docColumn) {
        return this.documentToScreenPosition(row, docColumn).column;
    };

    this.documentToScreenRow = function(docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };

    this.getScreenLength = function() {
        var length = this.getLength();
        var screenRows = 0;
        if (!this.$useWrapMode) {
            screenRows = length;
        } else {
            for (var row = 0; row < this.$wrapData.length; row++) {
                screenRows += this.$wrapData[row].length + 1;
            }
        }

        var foldData = this.$foldData;
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
            screenRows -= foldLine.end.row - foldLine.start.row;
        }
        return screenRows;
    }

    // For every keystroke this gets called once per char in the whole doc!!
    // Wouldn't hurt to make it a bit faster for c >= 0x1100
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
               c >= 0x11A3 && c <= 0x11A7 ||
               c >= 0x11FA && c <= 0x11FF ||
               c >= 0x2329 && c <= 0x232A ||
               c >= 0x2E80 && c <= 0x2E99 ||
               c >= 0x2E9B && c <= 0x2EF3 ||
               c >= 0x2F00 && c <= 0x2FD5 ||
               c >= 0x2FF0 && c <= 0x2FFB ||
               c >= 0x3000 && c <= 0x303E ||
               c >= 0x3041 && c <= 0x3096 ||
               c >= 0x3099 && c <= 0x30FF ||
               c >= 0x3105 && c <= 0x312D ||
               c >= 0x3131 && c <= 0x318E ||
               c >= 0x3190 && c <= 0x31BA ||
               c >= 0x31C0 && c <= 0x31E3 ||
               c >= 0x31F0 && c <= 0x321E ||
               c >= 0x3220 && c <= 0x3247 ||
               c >= 0x3250 && c <= 0x32FE ||
               c >= 0x3300 && c <= 0x4DBF ||
               c >= 0x4E00 && c <= 0xA48C ||
               c >= 0xA490 && c <= 0xA4C6 ||
               c >= 0xA960 && c <= 0xA97C ||
               c >= 0xAC00 && c <= 0xD7A3 ||
               c >= 0xD7B0 && c <= 0xD7C6 ||
               c >= 0xD7CB && c <= 0xD7FB ||
               c >= 0xF900 && c <= 0xFAFF ||
               c >= 0xFE10 && c <= 0xFE19 ||
               c >= 0xFE30 && c <= 0xFE52 ||
               c >= 0xFE54 && c <= 0xFE66 ||
               c >= 0xFE68 && c <= 0xFE6B ||
               c >= 0xFF01 && c <= 0xFF60 ||
               c >= 0xFFE0 && c <= 0xFFE6;
    };

}).call(EditSession.prototype);

require("ace/edit_session/folding").Folding.call(EditSession.prototype);

exports.EditSession = EditSession;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/selection'), ['pilot/oop','pilot/lang','pilot/event_emitter','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;

var Selection = function(session) {
    this.session = session;
    this.doc = session.getDocument();

    this.clearSelection();
    this.selectionLead = this.doc.createAnchor(0, 0);
    this.selectionAnchor = this.doc.createAnchor(0, 0);

    var _self = this;
    this.selectionLead.on("change", function(e) {
        _self._dispatchEvent("changeCursor");
        if (!_self.$isEmpty)
            _self._dispatchEvent("changeSelection");
        if (e.old.row == e.value.row)
            _self.$updateDesiredColumn();
    });

    this.selectionAnchor.on("change", function() {
        if (!_self.$isEmpty)
            _self._dispatchEvent("changeSelection");
    });
};

(function() {

    oop.implement(this, EventEmitter);

    this.isEmpty = function() {
        return (this.$isEmpty || (
            this.selectionAnchor.row == this.selectionLead.row &&
            this.selectionAnchor.column == this.selectionLead.column
        ));
    };

    this.isMultiLine = function() {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };

    this.getCursor = function() {
        return this.selectionLead.getPosition();
    };

    this.setSelectionAnchor = function(row, column) {
        this.selectionAnchor.setPosition(row, column);

        if (this.$isEmpty) {
            this.$isEmpty = false;
            this._dispatchEvent("changeSelection");
        }
    };

    this.getSelectionAnchor = function() {
        if (this.$isEmpty)
            return this.getSelectionLead()
        else
            return this.selectionAnchor.getPosition();
    };

    this.getSelectionLead = function() {
        return this.selectionLead.getPosition();
    };

    this.shiftSelection = function(columns) {
        if (this.$isEmpty) {
            this.moveCursorTo(this.selectionLead.row, this.selectionLead.column + columns);
            return;
        };

        var anchor = this.getSelectionAnchor();
        var lead = this.getSelectionLead();

        var isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function() {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    };

    this.isBackwards = function() {
        var anchor = this.selectionAnchor;
        var lead = this.selectionLead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };

    this.getRange = function() {
        var anchor = this.selectionAnchor;
        var lead = this.selectionLead;

        if (this.isEmpty())
            return Range.fromPoints(lead, lead);

        if (this.isBackwards()) {
            return Range.fromPoints(lead, anchor);
        }
        else {
            return Range.fromPoints(anchor, lead);
        }
    };

    this.clearSelection = function() {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            this._dispatchEvent("changeSelection");
        }
    };

    this.selectAll = function() {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(lastRow, this.doc.getLine(lastRow).length);
        this.moveCursorTo(0, 0);
    };

    this.setSelectionRange = function(range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        this.$updateDesiredColumn();
    };

    this.$updateDesiredColumn = function() {
        var cursor = this.getCursor();
        this.$desiredColumn = this.session.documentToScreenColumn(cursor.row, cursor.column);
    };

    this.$moveSelection = function(mover) {
        var lead = this.selectionLead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    };

    this.selectTo = function(row, column) {
        this.$moveSelection(function() {
            this.moveCursorTo(row, column);
        });
    };

    this.selectToPosition = function(pos) {
        this.$moveSelection(function() {
            this.moveCursorToPosition(pos);
        });
    };

    this.selectUp = function() {
        this.$moveSelection(this.moveCursorUp);
    };

    this.selectDown = function() {
        this.$moveSelection(this.moveCursorDown);
    };

    this.selectRight = function() {
        this.$moveSelection(this.moveCursorRight);
    };

    this.selectLeft = function() {
        this.$moveSelection(this.moveCursorLeft);
    };

    this.selectLineStart = function() {
        this.$moveSelection(this.moveCursorLineStart);
    };

    this.selectLineEnd = function() {
        this.$moveSelection(this.moveCursorLineEnd);
    };

    this.selectFileEnd = function() {
        this.$moveSelection(this.moveCursorFileEnd);
    };

    this.selectFileStart = function() {
        this.$moveSelection(this.moveCursorFileStart);
    };

    this.selectWordRight = function() {
        this.$moveSelection(this.moveCursorWordRight);
    };

    this.selectWordLeft = function() {
        this.$moveSelection(this.moveCursorWordLeft);
    };

    this.selectWord = function() {
        var cursor = this.getCursor();
        var range  = this.session.getWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    };

    this.selectLine = function() {
        var rowStart = this.selectionLead.row;
        var rowEnd;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        } else {
            rowEnd = rowStart;
        }
        this.setSelectionAnchor(rowStart, 0);
        this.$moveSelection(function() {
            this.moveCursorTo(rowEnd + 1, 0);
        });
    };

    this.moveCursorUp = function() {
        this.moveCursorBy(-1, 0);
    };

    this.moveCursorDown = function() {
        this.moveCursorBy(1, 0);
    };

    this.moveCursorLeft = function() {
        var cursor = this.selectionLead.getPosition(),
            fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        } else if (cursor.column == 0) {
            // cursor is a line (start
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column-tabSize, cursor.column).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };

    this.moveCursorRight = function() {
        var cursor = this.selectionLead.getPosition(),
            fold;
        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        } else if (this.selectionLead.column == this.doc.getLine(this.selectionLead.row).length) {
            if (this.selectionLead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.selectionLead.row + 1, 0);
            }
        }
        else {
            var tabSize = this.session.getTabSize();
            var cursor = this.selectionLead;
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column+tabSize).split(" ").length-1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };

    this.moveCursorLineStart = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var screenRow = this.session.documentToScreenRow(row, column);

        // Determ the doc-position of the first character at the screen line.
        var firstColumnPosition =
            this.session.screenToDocumentPosition(screenRow, 0);

        // Determ the string "before" the cursor.
        var beforeCursor = this.session.getDisplayLine(
                row, column,
                firstColumnPosition.row, firstColumnPosition.column);

        //
        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length == 0
            || leadingSpace[0].length >= column - firstColumnPosition.column)
        {
            this.moveCursorTo(
                firstColumnPosition.row, firstColumnPosition.column);
        } else {
            this.moveCursorTo(
                firstColumnPosition.row,
                firstColumnPosition.column + leadingSpace[0].length);
        }
    };

    this.moveCursorLineEnd = function() {
        var lead = this.selectionLead;
        var lastRowColumnPosition =
            this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        this.moveCursorTo(
            lastRowColumnPosition.row,
            lastRowColumnPosition.column
        );
    };

    this.moveCursorFileEnd = function() {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };

    this.moveCursorFileStart = function() {
        this.moveCursorTo(0, 0);
    };

    this.moveCursorWordRight = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        var fold;
        if (fold = this.session.getFoldAt(row, column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        } else if (column == line.length) {
            this.moveCursorRight();
            return;
        }
        else if (match = this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorWordLeft = function() {
        var row = this.selectionLead.row;
        var column = this.selectionLead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        if (column == 0) {
            this.moveCursorLeft();
            return;
        }

        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column)
        }
        var leftOfCursor = lang.stringReverse(str);

        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;

        if (match = this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
        }
        else if (match = this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    this.moveCursorBy = function(rows, chars) {
        var screenPos = this.session.documentToScreenPosition(
            this.selectionLead.row,
            this.selectionLead.column
        );
        var screenCol = (chars == 0 && this.$desiredColumn) || screenPos.column;
        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenCol);

        this.moveCursorTo(docPos.row, docPos.column + chars, chars == 0);
    };

    this.moveCursorToPosition = function(position) {
        this.moveCursorTo(position.row, position.column);
    };

    this.moveCursorTo = function(row, column, preventUpdateDesiredColumn) {
        // Ensure the row/column is not inside of a fold.
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }
        this.selectionLead.setPosition(row, column);
        if (!preventUpdateDesiredColumn)
            this.$updateDesiredColumn(this.selectionLead.column);
    };

    this.moveCursorToScreen = function(row, column, preventUpdateDesiredColumn) {
        var pos = this.session.screenToDocumentPosition(row, column);
        row = pos.row;
        column = pos.column;
        this.moveCursorTo(row, column, preventUpdateDesiredColumn);
    };

}).call(Selection.prototype);

exports.Selection = Selection;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/range'), [], function (require, exports, module) {


var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {

    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };

    /**
     * Compares this range (A) with another range (B), where B is the passed in
     * range.
     *
     * Return values:
     *  -2: (B) is infront of (A) and doesn't intersect with (A)
     *  -1: (B) begins before (A) but ends inside of (A)
     *   0: (B) is completly inside of (A) OR (A) is complety inside of (B)
     *  +1: (B) begins inside of (A) but ends outside of (A)
     *  +2: (B) is after (A) and doesn't intersect with (A)
     *
     *  42: FTW state: (B) ends in (A) but starts outside of (A)
     */
    this.compareRange = function(range) {
        var cmp,
            end = range.end,
            start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp == 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    }

    this.containsRange = function(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    }

    this.isEnd = function(row, column) {
        return this.end.row == row && this.end.column == column;
    }

    this.isStart = function(row, column) {
        return this.start.row == row && this.start.column == column;
    }

    this.setStart = function(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    }

    this.setEnd = function(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    }

    this.inside = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    this.insideStart = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    this.insideEnd = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    this.compare = function(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            };
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };

    /**
     * Like .compare(), but if isStart is true, return -1;
     */
    this.compareStart = function(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    /**
     * Like .compare(), but if isEnd is true, return 1;
     */
    this.compareEnd = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    }

    this.compareInside = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    }

    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow) {
            var end = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row > lastRow) {
            var start = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row < firstRow) {
            var start = {
                row: firstRow,
                column: 0
            };
        }

        if (this.end.row < firstRow) {
            var end = {
                row: firstRow,
                column: 0
            };
        }
        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.extend = function(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.isEmpty = function() {
        return (this.start.row == this.end.row && this.start.column == this.end.column);
    };

    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };

    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };

    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
        else
            return new Range(this.start.row, 0, this.end.row, 0)
    };

    this.toScreenRange = function(session) {
        var screenPosStart =
            session.documentToScreenPosition(this.start);
        var screenPosEnd =
            session.documentToScreenPosition(this.end);
        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    };

}).call(Range.prototype);


Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};

exports.Range = Range;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/text'), ['ace/tokenizer','ace/mode/text_highlight_rules'], function (require, exports, module) {


var Tokenizer = require("ace/tokenizer").Tokenizer;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new TextHighlightRules().getRules());
};

(function() {

    this.getTokenizer = function() {
        return this.$tokenizer;
    };

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
    };

    this.getNextLineIndent = function(state, line, tab) {
        return "";
    };

    this.checkOutdent = function(state, line, input) {
        return false;
    };

    this.autoOutdent = function(state, doc, row) {
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };
    
    this.createWorker = function(session) {
        return null;
    };

    this.highlightSelection = function(editor) {
        var session = editor.session;
        if (!session.$selectionOccurrences)
            session.$selectionOccurrences = [];

        if (session.$selectionOccurrences.length)
            this.clearSelectionHighlight(editor);

        var selection = editor.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startOuter = selection.start.column - 1;
        var endOuter = selection.end.column + 1;
        var line = session.getLine(selection.start.row);
        var lineCols = line.length;
        var needle = line.substring(Math.max(startOuter, 0),
                                    Math.min(endOuter, lineCols));

        // Make sure the outer characters are not part of the word.
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
            (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return;

        var cursor = editor.getCursorPosition();

        var newOptions = {
            wrap: true,
            wholeWord: true,
            caseSensitive: true,
            needle: needle
        };

        var currentOptions = editor.$search.getOptions();
        editor.$search.set(newOptions);

        var ranges = editor.$search.findAll(session);
        ranges.forEach(function(range) {
            if (!range.contains(cursor.row, cursor.column)) {
                var marker = session.addMarker(range, "ace_selected_word");
                session.$selectionOccurrences.push(marker);
            }
        });

        editor.$search.set(currentOptions);
    };

    this.clearSelectionHighlight = function(editor) {
        if (!editor.session.$selectionOccurrences)
            return;

        editor.session.$selectionOccurrences.forEach(function(marker) {
            editor.session.removeMarker(marker);
        });

        editor.session.$selectionOccurrences = [];
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/tokenizer'), [], function (require, exports, module) {


var Tokenizer = function(rules) {
    this.rules = rules;

    this.regExps = {};
    for ( var key in this.rules) {
        var rule = this.rules[key];
        var state = rule;
        var ruleRegExps = [];

        for ( var i = 0; i < state.length; i++)
            ruleRegExps.push(state[i].regex);

        this.regExps[key] = new RegExp("(?:(" + ruleRegExps.join(")|(") + ")|(.))", "g");
        
    }
};

(function() {

    this.getLineTokens = function(line, startState) {
        var currentState = startState;
        var state = this.rules[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];

        var lastIndex = 0;

        var token = {
            type: null,
            value: ""
        };

        while (match = re.exec(line)) {
            var type = "text";
            var value = match[0];

            for ( var i = 0; i < state.length; i++) {
                if (match[i + 1]) {
                    var rule = state[i];
                    
                    if (typeof rule.token == "function")
                        type = rule.token(match[0]);
                    else
                        type = rule.token;

                    if (rule.next && rule.next !== currentState) {
                        currentState = rule.next;
                        state = this.rules[currentState];
                        lastIndex = re.lastIndex;

                        re = this.regExps[currentState];
                        re.lastIndex = lastIndex;
                    }
                    break;
                }
            };
            
                  
            if (token.type !== type) {
                if (token.type)
                    tokens.push(token);
                    
                token = {
                    type: type,
                    value: value
                };
            } else {
                token.value += value;
            }
            
            if (lastIndex == line.length)
                break;
            
            lastIndex = re.lastIndex;
        };

        if (token.type)
            tokens.push(token);

        return {
            tokens : tokens,
            state : currentState
        };
    };

}).call(Tokenizer.prototype);

exports.Tokenizer = Tokenizer;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/text_highlight_rules'), [], function (require, exports, module) {


var TextHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [ {
            token : "empty_line",
            regex : '^$'
        }, {
            token : "text",
            regex : ".+"
        } ]
    };
};

(function() {

    this.addRules = function(rules, prefix) {
        for (var key in rules) {
            var state = rules[key];
            for (var i=0; i<state.length; i++) {
                var rule = state[i];
                if (rule.next) {
                    rule.next = prefix + rule.next;
                } else {
                    rule.next = prefix + key;
                }
            }
            this.$rules[prefix + key] = state;
        }
    };

    this.getRules = function() {
        return this.$rules;
    };

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/document'), ['pilot/oop','pilot/event_emitter','ace/range','ace/anchor'], function (require, exports, module) {


var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var Range = require("ace/range").Range;
var Anchor = require("ace/anchor").Anchor;

var Document = function(text) {
    this.$lines = [];

    if (Array.isArray(text)) {
        this.insertLines(0, text);
    }
    // There has to be one line at least in the document. If you pass an empty
    // string to the insert function, nothing will happen. Workaround.
    else if (text.length == 0) {
        this.$lines = [""];
    } else {
        this.insert({row: 0, column:0}, text);
    }
};

(function() {

    oop.implement(this, EventEmitter);

    this.setValue = function(text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len-1).length));
        this.insert({row: 0, column:0}, text);
    };

    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };

    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };

    // check for IE split bug
    if ("aaa".split(/a/).length == 0)
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
    else
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };


    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };

    this.getNewLineCharacter = function() {
      switch (this.$newLineMode) {
          case "windows":
              return "\r\n";

          case "unix":
              return "\n";

          case "auto":
              return this.$autoNewLine;
      }
    },

    this.$autoNewLine = "\n";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode) return;

        this.$newLineMode = newLineMode;
    };

    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    /**
     * Get a verbatim copy of the given line as it is in the document
     */
    this.getLine = function(row) {
        return this.getLines(row, row + 1)[0] || "";
    };

    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };

    /**
     * Returns all lines in the document as string array. Warning: The caller
     * should not modify this array!
     */
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };

    this.getLength = function() {
        return this.$lines.length;
    };

    this.getTextRange = function(range) {
        if (range.start.row == range.end.row) {
            return this.$lines[range.start.row].substring(range.start.column,
                                                         range.end.column);
        }
        else {
            var lines = [];
            lines.push(this.$lines[range.start.row].substring(range.start.column));
            lines.push.apply(lines, this.getLines(range.start.row+1, range.end.row-1));
            lines.push(this.$lines[range.end.row].substring(0, range.end.column));
            return lines.join(this.getNewLineCharacter());
        }
    };

    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length-1).length;
        }
        return position;
    }

    this.insert = function(position, text) {
        if (text.length == 0)
            return position;

        position = this.$clipPosition(position);

        if (this.getLength() <= 1)
            this.$detectNewLine(text);

        var lines = this.$split(text);
        var firstLine = lines.splice(0, 1)[0];
        var lastLine = lines.length == 0 ? null : lines.splice(lines.length - 1, 1)[0];

        this._dispatchEvent("changeStart");
        position = this.insertInLine(position, firstLine);
        if (lastLine !== null) {
            position = this.insertNewLine(position); // terminate first line
            position = this.insertLines(position.row, lines);
            position = this.insertInLine(position, lastLine || "");
        }
        this._dispatchEvent("changeEnd");
        return position;
    };

    this.insertLines = function(row, lines) {
        if (lines.length == 0)
            return {row: row, column: 0};

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        this._dispatchEvent("changeStart");
        var range = new Range(row, 0, row + lines.length, 0);
        var delta = {
            action: "insertLines",
            range: range,
            lines: lines
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");
        return range.end;
    },

    this.insertNewLine = function(position) {
        position = this.$clipPosition(position);
        var line = this.$lines[position.row] || "";

        this._dispatchEvent("changeStart");
        this.$lines[position.row] = line.substring(0, position.column);
        this.$lines.splice(position.row + 1, 0, line.substring(position.column, line.length));

        var end = {
            row : position.row + 1,
            column : 0
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: this.getNewLineCharacter()
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");

        return end;
    };

    this.insertInLine = function(position, text) {
        if (text.length == 0)
            return position;

        var line = this.$lines[position.row] || "";

        this._dispatchEvent("changeStart");
        this.$lines[position.row] = line.substring(0, position.column) + text
                + line.substring(position.column);

        var end = {
            row : position.row,
            column : position.column + text.length
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: text
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");

        return end;
    };

    this.remove = function(range) {
        // clip to document
        range.start = this.$clipPosition(range.start);
        range.end = this.$clipPosition(range.end);

        if (range.isEmpty())
            return range.start;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        this._dispatchEvent("changeStart");
        if (range.isMultiLine()) {
            var firstFullRow = range.start.column == 0 ? firstRow : firstRow + 1;
            var lastFullRow = lastRow - 1;

            if (range.end.column > 0)
                this.removeInLine(lastRow, 0, range.end.column);

            if (lastFullRow >= firstFullRow)
                this.removeLines(firstFullRow, lastFullRow);

            if (firstFullRow != firstRow) {
                this.removeInLine(firstRow, range.start.column, this.getLine(firstRow).length);
                this.removeNewLine(range.start.row);
            }
        }
        else {
            this.removeInLine(firstRow, range.start.column, range.end.column);
        }
        this._dispatchEvent("changeEnd");
        return range.start;
    };

    this.removeInLine = function(row, startColumn, endColumn) {
        if (startColumn == endColumn)
            return;

        var range = new Range(row, startColumn, row, endColumn);
        var line = this.getLine(row);
        var removed = line.substring(startColumn, endColumn);
        var newLine = line.substring(0, startColumn) + line.substring(endColumn, line.length);
        this._dispatchEvent("changeStart");
        this.$lines.splice(row, 1, newLine);

        var delta = {
            action: "removeText",
            range: range,
            text: removed
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");
        return range.start;
    };

    /**
     * Removes a range of full lines
     *
     * @param firstRow {Integer} The first row to be removed
     * @param lastRow {Integer} The last row to be removed
     * @return {String[]} The removed lines
     */
    this.removeLines = function(firstRow, lastRow) {
        this._dispatchEvent("changeStart");
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");
        return removed;
    };

    this.removeNewLine = function(row) {
        var firstLine = this.getLine(row);
        var secondLine = this.getLine(row+1);

        var range = new Range(row, firstLine.length, row+1, 0);
        var line = firstLine + secondLine;

        this._dispatchEvent("changeStart");
        this.$lines.splice(row, 2, line);

        var delta = {
            action: "removeText",
            range: range,
            text: this.getNewLineCharacter()
        };
        this._dispatchEvent("change", { data: delta });
        this._dispatchEvent("changeEnd");
    };

    this.replace = function(range, text) {
        if (text.length == 0 && range.isEmpty())
            return range.start;

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (text == this.getTextRange(range))
            return range.end;

        this._dispatchEvent("changeStart");
        this.remove(range);
        if (text) {
            var end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }
        this._dispatchEvent("changeEnd");

        return end;
    };

    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines)
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text)
            else if (delta.action == "removeLines")
                this.removeLines(range.start.row, range.end.row - 1)
            else if (delta.action == "removeText")
                this.remove(range)
        }
    };

    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            var delta = deltas[i];

            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.removeLines(range.start.row, range.end.row - 1)
            else if (delta.action == "insertText")
                this.remove(range)
            else if (delta.action == "removeLines")
                this.insertLines(range.start.row, delta.lines)
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text)
        }
    };

}).call(Document.prototype);

exports.Document = Document;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/anchor'), ['pilot/oop','pilot/event_emitter'], function (require, exports, module) {


var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

/**
 * An Anchor is a floating pointer in the document. Whenever text is inserted or
 * deleted before the cursor, the position of the cursor is updated
 */
var Anchor = exports.Anchor = function(doc, row, column) {
    this.document = doc;
    
    if (typeof column == "undefined")
        this.setPosition(row.row, row.column);
    else
        this.setPosition(row, column);

    this.$onChange = this.onChange.bind(this);
    doc.on("change", this.$onChange);
};

(function() {

    oop.implement(this, EventEmitter);
    
    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    
    this.getDocument = function() {
        return this.document;
    };
    
    this.onChange = function(e) {
        var delta = e.data;
        var range = delta.range;
            
        if (range.start.row == range.end.row && range.start.row != this.row)
            return;
            
        if (range.start.row > this.row)
            return;
            
        if (range.start.row == this.row && range.start.column > this.column)
            return;
    
        var row = this.row;
        var column = this.column;
        
        if (delta.action === "insertText") {
            if (range.start.row === row && range.start.column <= column) {
                if (range.start.row === range.end.row) {
                    column += range.end.column - range.start.column;
                }
                else {
                    column -= range.start.column;
                    row += range.end.row - range.start.row;
                }
            }
            else if (range.start.row !== range.end.row && range.start.row < row) {
                row += range.end.row - range.start.row;
            }
        } else if (delta.action === "insertLines") {
            if (range.start.row <= row) {
                row += range.end.row - range.start.row;
            }
        }
        else if (delta.action == "removeText") {
            if (range.start.row == row && range.start.column < column) {
                if (range.end.column >= column)
                    column = range.start.column;
                else
                    column = Math.max(0, column - (range.end.column - range.start.column));
                
            } else if (range.start.row !== range.end.row && range.start.row < row) {
                if (range.end.row == row) {
                    column = Math.max(0, column - range.end.column) + range.start.column;
                }
                row -= (range.end.row - range.start.row);
            }
            else if (range.end.row == row) {
                row -= range.end.row - range.start.row;
                column = Math.max(0, column - range.end.column) + range.start.column;
            }
        } else if (delta.action == "removeLines") {
            if (range.start.row <= row) {
                if (range.end.row <= row)
                    row -= range.end.row - range.start.row;
                else {
                    row = range.start.row;
                    column = 0;
                }
            }
        }

        this.setPosition(row, column, true);
    };

    this.setPosition = function(row, column, noClip) {
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        }
        else {
            pos = this.$clipPositionToDocument(row, column);
        }
        
        if (this.row == pos.row && this.column == pos.column)
            return;
            
        var old = {
            row: this.row,
            column: this.column
        };
        
        this.row = pos.row;
        this.column = pos.column;
        this._dispatchEvent("change", {
            old: old,
            value: pos
        });
    };
    
    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    
    this.$clipPositionToDocument = function(row, column) {
        var pos = {};
    
        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }
        
        if (column < 0)
            pos.column = 0;
            
        return pos;
    };
    
}).call(Anchor.prototype);

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/background_tokenizer'), ['pilot/oop','pilot/event_emitter'], function (require, exports, module) {


var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var BackgroundTokenizer = function(tokenizer, editor) {
    this.running = false;    
    this.lines = [];
    this.currentLine = 0;
    this.tokenizer = tokenizer;

    var self = this;

    this.$worker = function() {
        if (!self.running) { return; }

        var workerStart = new Date();
        var startLine = self.currentLine;
        var doc = self.doc;

        var processedLines = 0;

        var len = doc.getLength();
        while (self.currentLine < len) {
            self.lines[self.currentLine] = self.$tokenizeRows(self.currentLine, self.currentLine)[0];
            self.currentLine++;

            // only check every 5 lines
            processedLines += 1;
            if ((processedLines % 5 == 0) && (new Date() - workerStart) > 20) {
                self.fireUpdateEvent(startLine, self.currentLine-1);
                self.running = setTimeout(self.$worker, 20);
                return;
            }
        }

        self.running = false;

        self.fireUpdateEvent(startLine, len - 1);
    };
};

(function(){

    oop.implement(this, EventEmitter);

    this.setTokenizer = function(tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];

        this.start(0);
    };

    this.setDocument = function(doc) {
        this.doc = doc;
        this.lines = [];

        this.stop();
    };

    this.fireUpdateEvent = function(firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._dispatchEvent("update", {data: data});
    };

    this.start = function(startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine,
                                    this.doc.getLength());

        // remove all cached items below this line
        this.lines.splice(this.currentLine, this.lines.length);

        this.stop();
        // pretty long delay to prevent the tokenizer from interfering with the user
        this.running = setTimeout(this.$worker, 700);
    };

    this.stop = function() {
        if (this.running)
            clearTimeout(this.running);
        this.running = false;
    };

    this.getTokens = function(firstRow, lastRow) {
        return this.$tokenizeRows(firstRow, lastRow);
    };

    this.getState = function(row) {
        return this.$tokenizeRows(row, row)[0].state;
    };

    this.$tokenizeRows = function(firstRow, lastRow) {
        if (!this.doc)
            return [];
            
        var rows = [];

        // determine start state
        var state = "start";
        var doCache = false;
        if (firstRow > 0 && this.lines[firstRow - 1]) {
            state = this.lines[firstRow - 1].state;
            doCache = true;
        }

        var lines = this.doc.getLines(firstRow, lastRow);
        for (var row=firstRow; row<=lastRow; row++) {
            if (!this.lines[row]) {
                var tokens = this.tokenizer.getLineTokens(lines[row-firstRow] || "", state);
                var state = tokens.state;
                rows.push(tokens);

                if (doCache) {
                    this.lines[row] = tokens;
                }
            }
            else {
                var tokens = this.lines[row];
                state = tokens.state;
                rows.push(tokens);
            }
        }
        return rows;
    };

}).call(BackgroundTokenizer.prototype);

exports.BackgroundTokenizer = BackgroundTokenizer;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/edit_session/folding'), ['ace/range','ace/edit_session/fold_line'], function (require, exports, module) {


var Range = require("ace/range").Range;
var FoldLine = require("ace/edit_session/fold_line").FoldLine;

/**
 * Simple fold-data struct.
 **/
function Fold(range, placeholder) {
    this.foldLine = null;
    this.placeholder = placeholder;
    this.range = range;
    this.start = range.start;
    this.end = range.end;

    this.sameRow = range.start.row == range.end.row;
    this.subFolds = [];
}

Fold.prototype.toString = function() {
    return '"' + this.placeholder + '" ' + this.range.toString();
}

function Folding() {
    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (foldLine) {
            var folds = foldLine.folds,
                fold;

            for (var i = 0; i < folds.length; i++) {
                fold = folds[i];
                if (fold.range.contains(row, column)) {
                    if (side == 1 && fold.range.isEnd(row, column)) {
                        continue;
                    } else if (side == -1 && fold.range.isStart(row, column)) {
                        continue;
                    }
                    return fold;
                }
            }
        } else {
            return null;
        }
    }

    /**
     * Returns all folds in the given range. Note, that this will return folds
     *
     */
    this.getFoldsInRange = function(range) {
        range = range.clone();
        var start = range.start,
            end = range.end;
        var foldLines = this.$foldData,
            folds,
            fold;
        var cmp,
            foundFolds = [];

        start.column += 1;
        end.column -= 1;

        for (var i = 0; i < foldLines.length; i++) {
            cmp = foldLines[i].range.compareRange(range);
            // Range is before foldLine. No intersection. This means,
            // there might be other foldLines that intersect.
            if (cmp == 2) {
                continue;
            } else
            // Range is after foldLine. There can't be any other foldLines then,
            // so let's give up.
            if (cmp == -2) {
                break;
            }

            folds = foldLines[i].folds;
            for (var j = 0; j < folds.length; j++) {
                fold = folds[j];
                cmp = fold.range.compareRange(range);
                if (cmp == -2) {
                    break;
                } else if (cmp == 2) {
                    continue;
                } else
                // WTF-state: Can happen due to -1/+1 to start/end column.
                if (cmp == 42) {
                    break;
                }
                foundFolds.push(fold);
            }
        }
        return foundFolds;
    }

    /**
     * Returns the string between folds at the given position.
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -> "bar"
     *  foo<fold>bar<fold>wol|rd -> "world"
     *  foo<fold>bar<fo|ld>wolrd -> <null>
     *
     * where | means the position of row/column
     *
     * The trim option determs if the return string should be trimed according
     * to the "side" passed with the trim value:
     *
     * E.g.
     *  foo<fold>b|ar<fold>wolrd -trim=-1> "b"
     *  foo<fold>bar<fold>wol|rd -trim=+1> "rld"
     *  fo|o<fold>bar<fold>wolrd -trim=00> "foo"
     */
    this.getFoldStringAt = function(row, column, trim, foldLine) {
        var foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine) {
            return null;
        } else {
            var fold, lastFold, cmp, str;
            lastFold = {
                end: { column: 0 }
            };
            // TODO: Refactor to use getNextFoldTo function.
            for (var i = 0; i < foldLine.folds.length; i++) {
                fold = foldLine.folds[i];
                cmp = fold.range.compareEnd(row, column);
                if (cmp == -1) {
                    str = this.getLine(fold.start.row).
                                substring(lastFold.end.column, fold.start.column);
                    break;
                } else if (cmp == 0) {
                    return null;
                }
                lastFold = fold;
            }
            if (!str) {
                str = this.getLine(fold.start.row).
                                substring(lastFold.end.column);
            }
            if (trim == -1) {
                return str.substring(0, column - lastFold.end.column);
            } else if (trim == 1) {
                return str.substring(column - lastFold.end.column)
            } else {
                return str;
            }
        }
    }

    this.getFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = Math.max(foldData.indexOf(startFoldLine), 0);
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            } else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    }

    this.$addFoldLine = function(foldLine) {
        this.$foldData.push(foldLine);
        this.$foldData.sort(function(a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    }

    /**
     * Adds a new fold.
     *
     * @returns
     *      The new created Fold object or an existing fold object in case the
     *      passed in range fits an existing fold exactly.
     */
    this.addFold = function(placeholder, startRow, startColumn, endRow, endColumn) {
        var range;
        var foldData = this.$foldData;
        var foldRow  = null;
        var foldLine;
        var fold;
        var argsFold;
        var folds;
        var added = false;

        if (placeholder instanceof Fold) {
            argsFold = placeholder;
            startRow = argsFold.range;
            placeholder = argsFold.placeholder;
        }

        // Normalize parameters.
        if (!(startRow instanceof Range)) {
            range = new Range(startRow, startColumn, endRow, endColumn);
        } else {
            range = startRow;
            startRow = range.start.row;
            startColumn = range.start.column;
            endRow = range.end.row;
            endColumn = range.end.column;
        }

        // --- Some checking ---
        if (placeholder.length < 2) {
            throw "Placeholder has to be at least 2 characters";
        }

        if (startRow == endRow && endColumn - startColumn < 2) {
            throw "The range has to be at least 2 characters width";
        }

        fold = this.getFoldAt(startRow, startColumn, 1);
        if (fold
            && fold.range.isEnd(endRow, endColumn)
            && fold.range.isStart(startRow, startColumn))
        {
            return fold;
        }

        fold = this.getFoldAt(startRow, startColumn, 1);
        if (fold && !fold.range.isStart(startRow, startColumn)) {
            throw "A fold can't start inside of an already existing fold";
        }

        fold = this.getFoldAt(endRow, endColumn, -1);
        if (fold && !fold.range.isEnd(endRow, endColumn)) {
            throw "A fold can't end inside of an already existing fold";
        }

        if (endRow >= this.doc.$lines.length) {
            throw "End of fold is outside of the document.";
        }

        if (endColumn > this.getLine(endRow).length
            || startColumn > this.getLine(startRow).length)
        {
            throw "End of fold is outside of the document.";
        }

        // --- Start adding the fold ---
        // Use the passed in fold or create a new one.
        fold = argsFold || new Fold(range, placeholder);

        // Check if there are folds in the range we create the new fold for.
        folds = this.getFoldsInRange(range);
        if (folds.length > 0) {
            // Remove the folds from fold data.
            this.removeFolds(folds);
            // Add the removed folds as subfolds on the new fold.
            fold.subFolds = folds;
        }

        for (var i = 0; i < foldData.length; i++) {
            foldLine = foldData[i];
            if (endRow == foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            } else if (startRow == foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    // Check if we might have to merge two FoldLines.
                    foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row == endRow) {
                        // We need to merge!
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            } else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added) {
            foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold));
        }

        if (this.$useWrapMode) {
            this.$updateWrapData(foldLine.start.row, foldLine.start.row);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._dispatchEvent("changeFold", { data: fold });

        return fold;
    };

    this.addFolds = function(folds) {
        folds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;
        var startRow = foldLine.start.row;
        var endRow = foldLine.end.row;

        var foldLines = this.$foldData,
            folds = foldLine.folds;
        // Simple case where there is only one fold in the FoldLine such that
        // the entire fold line can get removed directly.
        if (folds.length == 1) {
            foldLines.splice(foldLines.indexOf(foldLine), 1);
        } else
        // If the fold is the last fold of the foldLine, just remove it.
        if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
            folds.pop();
            foldLine.end.row = folds[folds.length - 1].end.row;
            foldLine.end.column = folds[folds.length - 1].end.column;
        } else
        // If the fold is the first fold of the foldLine, just remove it.
        if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
            folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
        } else
        // We know there are more then 2 folds and the fold is not at the edge.
        // This means, the fold is somewhere in between.
        //
        // If the fold is in one row, we just can remove it.
        if (fold.sameRow) {
            folds.splice(folds.indexOf(fold), 1);
        } else
        // The fold goes over more then one row. This means remvoing this fold
        // will cause the fold line to get splitted up.
        {
            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
            newFoldLine.folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
            this.$addFoldLine(newFoldLine);
        }

        if (this.$useWrapMode) {
            this.$updateWrapData(startRow, endRow);
        }

        // Notify that fold data has changed.
        this.$modified = true;
        this._dispatchEvent("changeFold", { data: fold });
    }

    this.removeFolds = function(folds) {
        // We need to clone the folds array passed in as it might be the folds
        // array of a fold line and as we call this.removeFold(fold), folds
        // are removed from folds and changes the current index.
        var cloneFolds = [];
        for (var i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach(function(fold) {
            this.removeFold(fold);
        }, this);
        this.$modified = true;
    }

    this.expandFold = function(fold) {
        this.removeFold(fold);
        fold.subFolds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
        fold.subFolds = [];
    }

    this.expandFolds = function(folds) {
        folds.forEach(function(fold) {
            this.expandFold(fold);
        }, this);
    }

    /**
     * Checks if a given documentRow is folded. This is true if there are some
     * folded parts such that some parts of the line is still visible.
     **/
    this.isRowFolded = function(docRow, startFoldRow) {
        return !!this.getFoldLine(docRow, startFoldRow);
    };

    this.getRowFoldEnd = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return (foldLine
                    ? foldLine.end.row
                    : docRow)
    };

    this.getFoldDisplayLine = function(foldLine, endRow, endColumn, startRow, startColumn) {
        if (startRow == null) {
            startRow = foldLine.start.row;
            startColumn = 0;
        }

        if (endRow == null) {
            endRow = foldLine.end.row;
            endColumn = this.getLine(endRow).length;
        }

        // Build the textline using the FoldLine walker.
        var line = "";
        var lines = this.doc.$lines;
        var textLine = "";

        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (row < startRow) {
                return;
            } else if (row == startRow) {
                if (column < startColumn) {
                    return;
                }
                lastColumn = Math.max(startColumn, lastColumn);
            }
            if (placeholder) {
                textLine += placeholder;
            } else {
                textLine += lines[row].substring(lastColumn, column);
            }
        }.bind(this), endRow, endColumn);
        return textLine;
    };

    this.getDisplayLine = function(row, endColumn, startRow, startColumn) {
        var foldLine = this.getFoldLine(row);

        if (!foldLine) {
            var line;
            line = this.doc.$lines[row];
            return line.substring(startColumn || 0, endColumn || line.length);
        } else {
            return this.getFoldDisplayLine(
                foldLine, row, endColumn, startRow, startColumn);
        }
    };
}

exports.Folding = Folding;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/edit_session/fold_line'), ['ace/range'], function (require, exports, module) {


var Range = require("ace/range").Range;

/**
 * If the an array is passed in, the folds are expected to be sorted already.
 */
function FoldLine(foldData, folds) {
    this.foldData = foldData;
    if (Array.isArray(folds)) {
        this.folds = folds;
    } else {
        folds = this.folds = [ folds ];
    }

    var last = folds[folds.length - 1]
    this.range = new Range(folds[0].start.row, folds[0].start.column,
                           last.end.row, last.end.column);
    this.start = this.range.start;
    this.end   = this.range.end;

    this.folds.forEach(function(fold) {
        fold.foldLine = this;
    }, this);
}

(function() {
    /**
     * Note: This doesn't update wrapData!
     */
    this.shiftRow = function(shift) {
        this.start.row += shift;
        this.end.row += shift;
        this.folds.forEach(function(fold) {
            fold.start.row += shift;
            fold.end.row += shift;
        });
    }

    this.addFold = function(fold) {
        if (fold.sameRow) {
            if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                throw "Can't add a fold to this FoldLine as it has no connection";
            }
            this.folds.push(fold);
            this.folds.sort(function(a, b) {
                return -a.range.compareEnd(b.start.row, b.start.column);
            });
            if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                this.end.row = fold.end.row;
                this.end.column =  fold.end.column;
            } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
        } else if (fold.start.row == this.end.row) {
            this.folds.push(fold);
            this.end.row = fold.end.row;
            this.end.column = fold.end.column;
        } else if (fold.end.row == this.start.row) {
            this.folds.unshift(fold);
            this.start.row = fold.start.row;
            this.start.column = fold.start.column;
        } else {
            throw "Trying to add fold to FoldRow that doesn't have a matching row";
        }
        fold.foldLine = this;
    }

    this.containsRow = function(row) {
        return row >= this.start.row && row <= this.end.row;
    }

    this.walk = function(callback, endRow, endColumn) {
        var lastEnd = 0,
            folds = this.folds,
            fold,
            comp, stop, isNewRow = true;

        if (endRow == null) {
            endRow = this.end.row;
            endColumn = this.end.column;
        }

        for (var i = 0; i < folds.length; i++) {
            fold = folds[i];

            comp = fold.range.compareStart(endRow, endColumn);
            // This fold is after the endRow/Column.
            if (comp == -1) {
                callback(null, endRow, endColumn, lastEnd, isNewRow);
                return;
            }

            stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
            stop = !stop && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd);

            // If the user requested to stop the walk or endRow/endColumn is
            // inside of this fold (comp == 0), then end here.
            if (stop || comp == 0) {
                return;
            }

            // Note the new lastEnd might not be on the same line. However,
            // it's the callback's job to recognize this.
            isNewRow = !fold.sameRow;
            lastEnd = fold.end.column;
        }
        callback(null, endRow, endColumn, lastEnd, isNewRow);
    }

    this.getNextFoldTo = function(row, column) {
        var fold, cmp;
        for (var i = 0; i < this.folds.length; i++) {
            fold = this.folds[i];
            cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                return {
                    fold: fold,
                    kind: "after"
                };
            } else if (cmp == 0) {
                return {
                    fold: fold,
                    kind: "inside"
                }
            }
        }
        return null;
    }

    this.addRemoveChars = function(row, column, len) {
        var ret = this.getNextFoldTo(row, column),
            fold, folds;
        if (ret) {
            fold = ret.fold;
            if (ret.kind == "inside"
                && fold.start.column != column
                && fold.start.row != row)
            {
                throw "Moving characters inside of a fold should never be reached";
            } else if (fold.start.row == row) {
                folds = this.folds;
                var i = folds.indexOf(fold);
                if (i == 0) {
                    this.start.column += len;
                }
                for (i; i < folds.length; i++) {
                    fold = folds[i];
                    fold.start.column += len;
                    if (!fold.sameRow) {
                        return;
                    }
                    fold.end.column += len;
                }
                this.end.column += len;
            }
        }
    }

    this.split = function(row, column) {
        var fold = this.getNextFoldTo(row, column).fold,
            folds = this.folds;
        var foldData = this.foldData;

        if (!fold) {
            return null;
        }
        var i = folds.indexOf(fold);
        var foldBefore = folds[i - 1];
        this.end.row = foldBefore.end.row;
        this.end.column = foldBefore.end.column;

        // Remove the folds after row/column and create a new FoldLine
        // containing these removed folds.
        folds = folds.splice(i, folds.length - i);

        var newFoldLine = new FoldLine(foldData, folds);
        foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
        return newFoldLine;
    }

    this.merge = function(foldLineNext) {
        var folds = foldLineNext.folds;
        for (var i = 0; i < folds.length; i++) {
            this.addFold(folds[i]);
        }
        // Remove the foldLineNext - no longer needed, as
        // it's merged now with foldLineNext.
        var foldData = this.foldData;
        foldData.splice(foldData.indexOf(foldLineNext), 1);
    }

    this.toString = function() {
        var ret = [this.range.toString() + ": [" ];

        this.folds.forEach(function(fold) {
            ret.push("  " + fold.toString());
        });
        ret.push("]")
        return ret.join("\n");
    }

    this.idxToPosition = function(idx) {
        var lastFoldEndColumn = 0;
        var fold;

        for (var i = 0; i < this.folds.length; i++) {
            var fold = this.folds[i];

            idx -= fold.start.column - lastFoldEndColumn;
            if (idx < 0) {
                return {
                    row: fold.start.row,
                    column: fold.start.column + idx
                };
            }

            idx -= fold.placeholder.length;
            if (idx < 0) {
                return fold.start;
            }

            lastFoldEndColumn = fold.end.column;
        }

        return {
            row: this.end.row,
            column: this.end.column + idx
        };
    }
}).call(FoldLine.prototype);

exports.FoldLine = FoldLine;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/search'), ['pilot/lang','pilot/oop','ace/range'], function (require, exports, module) {


var lang = require("pilot/lang");
var oop = require("pilot/oop");
var Range = require("ace/range").Range;

var Search = function() {
    this.$options = {
        needle: "",
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        scope: Search.ALL,
        regExp: false
    };
};

Search.ALL = 1;
Search.SELECTION = 2;

(function() {

    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };
    
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };

    this.find = function(session) {
        if (!this.$options.needle)
            return null;

        if (this.$options.backwards) {
            var iterator = this.$backwardMatchIterator(session);
        } else {
            iterator = this.$forwardMatchIterator(session);
        }

        var firstRange = null;
        iterator.forEach(function(range) {
            firstRange = range;
            return true;
        });

        return firstRange;
    };

    this.findAll = function(session) {
        if (!this.$options.needle)
            return [];

        if (this.$options.backwards) {
            var iterator = this.$backwardMatchIterator(session);
        } else {
            iterator = this.$forwardMatchIterator(session);
        }

        var ranges = [];
        iterator.forEach(function(range) {
            ranges.push(range);
        });

        return ranges;
    };

    this.replace = function(input, replacement) {
        var re = this.$assembleRegExp();
        var match = re.exec(input);
        if (match && match[0].length == input.length) {
            if (this.$options.regExp) {
                return input.replace(re, replacement);
            } else {
                return replacement;
            }
        } else {
            return null;
        }
    };

    this.$forwardMatchIterator = function(session) {
        var re = this.$assembleRegExp();
        var self = this;

        return {
            forEach: function(callback) {
                self.$forwardLineIterator(session).forEach(function(line, startIndex, row) {
                    if (startIndex) {
                        line = line.substring(startIndex);
                    }

                    var matches = [];

                    line.replace(re, function(str) {
                        var offset = arguments[arguments.length-2];
                        matches.push({
                            str: str,
                            offset: startIndex + offset
                        });
                        return str;
                    });

                    for (var i=0; i<matches.length; i++) {
                        var match = matches[i];
                        var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                        if (callback(range))
                            return true;
                    }

                });
            }
        };
    };

    this.$backwardMatchIterator = function(session) {
        var re = this.$assembleRegExp();
        var self = this;

        return {
            forEach: function(callback) {
                self.$backwardLineIterator(session).forEach(function(line, startIndex, row) {
                    if (startIndex) {
                        line = line.substring(startIndex);
                    }

                    var matches = [];

                    line.replace(re, function(str, offset) {
                        matches.push({
                            str: str,
                            offset: startIndex + offset
                        });
                        return str;
                    });

                    for (var i=matches.length-1; i>= 0; i--) {
                        var match = matches[i];
                        var range = self.$rangeFromMatch(row, match.offset, match.str.length);
                        if (callback(range))
                            return true;
                    }
                });
            }
        };
    };

    this.$rangeFromMatch = function(row, column, length) {
        return new Range(row, column, row, column+length);
    };

    this.$assembleRegExp = function() {
        if (this.$options.regExp) {
            var needle = this.$options.needle;
        } else {
            needle = lang.escapeRegExp(this.$options.needle);
        }

        if (this.$options.wholeWord) {
            needle = "\\b" + needle + "\\b";
        }

        var modifier = "g";
        if (!this.$options.caseSensitive) {
            modifier += "i";
        }

        var re = new RegExp(needle, modifier);
        return re;
    };

    this.$forwardLineIterator = function(session) {
        var searchSelection = this.$options.scope == Search.SELECTION;

        var range = session.getSelection().getRange();
        var start = session.getSelection().getCursor();

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;
        var inWrap = false;

        function getLine(row) {
            var line = session.getLine(row);
            if (searchSelection && row == range.end.row) {
                line = line.substring(0, range.end.column);
            }
            if (inWrap && row == start.row) {
                line = line.substring(0, start.column);
            }
            return line;
        }

        return {
            forEach: function(callback) {
                var row = start.row;

                var line = getLine(row);
                var startIndex = start.column;

                var stop = false;
                inWrap = false;

                while (!callback(line, startIndex, row)) {

                    if (stop) {
                        return;
                    }

                    row++;
                    startIndex = 0;

                    if (row > lastRow) {
                        if (wrap) {
                            row = firstRow;
                            startIndex = firstColumn;
                            inWrap = true;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = getLine(row);
                }
            }
        };
    };

    this.$backwardLineIterator = function(session) {
        var searchSelection = this.$options.scope == Search.SELECTION;

        var range = session.getSelection().getRange();
        var start = searchSelection ? range.end : range.start;

        var firstRow = searchSelection ? range.start.row : 0;
        var firstColumn = searchSelection ? range.start.column : 0;
        var lastRow = searchSelection ? range.end.row : session.getLength() - 1;

        var wrap = this.$options.wrap;

        return {
            forEach : function(callback) {
                var row = start.row;

                var line = session.getLine(row).substring(0, start.column);
                var startIndex = 0;
                var stop = false;
                var inWrap = false;

                while (!callback(line, startIndex, row)) {

                    if (stop)
                        return;

                    row--;
                    startIndex = 0;

                    if (row < firstRow) {
                        if (wrap) {
                            row = lastRow;
                            inWrap = true;
                        } else {
                            return;
                        }
                    }

                    if (row == start.row)
                        stop = true;

                    line = session.getLine(row);
                    if (searchSelection) {
                        if (row == firstRow)
                            startIndex = firstColumn;
                        else if (row == lastRow)
                            line = line.substring(0, range.end.column);
                    }

                    if (inWrap && row == start.row)
                        startIndex = start.column;
                }
            }
        };
    };

}).call(Search.prototype);

exports.Search = Search;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/virtual_renderer'), ['pilot/oop','pilot/dom','pilot/event','pilot/useragent','ace/layer/gutter','ace/layer/marker','ace/layer/text','ace/layer/cursor','ace/scrollbar','ace/renderloop','pilot/event_emitter','text!ace/css/editor.css'], function (require, exports, module) {


var oop = require("pilot/oop");
var dom = require("pilot/dom");
var event = require("pilot/event");
var useragent = require("pilot/useragent");
var GutterLayer = require("ace/layer/gutter").Gutter;
var MarkerLayer = require("ace/layer/marker").Marker;
var TextLayer = require("ace/layer/text").Text;
var CursorLayer = require("ace/layer/cursor").Cursor;
var ScrollBar = require("ace/scrollbar").ScrollBar;
var RenderLoop = require("ace/renderloop").RenderLoop;
var EventEmitter = require("pilot/event_emitter").EventEmitter;
var editorCss = require("text!ace/css/editor.css");

// import CSS once
dom.importCssString(editorCss);

var VirtualRenderer = function(container, theme) {
    this.container = container;
    dom.addCssClass(this.container, "ace_editor");

    this.setTheme(theme);

    this.$gutter = dom.createElement("div");
    this.$gutter.className = "ace_gutter";
    this.container.appendChild(this.$gutter);

    this.scroller = dom.createElement("div");
    this.scroller.className = "ace_scroller";
    this.container.appendChild(this.scroller);

    this.content = dom.createElement("div");
    this.content.className = "ace_content";
    this.scroller.appendChild(this.content);

    this.$gutterLayer = new GutterLayer(this.$gutter);
    this.$markerBack = new MarkerLayer(this.content);

    var textLayer = this.$textLayer = new TextLayer(this.content);
    this.canvas = textLayer.element;

    this.$markerFront = new MarkerLayer(this.content);

    this.characterWidth = textLayer.getCharacterWidth();
    this.lineHeight = textLayer.getLineHeight();

    this.$cursorLayer = new CursorLayer(this.content);
    this.$cursorPadding = 8;

    // Indicates whether the horizontal scrollbar is visible
    this.$horizScroll = true;
    this.$horizScrollAlwaysVisible = true;

    this.scrollBar = new ScrollBar(container);
    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));

    this.scrollTop = 0;

    this.cursorPos = {
        row : 0,
        column : 0
    };

    var _self = this;
    this.$textLayer.addEventListener("changeCharaterSize", function() {
        _self.characterWidth = textLayer.getCharacterWidth();
        _self.lineHeight = textLayer.getLineHeight();
        _self.$updatePrintMargin();
        _self.onResize(true);

        _self.$loop.schedule(_self.CHANGE_FULL);
    });
    event.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
    event.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));

    this.$size = {
        width: 0,
        height: 0,
        scrollerHeight: 0,
        scrollerWidth: 0
    };

    this.$loop = new RenderLoop(this.$renderChanges.bind(this));
    this.$loop.schedule(this.CHANGE_FULL);

    this.setPadding(4);
    this.$updatePrintMargin();
};

(function() {
    this.showGutter = true;

    this.CHANGE_CURSOR = 1;
    this.CHANGE_MARKER = 2;
    this.CHANGE_GUTTER = 4;
    this.CHANGE_SCROLL = 8;
    this.CHANGE_LINES = 16;
    this.CHANGE_TEXT = 32;
    this.CHANGE_SIZE = 64;
    this.CHANGE_MARKER_BACK = 128;
    this.CHANGE_MARKER_FRONT = 256;
    this.CHANGE_FULL = 512;

    oop.implement(this, EventEmitter);

    this.setSession = function(session) {
        this.session = session;
        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(this.CHANGE_FULL);
    };

    /**
     * Triggers partial update of the text layer
     */
    this.updateLines = function(firstRow, lastRow) {
        if (lastRow === undefined)
            lastRow = Infinity;

        if (!this.$changedLines) {
            this.$changedLines = {
                firstRow: firstRow,
                lastRow: lastRow
            };
        }
        else {
            if (this.$changedLines.firstRow > firstRow)
                this.$changedLines.firstRow = firstRow;

            if (this.$changedLines.lastRow < lastRow)
                this.$changedLines.lastRow = lastRow;
        }

        this.$loop.schedule(this.CHANGE_LINES);
    };

    /**
     * Triggers full update of the text layer
     */
    this.updateText = function() {
        this.$loop.schedule(this.CHANGE_TEXT);
    };

    /**
     * Triggers a full update of all layers
     */
    this.updateFull = function() {
        this.$loop.schedule(this.CHANGE_FULL);
    };

    this.updateFontSize = function() {
        this.$textLayer.checkForSizeChanges();
    };

    /**
     * Triggers resize of the editor
     */
    this.onResize = function(force) {
        var changes = this.CHANGE_SIZE;

        var height = dom.getInnerHeight(this.container);
        if (force || this.$size.height != height) {
            this.$size.height = height;

            this.scroller.style.height = height + "px";
            this.scrollBar.setHeight(this.scroller.clientHeight);

            if (this.session) {
                this.scrollToY(this.getScrollTop());
                changes = changes | this.CHANGE_FULL;
            }
        }

        var width = dom.getInnerWidth(this.container);
        if (force || this.$size.width != width) {
            this.$size.width = width;

            var gutterWidth = this.showGutter ? this.$gutter.offsetWidth : 0;
            this.scroller.style.left = gutterWidth + "px";
            this.scroller.style.width = Math.max(0, width - gutterWidth - this.scrollBar.getWidth()) + "px";

            if (this.session.getUseWrapMode()) {
                var availableWidth = this.scroller.clientWidth - this.$padding * 2;
                var limit = Math.floor(availableWidth / this.characterWidth) - 1;
                if (this.session.adjustWrapLimit(limit) || force) {
                    changes = changes | this.CHANGE_FULL;
                }
            }
        }

        this.$size.scrollerWidth = this.scroller.clientWidth;
        this.$size.scrollerHeight = this.scroller.clientHeight;
        this.$loop.schedule(changes);
    };

    this.$onGutterClick = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);

        this._dispatchEvent("gutter" + e.type, {
            row: this.screenToTextCoordinates(pageX, pageY).row,
            htmlEvent: e
        });
    };

    this.setShowInvisibles = function(showInvisibles) {
        if (this.$textLayer.setShowInvisibles(showInvisibles))
            this.$loop.schedule(this.CHANGE_TEXT);
    };

    this.getShowInvisibles = function() {
        return this.$textLayer.showInvisibles;
    };

    this.$showPrintMargin = true;
    this.setShowPrintMargin = function(showPrintMargin) {
        this.$showPrintMargin = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getShowPrintMargin = function() {
        return this.$showPrintMargin;
    };

    this.$printMarginColumn = 80;
    this.setPrintMarginColumn = function(showPrintMargin) {
        this.$printMarginColumn = showPrintMargin;
        this.$updatePrintMargin();
    };

    this.getPrintMarginColumn = function() {
        return this.$printMarginColumn;
    };

    this.getShowGutter = function(){
        return this.showGutter;
    }

    this.setShowGutter = function(show){
        if(this.showGutter === show)
            return;
        this.$gutter.style.display = show ? "block" : "none";
        this.showGutter = show;
        this.onResize(true);
    }

    this.$updatePrintMargin = function() {
        var containerEl

        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            containerEl = dom.createElement("div");
            containerEl.className = "ace_print_margin_layer";
            this.$printMarginEl = dom.createElement("div")
            this.$printMarginEl.className = "ace_print_margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.$textLayer.element);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding * 2) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";
    };

    this.getContainerElement = function() {
        return this.container;
    };

    this.getMouseEventTarget = function() {
        return this.content;
    };

    this.getTextAreaContainer = function() {
        return this.container;
    };

    this.moveTextAreaToCursor = function(textarea) {
        // in IE the native cursor always shines through
        if (useragent.isIE)
            return;

        var pos = this.$cursorLayer.getPixelPosition();
        if (!pos)
            return;

        var bounds = this.content.getBoundingClientRect();
        var offset = (this.layerConfig && this.layerConfig.offset) || 0;

        textarea.style.left = (bounds.left + pos.left + this.$padding) + "px";
        textarea.style.top = (bounds.top + pos.top - this.scrollTop + offset) + "px";
    };

    this.getFirstVisibleRow = function() {
        return (this.layerConfig || {}).firstRow || 0;
    };

    this.getFirstFullyVisibleRow = function(){
        if (!this.layerConfig)
            return 0;

        return this.layerConfig.firstRow + (this.layerConfig.offset == 0 ? 0 : 1);
    }

    this.getLastFullyVisibleRow = function() {
        if (!this.layerConfig)
            return 0;

        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    }

    this.getLastVisibleRow = function() {
        return (this.layerConfig || {}).lastRow || 0;
    };

    this.$padding = null;
    this.setPadding = function(padding) {
        this.$padding = padding;
        this.content.style.padding = "0 " + padding + "px";
        this.$loop.schedule(this.CHANGE_FULL);
        this.$updatePrintMargin();
    };

    this.getHScrollBarAlwaysVisible = function() {
        return this.$horizScrollAlwaysVisible;
    }

    this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
        if (this.$horizScrollAlwaysVisible != alwaysVisible) {
            this.$horizScrollAlwaysVisible = alwaysVisible;
            if (!this.$horizScrollAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        }
    }

    this.onScroll = function(e) {
        this.scrollToY(e.data);
    };

    this.$updateScrollBar = function() {
        this.scrollBar.setInnerHeight(this.session.getScreenLength() * this.lineHeight);
        this.scrollBar.setScrollTop(this.scrollTop);
    };

    this.$renderChanges = function(changes) {
        if (!changes || !this.session)
            return;

        // text, scrolling and resize changes can cause the view port size to change
        if (!this.layerConfig ||
            changes & this.CHANGE_FULL ||
            changes & this.CHANGE_SIZE ||
            changes & this.CHANGE_TEXT ||
            changes & this.CHANGE_LINES ||
            changes & this.CHANGE_SCROLL
        )
            this.$computeLayerConfig();

        // full
        if (changes & this.CHANGE_FULL) {
            this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar();
            this.scrollCursorIntoView();
            return;
        }

        // scrolling
        if (changes & this.CHANGE_SCROLL) {
            if (changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES)
                this.$textLayer.update(this.layerConfig);
            else
                this.$textLayer.scrollLines(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
            this.$markerBack.update(this.layerConfig);
            this.$markerFront.update(this.layerConfig);
            this.$cursorLayer.update(this.layerConfig);
            this.$updateScrollBar();
            return;
        }

        if (changes & this.CHANGE_TEXT) {
            this.$textLayer.update(this.layerConfig);
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        }
        else if (changes & this.CHANGE_LINES) {
            this.$updateLines();
            this.$updateScrollBar();
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        } else if (changes & this.CHANGE_GUTTER) {
            this.showGutter && this.$gutterLayer.update(this.layerConfig);
        }

        if (changes & this.CHANGE_CURSOR)
            this.$cursorLayer.update(this.layerConfig);

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(this.layerConfig);
        }

        if (changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK)) {
            this.$markerBack.update(this.layerConfig);
        }

        if (changes & this.CHANGE_SIZE)
            this.$updateScrollBar();
    };

    this.$computeLayerConfig = function() {
        var session = this.session;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = this.$size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();
        var widthChanged = !this.layerConfig ? true : (this.layerConfig.width != longestLine);

        var horizScroll = this.$horizScrollAlwaysVisible || this.$size.scrollerWidth - longestLine < 0;
        var horizScrollChanged = this.$horizScroll !== horizScroll;
        this.$horizScroll = horizScroll;
        if (horizScrollChanged)
            this.scroller.style.overflowX = horizScroll ? "scroll" : "hidden";

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;

        // Map lines on the screen to lines in the document.
        var firstRowScreen, firstRowHeight;
        var lineHeight = { lineHeight: this.lineHeight };
        firstRow = session.screenToDocumentRow(firstRow, 0);

        // Check if firstRow is inside of a foldLine. If true, then use the first
        // row of the foldLine.
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowHeight(lineHeight, firstRow);

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = this.$size.scrollerHeight + session.getRowHeight(lineHeight, lastRow)+
                                                firstRowHeight;

        offset = this.scrollTop - firstRowScreen * this.lineHeight;

        var layerConfig = this.layerConfig = {
            width : longestLine,
            padding : this.$padding,
            firstRow : firstRow,
            firstRowScreen: firstRowScreen,
            lastRow : lastRow,
            lineHeight : this.lineHeight,
            characterWidth : this.characterWidth,
            minHeight : minHeight,
            offset : offset,
            height : this.$size.scrollerHeight
        };

        // For debugging.
        // console.log(JSON.stringify(layerConfig));

        this.$gutterLayer.element.style.marginTop = (-offset) + "px";
        this.content.style.marginTop = (-offset) + "px";
        this.content.style.width = longestLine + "px";
        this.content.style.height = minHeight + "px";

        // Horizontal scrollbar visibility may have changed, which changes
        // the client height of the scroller
        if (horizScrollChanged)
            this.onResize(true);
    };

    this.$updateLines = function() {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        // if the update changes the width of the document do a full redraw
        if (layerConfig.width != this.$getLongestLine())
            return this.$textLayer.update(layerConfig);

        if (firstRow > layerConfig.lastRow + 1) { return; }
        if (lastRow < layerConfig.firstRow) { return; }

        // if the last row is unknown -> redraw everything
        if (lastRow === Infinity) {
            this.showGutter && this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }

        // else update only the changed rows
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
    };

    this.$getLongestLine = function() {
        var charCount = this.session.getScreenWidth() + 1;
        if (this.$textLayer.showInvisibles)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - this.$padding * 2, Math.round(charCount * this.characterWidth));
    };

    this.updateFrontMarkers = function() {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(this.CHANGE_MARKER_FRONT);
    };

    this.updateBackMarkers = function() {
        this.$markerBack.setMarkers(this.session.getMarkers());
        this.$loop.schedule(this.CHANGE_MARKER_BACK);
    };

    this.addGutterDecoration = function(row, className){
        this.$gutterLayer.addGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    this.removeGutterDecoration = function(row, className){
        this.$gutterLayer.removeGutterDecoration(row, className);
        this.$loop.schedule(this.CHANGE_GUTTER);
    }

    this.setBreakpoints = function(rows) {
        this.$gutterLayer.setBreakpoints(rows);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.setAnnotations = function(annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(this.CHANGE_GUTTER);
    };

    this.updateCursor = function() {
        this.$loop.schedule(this.CHANGE_CURSOR);
    };

    this.hideCursor = function() {
        this.$cursorLayer.hideCursor();
    };

    this.showCursor = function() {
        this.$cursorLayer.showCursor();
    };

    this.scrollCursorIntoView = function() {
        // the editor is not visible
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition();

        var left = pos.left + this.$padding;
        var top = pos.top;

        if (this.getScrollTop() > top) {
            this.scrollToY(top);
        }

        if (this.getScrollTop() + this.$size.scrollerHeight < top
                + this.lineHeight) {
            this.scrollToY(top + this.lineHeight - this.$size.scrollerHeight);
        }

        if (this.scroller.scrollLeft > left) {
            this.scrollToX(left);
        }

        if (this.scroller.scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {

            if (left + this.characterWidth > this.scroller.scrollWidth)
                this.$renderChanges(this.CHANGE_SIZE);

            this.scrollToX(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        }
    },

    this.getScrollTop = function() {
        return this.scrollTop;
    };

    this.getScrollLeft = function() {
        return this.scroller.scrollLeft;
    };

    this.getScrollTopRow = function() {
        return this.scrollTop / this.lineHeight;
    };

    this.getScrollBottomRow = function() {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    }

    this.scrollToRow = function(row) {
        this.scrollToY(row * this.lineHeight);
    };

    this.scrollToLine = function(line, center) {
        var lineHeight = { lineHeight: this.lineHeight };
        var offset = 0;
        for (var l = 1; l < line; l++) {
            offset += this.session.getRowHeight(lineHeight, l-1);
        }

        if (center) {
            offset -= this.$size.scrollerHeight / 2;
        }
        this.scrollToY(offset);
    };

    this.scrollToY = function(scrollTop) {
        var maxHeight = this.session.getScreenLength() * this.lineHeight - this.$size.scrollerHeight;
        var scrollTop = Math.max(0, Math.min(maxHeight, scrollTop));

        if (this.scrollTop !== scrollTop) {
            this.scrollTop = scrollTop;
            this.$loop.schedule(this.CHANGE_SCROLL);
        }
    };

    this.scrollToX = function(scrollLeft) {
        if (scrollLeft <= this.$padding)
            scrollLeft = 0;

        this.scroller.scrollLeft = scrollLeft;
    };

    this.scrollBy = function(deltaX, deltaY) {
        deltaY && this.scrollToY(this.scrollTop + deltaY);
        deltaX && this.scrollToX(this.scroller.scrollLeft + deltaX);
    };

    this.screenToTextCoordinates = function(pageX, pageY) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((pageX + this.scroller.scrollLeft - canvasPos.left - this.$padding - dom.getPageScrollLeft())
                / this.characterWidth);
        var row = Math.floor((pageY + this.scrollTop - canvasPos.top - dom.getPageScrollTop())
                / this.lineHeight);

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };

    this.textToScreenCoordinates = function(row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.getScrollLeft(),
            pageY: canvasPos.top + y - this.getScrollTop()
        }
    };

    this.visualizeFocus = function() {
        dom.addCssClass(this.container, "ace_focus");
    };

    this.visualizeBlur = function() {
        dom.removeCssClass(this.container, "ace_focus");
    };

    this.showComposition = function(position) {
        if (!this.$composition) {
            this.$composition = dom.createElement("div");
            this.$composition.className = "ace_composition";
            this.content.appendChild(this.$composition);
        }

        this.$composition.innerHTML = "&#160;";

        var pos = this.$cursorLayer.getPixelPosition();
        var style = this.$composition.style;
        style.top = pos.top + "px";
        style.left = (pos.left + this.$padding) + "px";
        style.height = this.lineHeight + "px";

        this.hideCursor();
    };

    this.setCompositionText = function(text) {
        dom.setInnerText(this.$composition, text);
    };

    this.hideComposition = function() {
        this.showCursor();

        if (!this.$composition)
            return;

        var style = this.$composition.style;
        style.top = "-10000px";
        style.left = "-10000px";
    };

    this.setTheme = function(theme) {
        var _self = this;
        if (!theme || typeof theme == "string") {
            theme = theme || "ace/theme/textmate";
            require([theme], function(theme) {
                afterLoad(theme);
            });
        } else {
            afterLoad(theme);
        }

        var _self = this;
        function afterLoad(theme) {
            if (_self.$theme)
                dom.removeCssClass(_self.container, _self.$theme);

            _self.$theme = theme ? theme.cssClass : null;

            if (_self.$theme)
                dom.addCssClass(_self.container, _self.$theme);

            // force re-measure of the gutter width
            if (_self.$size) {
                _self.$size.width = 0;
                _self.onResize();
            }
        }
    };

    // Methods allows to add / remove CSS classnames to the editor element.
    // This feature can be used by plug-ins to provide a visual indication of
    // a certain mode that editor is in.

    this.setStyle = function setStyle(style) {
      dom.addCssClass(this.container, style)
    };

    this.unsetStyle = function unsetStyle(style) {
      dom.removeCssClass(this.container, style)
    };

}).call(VirtualRenderer.prototype);

exports.VirtualRenderer = VirtualRenderer;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/layer/gutter'), ['pilot/dom'], function (require, exports, module) {


var dom = require("pilot/dom");

var Gutter = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);

    this.$breakpoints = [];
    this.$annotations = [];
    this.$decorations = [];
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };

    this.addGutterDecoration = function(row, className){
        if (!this.$decorations[row])
            this.$decorations[row] = "";
        this.$decorations[row] += " ace_" + className;
    }

    this.removeGutterDecoration = function(row, className){
        this.$decorations[row] = this.$decorations[row].replace(" ace_" + className, "");
    };

    this.setBreakpoints = function(rows) {
        this.$breakpoints = rows.concat();
    };

    this.setAnnotations = function(annotations) {
        // iterate over sparse array
        this.$annotations = [];
        for (var row in annotations) if (annotations.hasOwnProperty(row)) {
            var rowAnnotations = annotations[row];
            if (!rowAnnotations)
                continue;

            var rowInfo = this.$annotations[row] = {
                text: []
            };
            for (var i=0; i<rowAnnotations.length; i++) {
                var annotation = rowAnnotations[i];
                rowInfo.text.push(annotation.text.replace(/"/g, "&quot;").replace(/'/g, "&#8217;").replace(/</, "&lt;"));
                var type = annotation.type;
                if (type == "error")
                    rowInfo.className = "ace_error";
                else if (type == "warning" && rowInfo.className != "ace_error")
                    rowInfo.className = "ace_warning";
                else if (type == "info" && (!rowInfo.className))
                    rowInfo.className = "ace_info";
            }
        }
    };

    this.update = function(config) {
        this.$config = config;

        var html = [];
        for ( var i = config.firstRow; i <= config.lastRow; i++) {
            var annotation = this.$annotations[i] || {
                className: "",
                text: []
            };
            html.push("<div class='ace_gutter-cell",
                this.$decorations[i] || "",
                this.$breakpoints[i] ? " ace_breakpoint " : " ",
                annotation.className,
                "' title='", annotation.text.join("\n"),
                "' style='height:", this.session.getRowHeight(config, i), "px;'>", (i+1), "</div>");


            i = this.session.getRowFoldEnd(i);
        }
		this.element = dom.setInnerHtml(this.element, html.join(""));
        this.element.style.height = config.minHeight + "px";
    };

}).call(Gutter.prototype);

exports.Gutter = Gutter;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/layer/marker'), ['ace/range','pilot/dom'], function (require, exports, module) {


var Range = require("ace/range").Range;
var dom = require("pilot/dom");

var Marker = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_marker-layer";
    parentEl.appendChild(this.element);
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };
    
    this.setMarkers = function(markers) {
        this.markers = markers;
    };

    this.update = function(config) {
        var config = config || this.config;
        if (!config)
            return;

        this.config = config;

        var html = [];        
        for ( var key in this.markers) {
            var marker = this.markers[key];

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty()) continue;

            range = range.toScreenRange(this.session);

            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = Math.round(range.start.column * config.characterWidth);        
                marker.renderer(html, range, left, top, config);
            }
            else if (range.isMultiLine()) {
                if (marker.type == "text") {
                    this.drawTextMarker(html, range, marker.clazz, config);
                } else {
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
                }
            }
            else {
                this.drawSingleLineMarker(html, range, marker.clazz, config);
            }
        }
        this.element = dom.setInnerHtml(this.element, html.join(""));
    };

    this.$getTop = function(row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };

    this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig) {
        // selection start
        var row = range.start.row;

        var lineRange = new Range(row, range.start.column,
                                  row, this.session.getScreenLastRowColumn(row));
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 1);

        // selection end
        var row = range.end.row;
        var lineRange = new Range(row, 0, row, range.end.column);
        this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig);

        for (var row = range.start.row + 1; row < range.end.row; row++) {
            lineRange.start.row = row;
            lineRange.end.row = row;
            lineRange.end.column = this.session.getScreenLastRowColumn(row);
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz, layerConfig, 1);
        }
    };

    this.drawMultiLineMarker = function(stringBuilder, range, clazz, layerConfig) {
        // from selection start to the end of the line
        var height = layerConfig.lineHeight;
        var width = Math.round(layerConfig.width - (range.start.column * layerConfig.characterWidth));
        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;'></div>"
        );

        // from start of the last line to the selection end
        var top = this.$getTop(range.end.row, layerConfig);
        var width = Math.round(range.end.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "width:", width, "px;'></div>"
        );

        // all the complete lines
        var height = (range.end.row - range.start.row - 1) * layerConfig.lineHeight;
        if (height < 0)
            return;
        var top = this.$getTop(range.start.row + 1, layerConfig);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", layerConfig.width, "px;",
            "top:", top, "px;'></div>"
        );
    };

    this.drawSingleLineMarker = function(stringBuilder, range, clazz, layerConfig, extraLength) {
        var height = layerConfig.lineHeight;
        var width = Math.round((range.end.column + (extraLength || 0) - range.start.column) * layerConfig.characterWidth);
        var top = this.$getTop(range.start.row, layerConfig);
        var left = Math.round(range.start.column * layerConfig.characterWidth);

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left,"px;'></div>"
        );
    };

}).call(Marker.prototype);

exports.Marker = Marker;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/layer/text'), ['pilot/oop','pilot/dom','pilot/lang','pilot/useragent','pilot/event_emitter'], function (require, exports, module) {


var oop = require("pilot/oop");
var dom = require("pilot/dom");
var lang = require("pilot/lang");
var useragent = require("pilot/useragent");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Text = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_text-layer";
    parentEl.appendChild(this.element);

    this.$characterSize = this.$measureSizes() || {width: 0, height: 0};
    this.$pollSizeChanges();
};

(function() {

    oop.implement(this, EventEmitter);

    this.EOF_CHAR = "&para;";
    this.EOL_CHAR = "&not;";
    this.TAB_CHAR = "&rarr;";
    this.SPACE_CHAR = "&middot;";

    this.getLineHeight = function() {
        return this.$characterSize.height || 1;
    };

    this.getCharacterWidth = function() {
        return this.$characterSize.width || 1;
    };

    this.checkForSizeChanges = function() {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$characterSize = size;
            this._dispatchEvent("changeCharaterSize", {data: size});
        }
    };

    this.$pollSizeChanges = function() {
        var self = this;
        setInterval(function() {
            self.checkForSizeChanges();
        }, 500);
    };

    this.$fontStyles = {
        fontFamily : 1,
        fontSize : 1,
        fontWeight : 1,
        fontStyle : 1,
        lineHeight : 1
    };

    this.$measureSizes = function() {
        var n = 1000;
        if (!this.$measureNode) {
            var measureNode = this.$measureNode = dom.createElement("div");
            var style = measureNode.style;

            style.width = style.height = "auto";
            style.left = style.top = (-n * 40)  + "px";

            style.visibility = "hidden";
            style.position = "absolute";
            style.overflow = "visible";
            style.whiteSpace = "nowrap";

            // in FF 3.6 monospace fonts can have a fixed sub pixel width.
            // that's why we have to measure many characters
            // Note: characterWidth can be a float!
            measureNode.innerHTML = lang.stringRepeat("Xy", n);

            if (document.body) {
                document.body.appendChild(measureNode);
            } else {
                var container = this.element.parentNode;
                while (!dom.hasCssClass(container, "ace_editor"))
                    container = container.parentNode;
                container.appendChild(measureNode);
            }

        }

        var style = this.$measureNode.style;
        for (var prop in this.$fontStyles) {
            var value = dom.computedStyle(this.element, prop);
            style[prop] = value;
        }

        var size = {
            height: this.$measureNode.offsetHeight,
            width: this.$measureNode.offsetWidth / (n * 2)
        };

        // Size and width can be null if the editor is not visible or
        // detached from the document
        if (size.width == 0 && size.height == 0)
            return null;

        return size;
    };

    this.setSession = function(session) {
        this.session = session;
    };

    this.showInvisibles = false;
    this.setShowInvisibles = function(showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        return true;
    };

    this.$tabStrings = [];
    this.$computeTabString = function() {
        var tabSize = this.session.getTabSize();
        var tabStr = this.$tabStrings = [0];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                tabStr.push("<span class='ace_invisible'>"
                    + this.TAB_CHAR
                    + new Array(i).join("&#160;")
                    + "</span>");
            } else {
                tabStr.push(new Array(i+1).join("&#160;"));
            }
        }

    };

    this.updateLines = function(config, firstRow, lastRow) {
        this.$computeTabString();
        // Due to wrap line changes there can be new lines if e.g.
        // the line to updated wrapped in the meantime.
        if (this.config.lastRow != config.lastRow ||
            this.config.firstRow != config.firstRow) {
            this.scrollLines(config);
        }
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes,
            lineElementsIdx = 0;

        for (var row = config.firstRow; row < first; row++) {
            var foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx ++;
        }

        for (var i=first; i<=last; i++) {
            var lineElement = lineElements[lineElementsIdx++];
            if (!lineElement)
                continue;

            var html = [];
            var tokens = this.session.getTokens(i, i);
            this.$renderLine(html, i, tokens[0].tokens);
            lineElement = dom.setInnerHtml(lineElement, html.join(""));
            lineElement.style.height =
                    this.session.getRowHeight(config, i) + "px";

            i = this.session.getRowFoldEnd(i);
        }
    };

    this.scrollLines = function(config) {
        this.$computeTabString();
        var oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        var el = this.element;

        if (oldConfig.firstRow < config.firstRow)
            for (var row=oldConfig.firstRow; row<config.firstRow; row = this.session.getRowFoldEnd(row) + 1)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=config.lastRow+1; row<=oldConfig.lastRow; row = this.session.getRowFoldEnd(row) + 1)
                el.removeChild(el.lastChild);

        if (config.firstRow < oldConfig.firstRow) {
            var fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            var fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = document.createDocumentFragment();
        for (var row=firstRow; row<=lastRow; row++) {
            var lineEl = dom.createElement("div");

            lineEl.className = "ace_line";
            var style = lineEl.style;
            style.height = this.session.getRowHeight(config, row) + "px";
            style.width = config.width + "px";

            var html = [];
            // Get the tokens per line as there might be some lines in between
            // beeing folded.
            // OPTIMIZE: If there is a long block of unfolded lines, just make
            // this call once for that big block of unfolded lines.
            var tokens = this.session.getTokens(row, row);
            if (tokens.length == 1)
                this.$renderLine(html, row, tokens[0].tokens);

            // don't use setInnerHtml since we are working with an empty DIV
            lineEl.innerHTML = html.join("");
            fragment.appendChild(lineEl);

            row = this.session.getRowFoldEnd(row);
        }
        return fragment;
    };

    this.update = function(config) {
        this.$computeTabString();
        this.config = config;

        var html = [];
        var tokens = this.session.getTokens(config.firstRow, config.lastRow)
        var fragment = this.$renderLinesFragment(config, config.firstRow, config.lastRow);

        // Clear the current content of the element and add the rendered fragment.
        this.element.innerHTML =  "";
        this.element.appendChild(fragment);
    };

    this.$textToken = {
        "text": true,
        "rparen": true,
        "lparen": true
    };

    this.$renderToken = function(stringBuilder, screenColumn, token, value) {
        var self = this;
        var replaceReg = /\t|&|<|( +)|([\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000])|[\u1100-\u115F]|[\u11A3-\u11A7]|[\u11FA-\u11FF]|[\u2329-\u232A]|[\u2E80-\u2E99]|[\u2E9B-\u2EF3]|[\u2F00-\u2FD5]|[\u2FF0-\u2FFB]|[\u3000-\u303E]|[\u3041-\u3096]|[\u3099-\u30FF]|[\u3105-\u312D]|[\u3131-\u318E]|[\u3190-\u31BA]|[\u31C0-\u31E3]|[\u31F0-\u321E]|[\u3220-\u3247]|[\u3250-\u32FE]|[\u3300-\u4DBF]|[\u4E00-\uA48C]|[\uA490-\uA4C6]|[\uA960-\uA97C]|[\uAC00-\uD7A3]|[\uD7B0-\uD7C6]|[\uD7CB-\uD7FB]|[\uF900-\uFAFF]|[\uFE10-\uFE19]|[\uFE30-\uFE52]|[\uFE54-\uFE66]|[\uFE68-\uFE6B]|[\uFF01-\uFF60]|[\uFFE0-\uFFE6]/g;
        var replaceFunc = function(c, a, b, tabIdx, idx4) {
            if (c.charCodeAt(0) == 32) {
                return new Array(c.length+1).join("&#160;");
            } else if (c == "\t") {
                var tabSize = self.session.
                        getScreenTabSize(screenColumn + tabIdx);
                screenColumn += tabSize - 1;
                return self.$tabStrings[tabSize];
            } else if (c == "&") {
              if (useragent.isOldGecko)
                return "&";
              else
                return "&amp";
            } else if (c == "<") {
                return "&lt;";
            } else if (c.match(/[\v\f \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/)) {
                if (self.showInvisibles) {
                    var space = new Array(c.length+1).join(self.SPACE_CHAR);
                    return "<span class='ace_invisible'>" + space + "</span>";
                } else {
                    return "&#160;";
                }
            } else {
                screenColumn += 1;
                return "<span class='ace_cjk' style='width:" + (
                        self.config.characterWidth * 2) +
                        "px'>" + c + "</span>";
            }
        }

        var output = value.replace(replaceReg, replaceFunc);

        if (!this.$textToken[token.type]) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            stringBuilder.push("<span class='", classes, "'>", output, "</span>");
        }
        else {
            stringBuilder.push(output);
        }
        return value.length;
    }

    this.$renderLineCore = function(stringBuilder, lastRow, tokens, splits) {
        var chars = 0,
            split = 0,
            splitChars,
            characterWidth = this.config.characterWidth,
            screenColumn = 0,
            self = this;

        function addToken(token, value) {
            screenColumn += self.$renderToken(
                stringBuilder, screenColumn, token, value);
        }

        if (!splits || splits.length == 0) {
            splitChars = Number.MAX_VALUE;
        } else {
            splitChars = splits[0];
        }

        stringBuilder.push("<div style='height:",
            this.config.lineHeight, "px",
            "'>");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;

            if (chars + value.length < splitChars) {
                addToken(token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    addToken(token, value.substring(0, splitChars - chars));
                    value = value.substring(splitChars - chars);
                    chars = splitChars;
                    stringBuilder.push("</div>",
                        "<div style='height:",
                        this.config.lineHeight, "px",
                        "'>");

                    split ++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    addToken(token, value);
                }
            }
        };

        if (this.showInvisibles) {
            if (lastRow !== this.session.getLength() - 1) {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOL_CHAR + "</span>");
            } else {
                stringBuilder.push("<span class='ace_invisible'>" + this.EOF_CHAR + "</span>");
            }
        }
        stringBuilder.push("</div>");
    }

    this.$renderLine = function(stringBuilder, row, tokens) {
        // Check if the line to render is folded or not. If not, things are
        // simple, otherwise, we need to fake some things...
        if (!this.session.isRowFolded(row)) {
            var splits = this.session.getRowSplitData(row);
            this.$renderLineCore(stringBuilder, row, tokens, splits)
        } else {
            this.$renderFoldLine(stringBuilder, row, tokens, splits);
        }
    };

    this.$renderFoldLine = function(stringBuilder, row, tokens) {
        var session = this.session,
            foldLine = session.getFoldLine(row),
            renderTokens = [];

        function addTokens(tokens, from, to) {
            var idx = 0, col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length
                idx++

                if (idx == tokens.length) {
                    return;
                }
            }
            if (col != from) {
                var value = tokens[idx].value.substring(from - col);
                // Check if the token value is longer then the from...to spacing.
                if (value.length > (to - from)) {
                    value = value.substring(0, to - from);
                }

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1
            }

            while (col < to) {
                var value = tokens[idx].value;
                if (value.length + col > to) {
                    value = value.substring(0, to - col);
                }
                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });
                col += value.length;
                idx += 1;
            }
        }

        foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder) {
               renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            } else {
                if (isNewRow) {
                   tokens = this.session.getTokens(row, row)[0].tokens;
                }
                if (tokens.length != 0) {
                    addTokens(tokens, lastColumn, column);
                }
            }
        }.bind(this), foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        // TODO: Build a fake splits array!
        var splits = this.session.$wrapData[row];
        this.$renderLineCore(stringBuilder, row, renderTokens, splits);
    };

}).call(Text.prototype);

exports.Text = Text;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/layer/cursor'), ['pilot/dom'], function (require, exports, module) {


var dom = require("pilot/dom");

var Cursor = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_cursor-layer";
    parentEl.appendChild(this.element);

    this.cursor = dom.createElement("div");
    this.cursor.className = "ace_cursor";

    this.isVisible = false;
};

(function() {

    this.setSession = function(session) {
        this.session = session;
    };

    this.hideCursor = function() {
        this.isVisible = false;
        if (this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        clearInterval(this.blinkId);
    };

    this.showCursor = function() {
        this.isVisible = true;
        this.element.appendChild(this.cursor);

        var cursor = this.cursor;
        cursor.style.visibility = "visible";
        this.restartTimer();
    };

    this.restartTimer = function() {
        clearInterval(this.blinkId);
        if (!this.isVisible) {
            return;
        }

        var cursor = this.cursor;
        this.blinkId = setInterval(function() {
            cursor.style.visibility = "hidden";
            setTimeout(function() {
                cursor.style.visibility = "visible";
            }, 400);
        }, 1000);
    };

    this.getPixelPosition = function(onScreen) {
        if (!this.config || !this.session) {
            return {
                left : 0,
                top : 0
            };
        }

        var position = this.session.selection.getCursor();
        var pos = this.session.documentToScreenPosition(position);
        var cursorLeft = Math.round(pos.column * this.config.characterWidth);
        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) *
            this.config.lineHeight;

        return {
            left : cursorLeft,
            top : cursorTop
        };
    };

    this.update = function(config) {
        this.config = config;

        this.pixelPos = this.getPixelPosition(true);

        this.cursor.style.left = this.pixelPos.left + "px";
        this.cursor.style.top =  this.pixelPos.top + "px";
        this.cursor.style.width = config.characterWidth + "px";
        this.cursor.style.height = config.lineHeight + "px";

        if (this.isVisible) {
            this.element.appendChild(this.cursor);
        }
        
        if (this.session.getOverwrite()) {
            dom.addCssClass(this.cursor, "ace_overwrite");
        } else {
            dom.removeCssClass(this.cursor, "ace_overwrite");
        }
        
        this.restartTimer();
    };

}).call(Cursor.prototype);

exports.Cursor = Cursor;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/scrollbar'), ['pilot/oop','pilot/dom','pilot/event','pilot/event_emitter'], function (require, exports, module) {


var oop = require("pilot/oop");
var dom = require("pilot/dom");
var event = require("pilot/event");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var ScrollBar = function(parent) {
    this.element = dom.createElement("div");
    this.element.className = "ace_sb";

    this.inner = dom.createElement("div");
    this.element.appendChild(this.inner);

    parent.appendChild(this.element);

    this.width = dom.scrollbarWidth();
    this.element.style.width = this.width + "px";

    event.addListener(this.element, "scroll", this.onScroll.bind(this));
};

(function() {
    oop.implement(this, EventEmitter);

    this.onScroll = function() {
        this._dispatchEvent("scroll", {data: this.element.scrollTop});
    };

    this.getWidth = function() {
        return this.width;
    };

    this.setHeight = function(height) {
        this.element.style.height = height + "px";
    };

    this.setInnerHeight = function(height) {
        this.inner.style.height = height + "px";
    };

    this.setScrollTop = function(scrollTop) {
        this.element.scrollTop = scrollTop;
    };

}).call(ScrollBar.prototype);

exports.ScrollBar = ScrollBar;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/renderloop'), ['pilot/event'], function (require, exports, module) {


var event = require("pilot/event");

var RenderLoop = function(onRender) {
    this.onRender = onRender;
    this.pending = false;
    this.changes = 0;
};

(function() {

    this.schedule = function(change) {
        //this.onRender(change);
        //return;
        this.changes = this.changes | change;
        if (!this.pending) {
            this.pending = true;
            var _self = this;
            this.setTimeoutZero(function() {
                _self.pending = false;
                var changes = _self.changes;
                _self.changes = 0;
                _self.onRender(changes);
            })
        }
    };

    if (window.postMessage) {

        this.messageName = "zero-timeout-message";

        this.setTimeoutZero = function(callback) {
            if (!this.attached) {
                var _self = this;
                event.addListener(window, "message", function(e) {
                    if (_self.callback && e.data == _self.messageName) {
                        event.stopPropagation(e);
                        _self.callback();
                    }
                });
                this.attached = true;
            }
            this.callback = callback;
            window.postMessage(this.messageName, "*");
        }

    } else {

        this.setTimeoutZero = function(callback) {
            setTimeout(callback, 0);
        }
    }

}).call(RenderLoop.prototype);

exports.RenderLoop = RenderLoop;
});
require.memoize('text!'+bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/css/editor.css'), [], function () {
return [".ace_editor {","    position: absolute;","    overflow: hidden;","","    font-family: \"Menlo\", \"Monaco\", \"Courier New\", monospace;","    font-size: 12px;  ","}","",".ace_scroller {","    position: absolute;","    overflow-x: scroll;","    overflow-y: hidden;     ","}","",".ace_content {","    position: absolute;","    box-sizing: border-box;","    -moz-box-sizing: border-box;","    -webkit-box-sizing: border-box;","}","",".ace_composition {","    position: absolute;","    background: #555;","    color: #DDD;","    z-index: 4;","}","",".ace_gutter {","    position: absolute;","    overflow-x: hidden;","    overflow-y: hidden;","    height: 100%;","}","",".ace_gutter-cell.ace_error {","    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%F5or%F5%87%88%F5nr%F4ns%EBmq%F5z%7F%DDJT%DEKS%DFOW%F1Yc%F2ah%CE(7%CE)8%D18E%DD%40M%F2KZ%EBU%60%F4%60m%DCir%C8%16(%C8%19*%CE%255%F1%3FR%F1%3FS%E6%AB%B5%CA%5DI%CEn%5E%F7%A2%9A%C9G%3E%E0a%5B%F7%89%85%F5yy%F6%82%80%ED%82%80%FF%BF%BF%E3%C4%C4%FF%FF%FF%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%25%00%2C%00%00%00%00%10%00%10%00%00%06p%C0%92pH%2C%1A%8F%C8%D2H%93%E1d4%23%E4%88%D3%09mB%1DN%B48%F5%90%40%60%92G%5B%94%20%3E%22%D2%87%24%FA%20%24%C5%06A%00%20%B1%07%02B%A38%89X.v%17%82%11%13q%10%0Fi%24%0F%8B%10%7BD%12%0Ei%09%92%09%0EpD%18%15%24%0A%9Ci%05%0C%18F%18%0B%07%04%01%04%06%A0H%18%12%0D%14%0D%12%A1I%B3%B4%B5IA%00%3B\");","    background-repeat: no-repeat;","    background-position: 4px center;","}","",".ace_gutter-cell.ace_warning {","    background-image: url(\"data:image/gif,GIF89a%10%00%10%00%D5%00%00%FF%DBr%FF%DE%81%FF%E2%8D%FF%E2%8F%FF%E4%96%FF%E3%97%FF%E5%9D%FF%E6%9E%FF%EE%C1%FF%C8Z%FF%CDk%FF%D0s%FF%D4%81%FF%D5%82%FF%D5%83%FF%DC%97%FF%DE%9D%FF%E7%B8%FF%CCl%7BQ%13%80U%15%82W%16%81U%16%89%5B%18%87%5B%18%8C%5E%1A%94d%1D%C5%83-%C9%87%2F%C6%84.%C6%85.%CD%8B2%C9%871%CB%8A3%CD%8B5%DC%98%3F%DF%9BB%E0%9CC%E1%A5U%CB%871%CF%8B5%D1%8D6%DB%97%40%DF%9AB%DD%99B%E3%B0p%E7%CC%AE%FF%FF%FF%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%2F%00%2C%00%00%00%00%10%00%10%00%00%06a%C0%97pH%2C%1A%8FH%A1%ABTr%25%87%2B%04%82%F4%7C%B9X%91%08%CB%99%1C!%26%13%84*iJ9(%15G%CA%84%14%01%1A%97%0C%03%80%3A%9A%3E%81%84%3E%11%08%B1%8B%20%02%12%0F%18%1A%0F%0A%03'F%1C%04%0B%10%16%18%10%0B%05%1CF%1D-%06%07%9A%9A-%1EG%1B%A0%A1%A0U%A4%A5%A6BA%00%3B\");","    background-repeat: no-repeat;","    background-position: 4px center;","}","",".ace_editor .ace_sb {","    position: absolute;","    overflow-x: hidden;","    overflow-y: scroll;","    right: 0;","}","",".ace_editor .ace_sb div {","    position: absolute;","    width: 1px;","    left: 0;","}","",".ace_editor .ace_print_margin_layer {","    z-index: 0;","    position: absolute;","    overflow: hidden;","    margin: 0;","    left: 0;","    height: 100%;","    width: 100%;","}","",".ace_editor .ace_print_margin {","    position: absolute;","    height: 100%;","}","",".ace_editor textarea {","    position: fixed;","    z-index: -1;","    width: 10px;","    height: 30px;","    opacity: 0;","    background: transparent;","    appearance: none;","    border: none;","    resize: none;","    outline: none;","    overflow: hidden;","}","",".ace_layer {","    z-index: 1;","    position: absolute;","    overflow: hidden;  ","    white-space: nowrap;","    height: 100%;","    width: 100%;","}","",".ace_text-layer {","    font-family: Monaco, \"Courier New\", monospace;","    color: black;","}","",".ace_cjk {","    display: inline-block;","    text-align: center;","}","",".ace_cursor-layer {","    z-index: 4;","    cursor: text;","    pointer-events: none;","}","",".ace_cursor {","    z-index: 4;","    position: absolute;","}","",".ace_line {","    white-space: nowrap;","}","",".ace_marker-layer {","    cursor: text;","}","",".ace_marker-layer .ace_step {","    position: absolute;","    z-index: 3;","}","",".ace_marker-layer .ace_selection {","    position: absolute;","    z-index: 4;","}","",".ace_marker-layer .ace_bracket {","    position: absolute;","    z-index: 5;","}","",".ace_marker-layer .ace_active_line {","    position: absolute;","    z-index: 2;","}","",".ace_marker-layer .ace_selected_word {","    position: absolute;","    z-index: 6;","    box-sizing: border-box;","    -moz-box-sizing: border-box;","    -webkit-box-sizing: border-box;","}","",".ace_dragging .ace_marker-layer, .ace_dragging .ace_text-layer {","  cursor: move;","}",""].join("\n");
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/undomanager'), [], function (require, exports, module) {


var UndoManager = function() {
    this.reset();
};

(function() {

    this.execute = function(options) {
        var deltas = options.args[0];
        this.$doc  = options.args[1];
        this.$undoStack.push(deltas);
        this.$redoStack = [];
    };

    this.undo = function() {
        var deltas = this.$undoStack.pop();
        if (deltas) {
            this.$doc.undoChanges(deltas);
            this.$redoStack.push(deltas);
        }
    };

    this.redo = function() {
        var deltas = this.$redoStack.pop();
        if (deltas) {
            this.$doc.redoChanges(deltas);
            this.$undoStack.push(deltas);
        }
    };

    this.reset = function() {
        this.$undoStack = [];
        this.$redoStack = [];
    };

    this.hasUndo = function() {
        return this.$undoStack.length > 0;
    };

    this.hasRedo = function() {
        return this.$redoStack.length > 0;
    };

}).call(UndoManager.prototype);

exports.UndoManager = UndoManager;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/theme/textmate'), ['pilot/dom'], function (require, exports, module) {


    var dom = require("pilot/dom");

    var cssText = ".ace-tm .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-tm .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-tm .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-tm .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-tm .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-tm .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-tm .ace_text-layer {\
  cursor: text;\
}\
\
.ace-tm .ace_cursor {\
  border-left: 2px solid black;\
}\
\
.ace-tm .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid black;\
}\
        \
.ace-tm .ace_line .ace_invisible {\
  color: rgb(191, 191, 191);\
}\
\
.ace-tm .ace_line .ace_keyword {\
  color: blue;\
}\
\
.ace-tm .ace_line .ace_constant.ace_buildin {\
  color: rgb(88, 72, 246);\
}\
\
.ace-tm .ace_line .ace_constant.ace_language {\
  color: rgb(88, 92, 246);\
}\
\
.ace-tm .ace_line .ace_constant.ace_library {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tm .ace_line .ace_invalid {\
  background-color: rgb(153, 0, 0);\
  color: white;\
}\
\
.ace-tm .ace_line .ace_fold {\
    background-color: #E4E4E4;\
    border-radius: 3px;\
}\
\
.ace-tm .ace_line .ace_support.ace_function {\
  color: rgb(60, 76, 114);\
}\
\
.ace-tm .ace_line .ace_support.ace_constant {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tm .ace_line .ace_support.ace_type,\
.ace-tm .ace_line .ace_support.ace_class {\
  color: rgb(109, 121, 222);\
}\
\
.ace-tm .ace_line .ace_keyword.ace_operator {\
  color: rgb(104, 118, 135);\
}\
\
.ace-tm .ace_line .ace_string {\
  color: rgb(3, 106, 7);\
}\
\
.ace-tm .ace_line .ace_comment {\
  color: rgb(76, 136, 107);\
}\
\
.ace-tm .ace_line .ace_comment.ace_doc {\
  color: rgb(0, 102, 255);\
}\
\
.ace-tm .ace_line .ace_comment.ace_doc.ace_tag {\
  color: rgb(128, 159, 191);\
}\
\
.ace-tm .ace_line .ace_constant.ace_numeric {\
  color: rgb(0, 0, 205);\
}\
\
.ace-tm .ace_line .ace_variable {\
  color: rgb(49, 132, 149);\
}\
\
.ace-tm .ace_line .ace_xml_pe {\
  color: rgb(104, 104, 91);\
}\
\
.ace-tm .ace_marker-layer .ace_selection {\
  background: rgb(181, 213, 255);\
}\
\
.ace-tm .ace_marker-layer .ace_step {\
  background: rgb(252, 255, 0);\
}\
\
.ace-tm .ace_marker-layer .ace_stack {\
  background: rgb(164, 229, 101);\
}\
\
.ace-tm .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgb(192, 192, 192);\
}\
\
.ace-tm .ace_marker-layer .ace_active_line {\
  background: rgb(232, 242, 254);\
}\
\
.ace-tm .ace_marker-layer .ace_selected_word {\
  background: rgb(250, 250, 255);\
  border: 1px solid rgb(200, 200, 250);\
}\
\
.ace-tm .ace_string.ace_regex {\
  color: rgb(255, 0, 0)\
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-tm";
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/index'), ['pilot/fixoldbrowsers','pilot/types/basic','pilot/types/command','pilot/types/settings','pilot/commands/settings','pilot/commands/basic','pilot/settings/canon','pilot/canon','pilot/types/basic','pilot/types/command','pilot/types/settings','pilot/commands/settings','pilot/commands/basic','pilot/settings/canon','pilot/canon'], function (require, exports, module) {


exports.startup = function(data, reason) {
    require('pilot/fixoldbrowsers');

    require('pilot/types/basic').startup(data, reason);
    require('pilot/types/command').startup(data, reason);
    require('pilot/types/settings').startup(data, reason);
    require('pilot/commands/settings').startup(data, reason);
    require('pilot/commands/basic').startup(data, reason);
    // require('pilot/commands/history').startup(data, reason);
    require('pilot/settings/canon').startup(data, reason);
    require('pilot/canon').startup(data, reason);
};

exports.shutdown = function(data, reason) {
    require('pilot/types/basic').shutdown(data, reason);
    require('pilot/types/command').shutdown(data, reason);
    require('pilot/types/settings').shutdown(data, reason);
    require('pilot/commands/settings').shutdown(data, reason);
    require('pilot/commands/basic').shutdown(data, reason);
    // require('pilot/commands/history').shutdown(data, reason);
    require('pilot/settings/canon').shutdown(data, reason);
    require('pilot/canon').shutdown(data, reason);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/types/basic'), ['pilot/types'], function (require, exports, module) {


var types = require("pilot/types");
var Type = types.Type;
var Conversion = types.Conversion;
var Status = types.Status;

/**
 * These are the basic types that we accept. They are vaguely based on the
 * Jetpack settings system (https://wiki.mozilla.org/Labs/Jetpack/JEP/24)
 * although clearly more restricted.
 *
 * <p>In addition to these types, Jetpack also accepts range, member, password
 * that we are thinking of adding.
 *
 * <p>This module probably should not be accessed directly, but instead used
 * through types.js
 */

/**
 * 'text' is the default if no type is given.
 */
var text = new Type();

text.stringify = function(value) {
    return value;
};

text.parse = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to text.parse()');
    }
    return new Conversion(value);
};

text.name = 'text';

/**
 * We don't currently plan to distinguish between integers and floats
 */
var number = new Type();

number.stringify = function(value) {
    if (!value) {
        return null;
    }
    return '' + value;
};

number.parse = function(value) {
    if (typeof value != 'string') {
        throw new Error('non-string passed to number.parse()');
    }

    if (value.replace(/\s/g, '').length === 0) {
        return new Conversion(null, Status.INCOMPLETE, '');
    }

    var reply = new Conversion(parseInt(value, 10));
    if (isNaN(reply.value)) {
        reply.status = Status.INVALID;
        reply.message = 'Can\'t convert "' + value + '" to a number.';
    }

    return reply;
};

number.decrement = function(value) {
    return value - 1;
};

number.increment = function(value) {
    return value + 1;
};

number.name = 'number';

/**
 * One of a known set of options
 */
function SelectionType(typeSpec) {
    if (!Array.isArray(typeSpec.data) && typeof typeSpec.data !== 'function') {
        throw new Error('instances of SelectionType need typeSpec.data to be an array or function that returns an array:' + JSON.stringify(typeSpec));
    }
    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
};

SelectionType.prototype = new Type();

SelectionType.prototype.stringify = function(value) {
    return value;
};

SelectionType.prototype.parse = function(str) {
    if (typeof str != 'string') {
        throw new Error('non-string passed to parse()');
    }
    if (!this.data) {
        throw new Error('Missing data on selection type extension.');
    }
    var data = (typeof(this.data) === 'function') ? this.data() : this.data;

    // The matchedValue could be the boolean value false
    var hasMatched = false;
    var matchedValue;
    var completions = [];
    data.forEach(function(option) {
        if (str == option) {
            matchedValue = this.fromString(option);
            hasMatched = true;
        }
        else if (option.indexOf(str) === 0) {
            completions.push(this.fromString(option));
        }
    }, this);

    if (hasMatched) {
        return new Conversion(matchedValue);
    }
    else {
        // This is something of a hack it basically allows us to tell the
        // setting type to forget its last setting hack.
        if (this.noMatch) {
            this.noMatch();
        }

        if (completions.length > 0) {
            var msg = 'Possibilities' +
                (str.length === 0 ? '' : ' for \'' + str + '\'');
            return new Conversion(null, Status.INCOMPLETE, msg, completions);
        }
        else {
            var msg = 'Can\'t use \'' + str + '\'.';
            return new Conversion(null, Status.INVALID, msg, completions);
        }
    }
};

SelectionType.prototype.fromString = function(str) {
    return str;
};

SelectionType.prototype.decrement = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = data.length - 1;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === 0 ? data.length - 1 : index - 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.increment = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = 0;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === data.length - 1 ? 0 : index + 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.name = 'selection';

/**
 * SelectionType is a base class for other types
 */
exports.SelectionType = SelectionType;

/**
 * true/false values
 */
var bool = new SelectionType({
    name: 'bool',
    data: [ 'true', 'false' ],
    stringify: function(value) {
        return '' + value;
    },
    fromString: function(str) {
        return str === 'true' ? true : false;
    }
});


/**
 * A we don't know right now, but hope to soon.
 */
function DeferredType(typeSpec) {
    if (typeof typeSpec.defer !== 'function') {
        throw new Error('Instances of DeferredType need typeSpec.defer to be a function that returns a type');
    }
    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
};

DeferredType.prototype = new Type();

DeferredType.prototype.stringify = function(value) {
    return this.defer().stringify(value);
};

DeferredType.prototype.parse = function(value) {
    return this.defer().parse(value);
};

DeferredType.prototype.decrement = function(value) {
    var deferred = this.defer();
    return (deferred.decrement ? deferred.decrement(value) : undefined);
};

DeferredType.prototype.increment = function(value) {
    var deferred = this.defer();
    return (deferred.increment ? deferred.increment(value) : undefined);
};

DeferredType.prototype.name = 'deferred';

/**
 * DeferredType is a base class for other types
 */
exports.DeferredType = DeferredType;


/**
 * A set of objects of the same type
 */
function ArrayType(typeSpec) {
    if (typeSpec instanceof Type) {
        this.subtype = typeSpec;
    }
    else if (typeof typeSpec === 'string') {
        this.subtype = types.getType(typeSpec);
        if (this.subtype == null) {
            throw new Error('Unknown array subtype: ' + typeSpec);
        }
    }
    else {
        throw new Error('Can\' handle array subtype');
    }
};

ArrayType.prototype = new Type();

ArrayType.prototype.stringify = function(values) {
    // TODO: Check for strings with spaces and add quotes
    return values.join(' ');
};

ArrayType.prototype.parse = function(value) {
    return this.defer().parse(value);
};

ArrayType.prototype.name = 'array';

/**
 * Registration and de-registration.
 */
var isStarted = false;
exports.startup = function() {
    if (isStarted) {
        return;
    }
    isStarted = true;
    types.registerType(text);
    types.registerType(number);
    types.registerType(bool);
    types.registerType(SelectionType);
    types.registerType(DeferredType);
    types.registerType(ArrayType);
};

exports.shutdown = function() {
    isStarted = false;
    types.unregisterType(text);
    types.unregisterType(number);
    types.unregisterType(bool);
    types.unregisterType(SelectionType);
    types.unregisterType(DeferredType);
    types.unregisterType(ArrayType);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/types/command'), ['pilot/canon','pilot/types/basic','pilot/types'], function (require, exports, module) {


var canon = require("pilot/canon");
var SelectionType = require("pilot/types/basic").SelectionType;
var types = require("pilot/types");


/**
 * Select from the available commands
 */
var command = new SelectionType({
    name: 'command',
    data: function() {
        return canon.getCommandNames();
    },
    stringify: function(command) {
        return command.name;
    },
    fromString: function(str) {
        return canon.getCommand(str);
    }
});


/**
 * Registration and de-registration.
 */
exports.startup = function() {
    types.registerType(command);
};

exports.shutdown = function() {
    types.unregisterType(command);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/types/settings'), ['pilot/types/basic','pilot/types/basic','pilot/types','pilot/settings'], function (require, exports, module) {


var SelectionType = require('pilot/types/basic').SelectionType;
var DeferredType = require('pilot/types/basic').DeferredType;
var types = require('pilot/types');
var settings = require('pilot/settings').settings;


/**
 * EVIL: This relies on us using settingValue in the same event as setting
 * The alternative is to have some central place where we store the current
 * command line, but this might be a lesser evil for now.
 */
var lastSetting;

/**
 * Select from the available settings
 */
var setting = new SelectionType({
    name: 'setting',
    data: function() {
        return env.settings.getSettingNames();
    },
    stringify: function(setting) {
        lastSetting = setting;
        return setting.name;
    },
    fromString: function(str) {
        lastSetting = settings.getSetting(str);
        return lastSetting;
    },
    noMatch: function() {
        lastSetting = null;
    }
});

/**
 * Something of a hack to allow the set command to give a clearer definition
 * of the type to the command line.
 */
var settingValue = new DeferredType({
    name: 'settingValue',
    defer: function() {
        if (lastSetting) {
            return lastSetting.type;
        }
        else {
            return types.getType('text');
        }
    },
    /**
     * Promote the current value in any list of predictions, and add it if
     * there are none.
     */
    getDefault: function() {
        var conversion = this.parse('');
        if (lastSetting) {
            var current = lastSetting.get();
            if (conversion.predictions.length === 0) {
                conversion.predictions.push(current);
            }
            else {
                // Remove current from predictions
                var removed = false;
                while (true) {
                    var index = conversion.predictions.indexOf(current);
                    if (index === -1) {
                        break;
                    }
                    conversion.predictions.splice(index, 1);
                    removed = true;
                }
                // If the current value wasn't something we would predict, leave it
                if (removed) {
                    conversion.predictions.push(current);
                }
            }
        }
        return conversion;
    }
});

var env;

/**
 * Registration and de-registration.
 */
exports.startup = function(data, reason) {
    // TODO: this is probably all kinds of evil, but we need something working
    env = data.env;
    types.registerType(setting);
    types.registerType(settingValue);
};

exports.shutdown = function(data, reason) {
    types.unregisterType(setting);
    types.unregisterType(settingValue);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/commands/settings'), ['pilot/canon'], function (require, exports, module) {



var setCommandSpec = {
    name: 'set',
    params: [
        {
            name: 'setting',
            type: 'setting',
            description: 'The name of the setting to display or alter',
            defaultValue: null
        },
        {
            name: 'value',
            type: 'settingValue',
            description: 'The new value for the chosen setting',
            defaultValue: null
        }
    ],
    description: 'define and show settings',
    exec: function(env, args, request) {
        var html;
        if (!args.setting) {
            // 'set' by itself lists all the settings
            var names = env.settings.getSettingNames();
            html = '';
            // first sort the settingsList based on the name
            names.sort(function(name1, name2) {
                return name1.localeCompare(name2);
            });

            names.forEach(function(name) {
                var setting = env.settings.getSetting(name);
                var url = 'https://wiki.mozilla.org/Labs/Skywriter/Settings#' +
                        setting.name;
                html += '<a class="setting" href="' + url +
                        '" title="View external documentation on setting: ' +
                        setting.name +
                        '" target="_blank">' +
                        setting.name +
                        '</a> = ' +
                        setting.value +
                        '<br/>';
            });
        } else {
            // set with only a setting, shows the value for that setting
            if (args.value === undefined) {
                html = '<strong>' + setting.name + '</strong> = ' +
                        setting.get();
            } else {
                // Actually change the setting
                args.setting.set(args.value);
                html = 'Setting: <strong>' + args.setting.name + '</strong> = ' +
                        args.setting.get();
            }
        }
        request.done(html);
    }
};

var unsetCommandSpec = {
    name: 'unset',
    params: [
        {
            name: 'setting',
            type: 'setting',
            description: 'The name of the setting to return to defaults'
        }
    ],
    description: 'unset a setting entirely',
    exec: function(env, args, request) {
        var setting = env.settings.get(args.setting);
        if (!setting) {
            request.doneWithError('No setting with the name <strong>' +
                args.setting + '</strong>.');
            return;
        }

        setting.reset();
        request.done('Reset ' + setting.name + ' to default: ' +
                env.settings.get(args.setting));
    }
};

var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(setCommandSpec);
    canon.addCommand(unsetCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(setCommandSpec);
    canon.removeCommand(unsetCommandSpec);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/commands/basic'), ['pilot/typecheck','pilot/canon','pilot/canon'], function (require, exports, module) {



var checks = require("pilot/typecheck");
var canon = require('pilot/canon');

/**
 * 
 */
var helpMessages = {
    plainPrefix:
        '<h2>Welcome to Skywriter - Code in the Cloud</h2><ul>' +
        '<li><a href="http://labs.mozilla.com/projects/skywriter" target="_blank">Home Page</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter" target="_blank">Wiki</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/UserGuide" target="_blank">User Guide</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/Tips" target="_blank">Tips and Tricks</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/FAQ" target="_blank">FAQ</a></li>' +
        '<li><a href="https://wiki.mozilla.org/Labs/Skywriter/DeveloperGuide" target="_blank">Developers Guide</a></li>' +
        '</ul>',
    plainSuffix:
        'For more information, see the <a href="https://wiki.mozilla.org/Labs/Skywriter">Skywriter Wiki</a>.'
};

/**
 * 'help' command
 */
var helpCommandSpec = {
    name: 'help',
    params: [
        {
            name: 'search',
            type: 'text',
            description: 'Search string to narrow the output.',
            defaultValue: null
        }
    ],
    description: 'Get help on the available commands.',
    exec: function(env, args, request) {
        var output = [];

        var command = canon.getCommand(args.search);
        if (command && command.exec) {
            // caught a real command
            output.push(command.description ?
                    command.description :
                    'No description for ' + args.search);
        } else {
            var showHidden = false;

            if (!args.search && helpMessages.plainPrefix) {
                output.push(helpMessages.plainPrefix);
            }

            if (command) {
                // We must be looking at sub-commands
                output.push('<h2>Sub-Commands of ' + command.name + '</h2>');
                output.push('<p>' + command.description + '</p>');
            }
            else if (args.search) {
                if (args.search == 'hidden') { // sneaky, sneaky.
                    args.search = '';
                    showHidden = true;
                }
                output.push('<h2>Commands starting with \'' + args.search + '\':</h2>');
            }
            else {
                output.push('<h2>Available Commands:</h2>');
            }

            var commandNames = canon.getCommandNames();
            commandNames.sort();

            output.push('<table>');
            for (var i = 0; i < commandNames.length; i++) {
                command = canon.getCommand(commandNames[i]);
                if (!showHidden && command.hidden) {
                    continue;
                }
                if (command.description === undefined) {
                    // Ignore editor actions
                    continue;
                }
                if (args.search && command.name.indexOf(args.search) !== 0) {
                    // Filtered out by the user
                    continue;
                }
                if (!args.search && command.name.indexOf(' ') != -1) {
                    // sub command
                    continue;
                }
                if (command && command.name == args.search) {
                    // sub command, and we've already given that help
                    continue;
                }

                // todo add back a column with parameter information, perhaps?

                output.push('<tr>');
                output.push('<th class="right">' + command.name + '</th>');
                output.push('<td>' + command.description + '</td>');
                output.push('</tr>');
            }
            output.push('</table>');

            if (!args.search && helpMessages.plainSuffix) {
                output.push(helpMessages.plainSuffix);
            }
        }

        request.done(output.join(''));
    }
};

/**
 * 'eval' command
 */
var evalCommandSpec = {
    name: 'eval',
    params: [
        {
            name: 'javascript',
            type: 'text',
            description: 'The JavaScript to evaluate'
        }
    ],
    description: 'evals given js code and show the result',
    hidden: true,
    exec: function(env, args, request) {
        var result;
        var javascript = args.javascript;
        try {
            result = eval(javascript);
        } catch (e) {
            result = '<b>Error: ' + e.message + '</b>';
        }

        var msg = '';
        var type = '';
        var x;

        if (checks.isFunction(result)) {
            // converts the function to a well formated string
            msg = (result + '').replace(/\n/g, '<br>').replace(/ /g, '&#160');
            type = 'function';
        } else if (checks.isObject(result)) {
            if (Array.isArray(result)) {
                type = 'array';
            } else {
                type = 'object';
            }

            var items = [];
            var value;

            for (x in result) {
                if (result.hasOwnProperty(x)) {
                    if (checks.isFunction(result[x])) {
                        value = '[function]';
                    } else if (checks.isObject(result[x])) {
                        value = '[object]';
                    } else {
                        value = result[x];
                    }

                    items.push({name: x, value: value});
                }
            }

            items.sort(function(a,b) {
                return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
            });

            for (x = 0; x < items.length; x++) {
                msg += '<b>' + items[x].name + '</b>: ' + items[x].value + '<br>';
            }

        } else {
            msg = result;
            type = typeof result;
        }

        request.done('Result for eval <b>\'' + javascript + '\'</b>' +
                ' (type: '+ type+'): <br><br>'+ msg);
    }
};

/**
 * 'version' command
 */
var versionCommandSpec = {
    name: 'version',
    description: 'show the Skywriter version',
    hidden: true,
    exec: function(env, args, request) {
        var version = 'Skywriter ' + skywriter.versionNumber + ' (' +
                skywriter.versionCodename + ')';
        request.done(version);
    }
};

/**
 * 'skywriter' command
 */
var skywriterCommandSpec = {
    name: 'skywriter',
    hidden: true,
    exec: function(env, args, request) {
        var index = Math.floor(Math.random() * messages.length);
        request.done('Skywriter ' + messages[index]);
    }
};
var messages = [
    'really wants you to trick it out in some way.',
    'is your Web editor.',
    'would love to be like Emacs on the Web.',
    'is written on the Web platform, so you can tweak it.'
];


var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(helpCommandSpec);
    canon.addCommand(evalCommandSpec);
    // canon.addCommand(versionCommandSpec);
    canon.addCommand(skywriterCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(helpCommandSpec);
    canon.removeCommand(evalCommandSpec);
    // canon.removeCommand(versionCommandSpec);
    canon.removeCommand(skywriterCommandSpec);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/settings/canon'), [], function (require, exports, module) {



var historyLengthSetting = {
    name: "historyLength",
    description: "How many typed commands do we recall for reference?",
    type: "number",
    defaultValue: 50
};

exports.startup = function(data, reason) {
    data.env.settings.addSetting(historyLengthSetting);
};

exports.shutdown = function(data, reason) {
    data.env.settings.removeSetting(historyLengthSetting);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/defaults'), ['ace/settings/default-settings'], function (require, exports, module) {


var settings = require("ace/settings/default-settings")

exports.startup = function startup(data, reason) {
    settings.startup(data, reason)
}

exports.shutdown = function shutdown(data, reason) {
    settings.shutdown(data, reason)
}

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/settings/default-settings'), ['pilot/types','pilot/types/basic'], function (require, exports, module) {


var types = require('pilot/types')
var SelectionType = require('pilot/types/basic').SelectionType

var env

var settingTypes = {
    selectionStyle: new SelectionType({
        data: [ 'line', 'text' ]
    })
}

var settings = {
    printMargin: {
        description: 'Position of the print margin column.',
        type: 'number',
        defaultValue: 80,
        onChange: function onChange(event) {
            if (env.editor) env.editor.setPrintMarginColumn(event.value)
        }
    },
    showIvisibles: {
        description: 'Whether or not to show invisible characters.',
        type: 'bool',
        defaultValue: false,
        onChange: function onChange(event) {
            if (env.editor) env.editor.setShowInvisibles(event.value)
        }
    },
    highlightActiveLine: {
        description: 'Whether or not highlight active line.',
        type: 'bool',
        defaultValue: true,
        onChange: function onChange(event) {
            if (env.editor) env.editor.setHighlightActiveLine(event.value)
        }
    },
    selectionStyle: {
        description: 'Type of text selection.',
        type: 'selectionStyle',
        defaultValue: 'line',
        onChange: function onChange(event) {
            if (env.editor) env.editor.setSelectionStyle(event.value)
        }
    }
}

exports.startup = function startup(data, reason) {
    env = data.env
    types.registerTypes(settingTypes)
    data.env.settings.addSettings(settings)
}

exports.shutdown = function shutdown(data, reason) {
    data.env.settings.removeSettings(settings)
}

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/matching_brace_outdent'), ['ace/range'], function (require, exports, module) {


var Range = require("ace/range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/doc_comment_highlight_rules'), ['pilot/oop','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var DocCommentHighlightRules = function() {

    this.$rules = {
        "start" : [ {
            token : "comment.doc", // closing comment
            regex : "\\*\\/",
            next : "start"
        }, {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+" // TODO: fix email addresses
        }, {
            token : "comment.doc",
            regex : "\s+"
        }, {
            token : "comment.doc",
            regex : "TODO"
        }, {
            token : "comment.doc",
            regex : "[^@\\*]+"
        }, {
            token : "comment.doc",
            regex : "."
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

(function() {

    this.getStartRule = function(start) {
        return {
            token : "comment.doc", // doc comment
            regex : "\\/\\*(?=\\*)",
            next: start
        };
    };

}).call(DocCommentHighlightRules.prototype);

exports.DocCommentHighlightRules = DocCommentHighlightRules;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/package.json'), [], function() { return {"name":"cockpit","description":"Command line component for Skywriter/Ace/Cloud9/etc","version":"0.1.1","homepage":"http://github.com/joewalker/cockpit","engines":{"node":">= 0.1.102","teleport":">=0.2.0"},"dependencies":{"pilot":">=0.1.1"},"overlay":{"teleport":{"directories":{"lib":"lib/cockpit"}}},"author":"Joe Walker <jwalker@mozilla.com>","main":"lib/cockpit","repository":{"type":"git","url":"http://github.com/joewalker/cockpit.git"},"licenses":[{"type":"LGPLv3","url":"http://www.gnu.org/licenses/lgpl-3.0.txt"}],"uid":"https://github.com/ajaxorg/cockpit/","directories":{"lib":"lib/cockpit"},"mappings":{"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/index'), ['pilot/index','cockpit/cli','cockpit/ui/settings','cockpit/ui/cli_view','cockpit/commands/basic'], function (require, exports, module) {



exports.startup = function(data, reason) {
  require('pilot/index');
  require('cockpit/cli').startup(data, reason);
  // window.testCli = require('cockpit/test/testCli');

  require('cockpit/ui/settings').startup(data, reason);
  require('cockpit/ui/cli_view').startup(data, reason);
  require('cockpit/commands/basic').startup(data, reason);
};

/*
exports.shutdown(data, reason) {
};
*/


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/cli'), ['pilot/console','pilot/lang','pilot/oop','pilot/event_emitter','pilot/types','pilot/types','pilot/types','pilot/canon'], function (require, exports, module) {



var console = require('pilot/console');
var lang = require('pilot/lang');
var oop = require('pilot/oop');
var EventEmitter = require('pilot/event_emitter').EventEmitter;

//var keyboard = require('keyboard/keyboard');
var types = require('pilot/types');
var Status = require('pilot/types').Status;
var Conversion = require('pilot/types').Conversion;
var canon = require('pilot/canon');

/**
 * Normally type upgrade is done when the owning command is registered, but
 * out commandParam isn't part of a command, so it misses out.
 */
exports.startup = function(data, reason) {
    canon.upgradeType('command', commandParam);
};

/**
 * The information required to tell the user there is a problem with their
 * input.
 * TODO: There a several places where {start,end} crop up. Perhaps we should
 * have a Cursor object.
 */
function Hint(status, message, start, end, predictions) {
    this.status = status;
    this.message = message;

    if (typeof start === 'number') {
        this.start = start;
        this.end = end;
        this.predictions = predictions;
    }
    else {
        var arg = start;
        this.start = arg.start;
        this.end = arg.end;
        this.predictions = arg.predictions;
    }
}
Hint.prototype = {
};
/**
 * Loop over the array of hints finding the one we should display.
 * @param hints array of hints
 */
Hint.sort = function(hints, cursor) {
    // Calculate 'distance from cursor'
    if (cursor !== undefined) {
        hints.forEach(function(hint) {
            if (hint.start === Argument.AT_CURSOR) {
                hint.distance = 0;
            }
            else if (cursor < hint.start) {
                hint.distance = hint.start - cursor;
            }
            else if (cursor > hint.end) {
                hint.distance = cursor - hint.end;
            }
            else {
                hint.distance = 0;
            }
        }, this);
    }
    // Sort
    hints.sort(function(hint1, hint2) {
        // Compare first based on distance from cursor
        if (cursor !== undefined) {
            var diff = hint1.distance - hint2.distance;
            if (diff != 0) {
                return diff;
            }
        }
        // otherwise go with hint severity
        return hint2.status - hint1.status;
    });
    // tidy-up
    if (cursor !== undefined) {
        hints.forEach(function(hint) {
            delete hint.distance;
        }, this);
    }
    return hints;
};
exports.Hint = Hint;

/**
 * A Hint that arose as a result of a Conversion
 */
function ConversionHint(conversion, arg) {
    this.status = conversion.status;
    this.message = conversion.message;
    if (arg) {
        this.start = arg.start;
        this.end = arg.end;
    }
    else {
        this.start = 0;
        this.end = 0;
    }
    this.predictions = conversion.predictions;
};
oop.inherits(ConversionHint, Hint);


/**
 * We record where in the input string an argument comes so we can report errors
 * against those string positions.
 * We publish a 'change' event when-ever the text changes
 * @param emitter Arguments use something else to pass on change events.
 * Currently this will be the creating Requisition. This prevents dependency
 * loops and prevents us from needing to merge listener lists.
 * @param text The string (trimmed) that contains the argument
 * @param start The position of the text in the original input string
 * @param end See start
 * @param prefix Knowledge of quotation marks and whitespace used prior to the
 * text in the input string allows us to re-generate the original input from
 * the arguments.
 * @param suffix Any quotation marks and whitespace used after the text.
 * Whitespace is normally placed in the prefix to the succeeding argument, but
 * can be used here when this is the last argument.
 * @constructor
 */
function Argument(emitter, text, start, end, prefix, suffix) {
    this.emitter = emitter;
    this.setText(text);
    this.start = start;
    this.end = end;
    this.prefix = prefix;
    this.suffix = suffix;
}
Argument.prototype = {
    /**
     * Return the result of merging these arguments.
     * TODO: What happens when we're merging arguments for the single string
     * case and some of the arguments are in quotation marks?
     */
    merge: function(following) {
        if (following.emitter != this.emitter) {
            throw new Error('Can\'t merge Arguments from different EventEmitters');
        }
        return new Argument(
            this.emitter,
            this.text + this.suffix + following.prefix + following.text,
            this.start, following.end,
            this.prefix,
            following.suffix);
    },

    /**
     * See notes on events in Assignment. We might need to hook changes here
     * into a CliRequisition so they appear of the command line.
     */
    setText: function(text) {
        if (text == null) {
            throw new Error('Illegal text for Argument: ' + text);
        }
        var ev = { argument: this, oldText: this.text, text: text };
        this.text = text;
        this.emitter._dispatchEvent('argumentChange', ev);
    },

    /**
     * Helper when we're putting arguments back together
     */
    toString: function() {
        // TODO: There is a bug here - we should re-escape escaped characters
        // But can we do that reliably?
        return this.prefix + this.text + this.suffix;
    }
};

/**
 * Merge an array of arguments into a single argument.
 * All Arguments in the array are expected to have the same emitter
 */
Argument.merge = function(argArray, start, end) {
    start = (start === undefined) ? 0 : start;
    end = (end === undefined) ? argArray.length : end;

    var joined;
    for (var i = start; i < end; i++) {
        var arg = argArray[i];
        if (!joined) {
            joined = arg;
        }
        else {
            joined = joined.merge(arg);
        }
    }
    return joined;
};

/**
 * We sometimes need a way to say 'this error occurs where ever the cursor is'
 */
Argument.AT_CURSOR = -1;


/**
 * A link between a parameter and the data for that parameter.
 * The data for the parameter is available as in the preferred type and as
 * an Argument for the CLI.
 * <p>We also record validity information where applicable.
 * <p>For values, null and undefined have distinct definitions. null means
 * that a value has been provided, undefined means that it has not.
 * Thus, null is a valid default value, and common because it identifies an
 * parameter that is optional. undefined means there is no value from
 * the command line.
 * @constructor
 */
function Assignment(param, requisition) {
    this.param = param;
    this.requisition = requisition;
    this.setValue(param.defaultValue);
};
Assignment.prototype = {
    /**
     * The parameter that we are assigning to
     * @readonly
     */
    param: undefined,

    /**
     * Report on the status of the last parse() conversion.
     * @see types.Conversion
     */
    conversion: undefined,

    /**
     * The current value in a type as specified by param.type
     */
    value: undefined,

    /**
     * The string version of the current value
     */
    arg: undefined,

    /**
     * The current value (i.e. not the string representation)
     * Use setValue() to mutate
     */
    value: undefined,
    setValue: function(value) {
        if (this.value === value) {
            return;
        }

        if (value === undefined) {
            this.value = this.param.defaultValue;
            this.conversion = this.param.getDefault ?
                    this.param.getDefault() :
                    this.param.type.getDefault();
            this.arg = undefined;
        } else {
            this.value = value;
            this.conversion = undefined;
            var text = (value == null) ? '' : this.param.type.stringify(value);
            if (this.arg) {
                this.arg.setText(text);
            }
        }

        this.requisition._assignmentChanged(this);
    },

    /**
     * The textual representation of the current value
     * Use setValue() to mutate
     */
    arg: undefined,
    setArgument: function(arg) {
        if (this.arg === arg) {
            return;
        }
        this.arg = arg;
        this.conversion = this.param.type.parse(arg.text);
        this.conversion.arg = arg; // TODO: make this automatic?
        this.value = this.conversion.value;
        this.requisition._assignmentChanged(this);
    },

    /**
     * Create a list of the hints associated with this parameter assignment.
     * Generally there will be only one hint generated because we're currently
     * only displaying one hint at a time, ordering by distance from cursor
     * and severity. Since distance from cursor will be the same for all hints
     * from this assignment all but the most severe will ever be used. It might
     * make sense with more experience to alter this to function to be getHint()
     */
    getHint: function() {
        // Allow the parameter to provide documentation
        if (this.param.getCustomHint && this.value && this.arg) {
            var hint = this.param.getCustomHint(this.value, this.arg);
            if (hint) {
                return hint;
            }
        }

        // If there is no argument, use the cursor position
        var message = '<strong>' + this.param.name + '</strong>: ';
        if (this.param.description) {
            // TODO: This should be a short description - do we need to trim?
            message += this.param.description.trim();

            // Ensure the help text ends with '. '
            if (message.charAt(message.length - 1) !== '.') {
                message += '.';
            }
            if (message.charAt(message.length - 1) !== ' ') {
                message += ' ';
            }
        }
        var status = Status.VALID;
        var start = this.arg ? this.arg.start : Argument.AT_CURSOR;
        var end = this.arg ? this.arg.end : Argument.AT_CURSOR;
        var predictions;

        // Non-valid conversions will have useful information to pass on
        if (this.conversion) {
            status = this.conversion.status;
            if (this.conversion.message) {
                message += this.conversion.message;
            }
            predictions = this.conversion.predictions;
        }

        // Hint if the param is required, but not provided
        var argProvided = this.arg && this.arg.text !== '';
        var dataProvided = this.value !== undefined || argProvided;
        if (this.param.defaultValue === undefined && !dataProvided) {
            status = Status.INVALID;
            message += '<strong>Required<\strong>';
        }

        return new Hint(status, message, start, end, predictions);
    },

    /**
     * Basically <tt>setValue(conversion.predictions[0])</tt> done in a safe
     * way.
     */
    complete: function() {
        if (this.conversion && this.conversion.predictions &&
                this.conversion.predictions.length > 0) {
            this.setValue(this.conversion.predictions[0]);
        }
    },

    /**
     * If the cursor is at 'position', do we have sufficient data to start
     * displaying the next hint. This is both complex and important.
     * For example, if the user has just typed:<ul>
     * <li>'set tabstop ' then they clearly want to know about the valid
     *     values for the tabstop setting, so the hint is based on the next
     *     parameter.
     * <li>'set tabstop' (without trailing space) - they will probably still
     *     want to know about the valid values for the tabstop setting because
     *     there is no confusion about the setting in question.
     * <li>'set tabsto' they've not finished typing a setting name so the hint
     *     should be based on the current parameter.
     * <li>'set tabstop' (when there is an additional tabstopstyle setting) we
     *     can't make assumptions about the setting - we're not finished.
     * </ul>
     * <p>Note that the input for 2 and 4 is identical, only the configuration
     * has changed, so hint display is environmental.
     *
     * <p>This function works out if the cursor is before the end of this
     * assignment (assuming that we've asked the same thing of the previous
     * assignment) and then attempts to work out if we should use the hint from
     * the next assignment even though technically the cursor is still inside
     * this one due to the rules above.
     */
    isPositionCaptured: function(position) {
        if (!this.arg) {
            return false;
        }

        // Note we don't check if position >= this.arg.start because that's
        // implied by the fact that we're asking the assignments in turn, and
        // we want to avoid thing falling between the cracks, but we do need
        // to check that the argument does have a position
        if (this.arg.start === -1) {
            return false;
        }

        // We're clearly done if the position is past the end of the text
        if (position > this.arg.end) {
            return false;
        }

        // If we're AT the end, the position is captured if either the status
        // is not valid or if there are other valid options including current
        if (position === this.arg.end) {
            return this.conversion.status !== Status.VALID ||
                    this.conversion.predictions.length !== 0;
        }

        // Otherwise we're clearly inside
        return true;
    },

    /**
     * Replace the current value with the lower value if such a concept
     * exists.
     */
    decrement: function() {
        var replacement = this.param.type.decrement(this.value);
        if (replacement != null) {
            this.setValue(replacement);
        }
    },

    /**
     * Replace the current value with the higher value if such a concept
     * exists.
     */
    increment: function() {
        var replacement = this.param.type.increment(this.value);
        if (replacement != null) {
            this.setValue(replacement);
        }
    },

    /**
     * Helper when we're rebuilding command lines.
     */
    toString: function() {
        return this.arg ? this.arg.toString() : '';
    }
};
exports.Assignment = Assignment;


/**
 * This is a special parameter to reflect the command itself.
 */
var commandParam = {
    name: '__command',
    type: 'command',
    description: 'The command to execute',

    /**
     * Provide some documentation for a command.
     */
    getCustomHint: function(command, arg) {
        var docs = [];
        docs.push('<strong><tt> &gt; ');
        docs.push(command.name);
        if (command.params && command.params.length > 0) {
            command.params.forEach(function(param) {
                if (param.defaultValue === undefined) {
                    docs.push(' [' + param.name + ']');
                }
                else {
                    docs.push(' <em>[' + param.name + ']</em>');
                }
            }, this);
        }
        docs.push('</tt></strong><br/>');

        docs.push(command.description ? command.description : '(No description)');
        docs.push('<br/>');

        if (command.params && command.params.length > 0) {
            docs.push('<ul>');
            command.params.forEach(function(param) {
                docs.push('<li>');
                docs.push('<strong><tt>' + param.name + '</tt></strong>: ');
                docs.push(param.description ? param.description : '(No description)');
                if (param.defaultValue === undefined) {
                    docs.push(' <em>[Required]</em>');
                }
                else if (param.defaultValue === null) {
                    docs.push(' <em>[Optional]</em>');
                }
                else {
                    docs.push(' <em>[Default: ' + param.defaultValue + ']</em>');
                }
                docs.push('</li>');
            }, this);
            docs.push('</ul>');
        }

        return new Hint(Status.VALID, docs.join(''), arg);
    }
};

/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 * CliRequisition adds functions for parsing input from a command line to this
 * class.
 * <h2>Events<h2>
 * We publish the following events:<ul>
 * <li>argumentChange: The text of some argument has changed. It is likely that
 * any UI component displaying this argument will need to be updated. (Note that
 * this event is actually published by the Argument itself - see the docs for
 * Argument for more details)
 * The event object looks like: { argument: A, oldText: B, text: B }
 * <li>commandChange: The command has changed. It is likely that a UI
 * structure will need updating to match the parameters of the new command.
 * The event object looks like { command: A }
 * @constructor
 */
function Requisition(env) {
    this.env = env;
    this.commandAssignment = new Assignment(commandParam, this);
}

Requisition.prototype = {
    /**
     * The command that we are about to execute.
     * @see setCommandConversion()
     * @readonly
     */
    commandAssignment: undefined,

    /**
     * The count of assignments. Excludes the commandAssignment
     * @readonly
     */
    assignmentCount: undefined,

    /**
     * The object that stores of Assignment objects that we are filling out.
     * The Assignment objects are stored under their param.name for named
     * lookup. Note: We make use of the property of Javascript objects that
     * they are not just hashmaps, but linked-list hashmaps which iterate in
     * insertion order.
     * Excludes the commandAssignment.
     */
    _assignments: undefined,

    /**
     * The store of hints generated by the assignments. We are trying to prevent
     * the UI from needing to access this in broad form, but instead use
     * methods that query part of this structure.
     */
    _hints: undefined,

    /**
     * When the command changes, we need to keep a bunch of stuff in sync
     */
    _assignmentChanged: function(assignment) {
        // This is all about re-creating Assignments
        if (assignment.param.name !== '__command') {
            return;
        }

        this._assignments = {};

        if (assignment.value) {
            assignment.value.params.forEach(function(param) {
                this._assignments[param.name] = new Assignment(param, this);
            }, this);
        }

        this.assignmentCount = Object.keys(this._assignments).length;
        this._dispatchEvent('commandChange', { command: assignment.value });
    },

    /**
     * Assignments have an order, so we need to store them in an array.
     * But we also need named access ...
     */
    getAssignment: function(nameOrNumber) {
        var name = (typeof nameOrNumber === 'string') ?
            nameOrNumber :
            Object.keys(this._assignments)[nameOrNumber];
        return this._assignments[name];
    },

    /**
     * Where parameter name == assignment names - they are the same.
     */
    getParameterNames: function() {
        return Object.keys(this._assignments);
    },

    /**
     * A *shallow* clone of the assignments.
     * This is useful for systems that wish to go over all the assignments
     * finding values one way or another and wish to trim an array as they go.
     */
    cloneAssignments: function() {
        return Object.keys(this._assignments).map(function(name) {
            return this._assignments[name];
        }, this);
    },

    /**
     * Collect the statuses from the Assignments.
     * The hints returned are sorted by severity
     */
    _updateHints: function() {
        // TODO: work out when to clear this out for the plain Requisition case
        // this._hints = [];
        this.getAssignments(true).forEach(function(assignment) {
            this._hints.push(assignment.getHint());
        }, this);
        Hint.sort(this._hints);

        // We would like to put some initial help here, but for anyone but
        // a complete novice a 'type help' message is very annoying, so we
        // need to find a way to only display this message once, or for
        // until the user click a 'close' button or similar
        // TODO: Add special case for '' input
    },

    /**
     * Returns the most severe status
     */
    getWorstHint: function() {
        return this._hints[0];
    },

    /**
     * Extract the names and values of all the assignments, and return as
     * an object.
     */
    getArgsObject: function() {
        var args = {};
        this.getAssignments().forEach(function(assignment) {
            args[assignment.param.name] = assignment.value;
        }, this);
        return args;
    },

    /**
     * Access the arguments as an array.
     * @param includeCommand By default only the parameter arguments are
     * returned unless (includeCommand === true), in which case the list is
     * prepended with commandAssignment.arg
     */
    getAssignments: function(includeCommand) {
        var args = [];
        if (includeCommand === true) {
            args.push(this.commandAssignment);
        }
        Object.keys(this._assignments).forEach(function(name) {
            args.push(this.getAssignment(name));
        }, this);
        return args;
    },

    /**
     * Reset all the assignments to their default values
     */
    setDefaultValues: function() {
        this.getAssignments().forEach(function(assignment) {
            assignment.setValue(undefined);
        }, this);
    },

    /**
     * Helper to call canon.exec
     */
    exec: function() {
        canon.exec(this.commandAssignment.value,
              this.env,
              "cli",
              this.getArgsObject(),
              this.toCanonicalString());
    },

    /**
     * Extract a canonical version of the input
     */
    toCanonicalString: function() {
        var line = [];
        line.push(this.commandAssignment.value.name);
        Object.keys(this._assignments).forEach(function(name) {
            var assignment = this._assignments[name];
            var type = assignment.param.type;
            // TODO: This will cause problems if there is a non-default value
            // after a default value. Also we need to decide when to use
            // named parameters in place of positional params. Both can wait.
            if (assignment.value !== assignment.param.defaultValue) {
                line.push(' ');
                line.push(type.stringify(assignment.value));
            }
        }, this);
        return line.join('');
    }
};
oop.implement(Requisition.prototype, EventEmitter);
exports.Requisition = Requisition;


/**
 * An object used during command line parsing to hold the various intermediate
 * data steps.
 * <p>The 'output' of the update is held in 2 objects: input.hints which is an
 * array of hints to display to the user. In the future this will become a
 * single value.
 * <p>The other output value is input.requisition which gives access to an
 * args object for use in executing the final command.
 *
 * <p>The majority of the functions in this class are called in sequence by the
 * constructor. Their task is to add to <tt>hints</tt> fill out the requisition.
 * <p>The general sequence is:<ul>
 * <li>_tokenize(): convert _typed into _parts
 * <li>_split(): convert _parts into _command and _unparsedArgs
 * <li>_assign(): convert _unparsedArgs into requisition
 * </ul>
 *
 * @param typed {string} The instruction as typed by the user so far
 * @param options {object} A list of optional named parameters. Can be any of:
 * <b>flags</b>: Flags for us to check against the predicates specified with the
 * commands. Defaulted to <tt>keyboard.buildFlags({ });</tt>
 * if not specified.
 * @constructor
 */
function CliRequisition(env, options) {
    Requisition.call(this, env);

    if (options && options.flags) {
        /**
         * TODO: We were using a default of keyboard.buildFlags({ });
         * This allowed us to have commands that only existed in certain contexts
         * - i.e. Javascript specific commands.
         */
        this.flags = options.flags;
    }
}
oop.inherits(CliRequisition, Requisition);
(function() {
    /**
     * Called by the UI when ever the user interacts with a command line input
     * @param input A structure that details the state of the input field.
     * It should look something like: { typed:a, cursor: { start:b, end:c } }
     * Where a is the contents of the input field, and b and c are the start
     * and end of the cursor/selection respectively.
     */
    CliRequisition.prototype.update = function(input) {
        this.input = input;
        this._hints = [];

        var args = this._tokenize(input.typed);
        this._split(args);

        if (this.commandAssignment.value) {
            this._assign(args);
        }

        this._updateHints();
    };

    /**
     * Return an array of Status scores so we can create a marked up
     * version of the command line input.
     */
    CliRequisition.prototype.getInputStatusMarkup = function() {
        // 'scores' is an array which tells us what chars are errors
        // Initialize with everything VALID
        var scores = this.toString().split('').map(function(ch) {
            return Status.VALID;
        });
        // For all chars in all hints, check and upgrade the score
        this._hints.forEach(function(hint) {
            for (var i = hint.start; i <= hint.end; i++) {
                if (hint.status > scores[i]) {
                    scores[i] = hint.status;
                }
            }
        }, this);
        return scores;
    };

    /**
     * Reconstitute the input from the args
     */
    CliRequisition.prototype.toString = function() {
        return this.getAssignments(true).map(function(assignment) {
            return assignment.toString();
        }, this).join('');
    };

    var superUpdateHints = CliRequisition.prototype._updateHints;
    /**
     * Marks up hints in a number of ways:
     * - Makes INCOMPLETE hints that are not near the cursor INVALID since
     *   they can't be completed by typing
     * - Finds the most severe hint, and annotates the array with it
     * - Finds the hint to display, and also annotates the array with it
     * TODO: I'm wondering if array annotation is evil and we should replace
     * this with an object. Need to find out more.
     */
    CliRequisition.prototype._updateHints = function() {
        superUpdateHints.call(this);

        // Not knowing about cursor positioning, the requisition and assignments
        // can't know this, but anything they mark as INCOMPLETE is actually
        // INVALID unless the cursor is actually inside that argument.
        var c = this.input.cursor;
        this._hints.forEach(function(hint) {
            var startInHint = c.start >= hint.start && c.start <= hint.end;
            var endInHint = c.end >= hint.start && c.end <= hint.end;
            var inHint = startInHint || endInHint;
            if (!inHint && hint.status === Status.INCOMPLETE) {
                 hint.status = Status.INVALID;
            }
        }, this);

        Hint.sort(this._hints);
    };

    /**
     * Accessor for the hints array.
     * While we could just use the hints property, using getHints() is
     * preferred for symmetry with Requisition where it needs a function due to
     * lack of an atomic update system.
     */
    CliRequisition.prototype.getHints = function() {
        return this._hints;
    };

    /**
     * Look through the arguments attached to our assignments for the assignment
     * at the given position.
     */
    CliRequisition.prototype.getAssignmentAt = function(position) {
        var assignments = this.getAssignments(true);
        for (var i = 0; i < assignments.length; i++) {
            var assignment = assignments[i];
            if (!assignment.arg) {
                // There is no argument in this assignment, we've fallen off
                // the end of the obvious answers - it must be this one.
                return assignment;
            }
            if (assignment.isPositionCaptured(position)) {
                return assignment;
            }
        }

        return assignment;
    };

    /**
     * Split up the input taking into account ' and "
     */
    CliRequisition.prototype._tokenize = function(typed) {
        // For blank input, place a dummy empty argument into the list
        if (typed == null || typed.length === 0) {
            return [ new Argument(this, '', 0, 0, '', '') ];
        }

        var OUTSIDE = 1;     // The last character was whitespace
        var IN_SIMPLE = 2;   // The last character was part of a parameter
        var IN_SINGLE_Q = 3; // We're inside a single quote: '
        var IN_DOUBLE_Q = 4; // We're inside double quotes: "

        var mode = OUTSIDE;

        // First we un-escape. This list was taken from:
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Unicode
        // We are generally converting to their real values except for \', \"
        // and '\ ' which we are converting to unicode private characters so we
        // can distinguish them from ', " and ' ', which have special meaning.
        // They need swapping back post-split - see unescape2()
        typed = typed
                .replace(/\\\\/g, '\\')
                .replace(/\\b/g, '\b')
                .replace(/\\f/g, '\f')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\v/g, '\v')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\ /g, '\uF000')
                .replace(/\\'/g, '\uF001')
                .replace(/\\"/g, '\uF002');

        function unescape2(str) {
            return str
                .replace(/\uF000/g, ' ')
                .replace(/\uF001/g, '\'')
                .replace(/\uF002/g, '"');
        }

        var i = 0;
        var start = 0; // Where did this section start?
        var prefix = '';
        var args = [];

        while (true) {
            if (i >= typed.length) {
                // There is nothing else to read - tidy up
                if (mode !== OUTSIDE) {
                    var str = unescape2(typed.substring(start, i));
                    args.push(new Argument(this, str, start, i, prefix, ''));
                }
                else {
                    if (i !== start) {
                        // There's a bunch of whitespace at the end of the
                        // command add it to the last argument's suffix,
                        // creating an empty argument if needed.
                        var extra = typed.substring(start, i);
                        var lastArg = args[args.length - 1];
                        if (!lastArg) {
                            lastArg = new Argument(this, '', i, i, extra, '');
                            args.push(lastArg);
                        }
                        else {
                            lastArg.suffix += extra;
                        }
                    }
                }
                break;
            }

            var c = typed[i];
            switch (mode) {
                case OUTSIDE:
                    if (c === '\'') {
                        prefix = typed.substring(start, i + 1);
                        mode = IN_SINGLE_Q;
                        start = i + 1;
                    }
                    else if (c === '"') {
                        prefix = typed.substring(start, i + 1);
                        mode = IN_DOUBLE_Q;
                        start = i + 1;
                    }
                    else if (/ /.test(c)) {
                        // Still whitespace, do nothing
                    }
                    else {
                        prefix = typed.substring(start, i);
                        mode = IN_SIMPLE;
                        start = i;
                    }
                    break;

                case IN_SIMPLE:
                    // There is an edge case of xx'xx which we are assuming to
                    // be a single parameter (and same with ")
                    if (c === ' ') {
                        var str = unescape2(typed.substring(start, i));
                        args.push(new Argument(this, str,
                                start, i, prefix, ''));
                        mode = OUTSIDE;
                        start = i;
                        prefix = '';
                    }
                    break;

                case IN_SINGLE_Q:
                    if (c === '\'') {
                        var str = unescape2(typed.substring(start, i));
                        args.push(new Argument(this, str,
                                start - 1, i + 1, prefix, c));
                        mode = OUTSIDE;
                        start = i + 1;
                        prefix = '';
                    }
                    break;

                case IN_DOUBLE_Q:
                    if (c === '"') {
                        var str = unescape2(typed.substring(start, i));
                        args.push(new Argument(this, str,
                                start - 1, i + 1, prefix, c));
                        mode = OUTSIDE;
                        start = i + 1;
                        prefix = '';
                    }
                    break;
            }

            i++;
        }

        return args;
    };

    /**
     * Looks in the canon for a command extension that matches what has been
     * typed at the command line.
     */
    CliRequisition.prototype._split = function(args) {
        var argsUsed = 1;
        var arg;

        while (argsUsed <= args.length) {
            var arg = Argument.merge(args, 0, argsUsed);
            this.commandAssignment.setArgument(arg);

            if (!this.commandAssignment.value) {
                // Not found. break with value == null
                break;
            }

            /*
            // Previously we needed a way to hide commands depending context.
            // We have not resurrected that feature yet.
            if (!keyboard.flagsMatch(command.predicates, this.flags)) {
                // If the predicates say 'no match' then go LA LA LA
                command = null;
                break;
            }
            */

            if (this.commandAssignment.value.exec) {
                // Valid command, break with command valid
                for (var i = 0; i < argsUsed; i++) {
                    args.shift();
                }
                break;
            }

            argsUsed++;
        }
    };

    /**
     * Work out which arguments are applicable to which parameters.
     * <p>This takes #_command.params and #_unparsedArgs and creates a map of
     * param names to 'assignment' objects, which have the following properties:
     * <ul>
     * <li>param - The matching parameter.
     * <li>index - Zero based index into where the match came from on the input
     * <li>value - The matching input
     * </ul>
     */
    CliRequisition.prototype._assign = function(args) {
        if (args.length === 0) {
            this.setDefaultValues();
            return;
        }

        // Create an error if the command does not take parameters, but we have
        // been given them ...
        if (this.assignmentCount === 0) {
            // TODO: previously we were doing some extra work to avoid this if
            // we determined that we had args that were all whitespace, but
            // probably given our tighter tokenize() this won't be an issue?
            this._hints.push(new Hint(Status.INVALID,
                    this.commandAssignment.value.name +
                    ' does not take any parameters',
                    Argument.merge(args)));
            return;
        }

        // Special case: if there is only 1 parameter, and that's of type
        // text we put all the params into the first param
        if (this.assignmentCount === 1) {
            var assignment = this.getAssignment(0);
            if (assignment.param.type.name === 'text') {
                assignment.setArgument(Argument.merge(args));
                return;
            }
        }

        var assignments = this.cloneAssignments();
        var names = this.getParameterNames();

        // Extract all the named parameters
        var used = [];
        assignments.forEach(function(assignment) {
            var namedArgText = '--' + assignment.name;

            var i = 0;
            while (true) {
                var arg = args[i];
                if (namedArgText !== arg.text) {
                    i++;
                    if (i >= args.length) {
                        break;
                    }
                    continue;
                }

                // boolean parameters don't have values, default to false
                if (assignment.param.type.name === 'boolean') {
                    assignment.setValue(true);
                }
                else {
                    if (i + 1 < args.length) {
                        // Missing value portion of this named param
                        this._hints.push(new Hint(Status.INCOMPLETE,
                                'Missing value for: ' + namedArgText,
                                args[i]));
                    }
                    else {
                        args.splice(i + 1, 1);
                        assignment.setArgument(args[i + 1]);
                    }
                }

                lang.arrayRemove(names, assignment.name);
                args.splice(i, 1);
                // We don't need to i++ if we splice
            }
        }, this);

        // What's left are positional parameters assign in order
        names.forEach(function(name) {
            var assignment = this.getAssignment(name);
            if (args.length === 0) {
                // No more values
                assignment.setValue(undefined); // i.e. default
            }
            else {
                var arg = args[0];
                args.splice(0, 1);
                assignment.setArgument(arg);
            }
        }, this);

        if (args.length > 0) {
            var remaining = Argument.merge(args);
            this._hints.push(new Hint(Status.INVALID,
                    'Input \'' + remaining.text + '\' makes no sense.',
                    remaining));
        }
    };

})();
exports.CliRequisition = CliRequisition;


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/settings'), ['pilot/types','pilot/types/basic'], function (require, exports, module) {



var types = require("pilot/types");
var SelectionType = require('pilot/types/basic').SelectionType;

var direction = new SelectionType({
    name: 'direction',
    data: [ 'above', 'below' ]
});

var hintDirectionSetting = {
    name: "hintDirection",
    description: "Are hints shown above or below the command line?",
    type: "direction",
    defaultValue: "above"
};

var outputDirectionSetting = {
    name: "outputDirection",
    description: "Is the output window shown above or below the command line?",
    type: "direction",
    defaultValue: "above"
};

var outputHeightSetting = {
    name: "outputHeight",
    description: "What height should the output panel be?",
    type: "number",
    defaultValue: 300
};

exports.startup = function(data, reason) {
    types.registerType(direction);
    data.env.settings.addSetting(hintDirectionSetting);
    data.env.settings.addSetting(outputDirectionSetting);
    data.env.settings.addSetting(outputHeightSetting);
};

exports.shutdown = function(data, reason) {
    types.unregisterType(direction);
    data.env.settings.removeSetting(hintDirectionSetting);
    data.env.settings.removeSetting(outputDirectionSetting);
    data.env.settings.removeSetting(outputHeightSetting);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/cli_view'), ['text!cockpit/ui/cli_view.css','pilot/event','pilot/dom','pilot/event','pilot/keys','pilot/canon','pilot/types','cockpit/cli','cockpit/cli','cockpit/ui/request_view'], function (require, exports, module) {



var editorCss = require("text!cockpit/ui/cli_view.css");
var event = require("pilot/event");
var dom = require("pilot/dom");

dom.importCssString(editorCss);

var event = require("pilot/event");
var keys = require("pilot/keys");
var canon = require("pilot/canon");
var Status = require('pilot/types').Status;

var CliRequisition = require('cockpit/cli').CliRequisition;
var Hint = require('cockpit/cli').Hint;
var RequestView = require('cockpit/ui/request_view').RequestView;

var NO_HINT = new Hint(Status.VALID, '', 0, 0);

/**
 * On startup we need to:
 * 1. Add 3 sets of elements to the DOM for:
 * - command line output
 * - input hints
 * - completion
 * 2. Attach a set of events so the command line works
 */
exports.startup = function(data, reason) {
    var cli = new CliRequisition(data.env);
    var cliView = new CliView(cli, data.env);
    data.env.cli = cli;
};

/**
 * A class to handle the simplest UI implementation
 */
function CliView(cli, env) {
    cli.cliView = this;
    this.cli = cli;
    this.doc = document;
    this.win = dom.getParentWindow(this.doc);
    this.env = env;

    // TODO: we should have a better way to specify command lines???
    this.element = this.doc.getElementById('cockpitInput');
    if (!this.element) {
        // console.log('No element with an id of cockpit. Bailing on cli');
        return;
    }

    this.settings = env.settings;
    this.hintDirection = this.settings.getSetting('hintDirection');
    this.outputDirection = this.settings.getSetting('outputDirection');
    this.outputHeight = this.settings.getSetting('outputHeight');

    // If the requisition tells us something has changed, we use this to know
    // if we should ignore it
    this.isUpdating = false;

    this.createElements();
    this.update();
}
CliView.prototype = {
    /**
     * Create divs for completion, hints and output
     */
    createElements: function() {
        var input = this.element;

        this.element.spellcheck = false;

        this.output = this.doc.getElementById('cockpitOutput');
        this.popupOutput = (this.output == null);
        if (!this.output) {
            this.output = this.doc.createElement('div');
            this.output.id = 'cockpitOutput';
            this.output.className = 'cptOutput';
            input.parentNode.insertBefore(this.output, input.nextSibling);

            var setMaxOutputHeight = function() {
                this.output.style.maxHeight = this.outputHeight.get() + 'px';
            }.bind(this);
            this.outputHeight.addEventListener('change', setMaxOutputHeight);
            setMaxOutputHeight();
        }

        this.completer = this.doc.createElement('div');
        this.completer.className = 'cptCompletion VALID';

        this.completer.style.color = dom.computedStyle(input, "color");
        this.completer.style.fontSize = dom.computedStyle(input, "fontSize");
        this.completer.style.fontFamily = dom.computedStyle(input, "fontFamily");
        this.completer.style.fontWeight = dom.computedStyle(input, "fontWeight");
        this.completer.style.fontStyle = dom.computedStyle(input, "fontStyle");
        input.parentNode.insertBefore(this.completer, input.nextSibling);

        // Transfer background styling to the completer.
        this.completer.style.backgroundColor = input.style.backgroundColor;
        input.style.backgroundColor = 'transparent';

        this.hinter = this.doc.createElement('div');
        this.hinter.className = 'cptHints';
        input.parentNode.insertBefore(this.hinter, input.nextSibling);

        var resizer = this.resizer.bind(this);
        event.addListener(this.win, 'resize', resizer);
        this.hintDirection.addEventListener('change', resizer);
        this.outputDirection.addEventListener('change', resizer);
        resizer();

        canon.addEventListener('output',  function(ev) {
            new RequestView(ev.request, this);
        }.bind(this));
        event.addCommandKeyListener(input, this.onCommandKey.bind(this));
        event.addListener(input, 'keyup', this.onKeyUp.bind(this));

        // cursor position affects hint severity. TODO: shortcuts for speed
        event.addListener(input, 'mouseup', function(ev) {
            this.isUpdating = true;
            this.update();
            this.isUpdating = false;
        }.bind(this));

        this.cli.addEventListener('argumentChange', this.onArgChange.bind(this));

        event.addListener(input, "focus", function() {
            dom.addCssClass(this.output, "cptFocusPopup");
            dom.addCssClass(this.hinter, "cptFocusPopup");
        }.bind(this));

        function hideOutput() {
            dom.removeCssClass(this.output, "cptFocusPopup");
            dom.removeCssClass(this.hinter, "cptFocusPopup");
        };
        event.addListener(input, "blur", hideOutput.bind(this));
        hideOutput.call(this);
    },

    /**
     * We need to see the output of the latest command entered
     */
    scrollOutputToBottom: function() {
        // Certain browsers have a bug such that scrollHeight is too small
        // when content does not fill the client area of the element
        var scrollHeight = Math.max(this.output.scrollHeight, this.output.clientHeight);
        this.output.scrollTop = scrollHeight - this.output.clientHeight;
    },

    /**
     * To be called on window resize or any time we want to align the elements
     * with the input box.
     */
    resizer: function() {
        var rect = this.element.getClientRects()[0];

        this.completer.style.top = rect.top + 'px';
        var height = rect.bottom - rect.top;
        this.completer.style.height = height + 'px';
        this.completer.style.lineHeight = height + 'px';
        this.completer.style.left = rect.left + 'px';
        var width = rect.right - rect.left;
        this.completer.style.width = width + 'px';

        if (this.hintDirection.get() === 'below') {
            this.hinter.style.top = rect.bottom + 'px';
            this.hinter.style.bottom = 'auto';
        }
        else {
            this.hinter.style.top = 'auto';
            this.hinter.style.bottom = (this.doc.documentElement.clientHeight - rect.top) + 'px';
        }
        this.hinter.style.left = (rect.left + 30) + 'px';
        this.hinter.style.maxWidth = (width - 110) + 'px';

        if (this.popupOutput) {
            if (this.outputDirection.get() === 'below') {
                this.output.style.top = rect.bottom + 'px';
                this.output.style.bottom = 'auto';
            }
            else {
                this.output.style.top = 'auto';
                this.output.style.bottom = (this.doc.documentElement.clientHeight - rect.top) + 'px';
            }
            this.output.style.left = rect.left + 'px';
            this.output.style.width = (width - 80) + 'px';
        }
    },

    /**
     * Ensure that TAB isn't handled by the browser
     */
onCommandKey: function(ev, hashId, keyCode) {
        var stopEvent;
        if (keyCode === keys.TAB ||
                keyCode === keys.UP ||
                keyCode === keys.DOWN) {
            stopEvent = true;
        } else if (hashId != 0 || keyCode != 0) {
            stopEvent = canon.execKeyCommand(this.env, 'cli', hashId, keyCode);
        }
        stopEvent && event.stopEvent(ev);
    },

    /**
     * The main keyboard processing loop
     */
    onKeyUp: function(ev) {
        var handled;
        /*
        var handled = keyboardManager.processKeyEvent(ev, this, {
            isCommandLine: true, isKeyUp: true
        });
        */

        // RETURN does a special exec/highlight thing
        if (ev.keyCode === keys.RETURN) {
            var worst = this.cli.getWorstHint();
            // Deny RETURN unless the command might work
            if (worst.status === Status.VALID) {
                this.cli.exec();
                this.element.value = '';
            }
            else {
                // If we've denied RETURN because the command was not VALID,
                // select the part of the command line that is causing problems
                // TODO: if there are 2 errors are we picking the right one?
                dom.setSelectionStart(this.element, worst.start);
                dom.setSelectionEnd(this.element, worst.end);
            }
        }

        this.update();

        // Special actions which delegate to the assignment
        var current = this.cli.getAssignmentAt(dom.getSelectionStart(this.element));
        if (current) {
            // TAB does a special complete thing
            if (ev.keyCode === keys.TAB) {
                current.complete();
                this.update();
            }

            // UP/DOWN look for some history
            if (ev.keyCode === keys.UP) {
                current.increment();
                this.update();
            }
            if (ev.keyCode === keys.DOWN) {
                current.decrement();
                this.update();
            }
        }

        return handled;
    },

    /**
     * Actually parse the input and make sure we're all up to date
     */
    update: function() {
        this.isUpdating = true;
        var input = {
            typed: this.element.value,
            cursor: {
                start: dom.getSelectionStart(this.element),
                end: dom.getSelectionEnd(this.element.selectionEnd)
            }
        };
        this.cli.update(input);

        var display = this.cli.getAssignmentAt(input.cursor.start).getHint();

        // 1. Update the completer with prompt/error marker/TAB info
        dom.removeCssClass(this.completer, Status.VALID.toString());
        dom.removeCssClass(this.completer, Status.INCOMPLETE.toString());
        dom.removeCssClass(this.completer, Status.INVALID.toString());

        var completion = '<span class="cptPrompt">&gt;</span> ';
        if (this.element.value.length > 0) {
            var scores = this.cli.getInputStatusMarkup();
            completion += this.markupStatusScore(scores);
        }

        // Display the "-> prediction" at the end of the completer
        if (this.element.value.length > 0 &&
                display.predictions && display.predictions.length > 0) {
            var tab = display.predictions[0];
            completion += ' &nbsp;&#x21E5; ' + (tab.name ? tab.name : tab);
        }
        this.completer.innerHTML = completion;
        dom.addCssClass(this.completer, this.cli.getWorstHint().status.toString());

        // 2. Update the hint element
        var hint = '';
        if (this.element.value.length !== 0) {
            hint += display.message;
            if (display.predictions && display.predictions.length > 0) {
                hint += ': [ ';
                display.predictions.forEach(function(prediction) {
                    hint += (prediction.name ? prediction.name : prediction);
                    hint += ' | ';
                }, this);
                hint = hint.replace(/\| $/, ']');
            }
        }

        this.hinter.innerHTML = hint;
        if (hint.length === 0) {
            dom.addCssClass(this.hinter, 'cptNoPopup');
        }
        else {
            dom.removeCssClass(this.hinter, 'cptNoPopup');
        }

        this.isUpdating = false;
    },

    /**
     * Markup an array of Status values with spans
     */
    markupStatusScore: function(scores) {
        var completion = '';
        // Create mark-up
        var i = 0;
        var lastStatus = -1;
        while (true) {
            if (lastStatus !== scores[i]) {
                completion += '<span class=' + scores[i].toString() + '>';
                lastStatus = scores[i];
            }
            completion += this.element.value[i];
            i++;
            if (i === this.element.value.length) {
                completion += '</span>';
                break;
            }
            if (lastStatus !== scores[i]) {
                completion += '</span>';
            }
        }

        return completion;
    },

    /**
     * Update the input element to reflect the changed argument
     */
    onArgChange: function(ev) {
        if (this.isUpdating) {
            return;
        }

        var prefix = this.element.value.substring(0, ev.argument.start);
        var suffix = this.element.value.substring(ev.argument.end);
        var insert = typeof ev.text === 'string' ? ev.text : ev.text.name;
        this.element.value = prefix + insert + suffix;
        // Fix the cursor.
        var insertEnd = (prefix + insert).length;
        this.element.selectionStart = insertEnd;
        this.element.selectionEnd = insertEnd;
    }
};
exports.CliView = CliView;


});
require.memoize('text!'+bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/cli_view.css'), [], function () {
return ["","#cockpitInput { padding-left: 16px; }","",".cptOutput { overflow: auto; position: absolute; z-index: 999; display: none; }","",".cptCompletion { padding: 0; position: absolute; z-index: -1000; }",".cptCompletion.VALID { background: #FFF; }",".cptCompletion.INCOMPLETE { background: #DDD; }",".cptCompletion.INVALID { background: #DDD; }",".cptCompletion span { color: #FFF; }",".cptCompletion span.INCOMPLETE { color: #DDD; border-bottom: 2px dotted #F80; }",".cptCompletion span.INVALID { color: #DDD; border-bottom: 2px dotted #F00; }","span.cptPrompt { color: #66F; font-weight: bold; }","","",".cptHints {","  color: #000;","  position: absolute;","  border: 1px solid rgba(230, 230, 230, 0.8);","  background: rgba(250, 250, 250, 0.8);","  -moz-border-radius-topleft: 10px;","  -moz-border-radius-topright: 10px;","  border-top-left-radius: 10px; border-top-right-radius: 10px;","  z-index: 1000;","  padding: 8px;","  display: none;","}","",".cptFocusPopup { display: block; }",".cptFocusPopup.cptNoPopup { display: none; }","",".cptHints ul { margin: 0; padding: 0 15px; }","",".cptGt { font-weight: bold; font-size: 120%; }",""].join("\n");
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/request_view'), ['pilot/dom','pilot/event','text!cockpit/ui/request_view.html','pilot/domtemplate','text!cockpit/ui/request_view.css'], function (require, exports, module) {


var dom = require("pilot/dom");
var event = require("pilot/event");
var requestViewHtml = require("text!cockpit/ui/request_view.html");
var Templater = require("pilot/domtemplate").Templater;

var requestViewCss = require("text!cockpit/ui/request_view.css");
dom.importCssString(requestViewCss);

/**
 * Pull the HTML into the DOM, but don't add it to the document
 */
var templates = document.createElement('div');
templates.innerHTML = requestViewHtml;
var row = templates.querySelector('.cptRow');

/**
 * Work out the path for images.
 * TODO: This should probably live in some utility area somewhere
 */
function imageUrl(path) {
    var dataUrl;
    try {
        dataUrl = require('text!cockpit/ui/' + path);
    } catch (e) { }
    if (dataUrl) {
        return dataUrl;
    }

    var filename = module.id.split('/').pop() + '.js';
    var imagePath;

    if (module.uri.substr(-filename.length) !== filename) {
        console.error('Can\'t work out path from module.uri/module.id');
        return path;
    }

    if (module.uri) {
        var end = module.uri.length - filename.length - 1;
        return module.uri.substr(0, end) + "/" + path;
    }

    return filename + path;
}


/**
 * Adds a row to the CLI output display
 */
function RequestView(request, cliView) {
    this.request = request;
    this.cliView = cliView;
    this.imageUrl = imageUrl;

    // Elements attached to this by the templater. For info only
    this.rowin = null;
    this.rowout = null;
    this.output = null;
    this.hide = null;
    this.show = null;
    this.duration = null;
    this.throb = null;

    new Templater().processNode(row.cloneNode(true), this);

    this.cliView.output.appendChild(this.rowin);
    this.cliView.output.appendChild(this.rowout);

    this.request.addEventListener('output', this.onRequestChange.bind(this));
};

RequestView.prototype = {
    /**
     * A single click on an invocation line in the console copies the command to
     * the command line
     */
    copyToInput: function() {
        this.cliView.element.value = this.request.typed;
    },

    /**
     * A double click on an invocation line in the console executes the command
     */
    executeRequest: function(ev) {
        this.cliView.cli.update({
            typed: this.request.typed,
            cursor: { start:0, end:0 }
        });
        this.cliView.cli.exec();
    },

    hideOutput: function(ev) {
        this.output.style.display = 'none';
        dom.addCssClass(this.hide, 'cmd_hidden');
        dom.removeCssClass(this.show, 'cmd_hidden');

        event.stopPropagation(ev);
    },

    showOutput: function(ev) {
        this.output.style.display = 'block';
        dom.removeCssClass(this.hide, 'cmd_hidden');
        dom.addCssClass(this.show, 'cmd_hidden');

        event.stopPropagation(ev);
    },

    remove: function(ev) {
        this.cliView.output.removeChild(this.rowin);
        this.cliView.output.removeChild(this.rowout);
        event.stopPropagation(ev);
    },

    onRequestChange: function(ev) {
        this.duration.innerHTML = this.request.duration ?
            'completed in ' + (this.request.duration / 1000) + ' sec ' :
            '';

        this.output.innerHTML = '';
        this.request.outputs.forEach(function(output) {
            var node;
            if (typeof output == 'string') {
                node = document.createElement('p');
                node.innerHTML = output;
            } else {
                node = output;
            }
            this.output.appendChild(node);
        }, this);
        this.cliView.scrollOutputToBottom();

        dom.setCssClass(this.output, 'cmd_error', this.request.error);

        this.throb.style.display = this.request.completed ? 'none' : 'block';
    }
};
exports.RequestView = RequestView;


});
require.memoize('text!'+bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/request_view.html'), [], function () {
return ["","<div class=cptRow>","  <!-- The div for the input (i.e. what was typed) -->","  <div class=\"cptRowIn\" save=\"${rowin}\"","      onclick=\"${copyToInput}\"","      ondblclick=\"${executeRequest}\">","","    <!-- What the user actually typed -->","    <div class=\"cptGt\">&gt; </div>","    <div class=\"cptOutTyped\">${request.typed}</div>","","    <!-- The extra details that appear on hover -->","    <div class=cptHover save=\"${duration}\"></div>","    <img class=cptHover onclick=\"${hideOutput}\" save=\"${hide}\"","        alt=\"Hide command output\" _src=\"${imageUrl('images/minus.png')}\"/>","    <img class=\"cptHover cptHidden\" onclick=\"${showOutput}\" save=\"${show}\"","        alt=\"Show command output\" _src=\"${imageUrl('images/plus.png')}\"/>","    <img class=cptHover onclick=\"${remove}\"","        alt=\"Remove this command from the history\"","        _src=\"${imageUrl('images/closer.png')}\"/>","","  </div>","","  <!-- The div for the command output -->","  <div class=\"cptRowOut\" save=\"${rowout}\">","    <div class=\"cptRowOutput\" save=\"${output}\"></div>","    <img _src=\"${imageUrl('images/throbber.gif')}\" save=\"${throb}\"/>","  </div>","</div>",""].join("\n");
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c@/lib/pilot/domtemplate'), [], function (require, exports, module) {



// WARNING: do not 'use_strict' without reading the notes in envEval;

/**
 * A templater that allows one to quickly template DOM nodes.
 */
function Templater() {
  this.scope = [];
};

/**
 * Recursive function to walk the tree processing the attributes as it goes.
 * @param node the node to process. If you pass a string in instead of a DOM
 * element, it is assumed to be an id for use with document.getElementById()
 * @param data the data to use for node processing.
 */
Templater.prototype.processNode = function(node, data) {
  if (typeof node === 'string') {
    node = document.getElementById(node);
  }
  if (data === null || data === undefined) {
    data = {};
  }
  this.scope.push(node.nodeName + (node.id ? '#' + node.id : ''));
  try {
    // Process attributes
    if (node.attributes && node.attributes.length) {
      // We need to handle 'foreach' and 'if' first because they might stop
      // some types of processing from happening, and foreach must come first
      // because it defines new data on which 'if' might depend.
      if (node.hasAttribute('foreach')) {
        this.processForEach(node, data);
        return;
      }
      if (node.hasAttribute('if')) {
        if (!this.processIf(node, data)) {
          return;
        }
      }
      // Only make the node available once we know it's not going away
      data.__element = node;
      // It's good to clean up the attributes when we've processed them,
      // but if we do it straight away, we mess up the array index
      var attrs = Array.prototype.slice.call(node.attributes);
      for (var i = 0; i < attrs.length; i++) {
        var value = attrs[i].value;
        var name = attrs[i].name;
        this.scope.push(name);
        try {
          if (name === 'save') {
            // Save attributes are a setter using the node
            value = this.stripBraces(value);
            this.property(value, data, node);
            node.removeAttribute('save');
          } else if (name.substring(0, 2) === 'on') {
            // Event registration relies on property doing a bind
            value = this.stripBraces(value);
            var func = this.property(value, data);
            if (typeof func !== 'function') {
              this.handleError('Expected ' + value +
                ' to resolve to a function, but got ' + typeof func);
            }
            node.removeAttribute(name);
            var capture = node.hasAttribute('capture' + name.substring(2));
            node.addEventListener(name.substring(2), func, capture);
            if (capture) {
              node.removeAttribute('capture' + name.substring(2));
            }
          } else {
            // Replace references in all other attributes
            var self = this;
            var newValue = value.replace(/\$\{[^}]*\}/g, function(path) {
              return self.envEval(path.slice(2, -1), data, value);
            });
            // Remove '_' prefix of attribute names so the DOM won't try
            // to use them before we've processed the template
            if (name.charAt(0) === '_') {
              node.removeAttribute(name);
              node.setAttribute(name.substring(1), newValue);
            } else if (value !== newValue) {
              attrs[i].value = newValue;
            }
          }
        } finally {
          this.scope.pop();
        }
      }
    }

    // Loop through our children calling processNode. First clone them, so the
    // set of nodes that we visit will be unaffected by additions or removals.
    var childNodes = Array.prototype.slice.call(node.childNodes);
    for (var j = 0; j < childNodes.length; j++) {
      this.processNode(childNodes[j], data);
    }

    if (node.nodeType === Node.TEXT_NODE) {
      this.processTextNode(node, data);
    }
  } finally {
    this.scope.pop();
  }
};

/**
 * Handle <x if="${...}">
 * @param node An element with an 'if' attribute
 * @param data The data to use with envEval
 * @returns true if processing should continue, false otherwise
 */
Templater.prototype.processIf = function(node, data) {
  this.scope.push('if');
  try {
    var originalValue = node.getAttribute('if');
    var value = this.stripBraces(originalValue);
    var recurse = true;
    try {
      var reply = this.envEval(value, data, originalValue);
      recurse = !!reply;
    } catch (ex) {
      this.handleError('Error with \'' + value + '\'', ex);
      recurse = false;
    }
    if (!recurse) {
      node.parentNode.removeChild(node);
    }
    node.removeAttribute('if');
    return recurse;
  } finally {
    this.scope.pop();
  }
};

/**
 * Handle <x foreach="param in ${array}"> and the special case of
 * <loop foreach="param in ${array}">
 * @param node An element with a 'foreach' attribute
 * @param data The data to use with envEval
 */
Templater.prototype.processForEach = function(node, data) {
  this.scope.push('foreach');
  try {
    var originalValue = node.getAttribute('foreach');
    var value = originalValue;

    var paramName = 'param';
    if (value.charAt(0) === '$') {
      // No custom loop variable name. Use the default: 'param'
      value = this.stripBraces(value);
    } else {
      // Extract the loop variable name from 'NAME in ${ARRAY}'
      var nameArr = value.split(' in ');
      paramName = nameArr[0].trim();
      value = this.stripBraces(nameArr[1].trim());
    }
    node.removeAttribute('foreach');
    try {
      var self = this;
      // Process a single iteration of a loop
      var processSingle = function(member, clone, ref) {
        ref.parentNode.insertBefore(clone, ref);
        data[paramName] = member;
        self.processNode(clone, data);
        delete data[paramName];
      };

      // processSingle is no good for <loop> nodes where we want to work on
      // the childNodes rather than the node itself
      var processAll = function(scope, member) {
        self.scope.push(scope);
        try {
          if (node.nodeName === 'LOOP') {
            for (var i = 0; i < node.childNodes.length; i++) {
              var clone = node.childNodes[i].cloneNode(true);
              processSingle(member, clone, node);
            }
          } else {
            var clone = node.cloneNode(true);
            clone.removeAttribute('foreach');
            processSingle(member, clone, node);
          }
        } finally {
          self.scope.pop();
        }
      };

      var reply = this.envEval(value, data, originalValue);
      if (Array.isArray(reply)) {
        reply.forEach(function(data, i) {
          processAll('' + i, data);
        }, this);
      } else {
        for (var param in reply) {
          if (reply.hasOwnProperty(param)) {
            processAll(param, param);
          }
        }
      }
      node.parentNode.removeChild(node);
    } catch (ex) {
      this.handleError('Error with \'' + value + '\'', ex);
    }
  } finally {
    this.scope.pop();
  }
};

/**
 * Take a text node and replace it with another text node with the ${...}
 * sections parsed out. We replace the node by altering node.parentNode but
 * we could probably use a DOM Text API to achieve the same thing.
 * @param node The Text node to work on
 * @param data The data to use in calls to envEval
 */
Templater.prototype.processTextNode = function(node, data) {
  // Replace references in other attributes
  var value = node.data;
  // We can't use the string.replace() with function trick (see generic
  // attribute processing in processNode()) because we need to support
  // functions that return DOM nodes, so we can't have the conversion to a
  // string.
  // Instead we process the string as an array of parts. In order to split
  // the string up, we first replace '${' with '\uF001$' and '}' with '\uF002'
  // We can then split using \uF001 or \uF002 to get an array of strings
  // where scripts are prefixed with $.
  // \uF001 and \uF002 are just unicode chars reserved for private use.
  value = value.replace(/\$\{([^}]*)\}/g, '\uF001$$$1\uF002');
  var parts = value.split(/\uF001|\uF002/);
  if (parts.length > 1) {
    parts.forEach(function(part) {
      if (part === null || part === undefined || part === '') {
        return;
      }
      if (part.charAt(0) === '$') {
        part = this.envEval(part.slice(1), data, node.data);
      }
      // It looks like this was done a few lines above but see envEval
      if (part === null) {
        part = "null";
      }
      if (part === undefined) {
        part = "undefined";
      }
      // if (isDOMElement(part)) { ... }
      if (typeof part.cloneNode !== 'function') {
        part = node.ownerDocument.createTextNode(part.toString());
      }
      node.parentNode.insertBefore(part, node);
    }, this);
    node.parentNode.removeChild(node);
  }
};

/**
 * Warn of string does not begin '${' and end '}'
 * @param str the string to check.
 * @return The string stripped of ${ and }, or untouched if it does not match
 */
Templater.prototype.stripBraces = function(str) {
  if (!str.match(/\$\{.*\}/g)) {
    this.handleError('Expected ' + str + ' to match ${...}');
    return str;
  }
  return str.slice(2, -1);
};

/**
 * Combined getter and setter that works with a path through some data set.
 * For example:
 * <ul>
 * <li>property('a.b', { a: { b: 99 }}); // returns 99
 * <li>property('a', { a: { b: 99 }}); // returns { b: 99 }
 * <li>property('a', { a: { b: 99 }}, 42); // returns 99 and alters the
 * input data to be { a: { b: 42 }}
 * </ul>
 * @param path An array of strings indicating the path through the data, or
 * a string to be cut into an array using <tt>split('.')</tt>
 * @param data An object to look in for the <tt>path</tt> argument
 * @param newValue (optional) If defined, this value will replace the
 * original value for the data at the path specified.
 * @return The value pointed to by <tt>path</tt> before any
 * <tt>newValue</tt> is applied.
 */
Templater.prototype.property = function(path, data, newValue) {
  this.scope.push(path);
  try {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    var value = data[path[0]];
    if (path.length === 1) {
      if (newValue !== undefined) {
        data[path[0]] = newValue;
      }
      if (typeof value === 'function') {
        return function() {
          return value.apply(data, arguments);
        };
      }
      return value;
    }
    if (!value) {
      this.handleError('Can\'t find path=' + path);
      return null;
    }
    return this.property(path.slice(1), value, newValue);
  } finally {
    this.scope.pop();
  }
};

/**
 * Like eval, but that creates a context of the variables in <tt>env</tt> in
 * which the script is evaluated.
 * WARNING: This script uses 'with' which is generally regarded to be evil.
 * The alternative is to create a Function at runtime that takes X parameters
 * according to the X keys in the env object, and then call that function using
 * the values in the env object. This is likely to be slow, but workable.
 * @param script The string to be evaluated.
 * @param env The environment in which to eval the script.
 * @param context Optional debugging string in case of failure
 * @return The return value of the script, or the error message if the script
 * execution failed.
 */
Templater.prototype.envEval = function(script, env, context) {
  with (env) {
    try {
      this.scope.push(context);
      return eval(script);
    } catch (ex) {
      this.handleError('Template error evaluating \'' + script + '\'', ex);
      return script;
    } finally {
      this.scope.pop();
    }
  }
};

/**
 * A generic way of reporting errors, for easy overloading in different
 * environments.
 * @param message the error message to report.
 * @param ex optional associated exception.
 */
Templater.prototype.handleError = function(message, ex) {
  this.logError(message);
  this.logError('In: ' + this.scope.join(' > '));
  if (ex) {
    this.logError(ex);
  }
};


/**
 * A generic way of reporting errors, for easy overloading in different
 * environments.
 * @param message the error message to report.
 */
Templater.prototype.logError = function(message) {
  window.console && window.console.log && console.log(message);
};

exports.Templater = Templater;


});
require.memoize('text!'+bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/ui/request_view.css'), [], function () {
return ["",".cptRowIn {","  display: box; display: -moz-box; display: -webkit-box;","  box-orient: horizontal; -moz-box-orient: horizontal; -webkit-box-orient: horizontal;","  box-align: center; -moz-box-align: center; -webkit-box-align: center;","  color: #333;","  background-color: #EEE;","  width: 100%;","  font-family: consolas, courier, monospace;","}",".cptRowIn > * { padding-left: 2px; padding-right: 2px; }",".cptRowIn > img { cursor: pointer; }",".cptHover { display: none; }",".cptRowIn:hover > .cptHover { display: block; }",".cptRowIn:hover > .cptHover.cptHidden { display: none; }",".cptOutTyped {","  box-flex: 1; -moz-box-flex: 1; -webkit-box-flex: 1;","  font-weight: bold; color: #000; font-size: 120%;","}",".cptRowOutput { padding-left: 10px; line-height: 1.2em; }",".cptRowOutput strong,",".cptRowOutput b,",".cptRowOutput th,",".cptRowOutput h1,",".cptRowOutput h2,",".cptRowOutput h3 { color: #000; }",".cptRowOutput a { font-weight: bold; color: #666; text-decoration: none; }",".cptRowOutput a: hover { text-decoration: underline; cursor: pointer; }",".cptRowOutput input[type=password],",".cptRowOutput input[type=text],",".cptRowOutput textarea {","  color: #000; font-size: 120%;","  background: transparent; padding: 3px;","  border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;","}",".cptRowOutput table,",".cptRowOutput td,",".cptRowOutput th { border: 0; padding: 0 2px; }",".cptRowOutput .right { text-align: right; }",""].join("\n");
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b5bd9e5093176e86aa6f6c4d581342361d8c923f@/lib/cockpit/commands/basic'), ['pilot/canon','pilot/canon'], function (require, exports, module) {



var canon = require('pilot/canon');

/**
 * '!' command
 */
var bangCommandSpec = {
    name: 'sh',
    description: 'Execute a system command (requires server support)',
    params: [
        {
            name: 'command',
            type: 'text',
            description: 'The string to send to the os shell.'
        }
    ],
    exec: function(env, args, request) {
        var req = new XMLHttpRequest();
        req.open('GET', '/exec?args=' + args.command, true);
        req.onreadystatechange = function(ev) {
          if (req.readyState == 4) {
            if (req.status == 200) {
              request.done('<pre>' + req.responseText + '</pre>');
            }
          }
        };
        req.send(null);
    }
};

var canon = require('pilot/canon');

exports.startup = function(data, reason) {
    canon.addCommand(bangCommandSpec);
};

exports.shutdown = function(data, reason) {
    canon.removeCommand(bangCommandSpec);
};


});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09@/demo'), ['pilot/canon','pilot/event','ace/editor','ace/virtual_renderer','ace/theme/textmate','ace/edit_session','ace/mode/javascript','ace/mode/css','ace/mode/html','ace/mode/xml','ace/mode/python','ace/mode/php','ace/mode/java','ace/mode/csharp','ace/mode/ruby','ace/mode/c_cpp','ace/mode/coffee','ace/mode/perl','ace/mode/svg','ace/mode/textile','ace/mode/text','ace/undomanager','ace/keyboard/keybinding/vim','ace/keyboard/keybinding/emacs','ace/keyboard/hash_handler'], function (require, exports, module) {


exports.launch = function(env) {
    var canon = require("pilot/canon");
    var event = require("pilot/event");
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var theme = require("ace/theme/textmate");
    var EditSession = require("ace/edit_session").EditSession;

    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var CssMode = require("ace/mode/css").Mode;
    var HtmlMode = require("ace/mode/html").Mode;
    var XmlMode = require("ace/mode/xml").Mode;
    var PythonMode = require("ace/mode/python").Mode;
    var PhpMode = require("ace/mode/php").Mode;
    var JavaMode = require("ace/mode/java").Mode;
    var CSharpMode = require("ace/mode/csharp").Mode;
    var RubyMode = require("ace/mode/ruby").Mode;
    var CCPPMode = require("ace/mode/c_cpp").Mode;
    var CoffeeMode = require("ace/mode/coffee").Mode;
    var PerlMode = require("ace/mode/perl").Mode;
    var SvgMode = require("ace/mode/svg").Mode;
    var TextileMode = require("ace/mode/textile").Mode;
    var TextMode = require("ace/mode/text").Mode;
    var UndoManager = require("ace/undomanager").UndoManager;

    var vim = require("ace/keyboard/keybinding/vim").Vim;
    var emacs = require("ace/keyboard/keybinding/emacs").Emacs;
    var HashHandler = require("ace/keyboard/hash_handler").HashHandler;

    var keybindings = {
      // Null = use "default" keymapping
      ace: null,
      vim: vim,
      emacs: emacs,
      // This is a way to define simple keyboard remappings
      custom: new HashHandler({
          "gotoright": "Tab"
      })
    }

    var docs = {};

    // Make the lorem ipsum text a little bit longer.
    var loreIpsum = document.getElementById("plaintext").innerHTML;
    for (var i = 0; i < 5; i++) {
        loreIpsum += loreIpsum;
    }
    docs.plain = new EditSession(loreIpsum);
    docs.plain.setUseWrapMode(true);
    docs.plain.setWrapLimitRange(80, 80)
    docs.plain.setMode(new TextMode());
    docs.plain.setUndoManager(new UndoManager());

    docs.js = new EditSession(document.getElementById("jstext").innerHTML);
    docs.js.setMode(new JavaScriptMode());
    docs.js.setUndoManager(new UndoManager());

    docs.css = new EditSession(document.getElementById("csstext").innerHTML);
    docs.css.setMode(new CssMode());
    docs.css.setUndoManager(new UndoManager());

    docs.html = new EditSession(document.getElementById("htmltext").innerHTML);
    docs.html.setMode(new HtmlMode());
    docs.html.setUndoManager(new UndoManager());

    docs.python = new EditSession(document.getElementById("pythontext").innerHTML);
    docs.python.setMode(new PythonMode());
    docs.python.setUndoManager(new UndoManager());

    docs.php = new EditSession(document.getElementById("phptext").innerHTML);
    docs.php.setMode(new PhpMode());
    docs.php.setUndoManager(new UndoManager());

    docs.java = new EditSession(document.getElementById("javatext").innerHTML);
    docs.java.setMode(new JavaMode());
    docs.java.setUndoManager(new UndoManager());

    docs.ruby = new EditSession(document.getElementById("rubytext").innerHTML);
    docs.ruby.setMode(new RubyMode());
    docs.ruby.setUndoManager(new UndoManager());

    docs.csharp = new EditSession(document.getElementById("csharptext").innerHTML);
    docs.csharp.setMode(new CSharpMode());
    docs.csharp.setUndoManager(new UndoManager());

    docs.c_cpp = new EditSession(document.getElementById("cpptext").innerHTML);
    docs.c_cpp.setMode(new CCPPMode());
    docs.c_cpp.setUndoManager(new UndoManager());

    docs.coffee = new EditSession(document.getElementById("coffeetext").innerHTML);
    docs.coffee.setMode(new CoffeeMode());
    docs.coffee.setUndoManager(new UndoManager());

    docs.perl = new EditSession(document.getElementById("perltext").innerHTML);
    docs.perl.setMode(new PerlMode());
    docs.perl.setUndoManager(new UndoManager());

    docs.svg = new EditSession(document.getElementById("svgtext").innerHTML.replace("&lt;", "<"));
    docs.svg.setMode(new SvgMode());
    docs.svg.setUndoManager(new UndoManager());
    
    docs.textile = new EditSession(document.getElementById("textiletext").innerHTML);
    docs.textile.setMode(new TextileMode());
    docs.textile.setUndoManager(new UndoManager());

    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container, theme));

    var modes = {
        text: new TextMode(),
        textile: new TextileMode(),
        svg: new SvgMode(),
        xml: new XmlMode(),
        html: new HtmlMode(),
        css: new CssMode(),
        javascript: new JavaScriptMode(),
        python: new PythonMode(),
        php: new PhpMode(),
        java: new JavaMode(),
        ruby: new RubyMode(),
        c_cpp: new CCPPMode(),
        coffee: new CoffeeMode(),
        perl: new PerlMode(),
				csharp: new CSharpMode()
    };

    function getMode() {
        return modes[modeEl.value];
    }

    var modeEl = document.getElementById("mode");
    var wrapModeEl = document.getElementById("soft_wrap");

    bindDropdown("doc", function(value) {
        var doc = docs[value];
        env.editor.setSession(doc);

        var mode = doc.getMode();
        if (mode instanceof JavaScriptMode) {
            modeEl.value = "javascript";
        }
        else if (mode instanceof CssMode) {
            modeEl.value = "css";
        }
        else if (mode instanceof HtmlMode) {
            modeEl.value = "html";
        }
        else if (mode instanceof XmlMode) {
            modeEl.value = "xml";
        }
        else if (mode instanceof PythonMode) {
            modeEl.value = "python";
        }
        else if (mode instanceof PhpMode) {
            modeEl.value = "php";
        }
        else if (mode instanceof JavaMode) {
            modeEl.value = "java";
        }
        else if (mode instanceof RubyMode) {
            modeEl.value = "ruby";
        }
        else if (mode instanceof CCPPMode) {
            modeEl.value = "c_cpp";
        }
        else if (mode instanceof CoffeeMode) {
            modeEl.value = "coffee";
        }
        else if (mode instanceof PerlMode) {
            modeEl.value = "perl";
        }
        else if (mode instanceof CSharpMode) {
            modeEl.value = "csharp";
        }
        else if (mode instanceof SvgMode) {
            modeEl.value = "svg";
        }
        else if (mode instanceof TextileMode) {
            modeEl.value = "textile";
        }
        else {
            modeEl.value = "text";
        }

        if (!doc.getUseWrapMode()) {
            wrapModeEl.value = "off";
        } else {
            wrapModeEl.value = doc.getWrapLimitRange().min || "free";
        }
        env.editor.focus();
    });

    bindDropdown("mode", function(value) {
        env.editor.getSession().setMode(modes[value] || modes.text);
    });

    bindDropdown("theme", function(value) {
        env.editor.setTheme(value);
    });

    bindDropdown("keybinding", function(value) {
        env.editor.setKeyboardHandler(keybindings[value]);
    });

    bindDropdown("fontsize", function(value) {
        document.getElementById("editor").style.fontSize = value;
    });

    bindDropdown("soft_wrap", function(value) {
        var session = env.editor.getSession();
        var renderer = env.editor.renderer;
        switch (value) {
            case "off":
                session.setUseWrapMode(false);
                renderer.setPrintMarginColumn(80);
                break;
            case "40":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(40, 40);
                renderer.setPrintMarginColumn(40);
                break;
            case "80":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(80, 80);
                renderer.setPrintMarginColumn(80);
                break;
            case "free":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(null, null);
                renderer.setPrintMarginColumn(80);
                break;
        }
    });

    bindCheckbox("select_style", function(checked) {
        env.editor.setSelectionStyle(checked ? "line" : "text");
    });

    bindCheckbox("highlight_active", function(checked) {
        env.editor.setHighlightActiveLine(checked);
    });

    bindCheckbox("show_hidden", function(checked) {
        env.editor.setShowInvisibles(checked);
    });

    bindCheckbox("show_gutter", function(checked) {
        env.editor.renderer.setShowGutter(checked);
    });

    bindCheckbox("show_print_margin", function(checked) {
        env.editor.renderer.setShowPrintMargin(checked);
    });

    bindCheckbox("highlight_selected_word", function(checked) {
        env.editor.setHighlightSelectedWord(checked);
    });

    bindCheckbox("show_hscroll", function(checked) {
        env.editor.renderer.setHScrollBarAlwaysVisible(checked);
    });

    function bindCheckbox(id, callback) {
        var el = document.getElementById(id);
        var onCheck = function() {
            callback(!!el.checked);
        };
        el.onclick = onCheck;
        onCheck();
    }

    function bindDropdown(id, callback) {
        var el = document.getElementById(id);
        var onChange = function() {
            callback(el.value);
        };
        el.onchange = onChange;
        onChange();
    }

    function onResize() {
        container.style.width = (document.documentElement.clientWidth) + "px";
        container.style.height = (document.documentElement.clientHeight - 60 - 22) + "px";
        env.editor.resize();
    };

    window.onresize = onResize;
    onResize();

    event.addListener(container, "dragover", function(e) {
        return event.preventDefault(e);
    });

    event.addListener(container, "drop", function(e) {
        try {
            var file = e.dataTransfer.files[0];
        } catch(e) {
            return event.stopEvent();
        }

        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function(e) {
                env.editor.getSelection().selectAll();

                var mode = "text";
                if (/^.*\.js$/i.test(file.name)) {
                    mode = "javascript";
                } else if (/^.*\.xml$/i.test(file.name)) {
                    mode = "xml";
                } else if (/^.*\.html$/i.test(file.name)) {
                    mode = "html";
                } else if (/^.*\.css$/i.test(file.name)) {
                    mode = "css";
                } else if (/^.*\.py$/i.test(file.name)) {
                    mode = "python";
                } else if (/^.*\.php$/i.test(file.name)) {
                    mode = "php";
	              } else if (/^.*\.cs$/i.test(file.name)) {
	                  mode = "csharp";
                } else if (/^.*\.java$/i.test(file.name)) {
                    mode = "java";
                } else if (/^.*\.rb$/i.test(file.name)) {
                    mode = "ruby";
                } else if (/^.*\.(c|cpp|h|hpp|cxx)$/i.test(file.name)) {
                    mode = "c_cpp";
                } else if (/^.*\.coffee$/i.test(file.name)) {
                    mode = "coffee";
                } else if (/^.*\.(pl|pm)$/i.test(file.name)) {
                    mode = "perl";
                }

                env.editor.onTextInput(reader.result);

                modeEl.value = mode;
                env.editor.getSession().setMode(modes[mode]);
            };
            reader.readAsText(file);
        }

        return event.preventDefault(e);
    });

    window.env = env;
    
    /**
     * This demonstrates how you can define commands and bind shortcuts to them.
     */
    
    // Command to focus the command line from the editor.
    canon.addCommand({
        name: "focuscli",
        bindKey: {
            win: "Ctrl-J",
            mac: "Command-J",
            sender: "editor"
        },
        exec: function() {
            env.cli.cliView.element.focus();
        }
    });
    
    // Command to focus the editor line from the command line.
    canon.addCommand({
        name: "focuseditor",
        bindKey: {
            win: "Ctrl-J",
            mac: "Command-J",
            sender: "cli"
        },
        exec: function() {
            env.editor.focus();
        }
    });
    
    // Fake-Save, works from the editor and the command line.
    canon.addCommand({
        name: "save",
        bindKey: {
            win: "Ctrl-S",
            mac: "Command-S",
            sender: "editor|cli"
        },
        exec: function() {
            alert("Fake Save File");
        }
    });
    
    // Fake-Print with custom lookup-sender-match function.
    canon.addCommand({
        name: "save",
        bindKey: {
            win: "Ctrl-P",
            mac: "Command-P",
            sender: function(env, sender, hashId, keyString) {
                if (sender == "editor") {
                    return true;   
                } else {
                    alert("Sorry, can only print from the editor");                    
                }
            }
        },
        exec: function() {
            alert("Fake Print File");
        }
    });
};

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/javascript'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/javascript_highlight_rules','ace/mode/matching_brace_outdent','ace/range','ace/worker/worker_client'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var JavaScriptHighlightRules = require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;
var WorkerClient = require("ace/worker/worker_client").WorkerClient;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new JavaScriptHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)\/\//;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "//");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }
        
        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc-start") {
            if (endState == "start") {
                return "";
            }
            var match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
    
    this.createWorker = function(session) {
        var doc = session.getDocument();
        var worker = new WorkerClient(["ace", "pilot"], "worker-javascript.js", "ace/mode/javascript_worker", "JavaScriptWorker");
        worker.call("setValue", [doc.getValue()]);
        
        doc.on("change", function(e) {
            e.range = {
                start: e.data.range.start,
                end: e.data.range.end
            };
            worker.emit("change", e);
        });
            
        worker.on("jslint", function(results) {
            var errors = [];
            for (var i=0; i<results.data.length; i++) {
                var error = results.data[i];
                if (error)
                    errors.push({
                        row: error.line-1,
                        column: error.character-1,
                        text: error.reason,
                        type: "warning",
                        lint: error
                    })
            }
                    
            session.setAnnotations(errors)
        });
        
        worker.on("narcissus", function(e) {
            session.setAnnotations([e.data]);
        });
        
        worker.on("terminate", function() {
            session.clearAnnotations();
        });
        
        return worker;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/javascript_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var JavaScriptHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    var keywords = lang.arrayToMap(
        ("break|case|catch|continue|default|delete|do|else|finally|for|function|" +
        "if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|" +
        "const|yield|import|get|set").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("null|Infinity|NaN|undefined").split("|")
    );

    var futureReserved = lang.arrayToMap(
        ("class|enum|extends|super|export|implements|private|" +
        "public|interface|package|protected|static").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            docComment.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false)\\b"
            }, {
                token : function(value) {
                    if (value == "this")
                        return "variable.language";
                    else if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (buildinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (futureReserved.hasOwnProperty(value))
                        return "invalid.illegal";
                    else if (value == "debugger")
                        return "invalid.deprecated";
                    else
                        return "identifier";
                },
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token: "comment",
                regex: "^#!.*$" 
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(JavaScriptHighlightRules, TextHighlightRules);

exports.JavaScriptHighlightRules = JavaScriptHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/a3d9ddf257e98144c883cd2dbc03ab62243dbc09@/modules/ace/worker/worker_client'), ['pilot/oop','pilot/event_emitter'], function (require, exports, module) {


var oop = require("pilot/oop");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var WorkerClient = function(topLevelNamespaces, packagedJs, module, classname) {

    this.callbacks = [];

    this.$worker = new Worker(require.uri("worker/worker.js"));

    this.$worker.postMessage({
        init : true,
        module: module,
        classname: classname
    });

    this.callbackId = 1;
    this.callbacks = {};

    var _self = this;
    this.$worker.onerror = function(e) {
        window.console && console.log && console.log(e);
        throw e;
    };
    this.$worker.onmessage = function(e) {
        var msg = e.data;
        switch(msg.type) {
            case "log":
                window.console && console.log && console.log(msg.data);
                break;

            case "event":
                _self._dispatchEvent(msg.name, {data: msg.data});
                break;

            case "call":
                var callback = _self.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete _self.callbacks[msg.id];
                }
                break;
        }
    };
};

(function(){

    oop.implement(this, EventEmitter);

    this.terminate = function() {
        this._dispatchEvent("terminate", {});
        this.$worker.terminate();
    };

    this.send = function(cmd, args) {
        this.$worker.postMessage({command: cmd, args: args});
    };

    this.call = function(cmd, args, callback) {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    };

    this.emit = function(event, data) {
        this.$worker.postMessage({event: event, data: data});
    };

}).call(WorkerClient.prototype);

exports.WorkerClient = WorkerClient;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/css'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/css_highlight_rules','ace/mode/matching_brace_outdent'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var CssHighlightRules = require("ace/mode/css_highlight_rules").CssHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new CssHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        // ignore braces in comments
        var tokens = this.$tokenizer.getLineTokens(line, state).tokens;
        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        var match = line.match(/^.*\{\s*$/);
        if (match) {
            indent += tab;
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/css_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var CssHighlightRules = function() {

    var properties = lang.arrayToMap(
        ("-moz-box-sizing|-webkit-box-sizing|azimuth|background-attachment|background-color|background-image|" +
        "background-position|background-repeat|background|border-bottom-color|" +
        "border-bottom-style|border-bottom-width|border-bottom|border-collapse|" +
        "border-color|border-left-color|border-left-style|border-left-width|" +
        "border-left|border-right-color|border-right-style|border-right-width|" +
        "border-right|border-spacing|border-style|border-top-color|" +
        "border-top-style|border-top-width|border-top|border-width|border|" +
        "bottom|box-sizing|caption-side|clear|clip|color|content|counter-increment|" +
        "counter-reset|cue-after|cue-before|cue|cursor|direction|display|" +
        "elevation|empty-cells|float|font-family|font-size-adjust|font-size|" +
        "font-stretch|font-style|font-variant|font-weight|font|height|left|" +
        "letter-spacing|line-height|list-style-image|list-style-position|" +
        "list-style-type|list-style|margin-bottom|margin-left|margin-right|" +
        "margin-top|marker-offset|margin|marks|max-height|max-width|min-height|" +
        "min-width|-moz-border-radius|opacity|orphans|outline-color|" +
        "outline-style|outline-width|outline|overflow|overflow-x|overflow-y|padding-bottom|" +
        "padding-left|padding-right|padding-top|padding|page-break-after|" +
        "page-break-before|page-break-inside|page|pause-after|pause-before|" +
        "pause|pitch-range|pitch|play-during|position|quotes|richness|right|" +
        "size|speak-header|speak-numeral|speak-punctuation|speech-rate|speak|" +
        "stress|table-layout|text-align|text-decoration|text-indent|" +
        "text-shadow|text-transform|top|unicode-bidi|vertical-align|" +
        "visibility|voice-family|volume|white-space|widows|width|word-spacing|" +
        "z-index").split("|")
    );

    var functions = lang.arrayToMap(
        ("rgb|rgba|url|attr|counter|counters").split("|")
    );

    var constants = lang.arrayToMap(
        ("absolute|all-scroll|always|armenian|auto|baseline|below|bidi-override|" +
        "block|bold|bolder|border-box|both|bottom|break-all|break-word|capitalize|center|" +
        "char|circle|cjk-ideographic|col-resize|collapse|content-box|crosshair|dashed|" +
        "decimal-leading-zero|decimal|default|disabled|disc|" +
        "distribute-all-lines|distribute-letter|distribute-space|" +
        "distribute|dotted|double|e-resize|ellipsis|fixed|georgian|groove|" +
        "hand|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|" +
        "ideograph-alpha|ideograph-numeric|ideograph-parenthesis|" +
        "ideograph-space|inactive|inherit|inline-block|inline|inset|inside|" +
        "inter-ideograph|inter-word|italic|justify|katakana-iroha|katakana|" +
        "keep-all|left|lighter|line-edge|line-through|line|list-item|loose|" +
        "lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|" +
        "medium|middle|move|n-resize|ne-resize|newspaper|no-drop|no-repeat|" +
        "nw-resize|none|normal|not-allowed|nowrap|oblique|outset|outside|" +
        "overline|pointer|progress|relative|repeat-x|repeat-y|repeat|right|" +
        "ridge|row-resize|rtl|s-resize|scroll|se-resize|separate|small-caps|" +
        "solid|square|static|strict|super|sw-resize|table-footer-group|" +
        "table-header-group|tb-rl|text-bottom|text-top|text|thick|thin|top|" +
        "transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|" +
        "vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|" +
        "zero").split("|")
    );
    
    var colors = lang.arrayToMap(
        ("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|" +
        "purple|red|silver|teal|white|yellow").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";

    function ic(str) {
        var re = [];
        var chars = str.split("");
        for (var i=0; i<chars.length; i++) {
            re.push(
                "[",
                chars[i].toLowerCase(),
                chars[i].toUpperCase(),
                "]"
            );
        }
        return re.join("");
    }

    this.$rules = {
        "start" : [ {
            token : "comment", // multi line comment
            regex : "\\/\\*",
            next : "comment"
        }, {
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        }, {
            token : "constant.numeric",
            regex : numRe + ic("em")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("ex")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("px")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("cm")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("mm")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("in")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("pt")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("pc")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("deg")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("rad")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("grad")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("ms")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("s")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("hz")
        }, {
            token : "constant.numeric",
            regex : numRe + ic("khz")
        }, {
            token : "constant.numeric",
            regex : numRe + "%"
        }, {
            token : "constant.numeric",
            regex : numRe
        }, {
            token : "constant.numeric",  // hex6 color
            regex : "#[a-fA-F0-9]{6}"
        }, {
            token : "constant.numeric", // hex3 color
            regex : "#[a-fA-F0-9]{3}"
        }, {
            token : "lparen",
            regex : "\{"
        }, {
            token : "rparen",
            regex : "\}"
        }, {
            token : function(value) {
                if (properties.hasOwnProperty(value.toLowerCase())) {
                    return "support.type";
                }
                else if (functions.hasOwnProperty(value.toLowerCase())) {
                    return "support.function";
                }
                else if (constants.hasOwnProperty(value.toLowerCase())) {
                    return "support.constant";
                }
                else if (colors.hasOwnProperty(value.toLowerCase())) {
                    return "support.constant.color";
                }
                else {
                    return "text";
                }
            },
            regex : "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"
        }],
        "comment" : [{
            token : "comment", // closing comment
            regex : ".*?\\*\\/",
            next : "start"
        }, {
            token : "comment", // comment spanning whole line
            regex : ".+"
        }]
    };
};

oop.inherits(CssHighlightRules, TextHighlightRules);

exports.CssHighlightRules = CssHighlightRules;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/html'), ['pilot/oop','ace/mode/text','ace/mode/javascript','ace/mode/css','ace/tokenizer','ace/mode/html_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var JavaScriptMode = require("ace/mode/javascript").Mode;
var CssMode = require("ace/mode/css").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var HtmlHighlightRules = require("ace/mode/html_highlight_rules").HtmlHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new HtmlHighlightRules().getRules());

    this.$js = new JavaScriptMode();
    this.$css = new CssMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        this.$delegate("toggleCommentLines", arguments, function() {
            return 0;
        });
    };

    this.getNextLineIndent = function(state, line, tab) {
        var self = this;
        return this.$delegate("getNextLineIndent", arguments, function() {
            return self.$getIndent(line);
        });
    };

    this.checkOutdent = function(state, line, input) {
        return this.$delegate("checkOutdent", arguments, function() {
            return false;
        });
    };

    this.autoOutdent = function(state, doc, row) {
        this.$delegate("autoOutdent", arguments);
    };

    this.$delegate = function(method, args, defaultHandler) {
        var state = args[0];
        var split = state.split("js-");

        if (!split[0] && split[1]) {
            args[0] = split[1];
            return this.$js[method].apply(this.$js, args);
        }

        var split = state.split("css-");
        if (!split[0] && split[1]) {
            args[0] = split[1];
            return this.$css[method].apply(this.$css, args);
        }
        
        return defaultHandler ? defaultHandler() : undefined;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/html_highlight_rules'), ['pilot/oop','ace/mode/css_highlight_rules','ace/mode/javascript_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var CssHighlightRules = require("ace/mode/css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var HtmlHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    function string(state) {
        return [
            {
            token : "string",
            regex : '".*?"'
        }, {
            token : "string", // multi line string start
            regex : '["].*$',
            next : state + "-qqstring"
        }, {
            token : "string",
            regex : "'.*?'"
        }, {
            token : "string", // multi line string start
            regex : "['].*$",
            next : state + "-qstring"
        }]
    }
    
    function multiLineString(quote, state) {
        return [{
            token : "string",
            regex : ".*" + quote,
            next : state
        }, {
            token : "string",
            regex : '.+'
        }]
    }

    this.$rules = {
        start : [ {
            token : "text",
            regex : "<\\!\\[CDATA\\[",
            next : "cdata"
        }, {
            token : "xml_pe",
            regex : "<\\?.*?\\?>"
        }, {
            token : "comment",
            regex : "<\\!--",
            next : "comment"
        }, {
            token : "text",
            regex : "<(?=\s*script)",
            next : "script"
        }, {
            token : "text",
            regex : "<(?=\s*style)",
            next : "css"
        }, {
            token : "text", // opening tag
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "[^<]+"
        } ],

        script : [ {
            token : "text",
            regex : ">",
            next : "js-start"
        }, {
            token : "keyword",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "text",
            regex : "\\s+"
        }].concat(string("script")),

        css : [ {
            token : "text",
            regex : ">",
            next : "css-start"
        }, {
            token : "keyword",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "text",
            regex : "\\s+"
        }].concat(string("css")),

        tag : [ {
            token : "text",
            regex : ">",
            next : "start"
        }, {
            token : "keyword",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "text",
            regex : "\\s+"
        }].concat(string("tag")),
        
        "css-qstring": multiLineString("'", "css"),
        "css-qqstring": multiLineString('"', "css"),
        "script-qstring": multiLineString("'", "script"),
        "script-qqstring": multiLineString('"', "script"),
        "tag-qstring": multiLineString("'", "tag"),
        "tag-qqstring": multiLineString('"', "tag"),
        
        cdata : [ {
            token : "text",
            regex : "\\]\\]>",
            next : "start"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : ".+"
        } ],

        comment : [ {
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
            token : "comment",
            regex : ".+"
        } ]
    };

    var jsRules = new JavaScriptHighlightRules().getRules();
    this.addRules(jsRules, "js-");
    this.$rules["js-start"].unshift({
        token: "comment",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "text",
        regex: "<\\/(?=script)",
        next: "tag"
    });

    var cssRules = new CssHighlightRules().getRules();
    this.addRules(cssRules, "css-");
    this.$rules["css-start"].unshift({
        token: "text",
        regex: "<\\/(?=style)",
        next: "tag"
    });
};

oop.inherits(HtmlHighlightRules, TextHighlightRules);

exports.HtmlHighlightRules = HtmlHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/xml'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/xml_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var XmlHighlightRules = require("ace/mode/xml_highlight_rules").XmlHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new XmlHighlightRules().getRules());
};

oop.inherits(Mode, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        return this.$getIndent(line);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/xml_highlight_rules'), ['pilot/oop','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var XmlHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        start : [ {
            token : "text",
            regex : "<\\!\\[CDATA\\[",
            next : "cdata"
        }, {
            token : "xml_pe",
            regex : "<\\?.*?\\?>"
        }, {
            token : "comment",
            regex : "<\\!--",
            next : "comment"
        }, {
            token : "text", // opening tag
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "[^<]+"
        } ],

        tag : [ {
            token : "text",
            regex : ">",
            next : "start"
        }, {
            token : "keyword",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "string",
            regex : '".*?"'
        }, {
            token : "string", // multi line string start
            regex : '["].*$',
            next : "qqstring"
        }, {
            token : "string",
            regex : "'.*?'"
        }, {
            token : "string", // multi line string start
            regex : "['].*$",
            next : "qstring"
        }],

        qstring: [{
            token : "string",
            regex : ".*'",
            next : "tag"
        }, {
            token : "string",
            regex : '.+'
        }],
        
        qqstring: [{
            token : "string",
            regex : ".*\"",
            next : "tag"
        }, {
            token : "string",
            regex : '.+'
        }],
        
        cdata : [ {
            token : "text",
            regex : "\\]\\]>",
            next : "start"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "(?:[^\\]]|\\](?!\\]>))+"
        } ],

        comment : [ {
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
            token : "comment",
            regex : ".+"
        } ]
    };
};

oop.inherits(XmlHighlightRules, TextHighlightRules);

exports.XmlHighlightRules = XmlHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/python'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/python_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var PythonHighlightRules = require("ace/mode/python_highlight_rules").PythonHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new PythonHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/python_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var PythonHighlightRules = function() {

    var keywords = lang.arrayToMap(
        ("and|as|assert|break|class|continue|def|del|elif|else|except|exec|" +
        "finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|" +
        "raise|return|try|while|with|yield").split("|")
    );

    var builtinConstants = lang.arrayToMap(
        ("True|False|None|NotImplemented|Ellipsis|__debug__").split("|")
    );

    var builtinFunctions = lang.arrayToMap(
        ("abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|" +
        "eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|" +
        "binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|" +
        "float|list|raw_input|unichr|callable|format|locals|reduce|unicode|" +
        "chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|" +
        "cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|" +
        "__import__|complex|hash|min|set|apply|delattr|help|next|setattr|" +
        "buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern").split("|")
    );

    var futureReserved = lang.arrayToMap(
        ("").split("|")
    );

    var strPre = "(?:r|u|ur|R|U|UR|Ur|uR)?";

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[oO]?[0-7]+)";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + "|" + binInteger + ")";

    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var exponentFloat = "(?:(?:" + pointFloat + "|" +  intPart + ")" + exponent + ")";
    var floatNumber = "(?:" + exponentFloat + "|" + pointFloat + ")";

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "#.*$"
        }, {
            token : "string",           // """ string
            regex : strPre + '"{3}(?:[^\\\\]|\\\\.)*?"{3}'
        }, {
            token : "string",           // multi line """ string start
            regex : strPre + '"{3}.*$',
            next : "qqstring"
        }, {
            token : "string",           // " string
            regex : strPre + '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "string",           // ''' string
            regex : strPre + "'{3}(?:[^\\\\]|\\\\.)*?'{3}"
        }, {
            token : "string",           // multi line ''' string start
            regex : strPre + "'{3}.*$",
            next : "qstring"
        }, {
            token : "string",           // ' string
            regex : strPre + "'(?:[^\\\\]|\\\\.)*?'"
        }, {
            token : "constant.numeric", // imaginary
            regex : "(?:" + floatNumber + "|\\d+)[jJ]\\b"
        }, {
            token : "constant.numeric", // float
            regex : floatNumber
        }, {
            token : "constant.numeric", // long integer
            regex : integer + "[lL]\\b"
        }, {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, {
            token : function(value) {
                if (keywords.hasOwnProperty(value))
                    return "keyword";
                else if (builtinConstants.hasOwnProperty(value))
                    return "constant.language";
                else if (futureReserved.hasOwnProperty(value))
                    return "invalid.illegal";
                else if (builtinFunctions.hasOwnProperty(value))
                    return "support.function";
                else if (value == "debugger")
                    return "invalid.deprecated";
                else
                    return "identifier";
            },
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "qqstring" : [ {
            token : "string", // multi line """ string end
            regex : '(?:[^\\\\]|\\\\.)*?"{3}',
            next : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring" : [ {
            token : "string",           // multi line ''' string end
            regex : "(?:[^\\\\]|\\\\.)*?'{3}",
            next : "start"
        }, {
            token : "string",
            regex : '.+'
        } ]
    };
};

oop.inherits(PythonHighlightRules, TextHighlightRules);

exports.PythonHighlightRules = PythonHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/php'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/php_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var PhpHighlightRules = require("ace/mode/php_highlight_rules").PhpHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new PhpHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/php_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var PhpHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

	var builtinFunctions = lang.arrayToMap(
	    ('abs|acos|acosh|addcslashes|addslashes|aggregate|aggregate_info|aggregate_methods|' +
        'aggregate_methods_by_list|aggregate_methods_by_regexp|aggregate_properties|aggregate_properties_by_list|' +
        'aggregate_properties_by_regexp|aggregation_info|apache_child_terminate|apache_get_modules|' +
        'apache_get_version|apache_getenv|apache_lookup_uri|apache_note|apache_request_headers|' +
        'apache_response_headers|apache_setenv|array|array_change_key_case|array_chunk|array_combine|' +
        'array_count_values|array_diff|array_diff_assoc|array_diff_uassoc|array_fill|array_filter|array_flip|' +
        'array_intersect|array_intersect_assoc|array_key_exists|array_keys|array_map|array_merge|' +
        'array_merge_recursive|array_multisort|array_pad|array_pop|array_push|array_rand|array_reduce|' +
        'array_reverse|array_search|array_shift|array_slice|array_splice|array_sum|array_udiff|array_udiff_assoc|' +
        'array_udiff_uassoc|array_unique|array_unshift|array_values|array_walk|arsort|ascii2ebcdic|asin|asinh|asort|' +
        'aspell_check|aspell_check_raw|aspell_new|aspell_suggest|assert|assert_options|atan|atan2|atanh|' +
        'base64_decode|base64_encode|base_convert|basename|bcadd|bccomp|bcdiv|bcmod|bcmul|bcpow|bcpowmod|bcscale|' +
        'bcsqrt|bcsub|bin2hex|bind_textdomain_codeset|bindec|bindtextdomain|bzclose|bzcompress|bzdecompress|bzerrno|' +
        'bzerror|bzerrstr|bzflush|bzopen|bzread|bzwrite|cal_days_in_month|cal_from_jd|cal_info|cal_to_jd|' +
        'call_user_func|call_user_func_array|call_user_method|call_user_method_array|ccvs_add|ccvs_auth|ccvs_command|' +
        'ccvs_count|ccvs_delete|ccvs_done|ccvs_init|ccvs_lookup|ccvs_new|ccvs_report|ccvs_return|ccvs_reverse|' +
        'ccvs_sale|ccvs_status|ccvs_textvalue|ccvs_void|ceil|chdir|checkdate|checkdnsrr|chgrp|chmod|chop|chown|chr|' +
        'chroot|chunk_split|class_exists|clearstatcache|closedir|closelog|com|com_addref|com_get|com_invoke|' +
        'com_isenum|com_load|com_load_typelib|com_propget|com_propput|com_propset|com_release|com_set|compact|' +
        'connection_aborted|connection_status|connection_timeout|constant|convert_cyr_string|copy|cos|cosh|count|' +
        'count_chars|cpdf_add_annotation|cpdf_add_outline|cpdf_arc|cpdf_begin_text|cpdf_circle|cpdf_clip|cpdf_close|' +
        'cpdf_closepath|cpdf_closepath_fill_stroke|cpdf_closepath_stroke|cpdf_continue_text|cpdf_curveto|cpdf_end_text|' +
        'cpdf_fill|cpdf_fill_stroke|cpdf_finalize|cpdf_finalize_page|cpdf_global_set_document_limits|cpdf_import_jpeg|' +
        'cpdf_lineto|cpdf_moveto|cpdf_newpath|cpdf_open|cpdf_output_buffer|cpdf_page_init|cpdf_place_inline_image|' +
        'cpdf_rect|cpdf_restore|cpdf_rlineto|cpdf_rmoveto|cpdf_rotate|cpdf_rotate_text|cpdf_save|cpdf_save_to_file|' +
        'cpdf_scale|cpdf_set_action_url|cpdf_set_char_spacing|cpdf_set_creator|cpdf_set_current_page|cpdf_set_font|' +
        'cpdf_set_font_directories|cpdf_set_font_map_file|cpdf_set_horiz_scaling|cpdf_set_keywords|cpdf_set_leading|' +
        'cpdf_set_page_animation|cpdf_set_subject|cpdf_set_text_matrix|cpdf_set_text_pos|cpdf_set_text_rendering|' +
        'cpdf_set_text_rise|cpdf_set_title|cpdf_set_viewer_preferences|cpdf_set_word_spacing|cpdf_setdash|cpdf_setflat|' +
        'cpdf_setgray|cpdf_setgray_fill|cpdf_setgray_stroke|cpdf_setlinecap|cpdf_setlinejoin|cpdf_setlinewidth|' +
        'cpdf_setmiterlimit|cpdf_setrgbcolor|cpdf_setrgbcolor_fill|cpdf_setrgbcolor_stroke|cpdf_show|cpdf_show_xy|' +
        'cpdf_stringwidth|cpdf_stroke|cpdf_text|cpdf_translate|crack_check|crack_closedict|crack_getlastmessage|' +
        'crack_opendict|crc32|create_function|crypt|ctype_alnum|ctype_alpha|ctype_cntrl|ctype_digit|ctype_graph|' +
        'ctype_lower|ctype_print|ctype_punct|ctype_space|ctype_upper|ctype_xdigit|curl_close|curl_errno|curl_error|' +
        'curl_exec|curl_getinfo|curl_init|curl_multi_add_handle|curl_multi_close|curl_multi_exec|curl_multi_getcontent|' +
        'curl_multi_info_read|curl_multi_init|curl_multi_remove_handle|curl_multi_select|curl_setopt|curl_version|current|' +
        'cybercash_base64_decode|cybercash_base64_encode|cybercash_decr|cybercash_encr|cyrus_authenticate|cyrus_bind|' +
        'cyrus_close|cyrus_connect|cyrus_query|cyrus_unbind|date|dba_close|dba_delete|dba_exists|dba_fetch|dba_firstkey|' +
        'dba_handlers|dba_insert|dba_key_split|dba_list|dba_nextkey|dba_open|dba_optimize|dba_popen|dba_replace|dba_sync|' +
        'dbase_add_record|dbase_close|dbase_create|dbase_delete_record|dbase_get_header_info|dbase_get_record|' +
        'dbase_get_record_with_names|dbase_numfields|dbase_numrecords|dbase_open|dbase_pack|dbase_replace_record|dblist|' +
        'dbmclose|dbmdelete|dbmexists|dbmfetch|dbmfirstkey|dbminsert|dbmnextkey|dbmopen|dbmreplace|dbplus_add|dbplus_aql|' +
        'dbplus_chdir|dbplus_close|dbplus_curr|dbplus_errcode|dbplus_errno|dbplus_find|dbplus_first|dbplus_flush|' +
        'dbplus_freealllocks|dbplus_freelock|dbplus_freerlocks|dbplus_getlock|dbplus_getunique|dbplus_info|dbplus_last|' +
        'dbplus_lockrel|dbplus_next|dbplus_open|dbplus_prev|dbplus_rchperm|dbplus_rcreate|dbplus_rcrtexact|dbplus_rcrtlike|' +
        'dbplus_resolve|dbplus_restorepos|dbplus_rkeys|dbplus_ropen|dbplus_rquery|dbplus_rrename|dbplus_rsecindex|' +
        'dbplus_runlink|dbplus_rzap|dbplus_savepos|dbplus_setindex|dbplus_setindexbynumber|dbplus_sql|dbplus_tcl|' +
        'dbplus_tremove|dbplus_undo|dbplus_undoprepare|dbplus_unlockrel|dbplus_unselect|dbplus_update|dbplus_xlockrel|' +
        'dbplus_xunlockrel|dbx_close|dbx_compare|dbx_connect|dbx_error|dbx_escape_string|dbx_fetch_row|dbx_query|dbx_sort|' +
        'dcgettext|dcngettext|deaggregate|debug_backtrace|debug_print_backtrace|debugger_off|debugger_on|decbin|dechex|' +
        'decoct|define|define_syslog_variables|defined|deg2rad|delete|dgettext|die|dio_close|dio_fcntl|dio_open|dio_read|' +
        'dio_seek|dio_stat|dio_tcsetattr|dio_truncate|dio_write|dir|dirname|disk_free_space|disk_total_space|diskfreespace|' +
        'dl|dngettext|dns_check_record|dns_get_mx|dns_get_record|domxml_new_doc|domxml_open_file|domxml_open_mem|' +
        'domxml_version|domxml_xmltree|domxml_xslt_stylesheet|domxml_xslt_stylesheet_doc|domxml_xslt_stylesheet_file|' +
        'dotnet_load|doubleval|each|easter_date|easter_days|ebcdic2ascii|echo|empty|end|ereg|ereg_replace|eregi|' +
        'eregi_replace|error_log|error_reporting|escapeshellarg|escapeshellcmd|eval|exec|exif_imagetype|exif_read_data|' +
        'exif_thumbnail|exit|exp|explode|expm1|extension_loaded|extract|ezmlm_hash|fam_cancel_monitor|fam_close|' +
        'fam_monitor_collection|fam_monitor_directory|fam_monitor_file|fam_next_event|fam_open|fam_pending|' +
        'fam_resume_monitor|fam_suspend_monitor|fbsql_affected_rows|fbsql_autocommit|fbsql_blob_size|fbsql_change_user|' +
        'fbsql_clob_size|fbsql_close|fbsql_commit|fbsql_connect|fbsql_create_blob|fbsql_create_clob|fbsql_create_db|' +
        'fbsql_data_seek|fbsql_database|fbsql_database_password|fbsql_db_query|fbsql_db_status|fbsql_drop_db|fbsql_errno|' +
        'fbsql_error|fbsql_fetch_array|fbsql_fetch_assoc|fbsql_fetch_field|fbsql_fetch_lengths|fbsql_fetch_object|' +
        'fbsql_fetch_row|fbsql_field_flags|fbsql_field_len|fbsql_field_name|fbsql_field_seek|fbsql_field_table|' +
        'fbsql_field_type|fbsql_free_result|fbsql_get_autostart_info|fbsql_hostname|fbsql_insert_id|fbsql_list_dbs|' +
        'fbsql_list_fields|fbsql_list_tables|fbsql_next_result|fbsql_num_fields|fbsql_num_rows|fbsql_password|fbsql_pconnect|' +
        'fbsql_query|fbsql_read_blob|fbsql_read_clob|fbsql_result|fbsql_rollback|fbsql_select_db|fbsql_set_lob_mode|' +
        'fbsql_set_password|fbsql_set_transaction|fbsql_start_db|fbsql_stop_db|fbsql_tablename|fbsql_username|fbsql_warnings|' +
        'fclose|fdf_add_doc_javascript|fdf_add_template|fdf_close|fdf_create|fdf_enum_values|fdf_errno|fdf_error|fdf_get_ap|' +
        'fdf_get_attachment|fdf_get_encoding|fdf_get_file|fdf_get_flags|fdf_get_opt|fdf_get_status|fdf_get_value|' +
        'fdf_get_version|fdf_header|fdf_next_field_name|fdf_open|fdf_open_string|fdf_remove_item|fdf_save|fdf_save_string|' +
        'fdf_set_ap|fdf_set_encoding|fdf_set_file|fdf_set_flags|fdf_set_javascript_action|fdf_set_opt|fdf_set_status|' +
        'fdf_set_submit_form_action|fdf_set_target_frame|fdf_set_value|fdf_set_version|feof|fflush|fgetc|fgetcsv|fgets|' +
        'fgetss|file|file_exists|file_get_contents|file_put_contents|fileatime|filectime|filegroup|fileinode|filemtime|' +
        'fileowner|fileperms|filepro|filepro_fieldcount|filepro_fieldname|filepro_fieldtype|filepro_fieldwidth|' +
        'filepro_retrieve|filepro_rowcount|filesize|filetype|floatval|flock|floor|flush|fmod|fnmatch|fopen|fpassthru|fprintf|' +
        'fputs|fread|frenchtojd|fribidi_log2vis|fscanf|fseek|fsockopen|fstat|ftell|ftok|ftp_alloc|ftp_cdup|ftp_chdir|ftp_chmod|' +
        'ftp_close|ftp_connect|ftp_delete|ftp_exec|ftp_fget|ftp_fput|ftp_get|ftp_get_option|ftp_login|ftp_mdtm|ftp_mkdir|' +
        'ftp_nb_continue|ftp_nb_fget|ftp_nb_fput|ftp_nb_get|ftp_nb_put|ftp_nlist|ftp_pasv|ftp_put|ftp_pwd|ftp_quit|ftp_raw|' +
        'ftp_rawlist|ftp_rename|ftp_rmdir|ftp_set_option|ftp_site|ftp_size|ftp_ssl_connect|ftp_systype|ftruncate|func_get_arg|' +
        'func_get_args|func_num_args|function_exists|fwrite|gd_info|get_browser|get_cfg_var|get_class|get_class_methods|' +
        'get_class_vars|get_current_user|get_declared_classes|get_declared_interfaces|get_defined_constants|' +
        'get_defined_functions|get_defined_vars|get_extension_funcs|get_headers|get_html_translation_table|get_include_path|' +
        'get_included_files|get_loaded_extensions|get_magic_quotes_gpc|get_magic_quotes_runtime|get_meta_tags|get_object_vars|' +
        'get_parent_class|get_required_files|get_resource_type|getallheaders|getcwd|getdate|getenv|gethostbyaddr|gethostbyname|' +
        'gethostbynamel|getimagesize|getlastmod|getmxrr|getmygid|getmyinode|getmypid|getmyuid|getopt|getprotobyname|' +
        'getprotobynumber|getrandmax|getrusage|getservbyname|getservbyport|gettext|gettimeofday|gettype|glob|gmdate|gmmktime|' +
        'gmp_abs|gmp_add|gmp_and|gmp_clrbit|gmp_cmp|gmp_com|gmp_div|gmp_div_q|gmp_div_qr|gmp_div_r|gmp_divexact|gmp_fact|' +
        'gmp_gcd|gmp_gcdext|gmp_hamdist|gmp_init|gmp_intval|gmp_invert|gmp_jacobi|gmp_legendre|gmp_mod|gmp_mul|gmp_neg|gmp_or|' +
        'gmp_perfect_square|gmp_popcount|gmp_pow|gmp_powm|gmp_prob_prime|gmp_random|gmp_scan0|gmp_scan1|gmp_setbit|gmp_sign|' +
        'gmp_sqrt|gmp_sqrtrem|gmp_strval|gmp_sub|gmp_xor|gmstrftime|gregoriantojd|gzclose|gzcompress|gzdeflate|gzencode|gzeof|' +
        'gzfile|gzgetc|gzgets|gzgetss|gzinflate|gzopen|gzpassthru|gzputs|gzread|gzrewind|gzseek|gztell|gzuncompress|gzwrite|' +
        'header|headers_list|headers_sent|hebrev|hebrevc|hexdec|highlight_file|highlight_string|html_entity_decode|htmlentities|' +
        'htmlspecialchars|http_build_query|hw_api_attribute|hw_api_content|hw_api_object|hw_array2objrec|hw_changeobject|' +
        'hw_children|hw_childrenobj|hw_close|hw_connect|hw_connection_info|hw_cp|hw_deleteobject|hw_docbyanchor|hw_docbyanchorobj|' +
        'hw_document_attributes|hw_document_bodytag|hw_document_content|hw_document_setcontent|hw_document_size|hw_dummy|' +
        'hw_edittext|hw_error|hw_errormsg|hw_free_document|hw_getanchors|hw_getanchorsobj|hw_getandlock|hw_getchildcoll|' +
        'hw_getchildcollobj|hw_getchilddoccoll|hw_getchilddoccollobj|hw_getobject|hw_getobjectbyquery|hw_getobjectbyquerycoll|' +
        'hw_getobjectbyquerycollobj|hw_getobjectbyqueryobj|hw_getparents|hw_getparentsobj|hw_getrellink|hw_getremote|' +
        'hw_getremotechildren|hw_getsrcbydestobj|hw_gettext|hw_getusername|hw_identify|hw_incollections|hw_info|hw_inscoll|' +
        'hw_insdoc|hw_insertanchors|hw_insertdocument|hw_insertobject|hw_mapid|hw_modifyobject|hw_mv|hw_new_document|' +
        'hw_objrec2array|hw_output_document|hw_pconnect|hw_pipedocument|hw_root|hw_setlinkroot|hw_stat|hw_unlock|hw_who|' +
        'hwapi_hgcsp|hypot|ibase_add_user|ibase_affected_rows|ibase_backup|ibase_blob_add|ibase_blob_cancel|ibase_blob_close|' +
        'ibase_blob_create|ibase_blob_echo|ibase_blob_get|ibase_blob_import|ibase_blob_info|ibase_blob_open|ibase_close|' +
        'ibase_commit|ibase_commit_ret|ibase_connect|ibase_db_info|ibase_delete_user|ibase_drop_db|ibase_errcode|ibase_errmsg|' +
        'ibase_execute|ibase_fetch_assoc|ibase_fetch_object|ibase_fetch_row|ibase_field_info|ibase_free_event_handler|' +
        'ibase_free_query|ibase_free_result|ibase_gen_id|ibase_maintain_db|ibase_modify_user|ibase_name_result|ibase_num_fields|' +
        'ibase_num_params|ibase_param_info|ibase_pconnect|ibase_prepare|ibase_query|ibase_restore|ibase_rollback|ibase_rollback_ret|' +
        'ibase_server_info|ibase_service_attach|ibase_service_detach|ibase_set_event_handler|ibase_timefmt|ibase_trans|' +
        'ibase_wait_event|iconv|iconv_get_encoding|iconv_mime_decode|iconv_mime_decode_headers|iconv_mime_encode|iconv_set_encoding|' +
        'iconv_strlen|iconv_strpos|iconv_strrpos|iconv_substr|idate|ifx_affected_rows|ifx_blobinfile_mode|ifx_byteasvarchar|' +
        'ifx_close|ifx_connect|ifx_copy_blob|ifx_create_blob|ifx_create_char|ifx_do|ifx_error|ifx_errormsg|ifx_fetch_row|' +
        'ifx_fieldproperties|ifx_fieldtypes|ifx_free_blob|ifx_free_char|ifx_free_result|ifx_get_blob|ifx_get_char|ifx_getsqlca|' +
        'ifx_htmltbl_result|ifx_nullformat|ifx_num_fields|ifx_num_rows|ifx_pconnect|ifx_prepare|ifx_query|ifx_textasvarchar|' +
        'ifx_update_blob|ifx_update_char|ifxus_close_slob|ifxus_create_slob|ifxus_free_slob|ifxus_open_slob|ifxus_read_slob|' +
        'ifxus_seek_slob|ifxus_tell_slob|ifxus_write_slob|ignore_user_abort|image2wbmp|image_type_to_mime_type|imagealphablending|' +
        'imageantialias|imagearc|imagechar|imagecharup|imagecolorallocate|imagecolorallocatealpha|imagecolorat|imagecolorclosest|' +
        'imagecolorclosestalpha|imagecolorclosesthwb|imagecolordeallocate|imagecolorexact|imagecolorexactalpha|imagecolormatch|' +
        'imagecolorresolve|imagecolorresolvealpha|imagecolorset|imagecolorsforindex|imagecolorstotal|imagecolortransparent|imagecopy|' +
        'imagecopymerge|imagecopymergegray|imagecopyresampled|imagecopyresized|imagecreate|imagecreatefromgd|imagecreatefromgd2|' +
        'imagecreatefromgd2part|imagecreatefromgif|imagecreatefromjpeg|imagecreatefrompng|imagecreatefromstring|imagecreatefromwbmp|' +
        'imagecreatefromxbm|imagecreatefromxpm|imagecreatetruecolor|imagedashedline|imagedestroy|imageellipse|imagefill|imagefilledarc|' +
        'imagefilledellipse|imagefilledpolygon|imagefilledrectangle|imagefilltoborder|imagefilter|imagefontheight|imagefontwidth|' +
        'imageftbbox|imagefttext|imagegammacorrect|imagegd|imagegd2|imagegif|imageinterlace|imageistruecolor|imagejpeg|imagelayereffect|' +
        'imageline|imageloadfont|imagepalettecopy|imagepng|imagepolygon|imagepsbbox|imagepscopyfont|imagepsencodefont|imagepsextendfont|' +
        'imagepsfreefont|imagepsloadfont|imagepsslantfont|imagepstext|imagerectangle|imagerotate|imagesavealpha|imagesetbrush|' +
        'imagesetpixel|imagesetstyle|imagesetthickness|imagesettile|imagestring|imagestringup|imagesx|imagesy|imagetruecolortopalette|' +
        'imagettfbbox|imagettftext|imagetypes|imagewbmp|imagexbm|imap_8bit|imap_alerts|imap_append|imap_base64|imap_binary|imap_body|' +
        'imap_bodystruct|imap_check|imap_clearflag_full|imap_close|imap_createmailbox|imap_delete|imap_deletemailbox|imap_errors|' +
        'imap_expunge|imap_fetch_overview|imap_fetchbody|imap_fetchheader|imap_fetchstructure|imap_get_quota|imap_get_quotaroot|' +
        'imap_getacl|imap_getmailboxes|imap_getsubscribed|imap_header|imap_headerinfo|imap_headers|imap_last_error|imap_list|' +
        'imap_listmailbox|imap_listscan|imap_listsubscribed|imap_lsub|imap_mail|imap_mail_compose|imap_mail_copy|imap_mail_move|' +
        'imap_mailboxmsginfo|imap_mime_header_decode|imap_msgno|imap_num_msg|imap_num_recent|imap_open|imap_ping|imap_qprint|' +
        'imap_renamemailbox|imap_reopen|imap_rfc822_parse_adrlist|imap_rfc822_parse_headers|imap_rfc822_write_address|imap_scanmailbox|' +
        'imap_search|imap_set_quota|imap_setacl|imap_setflag_full|imap_sort|imap_status|imap_subscribe|imap_thread|imap_timeout|' +
        'imap_uid|imap_undelete|imap_unsubscribe|imap_utf7_decode|imap_utf7_encode|imap_utf8|implode|import_request_variables|in_array|' +
        'ingres_autocommit|ingres_close|ingres_commit|ingres_connect|ingres_fetch_array|ingres_fetch_object|ingres_fetch_row|' +
        'ingres_field_length|ingres_field_name|ingres_field_nullable|ingres_field_precision|ingres_field_scale|ingres_field_type|' +
        'ingres_num_fields|ingres_num_rows|ingres_pconnect|ingres_query|ingres_rollback|ini_alter|ini_get|ini_get_all|ini_restore|' +
        'ini_set|intval|ip2long|iptcembed|iptcparse|ircg_channel_mode|ircg_disconnect|ircg_fetch_error_msg|ircg_get_username|' +
        'ircg_html_encode|ircg_ignore_add|ircg_ignore_del|ircg_invite|ircg_is_conn_alive|ircg_join|ircg_kick|ircg_list|' +
        'ircg_lookup_format_messages|ircg_lusers|ircg_msg|ircg_nick|ircg_nickname_escape|ircg_nickname_unescape|ircg_notice|ircg_oper|' +
        'ircg_part|ircg_pconnect|ircg_register_format_messages|ircg_set_current|ircg_set_file|ircg_set_on_die|ircg_topic|ircg_who|' +
        'ircg_whois|is_a|is_array|is_bool|is_callable|is_dir|is_double|is_executable|is_file|is_finite|is_float|is_infinite|is_int|' +
        'is_integer|is_link|is_long|is_nan|is_null|is_numeric|is_object|is_readable|is_real|is_resource|is_scalar|is_soap_fault|' +
        'is_string|is_subclass_of|is_uploaded_file|is_writable|is_writeable|isset|java_last_exception_clear|java_last_exception_get|' +
        'jddayofweek|jdmonthname|jdtofrench|jdtogregorian|jdtojewish|jdtojulian|jdtounix|jewishtojd|join|jpeg2wbmp|juliantojd|key|' +
        'krsort|ksort|lcg_value|ldap_8859_to_t61|ldap_add|ldap_bind|ldap_close|ldap_compare|ldap_connect|ldap_count_entries|ldap_delete|' +
        'ldap_dn2ufn|ldap_err2str|ldap_errno|ldap_error|ldap_explode_dn|ldap_first_attribute|ldap_first_entry|ldap_first_reference|' +
        'ldap_free_result|ldap_get_attributes|ldap_get_dn|ldap_get_entries|ldap_get_option|ldap_get_values|ldap_get_values_len|ldap_list|' +
        'ldap_mod_add|ldap_mod_del|ldap_mod_replace|ldap_modify|ldap_next_attribute|ldap_next_entry|ldap_next_reference|' +
        'ldap_parse_reference|ldap_parse_result|ldap_read|ldap_rename|ldap_search|ldap_set_option|ldap_set_rebind_proc|ldap_sort|' +
        'ldap_start_tls|ldap_t61_to_8859|ldap_unbind|levenshtein|link|linkinfo|list|localeconv|localtime|log|log10|log1p|long2ip|lstat|' +
        'ltrim|lzf_compress|lzf_decompress|lzf_optimized_for|mail|mailparse_determine_best_xfer_encoding|mailparse_msg_create|' +
        'mailparse_msg_extract_part|mailparse_msg_extract_part_file|mailparse_msg_free|mailparse_msg_get_part|mailparse_msg_get_part_data|' +
        'mailparse_msg_get_structure|mailparse_msg_parse|mailparse_msg_parse_file|mailparse_rfc822_parse_addresses|' +
        'mailparse_stream_encode|mailparse_uudecode_all|main|max|mb_convert_case|mb_convert_encoding|mb_convert_kana|mb_convert_variables|' +
        'mb_decode_mimeheader|mb_decode_numericentity|mb_detect_encoding|mb_detect_order|mb_encode_mimeheader|mb_encode_numericentity|' +
        'mb_ereg|mb_ereg_match|mb_ereg_replace|mb_ereg_search|mb_ereg_search_getpos|mb_ereg_search_getregs|mb_ereg_search_init|' +
        'mb_ereg_search_pos|mb_ereg_search_regs|mb_ereg_search_setpos|mb_eregi|mb_eregi_replace|mb_get_info|mb_http_input|mb_http_output|' +
        'mb_internal_encoding|mb_language|mb_output_handler|mb_parse_str|mb_preferred_mime_name|mb_regex_encoding|mb_regex_set_options|' +
        'mb_send_mail|mb_split|mb_strcut|mb_strimwidth|mb_strlen|mb_strpos|mb_strrpos|mb_strtolower|mb_strtoupper|mb_strwidth|' +
        'mb_substitute_character|mb_substr|mb_substr_count|mcal_append_event|mcal_close|mcal_create_calendar|mcal_date_compare|' +
        'mcal_date_valid|mcal_day_of_week|mcal_day_of_year|mcal_days_in_month|mcal_delete_calendar|mcal_delete_event|' +
        'mcal_event_add_attribute|mcal_event_init|mcal_event_set_alarm|mcal_event_set_category|mcal_event_set_class|' +
        'mcal_event_set_description|mcal_event_set_end|mcal_event_set_recur_daily|mcal_event_set_recur_monthly_mday|' +
        'mcal_event_set_recur_monthly_wday|mcal_event_set_recur_none|mcal_event_set_recur_weekly|mcal_event_set_recur_yearly|' +
        'mcal_event_set_start|mcal_event_set_title|mcal_expunge|mcal_fetch_current_stream_event|mcal_fetch_event|mcal_is_leap_year|' +
        'mcal_list_alarms|mcal_list_events|mcal_next_recurrence|mcal_open|mcal_popen|mcal_rename_calendar|mcal_reopen|mcal_snooze|' +
        'mcal_store_event|mcal_time_valid|mcal_week_of_year|mcrypt_cbc|mcrypt_cfb|mcrypt_create_iv|mcrypt_decrypt|mcrypt_ecb|' +
        'mcrypt_enc_get_algorithms_name|mcrypt_enc_get_block_size|mcrypt_enc_get_iv_size|mcrypt_enc_get_key_size|mcrypt_enc_get_modes_name|' +
        'mcrypt_enc_get_supported_key_sizes|mcrypt_enc_is_block_algorithm|mcrypt_enc_is_block_algorithm_mode|mcrypt_enc_is_block_mode|' +
        'mcrypt_enc_self_test|mcrypt_encrypt|mcrypt_generic|mcrypt_generic_deinit|mcrypt_generic_end|mcrypt_generic_init|' +
        'mcrypt_get_block_size|mcrypt_get_cipher_name|mcrypt_get_iv_size|mcrypt_get_key_size|mcrypt_list_algorithms|mcrypt_list_modes|' +
        'mcrypt_module_close|mcrypt_module_get_algo_block_size|mcrypt_module_get_algo_key_size|mcrypt_module_get_supported_key_sizes|' +
        'mcrypt_module_is_block_algorithm|mcrypt_module_is_block_algorithm_mode|mcrypt_module_is_block_mode|mcrypt_module_open|' +
        'mcrypt_module_self_test|mcrypt_ofb|mcve_adduser|mcve_adduserarg|mcve_bt|mcve_checkstatus|mcve_chkpwd|mcve_chngpwd|' +
        'mcve_completeauthorizations|mcve_connect|mcve_connectionerror|mcve_deleteresponse|mcve_deletetrans|mcve_deleteusersetup|' +
        'mcve_deluser|mcve_destroyconn|mcve_destroyengine|mcve_disableuser|mcve_edituser|mcve_enableuser|mcve_force|mcve_getcell|' +
        'mcve_getcellbynum|mcve_getcommadelimited|mcve_getheader|mcve_getuserarg|mcve_getuserparam|mcve_gft|mcve_gl|mcve_gut|mcve_initconn|' +
        'mcve_initengine|mcve_initusersetup|mcve_iscommadelimited|mcve_liststats|mcve_listusers|mcve_maxconntimeout|mcve_monitor|' +
        'mcve_numcolumns|mcve_numrows|mcve_override|mcve_parsecommadelimited|mcve_ping|mcve_preauth|mcve_preauthcompletion|mcve_qc|' +
        'mcve_responseparam|mcve_return|mcve_returncode|mcve_returnstatus|mcve_sale|mcve_setblocking|mcve_setdropfile|mcve_setip|' +
        'mcve_setssl|mcve_setssl_files|mcve_settimeout|mcve_settle|mcve_text_avs|mcve_text_code|mcve_text_cv|mcve_transactionauth|' +
        'mcve_transactionavs|mcve_transactionbatch|mcve_transactioncv|mcve_transactionid|mcve_transactionitem|mcve_transactionssent|' +
        'mcve_transactiontext|mcve_transinqueue|mcve_transnew|mcve_transparam|mcve_transsend|mcve_ub|mcve_uwait|mcve_verifyconnection|' +
        'mcve_verifysslcert|mcve_void|md5|md5_file|mdecrypt_generic|memory_get_usage|metaphone|method_exists|mhash|mhash_count|' +
        'mhash_get_block_size|mhash_get_hash_name|mhash_keygen_s2k|microtime|mime_content_type|min|ming_setcubicthreshold|ming_setscale|' +
        'ming_useswfversion|mkdir|mktime|money_format|move_uploaded_file|msession_connect|msession_count|msession_create|msession_destroy|' +
        'msession_disconnect|msession_find|msession_get|msession_get_array|msession_getdata|msession_inc|msession_list|msession_listvar|' +
        'msession_lock|msession_plugin|msession_randstr|msession_set|msession_set_array|msession_setdata|msession_timeout|msession_uniq|' +
        'msession_unlock|msg_get_queue|msg_receive|msg_remove_queue|msg_send|msg_set_queue|msg_stat_queue|msql|msql|msql_affected_rows|' +
        'msql_close|msql_connect|msql_create_db|msql_createdb|msql_data_seek|msql_dbname|msql_drop_db|msql_error|msql_fetch_array|' +
        'msql_fetch_field|msql_fetch_object|msql_fetch_row|msql_field_flags|msql_field_len|msql_field_name|msql_field_seek|msql_field_table|' +
        'msql_field_type|msql_fieldflags|msql_fieldlen|msql_fieldname|msql_fieldtable|msql_fieldtype|msql_free_result|msql_list_dbs|' +
        'msql_list_fields|msql_list_tables|msql_num_fields|msql_num_rows|msql_numfields|msql_numrows|msql_pconnect|msql_query|msql_regcase|' +
        'msql_result|msql_select_db|msql_tablename|mssql_bind|mssql_close|mssql_connect|mssql_data_seek|mssql_execute|mssql_fetch_array|' +
        'mssql_fetch_assoc|mssql_fetch_batch|mssql_fetch_field|mssql_fetch_object|mssql_fetch_row|mssql_field_length|mssql_field_name|' +
        'mssql_field_seek|mssql_field_type|mssql_free_result|mssql_free_statement|mssql_get_last_message|mssql_guid_string|mssql_init|' +
        'mssql_min_error_severity|mssql_min_message_severity|mssql_next_result|mssql_num_fields|mssql_num_rows|mssql_pconnect|mssql_query|' +
        'mssql_result|mssql_rows_affected|mssql_select_db|mt_getrandmax|mt_rand|mt_srand|muscat_close|muscat_get|muscat_give|muscat_setup|' +
        'muscat_setup_net|mysql_affected_rows|mysql_change_user|mysql_client_encoding|mysql_close|mysql_connect|mysql_create_db|' +
        'mysql_data_seek|mysql_db_name|mysql_db_query|mysql_drop_db|mysql_errno|mysql_error|mysql_escape_string|mysql_fetch_array|' +
        'mysql_fetch_assoc|mysql_fetch_field|mysql_fetch_lengths|mysql_fetch_object|mysql_fetch_row|mysql_field_flags|mysql_field_len|' +
        'mysql_field_name|mysql_field_seek|mysql_field_table|mysql_field_type|mysql_free_result|mysql_get_client_info|mysql_get_host_info|' +
        'mysql_get_proto_info|mysql_get_server_info|mysql_info|mysql_insert_id|mysql_list_dbs|mysql_list_fields|mysql_list_processes|' +
        'mysql_list_tables|mysql_num_fields|mysql_num_rows|mysql_pconnect|mysql_ping|mysql_query|mysql_real_escape_string|mysql_result|' +
        'mysql_select_db|mysql_stat|mysql_tablename|mysql_thread_id|mysql_unbuffered_query|mysqli_affected_rows|mysqli_autocommit|' +
        'mysqli_bind_param|mysqli_bind_result|mysqli_change_user|mysqli_character_set_name|mysqli_client_encoding|mysqli_close|mysqli_commit|' +
        'mysqli_connect|mysqli_connect_errno|mysqli_connect_error|mysqli_data_seek|mysqli_debug|mysqli_disable_reads_from_master|' +
        'mysqli_disable_rpl_parse|mysqli_dump_debug_info|mysqli_embedded_connect|mysqli_enable_reads_from_master|mysqli_enable_rpl_parse|' +
        'mysqli_errno|mysqli_error|mysqli_escape_string|mysqli_execute|mysqli_fetch|mysqli_fetch_array|mysqli_fetch_assoc|mysqli_fetch_field|' +
        'mysqli_fetch_field_direct|mysqli_fetch_fields|mysqli_fetch_lengths|mysqli_fetch_object|mysqli_fetch_row|mysqli_field_count|' +
        'mysqli_field_seek|mysqli_field_tell|mysqli_free_result|mysqli_get_client_info|mysqli_get_client_version|mysqli_get_host_info|' +
        'mysqli_get_metadata|mysqli_get_proto_info|mysqli_get_server_info|mysqli_get_server_version|mysqli_info|mysqli_init|mysqli_insert_id|' +
        'mysqli_kill|mysqli_master_query|mysqli_more_results|mysqli_multi_query|mysqli_next_result|mysqli_num_fields|mysqli_num_rows|' +
        'mysqli_options|mysqli_param_count|mysqli_ping|mysqli_prepare|mysqli_query|mysqli_real_connect|mysqli_real_escape_string|' +
        'mysqli_real_query|mysqli_report|mysqli_rollback|mysqli_rpl_parse_enabled|mysqli_rpl_probe|mysqli_rpl_query_type|mysqli_select_db|' +
        'mysqli_send_long_data|mysqli_send_query|mysqli_server_end|mysqli_server_init|mysqli_set_opt|mysqli_sqlstate|mysqli_ssl_set|mysqli_stat|' +
        'mysqli_stmt_init|mysqli_stmt_affected_rows|mysqli_stmt_bind_param|mysqli_stmt_bind_result|mysqli_stmt_close|mysqli_stmt_data_seek|' +
        'mysqli_stmt_errno|mysqli_stmt_error|mysqli_stmt_execute|mysqli_stmt_fetch|mysqli_stmt_free_result|mysqli_stmt_num_rows|' +
        'mysqli_stmt_param_count|mysqli_stmt_prepare|mysqli_stmt_result_metadata|mysqli_stmt_send_long_data|mysqli_stmt_sqlstate|' +
        'mysqli_stmt_store_result|mysqli_store_result|mysqli_thread_id|mysqli_thread_safe|mysqli_use_result|mysqli_warning_count|natcasesort|' +
        'natsort|ncurses_addch|ncurses_addchnstr|ncurses_addchstr|ncurses_addnstr|ncurses_addstr|ncurses_assume_default_colors|ncurses_attroff|' +
        'ncurses_attron|ncurses_attrset|ncurses_baudrate|ncurses_beep|ncurses_bkgd|ncurses_bkgdset|ncurses_border|ncurses_bottom_panel|' +
        'ncurses_can_change_color|ncurses_cbreak|ncurses_clear|ncurses_clrtobot|ncurses_clrtoeol|ncurses_color_content|ncurses_color_set|' +
        'ncurses_curs_set|ncurses_def_prog_mode|ncurses_def_shell_mode|ncurses_define_key|ncurses_del_panel|ncurses_delay_output|ncurses_delch|' +
        'ncurses_deleteln|ncurses_delwin|ncurses_doupdate|ncurses_echo|ncurses_echochar|ncurses_end|ncurses_erase|ncurses_erasechar|' +
        'ncurses_filter|ncurses_flash|ncurses_flushinp|ncurses_getch|ncurses_getmaxyx|ncurses_getmouse|ncurses_getyx|ncurses_halfdelay|' +
        'ncurses_has_colors|ncurses_has_ic|ncurses_has_il|ncurses_has_key|ncurses_hide_panel|ncurses_hline|ncurses_inch|ncurses_init|' +
        'ncurses_init_color|ncurses_init_pair|ncurses_insch|ncurses_insdelln|ncurses_insertln|ncurses_insstr|ncurses_instr|ncurses_isendwin|' +
        'ncurses_keyok|ncurses_keypad|ncurses_killchar|ncurses_longname|ncurses_meta|ncurses_mouse_trafo|ncurses_mouseinterval|ncurses_mousemask|' +
        'ncurses_move|ncurses_move_panel|ncurses_mvaddch|ncurses_mvaddchnstr|ncurses_mvaddchstr|ncurses_mvaddnstr|ncurses_mvaddstr|ncurses_mvcur|' +
        'ncurses_mvdelch|ncurses_mvgetch|ncurses_mvhline|ncurses_mvinch|ncurses_mvvline|ncurses_mvwaddstr|ncurses_napms|ncurses_new_panel|' +
        'ncurses_newpad|ncurses_newwin|ncurses_nl|ncurses_nocbreak|ncurses_noecho|ncurses_nonl|ncurses_noqiflush|ncurses_noraw|' +
        'ncurses_pair_content|ncurses_panel_above|ncurses_panel_below|ncurses_panel_window|ncurses_pnoutrefresh|ncurses_prefresh|' +
        'ncurses_putp|ncurses_qiflush|ncurses_raw|ncurses_refresh|ncurses_replace_panel|ncurses_reset_prog_mode|ncurses_reset_shell_mode|' +
        'ncurses_resetty|ncurses_savetty|ncurses_scr_dump|ncurses_scr_init|ncurses_scr_restore|ncurses_scr_set|ncurses_scrl|ncurses_show_panel|' +
        'ncurses_slk_attr|ncurses_slk_attroff|ncurses_slk_attron|ncurses_slk_attrset|ncurses_slk_clear|ncurses_slk_color|ncurses_slk_init|' +
        'ncurses_slk_noutrefresh|ncurses_slk_refresh|ncurses_slk_restore|ncurses_slk_set|ncurses_slk_touch|ncurses_standend|ncurses_standout|' +
        'ncurses_start_color|ncurses_termattrs|ncurses_termname|ncurses_timeout|ncurses_top_panel|ncurses_typeahead|ncurses_ungetch|' +
        'ncurses_ungetmouse|ncurses_update_panels|ncurses_use_default_colors|ncurses_use_env|ncurses_use_extended_names|ncurses_vidattr|' +
        'ncurses_vline|ncurses_waddch|ncurses_waddstr|ncurses_wattroff|ncurses_wattron|ncurses_wattrset|ncurses_wborder|ncurses_wclear|' +
        'ncurses_wcolor_set|ncurses_werase|ncurses_wgetch|ncurses_whline|ncurses_wmouse_trafo|ncurses_wmove|ncurses_wnoutrefresh|' +
        'ncurses_wrefresh|ncurses_wstandend|ncurses_wstandout|ncurses_wvline|next|ngettext|nl2br|nl_langinfo|notes_body|notes_copy_db|' +
        'notes_create_db|notes_create_note|notes_drop_db|notes_find_note|notes_header_info|notes_list_msgs|notes_mark_read|notes_mark_unread|' +
        'notes_nav_create|notes_search|notes_unread|notes_version|nsapi_request_headers|nsapi_response_headers|nsapi_virtual|number_format|' +
        'ob_clean|ob_end_clean|ob_end_flush|ob_flush|ob_get_clean|ob_get_contents|ob_get_flush|ob_get_length|ob_get_level|ob_get_status|' +
        'ob_gzhandler|ob_iconv_handler|ob_implicit_flush|ob_list_handlers|ob_start|ob_tidyhandler|oci_bind_by_name|oci_cancel|oci_close|' +
        'oci_commit|oci_connect|oci_define_by_name|oci_error|oci_execute|oci_fetch|oci_fetch_all|oci_fetch_array|oci_fetch_assoc|' +
        'oci_fetch_object|oci_fetch_row|oci_field_is_null|oci_field_name|oci_field_precision|oci_field_scale|oci_field_size|oci_field_type|' +
        'oci_field_type_raw|oci_free_statement|oci_internal_debug|oci_lob_copy|oci_lob_is_equal|oci_new_collection|oci_new_connect|' +
        'oci_new_cursor|oci_new_descriptor|oci_num_fields|oci_num_rows|oci_parse|oci_password_change|oci_pconnect|oci_result|oci_rollback|' +
        'oci_server_version|oci_set_prefetch|oci_statement_type|ocibindbyname|ocicancel|ocicloselob|ocicollappend|ocicollassign|' +
        'ocicollassignelem|ocicollgetelem|ocicollmax|ocicollsize|ocicolltrim|ocicolumnisnull|ocicolumnname|ocicolumnprecision|ocicolumnscale|' +
        'ocicolumnsize|ocicolumntype|ocicolumntyperaw|ocicommit|ocidefinebyname|ocierror|ociexecute|ocifetch|ocifetchinto|ocifetchstatement|' +
        'ocifreecollection|ocifreecursor|ocifreedesc|ocifreestatement|ociinternaldebug|ociloadlob|ocilogoff|ocilogon|ocinewcollection|' +
        'ocinewcursor|ocinewdescriptor|ocinlogon|ocinumcols|ociparse|ociplogon|ociresult|ocirollback|ocirowcount|ocisavelob|ocisavelobfile|' +
        'ociserverversion|ocisetprefetch|ocistatementtype|ociwritelobtofile|ociwritetemporarylob|octdec|odbc_autocommit|odbc_binmode|' +
        'odbc_close|odbc_close_all|odbc_columnprivileges|odbc_columns|odbc_commit|odbc_connect|odbc_cursor|odbc_data_source|odbc_do|odbc_error|' +
        'odbc_errormsg|odbc_exec|odbc_execute|odbc_fetch_array|odbc_fetch_into|odbc_fetch_object|odbc_fetch_row|odbc_field_len|odbc_field_name|' +
        'odbc_field_num|odbc_field_precision|odbc_field_scale|odbc_field_type|odbc_foreignkeys|odbc_free_result|odbc_gettypeinfo|odbc_longreadlen|' +
        'odbc_next_result|odbc_num_fields|odbc_num_rows|odbc_pconnect|odbc_prepare|odbc_primarykeys|odbc_procedurecolumns|odbc_procedures|' +
        'odbc_result|odbc_result_all|odbc_rollback|odbc_setoption|odbc_specialcolumns|odbc_statistics|odbc_tableprivileges|odbc_tables|opendir|' +
        'openlog|openssl_csr_export|openssl_csr_export_to_file|openssl_csr_new|openssl_csr_sign|openssl_error_string|openssl_free_key|' +
        'openssl_get_privatekey|openssl_get_publickey|openssl_open|openssl_pkcs7_decrypt|openssl_pkcs7_encrypt|openssl_pkcs7_sign|' +
        'openssl_pkcs7_verify|openssl_pkey_export|openssl_pkey_export_to_file|openssl_pkey_get_private|openssl_pkey_get_public|openssl_pkey_new|' +
        'openssl_private_decrypt|openssl_private_encrypt|openssl_public_decrypt|openssl_public_encrypt|openssl_seal|openssl_sign|openssl_verify|' +
        'openssl_x509_check_private_key|openssl_x509_checkpurpose|openssl_x509_export|openssl_x509_export_to_file|openssl_x509_free|' +
        'openssl_x509_parse|openssl_x509_read|ora_bind|ora_close|ora_columnname|ora_columnsize|ora_columntype|ora_commit|ora_commitoff|' +
        'ora_commiton|ora_do|ora_error|ora_errorcode|ora_exec|ora_fetch|ora_fetch_into|ora_getcolumn|ora_logoff|ora_logon|ora_numcols|' +
        'ora_numrows|ora_open|ora_parse|ora_plogon|ora_rollback|ord|output_add_rewrite_var|output_reset_rewrite_vars|overload|ovrimos_close|' +
        'ovrimos_commit|ovrimos_connect|ovrimos_cursor|ovrimos_exec|ovrimos_execute|ovrimos_fetch_into|ovrimos_fetch_row|ovrimos_field_len|' +
        'ovrimos_field_name|ovrimos_field_num|ovrimos_field_type|ovrimos_free_result|ovrimos_longreadlen|ovrimos_num_fields|ovrimos_num_rows|' +
        'ovrimos_prepare|ovrimos_result|ovrimos_result_all|ovrimos_rollback|pack|parse_ini_file|parse_str|parse_url|passthru|pathinfo|pclose|' +
        'pcntl_alarm|pcntl_exec|pcntl_fork|pcntl_getpriority|pcntl_setpriority|pcntl_signal|pcntl_wait|pcntl_waitpid|pcntl_wexitstatus|' +
        'pcntl_wifexited|pcntl_wifsignaled|pcntl_wifstopped|pcntl_wstopsig|pcntl_wtermsig|pdf_add_annotation|pdf_add_bookmark|pdf_add_launchlink|' +
        'pdf_add_locallink|pdf_add_note|pdf_add_outline|pdf_add_pdflink|pdf_add_thumbnail|pdf_add_weblink|pdf_arc|pdf_arcn|pdf_attach_file|' +
        'pdf_begin_page|pdf_begin_pattern|pdf_begin_template|pdf_circle|pdf_clip|pdf_close|pdf_close_image|pdf_close_pdi|pdf_close_pdi_page|' +
        'pdf_closepath|pdf_closepath_fill_stroke|pdf_closepath_stroke|pdf_concat|pdf_continue_text|pdf_curveto|pdf_delete|pdf_end_page|' +
        'pdf_end_pattern|pdf_end_template|pdf_endpath|pdf_fill|pdf_fill_stroke|pdf_findfont|pdf_get_buffer|pdf_get_font|pdf_get_fontname|' +
        'pdf_get_fontsize|pdf_get_image_height|pdf_get_image_width|pdf_get_majorversion|pdf_get_minorversion|pdf_get_parameter|' +
        'pdf_get_pdi_parameter|pdf_get_pdi_value|pdf_get_value|pdf_initgraphics|pdf_lineto|pdf_makespotcolor|pdf_moveto|pdf_new|pdf_open|' +
        'pdf_open_ccitt|pdf_open_file|pdf_open_gif|pdf_open_image|pdf_open_image_file|pdf_open_jpeg|pdf_open_memory_image|pdf_open_pdi|' +
        'pdf_open_pdi_page|pdf_open_png|pdf_open_tiff|pdf_place_image|pdf_place_pdi_page|pdf_rect|pdf_restore|pdf_rotate|pdf_save|' +
        'pdf_scale|pdf_set_border_color|pdf_set_border_dash|pdf_set_border_style|pdf_set_char_spacing|pdf_set_duration|pdf_set_font|' +
        'pdf_set_horiz_scaling|pdf_set_info|pdf_set_info_author|pdf_set_info_creator|pdf_set_info_keywords|pdf_set_info_subject|' +
        'pdf_set_info_title|pdf_set_leading|pdf_set_parameter|pdf_set_text_matrix|pdf_set_text_pos|pdf_set_text_rendering|pdf_set_text_rise|' +
        'pdf_set_value|pdf_set_word_spacing|pdf_setcolor|pdf_setdash|pdf_setflat|pdf_setfont|pdf_setgray|pdf_setgray_fill|pdf_setgray_stroke|' +
        'pdf_setlinecap|pdf_setlinejoin|pdf_setlinewidth|pdf_setmatrix|pdf_setmiterlimit|pdf_setpolydash|pdf_setrgbcolor|pdf_setrgbcolor_fill|' +
        'pdf_setrgbcolor_stroke|pdf_show|pdf_show_boxed|pdf_show_xy|pdf_skew|pdf_stringwidth|pdf_stroke|pdf_translate|pfpro_cleanup|pfpro_init|' +
        'pfpro_process|pfpro_process_raw|pfpro_version|pfsockopen|pg_affected_rows|pg_cancel_query|pg_client_encoding|pg_close|pg_connect|' +
        'pg_connection_busy|pg_connection_reset|pg_connection_status|pg_convert|pg_copy_from|pg_copy_to|pg_dbname|pg_delete|pg_end_copy|' +
        'pg_escape_bytea|pg_escape_string|pg_fetch_all|pg_fetch_array|pg_fetch_assoc|pg_fetch_object|pg_fetch_result|pg_fetch_row|' +
        'pg_field_is_null|pg_field_name|pg_field_num|pg_field_prtlen|pg_field_size|pg_field_type|pg_free_result|pg_get_notify|pg_get_pid|' +
        'pg_get_result|pg_host|pg_insert|pg_last_error|pg_last_notice|pg_last_oid|pg_lo_close|pg_lo_create|pg_lo_export|pg_lo_import|' +
        'pg_lo_open|pg_lo_read|pg_lo_read_all|pg_lo_seek|pg_lo_tell|pg_lo_unlink|pg_lo_write|pg_meta_data|pg_num_fields|pg_num_rows|' +
        'pg_options|pg_pconnect|pg_ping|pg_port|pg_put_line|pg_query|pg_result_error|pg_result_seek|pg_result_status|pg_select|pg_send_query|' +
        'pg_set_client_encoding|pg_trace|pg_tty|pg_unescape_bytea|pg_untrace|pg_update|php_ini_scanned_files|php_logo_guid|php_sapi_name|' +
        'php_uname|phpcredits|phpinfo|phpversion|pi|png2wbmp|popen|pos|posix_ctermid|posix_get_last_error|posix_getcwd|posix_getegid|' +
        'posix_geteuid|posix_getgid|posix_getgrgid|posix_getgrnam|posix_getgroups|posix_getlogin|posix_getpgid|posix_getpgrp|posix_getpid|' +
        'posix_getppid|posix_getpwnam|posix_getpwuid|posix_getrlimit|posix_getsid|posix_getuid|posix_isatty|posix_kill|posix_mkfifo|' +
        'posix_setegid|posix_seteuid|posix_setgid|posix_setpgid|posix_setsid|posix_setuid|posix_strerror|posix_times|posix_ttyname|' +
        'posix_uname|pow|preg_grep|preg_match|preg_match_all|preg_quote|preg_replace|preg_replace_callback|preg_split|prev|print|print_r|' +
        'printer_abort|printer_close|printer_create_brush|printer_create_dc|printer_create_font|printer_create_pen|printer_delete_brush|' +
        'printer_delete_dc|printer_delete_font|printer_delete_pen|printer_draw_bmp|printer_draw_chord|printer_draw_elipse|printer_draw_line|' +
        'printer_draw_pie|printer_draw_rectangle|printer_draw_roundrect|printer_draw_text|printer_end_doc|printer_end_page|printer_get_option|' +
        'printer_list|printer_logical_fontheight|printer_open|printer_select_brush|printer_select_font|printer_select_pen|printer_set_option|' +
        'printer_start_doc|printer_start_page|printer_write|printf|proc_close|proc_get_status|proc_nice|proc_open|proc_terminate|' +
        'pspell_add_to_personal|pspell_add_to_session|pspell_check|pspell_clear_session|pspell_config_create|pspell_config_ignore|' +
        'pspell_config_mode|pspell_config_personal|pspell_config_repl|pspell_config_runtogether|pspell_config_save_repl|pspell_new|' +
        'pspell_new_config|pspell_new_personal|pspell_save_wordlist|pspell_store_replacement|pspell_suggest|putenv|qdom_error|qdom_tree|' +
        'quoted_printable_decode|quotemeta|rad2deg|rand|range|rawurldecode|rawurlencode|read_exif_data|readdir|readfile|readgzfile|readline|' +
        'readline_add_history|readline_clear_history|readline_completion_function|readline_info|readline_list_history|readline_read_history|' +
        'readline_write_history|readlink|realpath|recode|recode_file|recode_string|register_shutdown_function|register_tick_function|rename|' +
        'reset|restore_error_handler|restore_include_path|rewind|rewinddir|rmdir|round|rsort|rtrim|scandir|sem_acquire|sem_get|sem_release|' +
        'sem_remove|serialize|sesam_affected_rows|sesam_commit|sesam_connect|sesam_diagnostic|sesam_disconnect|sesam_errormsg|sesam_execimm|' +
        'sesam_fetch_array|sesam_fetch_result|sesam_fetch_row|sesam_field_array|sesam_field_name|sesam_free_result|sesam_num_fields|sesam_query|' +
        'sesam_rollback|sesam_seek_row|sesam_settransaction|session_cache_expire|session_cache_limiter|session_commit|session_decode|' +
        'session_destroy|session_encode|session_get_cookie_params|session_id|session_is_registered|session_module_name|session_name|' +
        'session_regenerate_id|session_register|session_save_path|session_set_cookie_params|session_set_save_handler|session_start|' +
        'session_unregister|session_unset|session_write_close|set_error_handler|set_file_buffer|set_include_path|set_magic_quotes_runtime|' +
        'set_time_limit|setcookie|setlocale|setrawcookie|settype|sha1|sha1_file|shell_exec|shm_attach|shm_detach|shm_get_var|shm_put_var|' +
        'shm_remove|shm_remove_var|shmop_close|shmop_delete|shmop_open|shmop_read|shmop_size|shmop_write|show_source|shuffle|similar_text|' +
        'simplexml_import_dom|simplexml_load_file|simplexml_load_string|sin|sinh|sizeof|sleep|snmp_get_quick_print|snmp_set_quick_print|' +
        'snmpget|snmprealwalk|snmpset|snmpwalk|snmpwalkoid|socket_accept|socket_bind|socket_clear_error|socket_close|socket_connect|' +
        'socket_create|socket_create_listen|socket_create_pair|socket_get_option|socket_get_status|socket_getpeername|socket_getsockname|' +
        'socket_iovec_add|socket_iovec_alloc|socket_iovec_delete|socket_iovec_fetch|socket_iovec_free|socket_iovec_set|socket_last_error|' +
        'socket_listen|socket_read|socket_readv|socket_recv|socket_recvfrom|socket_recvmsg|socket_select|socket_send|socket_sendmsg|' +
        'socket_sendto|socket_set_block|socket_set_blocking|socket_set_nonblock|socket_set_option|socket_set_timeout|socket_shutdown|' +
        'socket_strerror|socket_write|socket_writev|sort|soundex|split|spliti|sprintf|sql_regcase|sqlite_array_query|sqlite_busy_timeout|' +
        'sqlite_changes|sqlite_close|sqlite_column|sqlite_create_aggregate|sqlite_create_function|sqlite_current|sqlite_error_string|' +
        'sqlite_escape_string|sqlite_fetch_array|sqlite_fetch_single|sqlite_fetch_string|sqlite_field_name|sqlite_has_more|sqlite_last_error|' +
        'sqlite_last_insert_rowid|sqlite_libencoding|sqlite_libversion|sqlite_next|sqlite_num_fields|sqlite_num_rows|sqlite_open|sqlite_popen|' +
        'sqlite_query|sqlite_rewind|sqlite_seek|sqlite_udf_decode_binary|sqlite_udf_encode_binary|sqlite_unbuffered_query|sqrt|srand|sscanf|' +
        'stat|str_ireplace|str_pad|str_repeat|str_replace|str_rot13|str_shuffle|str_split|str_word_count|strcasecmp|strchr|strcmp|strcoll|' +
        'strcspn|stream_context_create|stream_context_get_options|stream_context_set_option|stream_context_set_params|stream_copy_to_stream|' +
        'stream_filter_append|stream_filter_prepend|stream_filter_register|stream_get_contents|stream_get_filters|stream_get_line|' +
        'stream_get_meta_data|stream_get_transports|stream_get_wrappers|stream_register_wrapper|stream_select|stream_set_blocking|' +
        'stream_set_timeout|stream_set_write_buffer|stream_socket_accept|stream_socket_client|stream_socket_get_name|stream_socket_recvfrom|' +
        'stream_socket_sendto|stream_socket_server|stream_wrapper_register|strftime|strip_tags|stripcslashes|stripos|stripslashes|stristr|' +
        'strlen|strnatcasecmp|strnatcmp|strncasecmp|strncmp|strpos|strrchr|strrev|strripos|strrpos|strspn|strstr|strtok|strtolower|strtotime|' +
        'strtoupper|strtr|strval|substr|substr_compare|substr_count|substr_replace|swf_actiongeturl|swf_actiongotoframe|swf_actiongotolabel|' +
        'swf_actionnextframe|swf_actionplay|swf_actionprevframe|swf_actionsettarget|swf_actionstop|swf_actiontogglequality|swf_actionwaitforframe|' +
        'swf_addbuttonrecord|swf_addcolor|swf_closefile|swf_definebitmap|swf_definefont|swf_defineline|swf_definepoly|swf_definerect|' +
        'swf_definetext|swf_endbutton|swf_enddoaction|swf_endshape|swf_endsymbol|swf_fontsize|swf_fontslant|swf_fonttracking|swf_getbitmapinfo|' +
        'swf_getfontinfo|swf_getframe|swf_labelframe|swf_lookat|swf_modifyobject|swf_mulcolor|swf_nextid|swf_oncondition|swf_openfile|swf_ortho|' +
        'swf_ortho2|swf_perspective|swf_placeobject|swf_polarview|swf_popmatrix|swf_posround|swf_pushmatrix|swf_removeobject|swf_rotate|' +
        'swf_scale|swf_setfont|swf_setframe|swf_shapearc|swf_shapecurveto|swf_shapecurveto3|swf_shapefillbitmapclip|swf_shapefillbitmaptile|' +
        'swf_shapefilloff|swf_shapefillsolid|swf_shapelinesolid|swf_shapelineto|swf_shapemoveto|swf_showframe|swf_startbutton|swf_startdoaction|' +
        'swf_startshape|swf_startsymbol|swf_textwidth|swf_translate|swf_viewport|swfaction|swfbitmap|swfbutton|swfbutton_keypress|' +
        'swfdisplayitem|swffill|swffont|swfgradient|swfmorph|swfmovie|swfshape|swfsprite|swftext|swftextfield|sybase_affected_rows|sybase_close|' +
        'sybase_connect|sybase_data_seek|sybase_deadlock_retry_count|sybase_fetch_array|sybase_fetch_assoc|sybase_fetch_field|sybase_fetch_object|' +
        'sybase_fetch_row|sybase_field_seek|sybase_free_result|sybase_get_last_message|sybase_min_client_severity|sybase_min_error_severity|' +
        'sybase_min_message_severity|sybase_min_server_severity|sybase_num_fields|sybase_num_rows|sybase_pconnect|sybase_query|sybase_result|' +
        'sybase_select_db|sybase_set_message_handler|sybase_unbuffered_query|symlink|syslog|system|tan|tanh|tcpwrap_check|tempnam|textdomain|' +
        'tidy_access_count|tidy_clean_repair|tidy_config_count|tidy_diagnose|tidy_error_count|tidy_get_body|tidy_get_config|tidy_get_error_buffer|' +
        'tidy_get_head|tidy_get_html|tidy_get_html_ver|tidy_get_output|tidy_get_release|tidy_get_root|tidy_get_status|tidy_getopt|tidy_is_xhtml|' +
        'tidy_is_xml|tidy_load_config|tidy_parse_file|tidy_parse_string|tidy_repair_file|tidy_repair_string|tidy_reset_config|tidy_save_config|' +
        'tidy_set_encoding|tidy_setopt|tidy_warning_count|time|tmpfile|token_get_all|token_name|touch|trigger_error|trim|uasort|ucfirst|ucwords|' +
        'udm_add_search_limit|udm_alloc_agent|udm_alloc_agent_array|udm_api_version|udm_cat_list|udm_cat_path|udm_check_charset|udm_check_stored|' +
        'udm_clear_search_limits|udm_close_stored|udm_crc32|udm_errno|udm_error|udm_find|udm_free_agent|udm_free_ispell_data|udm_free_res|' +
        'udm_get_doc_count|udm_get_res_field|udm_get_res_param|udm_hash32|udm_load_ispell_data|udm_open_stored|udm_set_agent_param|uksort|umask|' +
        'uniqid|unixtojd|unlink|unpack|unregister_tick_function|unserialize|unset|urldecode|urlencode|user_error|usleep|usort|utf8_decode|' +
        'utf8_encode|var_dump|var_export|variant|version_compare|virtual|vpopmail_add_alias_domain|vpopmail_add_alias_domain_ex|' +
        'vpopmail_add_domain|vpopmail_add_domain_ex|vpopmail_add_user|vpopmail_alias_add|vpopmail_alias_del|vpopmail_alias_del_domain|' +
        'vpopmail_alias_get|vpopmail_alias_get_all|vpopmail_auth_user|vpopmail_del_domain|vpopmail_del_domain_ex|vpopmail_del_user|' +
        'vpopmail_error|vpopmail_passwd|vpopmail_set_user_quota|vprintf|vsprintf|w32api_deftype|w32api_init_dtype|w32api_invoke_function|' +
        'w32api_register_function|w32api_set_call_method|wddx_add_vars|wddx_deserialize|wddx_packet_end|wddx_packet_start|wddx_serialize_value|' +
        'wddx_serialize_vars|wordwrap|xdiff_file_diff|xdiff_file_diff_binary|xdiff_file_merge3|xdiff_file_patch|xdiff_file_patch_binary|' +
        'xdiff_string_diff|xdiff_string_diff_binary|xdiff_string_merge3|xdiff_string_patch|xdiff_string_patch_binary|xml_error_string|' +
        'xml_get_current_byte_index|xml_get_current_column_number|xml_get_current_line_number|xml_get_error_code|xml_parse|xml_parse_into_struct|' +
        'xml_parser_create|xml_parser_create_ns|xml_parser_free|xml_parser_get_option|xml_parser_set_option|xml_set_character_data_handler|' +
        'xml_set_default_handler|xml_set_element_handler|xml_set_end_namespace_decl_handler|xml_set_external_entity_ref_handler|' +
        'xml_set_notation_decl_handler|xml_set_object|xml_set_processing_instruction_handler|xml_set_start_namespace_decl_handler|' +
        'xml_set_unparsed_entity_decl_handler|xmlrpc_decode|xmlrpc_decode_request|xmlrpc_encode|xmlrpc_encode_request|xmlrpc_get_type|' +
        'xmlrpc_parse_method_descriptions|xmlrpc_server_add_introspection_data|xmlrpc_server_call_method|xmlrpc_server_create|' +
        'xmlrpc_server_destroy|xmlrpc_server_register_introspection_callback|xmlrpc_server_register_method|xmlrpc_set_type|xpath_eval|' +
        'xpath_eval_expression|xpath_new_context|xptr_eval|xptr_new_context|xsl_xsltprocessor_get_parameter|xsl_xsltprocessor_has_exslt_support|' +
        'xsl_xsltprocessor_import_stylesheet|xsl_xsltprocessor_register_php_functions|xsl_xsltprocessor_remove_parameter|' +
        'xsl_xsltprocessor_set_parameter|xsl_xsltprocessor_transform_to_doc|xsl_xsltprocessor_transform_to_uri|xsl_xsltprocessor_transform_to_xml|' +
        'xslt_create|xslt_errno|xslt_error|xslt_free|xslt_process|xslt_set_base|xslt_set_encoding|xslt_set_error_handler|xslt_set_log|' +
        'xslt_set_sax_handler|xslt_set_sax_handlers|xslt_set_scheme_handler|xslt_set_scheme_handlers|yaz_addinfo|yaz_ccl_conf|yaz_ccl_parse|' +
        'yaz_close|yaz_connect|yaz_database|yaz_element|yaz_errno|yaz_error|yaz_es_result|yaz_get_option|yaz_hits|yaz_itemorder|yaz_present|' +
        'yaz_range|yaz_record|yaz_scan|yaz_scan_result|yaz_schema|yaz_search|yaz_set_option|yaz_sort|yaz_syntax|yaz_wait|yp_all|yp_cat|' +
        'yp_err_string|yp_errno|yp_first|yp_get_default_domain|yp_master|yp_match|yp_next|yp_order|zend_logo_guid|zend_version|zip_close|' +
        'zip_entry_close|zip_entry_compressedsize|zip_entry_compressionmethod|zip_entry_filesize|zip_entry_name|zip_entry_open|zip_entry_read|' +
        'zip_open|zip_read|zlib_get_coding_type').split('|')
	);
	
    var keywords = lang.arrayToMap(
        ('abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|' +
        'else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|final|for|foreach|function|' +
        'include|include_once|global|goto|if|implements|interface|instanceof|namespace|new|old_function|or|' +
        'private|protected|public|return|require|require_once|static|switch|throw|try|use|var|while|xor').split('|')
    );

    var builtinConstants = lang.arrayToMap(
        ('true|false|null|__FILE__|__LINE__|__METHOD__|__FUNCTION__|__CLASS__').split('|')
    );

    var builtinVariables = lang.arrayToMap(
        ('$GLOBALS|$_SERVER|$_GET|$_POST|$_FILES|$_REQUEST|$_SESSION|$_ENV|$_COOKIE|$php_errormsg|$HTTP_RAW_POST_DATA|' +
        '$http_response_header|$argc|$argv').split('|')
    );

    var futureReserved = lang.arrayToMap([]);

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "support", // php open tag
                regex : "<\\?(?:php|\\=)"
            },
            {
                token : "support", // php close tag
                regex : "\\?>"
            },
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            {
               token : "comment",
               regex : "#.*$"
            },
            docComment.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "constant.language", // constants
                regex : "\\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|" +
                        "ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|" +
                        "HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|" +
                        "L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|" +
                        "VERSION))|__COMPILER_HALT_OFFSET__)\\b"
            }, {
                token : "constant.language", // constants
                regex : "\\b(?:A(?:B(?:DAY_(?:1|2|3|4|5|6|7)|MON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9))|LT_DIGITS|M_STR|" +
                        "SSERT_(?:ACTIVE|BAIL|CALLBACK|QUIET_EVAL|WARNING))|C(?:ASE_(?:LOWER|UPPER)|HAR_MAX|" +
                        "O(?:DESET|NNECTION_(?:ABORTED|NORMAL|TIMEOUT)|UNT_(?:NORMAL|RECURSIVE))|" +
                        "R(?:EDITS_(?:ALL|DOCS|FULLPAGE|G(?:ENERAL|ROUP)|MODULES|QA|SAPI)|NCYSTR|" +
                        "YPT_(?:BLOWFISH|EXT_DES|MD5|S(?:ALT_LENGTH|TD_DES)))|URRENCY_SYMBOL)|D(?:AY_(?:1|2|3|4|5|6|7)|" +
                        "ECIMAL_POINT|IRECTORY_SEPARATOR|_(?:FMT|T_FMT))|E(?:NT_(?:COMPAT|NOQUOTES|QUOTES)|RA(?:_(?:D_(?:FMT|T_FMT)|" +
                        "T_FMT|YEAR)|)|XTR_(?:IF_EXISTS|OVERWRITE|PREFIX_(?:ALL|I(?:F_EXISTS|NVALID)|SAME)|SKIP))|FRAC_DIGITS|GROUPING|" +
                        "HTML_(?:ENTITIES|SPECIALCHARS)|IN(?:FO_(?:ALL|C(?:ONFIGURATION|REDITS)|ENVIRONMENT|GENERAL|LICENSE|MODULES|VARIABLES)|" +
                        "I_(?:ALL|PERDIR|SYSTEM|USER)|T_(?:CURR_SYMBOL|FRAC_DIGITS))|L(?:C_(?:ALL|C(?:OLLATE|TYPE)|M(?:ESSAGES|ONETARY)|NUMERIC|TIME)|" +
                        "O(?:CK_(?:EX|NB|SH|UN)|G_(?:A(?:LERT|UTH(?:PRIV|))|C(?:ONS|R(?:IT|ON))|D(?:AEMON|EBUG)|E(?:MERG|RR)|INFO|KERN|" +
                        "L(?:OCAL(?:0|1|2|3|4|5|6|7)|PR)|MAIL|N(?:DELAY|EWS|O(?:TICE|WAIT))|ODELAY|P(?:ERROR|ID)|SYSLOG|U(?:SER|UCP)|WARNING)))|" +
                        "M(?:ON_(?:1(?:0|1|2|)|2|3|4|5|6|7|8|9|DECIMAL_POINT|GROUPING|THOUSANDS_SEP)|_(?:1_PI|2_(?:PI|SQRTPI)|E|L(?:N(?:10|2)|" +
                        "OG(?:10E|2E))|PI(?:_(?:2|4)|)|SQRT(?:1_2|2)))|N(?:EGATIVE_SIGN|O(?:EXPR|STR)|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|" +
                        "P(?:ATH(?:INFO_(?:BASENAME|DIRNAME|EXTENSION)|_SEPARATOR)|M_STR|OSITIVE_SIGN|_(?:CS_PRECEDES|S(?:EP_BY_SPACE|IGN_POSN)))|" +
                        "RADIXCHAR|S(?:EEK_(?:CUR|END|SET)|ORT_(?:ASC|DESC|NUMERIC|REGULAR|STRING)|TR_PAD_(?:BOTH|LEFT|RIGHT))|" +
                        "T(?:HOUS(?:ANDS_SEP|EP)|_FMT(?:_AMPM|))|YES(?:EXPR|STR)|STD(?:IN|OUT|ERR))\\b"
            }, {
                token : function(value) {
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (futureReserved.hasOwnProperty(value))
                        return "invalid.illegal";
                    else if (builtinFunctions.hasOwnProperty(value))
                        return "support.function";
                    else if (value == "debugger")
                        return "invalid.deprecated";
                    else
                        if(value.match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|self|parent)$/))
                            return "variable";
                        return "identifier";
                },
                // TODO: Unicode escape sequences
                // TODO: Unicode identifiers
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(PhpHighlightRules, TextHighlightRules);

exports.PhpHighlightRules = PhpHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/java'), ['pilot/oop','ace/mode/javascript','ace/tokenizer','ace/mode/java_highlight_rules','ace/mode/matching_brace_outdent'], function (require, exports, module) {


var oop = require("pilot/oop");
var JavaScriptMode = require("ace/mode/javascript").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var JavaHighlightRules = require("ace/mode/java_highlight_rules").JavaHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new JavaHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/java_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var JavaHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    // taken from http://download.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
    var keywords = lang.arrayToMap(
	("abstract|continue|for|new|switch|" +
	"assert|default|goto|package|synchronized|" +
	"boolean|do|if|private|this|" +
	"break|double|implements|protected|throw|" +
	"byte|else|import|public|throws|" +
	"case|enum|instanceof|return|transient|" +
	"catch|extends|int|short|try|" +
	"char|final|interface|static|void|" +
	"class|finally|long|strictfp|volatile|" +
	"const|float|native|super|while").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("null|Infinity|NaN|undefined").split("|")
    );

    var langClasses = lang.arrayToMap(
        ("AbstractMethodError|AssertionError|ClassCircularityError|"+
        "ClassFormatError|Deprecated|EnumConstantNotPresentException|"+
        "ExceptionInInitializerError|IllegalAccessError|"+
        "IllegalThreadStateException|InstantiationError|InternalError|"+
        "NegativeArraySizeException|NoSuchFieldError|Override|Process|"+
        "ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|"+
        "SuppressWarnings|TypeNotPresentException|UnknownError|"+
        "UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|"+
        "InstantiationException|IndexOutOfBoundsException|"+
        "ArrayIndexOutOfBoundsException|CloneNotSupportedException|"+
        "NoSuchFieldException|IllegalArgumentException|NumberFormatException|"+
        "SecurityException|Void|InheritableThreadLocal|IllegalStateException|"+
        "InterruptedException|NoSuchMethodException|IllegalAccessException|"+
        "UnsupportedOperationException|Enum|StrictMath|Package|Compiler|"+
        "Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|"+
        "NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|"+
        "NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|"+
        "Character|Boolean|StackTraceElement|Appendable|StringBuffer|"+
        "Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|"+
        "StackOverflowError|OutOfMemoryError|VirtualMachineError|"+
        "ArrayStoreException|ClassCastException|LinkageError|"+
        "NoClassDefFoundError|ClassNotFoundException|RuntimeException|"+
        "Exception|ThreadDeath|Error|Throwable|System|ClassLoader|"+
        "Cloneable|Class|CharSequence|Comparable|String|Object").split("|")
    );
    
    var importClasses = lang.arrayToMap(
        ("").split("|")
    );
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
	        {
	            token : "comment",
	            regex : "\\/\\/.*$"
	        },
	        docComment.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
	            token : "comment", // multi line comment
	            regex : "\\/\\*\\*",
	            next : "comment"
	        }, {
	            token : "string.regexp",
	            regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
	        }, {
	            token : "string", // single line
	            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
	        }, {
	            token : "string", // single line
	            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
	        }, {
	            token : "constant.numeric", // hex
	            regex : "0[xX][0-9a-fA-F]+\\b"
	        }, {
	            token : "constant.numeric", // float
	            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
	        }, {
	            token : "constant.language.boolean",
	            regex : "(?:true|false)\\b"
	        }, {
	            token : function(value) {
	                if (value == "this")
	                    return "variable.language";
	                else if (keywords.hasOwnProperty(value))
	                    return "keyword";
                    else if (langClasses.hasOwnProperty(value))
                        return "support.function";
                    else if (importClasses.hasOwnProperty(value))
                        return "support.function";
	                else if (buildinConstants.hasOwnProperty(value))
	                    return "constant.language";
	                else
	                    return "identifier";
	            },
	            // TODO: Unicode escape sequences
	            // TODO: Unicode identifiers
	            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
	        }, {
	            token : "keyword.operator",
	            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
	        }, {
	            token : "lparen",
	            regex : "[[({]"
	        }, {
	            token : "rparen",
	            regex : "[\\])}]"
	        }, {
	            token : "text",
	            regex : "\\s+"
	        }
        ],
        "comment" : [
	        {
	            token : "comment", // closing comment
	            regex : ".*?\\*\\/",
	            next : "start"
	        }, {
	            token : "comment", // comment spanning whole line
	            regex : ".+"
	        }
        ],
        "qqstring" : [
            {
	            token : "string",
	            regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ],
        "qstring" : [
	        {
	            token : "string",
	            regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(JavaHighlightRules, TextHighlightRules);

exports.JavaHighlightRules = JavaHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/csharp'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/csharp_highlight_rules','ace/mode/matching_brace_outdent'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var CSharpHighlightRules = require("ace/mode/csharp_highlight_rules").CSharpHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new CSharpHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {
    
	  this.getNextLineIndent = function(state, line, tab) {
	      var indent = this.$getIndent(line);

	      var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
	      var tokens = tokenizedLine.tokens;
	      var endState = tokenizedLine.state;

	      if (tokens.length && tokens[tokens.length-1].type == "comment") {
	          return indent;
	      }
      
	      if (state == "start") {
	          var match = line.match(/^.*[\{\(\[]\s*$/);
	          if (match) {
	              indent += tab;
	          }
	      }

	      return indent;
	  };

	  this.checkOutdent = function(state, line, input) {
	      return this.$outdent.checkOutdent(line, input);
	  };

	  this.autoOutdent = function(state, doc, row) {
	      this.$outdent.autoOutdent(doc, row);
	  };


    this.createWorker = function(session) {
        return null;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/csharp_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var CSharpHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();
    var keywords = lang.arrayToMap(
	("abstract|event|new|struct|as|explicit|null|switch|base|extern|object|this|bool|false|operator|throw|break|finally|out|true|byte|fixed|override|try|case|float|params|typeof|catch|for|private|uint|char|foreach|protected|ulong|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|ushort|continue|in|return|using|decimal|int|sbyte|virtual|default|interface|sealed|volatile|delegate|internal|short|void|do|is|sizeof|while|double|lock|stackalloc|else|long|static|enum|namespace|string|var|dynamic").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("null|true|false").split("|")
    );


    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
	        {
	            token : "comment",
	            regex : "\\/\\/.*$"
	        },
	        docComment.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
	            token : "comment", // multi line comment
	            regex : "\\/\\*\\*",
	            next : "comment"
	        }, {
	            token : "string.regexp",
	            regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
	        }, {
	            token : "string", // single line
	            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
	        }, {
	            token : "string", // single line
	            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
	        }, {
	            token : "constant.numeric", // hex
	            regex : "0[xX][0-9a-fA-F]+\\b"
	        }, {
	            token : "constant.numeric", // float
	            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
	        }, {
	            token : "constant.language.boolean",
	            regex : "(?:true|false)\\b"
	        }, {
	            token : function(value) {
	                if (value == "this")
	                    return "variable.language";
	                else if (keywords.hasOwnProperty(value))
	                    return "keyword";
	                else if (buildinConstants.hasOwnProperty(value))
	                    return "constant.language";
	                else
	                    return "identifier";
	            },
	            // TODO: Unicode escape sequences
	            // TODO: Unicode identifiers
	            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
	        }, {
	            token : "keyword.operator",
	            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
	        }, {
	            token : "lparen",
	            regex : "[[({]"
	        }, {
	            token : "rparen",
	            regex : "[\\])}]"
	        }, {
	            token : "text",
	            regex : "\\s+"
	        }
        ],
        "comment" : [
	        {
	            token : "comment", // closing comment
	            regex : ".*?\\*\\/",
	            next : "start"
	        }, {
	            token : "comment", // comment spanning whole line
	            regex : ".+"
	        }
        ],
        "qqstring" : [
            {
	            token : "string",
	            regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ],
        "qstring" : [
	        {
	            token : "string",
	            regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(CSharpHighlightRules, TextHighlightRules);

exports.CSharpHighlightRules = CSharpHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/ruby'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/ruby_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var RubyHighlightRules = require("ace/mode/ruby_highlight_rules").RubyHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new RubyHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }
        
        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/ruby_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var RubyHighlightRules = function() {

    var builtinFunctions = lang.arrayToMap(
        ("abort|Array|assert|assert_equal|assert_not_equal|assert_same|assert_not_same|" +
        "assert_nil|assert_not_nil|assert_match|assert_no_match|assert_in_delta|assert_throws|" + 
        "assert_raise|assert_nothing_raised|assert_instance_of|assert_kind_of|assert_respond_to|" +
        "assert_operator|assert_send|assert_difference|assert_no_difference|assert_recognizes|" +
        "assert_generates|assert_response|assert_redirected_to|assert_template|assert_select|" +
        "assert_select_email|assert_select_rjs|assert_select_encoded|css_select|at_exit|" +
        "attr|attr_writer|attr_reader|attr_accessor|attr_accessible|autoload|binding|block_given?|callcc|" +
        "caller|catch|chomp|chomp!|chop|chop!|defined?|delete_via_redirect|eval|exec|exit|" +
        "exit!|fail|Float|flunk|follow_redirect!|fork|form_for|form_tag|format|gets|global_variables|gsub|" +
        "gsub!|get_via_redirect|h|host!|https?|https!|include|Integer|lambda|link_to|" +
        "link_to_unless_current|link_to_function|link_to_remote|load|local_variables|loop|open|open_session|" +
        "p|print|printf|proc|putc|puts|post_via_redirect|put_via_redirect|raise|rand|" +
        "raw|readline|readlines|redirect?|request_via_redirect|require|scan|select|" +
        "set_trace_func|sleep|split|sprintf|srand|String|stylesheet_link_tag|syscall|system|sub|sub!|test|" +
        "throw|trace_var|trap|untrace_var|atan2|cos|exp|frexp|ldexp|log|log10|sin|sqrt|tan|" +
        "render|javascript_include_tag|csrf_meta_tag|label_tag|text_field_tag|submit_tag|check_box_tag|" +
        "content_tag|radio_button_tag|text_area_tag|password_field_tag|hidden_field_tag|" +
        "fields_for|select_tag|options_for_select|options_from_collection_for_select|collection_select|" +
        "time_zone_select|select_date|select_time|select_datetime|date_select|time_select|datetime_select|" +
        "select_year|select_month|select_day|select_hour|select_minute|select_second|file_field_tag|" +
        "file_field|respond_to|skip_before_filter|around_filter|after_filter|verify|" +
        "protect_from_forgery|rescue_from|helper_method|redirect_to|before_filter|" +
        "send_data|send_file|validates_presence_of|validates_uniqueness_of|validates_length_of|" +
        "validates_format_of|validates_acceptance_of|validates_associated|validates_exclusion_of|" +
        "validates_inclusion_of|validates_numericality_of|validates_with|validates_each|" +
        "authenticate_or_request_with_http_basic|authenticate_or_request_with_http_digest|" +
        "filter_parameter_logging|match|get|post|resources|redirect|scope|assert_routing|" +
        "translate|localize|extract_locale_from_tld|t|l|caches_page|expire_page|caches_action|expire_action|" +
        "cache|expire_fragment|expire_cache_for|observe|cache_sweeper|" +
        "has_many|has_one|belongs_to|has_and_belongs_to_many").split("|")
    );

    var keywords = lang.arrayToMap(
        ("alias|and|BEGIN|begin|break|case|class|def|defined|do|else|elsif|END|end|ensure|" +
        "__FILE__|finally|for|gem|if|in|__LINE__|module|next|not|or|private|protected|public|" + 
        "redo|rescue|retry|return|super|then|undef|unless|until|when|while|yield").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("true|TRUE|false|FALSE|nil|NIL|ARGF|ARGV|DATA|ENV|RUBY_PLATFORM|RUBY_RELEASE_DATE|" +
        "RUBY_VERSION|STDERR|STDIN|STDOUT|TOPLEVEL_BINDING").split("|")
    );

    var builtinVariables = lang.arrayToMap(
        ("\$DEBUG|\$defout|\$FILENAME|\$LOAD_PATH|\$SAFE|\$stdin|\$stdout|\$stderr|\$VERBOSE|" +
        "$!|root_url|flash|session|cookies|params|request|response|logger").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
	        {
	            token : "comment",
	            regex : "#.*$"
	        }, {
                token : "comment", // multi line comment
                regex : "^\=begin$",
                next : "comment"
            }, {
	            token : "string.regexp",
	            regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
	        }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
	        }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
	        }, {
                token : "string", // backtick string
                regex : "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
	        }, {
                token : "variable.instancce", // instance variable
                regex : "@{1,2}(?:[a-zA-Z_]|\d)+"
	        }, {
                token : "variable.class", // class name
                regex : "[A-Z](?:[a-zA-Z_]|\d)+"
	        }, {
                token : "string", // symbol
                regex : "[:](?:[a-zA-Z]|\d)+"
	        }, {
	            token : "constant.numeric", // hex
	            regex : "0[xX][0-9a-fA-F]+\\b"
	        }, {
	            token : "constant.numeric", // float
	            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
	        }, {
	            token : "constant.language.boolean",
	            regex : "(?:true|false)\\b"
	        }, {
	            token : function(value) {
	                if (value == "self")
	                    return "variable.language";
	                else if (keywords.hasOwnProperty(value))
	                    return "keyword";
	                else if (buildinConstants.hasOwnProperty(value))
	                    return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (builtinFunctions.hasOwnProperty(value))
                        return "support.function";
	                else if (value == "debugger")
	                    return "invalid.deprecated";
	                else
	                    return "identifier";
	            },
	            // TODO: Unicode escape sequences
	            // TODO: Unicode identifiers
	            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
	        }, {
	            token : "keyword.operator",
	            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
	        }, {
	            token : "lparen",
	            regex : "[[({]"
	        }, {
	            token : "rparen",
	            regex : "[\\])}]"
	        }, {
	            token : "text",
	            regex : "\\s+"
	        }
        ],
        "comment" : [
	        {
                token : "comment", // closing comment
                regex : "^\=end$",
                next : "start"
            }, {
	            token : "comment", // comment spanning whole line
	            regex : ".+"
	        }
        ]
    };
};

oop.inherits(RubyHighlightRules, TextHighlightRules);

exports.RubyHighlightRules = RubyHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/c_cpp'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/c_cpp_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var c_cppHighlightRules = require("ace/mode/c_cpp_highlight_rules").c_cppHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new c_cppHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)\/\//;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "//");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc-start") {
            if (endState == "start") {
                return "";
            }
            var match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/c_cpp_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/doc_comment_highlight_rules','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var DocCommentHighlightRules = require("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var c_cppHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    var keywords = lang.arrayToMap(
        ("and|double|not_eq|throw|and_eq|dynamic_cast|operator|true|" +
        "asm|else|or|try|auto|enum|or_eq|typedef|bitand|explicit|private|" +
        "typeid|bitor|extern|protected|typename|bool|false|public|union|" +
        "break|float|register|unsigned|case|fro|reinterpret-cast|using|catch|" +
        "friend|return|virtual|char|goto|short|void|class|if|signed|volatile|" +
        "compl|inline|sizeof|wchar_t|const|int|static|while|const-cast|long|" +
        "static_cast|xor|continue|mutable|struct|xor_eq|default|namespace|" +
        "switch|delete|new|template|do|not|this|for").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("NULL").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
	        {
	            token : "comment",
	            regex : "\\/\\/.*$"
	        },
	        docComment.getStartRule("doc-start"),
	        {
	            token : "comment", // multi line comment
	            regex : "\\/\\*",
	            next : "comment"
	        }, {
	            token : "string", // single line
	            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
	        }, {
	            token : "string", // multi line string start
	            regex : '["].*\\\\$',
	            next : "qqstring"
	        }, {
	            token : "string", // single line
	            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
	        }, {
	            token : "string", // multi line string start
	            regex : "['].*\\\\$",
	            next : "qstring"
	        }, {
	            token : "constant.numeric", // hex
	            regex : "0[xX][0-9a-fA-F]+\\b"
	        }, {
	            token : "constant.numeric", // float
	            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
	        }, {
              token : "constant", // <CONSTANT>
              regex : "<[a-zA-Z0-9.]+>"
	        }, {
              token : "keyword", // pre-compiler directivs
              regex : "(?:#include|#pragma|#line|#define|#undef|#ifdef|#else|#elif|#endif|#ifndef)"
          }, {
	            token : function(value) {
	                if (value == "this")
	                    return "variable.language";
	                else if (keywords.hasOwnProperty(value))
	                    return "keyword";
	                else if (buildinConstants.hasOwnProperty(value))
	                    return "constant.language";
	                else
	                    return "identifier";
	            },
	            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
	        }, {
	            token : "keyword.operator",
	            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)"
	        }, {
	            token : "lparen",
	            regex : "[[({]"
	        }, {
	            token : "rparen",
	            regex : "[\\])}]"
	        }, {
	            token : "text",
	            regex : "\\s+"
	        }
        ],
        "comment" : [
	        {
	            token : "comment", // closing comment
	            regex : ".*?\\*\\/",
	            next : "start"
	        }, {
	            token : "comment", // comment spanning whole line
	            regex : ".+"
	        }
        ],
        "qqstring" : [
            {
	            token : "string",
	            regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ],
        "qstring" : [
	        {
	            token : "string",
	            regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
	            next : "start"
	        }, {
	            token : "string",
	            regex : '.+'
	        }
        ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(c_cppHighlightRules, TextHighlightRules);

exports.c_cppHighlightRules = c_cppHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/coffee'), ['ace/tokenizer','ace/mode/coffee_highlight_rules','ace/mode/matching_brace_outdent','ace/range','ace/mode/text','pilot/oop'], function (require, exports, module) {


var Tokenizer = require("ace/tokenizer").Tokenizer;
var Rules     = require("ace/mode/coffee_highlight_rules").CoffeeHighlightRules;
var Outdent   = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range     = require("ace/range").Range;
var TextMode  = require("ace/mode/text").Mode;
var oop       = require("pilot/oop")

function CoffeeMode() {
    this.$tokenizer = new Tokenizer(new Rules().getRules());
    this.$outdent   = new Outdent();
};

oop.inherits(CoffeeMode, TextMode);

var proto = CoffeeMode.prototype;
var indenter = /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/;
var commentLine = /^(\s*)#/;
var hereComment = /^\s*###(?!#)/;
var indentation = /^\s*/;

proto.getNextLineIndent = function(state, line, tab) {
    var indent = this.$getIndent(line);
    var tokens = this.$tokenizer.getLineTokens(line, state).tokens;

    if (!(tokens.length && tokens[tokens.length - 1].type === 'comment') &&
        state === 'start' && indenter.test(line))
        indent += tab;
    return indent;
};

proto.toggleCommentLines = function(state, doc, startRow, endRow){
    console.log("toggle");
    var range = new Range(0, 0, 0, 0);
    for (var i = startRow; i <= endRow; ++i) {
        var line = doc.getLine(i);
        if (hereComment.test(line))
            continue;
            
        if (commentLine.test(line))
            line = line.replace(commentLine, '$1');
        else
            line = line.replace(indentation, '$&#');

        range.end.row = range.start.row = i;
        range.end.column = line.length + 1;
        doc.replace(range, line);
    }
};

proto.checkOutdent = function(state, line, input) {
    return this.$outdent.checkOutdent(line, input);
};

proto.autoOutdent = function(state, doc, row) {
    this.$outdent.autoOutdent(doc, row);
};

exports.Mode = CoffeeMode;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/coffee_highlight_rules'), ['pilot/oop','ace/mode/text_highlight_rules'], function (require, exports, module) {


require("pilot/oop").inherits(
  CoffeeHighlightRules,
  require("ace/mode/text_highlight_rules").TextHighlightRules);

function CoffeeHighlightRules() {
var identifier = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*"
  , keywordend = "(?![$\\w]|\\s*:)"
  , stringfill = {token: "string", regex: ".+"}
;
this.$rules =
  { start:
    [ { token: "identifier"
      , regex: "(?:@|(?:\\.|::)\\s*)" + identifier
      }
    , { token: "keyword"
      , regex: "(?:t(?:h(?:is|row|en)|ry|ypeof)|s(?:uper|witch)|return|b(?:reak|y)|c(?:ontinue|atch|lass)|i(?:n(?:stanceof)?|s(?:nt)?|f)|e(?:lse|xtends)|f(?:or (?:own)?|inally|unction)|wh(?:ile|en)|n(?:ew|ot?)|d(?:e(?:lete|bugger)|o)|loop|o(?:ff?|[rn])|un(?:less|til)|and|yes)" + keywordend
      }
    , { token: "constant.language"
      , regex: "(?:true|false|null|undefined)" + keywordend
      }
    , { token: "invalid.illegal"
      , regex: "(?:c(?:ase|onst)|default|function|v(?:ar|oid)|with|e(?:num|xport)|i(?:mplements|nterface)|let|p(?:ackage|r(?:ivate|otected)|ublic)|static|yield|__(?:hasProp|extends|slice|bind|indexOf))" + keywordend
      }
    , { token: "language.support.class"
      , regex: "(?:Array|Boolean|Date|Function|Number|Object|R(?:e(?:gExp|ferenceError)|angeError)|S(?:tring|yntaxError)|E(?:rror|valError)|TypeError|URIError)" + keywordend
      }
    , { token: "language.support.function"
      , regex: "(?:Math|JSON|is(?:NaN|Finite)|parse(?:Int|Float)|encodeURI(?:Component)?|decodeURI(?:Component)?)" + keywordend
      }
    , { token: "identifier"
      , regex: identifier
      }
    , { token: "constant.numeric"
      , regex: "(?:0x[\\da-fA-F]+|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?)"
      }
    , { token: "string"
      , regex: "'''"
      , next : "qdoc"
      }
    , { token: "string"
      , regex: '"""'
      , next : "qqdoc"
      }
    , { token: "string"
      , regex: "'"
      , next : "qstring"
      }
    , { token: "string"
      , regex: '"'
      , next : "qqstring"
      }
    , { token: "string"
      , regex: "`"
      , next : "js"
      }
    , { token: "string.regex"
      , regex: "///"
      , next : "heregex"
      }
    , { token: "string.regex"
      , regex: "/(?!\\s)[^[/\\n\\\\]*(?: (?:\\\\.|\\[[^\\]\\n\\\\]*(?:\\\\.[^\\]\\n\\\\]*)*\\])[^[/\\n\\\\]*)*/[imgy]{0,4}(?!\\w)"
      }
    , { token: "comment"
      , regex: "###(?!#)"
      , next : "comment"
      }
    , { token: "comment"
      , regex: "#.*"
      }
    , { token: "lparen"
      , regex: "[({[]"
      }
    , { token: "rparen"
      , regex: "[\\]})]"
      }
    , { token: "keyword.operator"
      , regex: "\\S+"
      }
    , { token: "text"
      , regex: "\\s+"
      }
    ]
  , qdoc:
    [ { token: "string"
      , regex: ".*?'''"
      , next : "start"
      }
    , stringfill
    ]
  , qqdoc:
    [ { token: "string"
      , regex: '.*?"""'
      , next : "start"
      }
    , stringfill
    ]
  , qstring:
    [ { token: "string"
      , regex: "[^\\\\']*(?:\\\\.[^\\\\']*)*'"
      , next : "start"
      }
    , stringfill
    ]
  , qqstring:
    [ { token: "string"
      , regex: '[^\\\\"]*(?:\\\\.[^\\\\"]*)*"'
      , next : "start"
      }
    , stringfill
    ]
  , js:
    [ { token: "string"
      , regex: "[^\\\\`]*(?:\\\\.[^\\\\`]*)*`"
      , next : "start"
      }
    , stringfill
    ]
  , heregex:
    [ { token: "string.regex"
      , regex: '.*?///[imgy]{0,4}'
      , next : "start"
      }
    , { token: "comment.regex"
      , regex: "\\s+(?:#.*)?"
      }
    , { token: "string.regex"
      , regex: "\\S+"
      }
    ]
  , comment:
    [ { token: "comment"
      , regex: '.*?###'
      , next : "start"
      }
    , { token: "comment"
      , regex: ".+"
      }
    ]
  };
}

exports.CoffeeHighlightRules = CoffeeHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/perl'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/perl_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var PerlHighlightRules = require("ace/mode/perl_highlight_rules").PerlHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new PerlHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/perl_highlight_rules'), ['pilot/oop','pilot/lang','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var PerlHighlightRules = function() {

    var keywords = lang.arrayToMap(
        ("base|constant|continue|else|elsif|for|foreach|format|goto|if|last|local|my|next|" +
         "no|package|parent|redo|require|scalar|sub|unless|until|while|use|vars").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("ARGV|ENV|INC|SIG").split("|")
    );

    var builtinFunctions = lang.arrayToMap(
        ("getprotobynumber|getprotobyname|getservbyname|gethostbyaddr|" +
         "gethostbyname|getservbyport|getnetbyaddr|getnetbyname|getsockname|" +
         "getpeername|setpriority|getprotoent|setprotoent|getpriority|" +
         "endprotoent|getservent|setservent|endservent|sethostent|socketpair|" +
         "getsockopt|gethostent|endhostent|setsockopt|setnetent|quotemeta|" +
         "localtime|prototype|getnetent|endnetent|rewinddir|wantarray|getpwuid|" +
         "closedir|getlogin|readlink|endgrent|getgrgid|getgrnam|shmwrite|" +
         "shutdown|readline|endpwent|setgrent|readpipe|formline|truncate|" +
         "dbmclose|syswrite|setpwent|getpwnam|getgrent|getpwent|ucfirst|sysread|" +
         "setpgrp|shmread|sysseek|sysopen|telldir|defined|opendir|connect|" +
         "lcfirst|getppid|binmode|syscall|sprintf|getpgrp|readdir|seekdir|" +
         "waitpid|reverse|unshift|symlink|dbmopen|semget|msgrcv|rename|listen|" +
         "chroot|msgsnd|shmctl|accept|unpack|exists|fileno|shmget|system|" +
         "unlink|printf|gmtime|msgctl|semctl|values|rindex|substr|splice|" +
         "length|msgget|select|socket|return|caller|delete|alarm|ioctl|index|" +
         "undef|lstat|times|srand|chown|fcntl|close|write|umask|rmdir|study|" +
         "sleep|chomp|untie|print|utime|mkdir|atan2|split|crypt|flock|chmod|" +
         "BEGIN|bless|chdir|semop|shift|reset|link|stat|chop|grep|fork|dump|" +
         "join|open|tell|pipe|exit|glob|warn|each|bind|sort|pack|eval|push|" +
         "keys|getc|kill|seek|sqrt|send|wait|rand|tied|read|time|exec|recv|" +
         "eof|chr|int|ord|exp|pos|pop|sin|log|abs|oct|hex|tie|cos|vec|END|ref|" +
         "map|die|uc|lc|do").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "string.regexp",
                regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric", // hex
                regex : "0x[0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : function(value) {
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (buildinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (builtinFunctions.hasOwnProperty(value))
                        return "support.function";
                    else
                        return "identifier";
                },
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "\\.\\.\\.|\\|\\|=|>>=|<<=|<=>|&&=|=>|!~|\\^=|&=|\\|=|\\.=|x=|%=|\\/=|\\*=|\\-=|\\+=|=~|\\*\\*|\\-\\-|\\.\\.|\\|\\||&&|\\+\\+|\\->|!=|==|>=|<=|>>|<<|,|=|\\?\\:|\\^|\\||x|%|\\/|\\*|<|&|\\\\|~|!|>|\\.|\\-|\\+|\\-C|\\-b|\\-S|\\-u|\\-t|\\-p|\\-l|\\-d|\\-f|\\-g|\\-s|\\-z|\\-k|\\-e|\\-O|\\-T|\\-B|\\-M|\\-A|\\-X|\\-W|\\-c|\\-R|\\-o|\\-x|\\-w|\\-r|\\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ]
    };
};

oop.inherits(PerlHighlightRules, TextHighlightRules);

exports.PerlHighlightRules = PerlHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/svg'), ['pilot/oop','ace/mode/text','ace/mode/javascript','ace/tokenizer','ace/mode/svg_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var XmlMode = require("ace/mode/text").Mode;
var JavaScriptMode = require("ace/mode/javascript").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var SvgHighlightRules = require("ace/mode/svg_highlight_rules").SvgHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new SvgHighlightRules().getRules());
    this.$js = new JavaScriptMode();
};

oop.inherits(Mode, XmlMode);

(function() {
    
    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        this.$delegate("toggleCommentLines", arguments, function() {
            return 0;
        });
    };

    this.getNextLineIndent = function(state, line, tab) {
        var self = this;
        return this.$delegate("getNextLineIndent", arguments, function() {
            return self.$getIndent(line);
        });
    };

    this.checkOutdent = function(state, line, input) {
        return this.$delegate("checkOutdent", arguments, function() {
            return false;
        });
    };

    this.autoOutdent = function(state, doc, row) {
        this.$delegate("autoOutdent", arguments);
    };

    this.$delegate = function(method, args, defaultHandler) {
        var state = args[0];
        var split = state.split("js-");

        if (!split[0] && split[1]) {
            args[0] = split[1];
            return this.$js[method].apply(this.$js, args);
        }

        return defaultHandler ? defaultHandler() : undefined;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/svg_highlight_rules'), ['pilot/oop','ace/mode/javascript_highlight_rules','ace/mode/xml_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var JavaScriptHighlightRules = require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
var XmlHighlightRules = require("ace/mode/xml_highlight_rules").XmlHighlightRules;

var SvgHighlightRules = function() {
    XmlHighlightRules.call(this);

    this.$rules.start.splice(3, 0, {
        token : "text",
        regex : "<(?=\s*script)",
        next : "script"
    });
    this.$rules.script = [{
        token : "text",
        regex : ">",
        next : "js-start"
    }, {
        token : "keyword",
        regex : "[-_a-zA-Z0-9:]+"
    }, {
        token : "text",
        regex : "\\s+"
    }, {
        token : "string",
        regex : '".*?"'
    }, {
        token : "string",
        regex : "'.*?'"
    }];    

    var jsRules = new JavaScriptHighlightRules().getRules();
    this.addRules(jsRules, "js-");
    this.$rules["js-start"].unshift({
        token: "comment",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "text",
        regex: "<\\/(?=script)",
        next: "tag"
    });

};

oop.inherits(SvgHighlightRules, XmlHighlightRules);

exports.SvgHighlightRules = SvgHighlightRules;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/textile'), ['pilot/oop','ace/mode/text','ace/tokenizer','ace/mode/textile_highlight_rules','ace/mode/matching_brace_outdent','ace/range'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var TextileHighlightRules = require("ace/mode/textile_highlight_rules").TextileHighlightRules;
var MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
var Range = require("ace/range").Range;

var Mode = function()
{
    this.$tokenizer = new Tokenizer(new TextileHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function()
{
    this.getNextLineIndent = function(state, line, tab)
    {
        if (state == "intag")
            return tab;
        
        return "";
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
    
}).call(Mode.prototype);

exports.Mode = Mode;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/mode/textile_highlight_rules'), ['pilot/oop','ace/mode/text_highlight_rules'], function (require, exports, module) {


var oop = require("pilot/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var TextileHighlightRules = function()
{
/*
    var phraseModifiers = lang.arrayToMap(
        ("_|*|__|**|??|-|+|^|%|@").split("|")
    );
    
    var blockModifiers = lang.arrayToMap(
        ("h1|h2|h3|h4|h5|h6|bq|p|bc|pre").split("|")
    );
    */
    /*
    var punctuation = lang.arrayToMap(
        ("-|--|(tm)|(r)|(c)").split("|")
    );
    */
    
    this.$rules = {
        "start" : [
            {
                token : "keyword", // start of block
                regex : "h1|h2|h3|h4|h5|h6|bq|p|bc|pre",
                next  : "blocktag"
            },
            {
                token : "keyword",
                regex : "[\\*]+|[#]+"
            },
            {
                token : "text",
                regex : ".+"
            }
        ],
        "blocktag" : [
            {
                token : "keyword",
                regex : "\\. ",
                next  : "start",
            },
            {
                token : "keyword",
                regex : "\\(",
                next  : "blocktagproperties"
            },
        ],
        "blocktagproperties" : [
            {
                token : "keyword",
                regex : "\\)",
                next  : "blocktag"
            },
            {
                token : "string",
                regex : "[a-zA-Z0-9\\-_]+"
            },
            {
                token : "keyword",
                regex : "#"
            },
        ]
    };
};

oop.inherits(TextileHighlightRules, TextHighlightRules);

exports.TextileHighlightRules = TextileHighlightRules;

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/keybinding/vim'), ['ace/keyboard/state_handler','ace/keyboard/state_handler'], function (require, exports, module) {


var StateHandler = require("ace/keyboard/state_handler").StateHandler;
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly;

var vimStates = {
    start: [
        {
            key:    "i",
            then:   "insertMode"
        },
        {
            regex:  [ "([0-9]*)", "(k|up)" ],
            exec:   "golineup",
            params: [
                {
                    name:     "times",
                    match:    1,
                    type:     "number",
                    defaultValue:     1
                }
            ]
        },
        {
            regex:  [ "([0-9]*)", "(j|down|enter)" ],
            exec:   "golinedown",
            params: [
                {
                    name:    "times",
                    match:   1,
                    type:    "number",
                    defaultValue:    1
                }
            ]
        },
        {
            regex:  [ "([0-9]*)", "(l|right)" ],
            exec:   "gotoright",
            params: [
                {
                    name:   "times",
                    match:  1,
                    type:   "number",
                    defaultValue:     1
                }
            ]
        },
        {
            regex:  [ "([0-9]*)", "(h|left)" ],
            exec:   "gotoleft",
            params: [
                {
                    name:     "times",
                    match:    1,
                    type:     "number",
                    defaultValue:     1
                }
            ]
        },
        {
            comment:    "Catch some keyboard input to stop it here",
            match:      matchCharacterOnly
        }
    ],
    insertMode: [
        {
            key:      "esc",
            then:     "start"
        }
    ]
};

exports.Vim = new StateHandler(vimStates);

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/state_handler'), [], function (require, exports, module) {


// If you're developing a new keymapping and want to get an idea what's going
// on, then enable debugging.
var DEBUG = false;

function StateHandler(keymapping) {
    this.keymapping = this.$buildKeymappingRegex(keymapping);
}

StateHandler.prototype = {
    /**
     * Build the RegExp from the keymapping as RegExp can't stored directly
     * in the metadata JSON and as the RegExp used to match the keys/buffer
     * need to be adapted.
     */
    $buildKeymappingRegex: function(keymapping) {
        for (state in keymapping) {
            this.$buildBindingsRegex(keymapping[state]);
        }
        return keymapping;
    },

    $buildBindingsRegex: function(bindings) {
        // Escape a given Regex string.
        bindings.forEach(function(binding) {
            if (binding.key) {
                binding.key = new RegExp('^' + binding.key + '$');
            } else if (Array.isArray(binding.regex)) {
                binding.key = new RegExp('^' + binding.regex[1] + '$');
                binding.regex = new RegExp(binding.regex.join('') + '$');
            } else if (binding.regex) {
                binding.regex = new RegExp(binding.regex + '$');
            }
        });
    },

    $composeBuffer: function(data, hashId, key) {
        // Initialize the data object.
        if (data.state == null || data.buffer == null) {
            data.state = "start";
            data.buffer = "";
        }

        var keyArray = [];
        if (hashId & 1) keyArray.push("ctrl");
        if (hashId & 8) keyArray.push("command");
        if (hashId & 2) keyArray.push("option");
        if (hashId & 4) keyArray.push("shift");
        if (key)        keyArray.push(key);

        var symbolicName = keyArray.join("-");
        var bufferToUse = data.buffer + symbolicName;

        // Don't add the symbolic name to the key buffer if the alt_ key is
        // part of the symbolic name. If it starts with alt_, this means
        // that the user hit an alt keycombo and there will be a single,
        // new character detected after this event, which then will be
        // added to the buffer (e.g. alt_j will result in ∆).
        //
        // We test for 2 and not for & 2 as we only want to exclude the case where
        // the option key is pressed alone.
        if (hashId != 2) {
            data.buffer = bufferToUse;
        }

        return {
            bufferToUse:    bufferToUse,
            symbolicName:   symbolicName
        };
    },

    $find: function(data, buffer, symbolicName, hashId, key) {
        // Holds the command to execute and the args if a command matched.
        var result = {};

        // Loop over all the bindings of the keymapp until a match is found.
        this.keymapping[data.state].some(function(binding) {
            var match;

            // Check if the key matches.
            if (binding.key && !binding.key.test(symbolicName)) {
                return false;
            }

            // Check if the regex matches.
            if (binding.regex && !(match = binding.regex.exec(buffer))) {
                return false;
            }

            // Check if the match function matches.
            if (binding.match && !binding.match(buffer, hashId, key, symbolicName)) {
                return false;
            }

            // Check for disallowed matches.
            if (binding.disallowMatches) {
                for (var i = 0; i < binding.disallowMatches.length; i++) {
                    if (!!match[binding.disallowMatches[i]]) {
                        return false;
                    }
                }
            }

            // If there is a command to execute, then figure out the
            // comand and the arguments.
            if (binding.exec) {
                result.command = binding.exec;

                // Bulid the arguments.
                if (binding.params) {
                    var value;
                    result.args = {};
                    binding.params.forEach(function(param) {
                        if (param.match != null && match != null) {
                            value = match[param.match] || param.defaultValue;
                        } else {
                            value = param.defaultValue;
                        }

                        if (param.type === 'number') {
                            value = parseInt(value);
                        }

                        result.args[param.name] = value;
                    });
                }
                data.buffer = "";
            }

            // Handle the 'then' property.
            if (binding.then) {
                data.state = binding.then;
                data.buffer = "";
            }

            // If no command is set, then execute the "null" fake command.
            if (result.command == null) {
                result.command = "null";
            }

            if (DEBUG) {
                console.log("KeyboardStateMapper#find", binding);
            }
            return true;
        });

        if (result.command) {
            return result;
        } else {
            data.buffer = "";
            return false;
        }
    },

    /**
     * This function is called by keyBinding.
     */
    handleKeyboard: function(data, hashId, key) {
        // If we pressed any command key but no other key, then ignore the input.
        // Otherwise "shift-" is added to the buffer, and later on "shift-g"
        // which results in "shift-shift-g" which doesn't make senese.
        if (hashId != 0 && (key == "" || String.fromCharCode(0))) {
            return null;
        }

        // Compute the current value of the keyboard input buffer.
        var r = this.$composeBuffer(data, hashId, key);
        var buffer = r.bufferToUse;
        var symbolicName = r.symbolicName;

        r = this.$find(data, buffer, symbolicName, hashId, key);
        if (DEBUG) {
            console.log("KeyboardStateMapper#match", buffer, symbolicName, r);
        }

        return r;
    }
}

/**
 * This is a useful matching function and therefore is defined here so that
 * users of KeyboardStateMapper can use it.
 *
 * @return boolean
 *          If no command key (Command|Option|Shift|Ctrl) is pressed, it
 *          returns true. If the only the Shift key is pressed + a character
 *          true is returned as well. Otherwise, false is returned.
 *          Summing up, the function returns true whenever the user typed
 *          a normal character on the keyboard and no shortcut.
 */
exports.matchCharacterOnly = function(buffer, hashId, key, symbolicName) {
    // If no command keys are pressed, then catch the input.
    if (hashId == 0) {
        return true;
    }
    // If only the shift key is pressed and a character key, then
    // catch that input as well.
    else if ((hashId == 4) && key.length == 1) {
        return true;
    }
    // Otherwise, we let the input got through.
    else {
        return false;
    }
};

exports.StateHandler = StateHandler;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/keybinding/emacs'), ['ace/keyboard/state_handler','ace/keyboard/state_handler'], function (require, exports, module) {


var StateHandler = require("ace/keyboard/state_handler").StateHandler;
var matchCharacterOnly =  require("ace/keyboard/state_handler").matchCharacterOnly;

var emacsState = {
    start: [
        {
            key:    "ctrl-x",
            then:   "c-x"
        },
        {
            regex:  [ "(?:command-([0-9]*))*", "(down|ctrl-n)" ],
            exec:   "golinedown",
            params: [
                {
                    name: "times",
                    match: 1,
                    type: "number",
                    defaultValue: 1
                }
            ]
        },
        {
            regex: [ "(?:command-([0-9]*))*", "(right|ctrl-f)" ],
            exec: "gotoright",
            params: [
                {
                    name: "times",
                    match: 1,
                    type: "number",
                    defaultValue: 1
                }
            ]
        },
        {
            regex: [ "(?:command-([0-9]*))*", "(up|ctrl-p)" ],
            exec: "golineup",
            params: [
                {
                    name: "times",
                    match: 1,
                    type: "number",
                    defaultValue: 1
                }
            ]
        },
        {
            regex: [ "(?:command-([0-9]*))*", "(left|ctrl-b)" ],
            exec: "gotoleft",
            params: [
                {
                    name: "times",
                    match: 1,
                    type: "number",
                    defaultValue: 1
                }
            ]
        },
        {
            comment: "This binding matches all printable characters except numbers as long as they are no numbers and print them n times.",
            regex:  [ "(?:command-([0-9]*))", "([^0-9]+)*" ],
            match:  matchCharacterOnly,
            exec:   "inserttext",
            params: [
                {
                    name: "times",
                    match: 1,
                    type: "number",
                    defaultValue: "1"
                },
                {
                    name: "text",
                    match: 2
                }
            ]
        },
        {
            comment: "This binding matches numbers as long as there is no meta_number in the buffer.",
            regex:  [ "(command-[0-9]*)*", "([0-9]+)" ],
            match:  matchCharacterOnly,
            disallowMatches:  [ 1 ],
            exec:   "inserttext",
            params: [
                {
                    name: "text",
                    match: 2,
                    type: "text"
                }
            ]
        },
        {
            regex: [ "command-([0-9]*)", "(command-[0-9]|[0-9])" ],
            comment: "Stops execution if the regex /meta_[0-9]+/ matches to avoid resetting the buffer."
        }
    ],
    "c-x": [
        {
            key: "ctrl-g",
            then: "start"
        },
        {
            key: "ctrl-s",
            exec: "save",
            then: "start"
        }
    ]
};

exports.Emacs = new StateHandler(emacsState);

});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/87749d9714f1925e26afa48a0d592eaa39403858@/lib/ace/keyboard/hash_handler'), ['pilot/keys'], function (require, exports, module) {


var keyUtil  = require("pilot/keys");

function HashHandler(config) {
    this.setConfig(config);
}

(function() {
    function splitSafe(s, separator, limit, bLowerCase) {
        return (bLowerCase && s.toLowerCase() || s)
            .replace(/(?:^\s+|\n|\s+$)/g, "")
            .split(new RegExp("[\\s ]*" + separator + "[\\s ]*", "g"), limit || 999);
    }

    function parseKeys(keys, val, ret) {
        var key,
            hashId = 0,
            parts  = splitSafe(keys, "\\-", null, true),
            i      = 0,
            l      = parts.length;

        for (; i < l; ++i) {
            if (keyUtil.KEY_MODS[parts[i]])
                hashId = hashId | keyUtil.KEY_MODS[parts[i]];
            else
                key = parts[i] || "-"; //when empty, the splitSafe removed a '-'
        }

        (ret[hashId] || (ret[hashId] = {}))[key] = val;
        return ret;
    }

    function objectReverse(obj, keySplit) {
        var i, j, l, key,
            ret = {};
        for (i in obj) {
            key = obj[i];
            if (keySplit && typeof key == "string") {
                key = key.split(keySplit);
                for (j = 0, l = key.length; j < l; ++j)
                    parseKeys.call(this, key[j], i, ret);
            }
            else {
                parseKeys.call(this, key, i, ret);
            }
        }
        return ret;
    }

    this.setConfig = function(config) {
        this.$config = config;
        if (typeof this.$config.reverse == "undefined")
            this.$config.reverse = objectReverse.call(this, this.$config, "|");
    };

    /**
     * This function is called by keyBinding.
     */
    this.handleKeyboard = function(data, hashId, textOrKey, keyCode) {
        // Figure out if a commandKey was pressed or just some text was insert.
        if (hashId != 0 || keyCode != 0) {
            return {
                command: (this.$config.reverse[hashId] || {})[textOrKey]
            }
        } else {
            return {
                command: "inserttext",
                args: {
                    text: textOrKey
                }
            }
        }
    }
}).call(HashHandler.prototype)

exports.HashHandler = HashHandler;
});
require.memoize(bravojs.realpath(bravojs.mainModuleDir + '/b339f0b799f23466a9fb3ac92af4cb7e572604a6@/package.json'), [], function() { return {"uid":"http://github.com/cadorn/ace-extjs/packages/ace-worker/","main":"worker.js","directories":{"lib":""},"mappings":{"ace":{"location":"" + bravojs.mainModuleDir + "/87749d9714f1925e26afa48a0d592eaa39403858"},"cockpit":{"location":"" + bravojs.mainModuleDir + "/b5bd9e5093176e86aa6f6c4d581342361d8c923f"},"pilot":{"location":"" + bravojs.mainModuleDir + "/f9a24d6931cb0c0e8264fed132a0ed8c97415c4c"}}}; });
(function() {
var env = {};
module.declare([{"_package-0":{"id":"a3d9ddf257e98144c883cd2dbc03ab62243dbc09"}}], function(require, exports, module) {
require('_package-0').main(env);
});
})();