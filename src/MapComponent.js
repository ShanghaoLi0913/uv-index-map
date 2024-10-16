import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';
import Legend from './Legend'; // Import the Legend component

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MyMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [uvData, setUvData] = useState([]);

    useEffect(() => {
        // Load GeoJSON data for state boundaries
        fetch(process.env.PUBLIC_URL + '/us-states.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));

        // Load UV data from CSV
        Papa.parse(process.env.PUBLIC_URL + '/data_112734.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const formattedData = results.data.map(row => ({
                    state: row.State,
                    value: parseInt(row.Value, 10),
                }));
                setUvData(formattedData);
            },
            error: (error) => console.error('Error loading CSV:', error),
        });
    }, []);

    const getColor = (value) => {
        if (value >= 74 && value <= 131) return '#FFFF00'; // Yellow
        if (value > 131 && value <= 165) return '#A0D9D3'; // Light Teal
        if (value > 165 && value <= 186) return '#00BFFF'; // Medium Teal
        if (value > 186 && value <= 198) return '#0066FF'; // Dark Blue
        if (value > 198 && value <= 247) return '#00008B'; // Navy
        return '#FFFFFF'; // Default color if out of range
    };

    return (
        <div>
            <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={(feature) => {
                            const stateUvData = uvData.find(data => data.state === feature.properties.name);
                            return {
                                fillColor: getColor(stateUvData ? stateUvData.value : 0),
                                weight: 2,
                                opacity: 1,
                                color: 'white',
                                fillOpacity: 0.7,
                            };
                        }}
                        // Add popup functionality to each state
                        onEachFeature={(feature, layer) => {
                            const stateUvData = uvData.find(data => data.state === feature.properties.name);
                            const average = stateUvData ? stateUvData.value : 0;
                            layer.bindPopup(`<strong>${feature.properties.name}</strong><br />Average: ${average}`);
                        }}
                    />
                )}
            </MapContainer>
            <Legend /> {/* Include the Legend component here */}
        </div>
    );
};

export default MyMap;
