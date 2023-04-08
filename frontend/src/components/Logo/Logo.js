import React from "react";
import PopflixLogo from "./POPFLIX_LOGO_OFFICIAL.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div id="logo" className="Logo">
      <img src={PopflixLogo} className="Logo" alt="logo" />
    </div>
  );
};

export default Logo;
