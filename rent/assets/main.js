var region, timestampN,inflData,regionsData,
		request = {timestamp: '', timestamps: '', timeTxt: '', salValue: 10, salCalbr: '', salShare: 30, aptMeter: 60, rent: '', rentMil:''},
		failNote = "در فراخوانی داده‌ها به مشکلی برخوردیم. صفحه را مجدداً بارگذاری کنید."
		map = L.map('map', {
			keyboard: false,
		});
L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=48584cb50e384399b635995577038af7', {
		maxZoom: 20,
		attribution: '&copy; <a href="https://twitter.com/alitayebi">Ali Tayebi</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Thunderforest'
	}).addTo(map);
$.ajax({
  url:"data/infl.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    inflData = data;
  }
});
$.ajax({
  url:"data/regions8800.geojson",
  dataType: 'json',
  async: false,
  success: function(data) {
    geoData = data;
  }
});
if (inflData.infl.length == (Object.keys(geoData.features[0].properties).length -1)) {
	region = L.geoJson(geoData, {
					style: { color: "#000", fillOpacity: .65, weight: 1}
	}).addTo(map);
	map.fitBounds(region.getBounds(), {padding: [-50, -50]});
			$(".leaflet-control-zoom").css("visibility", "hidden");
	request["timestamps"] = inflData.infl.length
	request["timestamp"] = inflData.infl.length;
	timestamp = request["timestamp"];
	request["timeTxt"] = inflData.infl[timestamp-1].Time;
	updateSymbology()
} else {
	alert(failNote);
}
function updateSymbology() {
	timestamp = request["timestamp"];
	request["timeTxt"] = inflData.infl[timestamp-1].Time;
	if (request["salValue"] <= 2.6) {
		var inflRate = inflData.infl[timestamp-1].Rate1;
	} else {
		var inflRate = inflData.infl[timestamp-1].Rate2;
	}
	request["rent"]=request["salValue"]*1000000*inflRate * (request["salShare"]/100);
	request["salCalbr"]= (Math.round((request["salValue"]*inflRate)*10))/ 10
	request["rentMil"]= (Math.round((request["salValue"]*inflRate * (request["salShare"]/100))*10))/ 10
	for (var key in request) {
		$('.'+key).text(request[key]);
	}
	region.eachLayer(function(layer) {
		if (layer.feature.properties[timestamp] == '-') {
			var fillColor = "red"
		} else {
			if ((layer.feature.properties[timestamp]/10)*request["aptMeter"] < request["rent"]) {
				var fillColor = "yellow";
			} else {
				var fillColor = "black";
			}
		}
	layer.setStyle({fillColor: fillColor});
	})
}
$(document).ready(function () {
	for (var key in request) {
		$('input[name='+key+']').val(request[key]);
		if (key == 'timestamp') {
			$('input[name='+key+']').attr('max',request[key]);
		}
	}
})
$(document).on('change, input','input[type=range]', function (name) {
	request[name.target.name] = $(this).val();
	updateSymbology()
})
function fitBoundsPadding() {
	const boxInfoWith = document.querySelector('.legend').offsetWidth;
	const mapInfoWith = document.querySelector('#map').offsetWidth;
	if (boxInfoWith >= mapInfoWith) {
		map.fitBounds(region.getBounds(), {
	    'paddingBottomRight': [ 0, boxInfoWith]
	  });
	} else {
		map.fitBounds(region.getBounds(), {
	    'paddingTopLeft': [ boxInfoWith,0 ]
	  });

	}
}
window.addEventListener('DOMContentLoaded', fitBoundsPadding);
let timeout;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fitBoundsPadding();
  }, 75);
}, false);
