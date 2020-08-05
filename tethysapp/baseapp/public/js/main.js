$('#select-var').change(function () {
    layerControlObj.removeLayer(wmsLayerTime);
    data_layer();
    layerControlObj.addOverlay(wmsLayerTime, "Data Layer");
});