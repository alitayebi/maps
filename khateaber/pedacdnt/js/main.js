var geoJUrl = 'data/pedacdnt.geojson';  // Here is the url path to my GeoJSON file,
var map= L.map('map').setView([36.55229285487554, 52.675323486328125],12);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        	maxZoom: 15,
        	attribution: '&copy; Ali Tayebi | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

var icon1 = L.icon({
    iconUrl: 'css/images/marker-icon.png',
});

var icon2 = L.icon({
    iconUrl: 'css/images/marker-icon.png',
});
var oldLayer = ""; // to start, declare an empty variable outside of the function scope
function clickFeature(e) {
   var layer = e.target;
   layer.setIcon(layer.options.icon = icon2);

   // only attempt to change oldLayer icon back to original if oldLayer defined
   if (oldLayer) oldLayer.setIcon(layer.options.icon = icon1);
   // keep a reference to switch the icon back on the next click
   oldLayer = layer;
}
var voice;

// Get GeoJSON data and create features.
  $.getJSON(geoJUrl, function(data) {

        voice = L.geoJson(data, {

				onEachFeature: function (feature, layer) {

						layer.on('click', function (e) {
                            openpNav();
                            closeNav();
						    // get coordinates from GeoJSON
							var coords = e.target.feature.geometry.coordinates
							//pass coords to function to create marker.(Yellow circle)
							clickFeature(e);
							//place attributes in panel table.
								$('.geoTitle').text(e.target.feature.properties.title);
                $('.geoDate').text(e.target.feature.properties.date);
                $('.geoPedAge').text(e.target.feature.properties.pedAge);
                $('.geoPedSex').text(e.target.feature.properties.pedSex);
                $('.geoAccWith').text(e.target.feature.properties.accWith);
                $('.geoTime').text(e.target.feature.properties.accTime);
								$('.geoLoc').text(e.target.feature.properties.accLocation);
								$('.geoDes').text(e.target.feature.properties.description);
								$('.geoUrl').attr('href', e.target.feature.properties.newsUrl);
								$('.geoAudio').attr('src', e.target.feature.properties.audioUrl);
						});


				}
				});  //Note turned on to start map with Data, Checkbox has checked property.
        var clusters = L.markerClusterGroup();
        clusters.addLayer(voice);
        map.addLayer(clusters);
        });
map.on('click', function() {
    closepNav();
    closeNav();
});
