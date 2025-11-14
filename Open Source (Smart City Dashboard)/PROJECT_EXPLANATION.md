# Smart City Dashboard - Project Explanation

This document explains how each part of the Smart City Dashboard project works in simple terms.

## 📁 Project Structure

The project consists of 7 main files:
- `index.html` - Main dashboard page
- `about.html` - About City information page
- `compare.html` - City comparison page
- `style.css` - All styling for all pages
- `script.js` - JavaScript for main dashboard
- `about-script.js` - JavaScript for About City page
- `compare-script.js` - JavaScript for Compare Cities page

---

## 🏠 Main Dashboard (index.html + script.js)

### How It Works:

1. **User Input**: User types a city name in the input box and clicks "Fetch Data"

2. **API Calls** (in order):
   - **Geocoding API**: Converts city name → latitude & longitude
   - **Weather API**: Gets temperature and humidity using lat/lon
   - **Air Pollution API**: Gets AQI, PM2.5, and PM10 values

3. **Data Display**: The four blocks show:
   - Temperature (in °C)
   - Humidity (in %)
   - Air Quality (as text: Good, Fair, Moderate, etc.)
   - Pollution (PM2.5 / PM10 values)

4. **Historical Data**: Since we don't have real historical data, the code generates 5 simulated data points by adding small random variations to current values.

5. **Chart Updates**: When user clicks any block:
   - That block gets highlighted (active state)
   - The chart below updates to show the trend for that data type
   - For Pollution, it shows both PM2.5 and PM10 lines

### Key JavaScript Concepts Used:

- **Variables**: Store city data, chart object, selected block
- **Functions**: `fetchCityData()`, `updateChart()`, `selectBlock()`
- **Event Listeners**: Click events on buttons and blocks
- **DOM Manipulation**: Updating text content, adding/removing CSS classes
- **Async/Await**: For making API calls with `fetch()`
- **Chart.js**: Library to create and update line charts

---

## 📊 About City Page (about.html + about-script.js)

### How It Works:

1. **User Input**: User enters a city name and clicks "Load City Data"

2. **Real Data** (from APIs):
   - Weather: Temperature, humidity, feels-like temperature, description
   - Air Quality: AQI level, PM2.5, PM10, status

3. **Mock Data** (generated in code):
   - **Traffic Density**: Random values for main roads, highways, city center
   - **Energy Consumption**: Random MW values, renewable percentage
   - **Waste Management**: Random collection rate, recycling rate, daily waste

4. **Display**: All information shown in 5 cards using a grid layout

### Why Mock Data?

Real-time traffic, energy, and waste data require special APIs that are expensive or not publicly available. So we use mock/static data for demonstration.

---

## ⚖️ Compare Cities Page (compare.html + compare-script.js)

### How It Works:

1. **User Input**: User enters two city names (City A and City B)

2. **Parallel API Calls**: 
   - Uses `Promise.all()` to fetch data for both cities at the same time
   - This is faster than fetching one after another

3. **Data Fetched**:
   - Temperature, humidity, air quality, PM2.5, PM10 (from APIs)
   - Country name (from Geocoding API)
   - Population (mock data - see explanation below)

4. **Side-by-Side Display**: Two cards show comparison of all metrics

### Population Data:

Since getting real population data requires a paid API (like GeoDB Cities API), we use mock data:
- For well-known cities, we have hardcoded approximate populations
- For other cities, we generate a random but realistic number

---

## 🌙 Dark Mode Feature

### How It Works:

1. **Toggle Button**: Located in the top-right corner of every page

2. **CSS Classes**: 
   - `light-mode` class = light colors (white background, dark text)
   - `dark-mode` class = dark colors (dark background, light text)

3. **JavaScript**: 
   - When button is clicked, it toggles between `light-mode` and `dark-mode` classes on the `<body>` element
   - All CSS rules use these classes to change colors

4. **CSS Transitions**: The `transition` property makes color changes smooth (0.3 seconds)

---

## 🎨 Styling (style.css)

### Key Features:

1. **Grid Layout**: Used for data blocks and info cards (responsive)
2. **Flexbox**: Used for header, navigation, and input sections
3. **Hover Effects**: Blocks lift up slightly when hovered
4. **Active State**: Selected block gets a border and different background
5. **Responsive Design**: Works on mobile, tablet, and desktop

---

## 🔑 API Key Setup

**Important**: Before using the project, you must:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `"YOUR_API_KEY_HERE"` in all three JavaScript files with your actual key

The API key is used in:
- `script.js` (line 2)
- `about-script.js` (line 2)
- `compare-script.js` (line 2)

---

## 📚 Key JavaScript Concepts Explained

### 1. **Variables**
```javascript
let currentCityData = {};  // Stores city information
```
- `let` = variable that can change
- `const` = constant (cannot change)

### 2. **Functions**
```javascript
function fetchCityData(cityName) {
    // Code here
}
```
- Reusable blocks of code
- Can take inputs (parameters) and return outputs

### 3. **Event Listeners**
```javascript
button.addEventListener('click', function() {
    // What happens when button is clicked
});
```
- Waits for user actions (click, keypress, etc.)
- Runs code when action happens

### 4. **DOM Manipulation**
```javascript
document.getElementById('tempValue').textContent = '25';
```
- `document.getElementById()` = finds an HTML element by its ID
- `.textContent` = changes the text inside that element

### 5. **Async/Await**
```javascript
const response = await fetch(url);
const data = await response.json();
```
- `fetch()` = makes an API call (takes time)
- `await` = waits for the API call to finish
- `async` = marks function as asynchronous (can use await)

### 6. **Chart.js**
```javascript
new Chart(ctx, {
    type: 'line',
    data: { labels: [...], datasets: [...] }
});
```
- Creates a chart on a canvas element
- Updates by changing the `data` property and calling `chart.update()`

---

## 🚀 How to Use the Project

1. **Open `index.html`** in a web browser
2. **Enter a city name** (e.g., "London", "Tokyo", "New York")
3. **Click "Fetch Data"** to load information
4. **Click any data block** to see its chart
5. **Use navigation** to switch between pages
6. **Toggle dark mode** using the button in the header

---

## 💡 Tips for Viva/Evaluation

1. **Explain the API flow**: Geocoding → Weather → Pollution
2. **Mention mock data**: Traffic, energy, waste are simulated
3. **Chart interaction**: Clicking blocks updates the chart
4. **Dark mode**: Simple class toggle mechanism
5. **Responsive design**: Works on different screen sizes
6. **Error handling**: Try entering an invalid city name to show error messages

---

## 🔧 Technologies Used

- **HTML**: Structure of web pages
- **CSS**: Styling and layout
- **JavaScript**: Logic and interactivity
- **Chart.js**: Data visualization (line charts)
- **OpenWeatherMap API**: Real weather and air quality data
- **Fetch API**: Making HTTP requests (built into JavaScript)

---

## 📝 Notes

- All code is beginner-friendly with comments
- No frameworks or libraries except Chart.js
- Uses only basic JavaScript (variables, functions, loops, if/else, DOM)
- Easy to understand and modify
- Perfect for learning web development basics

