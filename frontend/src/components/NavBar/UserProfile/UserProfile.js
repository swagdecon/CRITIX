import { React, useMemo } from "react";
import "./UserProfile.css";
import Logout from "../../../security/Logout";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import CookieManager from "../../../security/CookieManager";
const UserProfile = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await Logout(navigate);
  };
  const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
  const decodedToken = useMemo(() => jwt_decode(token), [token]);
  const firstName = decodedToken.firstName
  return (
    <div className="UserProfile">
      <div className="User">
        <div className="name">{firstName}</div>
        <button className="logout" onClick={handleSubmit}>
          <div className="image">
            <img src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
          </div>
        </button>
      </div>
      {/* <div className="UserProfile-menu">
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
            <li>Sign out of Popflix</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default UserProfile;
