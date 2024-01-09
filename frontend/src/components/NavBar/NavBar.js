import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "./Navigation/Navigation";
import NavBarStyle from "./NavBar.module.css"
import Search from "./Search/Search";
import UserProfile from "./UserProfile/UserProfile";
import PropTypes from "prop-types";
export default function NavBar(props) {
  return (
    <div className={NavBarStyle.NavBar}>
      <div className={NavBarStyle.group__1}>
        <Logo />
        <Navigation />
      </div>
      <Search onSubmit={props.onSubmit} />
      <UserProfile />
    </div >
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

