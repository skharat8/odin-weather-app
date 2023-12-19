import "normalize.css";
import "./styles.css";

const BASE = "http://api.weatherapi.com/v1/forecast.json?";
const API_KEY = "58d39fafa6f7429da2013511231612";

class WeatherData {
  constructor(city, country, condition, temperature, feelsLikeTemperature) {
    this.city = city;
    this.country = country;
    this.condition = condition;
    this.temperature = temperature;
    this.feelsLikeTemperature = feelsLikeTemperature;
  }

  get location() {
    return `${this.city}, ${this.country}`;
  }

  get currTemperature() {
    return `${this.temperature}\u00B0 F`;
  }

  get currFeelsLikeTemperature() {
    return `${this.feelsLikeTemperature}\u00B0 F`;
  }
}

const createBaseUrl = () => BASE + "key=" + API_KEY;

const getCurrentWeather = async query => {
  try {
    const url = createBaseUrl() + "&q=" + query;
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

const processCurrentWeather = response => {
  const currWeather = new WeatherData(
    response.location.name,
    response.location.country,
    response.current.condition,
    response.current.temp_f,
    response.current.feelslike_f
  );

  return currWeather;
};

const updateDOM = weather => {
  const main = document.querySelector("main");
  const locationSpan = document.createElement("span");
  const locationSpanText = document.createTextNode(`${weather.location}`);
  locationSpan.classList.add("location");

  const temperatureSpan = document.createElement("span");
  const temperatureSpanText = document.createTextNode(
    `${weather.currTemperature}`
  );
  temperatureSpan.classList.add("temperature");

  locationSpan.appendChild(locationSpanText);
  temperatureSpan.appendChild(temperatureSpanText);
  main.append(locationSpan, temperatureSpan);
};

const showError = message => {
  const main = document.querySelector("main");
  const errorSpan = document.createElement("span");
  const errorSpanText = document.createTextNode(`${message}`);

  errorSpan.appendChild(errorSpanText);
  main.append(errorSpan);
};

const empty = element => {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
};

const reloadData = async location => {
  const data = await getCurrentWeather(location);

  if (data.error) {
    showError(data.error.message);
  } else {
    const currWeather = processCurrentWeather(data);
    updateDOM(currWeather);
  }
};

const inputField = document.querySelector("input");

inputField.addEventListener("keyup", async e => {
  if (e.key === "Enter") {
    const main = document.querySelector("main");
    empty(main);

    reloadData(inputField.value);
  }
});

reloadData("London");
