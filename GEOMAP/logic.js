// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-06-20&endtime=" +
"2019-09-20&minmagnitude=2&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

//"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-06-15&endtime=" +
 // "2014-09-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
console.log(queryUrl);
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
  { pct: 0.6, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

var getColor = function(pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
          break;
      }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
} ;



function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br>" + 
      "Magnitude : " + feature.properties.mag + "</p>" );


  };

 



  var geojsonMarkerOptions = {
//radius: 15,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      geojsonMarkerOptions.radius = feature.properties.mag * 5 ;
      geojsonMarkerOptions.fillColor = getColor(1-(feature.properties.mag /5) ); //"#ff7800",
      return L.circleMarker(latlng, geojsonMarkerOptions);
  }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
   // "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
   // Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, .1, .2, .5,.6, .8, .9, 1],
          grades2 = [0, 1, 1.5, 2,3, 3.5, 4, 5],
          labels = [];
         div.innerHTML += '<p>Magnitude</p>' ;
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            
            '<i style="background:' + getColor(1-grades[i]) + '"></i> ' +
            grades2[i] + (grades2[i + 1] ? '&ndash;' + grades2[i + 1]   + '<br>' : '+');
    }
  
      return div;
  };
  
  legend.addTo(myMap);



}
