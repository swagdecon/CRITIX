import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.js";
import Login from "./views/login.js";
import SignUp from "./views/signup.js";
import Homepage from "./views/homepage.js";
import PrivateRoute from "./components/privateRoutes.js";
import Error403 from "./views/errorMessages/403error.js";
import Error404 from "./views/errorMessages/404error.js";
import IndMovie from "./views/indMoviePage.js";

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
        <Route path="/api/movies/:endpoint/:id" element={<IndMovie />} />
        <Route path="/api/movies/movie/:id" element={<IndMovie />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
