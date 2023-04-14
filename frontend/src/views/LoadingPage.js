import React from "react";
import "../components/Logo/logo.module.scss";
import Logo from "../components/Logo/Loader.js";
import "../misc/loading_page.css";

export default function LoadingPage() {
  return (
    <div className="test">
      <div id="wrapper">
        <div className="profile-main-loader">
          <div className="loader">
            <svg className="circular-loader" viewBox="25 25 50 50">
              <circle
                className="loader-path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#70c542"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
      <Logo />
    </div>
  );
}
