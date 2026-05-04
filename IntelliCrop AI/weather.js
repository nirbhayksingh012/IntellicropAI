
const apiKey = 'd13357ade7e93ef260f9dd61418f0214';

const getWeatherBtn = document.getElementById('get-weather');
const cityInput = document.getElementById('city');

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) return alert('Please enter a location.');

    fetchCurrentWeather(city);
    fetchForecast(city);
});

async function fetchCurrentWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch current weather');
        }
        const data = await res.json();

        document.getElementById('current-desc').innerHTML = `
            <span class="weather-icon">🌡️</span> ${data.weather[0].description}
        `;
        document.getElementById('current-temp').textContent = data.main.temp.toFixed(1);
        document.getElementById('current-humidity').textContent = data.main.humidity;
        document.getElementById('current-wind').textContent = data.wind.speed;
    } catch (error) {
        console.error('Current Weather Error:', error);
        alert(`Error fetching current weather: ${error.message}`);
    }
}


async function fetchForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch forecast');
        }
        const data = await res.json();

        const forecastContainer = document.getElementById('forecast-cards');
        forecastContainer.innerHTML = '';

    
        const daily = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!daily[date]) daily[date] = [];
            daily[date].push(item);
        });

        Object.keys(daily).slice(0, 5).forEach(date => {
            const dayData = daily[date];
            const avgTemp = (dayData.reduce((sum, d) => sum + d.main.temp, 0) / dayData.length).toFixed(1);
            const avgHumidity = (dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length).toFixed(0);

            const desc = dayData[0].weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${dayData[0].weather[0].icon}@2x.png`;
            const rain = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0).toFixed(1);

            const card = document.createElement('div');
            card.innerHTML = `
                <h4>${date}</h4>
                <img src="${icon}" alt="${desc}" class="weather-icon">
                <p style="text-transform: capitalize;">${desc}</p>
                <p>Avg Temp: ${avgTemp}°C</p>
                <p>Humidity: ${avgHumidity}%</p>
                <p>Rain: ${rain} mm</p>
            `;
            forecastContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Forecast Error:', error);
        alert(`Error fetching forecast: ${error.message}`);
    }
}
