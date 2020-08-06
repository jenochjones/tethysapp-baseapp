/* Drawing/Layer Controls */

let drawnItems = new L.FeatureGroup().addTo(mapObj);   // FeatureGroup is to store editable layers

let drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        edit: true,
    },
    draw: {
        polyline: true,
        circlemarker: true,
        circle: true,
        polygon: true,
        rectangle: true,
        trash: true,
    },
});

let shpLayer = new L.FeatureGroup().addTo(mapObj);

/* Add the controls to the map */
mapObj.addControl(drawControl);

/* Controls for when drawing on the maps */
mapObj.on("draw:drawstart ", function () {     // control what happens when the user draws things on the map
    drawnItems.clearLayers();   
});

mapObj.on(L.Draw.Event.CREATED, function (event) {
    drawnItems.addLayer(event.layer);
    L.Draw.Event.STOP;
    /*
    // I think the below probably creates the flow needed to create a pop-up time-series plot
     $("#chart_modal").modal("show");
    getDrawnChart(drawnItems);
    */ 
    // If a user selects a location, box, or other polygon, I think I would like a pop-up window to 
    // ask if the users want to download the data or request a timeseries of some metric (e.g. average, max, min, stdev, etc.)
    // For this demonstration, I think it would be good to just assume timeseries requests.
    var type  = event.layerType;
    var layer = event.layer;
    getTimeSeriesPoint(type,layer)
});

function getTimeSeriesPoint(type,layer) {
    if (type === 'marker') {
        var coord = layer.getLatLng();
        var lat = coord.lat;
        var lng = coord.lng;
        
        $.ajax({
            url: 'controllers/get_point_values/',
            data: {
                'lat': lng,
                'lon': lat,
                //'filename': pathToDisplayedFile,
                //'layer': layer_name,
            },
            dataType: 'json',
            contentType: "application/json",
            method: 'GET',
            success: function (result) {
                alert(result['lat'])
                alert(result['lon'])
                //draw_graph(result['data'], result['time'], result['value']);
            },
        });
    }

    if (type === 'rectangle') {
        var corner_coord = layer.getLatLngs();
        var corner_1 = corner_coord[0][0];
        var corner_3 = corner_coord[0][2];
        var max_lat = corner_3.lat;
        var max_lon = corner_3.lng;
        var min_lat = corner_1.lat;
        var min_lon = corner_1.lng;

        $.ajax({
            url: 'ajax/get_box_values/',
            data: {
                'max_lat': max_lat,
                'max_lon': max_lon,
                'min_lat': min_lat,
                'min_lon': min_lon,
                'filename': pathToDisplayedFile,
                'layer': layer_name,
            },
            dataType: 'json',
            contentType: "application/json",
            method: 'GET',
            success: function (result) {
                draw_graph(result['data'], result['time'], result['value']);
            },
        });
    }
}

//////////////////////////////////////////////////////////////////////////////
 
 

