import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet
import Papa from 'papaparse';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MyMap = () => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Load cities.lst file
        fetch(process.env.PUBLIC_URL + '/cities.lst')
            .then(response => response.text())
            .then(text => {
                const parsedCities = text.split("\n").map(line => {
                    const parts = line.trim().split(/\s+/);
                    return {
                        city: parts[0],
                        state: parts[1],
                        stationCode: parts[6], // Save the station code
                    };
                });

                // Now load station coordinates
                loadStationCoordinates(parsedCities);
            })
            .catch(error => console.error('Error loading file:', error));
    }, []);

    const loadStationCoordinates = (parsedCities) => {
        // Load the CSV file
        Papa.parse(process.env.PUBLIC_URL + '/station_coordinates.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const coordinates = {};
                results.data.forEach(row => {
                    coordinates[row.stationCode] = {
                        latitude: parseFloat(row.latitude),
                        longitude: parseFloat(row.longitude),
                    };
                });

                // Debug logs
                console.log('Parsed Cities:', parsedCities);
                console.log('Coordinates:', coordinates);

                // Add coordinates to cities
                const updatedCities = parsedCities.map(city => {
                    const coord = coordinates[city.stationCode];
                    return {
                        ...city,
                        latitude: coord ? coord.latitude : null,
                        longitude: coord ? coord.longitude : null,
                    };
                }).filter(city => city.latitude && city.longitude); // Filter out cities without valid coordinates

                // Debug log for updated cities
                console.log('Updated Cities:', updatedCities);

                setCities(updatedCities);
            },
            error: (error) => console.error('Error loading CSV:', error),
        });
    };

    return (
        <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cities.map((city, index) => (
                <Marker key={index} position={[city.latitude, city.longitude]}>
                    <Popup>
                        {city.city}, {city.state} <br /> Station Code: {city.stationCode}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MyMap;
