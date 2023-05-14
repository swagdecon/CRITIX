import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import CookieManager from "./CookieManager";

export default function PrivateRoute({ children, requestSent }) {
  let accessToken = CookieManager.decryptCookie("accessToken");
  let refreshToken = CookieManager.decryptCookie("refreshToken");

  const decodedToken = jwt_decode(accessToken);
  const currentTime = Date.now() / 1000;

  if (
    !decodedToken.exp < currentTime ||
    !accessToken ||
    !refreshToken ||
    !requestSent
  ) {
    return children;
  } else {
    <Navigate to="/403" />;
  }

  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requestSent: PropTypes.bool.isRequired,
  };
}

// export default function PrivateRoute({ children }) {
//   let accessToken = CookieManager.decryptCookie("accessToken");
//   let refreshToken = CookieManager.decryptCookie("refreshToken");

//   const decodedToken = jwt_decode(accessToken);
//   const currentTime = Date.now() / 1000;

//   if (!decodedToken.exp < currentTime || !accessToken || !refreshToken) {
//     return children;
//   } else {
//     <Navigate to="/403" />;
//   }

//   PrivateRoute.propTypes = {
//     children: PropTypes.node.isRequired,
//   };
// }
