import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../misc/login.css";
import "../misc/clapperboard.css";
import Filter from "bad-words";

function LoginFunctionality() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const filter = new Filter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { email, password };
    const hasEmailProfanity = filter.isProfane(userData["email"]);
    const hasPasswordProfanity = filter.isProfane(userData["password"]);
    if (hasEmailProfanity || hasPasswordProfanity) {
      setErrorMessage("*Input(s) cannot contain profanity*");
      return;
    } else {
      setErrorMessage("");
    }
    try {
      const myResponse = await fetch(
        "http://localhost:8080/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (myResponse.ok) {
        const responseJson = await myResponse.json();
        const token = JSON.stringify(responseJson.token);

        if (typeof localStorage !== "undefined") {
          localStorage.setItem("jwt", token);
        } else if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("jwt", token);
        } else {
          console.error(
            "Neither localStorage nor sessionStorage is available for storing JWT"
          );
        }
        navigate("/homepage", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div-error>{errorMessage}</div-error>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          className="text-input"
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          className="text-input"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <span className="eye" onClick={togglePasswordVisibility}>
          <i
            id="hide"
            className={`bi bi-eye${passwordVisible ? "-slash" : ""}`}
          ></i>
        </span>
      </div>
      <button type="submit" className="css-button">
        <p className="css-button-text">LOG IN</p>
        <div className="css-button-inner">
          <div className="reset-skew">
            <clapperboard-div className="css-button-inner-text"></clapperboard-div>
          </div>
        </div>
      </button>
    </form>
  );
}
export default LoginFunctionality;
