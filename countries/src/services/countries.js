import axios from "axios";

const baseURL = "https://restcountries.com/v3.1/";
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?";
const weatherURL = "https://api.openweathermap.org/data/3.0/onecall?";

const api_key = "b425503887b057b29179d933df6ef386";

const getCountries = () => {
  return axios.get(`${baseURL}all`).then((response) => response.data);
};

const getGeoCoordinate = (cityName) => {
  return axios
    .get(`${geoURL}q=${cityName}&limit=${1}&appid=${api_key}`)
    .then((response) => response.data);
};

async function getWeatherForecast(country) {
  const city = await getGeoCoordinate(country.capital).then(
    (returnedCity) => returnedCity[0]
  );

  return axios
    .get(`${weatherURL}lat=${city.lat}&lon=${city.lon}&appid=${api_key}`)
    .then((response) => response.data);
}

export default { getCountries, getWeatherForecast };
