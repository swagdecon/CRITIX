import React, { useState } from "react";
import "../Login/login.module.css";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn/MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";
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

    const hasProfanity = filter.isProfane(userData["firstName"]) || filter.isProfane(userData["lastName"]) || filter.isProfane(userData["email"]) || filter.isProfane(userData["password"]);

    if (
      hasProfanity
    ) {
      setProfanityErrorMessage("Input(s) cannot contain profanity");
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
      {displayErrMsgLogic}
      {emailErr ?
        <div >
          <button type="button" className={SignUpStyles["resend-pwd-auth"]} onClick={() => resendAuthEmail(email)}>Resend authentication email</button>
        </div>
        : null
      }
      <br />
      {
        profanityErrorMessage ? (
          <div className={SignUpStyles["error-msg"]}>
            <i className="fa fa-times-circle" /> {profanityErrorMessage}
          </div>
        ) : null
      }
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
    </form >
  );
}