import React from "react";
import CritixLogo from "./CRITIX_LOGO_OFFICIAL.png";
import AnimatedLogo from "./logo.module.css";
import { Link } from "react-router-dom";
export default function Logo() {
  return (
    <Link to="/home">
      <div id="logo" className={AnimatedLogo.Logo}>
        <img src={CritixLogo} className={AnimatedLogo.Logo} alt="logo" />
      </div>
    </Link>
  );
}
