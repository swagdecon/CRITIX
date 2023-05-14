import React from "react";
import "./UserProfile.css";
import Cookies from "js-cookie";
import isExpired from "../../../security/IsTokenExpired";
import { useNavigate } from "react-router-dom";
import CookieManager from "../../../security/CookieManager";
const UserProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    async function logout() {
      try {
        let token = CookieManager.decryptCookie("accessToken");

        await fetch("http://localhost:8080/v1/auth/logout", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/login");
      } catch (error) {
        // Token expired, get a new token and retry the request
        await isExpired();
        try {
          let newAccessToken = Cookies.get("accessToken");
          await fetch("http://localhost:8080/v1/auth/logout", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Call the logout function when the user clicks the button
    logout();
  };

  return (
    <div className="UserProfile">
      <div className="User">
        <div className="name">Jack Oliver</div>
        <button className="logout" onClick={handleSubmit}>
          <div className="image">
            <img src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
          </div>
        </button>
      </div>
      <div className="UserProfile-menu">
        <div className="UserProfileSwitch">
          <ul>
            <li>
              <div className="UserProfile-image" />
              <div className="UserProfile-name">Alexander</div>
            </li>
          </ul>
        </div>
        <div className="UserNavigation">
          <ul>
            <li>Your Account</li>
            <li>Help Center</li>
            <li>Sign out of Netflix</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
