var url = 'https://dl.dropboxusercontent.com/s/ik63fvbdw28ijun/soundmap.geojson';  // Here is the url path to my GeoJSON file, 
var map= L.map('map').setView([35.689167, 51.388889],12);
L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=48584cb50e384399b635995577038af7', {
        	maxZoom: 20,
        	attribution: '&copy; Ali Tayebi | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Thunderforest'
        }).addTo(map);

var icon1 = L.icon({
    iconUrl: 'css/images/marker-icon.png',
});

var icon2 = L.icon({
    iconUrl: 'css/images/vol-icon2.png',
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
  $.getJSON(url, function(data) {
  
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
								$('.geoAuthor').text(e.target.feature.properties.author);
								$('.geoDateLoc').text(e.target.feature.properties.date+" - "+e.target.feature.properties.location);
								$('.geoDes').text(e.target.feature.properties.description);
								$('.geoImg').attr('src', e.target.feature.properties.imgUrl);
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

