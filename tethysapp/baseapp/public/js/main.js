$('#variables').change(function () {
    console.log($('#variables').val())
    layerControlObj.removeLayer(dataLayerObj);
    dataLayerObj=data_layer();
    layerControlObj.addOverlay(dataLayerObj , "Data Layer");
 });

 $('#myshapefile').click(function () {
    getGeoServerGJ() 
 });

// let user_shapefile = L.geoJSON(false);
let user_shapefile = L.geoJSON(false, {onEachFeature: function (feature, layer) {
    layer.bindPopup('<a class="btn btn-default" role="button" onclick="getShapeChart(' + "'GeoJSON'" + ')">Get timeseries for my GeoJSON</a>');
}});

let user_geojson = L.geoJSON(false, {onEachFeature: function (feature, layer) {
           layer.bindPopup('<a class="btn btn-default" role="button" onclick="getShapeChart(' + "'GeoJSON'" + ')">Get timeseries for my GeoJSON</a>');
       }});

// gets the geojson layers from geoserver wfs and updates the layer

function getGeoServerGJ() {
    const gsurl='http://chg-ewxtest.chg.ucsb.edu:8080/geoserver/wfs'
    const gsworksp='africa'
    const shpname='g2008_0'
    
    let parameters = L.Util.extend({
       service: 'WFS',
       version: '1.0.0',
       request: 'GetFeature',
       typeName: gsworksp + ':' + shpname,
       maxFeatures: 10000,
       outputFormat: 'application/json',
       parseResponse: 'getJson',
       srsName: 'EPSG:4326',
       crossOrigin: 'anonymous'
   });

   console.log(gsurl + L.Util.getParamString(parameters))
       
   $.ajax({
       async: true,
       jsonp: false,
       url: gsurl + L.Util.getParamString(parameters),
       contentType: 'application/json',
       success: function (data) {
           user_shapefile.clearLayers();
           mapObj.removeLayer(drawnItems);
           user_shapefile.addData(data).addTo(mapObj);
           // styleGeoJSON(); // set styling of GeoJSON layer
           mapObj.flyToBounds(user_shapefile.getBounds());
       },
   });
}
