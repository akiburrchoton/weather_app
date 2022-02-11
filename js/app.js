// ** Grabing DOMs
const city = document.querySelector(".weather__city");
const day = document.querySelector(".weather__day");
const humidity = document.querySelector(
  ".weather__indicator--humidity > .value"
);
const wind = document.querySelector(".weather__indicator--wind > .value");
const pressure = document.querySelector(
  ".weather__indicator--pressure > .value"
);
const weatherImg = document.querySelector(".weather__image");
const temp = document.querySelector(".weather__temperature > .value");
const forecast = document.querySelector(".weather__forecast");
const input = document.querySelector(".weather__search");
const suggestions = document.querySelector("#suggestions");

// ** API Config
const apiKey = "99d68515dd63d550f11264a739893c17";
const cityName = "sydney";
const apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

// ** Fetching City Name Suggestion
const fetchCityName = async (value) => {
  const endPoint = `https://api.teleport.org/api/cities/?search=${value}&limit=6`;
  const response = await fetch(endPoint);
  const data = await response.json();

  renderCitySuggestion(data._embedded["city:search-results"]);
};

// ** Rendering City Name Suggestion in Searchbar
const renderCitySuggestion = (data) => {
  suggestions.innerHTML = "";

  data.forEach((loc) => {
    suggestions.innerHTML += `<option value="${loc.matching_full_name}"></option>`;
  });
};

// ** Fetching data for Weather
const fetchWeatherData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  renderWeather(data);
  fetchForecastData(data);
};

// ** Rendering Weather Data
const renderWeather = (data) => {
  city.textContent = data.name;
  day.textContent = findDay(data.dt);
  humidity.textContent = data.main.humidity;
  wind.textContent = `${getDirection(data.wind.deg)} ${data.wind.speed}`;
  pressure.textContent = data.main.pressure;

  const iconUrl = ``;
  weatherImg.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
  );

  temp.textContent = `${
    data.main.temp > 0 ? "+" + data.main.temp : "-" + data.main.temp
  }`;
};

// ** Fetching data for Forecast
const fetchForecastData = async (apiData) => {
  const endPoint = `https://api.openweathermap.org/data/2.5/forecast?id=${apiData.id}&appid=${apiKey}&units=metric`;

  const response = await fetch(endPoint);
  const data = await response.json();

  const list = data.list;
  const forecastTemp = [];

  list.forEach((obj) => {
    const date = new Date(obj.dt_txt);
    const hour = date.getHours();

    if (hour == 12) {
      forecastTemp.push(obj);
    }
  });

  renderForecast(forecastTemp);
};

// ** Rendering Forecast Data
const renderForecast = (data) => {
  forecast.innerHTML = "";

  data.forEach((obj) => {
    const temp = obj.main.temp;
    const dayName = new Date(obj.dt_txt).toLocaleDateString("en-En", {
      weekday: "long",
    });
    const icon = `https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`;
    const desc = obj.weather[0].description;

    forecast.innerHTML += `<article class="weather__forecast__item">
            <img
                src="${icon}"
                alt="${desc}"
                class="weather__forecast__icon"
            />
            <h3 class="weather__forecast__day">${dayName}</h3>
            <p class="weather__forecast__temperature">
                <span class="value">${temp}</span> &deg;C
            </p>
        </article>`;
  });
};

// ** Search Function (Eventlistener)
input.addEventListener("keydown", (e) => {
  const inputVal = input.value;
  fetchCityName(inputVal);

  let cityName;

  if (inputVal.includes(",")) {
    cityName =
      inputVal.slice(0, inputVal.indexOf(",")) +
      inputVal.slice(inputVal.lastIndexOf(","));
  }

  const apiEndPoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  if (e.keyCode == 13) {
    fetchWeatherData(apiEndPoint);
  }
});

// ** Find the day
const findDay = (value) => {
  const day = new Date(value * 1000).toLocaleDateString("en-En", {
    weekday: "long",
  });

  return day;
};

// ** Get direction function to calculate the wind direction
const getDirection = (angle) => {
  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];
  const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;

  return directions[index];
};

// ** Initialising the App
fetchWeatherData(apiEndPoint);
