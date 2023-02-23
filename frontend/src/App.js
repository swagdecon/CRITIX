import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.js";
import Login from "./components/login.js";
import SignUp from "./components/signup.js";

import TopRated from "./components/top_rated.js";
import NowPlaying from "./components/now_playing.js";
import Popular from "./components/popular.js";
import Upcoming from "./components/upcoming.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/top_rated" element={<TopRated />} />
        <Route path="/now_playing" element={<NowPlaying />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/upcoming" element={<Upcoming />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
