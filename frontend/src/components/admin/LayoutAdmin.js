import React from "react";

import Footer from "../Footer";

import Container from "react-bootstrap/Container";
import NavigationAdmin from "./NavigationAdmin";

const LayoutAdmin = ({ children }) => {
  return (
    <>
      <br />
      <Container
        fluid
        className="text-center justify-content-center vmin-100 p-4"
      >
        <NavigationAdmin className="sticky-top" />
        <br />
        <div>{children}</div>
        <br />
        <Footer className="sticky-bottom" />
        <br />
      </Container>
    </>
  );
};

export default LayoutAdmin;
