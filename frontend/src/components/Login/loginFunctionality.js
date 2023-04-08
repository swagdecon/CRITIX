import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.module.css";
import "../../misc/clapperboard.css";
import Filter from "bad-words";
import sha256 from "crypto-js/sha256";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import LoginStyles from "../Login/login.module.css";

function LoginFunctionality() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const filter = new Filter();

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const {
        userAgent,
        language,
        hardwareConcurrency,
        doNotTrack,
        maxTouchPoints,
      } = window.navigator;
      const fingerprint = sha256(
        `${result.visitorId}${userAgent}${language}${hardwareConcurrency}${doNotTrack}${maxTouchPoints}`
      ).toString();

      setFingerprint(fingerprint);
    };
    getFingerprint();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { email, password };
    const hasEmailProfanity = filter.isProfane(userData["email"]);
    const hasPasswordProfanity = filter.isProfane(userData["password"]);
    if (hasEmailProfanity || hasPasswordProfanity) {
      setErrorMessage("*Input(s) cannot contain profanity*");
      return;
    } else {
      setErrorMessage("");
    }
    try {
      const myResponse = await fetch(
        "http://localhost:8080/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Fingerprint": fingerprint,
          },
          body: JSON.stringify(userData),
        }
      );
      if (myResponse.ok) {
        const responseJson = await myResponse.json();
        const { token } = responseJson;

        const tokenWithFingerprint = JSON.stringify({ token, fingerprint });

        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("jwt", tokenWithFingerprint);
        } else {
          console.error("SessionStorage is not available for storing JWT");
          navigate("/403", { replace: true });
        }

        navigate("/home", { replace: true });
      } else {
        setError("*Invalid Username or Password*");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className={LoginStyles.error}>{error}</div>

      <br />
      <div className={LoginStyles.error}>{errorMessage}</div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          className={LoginStyles["text-input"]}
          autoComplete="current-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          className={LoginStyles["text-input"]}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <span className={LoginStyles.eye} onClick={togglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          ></i>
        </span>
      </div>
      <button type="submit" className={LoginStyles["css-button"]}>
        <p className={LoginStyles["css-button-text"]}>LOG IN</p>
        <div className={LoginStyles["css-button-inner"]}>
          <div className={LoginStyles["reset-skew"]}>
            <clapperboard-div
              className={LoginStyles["css-button-inner-text"]}
            ></clapperboard-div>
          </div>
        </div>
      </button>
    </form>
  );
}
export default LoginFunctionality;
