import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MyMap = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/cities.lst')
      .then(response => response.text())
      .then(text => {
        console.log('Cities data:', text);  // Log full cities data
        const parsedCities = text.split("\n").map((line, index) => {
          const parts = line.trim().split(/\s+/);
          const latitude = parseFloat(parts[3]);  // Update to the correct index
          const longitude = parseFloat(parts[4]); // Update to the correct index

          if (!isNaN(latitude) && !isNaN(longitude)) {
            console.log('Parsed City Data:', {
              city: parts[0],
              state: parts[1],
              latitude: latitude,
              longitude: longitude,
              elevation: parseFloat(parts[5]), // Elevation index
              stationCode: parts[6]  // Correct station code index
            });
            return {
              city: parts[0],
              state: parts[1],
              latitude: latitude,
              longitude: longitude,
              elevation: parseFloat(parts[5]),
              stationCode: parts[6]  // Correctly extract station code
            };
          } else {
            return null; // Skip invalid data
          }
        }).filter(city => city !== null); // Remove null entries

        console.log('Parsed Cities:', parsedCities);  // Log the parsed cities
        setCities(parsedCities);
      })
      .catch(error => console.error('Error loading file:', error));
  }, []);

  useEffect(() => {
    const fetchUvData = async () => {
      for (const city of cities) {
        try {
          const response = await axios.get(`${process.env.PUBLIC_URL}/2007/${city.stationCode}_07.dat`);
          console.log(`UV data for ${city.city}:`, response.data);
        } catch (error) {
          console.error(`Error fetching UV data for ${city.city}:`, error);
        }
      }
    };

    if (cities.length > 0) {
      fetchUvData();
    }
  }, [cities]);

  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((city, index) => (
        <Marker key={index} position={[city.latitude, city.longitude]}>
          <Popup>
            {city.city}, {city.state} <br /> Elevation: {city.elevation} meters
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MyMap;
