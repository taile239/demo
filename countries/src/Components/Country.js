import countriesServices from "./../services/countries";
import { useState, useEffect } from "react";

const Country = ({ country, isShow }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesServices.getWeatherForecast(country).then((returnedWeather) => {
      setWeather(returnedWeather);
    });
  }, [country]);

  if (!isShow) {
    return;
  }

  let celcius, windSpeed;

  if (weather) {
    celcius = (5 / 9) * (weather.current.temp - 32);
    windSpeed = weather.current.wind_speed;
  }

  return (
    <>
      <h1>{country.name["common"]}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <br />
      <div>
        <strong>languages:</strong>
      </div>
      <ul>
        {Object.values(country.languages).map((value, index) => {
          return <li key={index}>{value}</li>;
        })}
      </ul>
      <img src={country.flags.svg} height="100" alt="country" />
      <h1>Weather in {country.capital}</h1>
      <div>temperature {celcius} Celcius</div>
      <div>wind {windSpeed} m/s</div>
    </>
  );
};

export default Country;
