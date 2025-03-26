import { React } from "react";
import { Link } from "react-router-dom";
import "../components/Login/login.module.css";
import "../components/Logo/logo.module.scss";
import "../components/Logo/logo.module.css";
import Logo from "../components/Logo/Loader.js";
import Logo_Text from "../components/Logo/POPFLIX_LOGO_OFFICIAL.png";
import LoginPlayer from "../components/Login/LoginVideo";
import LoginFunctionality from "../components/Login/LoginLogic.js";
import LoginStyles from "../components/Login/login.module.css";

export default function Login() {
  return (
    <div>
      <div id={LoginStyles.left}>
        <div id={LoginStyles.signin}>
          <Logo />
          <img
            src={Logo_Text}
            className={LoginStyles["homepage-logo"]}
            alt="logo"
          />
          <LoginFunctionality />
          <div className={LoginStyles["reset-pwd"]}>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
          <div className={LoginStyles.or}>
            <hr className={LoginStyles.bar} />
            <span>OR</span>
            <hr className={LoginStyles.bar} />
          </div>
          <Link to="/" className={LoginStyles["secondary-btn"]}>
            SIGN UP
          </Link>
        </div>
        <footer id={LoginStyles["main-footer"]}>
          <p>&copy; 2023, All Rights Reserved By POPFLIX</p>
          <div>
            <Link to="#">Terms of Use</Link> |{" "}
            <Link to="#">Privacy Policy</Link>
          </div>
        </footer>
      </div>
      <div id={LoginStyles.right}>
        <div id={LoginStyles.showcase}>
          <div className={LoginStyles["showcase-content"]}>
            <div className={LoginStyles.overlay}>
              <LoginPlayer />
            </div>
            <div className={LoginStyles["responsive-background"]} />
          </div>
        </div>
      </div>
    </div >
  );
}
