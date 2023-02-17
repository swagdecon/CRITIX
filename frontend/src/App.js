import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import TopRated from "./components/top_rated";
import NowPlaying from "./components/now_playing";
import Popular from "./components/popular";
import Upcoming from "./components/upcoming";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/top_rated" element={<TopRated />} />
      <Route path="/now_playing" element={<NowPlaying />} />
      <Route path="/popular" element={<Popular />} />
      <Route path="/upcoming" element={<Upcoming />} />
    </Routes>
  );
}

export default App;
