import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
        fetch(process.env.PUBLIC_URL + '/us-states.json')
            .then(response => response.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));

        // Load UV data
        Papa.parse(process.env.PUBLIC_URL + '/uv_data.dot', {
            download: true,
            header: true,
            complete: (results) => {
                const parsedUvData = results.data.map(row => ({
                    stationCode: row['Station Name'].trim(),
                    ClearSkyUVI: parseFloat(row['Clear Sky UVI']) || null,
                })).filter(row => row.ClearSkyUVI !== null);

                console.log('Parsed UV Data:', parsedUvData);
                setUvData(parsedUvData);
            },
            error: (error) => console.error('Error loading UV data:', error),
        });
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

    const getAverageUvIndexForState = (stateName) => {
        const stateUvData = uvData.filter(data => {
            return cities.some(city => city.stationCode === data.stationCode && city.state === stateName);
        });

        console.log(`State: ${stateName}, UV Data:`, stateUvData);

        if (stateUvData.length === 0) {
            console.log(`No UV data for state: ${stateName}`);
            return 0; // Return 0 for states with no UV data
        }

        const totalUv = stateUvData.reduce((acc, cur) => acc + cur.ClearSkyUVI, 0);
        const averageUv = totalUv / stateUvData.length;

        console.log(`State: ${stateName}, Average UV Index: ${averageUv}`);
        return averageUv;
    };

    const getColor = (uvIndex) => {
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
                    style={(feature) => {
                        const stateName = feature.properties.name; // Adjust according to your GeoJSON structure
                        const avgUvIndex = getAverageUvIndexForState(stateName);
                        return {
                            fillColor: getColor(avgUvIndex),
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            fillOpacity: 0.7,
                        };
                    }}
                />
            )}
            {cities.map((city, index) => {
                const uvInfo = uvData.find(data => data.stationCode === city.stationCode);
                const clearSkyUVI = uvInfo ? uvInfo.ClearSkyUVI : 'N/A'; // Handle case where UV data is not available

                return (
                    <Marker key={index} position={[city.latitude, city.longitude]}>
                        <Popup>
                            {city.city}, {city.state} <br />
                            Station Code: {city.stationCode} <br />
                            Clear Sky UVI: {clearSkyUVI}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MyMap;
