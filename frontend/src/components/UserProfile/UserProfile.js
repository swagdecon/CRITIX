import React from "react";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = JSON.parse(localStorage.getItem("refreshToken"));

    try {
      const response = await fetch("http://localhost:8080/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      navigate("/403");
    }
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
