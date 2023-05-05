import React from "react";
import PropTypes from "prop-types";
import useLocalState from "./localStorage.js";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const accessToken = useLocalState("", "accessToken");
  const refreshToken = useLocalState("", "refreshToken");

  return accessToken && refreshToken ? children : <Navigate to="/403" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
