import React from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import glLogoText from "../img/glLogoText.png";
import { Link } from "react-router-dom";

import phone from "../mockups/phone.png";
import laptop from "../mockups/laptop.png";

export default function LandingPage() {
  return (
    <Container
      fluid
      className="d-flex align-items-center  min-vh-100 justify-content-center"
    >
      <Row>
        <Col md={12} xs={12} className="p-5">
          <Row className="">
            <Col></Col>
            <Col className="">
              <img
                src={glLogoText}
                width="300"
                height="150"
                className="align-top"
                alt="glLogoText"
              />
            </Col>
            <Col></Col>
          </Row>
          <Row className="p-5">
            <Col></Col>
            <Col className="mt-4">
              <img
                src={laptop}
                width="400"
                height="250"
                className="align-top"
                alt="laptop"
              />
            </Col>

            <Col>
              <img
                src={phone}
                width="150"
                height="300"
                className="align-top"
                alt="phone"
              />
            </Col>
            <Col></Col>
          </Row>

          <Row className="text-center p-5">
            <Col></Col>
            <Col md={12}>
              <h2>Your solution for precise viticulture</h2>
              <h2>We help you maintain the best life of your culture</h2>
              <h2>Features: Laboratory, Weather and Field view on map</h2>
              <h2>
                If you already have an account, please{" "}
                <Button
                  as={Link}
                  to="/login"
                  className="fw-bold"
                  variant="outline-light"
                >
                  Sign in
                </Button>
              </h2>
              <h2>
                If you need an account, please{" "}
                <Button
                  as={Link}
                  to="/signup"
                  className="fw-bold"
                  variant="outline-light"
                >
                  Sign up
                </Button>{" "}
              </h2>
            </Col>
            <Col></Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
