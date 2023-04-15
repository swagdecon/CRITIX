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
import Homepage from "./views/homepage.js";
import PrivateRoute from "./components/Other/privateRoutes.js";
import Error403 from "./views/errorMessages/403error.js";
import Error404 from "./views/errorMessages/404error.js";
import IndMovie from "./views/indMoviePage.js";
import LoadingPage from "./views/LoadingPage.js";
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
        <Route path="/movies/:endpoint/:id" element={<IndMovie />} />
        <Route path="/movies/movie/:id" element={<IndMovie />} />
        <Route path="/test" element={<LoadingPage />} />

        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
