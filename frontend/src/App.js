import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ReactDOM from "react-dom/client";
import Login from "./components/login.js";
import TopRated from "./components/top_rated.js";
import NowPlaying from "./components/now_playing.js";
import Popular from "./components/popular.js";
import Upcoming from "./components/upcoming.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/top_rated" element={<TopRated />} />
        <Route path="/now_playing" element={<NowPlaying />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/upcoming" element={<Upcoming />} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
