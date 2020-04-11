/**
 * @author chris a <cobie8a@yahoo.com>
 */

core.namespace('app');

app.Data = ( function() {
    var log = frmwk.Logger.set('dataLoader');

    var Loader = new core.createClass({
        log     :   frmwk.Logger.set('Data.Loader'),
        data    :   [],

        constructor: function() {
            this.log('constructor');
            globals.jsLoad(true, 'data/us-states.js');
            this.resetData();
        },
        resetData: function() {
            this.data = [];         //clear it!
            this.data.push(statesData);
            this.addToMap(statesData);
        },
        addToMap: function(jsonData, style, actionOnFeature) {
            var geojson = L.geoJson(jsonData, {
                style: style,
                onEachFeature: actionOnFeature
            });
            frmwk.MapAPI.getMapObj().add(geojson);
        }
    });

    var dataLoaderInstance = new Loader();

    return{
        getLoader: function() {   return dataLoaderInstance;  }
    };

})();