import React, { useState } from "react";
import "../misc/login.css";
import "../misc/logo.scss";
import Logo from "../components/logo.js";
import Logo_Text from "../misc/POPFLIX_LOGO_OFFICIAL.png";
import SignUpPlayer from "../components/SignUpVideo.js";
import SignupFunctionality from "../components/signupFunctionality.js";
function SignUp(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />

        <title>Sign Up</title>
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
              <SignupFunctionality></SignupFunctionality>
              {/* REDIRECT TO LOG IN PAGE */}
              <div className="or">
                <hr className="bar" />
                <span>OR</span>
                <hr className="bar" />
              </div>
              <a href="/login" className="secondary-btn">
                LOG IN
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
                <div className="overlay">
                  <SignUpPlayer></SignUpPlayer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
export default SignUp;
