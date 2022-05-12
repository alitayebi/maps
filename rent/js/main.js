var region, timestampN,inflData,regionsData,
		request = {timestamp: '', timestamps: '', timeTxt: '', salValue: 10, salCalbr: '', salShare: 30, aptMeter: 60, rent: '', rentMil:''},
		failNote = "در فراخوانی داده‌ها به مشکلی برخوردیم. صفحه را مجدداً بارگذاری کنید."
		map = L.map('map', {
			keyboard: false,
		});
L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=48584cb50e384399b635995577038af7', {
		maxZoom: 20,
		attribution: '&copy; Ali Tayebi | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Thunderforest'
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
					style: { color: "#000", fillOpacity: .65}
	}).addTo(map);
	map.fitBounds(region.getBounds(), {padding: [-100, -100]});
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
		var legendHtml = `
		<h2 id='legendTitle'>توان اجاره‌نشینی</h2>
		<p>حقوق <small>(در سال ۱۴۰۰)</small>: <span class='salValue'>${request['salValue']}</span> میلیون تومان</p>
		<input name='salValue' type="range" min="2" max="20" step="1" value="${request['salValue']}">
		<p>سهم اجاره از حقوق: <span class='salShare'>${request['salShare']}</span> درصد</p>
		<input name='salShare' type="range" min="10" max="100" step="10" value="${request['salShare']}">
		<p>آپارتمان: <span class='aptMeter'>${request['aptMeter']}</span> مترمربعی</p>
		<input name='aptMeter' type="range" min="10" max="150" step="10" value="${request['aptMeter']}">
		<h3>تغییر در زمان:</h3>
		<p>زمان: <span class='timeTxt'>${request['timeTxt']}</span></p>
		<input name='timestamp' type="range" min="1" max="${request['timestamps']}" step="1" value="${request['timestamps']}">
		<small>معادل حقوق: <span class="salCalbr">${request['salCalbr']}</span> | معادل اجاره: <span class="rentMil">${request['rentMil']}</span> (میلیون تومان)
		<p class='legendText'>در <span class='timeTxt highlight'> ${request['timeTxt']}</span>
		، شما با <span class='salShare highlight'>${request['salShare']}</span> درصد معادل حقوق خود
		 می‌توانستید آپارتمانی با مساحت
		 <span class='aptMeter highlight'>${request['aptMeter']}</span> مترمربع را در مناطق زرد رنگ اجاره کنید</p>
		<p class="notes">* داده‌های اجاره‌بها: مرکز آمار ایران <br>** نرخ رسمی افزایش حقوق سالیانه: مصوبات هیئت دولت ایران</p>
		`;
		$('.legend-content').append(legendHtml);
})
$(document).on('change','input[type=range]', function (name) {
	request[name.target.name] = $(this).val();
	updateSymbology()
	console.log(request);
})
function fitBoundsPadding() {
  // get with info div
	const boxInfoWith = document.querySelector('.legend').offsetWidth;
	const mapInfoWith = document.querySelector('#map').offsetWidth;
	if (boxInfoWith >= mapInfoWith) {
		map.fitBounds(region.getBounds(), {
	    // https://leafletjs.com/reference-1.6.0.html#fitbounds-options-paddingtopleft
	    'paddingBottomRight': [ 10, boxInfoWith +10]
	  });
	} else {
		map.fitBounds(region.getBounds(), {
	    // https://leafletjs.com/reference-1.6.0.html#fitbounds-options-paddingtopleft
			'paddingBottomRight': [boxInfoWith + 10, 10]
	  });

	}
  // sets a map view that contains the given geographical bounds
  // with the maximum zoom level possible
  map.fitBounds(region.getBounds(), {
    // https://leafletjs.com/reference-1.6.0.html#fitbounds-options-paddingtopleft
    'paddingBottomRight': [ 10, boxInfoWith +10]
  });
}

// trigger function on dom content loaded
window.addEventListener('DOMContentLoaded', fitBoundsPadding);

// trigger function resize window with performant on resize
let timeout;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fitBoundsPadding();
  }, 75);
}, false);
