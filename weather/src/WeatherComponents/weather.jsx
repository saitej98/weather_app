import { useState, useRef } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]);
  const hourTempArray = useRef([]);
  const [pressure, setPressure] = useState("");
  const [humidity, setHumidity] = useState("");
  const [sunset, setSunset] = useState("");
  const [sunrise, setSunrise] = useState("");

  const searchCity = () => {
    try {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b325ed4f82c44e2e1abd0702faff7d72&units=metric`
        )
        .then((res) => {
          console.log(res);
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
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=b325ed4f82c44e2e1abd0702faff7d72&units=metric`
        )
        .then((res) => {
          setDays(res.data.daily);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  };
  const weektemp = (sunRise, sunSet, presure, humdity, e) => {
    let temp = [];
    let hrRise = new Date(sunRise * 1000).getHours();
    let minRise = "0" + new Date(sunRise * 1000).getMinutes();
    let hrSet = new Date(sunSet * 1000).getHours();
    let minSet = "0" + new Date(sunSet * 1000).getMinutes();
    let rise = hrRise + ":" + minRise();
    let set = (hrSet % 12) + ":" + minSet();
    let result = Array.isArray(e);
    if (result == false) {
      for (let x in e.temp) {
        temp.push(e.temp[x] + "℃");
      }
      temp = temp.splice(0, 4);
      hourTempArray.current = temp;
    } else {
      hourTempArray.current = e;
    }

    setSunrise(rise);
    setSunset(set);
    setPressure(presure);
    setHumidity(humdity);
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
          onChange={(e) => {
            setCity(e.target.value);
          }}
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
      <div className="daytemp">
        {days.map((e) => (
          <div
            id="detaildaytemp"
            key={e.id}
            onClick={() => {
              weektemp(e.sunrise, e.sunset, e.pressure, e.humidity, e);
            }}
            tabIndex="0"
          >
            <div>
              {new Date(`${e.dt}` * 1000).toLocaleDateString("en", {
                weekday: "short",
              })}
            </div>
            <span>{Math.ceil(e.temp.day)}℃</span>
            <img
              className="detailIcon"
              src={`https://openweathermap.org/img/wn/${e.weather[0].icon}.png`}
              alt=""
            />

            <div>{e.weather[0].main}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Weather;
