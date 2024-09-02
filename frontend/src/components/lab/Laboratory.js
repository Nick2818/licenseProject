import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Col,
  Row,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Layout from "../Layout";
import { useAuth } from "../../firebase/useAuth";
import { storage } from "../../firebase/firebaseConfig";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";

const Laboratory = () => {
  const currentUser = useAuth();
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [show, setShow] = useState(false);
  const [ticket, setTicket] = useState({});
  const handleCloseModal = () => setShow(false);
  const handleShowModal = (ticket) => {
    setTicket(ticket);
    setShow(true);
  };

  const deleteTicket = (ticketId) => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .delete(`http://localhost:8080/api/tickets/delete/${ticketId}`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then(() => fecthTickets())
            .catch((e) => {
              console.log("Error deleting the ticket.", e);
            });
        });
      }
    } catch (e) {
      console.log("Failed to delete the ticket.");
    }
  };

  const [imageURL, setImageURL] = useState("");

  function fetchImageURL(path) {
    const storageRef = ref(storage, path);

    getDownloadURL(storageRef).then((url) => {
      console.log("Image URL:", url);
      setImageURL(url);
    });
  }

  const [file, setFile] = useState(null);
  const [zoneNames, setZoneNames] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [description, setDescription] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [tickets, setTickets] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const fecthTickets = useCallback(() => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get(
              `http://localhost:8080/api/tickets/get/${currentUserRef.current.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            )
            .then((response) => {
              setTickets(response.data);
            })
            .catch((e) => {
              console.log("Error getting tickets", e);
            });
        });
      }
    } catch (e) {
      console.log("Failed to load tickets", e);
    }
  }, []);

  useEffect(() => {
    fecthTickets();
  }, [fecthTickets, currentUser]);

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

  useEffect(() => {
    fetchZoneNames();
  }, [fetchZoneNames, currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleZoneNameChange = (e) => {
    setZoneName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCustomDescriptionChange = (e) => {
    setCustomDescription(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const validateForm = () => {
    const errors = {};
    if (!title) errors.title = "Title is required";
    if (!file) errors.file = "File is required";
    if (!zoneName) errors.zoneName = "Zone name is required";
    if (!description) errors.description = "Description is required";
    if (description === "Other" && !customDescription) {
      errors.customDescription = "Custom description is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const finalDescription =
      description === "Other" ? customDescription : description;

    const currentDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", finalDescription);
    formData.append("userID", currentUserRef.current.uid);
    formData.append("zoneName", zoneName);
    formData.append("title", title);
    formData.append("date", currentDate);

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setMessage("Ticket uploaded successfully!");
      if (currentUserRef.current) {
        currentUserRef.current
          .getIdToken(true)
          .then((idToken) => {
            uploadFile(formData, idToken);
          })
          .catch((error) => {
            console.error("Error getting ID token: ", error);
            setMessage("Upload failed. Could not get ID token.");
            setUploading(false);
          });
      } else {
        setMessage("User not authenticated.");
        setUploading(false);
      }

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setMessage("Please fix the errors.");
      setUploading(false);
    }
  };

  const uploadFile = useCallback(
    async (formData, idToken) => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/lab/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        setMessage(response.data.message || "Ticket uploaded successfully!");

        setFile(null);
        setZoneName("");
        setDescription("");
        setCustomDescription("");
        setTitle("");
        setFormErrors({});
        fecthTickets();
      } catch (error) {
        console.error("Upload failed: ", error.response);
        setMessage("Upload failed! Try again.");
      } finally {
        setUploading(false);
      }
    },
    [fecthTickets]
  );

  const sortedTickets = tickets.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <Layout>
      <Row>
        <Col md={6} xs={12}>
          <Card>
            <Card.Header>
              <h1>Laboratory</h1>
            </Card.Header>
            <Card.Body>
              <Row className="">
                <Col className="p-5">
                  {message && <Alert variant="dark">{message}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                      <Form.Label>
                        <h3>
                          <i className="bi bi-info-square-fill"></i> Title
                        </h3>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={title}
                        placeholder="Enter title"
                        onChange={handleTitleChange}
                        isInvalid={!!formErrors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.title}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label className="mt-5">
                        <h3>
                          <i className="bi bi-image-fill"></i> Choose Image to
                          upload
                        </h3>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        isInvalid={!!formErrors.file}
                        accept="image/*"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.file}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="zoneNamesSelect" className="mb-3">
                      <Form.Label className="mt-5">
                        <h3>
                          <i className="bi bi-pin-map-fill"></i> Select your
                          zone name
                        </h3>
                      </Form.Label>

                      <Form.Select
                        aria-label="Default select example"
                        value={zoneName}
                        onChange={handleZoneNameChange}
                        isInvalid={!!formErrors.zoneName}
                      >
                        <option>
                          <i className="bi bi-pin-map"></i>Select your zone name
                        </option>
                        {zoneNames.map((zoneName) => (
                          <option key={zoneName.id} value={zoneName}>
                            {zoneName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.zoneName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="descriptionSelect" className="mb-3">
                      <Form.Label className="mt-5">
                        <h3>
                          <i className="bi bi-file-text-fill"></i> Description
                        </h3>
                      </Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        value={description}
                        onChange={handleDescriptionChange}
                        isInvalid={!!formErrors.description}
                      >
                        <option>Select a description</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                        <option value="Research Paper">Research Paper</option>
                        <option value="Other">Custom Description</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {description === "Other" && (
                      <Form.Group className="mb-3">
                        <Form.Label className="mt-5">
                          <h3>
                            <i className="bi bi-file-text-fill"></i>Custom
                            Description
                          </h3>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={10}
                          value={customDescription}
                          placeholder="Enter custom description"
                          onChange={handleCustomDescriptionChange}
                          isInvalid={!!formErrors.customDescription}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.customDescription}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                    <Button
                      className="mt-5"
                      variant="dark"
                      type="submit"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-muted">
              Ensure your image is appropriate for public viewing
            </Card.Footer>
          </Card>
        </Col>
        <Col md={6} xs={12}>
          <Card>
            <CardHeader>
              <h1>
                <i className="bi bi-ticket-detailed-fill"></i> Tickets
              </h1>
              <Button variant="dark" onClick={handleSortOrderChange}>
                Sort by Date {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </CardHeader>
            <CardBody style={{ maxHeight: "670px", overflowY: "scroll" }}>
              <Row>
                {sortedTickets.map((ticket) => (
                  <Col md={12} key={ticket.ticketId} className="mb-4 fw-bold">
                    <Card className="bg-light">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <h4 className="card-title">
                              <i className="bi bi-text-paragraph"></i>{" "}
                              {ticket.title}
                            </h4>
                            <p className="card-text">
                              <i className="bi bi-pin-map"></i>{" "}
                              {ticket.zoneName}
                            </p>
                            <p className="card-text">
                              <i className="bi bi-calendar-fill"></i>{" "}
                              {ticket.date}
                            </p>
                            <p className="card-text">
                              <i className="bi bi-ticket-perforated-fill"></i>{" "}
                              {ticket.ticketId}
                            </p>
                            <p className="card-text">
                              {ticket.flag ? (
                                <span className="text-success">
                                  <i className="bi bi-check-circle-fill"></i>{" "}
                                  Answer Received
                                </span>
                              ) : (
                                <span className="text-warning">
                                  <i className="bi bi-hourglass-split"></i>{" "}
                                  Pending Answer
                                </span>
                              )}
                            </p>
                          </Col>
                          <Col md={4} className="text-end">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-ticket-open">
                                  Open Ticket
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="dark"
                                className="m-1"
                                onClick={() => {
                                  handleShowModal(ticket);
                                  fetchImageURL(ticket.path);
                                }}
                              >
                                <i className="bi bi-ticket-fill"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-ticket-close">
                                  Close Ticket
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="success"
                                className="m-1"
                                onClick={() => deleteTicket(ticket.ticketId)}
                              >
                                <i className="bi bi-check-circle-fill"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id="tooltip-ticket-delete">
                                  Delete Ticket
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="danger"
                                className="m-1"
                                onClick={() => deleteTicket(ticket.ticketId)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </Button>
                            </OverlayTrigger>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </CardBody>
            <CardFooter className="text-muted">
              Press <i className="bi bi-ticket-fill"></i> button to see ticket's
              response
              <br />
              Press <i className="bi bi-check-circle-fill"></i> button to close
              the ticket.
              <br />
              Press <i className="bi bi-trash-fill"></i> button to delete the
              ticket.
            </CardFooter>
          </Card>
        </Col>
      </Row>

      <Modal show={show} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-ticket-perforated-fill"></i>(ID){" "}
            {ticket.ticketId} <br />
            <i className="bi bi-pin-map"></i>(Zone) {ticket.zoneName}
            <br />
            <i className="bi bi-calendar-fill"></i>(Date) {ticket.date}
            <br />
            <br />
            <i className="bi bi-text-paragraph"></i>(Title) {ticket.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Response: <br /> <br />
            {ticket.response}
          </h5>
          <br />
          <h5>
            Image: <br /> <br />
            <img src={imageURL} alt="ticketImage" className="img-fluid" />
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Laboratory;
