import React from "react";
import Layout from "../Layout";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  CardFooter,
} from "react-bootstrap";
import Carrousel from "./Carrousel";

export default function Homepage() {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <h1>Welcome to Grapelife!</h1>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="2" />

            <Col md={8}>
              <Carrousel />
            </Col>

            <Col md={2} />
          </Row>{" "}
          <br />
          <Row>
            <Col md={2} />

            <Col md={8}>
              <h5>
                Grapelife is a platform that helps you monitor activity in
                viticulture; it is a modern and precise method. <br />
                It helps you to see your land parcels, to check the weather, and
                you benefit from a laboratory analysis based on your crop.
              </h5>
            </Col>

            <Col md={2} />
          </Row>{" "}
          <br />
          <Row className="mt-5 mb-5">
            <Col className="">
              <h1>
                <i className="bi bi-bug-fill"></i> Detection of diseases
              </h1>
            </Col>
            <Col>
              <h1>
                <i className="bi bi-cloud-rain-heavy-fill"></i> Weather
                information
              </h1>
            </Col>
            <Col>
              <h1>
                <i className="bi bi-search-heart-fill"></i> Research objectives
              </h1>
            </Col>
            <Col>
              <h1>
                <i className="bi bi-bullseye"></i> Targeted treatments
              </h1>
            </Col>
          </Row>
        </CardBody>
        {/* <CardFooter className="text-muted"></CardFooter> */}
      </Card>
    </Layout>
  );
}
