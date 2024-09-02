import React from "react";
import LayoutAdmin from "./LayoutAdmin";
import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";

export default function Admin() {
  return (
    <LayoutAdmin>
      <Card>
        <CardHeader>
          <br />
          <h2 className="fw-bold">Welcome to the Admin Homepage</h2>
          <br />
        </CardHeader>
        <CardBody>
          <br />
          <h4>
            As an administrator, you have the essential role of managing the
            users and maintaining the smooth operation of the platform. Your
            responsibilities include overseeing user accounts, managing
            permissions, and addressing user issues through the Laboratory page.
          </h4>
          <br />
          <br />
          <h3 className="fw-bold">User Management</h3>
          <br />
          <h4>
            <ul>
              <li>
                <b>View Users:</b> Access a comprehensive list of all users
                registered on the platform.
              </li>
              <br />
              <li>
                <b>Manage User Permissions:</b> Easily assign or revoke admin
                rights to users, empowering trusted members with administrative
                capabilities or removing these privileges as necessary.
              </li>
              <br />
              <li>
                <b>Delete Users:</b> Remove any users who violate policies or
                pose security threats, ensuring the community remains safe and
                productive.
              </li>
            </ul>
          </h4>
          <br />
          <br />
          <h3 className="fw-bold">Laboratory</h3>
          <br />
          <h4>
            <ul>
              <li>
                <b>User Tickets:</b> Review and manage support tickets submitted
                by users. Each ticket details issues or requests that require
                your attention.
              </li>
              <br />
              <li>
                <b>Resolve Issues:</b> Start resolving user tickets by providing
                solutions or escalating them to the appropriate teams. Your
                intervention helps maintain user satisfaction and operational
                efficiency.
              </li>
            </ul>
          </h4>
        </CardBody>
        <CardFooter>
          <br />
          Your role as an admin is crucial in fostering a secure, organized, and
          responsive environment for all users.
          <br />{" "}
          <b>
            Thank you for your dedication and diligence in managing our
            platform.
          </b>
          <br />
          <br />
        </CardFooter>
      </Card>
    </LayoutAdmin>
  );
}
