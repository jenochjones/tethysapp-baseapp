let firstlayeradded = false;
let mapObj = map();
let basemapObj = basemaps();
let dataLayerObj = data_layer();
let layerControlObj = L.control.layers(basemapObj,{'CHIRPS':dataLayerObj}).addTo(mapObj);

/* Add functionality to the map object 
boxZoom: true ... allows holding shift to draw a rectangle and zoom
fullscreenControl: true,  ... button to full screen
zoomSnap: .5,
minZoom: 2,
How can we add a datepicker in the animation slider, or do we have to settle for creating
some kind of date packer in the app navigation menus.
*/

function map() {
  return map = L.map('map', {
    center: [0, 0],
    zoom: 3,
    minZoom: 2,
    zoomSnap: .5,
    boxZoom: true,
    fullscreenControl: true,
    maxBounds: L.latLngBounds(L.latLng(-100.0, -270.0), L.latLng(100.0, 270.0)),
    timeDimension: true,
    timeDimensionControl: true,
    timeDimensionControlOptions: {
      position: "bottomleft",
      autoPlay: true,
      loopButton: true,
      backwardButton: true,
      forwardButton: true,
      timeSliderDragUpdate: true,
      minSpeed: 2,
      maxSpeed: 6,
      speedStep: 1,
    },
  })
}


function basemaps() {
  // create the basemap layers
  let esri_imagery = L.esri.basemapLayer('Imagery');
  let esri_terrain = L.esri.basemapLayer('Terrain');
  let esri_labels = L.esri.basemapLayer('ImageryLabels');
  let esri_topo = L.esri.basemapLayer('Topographic');
  let esri_ng = L.esri.basemapLayer('NationalGeographic');
  let esri_oceans = L.esri.basemapLayer('Oceans');
  let esri_streets = L.esri.basemapLayer('Streets');
  let esri_gray = L.esri.basemapLayer('Gray');
  let esri_darkgray = L.esri.basemapLayer('DarkGray');
  let esri_imageryclarity = L.esri.basemapLayer('ImageryClarity');
  let esri_imageryfirefly = L.esri.basemapLayer('ImageryFirefly');
  let esri_shadedrelief = L.esri.basemapLayer('ShadedRelief');
  let esri_usatopo = L.esri.basemapLayer('USATopo');
  let esri_physical = L.esri.basemapLayer('Physical');
  return {
    "ESRI Imagery (No Label)": L.layerGroup([esri_imagery]).addTo(mapObj),
    "ESRI Imagery (Labeled)": L.layerGroup([esri_imagery, esri_labels]),
    "ESRI Terrain": L.layerGroup([esri_terrain, esri_labels]),
    "ESRI Topographic": L.layerGroup([esri_topo, esri_labels]),
    "ESRI NationalGeographic": L.layerGroup([esri_ng, esri_labels]),
    "ESRI Oceans": L.layerGroup([esri_oceans, esri_labels]),
    "ESRI Streets": L.layerGroup([esri_streets, esri_labels]),
    "ESRI Gray": L.layerGroup([esri_gray, esri_labels]),
    "ESRI DarkGray": L.layerGroup([esri_darkgray, esri_labels]),
    "ESRI ImageryClarity": L.layerGroup([esri_imageryclarity, esri_labels]),
    "ESRI ImageryFirefly": L.layerGroup([esri_imageryfirefly, esri_labels]),
    "ESRI ShadedRelief": L.layerGroup([esri_shadedrelief, esri_labels]),
    "ESRI USATopo": L.layerGroup([esri_usatopo, esri_labels]),
    "ESRI Physical": L.layerGroup([ esri_physical, esri_labels]),
  }
}


function data_layer() {
  // let layer = $('#select-var').val();
  let layer = $("#variables").val();
  let cs_rng = bounds[layer]; // from bounds.js
  let cmap = cmaps[layer]; // from bounds.js
  
  if (firstlayeradded == true) {
    mapObj.removeLayer(dataLayerObj);
  }

  const wmsurl = 'https://thredds.servirglobal.net/thredds/wms/climateserv/ucsb-chirps-gefs/global/0.05deg/10dy/ucsb-chirps-gefs.daily.2020.nc4';
  const wmsLayer = L.tileLayer.wms(wmsurl, {
    layers: layer,
    dimension: 'time',
    useCache: true,
    crossOrigin: false,
    format: 'image/png',
    transparent: true,
    opacity: 0.8,
    BGCOLOR: '0x000000',
    styles: cmap,
    colorscalerange: cs_rng,
  });
 
  wmsLayerTime = L.timeDimension.layer.wms(wmsLayer, {
    name: 'time',
    requestTimefromCapabilities: true,
    updateTimeDimension: true,
    updateTimeDimensionMode: 'replace',
    cache: 20,
  });
  firstlayeradded = true;
  return wmsLayerTime.addTo(mapObj);
  
}

//mapbox map///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*stylesheet and script files included in the javascript
var mapObj = map();
var baselayerObj = baselayer();

function map() {
  return L.map('map').setView([51.505, -0.09], 13);
}

function baselayer() {
  return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9uZXNqOTMiLCJhIjoiY2tkYWduemwwMGM2ODJwdDE4bDk2endqYyJ9.1aWa11kAevAcpD_ozur_0Q'
  }).addTo(mapObj);
}
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////