	$(document).ready(function() {

		var region;
		var payValue = 4;

		var map = L.map('map', {
			touchZoom: false,
			doubleClickZoom: false,
			scrollWheelZoom: false,
			boxZoom: false,
			dragging: false,
			keyboard: false,
		});

		var text = '{"infl":[' +
		'{"Time":"بهار ۱۳۹۶","Inflation":"0.68708" },' +
		'{"Time":"تابستان ۱۳۹۶","Inflation":"0.68708" },' +
		'{"Time":"پائیز ۱۳۹۶","Inflation":"0.68708" },' +
		'{"Time":"زمستان ۱۳۹۶","Inflation":"0.68708" },' +
		'{"Time":"بهار ۱۳۹۷","Inflation":"0.76953" },' +
		'{"Time":"تابستان ۱۳۹۷","Inflation":"0.76953" },' +
		'{"Time":"پائیز ۱۳۹۷","Inflation":"0.76953" },' +
		'{"Time":"زمستان ۱۳۹۷","Inflation":"0.76953" },' +
		'{"Time":"بهار ۱۳۹۸","Inflation":"0.86957" },' +
		'{"Time":"تابستان ۱۳۹۸","Inflation":"0.86957" },' +
		'{"Time":"پائیز ۱۳۹۸","Inflation":"0.86957" },' +
		'{"Time":"زمستان ۱۳۹۸","Inflation":"0.86957" },' +
		'{"Time":"بهار ۱۳۹۹","Inflation":"1" }]}';

		L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=48584cb50e384399b635995577038af7', {
        	maxZoom: 20,
        	attribution: '&copy; Ali Tayebi | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Thunderforest'
        }).addTo(map);
	$.getJSON("data/regionsR60pg96-99.geojson")
		.done(function(data) {
			var info = processData(data);
			createPropSymbols(info.timestamps, data);
			createSliderUI(info.timestamps);
	 	})
	.fail(function() { alert("There has been a problem loading the data.")});
	function processData(data) {
		var timestamps = [];
		var min = Infinity;
		var max = -Infinity;

		for (var feature in data.features) {

			var properties = data.features[feature].properties;

			for (var attribute in properties) {

				if (  attribute != 'region' ) {

					if ( $.inArray(attribute,timestamps) === -1) {
						timestamps.push(attribute);
					}

					if (properties[attribute] < min) {
						min = properties[attribute];
					}

					if (properties[attribute] > max) {
						max = properties[attribute];
					}
				}
			}
		}

		return {
			timestamps : timestamps,
			min : min,
			max : max
		}
	}

	function createPropSymbols(timestamps, data) {

		region = L.geoJson(data, {
            style: { color: "#000", fillOpacity: .65}

		}).addTo(map);
		map.fitBounds(region.getBounds(), {padding: [-50, -50]});
        $(".leaflet-control-zoom").css("visibility", "hidden");

		updatePropSymbols(timestamps[12], payValue);
	}
	function updatePropSymbols(timestamp, payValue) {
	    obj = JSON.parse(text);
        rateValue =  obj.infl[timestamp-1].Inflation;
	    payCalb =(Math.round(payValue*rateValue*10))/ 10;
	    if (timestamp < 13) {
	        	    $(".temporal-payCalb").text("("+payCalb+" مییلیون تومان)");

	    } else {
	        $(".temporal-payCalb").text("");
	    }
		region.eachLayer(function(layer) {
			var props = layer.feature.properties;
			var radius = calcPropRadius(props[timestamp], payValue);
			var popupContent =       "<h3>منطقه " + props.region +"</h3>"+
			        "<h4>"+ String(Math.round(props[timestamp]/60))+" تومان</h4>" +
			        "<b>میانگین قیمت اجاره (هر متر مربع) در" +
			        "<h4><span class='highlight temporal-legend'>بهار ۱۳۹۸</span> </h4>";

			layer.setStyle({fillColor: radius});
			layer.bindPopup(popupContent);
		});
	}
	function calcPropRadius(attributeValue, payValue) {
	    if (attributeValue < (payValue*1000000*rateValue / 2)) {
          return "yellow";
        } else {
    		return "black";
        }

	}


	function createSliderUI(timestamps) {
	    var footNotes = L.control({ position: 'bottomleft'} );
	    footNotes.onAdd = function(map) {
	        var notes = L.DomUtil.create("span", "notes");
    		$(notes).append("* داده‌های اجاره‌بها: مرکز آمار ایران <br>** نرخ رسمی افزایش حقوق سالیانه: مصوبات هیئت دولت ایران");
	    return notes;
	    };
	    footNotes.addTo(map) ;
		var sliderControl = L.control({ position: 'bottomleft'} );

		sliderControl.onAdd = function(map) {

			var sliderC = L.DomUtil.create("input", "range-slider");

			L.DomEvent.addListener(sliderC, 'mousedown', function(e) {
				L.DomEvent.stopPropagation(e);
			});
            L.DomEvent.addListener(sliderC, 'mouseover', function(e) {
		  		map.dragging.disable();
			});
            L.DomEvent.addListener(sliderC, 'mouseout', function(e) {
		  		map.dragging.enable();
			});
			$(sliderC)
				.attr({'type':'range',
					'max': timestamps[timestamps.length-1],
					'min': timestamps[0],
					'step': 1,
					'orient':'horizental',
				    'value': String(timestamps[12])
				})
		  		.on('input change', function() {
		  		updatePropSymbols($(this).val().toString(), payValue);
		  		    $(".temporal-legend").text(obj.infl[this.value-1].Time);
		  		    $(".temporal-legendc").text(this.value);

		  	});

			return sliderC;

		};
		sliderControl.addTo(map) ;

		createTemporalLegend(timestamps[12]);

		function createTemporalLegend(startTimestamp) {

		var temporalLegend = L.control({ position: 'bottomleft' });
		var temporalLegendC = L.control({ position: 'bottomleft' });

		temporalLegend.onAdd = function(map) {
			var outpute = L.DomUtil.create("div", "temporal");
		$(outpute).append("<span class='temporal-legend'>بهار ۱۳۹۸</span>");
						return outpute;

		}
		temporalLegendC.onAdd = function(map) {
			var output = L.DomUtil.create("output", "temporal-legendc");
 			$(output).text(startTimestamp)
			return output;
		}
        		temporalLegend.addTo(map);
        		temporalLegendC.addTo(map);

	}
		var sliderControlT = L.control({ position: 'bottomleft'} );

		sliderControlT.onAdd = function(map) {

			var sliderT = L.DomUtil.create("input", "range-slider");

			L.DomEvent.addListener(sliderT, 'mousedown', function(e) {
				L.DomEvent.stopPropagation(e);
			});
            L.DomEvent.addListener(sliderT, 'mouseover', function(e) {
		  		map.dragging.disable();
			});
            L.DomEvent.addListener(sliderT, 'mouseout', function(e) {
		  		map.dragging.enable();
			});
			$(sliderT)
				.attr({'type':'range',
					'max':10,
					'min': 1,
					'step': 1,
					'orient':'vertical',
				    'value': 5
				})
		  		.on('input change', function() {
		  		    $(".temporal-legendt").text(this.value);
		  		    $(payValue = this.value);
		  		updatePropSymbols($(".temporal-legendc").val(), $(this).val().toString());
		  		// alert($(slider.value));


		  	});

			return sliderT;
		};
		sliderControlT.addTo(map) ;

				createTemporalLegendT(timestamps[12]);


	function createTemporalLegendT(startTimestamp) {

		var temporalLegendT = L.control({ position: 'bottomleft' });

		temporalLegendT.onAdd = function(map) {
			var outpute = L.DomUtil.create("div", "temporal");
			$(outpute).append("<h2 id='legendTitle'>توان اجاره‌نشینی</h2>");
    		$(outpute).append("<p class='legendText'>در <span class='highlight temporal-legend'> بهار ۱۳۹۹</span>، شما با معادل حقوق <span class='highlight temporal-legendt'>4</span> میلیون تومان در سال ۱۳۹۸   <span class='highlight temporal-payCalb'></span> می‌توانستید با صرف پنجاه درصد از حقوق خود آپارتمانی با مساحت ۶۰ متر را در مناطق زرد رنگ اجاره کنید ");
    		$(outpute).append("حقوق: <span class='temporal-legendt'>5</span> میلیون تومان");

						return outpute;

		}

        		temporalLegendT.addTo(map);

	}



}
var elem = document.querySelector('input[type="range"]');

var rangeValue = function(){
  var newValue = elem.value;
  var target = document.querySelector('.value');
  target.innerHTML = newValue;
}

elem.addEventListener("input", rangeValue);

});
