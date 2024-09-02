import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ currentUser, element: Component }) => {
  return currentUser ? Component : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
