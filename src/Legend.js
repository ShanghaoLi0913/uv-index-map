import React from 'react';
import './Legend.css'; // Import CSS for styling the legend

const Legend = () => {
    return (
        <div className="legend">
            <div className="legend-title">
                UV Irradiation
                <br />
                <span>mW/m²</span>
            </div>
            <div className="legend-item">
                <div style={{ backgroundColor: '#FFFFE0' }} className="legend-color"></div>
                <div className="legend-label">74 - 131</div>
            </div>
            <div className="legend-item">
                <div style={{ backgroundColor: '#FFD700' }} className="legend-color"></div>
                <div className="legend-label">&gt;131 - 165</div>
            </div>
            <div className="legend-item">
                <div style={{ backgroundColor: '#FFA500' }} className="legend-color"></div>
                <div className="legend-label">&gt;165 - 186</div>
            </div>
            <div className="legend-item">
                <div style={{ backgroundColor: '#FF8C00' }} className="legend-color"></div>
                <div className="legend-label">&gt;186 - 198</div>
            </div>
            <div className="legend-item">
                <div style={{ backgroundColor: '#FF4500' }} className="legend-color"></div>
                <div className="legend-label">&gt;198 - 247</div>
            </div>
        </div>
    );
};

export default Legend;
