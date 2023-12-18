var geoJUrl = 'data/events.geojson';  // Here is the url path to my GeoJSON file,
var map= L.map('map').setView([35.701885629235406, 51.3867788671159],12);
L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=48584cb50e384399b635995577038af7', {
        	maxZoom: 20,
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
}
var voice;
function createCustomIcon (feature, latlng) {
  return L.circleMarker(latlng, {
    radius: 5,
    fillColor: "#ff0000",
    color: "#ff0000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  })
}

// Get GeoJSON data and create features.
function printMap(who,why,when) {
  map.eachLayer(function(layer) {
    if (!!layer.toGeoJSON) {
      map.removeLayer(layer);
    }
  });
  $.getJSON(geoJUrl, function(data) {
    if (who != 'all') {
      const regex = new RegExp( who, 'gi');
      data.features = data.features.filter(function(feature) {
        return feature.properties.Who.match(regex);
      })
    } 
    if (why != 'all') {
      const regex = new RegExp( why, 'gi');
      data.features = data.features.filter(function(feature) {
        return feature.properties.Why.match(regex);
      })
    } 
    if (when != 'all') {
      const regex = new RegExp( when, 'gi');
      data.features = data.features.filter(function(feature) {
        return feature.properties.From.match(regex);
      })
    } 
  
    // verify in your console:
    voice = L.geoJson(data, {
        pointToLayer: createCustomIcon,
				onEachFeature: function (feature, layer) {

						layer.on('click', function (e) {
              $('#eventModal').modal('show');
                            // get coordinates from GeoJSON
							var coords = e.target.feature.geometry.coordinates
							//pass coords to function to create marker.(Yellow circle)
							clickFeature(e);
							//place attributes in panel table.
								$('.geoWho').text(e.target.feature.properties.Who);
                $('.geoWhen').text(e.target.feature.properties.From);
                $('.geoWhy').text(e.target.feature.properties.Why);
                $('.geoWhere').text(e.target.feature.properties.Where);
                $('.geoSource').text(e.target.feature.properties.Source);
						});


				}
				});  //Note turned on to start map with Data, Checkbox has checked property.
        var clusters = L.markerClusterGroup();
        clusters.addLayer(voice);
        map.addLayer(clusters);
        });
}
printMap('all','all','all')
