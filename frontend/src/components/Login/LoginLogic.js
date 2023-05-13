import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.module.css";
import Filter from "bad-words";
import LoginStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn//MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";
export default function LoginLogic() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const filter = new Filter();

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

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
      const response = await fetch(
        "http://localhost:8080/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        CookieManager.encryptCookie("accessToken", data.access_token, {
          expires: 0.5,
        });
        CookieManager.encryptCookie("refreshToken", data.refresh_token, {
          expires: 7,
        });
        navigate("/home");
      } else {
        setError(await response.text());
      }
      return;
    } catch (error) {
      setError(error);
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <div className={LoginStyles["error-msg"]}>
          <i className="fa fa-times-circle" />
          {error}
        </div>
      ) : null}

      <br />
      {errorMessage ? (
        <div className={LoginStyles["error-msg"]}>
          <i className="fa fa-times-circle" /> {errorMessage}
        </div>
      ) : null}
      <div>
        <input
          type="text"
          id="email"
          name="email"
          className={LoginStyles["text-input"]}
          autoComplete="current-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="Email"
        />
      </div>

      <div>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          className={LoginStyles["text-input"]}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />

        <span className={LoginStyles.eye} onClick={togglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          />
        </span>
      </div>
      <MovieButton innerIcon="clapperboard" />
    </form>
  );
}
