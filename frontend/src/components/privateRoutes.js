import React from "react";
import PropTypes from "prop-types";
import useLocalState from "./localStorage.js";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [jwt] = useLocalState("", "jwt");
  return jwt ? children : <Navigate to="/403" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
