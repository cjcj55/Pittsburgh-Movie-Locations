Papa.parse('san-francisco-film-locations.csv', {
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);
    }
});

var map = L.map('map').setView([37.7749, -122.4194], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

results.data.forEach(function(row) {
    getCoordinates(row.Locations, function(coordinates) {
        if (coordinates) {
            var circle = L.circle(coordinates, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            }).addTo(map);
        }
    });
});

results.data.forEach(function(row) {
    var location = row.Locations.split(',');
    L.marker([location[0], location[1]]).addTo(map)
        .bindPopup(row.Title);
});

// Function to convert addresses into coordinates (latitude and longitude)
function getCoordinates(address, callback) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var coordinates = [data[0].lat, data[0].lon];
                callback(coordinates);
            } else {
                callback(null);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            callback(null);
        });
}
