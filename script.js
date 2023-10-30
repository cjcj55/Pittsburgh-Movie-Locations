// Papa.parse('converted-san-francisco-film-locations.csv', {
//     download: true,
//     complete: function(results) {
//         console.log("Finished:", results.data);

//         var map = L.map('map').setView([37.7749, -122.4194], 13);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//         }).addTo(map);

//         results.data.forEach(function(row) {
//             if (row[3]) { // Ignore rows where the Locations field is undefined

//                 var coordinates = row[3].split(',');

//                 if (coordinates) {
//                     var circle = L.circle(coordinates, {
//                         color: 'red',
//                         fillColor: '#f03',
//                         fillOpacity: 0.5,
//                         radius: 10
//                     }).addTo(map);
//                 }
//             }
//         });

//         results.data.forEach(function(row) {
//             if (row[3]) { // Ignore rows where the Locations field is undefined
//                 var location = row[3].split(',');
//                 L.marker([location[0], location[1]]).addTo(map)
//                     .bindPopup(row[1]);
//             }
//         });
//     }
// });

var movies = new Set();
var filteredMovies = [];
var markers = [];
var map;

Papa.parse('converted-san-francisco-film-locations.csv', {
 download: true,
 complete: function(results) {
     console.log("Finished:", results.data);

     map = L.map('map').setView([37.7749, -122.4194], 13); // Initialize map

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
     }).addTo(map);

     results.data.forEach(function(row) {
         if (row[3]) { // Ignore rows where the Locations field is undefined
             var coordinates = row[3].split(',');

             if (coordinates) {
               var marker = L.marker([coordinates[0], coordinates[1]]);
               marker.bindPopup(row[1]);
               markers.push(marker);
               movies.add(row[1]);
             }
         }
     });

     var markerClusters = L.markerClusterGroup();
     markerClusters.addLayers(markers);
     map.addLayer(markerClusters);

     populateMovieList();
 }
});

function populateMovieList() {
    filteredMovies = Array.from(movies);
  
    var movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    filteredMovies.forEach(function(movie) {
        var listItem = document.createElement('p');
        listItem.textContent = movie;
        listItem.addEventListener('click', function() {
            filterMap(movie);
        });
        movieList.appendChild(listItem);
    });
}

document.getElementById('search').addEventListener('keyup', function() {
    var search = this.value.toLowerCase();
    filteredMovies = Array.from(movies).filter(function(movie) {
        return movie.toLowerCase().indexOf(search) > -1;
    });

    var movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    filteredMovies.forEach(function(movie) {
        var listItem = document.createElement('p');
        listItem.textContent = movie;
        listItem.addEventListener('click', function() {
            filterMap(movie);
        });
        movieList.appendChild(listItem);
    });
});

function filterMap(movie) {
    markers.forEach(function(marker) {
        if (marker._popup._content == movie) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
}

document.getElementById('clear-filter').addEventListener('click', function() {
    clearFilter();
});

function clearFilter() {
    markers.forEach(function(marker) {
        map.addLayer(marker); // Use map.addLayer instead of marker.addTo
    });
}
