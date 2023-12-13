import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.js";
import Login from "./views/SigninPage.js";
import SignUp from "./views/SignupPage.js";
import Homepage from "./views/Homepage.js";
import PrivateRoute from "./security/SecuredRoutes.js";
import Error403 from "./views/errorMessages/403/403error.js";
import Error404 from "./views/errorMessages/404/404error.js";
import IndMovie from "./views/IndFilmPage.js";
import IndPerson from "./views/IndPersonPage.js";
import MovieListPage from "./views/MovieListPage.js";
import ConfirmEmailForPwdReset from "./views/SendResetPwdEmail.js";
import ResetPassword from "./views/ResetPassword.js";
import AccountVerification from "./views/AccountVerification.js"
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/popular"
          element={<PrivateRoute><MovieListPage endpointName="popular" /></PrivateRoute>}
        />
        <Route
          path="/upcoming"
          element={<PrivateRoute><MovieListPage endpointName="upcoming" /></PrivateRoute>}
        />
        <Route
          path="/now_playing"
          element={<PrivateRoute><MovieListPage endpointName="now_playing" /></PrivateRoute>}
        />
        <Route path="/movies/:endpoint/:id" element={<PrivateRoute><IndMovie /></PrivateRoute>} />
        <Route path="/movies/movie/:id" element={<PrivateRoute><IndMovie /></PrivateRoute>} />
        <Route path="/person/:id" element={<PrivateRoute><IndPerson /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ConfirmEmailForPwdReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/activate-account/:token" element={<AccountVerification />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
