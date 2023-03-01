import React from "react";
import "./UserProfile.css"

const UserProfile = () => {
  return (
    <div className="UserProfile">
      <div className="User">
        <div className="name">Jack Oliver</div>
        <div className="image">
          <img src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
        </div>
      </div>
      <div className="UserProfile-menu">
        <div className="UserProfileSwitch">
          <ul>
            <li>
              <div className="UserProfile-image">
                <img src="http://lorempixel.com/96/96" />
              </div>
              <div className="UserProfile-name">Alexander</div>
            </li>
            <li>
              <div className="UserProfile-image">
                <img src="http://lorempixel.com/96/96" />
              </div>
              <div className="UserProfile-name">Mattias</div>
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