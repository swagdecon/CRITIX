import React, { useState, useMemo } from "react";
import "../Login/login.module.css";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn/MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";
import { togglePasswordVisibility, resendAuthEmail, Message, ProfanityLogic } from "../Shared/Shared.js";
const SIGNUP_URL = process.env.REACT_APP_SIGNUP_ENDPOINT;

export default function SignUpFunctionality() {

  const [emailErr, setEmailErr] = useState(false)
  const filter = useMemo(() => new Filter(), []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [profanityError, setProfanityError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [endpointResponse, setEndpointResponse] = useState(null)
  const handleEmailChange = (event) => setEmail(event.target.value)
  const handleFirstNameChange = (event) => setFirstName(event.target.value)
  const handleLastNameChange = (event) => setLastName(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)
  const handleTogglePasswordVisibility = () => {
    togglePasswordVisibility(passwordVisible, setPasswordVisible);
  };

  function resetInputFields() {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
  }

  const resendEmail = () => {
    resendAuthEmail(email, setMessage, setEmailErr);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { firstName, lastName, email, password };
    const hasProfanity = filter.isProfane(userData["firstName"]) || filter.isProfane(userData["lastName"]) || filter.isProfane(userData["email"]) || filter.isProfane(userData["password"]);

    if (ProfanityLogic(hasProfanity, setProfanityError)) {
      // Stops creation of user
      return
    }


    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    setEndpointResponse(response);

    if (response.ok) {
      const data = await response.json();
      CookieManager.encryptCookie("accessToken", data.access_token, {
        expires: 0.5,
      });
      CookieManager.encryptCookie("refreshToken", data.refresh_token, {
        expires: 7,
      });
      setMessage(data.message);
      resetInputFields()
    } else {
      const messageText = await response.text();
      if (messageText === "There was an error sending your account activation email.") {
        setEmailErr(true);
      }
      setMessage(messageText);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Message response={endpointResponse} message={message} style={SignUpStyles} profanityError={profanityError} />
      {emailErr ?
        <div >
          <button type="button" className={SignUpStyles["resend-pwd-auth"]} onClick={resendEmail}>Resend authentication email</button>
        </div>
        : null
      }
      <br />
      <div>
        <input
          type="email"
          id="email"
          name="email"
          className={SignUpStyles["text-input"]}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          autoComplete="on"
          value={email}
          onChange={handleEmailChange}
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
          onChange={handleFirstNameChange}
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
          onChange={handleLastNameChange}
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
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          required
        />
        <span className={SignUpStyles.eye} onClick={handleTogglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          />
        </span>
      </div>
      <MovieButton innerIcon="popcorn" onSubmit={handleSubmit} />
    </form >
  );
}