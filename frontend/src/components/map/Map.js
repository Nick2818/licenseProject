import React, { useCallback, useEffect, useRef, useState } from "react";
import Layout from "../Layout";
import {
  FeatureGroup,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Navbar,
  Container,
  Nav,
  CardFooter,
  Spinner,
} from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useAuth } from "../../firebase/useAuth";
import axios from "axios";

const Map = () => {
  const [center, setCenter] = useState([44.42796860279973, 26.032090479053572]);
  const mapRef = useRef(null);

  const [loading, setLoading] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error obtaining the user's location", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const currentUser = useAuth();
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [polygons, setPolygons] = useState([]);

  const fetchUserPolygons = useCallback(() => {
    if (currentUserRef.current) {
      currentUserRef.current.getIdToken(true).then((idToken) => {
        axios
          .get(
            `http://localhost:8080/api/map/get/${currentUserRef.current.uid}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          )
          .then((response) => {
            setLoading(true);
            setTimeout(() => {
              setPolygons(response.data);
              setLoading(false);
            }, 1000);
          })
          .catch((e) => {
            console.error("Error fetching user's polygons:", e);
          });

        console.log("JWT: ", idToken);
      });
    }
  }, []);

  useEffect(() => {
    fetchUserPolygons();
  }, [fetchUserPolygons, currentUser]);

  const onCreated = useCallback(
    (e) => {
      const { layerType, layer } = e;
      if (layerType === "polygon") {
        const coordinates = layer
          .getLatLngs()[0]
          .map(({ lat, lng }) => [lat, lng]);
        const name = prompt("Enter a name for the new zone:");

        if (!name) {
          alert("Zone must have a name!");
          return;
        }

        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .get(
                `http://localhost:8080/api/map/checkName/${name}/${currentUserRef.current.uid}`,
                {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              )
              .then(async (response) => {
                if (response.data) {
                  // Name is unique
                  try {
                    const saveResponse = await axios.post(
                      "http://localhost:8080/api/map/save",
                      { name, coordinates },
                      {
                        headers: {
                          Authorization: `Bearer ${idToken}`,
                        },
                      }
                    );
                    console.log("Success:", saveResponse.data);
                    fetchUserPolygons(); // Refresh polygons after adding new one
                  } catch (error) {
                    console.error("Error saving new zone:", error);
                  }
                } else {
                  alert("Zone name must be unique!");
                }
              })
              .catch((error) => {
                console.error("Error checking zone name uniqueness:", error);
              });
          });
        } else {
          console.log("No user is currently signed in.");
        }
      }
    },

    [fetchUserPolygons]
  );

  const deleteZone = useCallback(
    (name) => {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .delete(
              `http://localhost:8080/api/map/delete/${name}/${currentUserRef.current.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            )
            .then(() => {
              console.log("Zone deleted successfully");
              fetchUserPolygons();
            })
            .catch((e) => {
              console.error("Error deleting zone:", e);
            });
        });
      } else {
        console.log("No user is currently signed in.");
      }
    },
    [fetchUserPolygons]
  );

  const centerMapOnPolygon = useCallback((polygonCoordinates) => {
    // Calculate the centroid of the polygon
    let latSum = 0;
    let lngSum = 0;
    polygonCoordinates.forEach(([lat, lng]) => {
      latSum += lat;
      lngSum += lng;
    });
    const latCenter = latSum / polygonCoordinates.length;
    const lngCenter = lngSum / polygonCoordinates.length;

    // Update the map's center and zoom level
    setCenter([latCenter, lngCenter]);
    //setZoom(15); // Set to a zoom level that fits the polygon well, adjust as necessary

    // Use the map ref to set view if the map is already loaded
    if (mapRef.current) {
      mapRef.current.flyTo([latCenter, lngCenter], 14.5);
    }
  }, []);

  const locateUser = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setCenter(userLocation);

        if (mapRef.current) {
          mapRef.current.flyTo(userLocation, 15);
        }
      },
      (error) => {
        console.error("Error obtaining the user's location", error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <Layout>
      <Card>
        <CardHeader>
          <h3>Draw your zone and set an unique name</h3>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xs={12} md={8} className="p-4">
              <h2>
                <i className="bi bi-map-fill"></i> Map
              </h2>
              <MapContainer
                ref={mapRef}
                center={center}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "600px", width: "100%" }}
              >
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={onCreated}
                    draw={{
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: false,
                      polyline: false,
                      polygon: true,
                    }}
                    edit={{
                      edit: false, // Disables the edit feature
                      remove: false, // Disables the delete feature
                    }}
                  />
                  {polygons.map((polygon, index) => (
                    <Polygon
                      key={index}
                      positions={polygon.coordinates}
                      color="red"
                      fillColor="red"
                      fillOpacity="0.2"
                    >
                      <Tooltip permanent>{polygon.name}</Tooltip>
                    </Polygon>
                  ))}
                </FeatureGroup>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
              <Button
                variant="dark"
                className="mt-4 fw-bold"
                onClick={locateUser}
              >
                <i className="bi bi-crosshair"></i> Show my location
              </Button>
            </Col>
            <Col xs={12} md={4} className="p-4">
              <h2>
                <i className="bi bi-pin-map-fill"></i> Your Zones
              </h2>
              <br />
              {loading ? (
                <Spinner animation="border" role="status" className="">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                polygons.map((polygon, index) => (
                  <Row key={index} className="mb-3">
                    <Navbar
                      expand="lg"
                      className="bg-body-tertiary fw-bold fs-5"
                    >
                      <Container className="text-center justify-content-center bg-light rounded">
                        <Navbar.Brand>{polygon.name}:</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse className="justify-content-end me-4 ">
                          <Nav.Link className="mt-2 mb-2">
                            <Button
                              variant="dark"
                              className="ms-2 fw-bold"
                              onClick={() =>
                                centerMapOnPolygon(polygon.coordinates)
                              }
                            >
                              <i className="bi bi-zoom-in"></i>
                            </Button>
                          </Nav.Link>

                          <Nav.Link className="mt-2 mb-2">
                            <Button
                              variant="danger"
                              className="ms-5 me-5 fw-bold"
                              onClick={() => deleteZone(polygon.name)}
                            >
                              <i className="bi bi-trash3"></i>
                            </Button>
                          </Nav.Link>
                        </Navbar.Collapse>
                      </Container>
                    </Navbar>
                  </Row>
                ))
              )}
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <h5>
            <i className="bi bi-info-square-fill"></i> You will use your zones
            name for opening tickets in Laboratory
          </h5>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default Map;
