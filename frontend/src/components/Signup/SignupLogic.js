import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.module.css";
import Popcorn from "../../misc/popcorn_logo";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";
// import axios from "axios";

function SignUpFunctionality() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }
  const filter = new Filter();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [profanityErrorMessage, setProfanityErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { firstname, lastname, email, password };

    const hasFirstNameProfanity = filter.isProfane(userData["firstname"]);
    const hasLastNameProfanity = filter.isProfane(userData["lastname"]);
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
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        navigate("/login", { replace: true });
      } else {
        const errorBody = await response.text();
        setError(errorBody);
        return;
      }
    } catch (error) {
      navigate("/error", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={SignUpStyles.error}>{error}</div>
      <br />
      <div className={SignUpStyles.error}>{profanityErrorMessage}</div>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          className={SignUpStyles["text-input"]}
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          autoComplete="current-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className={SignUpStyles["text-input"]}
          autoComplete="off"
          value={firstname}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className={SignUpStyles["text-input"]}
          autoComplete="off"
          value={lastname}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          className={SignUpStyles["text-input"]}
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <span className={SignUpStyles.eye} onClick={togglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          ></i>
        </span>
      </div>
      <button
        type="submit"
        onSubmit={handleSubmit}
        className={SignUpStyles["css-button"]}
      >
        <p className={SignUpStyles["css-button-text"]}>SIGN UP</p>
        <div className={SignUpStyles["css-button-inner"]}>
          <div className={SignUpStyles["reset-skew"]}>
            <Popcorn className={SignUpStyles["css-button-inner-text"]} />
          </div>
        </div>
      </button>
    </form>
  );
}
export default SignUpFunctionality;
