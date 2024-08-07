import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CookieManager from "./CookieManager";

export default function PrivateRoute({ children }) {
  let accessToken = CookieManager.decryptCookie("accessToken");
  let refreshToken = CookieManager.decryptCookie("refreshToken");
  let decodedToken;
  const currentTime = Date.now() / 1000;

  try {
    decodedToken = jwtDecode(accessToken);
  } catch (e) {
    return <Navigate to="/403" />;
  }


  if (decodedToken.exp < currentTime || accessToken || refreshToken) {
    return children;
  } else {
    return <Navigate to="/403" />;
  }
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
