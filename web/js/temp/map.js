/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * OpenLayers map implementation - need to make more generic to accomodate Leaflet or other mapping frameworks
 */
 
var datum, vectorLyr, drawLyr, mapToolbar, baseLayer, map, geolocate, selGeom;

function initMap() {
    datum = {
        geographic			: new OpenLayers.Projection( 'EPSG:4326' ),		//WGS84 - ESRI use
        webmercator			: new OpenLayers.Projection( 'EPSG:900913' ),	//web mercator - google/bing use
        wgs84webmercator	: new OpenLayers.Projection( 'EPSG:102100' )	//WGS84 web mercator - used during NLE 2011
    };

    vectorLyr = new OpenLayers.Layer.Vector( 'vectorLyr' );

    drawLyr = new OpenLayers.Layer.Vector( 'drawLyr',
        {
            styleMap: new OpenLayers.StyleMap({
                temporary: OpenLayers.Util.applyDefaults
                    (
                        { pointRadius: 3 },
                        OpenLayers.Feature.Vector.style.temporary
                    )
            })
        }
    );

    mapToolbar = new OpenLayers.Control.Panel( { displayClass : 'olControlEditingToolbar' } );

    mapToolbar.addControls([
        new OpenLayers.Control( { displayClass : 'olControlNavigation' } ),
        new OpenLayers.Control.ModifyFeature(
            drawLyr,
            {
                vertexRenderIntent : 'temporary',
                displayClass       : 'olControlModifyFeature'
            }
        ),
        new OpenLayers.Control.DrawFeature(
            drawLyr,
            OpenLayers.Handler.Point,
            { displayClass : 'olControlDrawFeaturePoint' }
        ),
        new OpenLayers.Control.DrawFeature(
            drawLyr,
            OpenLayers.Handler.Polygon,
            { displayClass : 'olControlDrawFeaturePolygon' }
        )
//        new OpenLayers.Control.DrawFeature(
//        	drawLyr,
//        	OpenLayers.Handler.Path,
//        	{ displayClass : 'olControlDrawFeaturePath' }
//        ),
    ]);

    baseLayer = new OpenLayers.Layer.OSM( 'osm' );
    baseLayer.wrapDateLine = true;

    map = new OpenLayers.Map({
        div 				: 'map',
        theme 				: null,
        projection 			: datum.wgs84webmercator,
        displayProjection	: datum.wgs84webmercator,
        sphericalMercator	: true,
        units 				: 'm',
        numZoomLevels 		: 20,					//standard GMaps uses 20
        maxResolution 		: 156543.0339,
        maxExtent 			: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
        //controls 			: [],
        layers 				: [baseLayer, vectorLyr, drawLyr]
    });

    mapToolbar.controls[0].activate();
    map.zoomToMaxExtent();


    /******************************************************************************/
    geolocate = new OpenLayers.Control.Geolocate({
        bind: false,
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });

    map.addControl(geolocate);

    var style = {
        fillColor: '#000',
        fillOpacity: 0.1,
        strokeWidth: 0
    };

    var pulsate = function(feature) {
        var point = feature.geometry.getCentroid(),
            bounds = feature.geometry.getBounds(),
            radius = Math.abs((bounds.right - bounds.left)/2),
            count = 0,
            grow = 'up';

        var resize = function(){
            if (count>16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval/radius;
            switch(count) {
                case 4:
                case 12:
                    grow = 'down'; break;
                case 8:
                    grow = 'up'; break;
            }
            if (grow!=='up') {
                ratio = - Math.abs(ratio);
            }
            feature.geometry.resize(1+ratio, point);
            vectorLyr.drawFeature(feature);
            count++;
        };
        window.resizeInterval = window.setInterval(resize, 50, point, radius);
    };

    var firstGeolocation = true;

    geolocate.events.register("locationupdated",geolocate,function(e) {
        vectorLyr.removeAllFeatures();
        var circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(
                new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                e.position.coords.accuracy/2,
                40,
                0
            ),
            {},
            style
        );
        vectorLyr.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            circle
        ]);
        if (firstGeolocation) {
            map.zoomToExtent(vectorLyr.getDataExtent());
            pulsate(circle);
            firstGeolocation = false;
            this.bind = true;
        }
    });

    geolocate.events.register("locationfailed",this,function() {
        OpenLayers.Console.log('Location detection failed');
    });

}