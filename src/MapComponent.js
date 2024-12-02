import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import Legend from './Legend'; // import the component
import UvBarChart from './UvBarChart'; // import the bar chart component
import { Chart, registerables } from 'chart.js';

// Register necessary Chart.js components
Chart.register(...registerables);

const MyMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [uvData, setUvData] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState(null); // State to track the selected state

    useEffect(() => {
        // Load GeoJSON data for state boundaries
        //fetch(process.env.PUBLIC_URL + '/us-states.json')
        fetch(process.env.PUBLIC_URL + '/us-counties.json')
            .then(response => response.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));

    Papa.parse(process.env.PUBLIC_URL + '/UV-2020-byCounty.csv', {
        download: true,
        header: true,
        complete: (results) => {
        // Format the data to include County, CountyFIPS, and value
        const formattedData = results.data.map(row => ({
            County: row.County,               // Extract County name
            CountyFIPS: row.CountyFIPS,       // Extract CountyFIPS
            value: parseInt(row.Value, 10),   // Convert the Value to an integer
        }));
            setUvData(formattedData);  // Store the formatted data in state
        },
        error: (error) => console.error('Error loading CSV:', error),
        });
    }, []);

    
    const getColor = (value) => {
        // Updated color schema with varying intensities of yellow
        if (value < 74) return '#FFAAAA'; // Light Yellow
        if (value >= 74 && value <= 131) return '#FFFF00'; // Yellow
        if (value > 131 && value <= 165) return '#FFD700'; // Gold
        if (value > 165 && value <= 186) return '#FFA500'; // Orange
        return '#FF4500'; // Red
    };

    // const getBorderColor = (stateName) => {
    //     return selectedState === stateName ? '#FF0000' : 'white'; // Red border if selected
    // };
    const getBorderColor = (countyFIPS) => {
        return selectedCounty === countyFIPS ? '#FF0000' : 'white'; // Red border if the county is selected
    };

    return (
        <>
            <div style={{ position: "relative", height: "100vh", width: "100%" }}>
                <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geoData && (
                        <GeoJSON
                            data={geoData}
                            style={(feature) => {
                                const stateUvData = uvData.find(data => data.CountyFIPS === feature.properties.STATE+feature.properties.COUNTY);
                                return {
                                    fillColor: getColor(stateUvData ? stateUvData.value : 0),
                                    weight: 2,
                                    opacity: 1,
                                    //color: getBorderColor(feature.properties.name),
                                    color: getBorderColor(feature.properties.STATE + feature.properties.COUNTY), // Use CountyFIPS for border color
                                    fillOpacity: 0.7,
                                };
                            }}
                            //pop-up settings
                            onEachFeature={(feature, layer) => {
                                const stateUvData = uvData.find(data => data.CountyFIPS === feature.properties.STATE + feature.properties.COUNTY);
                                const average = stateUvData ? stateUvData.value : 0;
                                layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br />Average: ${average}`);
                                layer.on({
                                    click: () => {
                                        setSelectedCounty(feature.properties.STATE + feature.properties.COUNTY);
                                    }
                                });
                            }}
                        />
                    )}
                    <Legend selectedCounty={selectedCounty} /> {/* Legend component */}
                </MapContainer>
                {uvData.length > 0 && (
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        zIndex: 1000,
                        background: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
                    }}>
                <UvBarChart uvData={uvData} /> Bar chart in the top right corner
                    </div>
                )}
            </div>
        </>
    );
};

export default MyMap;