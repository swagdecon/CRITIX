import React from "react";
import PopflixTrailer1 from "./PopflixTrailer1.mp4";
import "../Login/login.module.css";

export default function SignUpPlayer() {
  return (
    <video autoPlay loop muted src={PopflixTrailer1} type="video/mp4" />
  );
}
