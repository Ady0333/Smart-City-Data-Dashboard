// API Key - Replace this with your actual OpenWeatherMap API key
const API_KEY = "4f44388383ddc27f1c7cf69983a94794";

// Variables to store current city data
let currentCityData = {
    cityName: "",
    temperature: null,
    humidity: null,
    airQuality: null,
    pm25: null,
    pm10: null,
    historicalData: {
        temperature: [],
        humidity: [],
        airQuality: [],
        pm25: [],
        pm10: []
    }
};

// Variable to store which block is currently selected
let selectedBlock = null;

// Variable to store the Chart.js chart object
let dataChart = null;

// Wait for the page to load before running code
document.addEventListener('DOMContentLoaded', function() {
    // Get all the HTML elements we need
    const cityInput = document.getElementById('cityInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Get all the data blocks
    const temperatureBlock = document.getElementById('temperatureBlock');
    const humidityBlock = document.getElementById('humidityBlock');
    const airQualityBlock = document.getElementById('airQualityBlock');
    const pollutionBlock = document.getElementById('pollutionBlock');
    
    // Get the chart canvas element
    const chartCanvas = document.getElementById('dataChart');
    
    // Initialize the chart (empty at first)
    initializeChart();
    
    // When user clicks the "Fetch Data" button
    fetchBtn.addEventListener('click', function() {
        const cityName = cityInput.value.trim();
        if (cityName === '') {
            alert('Please enter a city name!');
            return;
        }
        fetchCityData(cityName);
    });
    
    // Allow user to press Enter in the input field
    cityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchBtn.click();
        }
    });
    
    // When user clicks on Temperature block
    temperatureBlock.addEventListener('click', function() {
        selectBlock('temperature');
        updateChart('temperature');
    });
    
    // When user clicks on Humidity block
    humidityBlock.addEventListener('click', function() {
        selectBlock('humidity');
        updateChart('humidity');
    });
    
    // When user clicks on Air Quality block
    airQualityBlock.addEventListener('click', function() {
        selectBlock('airQuality');
        updateChart('airQuality');
    });
    
    // When user clicks on Pollution block
    pollutionBlock.addEventListener('click', function() {
        selectBlock('pollution');
        updateChart('pollution');
    });
    
    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', function() {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            // Switch to dark mode
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️ Light Mode';
        } else {
            // Switch to light mode
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            darkModeToggle.textContent = '🌙 Dark Mode';
        }
    });
    
    // Function to initialize an empty chart
    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        dataChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5'],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Select a data block to view chart'
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Function to fetch data for a city
    async function fetchCityData(cityName) {
        try {
            // Step 1: Convert city name to coordinates (latitude and longitude)
            // We use the Geocoding API for this
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
            
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();
            
            // Check if city was found
            if (geocodeData.length === 0) {
                alert('City not found! Please check the spelling.');
                return;
            }
            
            // Get latitude and longitude from the response
            const lat = geocodeData[0].lat;
            const lon = geocodeData[0].lon;
            const foundCityName = geocodeData[0].name;
            
            // Step 2: Get current weather data
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            
            // Step 3: Get air pollution data
            const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            
            const pollutionResponse = await fetch(pollutionUrl);
            const pollutionData = await pollutionResponse.json();
            
            // Store the data in our variable
            currentCityData.cityName = foundCityName;
            currentCityData.temperature = Math.round(weatherData.main.temp);
            currentCityData.humidity = weatherData.main.humidity;
            currentCityData.airQuality = pollutionData.list[0].main.aqi;
            currentCityData.pm25 = pollutionData.list[0].components.pm2_5;
            currentCityData.pm10 = pollutionData.list[0].components.pm10;
            
            // Generate historical data (last 5 hours)
            generateHistoricalData();
            
            // Update the display blocks with new data
            updateDataBlocks();
            
            // Show success message
            // alert(`Data fetched successfully for ${foundCityName}!`);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please check your API key and internet connection.');
        }
    }
    
    // Function to generate historical data (simulated)
    // In a real application, you would fetch actual historical data from an API
    function generateHistoricalData() {
        // Clear previous historical data
        currentCityData.historicalData = {
            temperature: [],
            humidity: [],
            airQuality: [],
            pm25: [],
            pm10: []
        };
        
        // Generate 5 data points (representing last 5 hours)
        // We add small random variations to make it look realistic
        for (let i = 4; i >= 0; i--) {
            // Temperature: vary by ±3 degrees
            const tempVariation = (Math.random() * 6) - 3;
            currentCityData.historicalData.temperature.push(
                Math.round(currentCityData.temperature + tempVariation)
            );
            
            // Humidity: vary by ±5%
            const humidityVariation = (Math.random() * 10) - 5;
            currentCityData.historicalData.humidity.push(
                Math.round(currentCityData.humidity + humidityVariation)
            );
            
            // Air Quality: vary by ±1 AQI point
            const aqiVariation = Math.round((Math.random() * 2) - 1);
            currentCityData.historicalData.airQuality.push(
                Math.max(1, Math.min(5, currentCityData.airQuality + aqiVariation))
            );
            
            // PM2.5: vary by ±2
            const pm25Variation = (Math.random() * 4) - 2;
            currentCityData.historicalData.pm25.push(
                Math.max(0, Math.round(currentCityData.pm25 + pm25Variation))
            );
            
            // PM10: vary by ±3
            const pm10Variation = (Math.random() * 6) - 3;
            currentCityData.historicalData.pm10.push(
                Math.max(0, Math.round(currentCityData.pm10 + pm10Variation))
            );
        }
    }
    
    // Function to update the data blocks with current values
    function updateDataBlocks() {
        // Update temperature
        document.getElementById('tempValue').textContent = 
            currentCityData.temperature !== null ? currentCityData.temperature : '--';
        
        // Update humidity
        document.getElementById('humidityValue').textContent = 
            currentCityData.humidity !== null ? currentCityData.humidity : '--';
        
        // Update air quality (convert number to text)
        const aqiText = getAQIText(currentCityData.airQuality);
        document.getElementById('aqiValue').textContent = 
            currentCityData.airQuality !== null ? aqiText : '--';
        
        // Update pollution (show PM2.5 and PM10)
        document.getElementById('pollutionValue').textContent = 
            currentCityData.pm25 !== null && currentCityData.pm10 !== null 
                ? `${currentCityData.pm25} / ${currentCityData.pm10}` 
                : '--';
    }
    
    // Helper function to convert AQI number to text
    function getAQIText(aqi) {
        if (aqi === null) return '--';
        const aqiLabels = {
            1: 'Good',
            2: 'Fair',
            3: 'Moderate',
            4: 'Poor',
            5: 'Very Poor'
        };
        return aqiLabels[aqi] || aqi;
    }
    
    // Function to highlight the selected block
    function selectBlock(blockType) {
        // Remove 'active' class from all blocks
        temperatureBlock.classList.remove('active');
        humidityBlock.classList.remove('active');
        airQualityBlock.classList.remove('active');
        pollutionBlock.classList.remove('active');
        
        // Add 'active' class to the clicked block
        selectedBlock = blockType;
        if (blockType === 'temperature') {
            temperatureBlock.classList.add('active');
        } else if (blockType === 'humidity') {
            humidityBlock.classList.add('active');
        } else if (blockType === 'airQuality') {
            airQualityBlock.classList.add('active');
        } else if (blockType === 'pollution') {
            pollutionBlock.classList.add('active');
        }
    }
    
    // Function to update the chart based on selected block
    function updateChart(blockType) {
        // Check if we have data
        if (currentCityData.cityName === '') {
            alert('Please fetch city data first!');
            return;
        }
        
        // Get the chart title element
        const chartTitle = document.getElementById('chartTitle');
        
        // Prepare data for the chart
        let chartData = [];
        let chartLabel = '';
        let chartTitleText = '';
        let backgroundColor = '';
        let borderColor = '';
        
        if (blockType === 'temperature') {
            chartData = currentCityData.historicalData.temperature;
            chartLabel = 'Temperature (°C)';
            chartTitleText = `Temperature Trend - ${currentCityData.cityName}`;
            backgroundColor = 'rgba(74, 144, 226, 0.2)';
            borderColor = 'rgba(74, 144, 226, 1)';
        } else if (blockType === 'humidity') {
            chartData = currentCityData.historicalData.humidity;
            chartLabel = 'Humidity (%)';
            chartTitleText = `Humidity Trend - ${currentCityData.cityName}`;
            backgroundColor = 'rgba(46, 204, 113, 0.2)';
            borderColor = 'rgba(46, 204, 113, 1)';
        } else if (blockType === 'airQuality') {
            chartData = currentCityData.historicalData.airQuality;
            chartLabel = 'Air Quality Index';
            chartTitleText = `Air Quality Trend - ${currentCityData.cityName}`;
            backgroundColor = 'rgba(241, 196, 15, 0.2)';
            borderColor = 'rgba(241, 196, 15, 1)';
        } else if (blockType === 'pollution') {
            // For pollution, we show both PM2.5 and PM10
            chartTitleText = `Pollution Trend - ${currentCityData.cityName}`;
            dataChart.data.datasets = [
                {
                    label: 'PM2.5',
                    data: currentCityData.historicalData.pm25,
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'PM10',
                    data: currentCityData.historicalData.pm10,
                    backgroundColor: 'rgba(192, 57, 43, 0.2)',
                    borderColor: 'rgba(192, 57, 43, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ];
            dataChart.update();
            chartTitle.textContent = chartTitleText;
            return;
        }
        
        // Update chart with single dataset
        dataChart.data.datasets = [{
            label: chartLabel,
            data: chartData,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }];
        
        // Update chart title
        chartTitle.textContent = chartTitleText;
        
        // Update the chart
        dataChart.update();
    }
});
