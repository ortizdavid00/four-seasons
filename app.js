"use strict";

// API KEY: 733ae8fafb7a2befd588cb2442ef769b

// ELEMENT CONSTS
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temp-value p");
const descElement = document.querySelector(".temp-description p");
const locationElement = document.querySelector(".location p");

// APP DATA
const weather = {};

weather.temperature = {
  unit: "celsius",
};

// APP CONSTS AND VARIABLES
const KELVIN = 273;

// API KEY
const key = "733ae8fafb7a2befd588cb2442ef769b";

// GEOLOCATION SUPPORT
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

// DISPLAY ERROR (GEOLOGICAL ISSUES)
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

// DISPLAYING WEATHER TO UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}&#176;<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city},  ${weather.country}`;
}

// C -> F CONVERSION
function celsiusToFarenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// EVENT LISTENER FOR CONVERSION
tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    let farenheit = celsiusToFarenheit(weather.temperature.value);
    farenheit = Math.floor(farenheit);

    tempElement.innerHTML = `${farenheit}&#176;<span>F</span>`;
    weather.temperature.unit = "farenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}&#176;<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
