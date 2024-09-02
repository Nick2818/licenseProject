import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../firebase/useAuth";
import Layout from "../Layout";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormSelect,
  Spinner,
  Table,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

const Weather = () => {
  const weatherCodeToDescription = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [forecast, setForecast] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [dataSent, setDataSent] = useState(false);

  const [zoneName, setZoneName] = useState("Your Location");
  const [zoneNames, setZoneNames] = useState([]);

  const currentUser = useAuth();
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const fetchRecommendations = () => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get(
              `http://localhost:8080/api/works/get/${currentUserRef.current.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            )
            .then((response) => {
              setRecommendations(response.data);
            })
            .catch((e) => {
              console.log("Error getting recommendations", e);
            });
        });
      }
    } catch (e) {
      console.log("Failed to load recommendations", e);
    }
  };

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        if (data && data.daily) {
          const formattedData = data.daily.time.map((date, index) => ({
            date,
            highTemp: data.daily.temperature_2m_max[index],
            lowTemp: data.daily.temperature_2m_min[index],
            precipitationProbability:
              data.daily.precipitation_probability_max[index],
            precipitationSum: data.daily.precipitation_sum[index],
            windSpeed: data.daily.windspeed_10m_max[index],
            weatherCode: data.daily.weathercode[index],
          }));

          setForecast(formattedData);
          sendDataToServer(formattedData);
          setDataSent(true);

          setLoading(true);
          setTimeout(() => {
            fetchRecommendations();
            setLoading(false);
          }, 3000);
        } else {
          setApiError("Error fetching weather data.");
          console.error("API did not return expected data:", data);
        }
      } catch (error) {
        setApiError("Failed to fetch weather data.");
        console.error("Fetch error:", error);
      }
    };

    const sendDataToServer = (data) => {
      if (dataSent) {
        console.log("Send data to server");
        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .post(
                `http://localhost:8080/api/weather/save/${currentUserRef.current.uid}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
              })
              .catch((e) => {
                console.log("Error sending weather data to server.", e);
              });
          });
        }
      }
    };

    if (zoneName === "Your Location") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(lat, lon);
        },
        () => {
          setLocationError("Unable to retrieve your location.");
        }
      );
    } else {
      try {
        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .get(
                `http://localhost:8080/api/works/getLanLon/${currentUserRef.current.uid}/${zoneName}`,
                {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              )
              .then((response) => {
                fetchWeather(response.data[0], response.data[1]);
              })

              .catch((e) => {
                console.log("Error LAT LON", e);
              });
          });
        }
      } catch (e) {
        console.log("Failed to LAT LON", e);
      }
    }
  }, [dataSent, zoneName]);

  const fetchZoneNames = useCallback(() => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get(
              `http://localhost:8080/api/map/zoneNames/${currentUserRef.current.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            )
            .then((response) => {
              setZoneNames(response.data);
            })
            .catch((e) => {
              console.log("Error getting zone names", e);
            });
        });
      }
    } catch (e) {
      console.log("Failed to load zone names", e);
    }
  }, []);

  const handleZoneNameChange = (e) => {
    console.log("Zone: ", e.target.value);
    setZoneName(e.target.value);
  };

  useEffect(() => {
    fetchZoneNames();
  }, [fetchZoneNames, currentUser]);

  if (locationError || apiError) {
    return <p>{locationError || apiError}</p>;
  }

  if (!forecast.length) {
    return (
      <Layout>
        <Spinner animation="border" role="status" className="">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Layout>
    );
  }

  return (
    <Layout>
      <Row>
        <Col md={6} xs={12}>
          <Card className="rounded">
            <Card.Header>
              <Row>
                <Col>
                  <h2>
                    <i className="bi bi-calendar2-week-fill"></i> Weekly
                    Forecast
                  </h2>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <h2>
                        <i className="bi bi-pin-map"></i> Zone:{" "}
                      </h2>
                    </Col>

                    <Col>
                      <FormSelect
                        value={zoneName}
                        onChange={handleZoneNameChange}
                      >
                        <option value={"Your Location"}>
                          Select your zone
                        </option>
                        {zoneNames.map((zoneName) => (
                          <option key={zoneName} value={zoneName}>
                            {zoneName}
                          </option>
                        ))}
                      </FormSelect>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="justify-content-center">
              <Table hover responsive className="fs-5 ">
                <thead>
                  <tr>
                    <th className="p-3">
                      <i className="bi bi-calendar-event-fill"></i>
                    </th>
                    <th className="p-3">
                      <i className="bi bi-thermometer-low"></i>-
                      <i className="bi bi-thermometer-high"></i>
                    </th>
                    <th className="p-3">
                      <i className="bi bi-droplet-fill"></i>
                    </th>
                    <th className="p-3">
                      <i className="bi bi-cloud-drizzle-fill"></i>
                    </th>
                    <th className="p-3">
                      <i className="bi bi-wind"></i>
                    </th>
                    <th className="p-3">
                      <i className="bi bi-info-circle-fill"></i>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {forecast.map((day) => (
                    <tr key={day.date}>
                      <td>{day.date}</td>
                      <td>
                        {day.lowTemp}°C - {day.highTemp}°C
                      </td>
                      <td>{day.precipitationSum}mm</td>
                      <td>{day.precipitationProbability}%</td>
                      <td>{day.windSpeed}km/h</td>
                      <td>
                        {weatherCodeToDescription[day.weatherCode] ||
                          "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <CardFooter className="text-muted">
              <Row>
                <Col xs={12} md={4}>
                  {" "}
                  <i className="bi bi-calendar-event-fill"></i> Date(YYYY-MM-DD)
                </Col>
                <Col xs={12} md={4}>
                  {" "}
                  <i className="bi bi-thermometer-low"></i>-
                  <i className="bi bi-thermometer-high"></i> Low to High
                  Temperature
                </Col>
                <Col xs={12} md={4}>
                  {" "}
                  <i className="bi bi-droplet-fill"></i> Preciptiation Sum
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={12} md={4}>
                  {" "}
                  <i className="bi bi-cloud-drizzle-fill"></i> Precipitation
                  Probability
                </Col>
                <Col xs={12} md={4}>
                  <i className="bi bi-wind"></i> Wind Speed
                </Col>
                <Col xs={12} md={4}>
                  {" "}
                  <i className="bi bi-info-circle-fill"></i> Day Description
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </Col>
        <br />
        <br />
        <Col md={6} xs={12}>
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <h2>
                    <i className="bi bi-info-square-fill"></i> Information about
                    works
                  </h2>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <h2>
                    <i className="bi bi-pin-map"></i> Zone: {zoneName}
                  </h2>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Spinner animation="border" role="status" className="">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                Object.keys(recommendations).map((date) => (
                  <Accordion key={date} defaultActiveKey="0">
                    <AccordionItem eventKey={date}>
                      <AccordionHeader>
                        <h5>Recommendations - {date}</h5>
                      </AccordionHeader>
                      <AccordionBody>
                        {recommendations[date].map((rec, index) => (
                          <p
                            className={`fw-bold ${
                              rec.includes("OK")
                                ? "text-success"
                                : "text-danger"
                            }`}
                            key={index}
                          >
                            {rec}
                          </p>
                        ))}
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                ))
              )}
            </CardBody>
            <CardFooter className="text-muted">
              {" "}
              Please select your zone name to display infromation about works
              for your zone
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Weather;
