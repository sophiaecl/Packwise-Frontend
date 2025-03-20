import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import _ from 'lodash';

const HistoricalWeatherVisualization = ({ historicalData }) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [weatherConditions, setWeatherConditions] = useState([]);
  const [uvData, setUvData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [uniqueDates, setUniqueDates] = useState([]);

  useEffect(() => {
    if (!historicalData || !historicalData.length) return;

    // Extract unique dates from historical data
    const dates = _.uniqBy(historicalData, 'date').map(item => {
      const dateObj = new Date(item.date);
      return {
        value: item.date,
        label: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`
      };
    });
    setUniqueDates(dates);
    setSelectedDate(dates[0].value);

    processData(historicalData);
  }, [historicalData]);

  useEffect(() => {
    if (selectedDate) {
      processData(historicalData);
    }
  }, [selectedDate, historicalData]);

  const processData = (data) => {
    if (!data || !data.length) return;

    // Process temperature data
    const tempData = data
      .filter(item => selectedDate ? item.date.includes(selectedDate.slice(-5)) : true)
      .map(item => ({
        year: item.year,
        minTemp: item.min_temp,
        maxTemp: item.max_temp,
        avgTemp: item.avg_temp
      }));
    
    setTemperatureData(tempData);

    // Process weather conditions
    const allConditions = [];
    data
      .filter(item => selectedDate ? item.date.includes(selectedDate.slice(-5)) : true)
      .forEach(item => {
        if (item.descriptions && item.descriptions.length) {
          allConditions.push(...item.descriptions);
        }
      });
    
    const conditionCounts = _.countBy(allConditions);
    const conditionData = Object.keys(conditionCounts).map(key => ({
      name: key,
      count: conditionCounts[key]
    }));
    
    setWeatherConditions(_.orderBy(conditionData, ['count'], ['desc']).slice(0, 5));

    // Process UV data
    const uvByYear = data
      .filter(item => selectedDate ? item.date.includes(selectedDate.slice(-5)) : true)
      .map(item => ({
        year: item.year,
        uv: item.uv_index
      }));
    
    setUvData(uvByYear);
  };

  const calculateAvgTemps = () => {
    if (!temperatureData.length) return { avgMin: 0, avgMax: 0 };
    
    const avgMin = _.meanBy(temperatureData, 'minTemp');
    const avgMax = _.meanBy(temperatureData, 'maxTemp');
    
    return { 
      avgMin: avgMin.toFixed(1), 
      avgMax: avgMax.toFixed(1) 
    };
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const { avgMin, avgMax } = calculateAvgTemps();

  return (
    <div className="historical-weather-container">
      <div className="chart-section">
        <div className="chart-container">
          <h4>Temperature History (°C)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="minTemp" stroke="#8884d8" name="Min Temp" />
              <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" name="Max Temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Weather Conditions</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weatherConditions} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#a8707d" name="Frequency" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>UV Index Over Years</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uvData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#ff8042" name="UV Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        .historical-weather-container {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          font-family: 'Playfair Display', serif;
        }
        
        .section-title {
          color: #455e46;
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 24px;
        }
        
        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .date-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .date-selector select {
          padding: 8px;
          border: 1px solid #a8707d;
          border-radius: 4px;
          background-color: #f0e7dd;
          color: #455e46;
          font-family: 'Playfair Display', serif;
        }
        
        .overview-section {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .overview-card {
          background-color: #f0e7dd;
          border: 1px solid #a8707d;
          border-radius: 8px;
          padding: 15px;
          flex: 1;
        }
        
        .overview-card h4 {
          color: #455e46;
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .overview-card p {
          margin: 5px 0;
          color: #68876a;
        }
        
        .chart-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .chart-container {
          background-color: #f0e7dd;
          border: 1px solid #a8707d;
          border-radius: 8px;
          padding: 15px;
        }
        
        .chart-container h4 {
          color: #455e46;
          margin-top: 0;
          margin-bottom: 10px;
          text-align: center;
          font-size: 18px;
        }
        
        @media (width <= 640px) {
          .filter-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .chart-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HistoricalWeatherVisualization;