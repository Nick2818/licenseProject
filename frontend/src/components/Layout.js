import React from "react";

import Navigation from "./Navigation";
import Footer from "./Footer";

import Container from "react-bootstrap/Container";

const Layout = ({ children }) => {
  return (
    <>
      <br />
      <Container fluid className="text-center justify-content-center vmin-100">
        <Navigation className="fixed-top" />
        <br />
        <div>{children}</div>
        <br />
        <Footer className="" />
        <br />
      </Container>
    </>
  );
};

export default Layout;
