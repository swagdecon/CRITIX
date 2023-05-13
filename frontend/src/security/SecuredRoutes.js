import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ children }) {
  let accessToken = Cookies.get("accessToken");
  let refreshToken = Cookies.get("refreshToken");

  return accessToken && refreshToken ? children : <Navigate to="/403" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
