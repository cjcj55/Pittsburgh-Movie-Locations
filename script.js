Papa.parse('converted-san-francisco-film-locations.csv', {
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);

        var map = L.map('map').setView([37.7749, -122.4194], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        results.data.forEach(function(row) {
            if (row[3]) { // Ignore rows where the Locations field is undefined

                var coordinates = row[3].split(',');

                if (coordinates) {
                    var circle = L.circle(coordinates, {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 10
                    }).addTo(map);
                }
            }
        });

        results.data.forEach(function(row) {
            if (row[3]) { // Ignore rows where the Locations field is undefined
                var location = row[3].split(',');
                L.marker([location[0], location[1]]).addTo(map)
                    .bindPopup(row[1]);
            }
        });
    }
});