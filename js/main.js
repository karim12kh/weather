
let API_KEY = "7a0ca3564cf747119c5144153250107"; 

let searchBtn = document.getElementById("search-btn");
let cityInput = document.getElementById("city-input");
let cardsContainer = document.getElementById("weather-cards");

searchBtn.addEventListener("click", () => {
  let city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      (error) => {
        console.warn("Location access denied, using default.");
        getWeather("Cairo"); 
      }
    );
  } else {
    getWeather("Cairo"); 
  }
};
async function getWeather(city) {
  try {
    let res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
    );
    let data = await res.json();
    displayWeather(data.forecast.forecastday, data.location.name);
  } catch (error) {
    alert("City not found or error fetching data!");
    console.error(error);
  }
}
function displayWeather(days, cityName) {
  let box = ""; 

  for (let i = 0; i < days.length; i++) {
    let day = days[i];
    let date = new Date(day.date);
    let weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    let formattedDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    if(i===0){
      box += `
      <div class="col-md-4 today forecast col1 text-white">
        <div class="d-flex justify-content-between forecast-header col3 p-2" id="today">
          <div class="day">${weekday}</div>
          <div class="date">${formattedDate}</div>
        </div>
        <div class="location ">${cityName}</div>
        <div class="degree">
          <div class="num fs-1 myf">${day.day.avgtemp_c}°C</div>
          <div class="forecast-icon">
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
          </div>
        </div>
        <div class="custom col5">${day.day.condition.text}</div>
        <div class="extras">
          <span><img class="img-fluid" src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png" alt="rain"> ${day.day.daily_chance_of_rain}%</span>
          <span> ${day.day.maxwind_kph} km/h</span>
        </div>
      </div>
    `;
    }
    else{
      box+=`<div class=" col-md-4 forecast col2 text-white text-center">
        <div class="forecast-header">
            <div class="day col4 p-2">${weekday}</div>
        </div> <!-- .forecast-header -->
        <div class="forecast-content">
            <div class="forecast-icon">
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            </div>
            <div class="degree fs-4 myf">${day.day.maxtemp_c}</div>
            <small class="fs-5 ">${day.day.mintemp_c}</small>
            <div class="custom col5 myf">${day.day.condition.text}</div>
        </div>
        </div>
      `
    }

    
  }

  document.getElementById("weather-cards").innerHTML = box;
}

