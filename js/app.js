// API Config
const apikey = "99d68515dd63d550f11264a739893c17";
const cityname = "dhaka";
const api_endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`;

const fetchWeatherData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    render(data);
}

fetchWeatherData(api_endpoint);


// Render Data 

const city          = document.querySelector(".weather__city");
const day           = document.querySelector(".weather__day");
const humidity      = document.querySelector(".weather__indicator--humidity > .value");
const wind          = document.querySelector(".weather__indicator--wind > .value");
const pressure      = document.querySelector(".weather__indicator--pressure > .value");
const weatherImg    = document.querySelector(".weather__image");
const temp          = document.querySelector(".weather__temperature > .value");
const forecast      = document.querySelector(".weather__forecast");

const render = (data) =>{
    city.textContent        = data.name;
    day.textContent         = findDay(data.dt);
    humidity.textContent    = data.main.humidity;
    wind.textContent        = `${getDirection(data.wind.deg)} ${data.wind.speed}`;
    pressure.textContent    = data.main.pressure;

    const iconUrl           = ``;
    weatherImg.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`);
    
    temp.textContent        =  `${data.main.temp > 0 ? "+" + data.main.temp: "-" + data.main.temp}`;
} 


// Find the day
const findDay = (value) => {
    const date = new Date;
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    return weekday[date.getUTCDay()];
}

// Get direction function to calculate the wind direction
const getDirection = (angle) => {
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    
    return directions[index];
}