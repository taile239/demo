import { useState } from "react";
import Country from "./Country";

const CountryLine = ({ country }) => {
  const [isShow, setIsShow] = useState(false);
  const toggleIsShow = () => {
    setIsShow(!isShow);
  };
  return (
    <div>
      {country.name["common"]} <button onClick={toggleIsShow}>show</button>
      <Country country={country} isShow={isShow} />
    </div>
  );
};

export default CountryLine;
