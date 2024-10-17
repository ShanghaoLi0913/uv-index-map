import React from 'react';
import { Bar } from 'react-chartjs-2';

const UvBarChart = ({ uvData }) => {
    const data = {
        labels: uvData.map(item => item.state), // State names
        datasets: [
            {
                label: 'UV Index',
                data: uvData.map(item => item.value), // UV values for each state
                backgroundColor: 'rgba(255, 215, 0, 0.6)', // Semi-transparent yellow
                borderColor: 'rgba(255, 215, 0, 1)', // Solid yellow for the border
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y', // Set the bars to be vertical
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'UV Index',
                },
                ticks: {
                    padding: 10, // Space between the x-axis and the bars
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'States',
                },
                ticks: {
                    color: '#000', // Tick color
                    font: {
                        size: 14, // Font size for ticks
                    },
                    padding: 10, // Space between y-axis labels and bars
                },
            },
        },
        elements: {
            bar: {
                barPercentage: 0.5, // Adjust the width of the bars (0-1)
                categoryPercentage: 0.5, // Adjust space between bars (0-1)
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000', // Legend text color
                    font: {
                        size: 14, // Font size for legend
                    },
                },
            },
        },
    };

    return (
        <div style={{
            width: '400px',  // Set the desired width
            height: '600px', // Set the desired height
            backgroundColor: '#fff', // Background color for the chart
            borderRadius: '8px', // Rounded corners
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', // Subtle shadow
            padding: '10px', // Padding around the chart
        }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default UvBarChart;
