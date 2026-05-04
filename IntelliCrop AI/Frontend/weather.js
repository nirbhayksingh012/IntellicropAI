// ---------------- WEATHER.JS -----------------

const apiKey = "d13357ade7e93ef260f9dd61418f0214";

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const currentWeather = document.getElementById("currentWeather");
const forecastGrid = document.getElementById("forecastGrid");

// ----------- WEATHER ICON MAP (Beautiful & Colorful) -------------
const iconMap = {
  "Thunderstorm": "⛈️",
  "Drizzle": "🌦️",
  "Rain": "🌧️",
  "Snow": "❄️",
  "Clear": "☀️",
  "Clouds": "☁️",
  "Mist": "🌫️",
  "Fog": "🌁",
  "Haze": "🌤️"
};

// ---------------- CROP SUGGESTIONS --------------------
function getCropSuggestion(temp, humidity) {
  if (temp >= 28 && humidity >= 60) {
    return "🌾 **Best Crops:** Rice, Sugarcane, Jute";
  } 
  else if (temp >= 20 && temp < 28) {
    return "🌽 **Best Crops:** Maize, Banana, Papaya, Vegetables";
  } 
  else if (temp >= 15 && temp < 20) {
    return "🥔 **Best Crops:** Potato, Barley, Wheat";
  } 
  else if (temp < 15) {
    return "❄️ **Best Crops:** Apples, Oranges, Tea";
  }
  return "🌱 Suitable conditions for general crops.";
}


// ---------------- FETCH WEATHER --------------------
async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    // CURRENT WEATHER
    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      currentWeather.innerHTML = `<p class="error">City not found!</p>`;
      forecastGrid.innerHTML = "";
      return;
    }

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const condition = weatherData.weather[0].main;
    const icon = iconMap[condition] || "🌦️";

    // CURRENT WEATHER UI
    currentWeather.innerHTML = `
      <div class="weather-card fadeIn">
        <h2>${icon} ${weatherData.name}</h2>
        <p class="temp">${temp}°C</p>
        <p>${condition}</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p class="crop-suggest">${getCropSuggestion(temp, humidity)}</p>
      </div>
    `;

    // 5-DAY FORECAST
    const forecastURL =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const foreRes = await fetch(forecastURL);
    const foreData = await foreRes.json();

    forecastGrid.innerHTML = "";

    // Selecting 1 forecast per day (12:00pm entries)
    const daily = foreData.list.filter(item => item.dt_txt.includes("12:00:00"));

    daily.forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const cond = day.weather[0].main;
      const icon2 = iconMap[cond] || "🌦️";

      forecastGrid.innerHTML += `
        <div class="forecast-card fadeInUp">
          <h4>${icon2}</h4>
          <p class="date">${date}</p>
          <p>${day.main.temp}°C</p>
          <p>${cond}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error fetching weather!");
  }
}

getWeatherBtn.addEventListener("click", fetchWeather);
