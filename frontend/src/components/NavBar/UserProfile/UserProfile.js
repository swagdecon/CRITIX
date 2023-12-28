import { React, useMemo } from "react";
import userStyle from "./UserProfile.module.css"
import Logout from "../../../security/Logout";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import CookieManager from "../../../security/CookieManager";
const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE
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
    <div className={userStyle.UserProfile}>
      <div className={userStyle.User}>
        < div className={userStyle.name}> {firstName}</div >
        <button className={userStyle.logout} onClick={handleSubmit}>
          <div className={userStyle.image}>
            <img src={DEFAULT_ACTOR_IMAGE} alt="user-profile-image" />
          </div>
        </button>
      </div >
    </div >
  );
};

export default UserProfile;
