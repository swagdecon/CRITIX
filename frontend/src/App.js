import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.js";
import Login from "./views/Signin.js";
import SignUp from "./views/Signup.js";
import Homepage from "./views/Homepage.js";
import PrivateRoute from "./components/Other/SecuredRoutes.js";
import Error403 from "./views/errorMessages/403error.js";
import Error404 from "./views/errorMessages/404error.js";
import IndMovie from "./views/IndMoviePage.js";
import IndPerson from "./views/IndPersonPage.js";
import MovieListInTheatres from "./components/MovieListInTheatres/MovieListInTheatres.js";
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
        <Route path="/now_playing" element={<MovieListInTheatres />} />
        <Route path="/movies/:endpoint/:id" element={<IndMovie />} />
        <Route path="/movies/movie/:id" element={<IndMovie />} />
        <Route path="/person/:id" element={<IndPerson />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
