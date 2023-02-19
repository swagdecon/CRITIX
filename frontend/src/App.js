import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ReactDOM from "react-dom/client";
import Login from "./components/login.js";
import SignUp from "./components/signup.js";

import TopRated from "./components/top_rated.js";
import NowPlaying from "./components/now_playing.js";
import Popular from "./components/popular.js";
import Upcoming from "./components/upcoming.js";
// import Error from "./components/error.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route path="/top_rated" element={<TopRated />} />
        <Route path="/now_playing" element={<NowPlaying />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/upcoming" element={<Upcoming />} />
        {/* <Route path="" element={<Error />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
