import React, { useState } from "react";
import "../misc/login.css";
import "../misc/logo.scss";
import Logo from "./logo.js";
import Logo_Text from "../misc/POPFLIX_LOGO_OFFICIAL.png";
import Popcorn from "../misc/popcorn_logo";
import { useNavigate } from "react-router-dom";
import SignUpPlayer from "./SignUpVideo.js";
function SignUp(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
          }),
        }
      );
      if (response.ok) {
        navigate("/login", { replace: true });
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(userData);
    }
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
        />

        <title>Sign Up</title>
      </head>
      <body>
        <div id="wrapper">
          <div id="left">
            <div id="signin">
              <Logo />
              <img src={Logo_Text} className="homepage-logo" alt="logo" />

              <div className={props.error ? "alert alert-danger" : "hidden"}>
                {props.error}
              </div>
              <div className={props.logout ? "alert alert-success" : "hidden"}>
                Successfully logged out
              </div>

              <form onSubmit={handleSubmit}>
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
                <button
                  type="submit"
                  onSubmit={handleSubmit}
                  className="css-button"
                >
                  <p className="css-button-text">SIGN UP</p>
                  <div className="css-button-inner">
                    <div className="reset-skew">
                      <Popcorn className="css-button-inner-text"></Popcorn>
                    </div>
                  </div>
                </button>
              </form>
              {/* REDIRECT TO LOG IN PAGE */}
              <div className="or">
                <hr className="bar" />
                <span>OR</span>
                <hr className="bar" />
              </div>
              <a href="/login" className="secondary-btn">
                LOG IN
              </a>
            </div>
            <footer id="main-footer">
              <p>Copyright &copy; 2022, All Rights Reserved By POPFLIX</p>
              <div>
                <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
              </div>
            </footer>
          </div>
          <div id="right">
            <div id="showcase">
              <div className="showcase-content">
                <div className="overlay">
                  <SignUpPlayer></SignUpPlayer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
export default SignUp;
