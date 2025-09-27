import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, condition, redirectTo = "/login" }) => {
  return condition ? children : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
