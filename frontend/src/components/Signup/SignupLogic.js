import React, { useState } from "react";
import "../Login/login.module.css";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn/MovieButton/Button.js";
import CookieManager from "../../security/CookieManager";

export default function SignUpFunctionality() {

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }
  const filter = new Filter()
  let content;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const [profanityErrorMessage, setProfanityErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [response, setResponse] = useState(null)


  if (response && response.status === 200) {
    content = (
      <div className={SignUpStyles["success-msg"]}>
        {message}
      </div>
    );
  } else if (response && !response.status === 200) {
    content = (
      <div className={SignUpStyles["error-msg"]}>
        <i className="fa fa-times-circle" />
        {message}
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
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      CookieManager.encryptCookie("accessToken", data.access_token, {
        expires: 0.5,
      });
      CookieManager.encryptCookie("refreshToken", data.refresh_token, {
        expires: 7,
      });
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setMessage(data.message)
    } else {
      const messageText = await response.text();
      setMessage(messageText);
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      {content}
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
          autoComplete="off"
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