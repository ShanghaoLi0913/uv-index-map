import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UvBarChartCounty = ({ uvData }) => {
    const [sortedData, setSortedData] = useState([]);  // State to hold the sorted data
    const [isSorted, setIsSorted] = useState(false); // To track if data is sorted

    // Calculate UV Index using the formula: UV Index = UV Irradiation * 0.001 * 40
    const calculateUVIndex = (irradiation) => {
        return irradiation * 0.001 * 40;
    };

    // Function to sort data
    const sortData = () => {
        const sorted = [...sortedData].sort((a, b) => b.uvIndex - a.uvIndex); // Sort by UV index descending
        setSortedData(sorted);
        setIsSorted(true);
    };

    const resetSort = () => {
        const unsortedData = uvData.map(item => ({
            ...item,
            uvIndex: calculateUVIndex(item.value), // Add UV index to each item
        }));
        setSortedData(unsortedData);  // Reset to original unsorted data
        setIsSorted(false);
    };

    // Set the sortedData with UV Index when uvData changes
    useEffect(() => {
        const dataWithIndex = uvData.map(item => ({
            ...item,
            uvIndex: calculateUVIndex(item.value) // Add UV index to each item
        }));

        // Set the initial sorted data based on UV index
        setSortedData(dataWithIndex);
    }, [uvData]); // This will run whenever uvData changes

    const getBarColor = (value) => {
        if (value <= 2) return 'rgba(32, 25, 245, 0.6)';
        if (value <= 5) return 'rgba(96, 29, 240, 0.6)';
        if (value <= 7) return 'rgba(154, 26, 240, 0.6)';
        if (value <= 10) return 'rgba(192, 26, 218, 0.6)';
        return 'rgba(240, 19, 188, 0.6)';
    };

    // Prepare the data for the chart
    const data = {
        labels: sortedData.map(item => item.County),
        datasets: [
            {
                label: 'UV Index',
                data: sortedData.map(item => item.uvIndex), // Use UV Index instead of irradiation value
                backgroundColor: sortedData.map(item => getBarColor(item.uvIndex)),
                borderColor: sortedData.map(item => getBarColor(item.uvIndex).replace(/0.6/, '1')),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'UV Index',
                },
                ticks: {
                    padding: 10,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Counties',
                },
                ticks: {
                    color: '#000',
                    font: {
                        size: 10,
                    },
                    padding: 10,
                },
            },
        },
        elements: {
            bar: {
                barPercentage: 0.8,
                categoryPercentage: 0.5,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `UV Index: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Button to toggle sorting */}
            <button onClick={isSorted ? resetSort : sortData} style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 10,
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
            }}>
                {isSorted ? 'Reset Order' : 'Sort by UV Index'}
            </button>
            <Bar data={data} options={options} />
        </div>
    );
};

UvBarChartCounty.propTypes = {
    uvData: PropTypes.arrayOf(
        PropTypes.shape({
            County: PropTypes.string.isRequired,
            CountyFIPS: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired, // This is UV Irradiation value
        })
    ).isRequired,
};

export default UvBarChartCounty;
