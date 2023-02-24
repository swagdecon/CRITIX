import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.js";
import Login from "./components/login.js";
import SignUp from "./components/signup.js";

import TopRated from "./components/top_rated.js";
import NowPlaying from "./components/now_playing.js";
import Popular from "./components/popular.js";
import Upcoming from "./components/upcoming.js";
import Homepage from "./components/homepage.js";
import PrivateRoute from "./components/privateRoutes.js";
import LocalState from "./components/localStorage.js";

function App() {
  const [jwt, setJwt] = LocalState("", "jwt");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

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
