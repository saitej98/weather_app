import { useState } from "react";
import axios from "axios"

function Weather() {
    const [city, setCity] = useState("");
    const [days, setDays] = useState([]);


    const searchCity = () => {
        try {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b325ed4f82c44e2e1abd0702faff7d72&units=metric`
            )
              .then((res) => {
                  sevenDays(res.data.coord.lat, res.data.coord.lon);
                  
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {}
    };
    const sevenDays = (lat, lon) => {
        try {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`
            )
            .then((res) => {
              setDays(res.data.daily);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch {}
      };
    
  return (
    <div>
      <div className="bar">
        <button className="live">live</button>
        <input
          type="text"
          className="city"
          placeholder="Enter City Name Here.."
          value={city}
          onChange={(e) => {setCity(e.target.value)}}
        />
        <button className="search" onClick={searchCity}>
          Search
        </button>
          </div>
           <div className="mapdiv">
        <iframe
          title="gmap"
          name="gMap"
          className="map"
          src={`https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}

export default Weather;
