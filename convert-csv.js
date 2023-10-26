const Papa = require('papaparse');
const fs = require('fs');

let fetch;

const csvData = fs.readFileSync('./public/san-francisco-film-locations.csv', 'utf8');

import('node-fetch').then(module => {
    fetch = module.default;

    // Read the CSV file
    Papa.parse(csvData, {
        download: false,
        complete: async function(results) {
            // Create a new array to store the results
            let newResults = [];

            // Loop through each row in the CSV file
            // for (let i = 1; i < results.data.length; i++) {
            for (let i = 1; i < results.data.length; i++) {
                let row = results.data[i];

                // console.log(`Row ${i}: ${row}`);

                // Get the coordinates for the address
                let coordinates = await getCoordinates(row[3]);

                // Add the coordinates to the row
                row[3] = coordinates;

                // Add the row to the new results
                newResults.push(row);

                // Print a message to show progress
                console.log(`Processed row ${i + 1} of ${results.data.length}`);
            }

            // Write the new results to a CSV file
            fs.writeFileSync('converted-san-francisco-film-locations.csv', Papa.unparse(newResults));
        }
    });

    // Function to convert addresses into coordinates (latitude and longitude)
    async function getCoordinates(address) {
        // console.log(`Getting Coordinates for ${address}.`);
    
        // Encode the address for use in a URL
        let encodedAddress = encodeURIComponent(address);
    
        // Construct the URL for the Google Geocoding API
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=YOUR_API_KEY_HERE`;
    
        // Make the request to the Google Geocoding API
        let response = await fetch(url);
        let data = await response.json();
    
        if (data.results.length > 0) {
            // Return the first result as an object with latitude and longitude properties
            console.log(`Lat/Long: ${data.results[0].geometry.location.lat} ${data.results[0].geometry.location.lng}`)
            return [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng];
        } else {
            return null;
        }
    }
    
});