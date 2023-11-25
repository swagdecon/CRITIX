import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./login.module.css";
import Filter from "bad-words";
import LoginStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn//MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";

export default function LoginLogic() {

  let displayErrMsgLogic;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profanityError, setProfanityError] = useState("");
  const [message, setMessage] = useState("");
  const filter = useMemo(() => new Filter(), []);
  const [response, setResponse] = useState(null)
  const [emailErr, setEmailErr] = useState(false)
  const navigate = useNavigate()


  const resendAuthEmail = async (userEmail) => {
    try {
      const response = await fetch(
        "http://localhost:8080/v1/auth/send-password-authentication-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      const text = await response.text();
      setMessage(text);
      resetInputFields()
      setEmailErr(false)
    } catch (error) {
      setMessage("Error occurred: " + error);
    }
  }


  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }
  function resetInputFields() {
    setEmail("")
    setPassword("")
  }


  if (response && response.status !== 200) {
    displayErrMsgLogic = (
      <div className={LoginStyles["error-msg-wrapper"]}>
        <div className={LoginStyles["error-msg"]}>
          <i className="fa fa-times-circle" />
          {" "}{message}
        </div>
      </div>
    )
  } else if (profanityError) {
    displayErrMsgLogic = (
      <div className={LoginStyles["error-msg-wrapper"]}>
        <div className={LoginStyles["error-msg"]}>
          <i className="fa fa-times-circle" /> {profanityError}
        </div>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { email, password };
    const hasEmailProfanity = filter.isProfane(userData["email"]);
    const hasPasswordProfanity = filter.isProfane(userData["password"]);

    if (hasEmailProfanity || hasPasswordProfanity) {
      setProfanityError("*Input(s) cannot contain profanity*");
      return;
    } else {
      setProfanityError("");
    }

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

    setResponse(response);

    if (response.ok) {
      const data = await response.json();
      CookieManager.encryptCookie("accessToken", data.access_token, {
        expires: 1,
      });
      CookieManager.encryptCookie("refreshToken", data.refresh_token, {
        expires: 7,
      });
      setMessage(data.message);
      resetInputFields()
      navigate("/home")
    } else {
      const messageText = await response.text();
      if (messageText === "There was an error sending your account activation email.") {
        setEmailErr(true);
      }
      setMessage(messageText);
      resetInputFields()
    }
    return;
  };

  return (
    <form onSubmit={handleSubmit}>
      {displayErrMsgLogic}
      {emailErr ?
        <div >
          <button type="button" className={LoginStyles["resend-pwd-auth"]} onClick={() => resendAuthEmail(email)}>Resend authentication email</button>
        </div>
        : null
      }
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
