import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import glLogoText from "../../img/glLogoText.png";

function Signup(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
      );

      console.log(response.data);
      setSuccess("Account created successfully! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      setError("Failed to create an account. Please use a strong password!");
      console.log("REGISTRATION-ERROR: " + error.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ transform: "translateY(-15%)" }}
    >
      <Container className="justify-content-center">
        <Row className="p-4 text-center">
          <Col>
            <img
              src={glLogoText}
              width="300"
              height="150"
              className="d-inline-block align-top"
              alt="glLogoText"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={1} md={4}></Col>
          <Col xs={10} md={4}>
            <Card>
              <CardBody>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">Email</Form.Group>
                  <Form.Control type="email" ref={emailRef} required />

                  <Form.Group id="password">Password</Form.Group>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    required
                    aria-describedby="passwordHelpBlock"
                  />
                  <Form.Text id="passwordHelpBlock" muted>
                    Password must be at least 8 characters long, contain letters
                    and numbers, and must not contain spaces or emoji.
                  </Form.Text>
                  <Form.Group id="passwordConfirm">Confirm Password</Form.Group>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                  <div className="text-center">
                    <Button
                      disabled={loading}
                      className="text-center w-40 mt-4"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </div>
                </Form>
                <div className="w-100 text-center mt-2">
                  Already have an account? <Link to="/login">Log in</Link>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={1} md={4}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;
