/* Drawing/Layer Controls */

let chartdata = null; // initialize as a global variable.

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
    // If a user selects a location, box, or other polygon, I think I would like a pop-up window to 
    // ask if the users want to download the data or request a timeseries of some metric (e.g. average, max, min, stdev, etc.)
    // For this demonstration, I think it would be good to just assume timeseries requests.
    var type  = event.layerType;
    var layer = event.layer;
    /* Bring up the modal chart */
    $("#chart").html('<div class="load"><img src="https://media.giphy.com/media/jAYUbVXgESSti/giphy.gif"></div>');
    $("#chart_modal").modal("show");    
    getTimeSeriesPoint(type,layer);
});

function getTimeSeriesPoint(type,layer) {
    // Define the THREDDS Data Server URL to pass.
    var tdsUrl='https://thredds.servirglobal.net/thredds/dodsC/climateserv/ucsb-chirps-gefs/global/0.05deg/10dy/ucsb-chirps-gefs.daily.2020.nc4'
    // Get the layer/variable we need to extract.
    layer_name=$('#variables').val()
    if (type === 'marker') {
        var coord = layer.getLatLng();
        var lat = coord.lat;
        var lng = coord.lng;
        
        $.ajax({
            url: 'controllers/get_point_values/',
            data: {
                'lat': lng,
                'lon': lat,
                'dataUrl': tdsUrl,
                'layer': layer_name,
            },
            dataType: 'json',
            contentType: "application/json",
            method: 'GET',
            success: function (result) {
                // clear the loading gif
                $("#chart").html('');
                chartdata = result
                plotlyTimeseries(chartdata,'Point');
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
            url: 'controllers/get_box_values/',
            data: {
                'max_lat': max_lat,
                'max_lon': max_lon,
                'min_lat': min_lat,
                'min_lon': min_lon,
                'dataUrl': tdsUrl,
                'layer': layer_name,
            },
            dataType: 'json',
            contentType: "application/json",
            method: 'GET',
            success: function (result) {
                // clear the loading gif
                $("#chart").html('');
                chartdata = result
                plotlyTimeseries(chartdata,'Area Average');
            },
        });
    }
}

function plotlyTimeseries(data,typeOfAverage) {
    let variable = $("#variables option:selected").text();
    let layout = {
        title: typeOfAverage + ' Timeseries of 10-Day ' + variable,  // would be great to use the nice name  ... is that what option:selected does?
        xaxis: {title: 'Time'},
        yaxis: {title: 'Amount (mm)'} // we could make this dynamic by passing in the units read-in from python through the JSON Request (i.e. an additioanl element)
    };

    let values = {
        x: data.x,
        y: data.y,
        mode: 'lines+markers',
        type: 'scatter'
    };
    Plotly.newPlot('chart', [values], layout);
    let chart = $("#chart");
    chart.css('height', 500);
    Plotly.Plots.resize(chart[0]);
}

// Add function to save chart to CSV

function chartToCSV() {
    function zip(arrays) {
        return arrays[0].map(function (_, i) {
            return arrays.map(function (array) {
                return array[i]
            })
        });
    }
    if (chartdata === null) {
        alert('There is no data in the chart. Please plot some data first.');
        return
    }
    let data = zip([chartdata.x, chartdata.y]);
    let csv = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    let link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('target', '_blank');
    link.setAttribute('download', 'extracted_time_series.csv');
    document.body.appendChild(link);
    link.click();
    $("#a").remove()
}

// WHEN YOU CLICK ON THE DOWNLOAD BUTTON- RUN THE DOWNLOAD CSV FUNCTION
$("#chartCSV").click(function () {chartToCSV()});


//////////////////////////////////////////////////////////////////////////////
 
 

