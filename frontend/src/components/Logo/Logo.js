import React from "react";
import PopflixLogo from "./POPFLIX_LOGO_OFFICIAL.png";
import AnimatedLogo from "./logo.module.css";

const Logo = () => {
  return (
    <div id="logo" className={AnimatedLogo.Logo}>
      <img src={PopflixLogo} className={AnimatedLogo.Logo} alt="logo" />
    </div>
  );
};

export default Logo;
