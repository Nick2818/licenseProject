import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//import glLogoText from "../img/glLogoText.png";
import glLogoText from "../img/glLogoText.png";
import { Card, CardBody, CardHeader } from "react-bootstrap";

const Footer = () => {
  return (
    <Card className="p-2 bg-light text-dark fs-5 rounded-card">
      <CardHeader>
        <Row>
          <Col className="p-3 ">
            <img
              src={glLogoText}
              width="330"
              height="160"
              className="d-inline-block align-top"
              alt="glLogoText"
            />
          </Col>
          <Col className="mt-5">
            <Row className="mb-5">
              <Col>About us</Col>
              <Col>Privacy Policy</Col>
              <Col>Contact</Col>
            </Row>
            <Row>
              <Col>
                <i className="bi bi-facebook"></i>
              </Col>
              <Col>
                <i className="bi bi-whatsapp"></i>
              </Col>
              <Col>
                <i className="bi bi-instagram"></i>
              </Col>
              <Col>
                <i className="bi bi-threads"></i>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardHeader>

      <CardBody className="p-3 mt-3">
        <p>© 2024 Grapelife</p>
      </CardBody>
    </Card>
  );
};

export default Footer;
