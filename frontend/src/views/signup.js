import React from "react";
import { Link } from "react-router-dom";
import "../misc/login.css";
import "../misc/logo.scss";
import Logo from "../components/logo.js";
import Logo_Text from "../misc/POPFLIX_LOGO_OFFICIAL.png";
import SignUpPlayer from "../components/SignUpVideo.js";
import SignupFunctionality from "../components/signupFunctionality.js";
function SignUp() {
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

              <SignupFunctionality></SignupFunctionality>
              {/* REDIRECT TO LOG IN PAGE */}
              <div className="or">
                <hr className="bar" />
                <span>OR</span>
                <hr className="bar" />
              </div>
              <Link to="/login" className="secondary-btn">
                <p className="css-button-text-2">LOG IN</p>
              </Link>
            </div>
            <footer id="main-footer">
              <p>Copyright &copy; 2022, All Rights Reserved By POPFLIX</p>
              <div>
                <Link to="#">Terms of Use</Link> |{" "}
                <Link to="#">Privacy Policy</Link>
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
