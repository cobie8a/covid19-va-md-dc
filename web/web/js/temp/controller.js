/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * The Controller should have all control, for whereever the complete module set is deployed
 * since it is what's initiated first for each deployment
 */

core.ns('viewer.frmwk');

viewer.frmwk.Controller = (function(){
//PRIVATE (vars) =========================================================
    var log = viewer.frmwk.Logger.set('Controller');

    var location = '';              //relative locations of JS files to be loaded dynamically
    var viewerInstance = false;     //flag to set if this controller resides in viewer
    var myELid = '';                //viewer instance's element id
    var targetsList = [];           //all observers that need to recieve msgs

    //TODO - holds all functions a developer can use
    var ENUM_FUNCTIONS = [];

//PRIVATE ================================================================
    //don't want users to be able to call this... manipulates objects...
    var ControllerFunction = {
        _setInViewer: function(attr) {
            viewerInstance = (undefined != attr || attr.length != 0) ? true : false;
            if(viewerInstance) this._loadCompleteModule();
        },
        _loadCompleteModule: function() {
            //load other JS files necessary for viewer
            core.loadJS(location + 'impl/olFacade.js');
            log('olFacade loaded');

            core.loadJS(location + 'api/events.js');
            log('events loaded');

            //TODO - double check registered events...
            viewer.impl.OLFacade.registerEvents();
        }
    };

//PUBLIC =================================================================
    var Controller = core.createClass({
    /**
     * set if an external event is currently processing...
     * may become a problem later on because we don't want events to block?
     */
        extEvtBlocking: false,
        constructor: function() { log('constructor'); },
        init: function() {                      //passing any parameters to init will set flag that it belongs to viewer
            if(arguments.length!=0) ControllerFunction._setInViewer(arguments);
            log('init');
        },
        inViewer: function() { return viewerInstance; },
        setJSLocation: function(path) {
            location = path.toString();

            if(location.lastIndexOf("/")!=location.length)  location += "/";

            log('setting location to ' + location);

            //reload all JS files!
            core.loadJS(location +'functions.js');
            log('functions loaded');
        },
        broadcast: function() {
            //TODO
            log('broadcast');
        },
        getFuncEnum: function() {
            return ENUM_FUNCTIONS;
        },

    //tests!!!
        _testInViewer: function() {
            viewerInstance = false;
        }
    });

//CONTROLLER IS SUPPOSED TO BE A SINGLETON! ==============================
    var instance = new Controller();
    return instance;
})();

//testCallee = arguments.callee.caller;       //scope limited to construct
//console.log(testCallee.toString());