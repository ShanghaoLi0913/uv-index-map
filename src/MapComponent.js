import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapComponent() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch the cities.lst file from the hosted URL
    fetch('https://example.com/cities.lst')  // Replace with your actual URL
      .then(response => response.text())
      .then(data => {
        const parsedCities = parseCitiesLst(data);
        setCities(parsedCities);
      })
      .catch(error => console.error('Error loading cities:', error));
  }, []);

  // Function to parse the cities.lst file
  const parseCitiesLst = (data) => {
    const lines = data.split('\n');
    const citiesArray = [];

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        const city = {
          name: parts.slice(0, -6).join(' '), // City name (handles names with spaces)
          lat: parseFloat(parts[parts.length - 6]), // Latitude
          lon: parseFloat(parts[parts.length - 5]), // Longitude
          uvIndex: Math.random() * 10 + 1, // Simulated UV index for demo purposes
        };
        citiesArray.push(city);
      }
    });

    return citiesArray;
  };

  return (
    <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cities.map((city, index) => (
        <Marker key={index} position={[city.lat, city.lon]}>
          <Popup>
            <strong>{city.name}</strong><br />
            UV Index: {city.uvIndex.toFixed(2)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
