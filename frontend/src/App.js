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
import TopRated from "./views/top_rated.js";
import NowPlaying from "./views/now_playing.js";
import Popular from "./views/popular.js";
import Upcoming from "./views/upcoming.js";
import Homepage from "./views/homepage.js";
import PrivateRoute from "./components/privateRoutes.js";
import MovieDetails from "./components/MovieDetails/MovieDetails.js";
import Error403 from "./views/403error.js";
import Error404 from "./views/404error.js";
import IndMovie from "./views/ind_movie_page.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/single" element={<MovieDetails />} />
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route path="/top_rated" element={<TopRated />} />
        <Route path="/now_playing" element={<NowPlaying />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/api/movies/popular/:id" element={<IndMovie />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
export default App;
