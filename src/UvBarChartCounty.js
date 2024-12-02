import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UvBarChartCounty = ({ uvData }) => {
  const [sortedData, setSortedData] = useState(uvData);  // State to hold the sorted data
  const [isSorted, setIsSorted] = useState(false); // To track if data is sorted

  // Effect to handle the sorting state and update data on initial render
  useEffect(() => {
    setSortedData(uvData);  // Ensure initial data is set correctly
  }, [uvData]);

  const getBarColor = (value) => {
    if (value < 74) return 'rgba(255, 215, 0, 0.6)';
    if (value >= 74 && value <= 131) return 'rgba(255, 204, 0, 0.6)';
    if (value > 131 && value <= 165) return 'rgba(255, 153, 0, 0.6)';
    if (value > 165 && value <= 186) return 'rgba(255, 102, 0, 0.6)';
    return 'rgba(255, 0, 0, 0.6)';
  };

  const sortData = () => {
    const sorted = [...sortedData].sort((a, b) => b.value - a.value); // Sort by UV value descending
    setSortedData(sorted);
    setIsSorted(true);
  };

  const resetSort = () => {
    setSortedData(uvData);  // Reset to original unsorted data
    setIsSorted(false);
  };

  const data = {
    labels: sortedData.map(item => item.County),
    datasets: [
      {
        label: 'UV Index',
        data: sortedData.map(item => item.value),
        backgroundColor: sortedData.map(item => getBarColor(item.value)),
        borderColor: sortedData.map(item => getBarColor(item.value).replace(/0.6/, '1')),
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
        left: '10px',
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
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default UvBarChartCounty;
