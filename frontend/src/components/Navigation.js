import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import glLogoText from "../img/glLogoText.png";
import { NavbarCollapse } from "react-bootstrap";

const Navigation = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error: ", error);
      });

    localStorage.clear();
  };

  return (
    <Container fluid className="bg-light rounded">
      <Row>
        <Col>
          <Navbar expand="lg" className="fw-bold fs-4 p-4 ">
            <Container>
              <Navbar.Brand as={Link} to="/home">
                <img
                  src={glLogoText}
                  width="200"
                  height="90"
                  className="me-4"
                  alt="glLogoText"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-4">
                  <Nav.Link as={Link} to="/home">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/weather">
                    Weather
                  </Nav.Link>
                  <Nav.Link as={Link} to="/lab">
                    Laboratory
                  </Nav.Link>
                  <Nav.Link as={Link} to="/map">
                    Map
                  </Nav.Link>
                </Nav>

                <NavbarCollapse className="justify-content-end">
                  <NavDropdown
                    align="end"
                    title={`User: ${userEmail}`}
                    id="basic-nav-dropdown"
                  >
                    {/* <NavDropdown.Item as={Link} to="/settings">
                      Settings
                    </NavDropdown.Item> */}
                    {/* <NavDropdown.Divider /> */}
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </NavbarCollapse>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default Navigation;
