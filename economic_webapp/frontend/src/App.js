import './App.css';
import axios from "axios";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useState} from "react";


// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// List of countries
const countries = [
  { label: "Mexico", value: "Mexico" },
  { label: " New Zealand", value: "New Zealand" },
  { label: "Sweden", value: "Sweden" },
  { label: "Thailand", value: "Thailand" },
];


const App = () => {
  const [selectedCountry1, setSelectedCountry1] = useState(null);
  const [selectedCountry2, setSelectedCountry2] = useState(null);
  const [gdpData, setGdpData] = useState(null);
  const [error, setError] = useState("");


 // Fetch GDP Data
  const fetchGDPData = async () => {
    setError("");
    setGdpData(null);

    if (!selectedCountry1 || !selectedCountry2) {
      setError("Please select both countries.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/compare?country1=${selectedCountry1.value}&country2=${selectedCountry2.value}`
      );
      setGdpData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data.");
    }
  };

  // Prepare data for Chart.js
  const prepareChartData = () => {
    if (!gdpData || !selectedCountry1 || !selectedCountry2) return null;
  
    // Check if selected countries exist in the response
    const country1Data = gdpData[selectedCountry1.value] || {};
    const country2Data = gdpData[selectedCountry2.value] || {};
  
    // Extract years and GDP values
    const years = Object.keys(country1Data).length ? Object.keys(country1Data) : Object.keys(country2Data);
    
    if (!years.length) return null; // No valid data
  
    const country1GDP = years.map((year) => country1Data[year] || null);
    const country2GDP = years.map((year) => country2Data[year] || null);
  
    return {
      labels: years,
      datasets: [
        {
          label: selectedCountry1.label,
          data: country1GDP,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.3)",
          fill: true,
        },
        {
          label: selectedCountry2.label,
          data: country2GDP,
          borderColor: "red",
          backgroundColor: "rgba(255, 0, 0, 0.3)",
          fill: true,
        },
      ], 

    };
  };

  const chartOptions = {
    plugins : {
      title: {
        display: true, 
        text: `GDP Comparison of ${selectedCountry1?.label} and ${selectedCountry2?.label}`, 
        font: { size: 18 }, 
      }, 
    }, 
        
    scales: { 
      x: { 
        title: { 
          display: true, 
          text: "Year", 
          font: { size: 14,
                  weight: "bold",
            }, 
        }, 
      }, 
      
      y: { 
        title: { 
          display: true, 
          text: "GDP (in Billions USD)", 
          font: { size: 14 ,
                  weight: "bold",
                }, 
        }, 
        beginAtZero: true, }, 
      }, 
    };
  

  return (
    <div style={styles.container}>
      <h2>Compare GDP of Two Countries</h2>

      <div style={styles.dropdownContainer}>
        <Select
          options={countries}
          value={selectedCountry1}
          onChange={setSelectedCountry1}
          placeholder="Select first country"
          styles={styles.dropdown}
        />
        <Select
          options={countries}
          value={selectedCountry2}
          onChange={setSelectedCountry2}
          placeholder="Select second country"
          styles={styles.dropdown}
        />
        <button onClick={fetchGDPData} style={styles.button}>Compare</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {gdpData && prepareChartData() && (
        <div style={styles.chartContainer}>
          <h3>GDP Trend Comparison</h3>
          <Line data={prepareChartData()} options={chartOptions} />
        </div>
      )}
    </div>
  );
};



// Styles
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  dropdownContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  dropdown: {
    width: "200px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  chartContainer: {
    width: "80%",
    margin: "auto",
  },
};


export default App;
