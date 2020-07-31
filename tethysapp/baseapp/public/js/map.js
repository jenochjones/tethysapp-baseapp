let mapObj = map();
let basemapObj = basemaps();
let layerControlObj = L.control.layers(basemapObj).addTo(mapObj);

function map() {
  return map = L.map('map').setView([37.75, -122.23], 10);
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
    "ESRI Terrain": L.layerGroup([esri_terrain]),
    "ESRI Topographic": L.layerGroup([esri_topo]),
    "ESRI NationalGeographic": L.layerGroup([esri_ng]),
    "ESRI Oceans": L.layerGroup([esri_oceans]),
    "ESRI Streets": L.layerGroup([esri_streets]),
    "ESRI Gray": L.layerGroup([esri_gray]),
    "ESRI DarkGray": L.layerGroup([esri_darkgray]),
    "ESRI ImageryClarity": L.layerGroup([esri_imageryclarity]),
    "ESRI ImageryFirefly": L.layerGroup([esri_imageryfirefly]),
    "ESRI ShadedRelief": L.layerGroup([esri_shadedrelief]),
    "ESRI USATopo": L.layerGroup([esri_usatopo]),
    "ESRI Physical": L.layerGroup([ esri_physical]),
  }
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