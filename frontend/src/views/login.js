import { React } from "react";
import { Link } from "react-router-dom";
import "../components/Login/login.css";
import "../misc/logo.scss";
import Logo from "../components/logo.js";
import Logo_Text from "../misc/POPFLIX_LOGO_OFFICIAL.png";
import LoginPlayer from "../components/Login/LoginVideo";
import LoginFunctionality from "../components/Login/loginFunctionality";

function Login() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://www.youtube.com/embed/U3-iXA6H3Q0?start=155&autoplay=1&loop=1&mute=1&modestbranding=1&controls=0&autohide=1&vq=2160&playlist=U3-iXA6H3Q0"
          as="video"
        />
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
              <LoginFunctionality></LoginFunctionality>
              <div className="or">
                <hr className="bar" />
                <span>OR</span>
                <hr className="bar" />
              </div>
              <Link to="/" className="secondary-btn">
                SIGN UP
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
                  <LoginPlayer></LoginPlayer>
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
