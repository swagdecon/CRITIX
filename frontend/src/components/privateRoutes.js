import React from "react";
import PropTypes from "prop-types";
import useSessionState from "./sessionStorage.js";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [jwt] = useSessionState("", "jwt");
  return jwt ? children : <Navigate to="/403" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
