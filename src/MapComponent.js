import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import Legend from './Legend'; // import the component

const MyMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [uvData, setUvData] = useState([]);
    const [selectedState, setSelectedState] = useState(null); // State to track the selected state

    useEffect(() => {
        // Load GeoJSON data for state boundaries
        fetch(process.env.PUBLIC_URL + '/us-states.json')
            .then(response => response.json())
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
        console.log(value);
        // Updated color schema with varying intensities of blue
        if (value > 74 && value <= 131) return '#FFFFE0'; // Light Yellow
        if (value > 131 && value <= 165) return '#FFD700'; // Gold
        if (value > 165 && value <= 186) return '#FFA500'; // Orange
        if (value > 186 && value <= 198) return '#FF8C00'; // Dark Orange
        return '#FF4500'; // Red-Orange for values above 198
    };

    const getBorderColor = (stateName) => {
        return selectedState === stateName ? '#FF0000' : 'white'; // Red border if selected
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
                        const stateUvData = uvData.find(data => data.state === feature.properties.name);
                        return {
                            fillColor: getColor(stateUvData ? stateUvData.value : 0),
                            weight: 2,
                            opacity: 1,
                            color: getBorderColor(feature.properties.name), // Change border color based on selection
                            fillOpacity: 0.7,
                        };
                    }}
                    onEachFeature={(feature, layer) => {
                        const stateUvData = uvData.find(data => data.state === feature.properties.name);
                        const average = stateUvData ? stateUvData.value : 0;
                        layer.bindPopup(`<strong>${feature.properties.name}</strong><br />Average: ${average}`);
                        layer.on({
                            click: () => {
                                setSelectedState(feature.properties.name); // Set the clicked state as selected
                            }
                        });
                    }}
                />
            )}
            <Legend selectedState={selectedState} /> {/* Pass selectedState to Legend */}
        </MapContainer>
    );
};

export default MyMap;
