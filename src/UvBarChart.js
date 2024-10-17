import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const UvBarChart = ({ uvData }) => {
    const getBarColor = (value) => {
        if (value >= 74 && value <= 131) return 'rgba(255, 215, 0, 0.6)'; // Light Yellow
        if (value > 131 && value <= 165) return 'rgba(255, 204, 0, 0.6)'; // Medium Yellow
        if (value > 165 && value <= 186) return 'rgba(255, 153, 0, 0.6)'; // Dark Yellow
        if (value > 186 && value <= 198) return 'rgba(255, 102, 0, 0.6)'; // Light Orange
        return 'rgba(255, 0, 0, 0.6)'; // Red for values above 198
    };

    const data = {
        labels: uvData.map(item => item.state),
        datasets: [
            {
                label: 'UV Index',
                data: uvData.map(item => item.value),
                backgroundColor: uvData.map(item => getBarColor(item.value)),
                borderColor: uvData.map(item => getBarColor(item.value).replace(/0.6/, '1')),
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
                    text: 'States',
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
                barPercentage: 0.8, // Adjust this value to change the width of the bars
                categoryPercentage: 0.5, // Adjust this value to change the spacing between the bars
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
        maintainAspectRatio: false, // Allows the chart to fill the height of the container
    };

    return (
        <div style={{
            width: '400px',
            height: '600px', // Fixed height for the chart (adjust as needed)
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '10px',
        }}>
            <Bar data={data} options={options} />
        </div>
    );
};

UvBarChart.propTypes = {
    uvData: PropTypes.arrayOf(
        PropTypes.shape({
            state: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default UvBarChart;
