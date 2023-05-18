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
  const api_key = "d84f9365179dc98dc69ab22833381835";
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
              title={"Popular Movies:"}
              caption={"Discover What Everyone Is Watching Right Now"}
              endpoint={"/movies/popular"}
            />
          }
        />
        <Route
          path="/upcoming"
          element={
            <MovieListPage
              title={"Upcoming Movies:"}
              caption={"Get a Sneak Peek of What's Coming Soon"}
              endpoint={"/movies/upcoming"}
            />
          }
        />
        <Route
          path="/now_playing"
          element={
            <MovieListPage
              title={"In Theatres:"}
              caption={"The Latest Movies on the Big Screen"}
              endpoint={`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=1`}
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
