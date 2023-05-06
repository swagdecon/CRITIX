import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.module.css";
import Popcorn from "../../misc/popcorn_logo";
import Filter from "bad-words";
import SignUpStyles from "../Login/login.module.css";

export default function SignUpFunctionality() {
  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const filter = new Filter();
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [profanityErrorMessage, setProfanityErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      const response = await fetch("http://localhost:8080/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", JSON.stringify(data.access_token));
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(data.refresh_token)
        );
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
      <div className={SignUpStyles.error}>{error}</div>
      <br />
      <div className={SignUpStyles.error}>{profanityErrorMessage}</div>
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
          value={firstname}
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
          value={lastname}
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
