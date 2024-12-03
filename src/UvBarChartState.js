import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UvBarChartState = ({ uvData }) => {
  const [sortedData, setSortedData] = useState([]);  // State to hold the sorted data
  const [isSorted, setIsSorted] = useState(false); // To track if data is sorted

  // Function to aggregate UV Index by state (average or sum)
  const aggregateUVData = () => {
    const stateData = {};

    uvData.forEach(item => {
      if (!item.CountyFIPS) {
        console.warn('Invalid CountyFIPS:', item);
        return;
      }

      const stateCode = item.CountyFIPS.slice(0, 2);
      const uvIndex = item.value * 0.001 * 40;

      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          stateName: getStateName(stateCode),
          totalUVIndex: 0,
          count: 0,
        };
      }

      stateData[stateCode].totalUVIndex += uvIndex;
      stateData[stateCode].count += 1;
    });

    return Object.keys(stateData).map(stateCode => ({
      stateCode,
      stateName: stateData[stateCode].stateName,
      avgUVIndex: stateData[stateCode].totalUVIndex / stateData[stateCode].count,
    }));
  };

  const getStateName = (stateCode) => {
    const states = {
      '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas', '06': 'California',
      '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware', '11': 'District of Columbia',
      '12': 'Florida', '13': 'Georgia', '15': 'Hawaii', '16': 'Idaho', '17': 'Illinois',
      '18': 'Indiana', '19': 'Iowa', '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana',
      '23': 'Maine', '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
      '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska', '32': 'Nevada',
      '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico', '36': 'New York',
      '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio', '40': 'Oklahoma', '41': 'Oregon',
      '42': 'Pennsylvania', '44': 'Rhode Island', '45': 'South Carolina', '46': 'South Dakota',
      '47': 'Tennessee', '48': 'Texas', '49': 'Utah', '50': 'Vermont', '51': 'Virginia',
      '53': 'Washington', '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming',
    };
    return states[stateCode] || 'Unknown State';
  };

  const sortData = () => {
    const sorted = [...sortedData].sort((a, b) => b.avgUVIndex - a.avgUVIndex);
    setSortedData(sorted);
    setIsSorted(true);
  };

  const resetSort = () => {
    const unsortedData = aggregateUVData();
    setSortedData(unsortedData);
    setIsSorted(false);
  };

  useEffect(() => {
    const dataWithIndex = aggregateUVData();
    setSortedData(dataWithIndex);
  }, [uvData]);

  const getBarColor = (value) => {
    if (value <= 2) return 'rgba(32, 25, 245, 0.6)';
    if (value <= 5) return 'rgba(96, 29, 240, 0.6)';
    if (value <= 7) return 'rgba(154, 26, 240, 0.6)';
    if (value <= 10) return 'rgba(192, 26, 218, 0.6)';
    return 'rgba(240, 19, 188, 0.6)';
  };

  const data = {
    labels: sortedData.map(item => item.stateName),
    datasets: [
      {
        label: 'Average UV Index by State',
        data: sortedData.map(item => item.avgUVIndex),
        backgroundColor: sortedData.map(item => getBarColor(item.avgUVIndex)),
        borderColor: sortedData.map(item => getBarColor(item.avgUVIndex).replace(/0.6/, '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        title: { display: true, text: 'UV Index' },
        ticks: { padding: 10 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'States' },
        ticks: { color: '#000', font: { size: 10 }, padding: 10 },
      },
    },
    elements: { bar: { barPercentage: 0.8, categoryPercentage: 0.5 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Average UV Index: ${tooltipItem.raw}`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={isSorted ? resetSort : sortData}
          style={{
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
          }}
        >
          {isSorted ? 'Reset Order' : 'Sort by UV Index'}
        </button>

        {/* Set a fixed height of 600px */}
        <Bar data={data} options={options} height={650} />
      </div>
    </div>
  );
};

UvBarChartState.propTypes = {
  uvData: PropTypes.arrayOf(
    PropTypes.shape({
      County: PropTypes.string.isRequired,
      CountyFIPS: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired, // This is UV Irradiation value
    })
  ).isRequired,
};

export default UvBarChartState;
