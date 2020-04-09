/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * openlayersImpl is the openlayers event register for all events we are
 * listening to
 *
 * this will primarily reside on the viewer since it requires access to the
 * openlayers libraries.  all of the objects here simply 'notify' events.js
 *
 * note: are interfaces for this facade really necessary?  I would like to have all subclasses call
 * OLFacade on each event trigger as a singular point to call, by which it acts like a dispatcher...
 *
 * note:  this is a mixin...
 */

core.ns('viewer.impl');

viewer.impl.OLFacade = ( function() {
    var log = viewer.frmwk.Logger.set('OLFacade');

    var datum = {
        geographic			: new OpenLayers.Projection( 'EPSG:4326' ),		//WGS84 - ESRI use
        webmercator			: new OpenLayers.Projection( 'EPSG:900913' ),	//web mercator - google/bing use
        wgs84webmercator	: new OpenLayers.Projection( 'EPSG:102100' )	//WGS84 web mercator - used during NLE 2011
    };

    var OLFacade = core.createClass({
        _mapObj: undefined,
        _type: undefined,
        _currentProjection: undefined,
        _pt: undefined,
        _transformRequired: undefined,

        constructor: function() {
            this.setMapObject(viewer.globals.coreViewer.getGlobalMapObj());
            this._currentProjection = this.getMapObject().getProjectionObject()
                || new OpenLayers.Projection(this.getMapObject().getProjection());
            this._transformRequired = datum.geographic!==this.getMapObject().getProjectionObject();
        },
        setMapObject: function(mapObj, type) {
            log('OLFacade.setMapObject');
            if(undefined===mapObj && typeof mapObj!=='object')  return;
            this._mapObj = mapObj;
            this._type = type;

            //once map has been set, initiate event listener
            this._initEvents();
        },
        getMapObject: function() {
            log('OLFacade.getMapObject');
            return this._mapObj;
        },
        getMapType: function() {
            log('OLFacade.getMapType');
            return this._type;
        },
        transformObj: function(olObj) {
            this._pt = olObj;
            if(this._transformRequired) {
                log('transforming ' + this._pt.CLASS_NAME);
                this._pt = this._pt.transform(datum.geographic, this._currentProjection);
            }
            return this._pt;
        },
        _initEvents: function() {
            this.getMapObject().events.on({
                'addlayer':         function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  },
                'removelayer':      function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  },
                'changelayer':      function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  },
                'changebaselayer':  function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  },
                'moveend':          function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  },
                'zoomend':          function(e){ viewer.api.evt.Map.notifyListeners(e.object, e.type);  }
            });
        }
    });

    var OLProto = new OLFacade();
    /**
     * NOTE - class augmentation needs to be applied here.  for now, since the
     * extend method on the coreviewer(core) class is non-functional, manually
     * write the methods and then re-assert into an extendable class when the
     * core is more stable
     *
     * CAUTION - watch scope!
     *
     * NOTE - augmented methods should be encapsulated and reflect the
     * segmentation that occurs on the API
     * @see functions.js, events.js
     */

    OLProto.checks = {
        isLayerPresent: function(layerName) {
            return (undefined!==OLProto.getMapObject().getLayersByName(layerName)[0]);
        },
        isWithinBounds: function() {
            var lat,long;
            //normal args are lat,lon
            if(arguments.length==0) {
                return false;
            } else if(arguments.length > 2) {   //presuming a polypoint
                //TODO
            } else if(arguments.length==2) {    //numeric values passed
                lat = arguments[0];
                long = arguments[1];
            } else if(arguments.length==1) {    //passed a point (expecting a json like param)
                lat = arguments[0].y;
                long = arguments[0].x;
            }

            //TODO - check to see the SRS, and perform any transforms as necessary to 4326
            return true;
        },
        isPointValid: function(pointArray) {},
        isUrlAvailable: function(url) {},
        isTypeSupported: function(type) {}
    };

    OLProto.zoom = {
        zoomTo: function(zoomValue) {   OLProto.getMapObject().zoomTo(zoomValue);   },
        getZoomLevel: function()    {   return OLProto.getMapObject().getZoom();    }
    };

    OLProto.point = {
        setCenter: function(latY, lonX) {
            log('OLProto.point.setCenter');
            var ptTemp =  OLProto.transformObj(new OpenLayers.LonLat(lonX, latY));
            OLProto.getMapObject().setCenter(ptTemp);       //all other parameters are optional
        },
        getCenter: function() {
            var ptArray = [
                OLProto.getMapObject().getCenter().lat,
                OLProto.getMapObject().getCenter().lon
            ];
            return ptArray;
        }
    };

    OLProto.overlays = {
        getLayer: function(layerName) { //unless there's a collision, usually return only 1st index
            return OLProto.getMapObject().getLayersByName(layerName)[0];
        },
        setOpacity: function(opacity, layerName) {
            this.getLayer(layerName).setOpacity(opacity);
        },
        getOpacity: function(layerName) {
            return this.getLayer(layerName).opacity;
        },
        setVisible: function(layerName, value) {
            this.getLayer(layerName).setVisibility(value);
        }
    };

    OLProto.addOp = {
        feature: undefined,
        _resetFeatureObj: function() {
            this.feature = {};
        },
        addLayer: function(name, url, type, layers, version) {
            switch(type.toUpperCase()) {
                case    'WMS'   :   this._addWms(name, url, layers, version);     break;
                case    'WFS'   :   break;
                default         :   break;
            }
        },
        addMultiPoint: function(name, description, pointList) {
            if (pointList instanceof Array) {
            } else if (pointList instanceof Array) {
                //TODO - double check to make sure of type... could be String
            }

            this._resetFeatureObj();

            //finally
            this._addVectorFeature(this.feature);
        },
        addPolyline: function(name, description, pointArray, lineColor) {
            //TODO - assemble the polyline and pass to @see _addVectorFeature

            this._resetFeatureObj();

            //finally
            this._addVectorFeature(this.feature);
        },
        addPolygon: function(name, description, vertexList, lineColor, fillColor) {
            //TODO - assemble the polygon and pass to the @see _addVectorFeature

            this._resetFeatureObj();
            this._addVectorFeature(this.feature);
        },

        _addWms: function(name, url, layers, version) {
            var layer = new OpenLayers.Layer.WMS(
                name,
                url,
                {
                    layers: layers
                }
                //I think for the most part we can ignore the version #?
            );
            log('_addWms - adding /"' + name + '/" to the map');
            OLProto.getMapObject().addLayer(layer);
        },
        _addVectorFeature: function(feature) {
            var vectorLyr = OLProto.getMapObject().getLayersByClass('OpenLayers.Layer.Vector');

            //vectorLyr will never be undefined... but will be zero if vector layer cannot be found
            if (vectorLyr.length>0) vectorLyr.addFeatures([feature]);
            else                    throw viewer.api.Exceptions._LAYERNOTFOUNDEXCEPTION;

            //this may no longer be necessary because it will not be able to get the
            //object if it's not already attached to the map
            //OLProto.getMapObject().addLayer(vectorLyr);

            vectorLyr.redraw();         //just perform a refresh
        },
        _constructFeature: function() {
            //TODO
        }
    };

    return OLProto;
} )();