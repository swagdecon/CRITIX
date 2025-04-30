import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/Login/login.module.css";
import "../components/Logo/logo.module.scss";
import "../components/Logo/logo.module.css";
import Logo from "../components/Logo/Logo.js";
import LoginPlayer from "../components/Login/LoginVideo.js";
import LoginFunctionality from "../components/Login/LoginLogic.js";
import LoginStyles from "../components/Login/login.module.css";
import LoginMobile from "../components/Login/LoginMUIMobile.js";

export default function Login() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <LoginMobile />;
  }

  return (
    <div>
      <div id={LoginStyles.left}>
        <div id={LoginStyles.signin}>
          <Logo placement="login" />
          <LoginFunctionality />
          <div className={LoginStyles["reset-pwd"]}>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
          <div className={LoginStyles.or}>
            <hr className={LoginStyles.bar} />
            <span>OR</span>
            <hr className={LoginStyles.bar} />
          </div>
          <Link to="/signup" className={LoginStyles["secondary-btn"]}>
            SIGN UP
          </Link>
        </div>
        <footer id={LoginStyles["main-footer"]}>
          <p>&copy; 2023, All Rights Reserved By CRITIX</p>
          <div>
            <Link to="#">Terms of Use</Link> |{" "}
            <Link to="#">Privacy Policy</Link>
          </div>
        </footer>
      </div>
      <div id={LoginStyles.right}>
        <div className={LoginStyles.overlay}>
          <LoginPlayer />
        </div>
        <div className={LoginStyles["responsive-background"]} />
      </div>
    </div>
  );
}