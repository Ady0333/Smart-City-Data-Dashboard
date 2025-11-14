// API Key - Replace this with your actual OpenWeatherMap API key
const API_KEY = "4f44388383ddc27f1c7cf69983a94794";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Get HTML elements
    const cityAInput = document.getElementById('cityAInput');
    const cityBInput = document.getElementById('cityBInput');
    const compareBtn = document.getElementById('compareBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // When user clicks the "Compare" button
    compareBtn.addEventListener('click', function() {
        const cityA = cityAInput.value.trim();
        const cityB = cityBInput.value.trim();
        
        if (cityA === '' || cityB === '') {
            alert('Please enter both city names!');
            return;
        }
        
        compareCities(cityA, cityB);
    });
    
    // Allow user to press Enter in input fields
    cityAInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            compareBtn.click();
        }
    });
    
    cityBInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            compareBtn.click();
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
    
    // Function to compare two cities
    async function compareCities(cityAName, cityBName) {
        try {
            // Fetch data for both cities at the same time
            // We use Promise.all to wait for both API calls to complete
            const [cityAData, cityBData] = await Promise.all([
                fetchCityData(cityAName),
                fetchCityData(cityBName)
            ]);
            
            // Update City A display
            updateCityDisplay('A', cityAData);
            
            // Update City B display
            updateCityDisplay('B', cityBData);
            
            alert('Comparison completed!');
            
        } catch (error) {
            console.error('Error comparing cities:', error);
            alert('Error comparing cities. Please check your API key and internet connection.');
        }
    }
    
    // Function to fetch data for a single city
    async function fetchCityData(cityName) {
        // Step 1: Convert city name to coordinates
        const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.length === 0) {
            throw new Error(`City "${cityName}" not found!`);
        }
        
        const lat = geocodeData[0].lat;
        const lon = geocodeData[0].lon;
        const country = geocodeData[0].country;
        const foundCityName = geocodeData[0].name;
        
        // Step 2: Get current weather data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        // Step 3: Get air pollution data
        const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        
        const pollutionResponse = await fetch(pollutionUrl);
        const pollutionData = await pollutionResponse.json();
        
        // Get population data (mock/static data)
        // In a real application, you would use a population API
        const population = getMockPopulation(foundCityName, country);
        
        // Return all the data we collected
        return {
            cityName: foundCityName,
            country: country,
            temperature: Math.round(weatherData.main.temp),
            humidity: weatherData.main.humidity,
            airQuality: pollutionData.list[0].main.aqi,
            pm25: pollutionData.list[0].components.pm2_5.toFixed(1),
            pm10: pollutionData.list[0].components.pm10.toFixed(1),
            population: population
        };
    }
    
    // Function to update the display for a city
    function updateCityDisplay(cityLetter, cityData) {
        // Update city name
        document.getElementById(`city${cityLetter}Name`).textContent = cityData.cityName;
        
        // Update temperature
        document.getElementById(`city${cityLetter}Temp`).textContent = `${cityData.temperature} °C`;
        
        // Update country
        document.getElementById(`city${cityLetter}Country`).textContent = cityData.country;
        
        // Update population
        document.getElementById(`city${cityLetter}Population`).textContent = cityData.population;
        
        // Update air quality
        const aqiText = getAQIText(cityData.airQuality);
        document.getElementById(`city${cityLetter}AQI`).textContent = aqiText;
        
        // Update PM2.5
        document.getElementById(`city${cityLetter}PM25`).textContent = cityData.pm25;
        
        // Update PM10
        document.getElementById(`city${cityLetter}PM10`).textContent = cityData.pm10;
        
        // Update humidity
        document.getElementById(`city${cityLetter}Humidity`).textContent = cityData.humidity;
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
    
    // Function to get mock population data
    // This is static/mock data as requested
    // In a real application, you would use an API like GeoDB Cities API
    function getMockPopulation(cityName, country) {
        // Simple mock data based on common city sizes
        // This is just for demonstration purposes
        const cityNameLower = cityName.toLowerCase();
        
        // Some well-known cities with approximate populations
        const knownCities = {
            'london': '9,000,000',
            'tokyo': '14,000,000',
            'new york': '8,500,000',
            'paris': '2,100,000',
            'mumbai': '20,000,000',
            'beijing': '21,000,000',
            'delhi': '32,000,000',
            'shanghai': '27,000,000',
            'sao paulo': '12,000,000',
            'moscow': '12,500,000',
            'cairo': '10,000,000',
            'dubai': '3,400,000',
            'singapore': '5,700,000',
            'sydney': '5,300,000',
            'toronto': '3,000,000',
            'berlin': '3,700,000',
            'madrid': '3,200,000',
            'rome': '2,800,000',
            'bangkok': '10,500,000',
            'jakarta': '10,800,000'
        };
        
        // Check if we have data for this city
        if (knownCities[cityNameLower]) {
            return knownCities[cityNameLower];
        }
        
        // If not found, generate a random but realistic population
        // Based on country and city name length (very simple heuristic)
        const randomPop = Math.floor(Math.random() * 5000000 + 500000);
        return randomPop.toLocaleString();
    }
});

