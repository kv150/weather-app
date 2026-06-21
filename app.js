const API_KEY = '257916bc10b4f9bdcdcb8c14b42afcf6';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');
const forecastContainer = document.getElementById('forecastContainer');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// User Enter key dabaye tab bhi search ho jaye
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

async function getWeatherData(city) {
    // Purane data aur errors ko hide karna
    errorMessage.classList.add('hidden');
    
    try {
        // 1. Current Weather Fetching
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) {
            throw new Error('city is not found please check the spelling.');
        }
        const weatherData = await weatherResponse.json();

        // 2. 5-Day Forecast Fetching
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // UI Update karna
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

    } catch (error) {
        // Error handling logic
        errorMessage.innerText = error.message;
        errorMessage.classList.remove('hidden');
        weatherCard.classList.add('hidden');
        forecastContainer.classList.add('hidden');
    }
}

function displayCurrentWeather(data) {
    document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `${data.wind.speed} m/s`;
    
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherCard.classList.remove('hidden');
}

function displayForecast(data) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = ''; // Purana forecast saaf karne ke liye

    // OpenWeather har 3 ghante ka data deta hai (1 din me 8 readings). 
    // Hum har 8th reading uthayenge taaki roz ka 1 alag din mile.
    const dailyData = data.list.filter((item, index) => index % 8 === 0);

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;

        const forecastCard = `
            <div class="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/10">
                <p class="text-sm opacity-80">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon" class="mx-auto">
                <p class="font-bold">${temp}°C</p>
            </div>
        `;
        forecastGrid.innerHTML += forecastCard;
    });

    forecastContainer.classList.remove('hidden');
}