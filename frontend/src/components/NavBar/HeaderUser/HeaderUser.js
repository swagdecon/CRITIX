import { React, useMemo, useState } from "react";
import userStyle from "./HeaderUser.module.css"
import Logout from "../../../security/Logout";
import { useNavigate, Link } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import jwt_decode from "jwt-decode";
import CookieManager from "../../../security/CookieManager";
import PropTypes from "prop-types";

const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE
const HeaderUser = ({ avatar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <button className={userStyle.logout} aria-haspopup="true" onClick={handleClick}>
          <div className={userStyle.image}>
            <img src={avatar ? avatar : DEFAULT_ACTOR_IMAGE} alt="user-profile-image" />
          </div>
        </button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            mt: "1px",
            "& .MuiMenu-paper": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
            },
            "& .MuiMenuItem-root": {
              transition: "color 0.3s",
              color: "white",
              "&:hover": {
                color: "#0096ff",
              },
            },
          }}
        > <MenuItem onClick={handleClose}><Link to="/profile">
          Profile
        </Link></MenuItem>
          <MenuItem onClick={handleClose}>  <Link to="/settings">
            Settings
          </Link>
          </MenuItem>
          <MenuItem onClick={handleSubmit}>
            Logout
          </MenuItem>
        </Menu>
      </div >
    </div >
  );
};

export default HeaderUser;
HeaderUser.propTypes = {
  avatar: PropTypes.string,
};
