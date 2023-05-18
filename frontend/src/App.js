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
          element={
            <MovieListPage
              title={
                "Popular Movies: Discover What Everyone Is Watching Right Now"
              }
              endpoint={"/movies/popular"}
            />
          }
        />
        <Route
          path="/upcoming"
          element={
            <MovieListPage
              title={"Upcoming Movies: Get a Sneak Peek of What's Coming Soon"}
              endpoint={"/movies/upcoming"}
            />
          }
        />
        <Route
          path="/now_playing"
          element={
            <MovieListPage
              title={"In Theatres: he Latest Movies on the Big Screen"}
              endpoint={"/movies/now_playing"}
            />
          }
        />
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
