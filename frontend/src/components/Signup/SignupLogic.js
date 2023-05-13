import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.module.css";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
import MovieButton from "../Other/btn/MovieButton/Button.js";
import Cookies from "js-cookie";
export default function SignUpFunctionality() {
  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const filter = new Filter();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [profanityErrorMessage, setProfanityErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      setError("");
      return;
    } else {
      setProfanityErrorMessage("");
    }
    try {
      const response = await fetch("http://localhost:8080/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set("accessToken", data.access_token, { expires: 0.5 });
        Cookies.set("refreshToken", data.refresh_token, { expires: 7 });
        navigate("/login");
      } else {
        setError(await response.text());
      }
      return;
    } catch (error) {
      navigate("/error");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <div className={SignUpStyles["error-msg"]}>
          <i className="fa fa-times-circle" />
          {error}
        </div>
      ) : null}
      <br />
      {profanityErrorMessage ? (
        <div className={SignUpStyles["error-msg"]}>
          <i className="fa fa-times-circle" /> {profanityErrorMessage}
        </div>
      ) : null}
      <div>
        {/* <label htmlFor="email">Email Address</label> */}
        <input
          type="email"
          id="email"
          name="email"
          className={SignUpStyles["text-input"]}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          autoComplete="current-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        {/* <label htmlFor="firstName">First Name</label> */}
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
        {/* <label htmlFor="lastName">Last Name</label> */}
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
        {/* <label htmlFor="password">Password</label> */}
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
