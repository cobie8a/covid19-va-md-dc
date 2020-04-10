/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 */
 
core.namespace('init');

init.Map = ( function() {
    var log = frmwk.Logger.set('mapInit');

    var Proto = new core.createClass({
        log: frmwk.Logger.set('Map.Proto'),
        _mapFrmwkLocation: 'frameworks/',
        _mapObj: undefined,
        _mapObjType: undefined,

        constructor: function() {
            this.log('loading map libraries');
            globals.jsLoad(false, this._mapFrmwkLocation + 'leaflet/leaflet-src.js');
        },
        initMap: function() {
            this.log('initMap');
            this._mapObj = L.map('map').setView({lon: -96, lat: 37.5}, 5);

            var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                crs: L.CRS.EPSG4326,
                attribution: 'data &copy; <a href="https://coronavirus.dc.gov/page/coronavirus-data">DC Dept of Health</a>, <a href="https://coronavirus.maryland.gov">MD Dept of Health</a>, <a href="http://www.vdh.virginia.gov/coronavirus/">VA Dept of Health</a>'
            });

            this._mapObj.addLayer(baseLayer);
            this._mapObj.addControl(L.control.scale());

            this._mapObjType = viewer.api.StringConstants._LEAFLET;
        },
        getMapObj: function() {
            return this._mapObj;
        },
        getMapObjType: function() {
            return this._mapObjType;
        },
        _getInfoControl: function() {}
    });

    var mapInstance = new Proto();

    return {
        getInstance: function() {   return mapInstance; }
    };
})();