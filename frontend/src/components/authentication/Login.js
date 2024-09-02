import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Row,
  Modal,
} from "react-bootstrap";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import glLogoText from "../../img/glLogoText.png";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );

      const user = userCredentials.user;
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role === "ADMIN" ? "ADMIN" : "USER";

      setLoading(false);
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError("Failed to log in: " + error.message);
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    try {
      setResetError("");
      setResetMessage("");
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent!");
    } catch (error) {
      setResetError("Failed to send reset email: " + error.message);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ transform: "translateY(-20%)" }}
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
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>

                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      disabled={loading}
                      className="text-center w-40 mt-4"
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
                </Form>
                <div className="w-100 text-center mt-2">
                  Need an account? <Link to="/signup">Sign up</Link>
                </div>
                <div className="w-100 text-center mt-2">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={1} md={4}></Col>
        </Row>
      </Container>

      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resetError && <Alert variant="danger">{resetError}</Alert>}
          {resetMessage && <Alert variant="success">{resetMessage}</Alert>}
          <Form onSubmit={handleResetPassword}>
            <Form.Group id="resetEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button className="w-100 mt-3" type="submit">
              Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
