import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';
import UvBarChartCounty from './UvBarChartCounty'; // import the County bar chart component
import Legend from './Legend'; // import the Legend component

// Register necessary Chart.js components
Chart.register(...registerables);

const MyMap = ({ uvData, setUvData }) => {
  const [geoData, setGeoData] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null); // State to track the selected county
  const [stateUvData, setStateUvData] = useState([]); // To store UV data for all counties in the selected state

  useEffect(() => {
    // Load GeoJSON data for state boundaries
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
          County: row.County,               // Extract County name
          CountyFIPS: row.CountyFIPS,       // Extract CountyFIPS
          value: parseInt(row.Value, 10),   // Convert the Value to an integer
          State: row.State                  // Include State information
        }));
        setUvData(formattedData);  // Store the formatted data in state
      },
      error: (error) => console.error('Error loading CSV:', error),
    });
  }, [setUvData]);

  // This function will update the `stateUvData` whenever a new county is selected
  useEffect(() => {
    if (selectedCounty) {
      const selectedCountyState = selectedCounty.slice(0, 2); // Get the first two digits of CountyFIPS as state code

      // Safely filter counties by checking if CountyFIPS and State are valid
      const countiesInState = uvData.filter(item => 
        item.CountyFIPS && item.CountyFIPS.startsWith(selectedCountyState) && item.State
      );
      setStateUvData(countiesInState); // Update the bar chart with all counties in the same state
    }
  }, [selectedCounty, uvData]);

  const getColor = (value) => {
    if (value < 74) return '#FFAAAA'; // Light Yellow
    if (value >= 74 && value <= 131) return '#FFFF00'; // Yellow
    if (value > 131 && value <= 165) return '#FFD700'; // Gold
    if (value > 165 && value <= 186) return '#FFA500'; // Orange
    return '#FF4500'; // Red
  };

  const getBorderColor = (countyFIPS) => {
    return selectedCounty === countyFIPS ? '#FF0000' : 'white'; // Red border if the county is selected
  };

  // Calculate height dynamically based on the number of counties
  const calculateChartHeight = () => {
    const countiesCount = stateUvData.length;
    const minHeight = 300; // Minimum height
    const maxHeight = 600; // Maximum height
    const heightPerCounty = 30; // Height per county (you can adjust this value)

    let dynamicHeight = countiesCount * heightPerCounty;
    if (dynamicHeight < minHeight) dynamicHeight = minHeight;
    if (dynamicHeight > maxHeight) dynamicHeight = maxHeight;

    return dynamicHeight;
  };

  return (
    <div className="map-container" style={{ position: "relative", height: "100%" }}>
      <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={(feature) => {
              const countyFIPS = feature.properties.STATE + feature.properties.COUNTY;
              const stateUvData = uvData.find(data => data.CountyFIPS === countyFIPS);
              return {
                fillColor: getColor(stateUvData ? stateUvData.value : 0),
                weight: 2,
                opacity: 1,
                color: getBorderColor(countyFIPS), // Use CountyFIPS for border color
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={(feature, layer) => {
              const countyFIPS = feature.properties.STATE + feature.properties.COUNTY;
              const stateUvData = uvData.find(data => data.CountyFIPS === countyFIPS);
              const average = stateUvData ? stateUvData.value : 0;
              layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br />Average: ${average}`);
              layer.on({
                click: () => {
                  setSelectedCounty(countyFIPS); // Set the selected county
                }
              });
            }}
          />
        )}
      </MapContainer>

      {/* Display Legend on the bottom left */}
      <Legend /> 

      {/* Only display UvBarChartCounty inside the map when a county is selected */}
      {selectedCounty && (
        <div style={{
          position: "absolute",
          top: "10px", // adjust positioning as needed
          right: "10px", // adjust positioning as needed
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          width: '300px', // adjust width as needed
          height: `${calculateChartHeight()}px`, // Dynamically adjust height
        }}>
          <UvBarChartCounty uvData={stateUvData} />
        </div>
      )}
    </div>
  );
};

export default MyMap;
