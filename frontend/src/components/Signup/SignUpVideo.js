import "../../../node_modules/video-react/dist/video-react.css";
import React from "react";
import PopflixTrailer1 from "./Popflix_Trailer1.mp4";
import "../Login/login.module.css";
function SignUpPlayer() {
  return (
    <div>
      <video autoPlay loop muted src={PopflixTrailer1} type="video/mp4"></video>
    </div>
  );
}
export default SignUpPlayer;
