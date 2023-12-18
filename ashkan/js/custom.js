/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mainSidenav").style.width = "350px";
}
function openpNav() {
  document.getElementById("popSidenav").style.width = "350px";
  document.getElementById("map").style.marginLeft = "350px";

}
/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mainSidenav").style.width = "50px";
        var accordions = document.querySelectorAll('.accordion-content.active');
    for (var i = 0; i < accordions.length; i++) {
        accordions[i].classList.remove('active');
      }
}
function closepNav() {
  document.getElementById("popSidenav").style.width = "0px";
  document.getElementById("map").style.marginLeft = "0px";
}
var whyEvent,whenEvent,whoEvent;
$('input[type=radio][name=options-who]').change(function() {
  whoEvent = this.value;
  printMap(whoEvent, whyEvent, whenEvent)
});
$('input[type=radio][name=options-why]').change(function() {
  whyEvent = this.value;
  printMap(whoEvent, whyEvent, whenEvent)
});
$('#btnWhen').on('click', function() {
  $('#whenRange').show().trigger('change');
  $('#btnWhenClear').show();
  $(this).hide()
});
$('#btnWhenClear').on('click', function() {
  $('#whenRange').hide();
  $('#btnWhen').show();
  whenEvent = 'all';
  $('#whenLabel').html('1942-1953')
  printMap(whoEvent, whyEvent, whenEvent)
  $(this).hide()
});

$('#whenRange').change(function() {
  whenEvent = this.value;
  $('#whenLabel').html(whenEvent)
  printMap(whoEvent, whyEvent, whenEvent)
});

// Listen for click on the document
document.addEventListener('click', function (event) {

  //Bail if our clicked element doesn't have the class
  if (!event.target.classList.contains('accordion-toggle')) return;

  // Get the target content
  var content = document.querySelector(event.target.hash);
  if (!content) return;

  // Prevent default link behavior
  event.preventDefault();

  // If the content is already expanded, collapse it and quit
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    return;
  }

  // Get all open accordion content, loop through it, and close it
  var accordions = document.querySelectorAll('.accordion-content.active');
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].classList.remove('active');
  }

  // Toggle our content
  content.classList.toggle('active');
})
$.getJSON('data/events.geojson', function(data) {
  var ict_unit = [];
  var efficiency = [];
  var coloR = [];

  var dynamicColors = function() {
     var r = Math.floor(Math.random() * 255);
     var g = Math.floor(Math.random() * 255);
     var b = Math.floor(Math.random() * 255);
     return "rgb(" + r + "," + g + "," + b + ")";
  };

  for (var i in data) {
     ict_unit.push("ICT Unit " + data[i].ict_unit);
     efficiency.push(data[i].efficiency);
     coloR.push(dynamicColors());
  }
var labels = data.features.map(function(e) {
   return e.properties.pedSex;
});
var timestamp = data.features.map(function(e) {
   return e.properties.timestamp;
});
var counts = {};
labels.forEach(function(i) {
    counts[i] = counts[i] ? counts[i] + 1 : 1;
});
function convertToArray(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
maxTime = timestamp.max()*1000
DiffTime =Date.now() - maxTime;
diffDays = Math.floor(DiffTime / 86400000);
$('#dayDiff').text(diffDays);


});
