import React from "react";
import "./Login/login.css";
import "../misc/logo.scss";

function Loader() {
  return (
    <div className="logo-wrapper">
      <div className="homepage-logo">
        <div className="loader__container">
          <div className="loader__film">
            <img
              className="loader__film-img"
              src="https://www.dropbox.com/s/o4p5i3nfw92rhfz/film.png?raw=1"
              alt=""
            />
            <img
              className="loader__film-img"
              src="https://www.dropbox.com/s/o4p5i3nfw92rhfz/film.png?raw=1"
              alt=""
            />
          </div>
          <img
            className="loader__camera"
            src="https://www.dropbox.com/s/348z6yvtt9hbos2/camera.png?raw=1"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Loader;

// CSS can be included separately in a CSS file or added as inline styles. Example of inline styles:
