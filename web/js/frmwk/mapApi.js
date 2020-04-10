/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * mapApi acts as a facade to the javascript implementation of another mapping API (GMaps, OL, etc)
 * and requires prototypal inheritance to obscure methods from functions.js and events.js.  All the
 * hard work and heavy lifting on the mapping APIs are done by the map API facades:
 *
 * @see olFacade.js
 *
 * note:  We will not be supporting deprecated mapping APIs (ie - GMaps v2) unless absolutely necessary
 */

core.namespace('frmwk');

frmwk.MapAPI = ( function() {
    /**
     * basically, return a facade based off conditionals
     * from another class (see above)
     */

    var log = frmwk.Logger.set('MapAPI');

    var Proto = new core.createClass({
        log: frmwk.Logger.set('MapAPI.Proto'),
        _mapObj: undefined,
        _mapObjType: undefined,

        constructor: function() {
            this.log('constructor');

            this.log('loading map initializer');
            globals.jsLoad(true, 'init/map.js');
            globals.jsLoad(true, 'init/dataLoader.js');
        },
        _init: function() {
            this.log('_init');
            var mapInstance = init.Map.getInstance();
            var path = undefined;

            //initialize actual map, and set objects
            mapInstance.initMap();
            this._mapObj = mapInstance.getMapObj();
            this._mapObjType = mapInstance.getMapObjType();

            //then load facades
            if(undefined!=this._mapObj && this._mapObj.CLASS_NAME=='OpenLayers.Map') {
                path = 'impl/olFacade.js';
            } else if(this._mapObjType==viewer.api.StringConstants._LEAFLET){
                path = 'impl/leafletFacade.js';
            }

            //once mapping library is identified, load the associated facade
            if(undefined!=path) {
                this.log('loading map facade - ' + path);
                globals.jsLoad(true, path, function () {
                    resumeLoadJS();
                });
            }
        },
        _loadData: function() {
            this.log('loading data');
            //TODO
        },
        getMapType: function() {
            this.log('getMapType');
            return this._mapObjType;
        },
        getMapObj: function() {
            this.log('getMapObj');
            return this._mapObj;
        },
        getMapObjType: function() {
            this.log('getMapObjType');
            return this._mapObjType;
        }
    });

    var mapProto =  new Proto();
    var mapFacade = 'uninitialized object';

    function resumeLoadJS() {
        switch(mapProto.getMapType()) {
            case    viewer.api.StringConstants._OPENLAYERS  :       mapFacade = viewer.impl.OLFacade;   break;
            case    viewer.api.StringConstants._LEAFLET     :       mapFacade = impl.LeafletFacade;     break;
            default                                         :       mapFacade = undefined;              break;
        };
        globals._resumeMapApiLoad();
        log('resumeLoadJS');
    }

    //accessor methods
    return {
        getFacade: function()   {   return mapFacade;               },
        getInstance: function() {   return mapProto;                },
        getMapObj: function()   {   return mapProto.getMapObj();    },
        startMap: function()    {   mapProto._init();               },
        loadData: function()    {   mapProto._loadData();           }
    };
} )();