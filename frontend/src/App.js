import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}
export default App;
