import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import Legend from './Legend'; // Import the component
import UvBarChart from './UvBarChart'; // Import the bar chart component
import { Chart, registerables } from 'chart.js';

// Register necessary Chart.js components
Chart.register(...registerables);

const MyMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [uvData, setUvData] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState(null); // State to track the selected county

    useEffect(() => {
        // Load GeoJSON data for county boundaries
        fetch(process.env.PUBLIC_URL + '/us-counties.json') // Make sure this file is in your 'public' folder
            .then(response => response.json())
            .then(data => {
                setGeoData(data);
            })
            .catch(error => console.error('Error loading GeoJSON:', error));

        // Load UV data from CSV
        Papa.parse(process.env.PUBLIC_URL + '/UV-2020-byCounty.csv', {
            download: true,
            header: true,
            complete: (results) => {
                const formattedData = aggregateUVByCounty(results.data); // Aggregate by county
                setUvData(formattedData);
            },
            error: (error) => console.error('Error loading CSV:', error),
        });
    }, []);

    // Aggregate the UV data by county and calculate the average UV value for each county
    const aggregateUVByCounty = (data) => {
        const countyUvData = {};

        data.forEach(row => {
            const countyFips = row.CountyFIPS;  // Use CountyFIPS from CSV
            const stateFips = row.StateFIPS;    // Use StateFIPS from CSV
            const uvValue = parseInt(row.Value.replace(',', ''), 10); // Remove commas and parse as integer

            const countyKey = `${stateFips}-${countyFips}`; // Key to uniquely identify each county

            if (countyUvData[countyKey]) {
                countyUvData[countyKey].total += uvValue;
                countyUvData[countyKey].count += 1;
            } else {
                countyUvData[countyKey] = { total: uvValue, count: 1 };
            }
        });

        // Calculate the average UV value for each county
        return Object.keys(countyUvData).map(countyKey => {
            const { total, count } = countyUvData[countyKey];
            return { countyKey, value: total / count }; // Average UV value for the county
        });
    };

    // Function to determine color based on UV index value
    const getColor = (value) => {
        if (value < 74) return '#FFAAAA'; // Light pink
        if (value >= 74 && value <= 131) return '#FFFF00'; // Yellow
        if (value > 131 && value <= 165) return '#FFD700'; // Gold
        if (value > 165 && value <= 186) return '#FFA500'; // Orange
        return '#FF4500'; // Red
    };

    // Function to determine the border color of the selected county
    const getBorderColor = (countyName) => {
        return selectedCounty === countyName ? '#FF0000' : 'white'; // Red border if selected
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
                                // Match the county UV data with GeoJSON features using StateFIPS and CountyFIPS
                                const countyUvData = uvData.find(data => 
                                    `${feature.properties.STATE}-${feature.properties.COUNTY}` === data.countyKey
                                );
                                return {
                                    fillColor: getColor(countyUvData ? countyUvData.value : 0),
                                    weight: 2,
                                    opacity: 1,
                                    color: getBorderColor(feature.properties.NAME), // Highlight border for selected county
                                    fillOpacity: 0.7,
                                };
                            }}
                            onEachFeature={(feature, layer) => {
                                // Show UV data in the popup for counties
                                const countyUvData = uvData.find(data => 
                                    `${feature.properties.STATE}-${feature.properties.COUNTY}` === data.countyKey
                                );
                                const average = countyUvData ? countyUvData.value : 0;
                                layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br />Average UV: ${average}`);
                                layer.on({
                                    click: () => {
                                        setSelectedCounty(feature.properties.NAME); // Set selected county
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
                        <UvBarChart uvData={uvData} /> {/* Bar chart in the top right corner */}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyMap;
