import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample UV index data for cities
const cities = [
  { name: 'Albuquerque', uvIndex: 5.5, lat: 35.0844, lon: -106.6504 },
  { name: 'Los Angeles', uvIndex: 6.2, lat: 34.0522, lon: -118.2437 },
  { name: 'New York', uvIndex: 4.8, lat: 40.7128, lon: -74.0060 },
  // Add more cities as needed
];

function MapComponent() {
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
            UV Index: {city.uvIndex}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
