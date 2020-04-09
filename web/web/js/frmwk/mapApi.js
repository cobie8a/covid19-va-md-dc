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
    /**
     * basically, return a facade based off conditionals
     * from another class (see above)
     */

    var log = viewer.frmwk.Logger.set('MapAPI');

    var Proto = new core.createClass({
        log: viewer.frmwk.Logger.set('MapAPI.Proto'),
        _mapObj: undefined,
        _mapObjType: undefined,

        constructor: function() {
            this._mapObj = viewer.globals.coreViewer.getGlobalMapObj();
            this._mapObjType = viewer.globals.coreViewer.getGlobalMapObjType();
            this.log('constructor');
        },
        getMapType: function() {
            this.log('getMapType');
            var path = undefined;
            var type = undefined;

            if(undefined!=this._mapObj && this._mapObj.CLASS_NAME=='OpenLayers.Map') {
                path = viewer.globals.coreViewer.getJSLocation() + 'impl/olFacade.js';
                type = viewer.api.StringConstants._OPENLAYERS;
            } else if(this._mapObjType==viewer.api.StringConstants._LEAFLET){
                path = viewer.globals.coreViewer.getJSLocation() + 'impl/leafletFacade.js';
                type = viewer.api.StringConstants._LEAFLET;
            }

            //once mapping library is identified, load the associated facade
            if(undefined!=path) {
                this.log('loading map facade - ' + path);
                core.loadJS(path, function () {
                    resumeLoadJS();
                });
            }

            return type;
        }
    });

    var mapType =  new Proto().getMapType();
    var mapFacade = 'uninitialized object';

    function resumeLoadJS() {
        switch(mapType) {
            case    viewer.api.StringConstants._OPENLAYERS  :       mapFacade = viewer.impl.OLFacade;   break;
            default                                         :       mapFacade = undefined;              break;
        };
        viewer.globals.coreViewer._resumeMapApiLoad();
        log('resumeLoadJS');
    }

    return {
        getObj: function() {    return mapFacade;   }
    };
} )();