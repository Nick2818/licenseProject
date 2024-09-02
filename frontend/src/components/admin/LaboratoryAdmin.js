import React, { useCallback, useEffect, useRef, useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Table,
  OverlayTrigger,
  Tooltip,
  Button,
  Row,
  Col,
  Modal,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../../firebase/useAuth";
import axios from "axios";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

const LaboratoryAdmin = () => {
  const currentUser = useAuth();
  const currentUserRef = useRef(currentUser);
  const [users, setUsers] = useState([]);
  const [showTickets, setShowTickets] = useState(false);
  const [ticketsUser, setTicketsUser] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketUser, setTicketUser] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [tickets, setTickets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState("");
  const [ticketIdUser, setTicketIdUser] = useState("");
  const [ticketUserId, setTicketUserId] = useState("");
  const [filterUnsolved, setFilterUnsolved] = useState(false); // State for filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const handleCloseModalTickets = () => {
    setShowTickets(false);
    fecthTickets();
  };
  const handleShowModalTickets = (email) => {
    setUserEmail(email);
    setShowTickets(true);
  };

  const handleCloseModalTicket = () => setShowTicket(false);
  const handleShowModalTicket = (email, ticket) => {
    setUserEmail(email);
    setTicketUser(ticket);
    setTicketIdUser(ticket.ticketId);
    setTicketUserId(ticket.uid);
    setShowTicket(true);
  };

  function fetchImageURL(path) {
    if (!path) {
      console.error("No path provided for fetching image URL.");
      return;
    }

    const storageRef = ref(storage, path);

    getDownloadURL(storageRef)
      .then((url) => {
        setImageURL(url);
      })
      .catch((error) => {
        console.error("Error fetching image URL:", error);
      });
  }

  useEffect(() => {
    if (ticketUser && ticketUser.path) {
      fetchImageURL(ticketUser.path);
    } else {
      console.log("Ticket user or path is not set properly:", ticketUser);
    }
  }, [ticketUser]);

  const fecthTicketsUser = useCallback((userUid) => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get(`http://localhost:8080/api/tickets/get/${userUid}`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then((response) => {
              setTicketsUser(response.data);
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
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const fetchAllUsers = useCallback(() => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get(`http://localhost:8080/api/admin/users`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
            .then((response) => {
              setUsers(response.data);
            })
            .catch((e) => {
              console.log("[ADMIN]Error getting all users.", e);
            });
        });
      }
    } catch (e) {
      console.log("[ADMIN]Failed to load all users", e);
    }
  }, []);

  const fecthTickets = useCallback(() => {
    try {
      if (currentUserRef.current) {
        currentUserRef.current.getIdToken(true).then((idToken) => {
          axios
            .get("http://localhost:8080/api/tickets/getAll", {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })
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
    fetchAllUsers();
    fecthTickets();
  }, [fecthTickets, fetchAllUsers, currentUser]);

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);

    const formData = new FormData();

    console.log("handleSubmit: ", response, ticketIdUser, ticketUserId);

    formData.append("response", response);
    formData.append("ticketId", ticketIdUser);
    formData.append("uid", ticketUserId);

    if (currentUserRef.current) {
      currentUserRef.current
        .getIdToken(true)
        .then((idToken) => {
          sendResponse(formData, idToken);
        })
        .catch((error) => {
          console.error("Error getting ID token: ", error);
          setUploading(false);
        });
    } else {
      setUploading(false);
    }
  };

  const sendResponse = async (formData, idToken) => {
    try {
      await axios.post("http://localhost:8080/api/tickets/set", formData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setResponse("");
      setUploading(false);
      handleCloseModalTicket();
      handleCloseModalTickets();
      alert("Response sent successfully!");
    } catch (error) {
      console.error("Sending response failed! ", error.response);
    } finally {
      setUploading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LayoutAdmin>
      <Card>
        <CardHeader>
          <h2 className="mt-3">Laboratory Tickets</h2>
          <br />

          <Row>
            <Col xs={12} md={4}></Col>
            <Col xs={12} md={4}>
              <FormControl
                type="text"
                placeholder="Type here to Search by UID or EMAIL"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mt-3"
              />
            </Col>
            <Col xs={12} md={4}>
              <Button
                className="mt-3 fw-bold"
                variant="warning"
                onClick={() => setFilterUnsolved(!filterUnsolved)}
              >
                {filterUnsolved
                  ? "Show All Tickets"
                  : "Show Only Unsolved Tickets"}
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col></Col>
            <Col>
              <Table hover responsive className="">
                <thead>
                  <tr>
                    <th className="p-3">
                      <i className="bi bi-person-badge-fill"></i> UID{" "}
                    </th>
                    <th className="p-3">
                      <i className="bi bi-envelope-at-fill"></i> EMAIL{" "}
                    </th>
                    <th className="p-3 text-success">Solved(S)</th>
                    <th className="p-3 text-danger">Unsolved(US)</th>
                    <th className="p-3">Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userTickets = tickets.filter(
                      (ticket) => ticket.uid === user.uid
                    );

                    const solvedTickets = userTickets.filter(
                      (ticket) => ticket.flag
                    ).length;
                    const unsolvedTickets = userTickets.filter(
                      (ticket) => !ticket.flag
                    ).length;

                    if (filterUnsolved && unsolvedTickets === 0) {
                      return null; // Skip users without unsolved tickets when filter is active
                    }

                    return (
                      <tr key={user.uid}>
                        <td>
                          <h5>{user.uid}</h5>
                        </td>
                        <td>
                          <h5>{user.email}</h5>
                        </td>
                        <td className="text-success">
                          <Badge bg="success" className="p-2">
                            <h4>
                              {"S "}
                              {solvedTickets}
                            </h4>
                          </Badge>
                        </td>
                        <td className="text-danger">
                          <Badge bg="danger" className="p-2">
                            <h4>
                              {"US "}
                              {unsolvedTickets}
                            </h4>
                          </Badge>
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Open User's Tickets</Tooltip>}
                          >
                            <Button
                              size="lg"
                              variant="warning"
                              type="submit"
                              onClick={() => {
                                handleShowModalTickets(user.email);
                                fecthTicketsUser(user.uid);
                              }}
                            >
                              <i className="bi bi-ticket-perforated-fill"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col></Col>
          </Row>
        </CardBody>
        <CardFooter className="text-muted"></CardFooter>
      </Card>

      <Modal
        show={showTickets}
        onHide={handleCloseModalTickets}
        size="lg"
        key={userEmail}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-ticket-perforated-fill"></i> Tickets <br />
            For user: {userEmail}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!ticketsUser.length ? <div>No tickets</div> : <div></div>}
          {ticketsUser.map((ticket) => {
            if (!ticket.flag) {
              return (
                <Card key={ticket.id} className="mb-2 bg-secondary text-white">
                  <CardBody className="fs-4">
                    <Row>
                      <Col xs={12} md={12}>
                        Title: {ticket.title}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={4}>
                        TicketID: {ticket.ticketId}
                      </Col>
                      <Col></Col>
                      <Col xs={12} md={1}>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="tooltip-ticket-delete">
                              Open Ticket
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="warning"
                            type="submit"
                            onClick={() =>
                              handleShowModalTicket(userEmail, ticket)
                            }
                          >
                            <i className="bi bi-ticket-fill"></i>
                          </Button>
                        </OverlayTrigger>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              );
            } else {
              return <div></div>;
            }
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalTickets}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTicket} onHide={handleCloseModalTicket} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            User: {userEmail} <br />
            <i className="bi bi-ticket-perforated-fill"></i>{" "}
            {ticketUser.ticketId} <br />
            <i className="bi bi-pin-map"></i> {ticketUser.zoneName}
            <br />
            <i className="bi bi-calendar-fill"></i> {ticketUser.date}
            <br />
            <br />
            <i className="bi bi-text-paragraph"></i> {ticketUser.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <h5>
                User description: <br /> <br />
              </h5>
              <p>{ticketUser.description}</p>
              <br />
              <h5>
                Image: <br /> <br />
                <img src={imageURL} alt="ticketImage" className="img-fluid" />
              </h5>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel>
                    <h5>Response:</h5>
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    rows={10}
                    placeholder="Enter your response/solution for this case"
                    value={response}
                    onChange={handleResponseChange}
                  />
                </FormGroup>
                <Button
                  className="mt-2"
                  variant="primary"
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "Sending..." : "Send"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalTicket}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </LayoutAdmin>
  );
};

export default LaboratoryAdmin;
