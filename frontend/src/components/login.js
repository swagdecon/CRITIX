import React, { useState } from "react";
import "../misc/login.css";
import "../misc/logo.scss";
import Logo from "./logo.js";
import Logo_Text from "../misc/POPFLIX_LOGO_OFFICIAL.png";
import Popcorn from "../misc/popcorn_logo";
function Login(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="preload"
          href="https://www.youtube.com/embed/U3-iXA6H3Q0?start=155&autoplay=1&loop=1&mute=1&modestbranding=1&controls=0&autohide=1&vq=2160&playlist=U3-iXA6H3Q0"
          as="video"
        />
        <link rel="stylesheet" href="./login.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />

        <title>Log in</title>
      </head>
      <body>
        <div id="wrapper">
          <div id="left">
            <div id="signin">
              <Logo />
              <img src={Logo_Text} className="homepage-logo" alt="logo" />

              <div className={props.error ? "alert alert-danger" : "hidden"}>
                {props.error}
              </div>
              <div className={props.logout ? "alert alert-success" : "hidden"}>
                Successfully logged out
              </div>

              <form action="/login" method="post">
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="text-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="text-input"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                    required
                  />

                  <span className="eye" onClick={togglePasswordVisibility}>
                    <i
                      id="hide"
                      className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
                    ></i>
                  </span>
                </div>
                <div class="css-button">
                  <p class="css-button-text">LOG IN</p>
                  <div class="css-button-inner">
                    <div class="reset-skew">
                      <Popcorn class="css-button-inner-text"></Popcorn>
                    </div>
                  </div>
                </div>
              </form>
              <div className="or">
                <hr className="bar" />
                <span>OR</span>
                <hr className="bar" />
              </div>
              <a href="/signup" className="secondary-btn">
                Sign up
              </a>
            </div>
            <footer id="main-footer">
              <p>Copyright &copy; 2022, All Rights Reserved By POPFLIX</p>
              <div>
                <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
              </div>
            </footer>
          </div>
          <div id="right">
            <div id="showcase">
              <div className="showcase-content">
                <div className="wrapper">
                  <div className="frame-container">
                    <iframe
                      title="LoginVideo"
                      src="https://www.youtube.com/embed/U3-iXA6H3Q0?start=155&end=232&autoplay=1&loop=1&mute=1&modestbranding=1&controls=0&autohide=1&vq=hd2160&playlist=U3-iXA6H3Q0"
                      frameborder="0"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
export default Login;
