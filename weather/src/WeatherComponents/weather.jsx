import { useState, useRef } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

function Weather() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]);
  const hourTempArray = useRef([]);
  const [pressure, setPressure] = useState("1006");
  const [humidity, setHumidity] = useState("41");
  const [sunset, setSunset] = useState("7:06");
  const [sunrise, setSunrise] = useState("6:10");
  const [tempday, setTempday] = useState("");
  const [tempicon, setTempicon] = useState("");
  const [region, setRegion] = useState("");


  // fetch from weather api by city name...
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

  // fetching week data from weather api...
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

  const weektemp = (day, icon, sunRise, sunSet, pressure, humdity, e) => {
    let temp = [];
    let hrRise = new Date(sunRise * 1000).getHours();
    let minRise = "0" + new Date(sunRise * 1000).getMinutes();
    let hrSet = new Date(sunSet * 1000).getHours();
    let minSet = "0" + new Date(sunSet * 1000).getMinutes();
    let rise = hrRise + ":" + minRise();
    let set = (hrSet % 12) + ":" + minSet();
    let result = Array.isArray(e);
    if (result === false) {
      for (let x in e.temp) {
        temp.push(e.temp[x] + "℃");
      }
      temp = temp.splice(0, 4);
      hourTempArray.current = temp;
    } else {
      hourTempArray.current = e;
    }
    setTempday(day);
    setTempicon(icon);
    setSunrise(rise);
    setSunset(set);
    setPressure(pressure);
    setHumidity(humdity);
  };

  // live location update.
  const Livelocation = () => {
    axios
      .get(" https://ipinfo.io/json?token=45420d190496ea")
      .then((response) => {
        setCity(response.data.city);
        setRegion(response.data.region);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${response.data.city}&appid=b325ed4f82c44e2e1abd0702faff7d72&units=metric`
          )
          .then((res) => {
            console.log(res.data);
            sevenDays(res.data.coord.lat, res.data.coord.lon);
            let arr = [];
            let count = 3;
            for (let x in res.data.main) {
              if (count > 2) {
                count--;
              } else {
                count++;
              }
              if (x === "feels_like" || "temp" || "temp_max" || "temp_min") {
                arr.push(res.data.main[x] + count + "℃");
              } else {
                continue;
              }
            }
            arr = arr.splice(0, 4);
            weektemp(
              res.data.main.temp,
              res.data.weather[0].icon,
              res.data.sys.sunrise,
              res.data.sys.sunset,
              res.data.main.pressure,
              res.data.main.humidity,
              arr
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((status) => {
        console.log("Failed to detect Live Locaion", status);
      });
  };

  return (
    <div>
      <div className="bar">
        <button className="live" onClick={Livelocation}><img src="https://image.shutterstock.com/image-vector/vector-black-colored-map-pin-260nw-1987787240.jpg" alt="" /></button>
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
              weektemp(
                e.temp.day,
                e.weather[0].icon,
                e.sunrise,
                e.sunset,
                e.pressure,
                e.humidity,
                e
              );
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
              src={`https://openweathermap.org/img/wn/${e.weather[0].icon}.png`}
              alt=""
            />

            <div>{e.weather[0].main}</div>
          </div>
        ))}
      </div>
      <div id="name">{city}</div>
      <div className="PressureHumidity">
        <div>
          <div className="pressure">Pressure</div>
          <div>{pressure} hpa</div>
        </div>
        <div>
          <div className="humidity">Humidity</div>
          <div>{humidity} %</div>
        </div>
      </div>
      <div className="sunriseSunset">
        <div>
          <div className="sunrise">Sunrise</div>
          <div>{sunrise}am</div>
        </div>
        <div>
          <div className="sunset">Sunset</div>
          <div>{sunset}pm</div>
        </div>
      </div>
      <div className="tempChart">
        <div className="tempChartTemp">
          <span>{tempday}℃</span>
          <img
            className="tempIcon"
            src={`https://openweathermap.org/img/wn/${tempicon || "04d"}.png`}
            alt="04d"
          />
        </div>
        <Chart
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...hourTempArray.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter: (val) => {
             
              },
            },
            yaxis: {
              labels: {
                formatter: (val) => {
                  return `${Math.ceil(val)}℃`;
                },
              },
            },
            xaxis: {
              categories: [
                "12:00am",
                "1:00am",
                "2:00am",
                "3:00am",
                "4:00am",
                "5:00am",
                "6:00am",
                "7:00am",
                "8:00am",
                "9:00am",
                "10:00am",
                "11:00am",
                "12:00pm",
                "1:00pm",
                "2:00pm",
                "3:00pm",
                "4:00pm",
                "5:00pm",
                "6:00pm",
                "7:00pm",
                "8:00pm",
                "9:00pm",
                "10:00pm",
                "11:00pm",
              ],
            },
          }}
        />
      </div>
    </div>
  );
}

export default Weather;
