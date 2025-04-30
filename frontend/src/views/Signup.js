import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/Login/login.module.css";
import "../components/Logo/logo.module.scss";
import Logo from "../components/Logo/Logo.js";
import SignUpPlayer from "../components/Signup/SignUpVideo.js";
import SignUpFunctionality from "../components/Signup/SignupLogic.js";
import SignUpStyles from "../components/Login/login.module.css";
import SignupMobile from "../components/Signup/SignupMUIMobile.js";
export default function Signup() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <SignupMobile />;
  }

  return (
    <div>
      <div id={SignUpStyles.left}>
        <div id={SignUpStyles.signin}>
          <Logo placement='login' />
          <SignUpFunctionality />
          {/* REDIRECT TO LOG IN PAGE */}
          <div className={SignUpStyles.or}>
            <hr className={SignUpStyles.bar} />
            <span>OR</span>
            <hr className={SignUpStyles.bar} />
          </div>
          <Link to="/login" className={SignUpStyles["secondary-btn"]}>
            <p>LOG IN</p>
          </Link>
        </div>
        <footer id={SignUpStyles["main-footer"]}>
          <p>&copy; 2023 CRITIX, All Rights Reserved</p>
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
            <div className={SignUpStyles["responsive-background"]} />
          </div>
        </div>
      </div>
    </div >
  );
}
