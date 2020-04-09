/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * a utility class
 */
core.ns('viewer.api');

viewer.api.Util = ( function(){
    var Util = core.createClass({
        log: viewer.frmwk.Logger.set('Util'),
        constructor: function() {},
        createJSON: function(name, value) {
            return '{ ' + name + ' : ' + value + ' }';
        },
        isInt: function(n) {
            this.log('isInt');
            if(isNaN(n) || typeof n!='number')          return false;
            return parseFloat(n)==parseInt(n);
        },
        isFloat: function(n) {
            this.log('isFloat');
            if(isNaN(n) || typeof n!='number')          return false;
            return n%1==0;
        },
        isValid: function(n) {
            return !isNaN(n);
        }
    });
    return new Util();
} )();

viewer.api.Exceptions = ( function(){   //TODO - enable an alert as opposed to firebug display?
    var Exceptions = {
        _OUTOFBOUNDSEXCEPTION           :   'OutofBoundsException',
        _INVALIDINPUTTYPEEXCEPTION      :   'InvalidInputTypeException',
        _VALUEOUTOFBOUNDSEXCEPTION      :   'ValueOutOfBoundsException',
        _LAYERNOTFOUNDEXCEPTION         :   'LayerNotFoundException',
        _UNSUPPORTEDOVERLAYTYPE         :   'UnsupportedOverlayTypeException',
        _RESOURCEUNAVAILABLE            :   'ResourceUnavailableException',
        _RESOURCENAMEUNSPECIFIED        :   'ResourceNameUnspecifiedException',
        _POINTISNULL                    :   'PointIsNullException',
        _INCOMPLETEPARAMLENGTH          :   'IncompleteParamLength'
    };
    return Exceptions;
} )();

viewer.api.StringConstants = ( function() {
    var StringConst = {
        _OPENLAYERS                     :   'OpenLayers',
        _GMAPS                          :   'Google Maps',
        _LEAFLET                        :   'Leaflet'
    };
    return StringConst
} )();

viewer.api.SupportedTypes = ( function() {
    var types = ['WMS', 'WFS', 'ESRI'];     //this list will grow
    return types;
} )();

viewer.api.FeatureTypes = ( function() {
    var featureTypes = {
        POINT                           :   'point',
        POLYPOINT                       :   'polypoint',
        POLYLINE                        :   'polyline',
        POLYGON                         :   'polygon'
    };
    return featureTypes;
} )();