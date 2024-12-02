import React, { useState } from 'react';
import MapComponent from './MapComponent';
import UvBarChart from './UvBarChart';
import './App.css';

function App() {
  const [uvData, setUvData] = useState([]);

  return (
    <div className="App">
      <h1>UV Index Map - 2020</h1>
      <div className="main-container">
        <div className="placeholder">
          {/* This space can later be used for another component or feature  */}
        </div>
        <div className="map-container">
          <MapComponent uvData={uvData} setUvData={setUvData} />
        </div>
        <div className="bar-chart-container">
          <UvBarChart uvData={uvData} />
        </div>
      </div>
    </div>
  );
}

export default App;
