import "../../../node_modules/video-react/dist/video-react.css";
import React from "react";
import PopflixTrailer2 from "./PopflixTrailer2.mp4";
import "./login.module.css";

export default function LoginPlayer() {
  return (
    <div>
      <video autoPlay loop muted src={PopflixTrailer2} type="video/mp4"></video>
    </div>
  );
}
