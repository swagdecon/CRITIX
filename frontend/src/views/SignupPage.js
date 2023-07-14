import React from "react";
import { Link } from "react-router-dom";
import "../components/Login/login.module.css";
import "../components/Logo/logo.module.scss";
import Logo from "../components/Logo/Loader.js";
import Logo_Text from "../components/Logo/POPFLIX_LOGO_OFFICIAL.png";
import SignUpPlayer from "../components/Signup/SignUpVideo.js";
import SignUpFunctionality from "../components/Signup/SignupLogic.js";
import SignUpStyles from "../components/Login/login.module.css";

export default function SignUp() {
  return (
    <div>
      <div id={SignUpStyles.left}>
        <div id={SignUpStyles.signin}>
          <Logo />
          <img
            src={Logo_Text}
            className={SignUpStyles["homepage-logo"]}
            alt="logo"
          />

          <SignUpFunctionality />
          {/* REDIRECT TO LOG IN PAGE */}
          <div className={SignUpStyles.or}>
            <hr className={SignUpStyles.bar} />
            <span>OR</span>
            <hr className={SignUpStyles.bar} />
          </div>
          <Link to="/login" className={SignUpStyles["secondary-btn"]}>
            <p className={SignUpStyles["css-button-text-2"]}>LOG IN</p>
          </Link>
        </div>
        <footer id={SignUpStyles["main-footer"]}>
          <p>&copy; 2023 POPFLIX, All Rights Reserved</p>
          <div>
            <Link to="#">Terms of Use</Link> |{" "}
            <Link to="#">Privacy Policy</Link>
          </div>
        </footer>
      </div>
      <div id={SignUpStyles.right}>
        <div id={SignUpStyles.showcase}>
          <div className={SignUpStyles["showcase-content"]}>
            <div className={SignUpStyles.overlay}>
              <SignUpPlayer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
