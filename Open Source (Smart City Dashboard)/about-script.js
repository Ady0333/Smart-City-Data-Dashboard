// API Key - Replace this with your actual OpenWeatherMap API key
const API_KEY = "4f44388383ddc27f1c7cf69983a94794";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Get HTML elements
    const cityInput = document.getElementById('cityInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // When user clicks the "Load City Data" button
    fetchBtn.addEventListener('click', function() {
        const cityName = cityInput.value.trim();
        if (cityName === '') {
            alert('Please enter a city name!');
            return;
        }
        fetchCityDetails(cityName);
    });
    
    // Allow user to press Enter in the input field
    cityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchBtn.click();
        }
    });
    
    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', function() {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️ Light Mode';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            darkModeToggle.textContent = '🌙 Dark Mode';
        }
    });
    
    // Function to fetch city details from API
    async function fetchCityDetails(cityName) {
        try {
            // Step 1: Convert city name to coordinates
            const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
            
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();
            
            if (geocodeData.length === 0) {
                alert('City not found! Please check the spelling.');
                return;
            }
            
            const lat = geocodeData[0].lat;
            const lon = geocodeData[0].lon;
            
            // Step 2: Get current weather data
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            
            // Step 3: Get air pollution data
            const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
            
            const pollutionResponse = await fetch(pollutionUrl);
            const pollutionData = await pollutionResponse.json();
            
            // Update weather information
            updateWeatherInfo(weatherData);
            
            // Update air quality information
            updateAirQualityInfo(pollutionData);
            
            // Generate and display mock data for traffic, energy, and waste
            updateMockData();
            
            // alert('City data loaded successfully!');
            
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please check your API key and internet connection.');
        }
    }
    
    // Function to update weather information
    function updateWeatherInfo(weatherData) {
        document.getElementById('weatherTemp').textContent = Math.round(weatherData.main.temp);
        document.getElementById('weatherHumidity').textContent = weatherData.main.humidity;
        document.getElementById('weatherFeelsLike').textContent = Math.round(weatherData.main.feels_like);
        document.getElementById('weatherDesc').textContent = weatherData.weather[0].description;
    }
    
    // Function to update air quality information
    function updateAirQualityInfo(pollutionData) {
        const aqi = pollutionData.list[0].main.aqi;
        const aqiText = getAQIText(aqi);
        
        document.getElementById('aqiLevel').textContent = aqiText;
        document.getElementById('aqiPM25').textContent = pollutionData.list[0].components.pm2_5.toFixed(1);
        document.getElementById('aqiPM10').textContent = pollutionData.list[0].components.pm10.toFixed(1);
        document.getElementById('aqiStatus').textContent = getAQIStatus(aqi);
    }
    
    // Helper function to convert AQI number to text
    function getAQIText(aqi) {
        const aqiLabels = {
            1: 'Good',
            2: 'Fair',
            3: 'Moderate',
            4: 'Poor',
            5: 'Very Poor'
        };
        return aqiLabels[aqi] || 'Unknown';
    }
    
    // Helper function to get AQI status
    function getAQIStatus(aqi) {
        if (aqi === 1) return '✅ Safe';
        if (aqi === 2) return '✅ Acceptable';
        if (aqi === 3) return '⚠️ Sensitive groups should be cautious';
        if (aqi === 4) return '⚠️ Unhealthy for sensitive groups';
        return '❌ Unhealthy';
    }
    
    // Function to generate and display mock data
    // This is static/mock data as requested
    function updateMockData() {
        // Generate random but realistic mock data for traffic
        const trafficLevels = ['Low', 'Moderate', 'High', 'Very High'];
        const randomTraffic = trafficLevels[Math.floor(Math.random() * trafficLevels.length)];
        
        document.getElementById('trafficLevel').textContent = randomTraffic;
        document.getElementById('trafficMain').textContent = Math.floor(Math.random() * 40 + 30) + '%';
        document.getElementById('trafficHighway').textContent = Math.floor(Math.random() * 30 + 20) + '%';
        document.getElementById('trafficCenter').textContent = Math.floor(Math.random() * 50 + 40) + '%';
        
        // Generate mock data for energy consumption
        const currentEnergy = Math.floor(Math.random() * 200 + 800);
        const peakEnergy = Math.floor(currentEnergy * 1.3);
        const renewablePercent = Math.floor(Math.random() * 30 + 20);
        
        document.getElementById('energyCurrent').textContent = currentEnergy;
        document.getElementById('energyPeak').textContent = peakEnergy;
        document.getElementById('energyRenewable').textContent = renewablePercent;
        document.getElementById('energyStatus').textContent = currentEnergy < 900 ? '✅ Normal' : '⚠️ High';
        
        // Generate mock data for waste management
        const collectionRate = Math.floor(Math.random() * 10 + 85);
        const recyclingRate = Math.floor(Math.random() * 20 + 30);
        const dailyWaste = (Math.random() * 500 + 200).toFixed(1);
        
        document.getElementById('wasteCollection').textContent = collectionRate;
        document.getElementById('wasteRecycling').textContent = recyclingRate;
        document.getElementById('wasteDaily').textContent = dailyWaste;
        document.getElementById('wasteStatus').textContent = collectionRate > 90 ? '✅ Good' : '⚠️ Needs Improvement';
    }
});

