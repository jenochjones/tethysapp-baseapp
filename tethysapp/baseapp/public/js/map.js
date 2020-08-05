let mapObj = map();
let basemapObj = basemaps();
let firstlayeradded = false;
wmsLayerTime = data_layer();
let layerControlObj = layer_control();

function map() {
  return map = L.map('map', {
    center: [0, 0],
    zoom: 3,
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
  let esri_streets = L.esri.basemapLayer('Streets');
  return {
    "ESRI Imagery (No Label)": L.layerGroup([esri_imagery]).addTo(mapObj),
    "ESRI Terrain": L.layerGroup([esri_terrain, esri_labels]),
    "ESRI Streets": L.layerGroup([esri_streets]),
  }
}

function layer_control() {
  return L.control.layers(basemapObj, {'Data Layer': wmsLayerTime}, {
  }).addTo(mapObj)
}

function data_layer(){
    let layer = $('#select-var').val();
    if (firstlayeradded == true) {
        mapObj.removeLayer(wmsLayerTime);
    }
    const wmsurl = 'https://thredds.servirglobal.net/thredds/wms/climateserv/ucsb-chirps-gefs/global/0.05deg/10dy/ucsb-chirps-gefs.daily.2020.nc4';

    const wmsLayer = L.tileLayer.wms(wmsurl, {
        layers: layer,
        dimension: 'time',
        useCache: true,
        crossOrigin: false,
        format: 'image/png',
        transparent: true,
        colorscalerange: '0,100',
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

/*////////////////////////////////////////////////////////////////////////  LEGEND AND LATLON CONTROLS
let legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    let layer = $('#select-var').val();
    let wmsurl = 'https://thredds.servirglobal.net/thredds/wms/climateserv/ucsb-chirps-gefs/global/0.05deg/10dy/ucsb-chirps-gefs.daily.2020.nc4';
    let cs_rng = '{0,100}';
    if ($("#use_csrange").is(":checked")) {
        cs_rng = String($("#cs_min").val()) + ',' + String($("#cs_max").val())
    }

    let div = L.DomUtil.create('div', 'legend');
    let url = wmsurl + "?REQUEST=GetLegendGraphic&LAYER=" + layer + "&PALETTE=" + $('#colorscheme').val() + "&COLORSCALERANGE=" + cs_rng;
    div.innerHTML = '<img src="' + url + '" alt="legend" style="width:100%; float:right;">';
    return div
};

let latlon = L.control({position: 'bottomleft'});
latlon.onAdd = function () {
    let div = L.DomUtil.create('div', 'well well-sm');
    div.innerHTML = '<div id="mouse-position" style="text-align: center"></div>';
    return div;
};*/
