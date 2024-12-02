import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import Legend from './Legend';
import { Chart, registerables } from 'chart.js';
import UvBarChart from './UvBarChart'; // Import the bar chart component

// Register necessary Chart.js components
Chart.register(...registerables);

const MyMap = ({ uvData, setUvData }) => {
    const [geoData, setGeoData] = useState(null);
    const [selectedCounty, setSelectedCounty] = useState(null);

    useEffect(() => {
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
                const formattedData = results.data.map(row => ({
                    County: row.County,
                    CountyFIPS: row.CountyFIPS,
                    value: parseInt(row.Value, 10),
                }));
                setUvData(formattedData);  // Set the data in state
            },
            error: (error) => console.error('Error loading CSV:', error),
        });
    }, [setUvData]);

    const getColor = (value) => {
        if (value < 74) return '#FFAAAA'; // Light Yellow
        if (value >= 74 && value <= 131) return '#FFFF00'; // Yellow
        if (value > 131 && value <= 165) return '#FFD700'; // Gold
        if (value > 165 && value <= 186) return '#FFA500'; // Orange
        return '#FF4500'; // Red
    };

    const getBorderColor = (countyFIPS) => {
        return selectedCounty === countyFIPS ? '#FF0000' : 'white';
    };

    return (
        <div style={{ position: "relative", height: "100%" }}>
            <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={(feature) => {
                            const countyUvData = uvData.find(data => data.CountyFIPS === feature.properties.STATE + feature.properties.COUNTY);
                            return {
                                fillColor: getColor(countyUvData ? countyUvData.value : 0),
                                weight: 2,
                                opacity: 1,
                                color: getBorderColor(feature.properties.STATE + feature.properties.COUNTY),
                                fillOpacity: 0.7,
                            };
                        }}
                        onEachFeature={(feature, layer) => {
                            const countyUvData = uvData.find(data => data.CountyFIPS === feature.properties.STATE + feature.properties.COUNTY);
                            const average = countyUvData ? countyUvData.value : 0;
                            layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br />Average: ${average}`);
                            layer.on({
                                click: () => {
                                    setSelectedCounty(feature.properties.STATE + feature.properties.COUNTY);
                                }
                            });
                        }}
                    />
                )}
                <Legend selectedCounty={selectedCounty} />
            </MapContainer>
        </div>
    );
};

export default MyMap;
