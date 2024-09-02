import React, { useCallback, useEffect, useRef, useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { useAuth } from "../../firebase/useAuth";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  Row,
  Col,
  CardBody,
  Table,
  CardFooter,
  OverlayTrigger,
  Tooltip,
  FormControl,
  InputGroup,
} from "react-bootstrap";

export default function UsersPage() {
  const currentUser = useAuth();
  const currentUserRef = useRef(currentUser);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [roleFilter, setRoleFilter] = useState(""); // State for role filter

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

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers, currentUser]);

  const deleteUser = (uid) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .delete(`http://localhost:8080/api/admin/users/delete/${uid}`, {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              })
              .then((response) => {
                console.log("User deleted successfully!");
                alert("User deleted successfully!");
                fetchAllUsers();
              })
              .catch((e) => {
                console.log("[ADMIN]Error deleting user.", e);
                alert("Failed to delete user!");
              });
          });
        }
      } catch (e) {
        console.log("[ADMIN]Failed to delete user.", e);
      }
    }
  };

  const giveAdmin = (uid) => {
    if (
      window.confirm("Are you sure you want to give ADMIN rights to this user?")
    ) {
      try {
        const role = "ADMIN";
        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .put(
                `http://localhost:8080/api/admin/users/giveAdmin/${uid}/${role}`,
                {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              )
              .then((response) => {
                console.log("User is now ADMIN!");
                alert("User is now ADMIN!");
                fetchAllUsers();
              })
              .catch((e) => {
                console.log("[ADMIN]Error setting ADMIN rights.", e);
                alert("Failed to give ADMIN rights!");
              });
          });
        }
      } catch (e) {
        console.log("[ADMIN]Failed to give ADMIN rights.", e);
      }
    }
  };

  const removeAdmin = (uid) => {
    if (
      window.confirm(
        "Are you sure you want to remove ADMIN rights to this user?"
      )
    ) {
      try {
        const role = "USER";
        if (currentUserRef.current) {
          currentUserRef.current.getIdToken(true).then((idToken) => {
            axios
              .put(
                `http://localhost:8080/api/admin/users/giveAdmin/${uid}/${role}`,
                {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                }
              )
              .then((response) => {
                console.log("User is not ADMIN!");
                alert("User is not ADMIN!");
                fetchAllUsers();
              })
              .catch((e) => {
                console.log("[ADMIN]Error removing ADMIN rights.", e);
                alert("Failed to remove ADMIN rights!");
              });
          });
        }
      } catch (e) {
        console.log("[ADMIN]Failed to remove ADMIN rights.", e);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(
    (user) =>
      (user.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.customClaims?.role &&
          user.customClaims.role
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))) &&
      (roleFilter === "" || user.customClaims?.role === roleFilter)
  );

  return (
    <LayoutAdmin>
      <Card className="">
        <CardHeader>
          <h2>Users Table</h2>
          <br />
          <Row>
            <Col xs={12} md={4}></Col>
            <Col xs={12} md={4}>
              <FormControl
                placeholder="Type to Search by UID, EMAIL or ROLE"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mt-3"
              />
            </Col>
            <Col xs={12} md={4}>
              <InputGroup className="mt-3">
                <Button
                  variant={
                    roleFilter === "ADMIN" ? "primary" : "outline-primary"
                  }
                  onClick={() => handleRoleFilterChange("ADMIN")}
                  className="fw-bold"
                >
                  Show Admins
                </Button>
                <Button
                  variant={
                    roleFilter === "USER" ? "primary" : "outline-primary"
                  }
                  onClick={() => handleRoleFilterChange("USER")}
                  className="fw-bold"
                >
                  Show Users
                </Button>
                <Button
                  variant={roleFilter === "" ? "primary" : "outline-primary"}
                  onClick={() => handleRoleFilterChange("")}
                  className="fw-bold"
                >
                  Show All
                </Button>
              </InputGroup>
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
                    <th className="p-3">
                      <i className="bi bi-info-circle-fill"></i>
                    </th>
                    <th className="p-3"></th>
                    <th className="p-3">
                      <i className="bi bi-gear-fill"></i>
                    </th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    return (
                      <tr key={user.uid}>
                        <td>
                          <h5>{user.uid}</h5>
                        </td>
                        <td>
                          <h5>{user.email}</h5>
                        </td>
                        <td>
                          <h5>{user.customClaims?.role}</h5>
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Give ADMIN Rights</Tooltip>}
                          >
                            <Button
                              className=""
                              variant="danger"
                              type="submit"
                              onClick={() => giveAdmin(user.uid)}
                            >
                              <i className="bi bi-universal-access-circle"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Remove ADMIN Rights</Tooltip>}
                          >
                            <Button
                              className=""
                              variant="danger"
                              type="submit"
                              onClick={() => removeAdmin(user.uid)}
                            >
                              <i className="bi bi-universal-access"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Delete User</Tooltip>}
                          >
                            <Button
                              className=""
                              variant="danger"
                              type="submit"
                              onClick={() => deleteUser(user.uid)}
                            >
                              <i className="bi bi-trash-fill"></i>
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
        <CardFooter>
          <p>
            <i className="bi bi-exclamation-triangle-fill"></i> Deletion is
            permanent!
          </p>
        </CardFooter>
      </Card>
    </LayoutAdmin>
  );
}
