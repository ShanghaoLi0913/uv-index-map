import React from 'react';
import './Legend.css'; // Import CSS for styling the legend

const Legend = () => {
    return (
        <div className="legend">
            <h4>LEGEND</h4>
            <div>mW/m<sup>2</sup></div>
            <div>
                <div style={{ backgroundColor: '#FFFFE0' }} className="legend-color"></div> 74 - 131
            </div>
            <div>
                <div style={{ backgroundColor: '#FFD700' }} className="legend-color"></div> >131 - 165
            </div>
            <div>
                <div style={{ backgroundColor: '#FFA500' }} className="legend-color"></div> >165 - 186
            </div>
            <div>
                <div style={{ backgroundColor: '#FF8C00' }} className="legend-color"></div> >186 - 198
            </div>
            <div>
                <div style={{ backgroundColor: '#FF4500' }} className="legend-color"></div> >198 - 247
            </div>
        </div>
    );
};

export default Legend;
