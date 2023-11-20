import React, { useState } from "react";
import "../Login/login.module.css";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn/MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";
import { Link } from "react-router-dom";

export default function SignUpFunctionality() {

  let displayErrMsgLogic;
  const [emailErr, setEmailErr] = useState(false)
  const filter = new Filter()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [profanityErrorMessage, setProfanityErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [response, setResponse] = useState(null)


  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }


  async function resendAuthEmail(email) {
    const response = await fetch(
      "http://localhost:8080/v1/auth/send-password-authentication-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: email
      }
    );
    if (response.ok) {
      setMessage("")
    }
  }


  function resetInputFields() {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
  }


  if (response && response.status === 200) {
    displayErrMsgLogic = (
      <div className={SignUpStyles["success-msg-wrapper"]}>
        <div className={SignUpStyles["success-msg"]}>
          {message}
        </div>
      </div>
    );
  } else if (response && response.status !== 200) {
    displayErrMsgLogic = (
      <div className={SignUpStyles["error-msg-wrapper"]}>
        <div className={SignUpStyles["error-msg"]}>
          <i className="fa fa-times-circle" />
          {message}
        </div>
      </div>
    );
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { firstName, lastName, email, password };

    const hasFirstNameProfanity = filter.isProfane(userData["firstName"]);
    const hasLastNameProfanity = filter.isProfane(userData["lastName"]);
    const hasEmailProfanity = filter.isProfane(userData["email"]);
    const hasPasswordProfanity = filter.isProfane(userData["password"]);

    if (
      hasEmailProfanity ||
      hasFirstNameProfanity ||
      hasLastNameProfanity ||
      hasPasswordProfanity
    ) {
      setProfanityErrorMessage("*Input(s) cannot contain profanity*");
      setMessage("");
      return;
    } else {
      setProfanityErrorMessage("");
    }

    const response = await fetch("http://localhost:8080/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    setResponse(response);
    const data = await response.json();
    console.log(data)
    if (response.ok) {
      CookieManager.encryptCookie("accessToken", data.access_token, {
        expires: 0.5,
      });
      CookieManager.encryptCookie("refreshToken", data.refresh_token, {
        expires: 7,
      });
      resetInputFields()
      setMessage(data.message)
    } else if (response.text() === "ERR_SEND_EMAIL") {
      setEmailErr(true)
    } else {
      const messageText = await response.text();
      resetInputFields()
      setMessage(messageText);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {displayErrMsgLogic}
      <br />
      {emailErr ?
        <div className={SignUpStyles["reset-pwd"]}>
          <Link onClick={resendAuthEmail}>Resend authentication email</Link>
        </div>
        : null}
      <br />
      {profanityErrorMessage ? (
        <div className={SignUpStyles["error-msg"]}>
          <i className="fa fa-times-circle" /> {profanityErrorMessage}
        </div>
      ) : null}
      <div>
        <input
          type="email"
          id="email"
          name="email"
          className={SignUpStyles["text-input"]}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          autoComplete="on"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className={SignUpStyles["text-input"]}
          autoComplete="on"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="First Name"
          required
        />
      </div>
      <div>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className={SignUpStyles["text-input"]}
          autoComplete="on"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Last Name"
          required
        />
      </div>
      <div>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          className={SignUpStyles["text-input"]}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <span className={SignUpStyles.eye} onClick={togglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          />
        </span>
      </div>
      <MovieButton innerIcon="popcorn" onSubmit={handleSubmit} />
    </form>
  );
}