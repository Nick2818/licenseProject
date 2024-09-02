import React from "react";
import Signup from "./authentication/Signup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./authentication/Login";
import "../firebase/firebaseConfig";
import Admin from "./admin/Admin";
import Homepage from "./homepage/Homepage";
import Weather from "./weather/Weather";
import Map from "../components/map/Map";
import Laboratory from "./lab/Laboratory";
import useUserRole from "../utils/useUserRole";
import UsersPage from "./admin/UsersPage";
import LaboratoryAdmin from "./admin/LaboratoryAdmin";

const App = () => {
  const role = useUserRole();

  console.log("USER ROLE:", role);

  return (
    <div
      style={{
        background: "linear-gradient(to left, #4b1d66, #b9a3c4)",
        height: "100%",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={role === "ADMIN" ? <Admin /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/users"
            element={role === "ADMIN" ? <UsersPage /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/lab"
            element={
              role === "ADMIN" ? <LaboratoryAdmin /> : <Navigate to="/" />
            }
          />
          <Route
            path="/home"
            element={role === "USER" ? <Homepage /> : <Navigate to="/" />}
          />
          <Route
            path="/weather"
            element={role === "USER" ? <Weather /> : <Navigate to="/" />}
          />
          <Route
            path="/lab"
            element={role === "USER" ? <Laboratory /> : <Navigate to="/" />}
          />
          <Route
            path="/map"
            element={role === "USER" ? <Map /> : <Navigate to="/" />}
          />

          {/* <Route path="" element={} />
        <Route path="" element={} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
