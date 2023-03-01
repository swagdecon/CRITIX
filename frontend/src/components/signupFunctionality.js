import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../misc/login.css";
import Popcorn from "../misc/popcorn_logo";
function SignupFunctionality() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = { firstname, lastname, email, password };

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
      }
    } catch (error) {
      navigate("/error", { replace: true });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          className="text-input"
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
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
          className="text-input"
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
          className="text-input"
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
      <button type="submit" onSubmit={handleSubmit} className="css-button">
        <p className="css-button-text">SIGN UP</p>
        <div className="css-button-inner">
          <div className="reset-skew">
            <Popcorn className="css-button-inner-text"></Popcorn>
          </div>
        </div>
      </button>
    </form>
  );
}
export default SignupFunctionality;
