const form = document.querySelector('form');
const getLocation = document.getElementById('getLocation');
const searchCity = document.getElementById('searchCity');
const city = document.getElementById('city');
const locationContainer = document.getElementById('location');


form.addEventListener('submit', (event) => {
    event.preventDefault();
    getPositionThroughCity(city.value);
})

getLocation.addEventListener('click', (e) => {
    console.log(e)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionThroughBrowser);
    } else {
        locationContainer.innerHTML = "Geolocation is not supported by this browser.";
    }
})

function getPositionThroughBrowser(position) {
    let latitude = position.coords.latitude;
    let longtitude = position.coords.longitude;
    // console.log(latitude, longtitude)
    getWeather(latitude, longtitude);
}

async function getPositionThroughCity(city) {
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=e38e793b0540890a262fbffc0d9c534a`)
    const position = await res.json();
    let latitude = position[0].lat;
    let longtitude = position[0].lon;
    getWeather(latitude, longtitude);
}

async function getWeather(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e38e793b0540890a262fbffc0d9c534a`)
    const weatherData = await res.json();
    // console.log(weatherData)
    pushWeather(weatherData);
}

const pushWeather = (weatherData) => {
    const name = weatherData.name;
    const countryCode = weatherData.sys.country;
    const temp = weatherData.main.temp;
    const feels_like = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    if (document.getElementById('locationDiv')) {
        document.getElementById('locationDiv').remove();
    }

    const locationDiv = document.createElement('div');
    locationDiv.setAttribute('class', 'locationDiv')
    locationDiv.setAttribute('id', 'locationDiv')
    locationDiv.innerHTML = `
        <div class="locationName">
            <h3>${name}</h3>
            <span>,${countryCode}</span>
        </div>
        <p>${fahrenheitToCelsius(temp)}&#8451;</p>
        <p>Feels like: ${fahrenheitToCelsius(feels_like)}&#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${windSpeed} km/h</p>
    `;
    locationContainer.appendChild(locationDiv);
}

const fahrenheitToCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);
}