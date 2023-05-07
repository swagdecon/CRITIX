import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.module.css";
import Filter from "bad-words";
import LoginStyles from "../Login/login.module.css";
import MovieButton from "../Btn/Button";
export default function LoginFunctionality() {
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
    const token = JSON.parse(localStorage.getItem("accessToken"));

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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", JSON.stringify(data.access_token));
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(data.refresh_token)
        );
        navigate("/home");
      }
    } catch (error) {
      setError(error);
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={LoginStyles.error}>{error}</div>
      <br />
      <div className={LoginStyles.error}>{errorMessage}</div>

      <div>
        {/* <label htmlFor="email">Email</label> */}
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
        {/* <label htmlFor="password">Password</label> */}
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
