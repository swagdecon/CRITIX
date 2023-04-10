import "../../../node_modules/video-react/dist/video-react.css";
import React from "react";
import PopflixTrailer1 from "./Popflix_Trailer1.mp4";
import "../Login/login.module.css";

export default function SignUpPlayer() {
  return (
    <video autoPlay loop muted src={PopflixTrailer1} type="video/mp4"></video>
  );
}
