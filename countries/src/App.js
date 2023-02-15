import { useState, useEffect } from "react";
import countriesServices from "./services/countries";
import Country from "./Components/Country";
import CountryLine from "./Components/CountryLine";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    countriesServices.getCountries().then((returnedCountries) => {
      console.log(returnedCountries);
      setCountries(returnedCountries);
    });
  }, []);

  const inputCountry = (e) => {
    setSearch(e.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name["common"].includes(search)
  );

  let content;

  if (search.length !== 0) {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      content = <Country country={country} isShow={true} />;
    } else if (filteredCountries.length <= 10) {
      content = filteredCountries.map((country, index) => (
        <CountryLine key={index} country={country} />
      ));
    } else {
      content = "Too many matches, specify another filter";
    }
  }

  return (
    <>
      <div>
        find countries <input onChange={inputCountry} />
      </div>
      <div>{content}</div>
    </>
  );
};

export default App;
