import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet
import Papa from 'papaparse';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MyMap = () => {
    const [cities, setCities] = useState([]);
    const [uvData, setUvData] = useState([]);
    const [geoData, setGeoData] = useState(null);

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
                        stationCode: parts[6], // Corrected station code index
                    };
                });
                loadStationCoordinates(parsedCities);
            })
            .catch(error => console.error('Error loading cities:', error));

        // Load GeoJSON data for state boundaries
        fetch(process.env.PUBLIC_URL + '/us-states.json') // Adjust the path accordingly
            .then(response => response.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
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

                const updatedCities = parsedCities.map(city => {
                    const coord = coordinates[city.stationCode];
                    return {
                        ...city,
                        latitude: coord ? coord.latitude : null,
                        longitude: coord ? coord.longitude : null,
                    };
                }).filter(city => city.latitude && city.longitude);

                setCities(updatedCities);
            },
            error: (error) => console.error('Error loading CSV:', error),
        });
    };

    const getColor = (uvIndex) => {
        // Define color based on UV index ranges
        return uvIndex > 8 ? 'red' :
               uvIndex > 6 ? 'orange' :
               uvIndex > 3 ? 'yellow' :
               'green';
    };

    return (
        <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData && (
                <GeoJSON
                    data={geoData}
                    style={(feature) => ({
                        fillColor: getColor(/* get UV index for the state here */),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7,
                    })}
                />
            )}
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