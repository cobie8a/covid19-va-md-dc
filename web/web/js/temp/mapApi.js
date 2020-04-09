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

core.namespace('viewer.impl');

viewer.impl.MapAPI = ( function() {
    var log = viewer.frmwk.Logger.set('MapAPI');

    var ApiPrototype = core.createClass({
        _mapObj: undefined,
        _type: undefined,

        constructor : function() {},
        setMapObj: function(mapObj, type) {
            log('ApiPrototype.setMapObj');
            if(undefined==mapObj && typeof mapObj!=='object')
                return;

            this._mapObj = mapObj;
            this._type = type || this._getMapType();
        },
        getMapObj: function() {
            log('returning ApiPrototype.getMapObj')
            return this._mapObj;
        },
        _getMapType: function() {
            log('ApiPrototype._getMapType ');

            if(undefined!=this._mapObj && this._mapObj.CLASS_NAME=='OpenLayers.Map'){
                core.loadJS(viewer.globals.coreViewer.getJSLocation() + 'impl/olFacade.js');
                return 'OpenLayers';
//            } else if(this._mapObj instanceof google.maps.Map) {    return 'Google Maps';
            } else {
                return undefined;       //couldn't find at all!
            }
        }
    });

    var ApiFacade = core.createClass({
        _apiPrototype: new ApiPrototype(),
        constructor: function() {},
        init: function() {
            this.setMapObj(viewer.globals.coreViewer.getGlobalMapObj());
            log('ApiFacade.init');
        },
        getMapObj: function() {
            log('returning ApiFacade.getMapObj')
            return this._apiPrototype.getMapObj();
        },
        setMapObj: function(mapObj, type) {
            this._apiPrototype.setMapObj(mapObj, type);

            if(this._apiPrototype._getMapType()===viewer.api.StringConstants._OPENLAYERS) {
                //TODO - needs to test this
                this._apiPrototype.prototype = viewer.impl.OLFacade;
                log('_apiPrototype set to type viewer.impl.OLFacade');
            }

            log('ApiFacade.setMapObj');
        },
        _getApiPrototypeObj: function() {
            return this._apiPrototype;
        }
    });
    return new ApiFacade();
} )();