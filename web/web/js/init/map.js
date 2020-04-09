/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * OpenLayers map implementation - need to make more generic to accomodate Leaflet or other mapping frameworks
 */
 
var map, mapType, baseLayer;

function initMap() {

    map = L.map('map').setView({lon: 0, lat: 0}, 3);

    baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'data &copy; <a href="https://coronavirus.dc.gov/page/coronavirus-data">DC Dept of Health</a>, <a href="https://coronavirus.maryland.gov">MD Dept of Health</a>, <a href="http://www.vdh.virginia.gov/coronavirus/">VA Dept of Health</a>'
    });

    map.addLayer(baseLayer);
    map.addControl(L.control.scale());
//    L.control.scale().addTo(map);

    mapType = 'Leaflet';

}