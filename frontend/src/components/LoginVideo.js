import "../../node_modules/video-react/dist/video-react.css";
import React from "react";
import PopflixTrailer2 from "../misc/Popflix_Trailer2.mp4";
import "../misc/login.css";

function LoginPlayer() {
  return (
    <div>
      <video autoPlay loop muted src={PopflixTrailer2} type="video/mp4"></video>
    </div>
  );
}
export default LoginPlayer;
