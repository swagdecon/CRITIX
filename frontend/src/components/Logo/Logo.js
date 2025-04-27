import React from "react";
import CritixLogo from "./CRITIX_LOGO_OFFICIAL.webp";
import LogoStyle from "./logo.module.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"
export default function Logo({ placement }) {
  return (
    <>
      {placement === 'homepage' && (
        <img src={CritixLogo} className={LogoStyle.HomepageLogo} alt="logo" />
      )}
      {placement === 'login' && (
        <img src={CritixLogo} className={LogoStyle.LoginLogo} alt="logo" />
      )}
      {placement === 'navbar' && (
        <Link to='/home'>
          <img src={CritixLogo} className={LogoStyle.NavbarLogo} alt="logo" />
        </Link>
      )}
    </>
  );
}
Logo.propTypes = {
  placement: PropTypes.string
};
