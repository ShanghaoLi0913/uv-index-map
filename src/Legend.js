import React from 'react';
import './Legend.css'; // Import CSS for styling the legend

const Legend = () => {
    return (
        <div className="legend">
            <h4>LEGEND</h4>
            <div>mW/m<sup>2</sup></div>
            <div>
                <div style={{ backgroundColor: '#FFFF00' }} className="legend-color"></div> 74 - 131
            </div>
            <div>
                <div style={{ backgroundColor: '#A0D9D3' }} className="legend-color"></div> >131 - 165
            </div>
            <div>
                <div style={{ backgroundColor: '#00BFFF' }} className="legend-color"></div> >165 - 186
            </div>
            <div>
                <div style={{ backgroundColor: '#0066FF' }} className="legend-color"></div> >186 - 198
            </div>
            <div>
                <div style={{ backgroundColor: '#00008B' }} className="legend-color"></div> >198 - 247
            </div>
        </div>
    );
};

export default Legend;
