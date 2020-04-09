/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * functions.js contains all functions
 */

core.ns('viewer.api.func');

viewer.api.func.Zoom = ( function() {
    var ZoomFunc = core.createClass({
        log: viewer.frmwk.Logger.set('func.Zoom'),
        mapApiObj: viewer.impl.MapAPI.getObj(),
        currentZoom: 0,

        constructor: function() {},
        zoomTo: function(zoomLevel) {
            this.mapApiObj.zoom.zoomTo(zoomLevel);
            this.log('zoomTo');
        },
        zoomIn: function() {
            this.mapApiObj.zoom.zoomTo(this.getZoomLevel()+1);
            this.log('zoomIn');
        },
        zoomOut: function() {
            this.mapApiObj.zoom.zoomTo(this.getZoomLevel()-1);
            this.log('zoomOut');
        },
        getZoomLevel: function() {
            this.currentZoom = this.mapApiObj.zoom.getZoomLevel();
            this.log('getZoomLevel');
            return this.currentZoom;
        }
    });
    return new ZoomFunc();
} )();

viewer.api.func.Point = ( function() {
    var PointFunc = core.createClass({
        log: viewer.frmwk.Logger.set('func.Point'),
        util: viewer.api.Util,
        mapApiObj: viewer.impl.MapAPI.getObj(),     //do not return map object = getMapObject(),

        constructor: function() {},
        setCenterPoint: function(latitude, longitude) {     //it seems the number is getting truncated either way
            if(!(this.util.isValid(latitude) && this.util.isValid(longitude)))
                throw viewer.api.Exceptions._INVALIDINPUTTYPEEXCEPTION;

            if(!this.mapApiObj.checks.isWithinBounds(latitude, longitude))
                throw viewer.api.Exceptions._OUTOFBOUNDSEXCEPTION;

            //once all checks are done, proceed...
            this.mapApiObj.point.setCenter(latitude, longitude);
        },
        getCenterPoint: function() {
            return this.mapApiObj.point.getCenter();
        }
    });
    return new PointFunc();
} )();

viewer.api.func.OverlayOpacity = ( function() {
    var OverlayOpacityFunc = core.createClass({
        log: viewer.frmwk.Logger.set('func.OverlayOpacity'),
        util: viewer.api.Util,
        mapApiObj: viewer.impl.MapAPI.getObj(),

        constructor: function() {},
        setOverlayOpacity: function(opacity, layerName) {
            if(undefined===opacity || (opacity>1.0 || opacity<0))
                throw viewer.api.Exceptions._VALUEOUTOFBOUNDSEXCEPTION;

            this._checkLayer(layerName);
            this.mapApiObj.overlays.setOpacity(opacity, layerName);
        },
        getOverlayOpacity: function(layerName) {
            this._checkLayer(layerName);
            return this.mapApiObj.overlays.getOpacity(layerName);
        },
        turnOverlayOff: function(layerName) {
            this._checkLayer(layerName);
            this.mapApiObj.overlays.setVisible(layerName, false);
        },
        turnOverlayOn: function(layerName) {
            this._checkLayer(layerName);
            this.mapApiObj.overlays.setVisible(layerName, true);
        },
        _checkLayer: function(layerName) {
            var layer = this.mapApiObj.overlays.getLayer(layerName);
            if(!this.mapApiObj.checks.isLayerPresent(layerName) || layer.length===0)
                throw viewer.api.Exceptions._LAYERNOTFOUNDEXCEPTION;
        }
    });
    return new OverlayOpacityFunc();
} )();

viewer.api.func.Add =( function() {
    var AddFunc = core.createClass({
        log: viewer.frmwk.Logger.set('func.OverlayOpacity'),
        util: viewer.api.Util,
        mapApiObj: viewer.impl.MapAPI.getObj(),
        transformedPoints: undefined,

        constructor: function() {},
        addOverlay: function(name, url, type, layers, version) {
            if(!this.mapApiObj.checks.isTypeSupported())
                throw viewer.api.Exceptions._UNSUPPORTEDOVERLAYTYPE;

            if(!this.mapApiObj.checks.isUrlAvailable())
                throw viewer.api.Exceptions._RESOURCEUNAVAILABLE;

            if(undefined===layers)
                throw viewer.api.Exceptions._INVALIDINPUTTYPEEXCEPTION;

            this.mapApiObj.addOp.addLayer(name, url, type, layers, version);
        },
        addPointFeature: function(name, description, point) {
            this._performChecks(name, point,
                point instanceof Array ? viewer.api.FeatureTypes.POLYPOINT : viewer.api.FeatureTypes.POINT);
            this.mapApiObj.addOp.addMultiPoint(name, description, point);
        },
        addPointFeatures: function(name, description, pointArray) {
            this.addPointFeatures(name, description, pointArray);
        },
        addFeatureLines: function(name, description, vertexList, lineColor) {
            this._performChecks(name, vertexList, viewer.api.FeatureTypes.POLYLINE);
            this.mapApiObj.addOp.addPolyline(name, description, vertexList, lineColor);
        },
        addPolyFeature: function(name, description, vertexList, lineColor, fillColor) {
            this._performChecks(name, vertexList, viewer.api.FeatureTypes.POLYGON);
            this.mapApiObj.addOp.addPolygon(name, description, vertexList, lineColor, fillColor);
        },

        _performChecks: function(name, point, type) {
            /**
             * should _performChecks be a generic point(Array) checking method or should it actually
             * check, process and return transformed points back to the calling method?
             */
            switch(type) {
                case    viewer.api.FeatureTypes.POLYLINE    :
                            if(!(point instanceof Array) && point.length < 2)
                                throw viewer.api.Exceptions._INCOMPLETEPARAMLENGTH;
                            break;
                case    viewer.api.FeatureTypes.POLYGON     :
                            if(!(point instanceof Array) && point.length < 3)
                                throw viewer.api.Exceptions._INCOMPLETEPARAMLENGTH;
                            break;
                case    viewer.api.FeatureTypes.POLYPOINT   :   //could be a polypoint with just one point, cascade...
                case    viewer.api.FeatureTypes.POINT       :
                default                                     :   break;
            }

            //process all the points
            this.transformedPoints = undefined;
            if (!this.mapApiObj.checks.isWithinBounds(point)) {
                throw viewer.api.Exceptions._OUTOFBOUNDSEXCEPTION;
            }

            if (!this.mapApiObj.checks.isPointValid(point)) {
                throw viewer.api.Exceptions._INVALIDINPUTTYPEEXCEPTION;
            }

            if(undefined===name)
                throw viewer.api.Exceptions._RESOURCENAMEUNSPECIFIED;
        }
    });
    return new AddFunc();
} )();

/**
 * these are window dependent (based on Ext or widgeting framework chosen to be implemented)
 */
viewer.api.func.TimeSlider = ( function() {
    var TimeSliderFunc = core.createClass({
        timeSliderEl: undefined,

        constructor: function() {},
        showTimeSlider: function() {},
        hideTimeSlider: function() {},
        pinTimeSlider: function() {},
        unpinTimeSlider: function() {},
        setTimeSliderWindow: function(startTime, endTime) {},

        setTimeSliderWindowElement: function(el) {}
    });
    return new TimeSliderFunc();
} )();

viewer.api.func.LayerController = ( function() {
    var LayerControllerFunc = core.createClass({
        layerControllerEl: undefined,

        constructor: function() {},
        showLayerController: function() {},
        hideLayerController: function() {},
        pinLayerController: function() {},
        unpinLayerController: function() {},
        getAllOverlays: function() {},

        setLayerControllerEl: function() {}
    });
    return new LayerControllerFunc();
} )();

