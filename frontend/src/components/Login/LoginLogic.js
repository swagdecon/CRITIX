import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./login.module.css";
import Filter from "bad-words";
import LoginStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn//MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";
import { resendAuthEmail, Message, togglePasswordVisibility, ProfanityLogic } from "../../security/Shared.js";
const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT;
export default function LoginLogic() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const filter = useMemo(() => new Filter(), []);
  const [endpointResponse, setEndpointResponse] = useState(null)
  const [emailErr, setEmailErr] = useState(false)
  const navigate = useNavigate()

  const resendEmail = () => {
    resendAuthEmail(email, setMessage, setEmailErr);
  };

  const handleTogglePasswordVisibility = () => {
    togglePasswordVisibility(passwordVisible, setPasswordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { email, password };
    const hasProfanity = filter.isProfane(userData["email"]) || filter.isProfane(userData["password"]);

    if (!ProfanityLogic(hasProfanity, setError)) {

      const response = await fetch(
        LOGIN_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      setEndpointResponse(response);

      if (response.ok) {
        const data = await response.json();
        CookieManager.encryptCookie("accessToken", data.access_token, {
          expires: 1,
        });
        CookieManager.encryptCookie("refreshToken", data.refresh_token, {
          expires: 7,
        });
        setMessage(data.message);
        navigate("/home")
      } else {
        const messageText = await response.text();

        if (messageText === "Please check your email to verify your account") {
          setEmailErr(true);
          setMessage(messageText);
        } else {
          setError("Something went wrong, please try again.")
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Message response={endpointResponse} message={message} style={LoginStyles} error={error} />
      {emailErr ?
        <div >
          <button type="button" className={LoginStyles["resend-pwd-auth"]} onClick={resendEmail}>Resend authentication email</button>
        </div>
        : null
      }
      <br />
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
        <span className={LoginStyles.eye} onClick={handleTogglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          />
        </span>
      </div>
      <MovieButton innerIcon="clapperboard" />
      <br />
    </form>
  );
}
