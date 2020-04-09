/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * everything in core.js is necessary to perform any API functionality and should be rarely touched!
 */

(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.core = function(){};

    // Create a new Class that inherits from this class
    core.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function core() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        core.prototype = prototype;

        // Enforce the constructor to be what we expect
        core.prototype.constructor = core;

        // And make this class extendable
        core.extend = arguments.callee;

//        return core;
    };

    /**
     * ns creates a namespace
     * @param str - the namespace string
     */
    core.ns = function ns(str) {
        var splitStr = !str ? '' : str.split('.');
        var parent = window;

        for(idx in splitStr) {
            if(typeof parent[splitStr[idx]]=='undefined')   parent[splitStr[idx]] = {};
            parent = parent[splitStr[idx]];
        }

        return parent;
    }

    core.namespace = core.ns;

    /**
     * to some degree, many people confuse the difference between an object literal
     * and a class, so this is an accessor method to help bridge the gap for
     * developers
     * @param attribs - object literal (properties)
     */
    core.createClass = function (attribs) {
        attribs.constructor.prototype = attribs;
        return attribs.constructor;
    }

	/**
	 * Asynchronous Module Definition (AMD) loader -- very early versions.  This is the core functionality of this API set.
	 * 
	 * note: 
	 *	1. in 2014, Require.js and Angular.js became the more popular AMD loaders.  this code was in my private repo for many years, and now sharing with github community (April 2020)
	 *	2. ECMAScript has come up with a new standard which functions much like a traditional OOO language, where you can declare ('import') macros - probably better.
	 */
    core.loadJS = function(fileUrl, callback) {
        var fileExtension = fileUrl.substring(fileUrl.lastIndexOf(".")+1, fileUrl.length);

        if(fileExtension == 'js') {
            //CAUTION - there is significant differences in lazy loading between ' and "
            var dynamicSrc = document.createElement('script');
            dynamicSrc.setAttribute("src", fileUrl);
            dynamicSrc.setAttribute("type","text/javascript");

            //check to see if loaded, and once loaded, perform callback if available
            if(callback!=undefined) {
                if(dynamicSrc.readyState) {
                    dynamicSrc.onreadystatechange = function() {
                        if(dynamicSrc.readyState=='loaded' || dynamicSrc.readyState=='complete') {
                            dynamicSrc.onreadystatechange = null;
                            callback();
                        }
                    }
                } else {
                    dynamicSrc.onload = function() { callback(); };
                }
            }

            document.getElementsByTagName("head")[0].appendChild(dynamicSrc);
        }
    }

    //finally...
    return new core();
})();

//extend String properties
String.format = function(text) {
    if (arguments.length <= 1)
        return text;

    var tokenCount = arguments.length - 2;

    for(var token = 0; token <= tokenCount; token++)
        text = text.replace(new RegExp("\\{"+token+"\\}","gi"), arguments[token+1]);

    return text;
};

//EXPERIMENTAL: extend function (probably a bad idea?) - I am not comfortable prototyping key JS classes
/*
Function.prototype.inherit = function(parentClass) {
    if(parentClass.constructor==Function || typeof parentClass=='function') {
        this.prototype = new parentClass;
        this.prototype.constructor = this;
        this.prototype.parent = parentClass.prototype;
    }
    return this;
};
* -----------------------------------------------
* TODO:
*	- browser threading
* -----------------------------------------------
*/

/**
 * Initialize does everything for the API
 * 1.  download all javascript dynamically
 * 2.  should be loaded on body or div load
 * 3.  this class is a singleton
 */
core.namespace('viewer.globals');
viewer.globals.coreViewer = ( function() {
    var ViewerAttribs = core.createClass({
        jsLocation      :       '',
        mapObj          :       undefined,
        mapObjType      :       undefined,

        constructor: function() {},
    //NOTE - ALL javascript classes, other than the facade implementations, should be loaded here!
        _init: function() {
            core.loadJS(this.getJSLocation() + 'frmwk/logger.js');                       //load Logger class
            core.loadJS(this.getJSLocation() + 'frmwk/util.js');                         //load all consts, enums
            core.loadJS(this.getJSLocation() + 'frmwk/mapApi.js');                       //load map api
        },
        _resumeMapApiLoad: function() {
            /**
             * @deprecated - should now call map api from within callers and initiate through api global
             core.loadJS(this.getJSLocation() + 'frmwk/mapApi.js', function() {
             viewer.impl.MapAPI.init();
             });     //load MapAPI class
             */
            /**
             * once all the MapAPI classes have been loaded (including the appropriate facades,
             * then load the APIs dependent on MapAPI...
             */
            core.loadJS(this.getJSLocation() + 'api/functions.js');
            core.loadJS(this.getJSLocation() + 'api/events.js');
        },
    //NOTE - primary access to the framework.  pass in properties [jsLocation, mapObj]
        setArgs: function() {
            if(arguments.length > 0) {
                var args = arguments[0];                                //only really interested in 1st vals

                this.setJSLocation(args.jsLocation);
                this.mapObj = args.mapObj;
                this.mapObjType = mapType || 'undefined map type';

                this._init();                                           //initialize all JS files
            }
        },
        getJSLocation: function() {
            return this.jsLocation;
        },
        setJSLocation: function(path) {
            if(undefined==path)  return;

            var locTemp = path.toString();      //if not already a String
            if(locTemp.lastIndexOf('/') != locTemp.length)   locTemp += '/';

            this.jsLocation = locTemp;
            this._init();
        },
        getGlobalMapObj: function() {
            return this.mapObj;
        },
        getGlobalMapObjType: function() {
            return this.mapObjType;
        }
    });
    var instance = new ViewerAttribs();
    return instance;
} )();