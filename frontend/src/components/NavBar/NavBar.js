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
      <Logo />
      <div className={NavBarStyle.test}>
        <Navigation />
        <Search onSubmit={props.onSubmit} />
      </div>
      <UserProfile />
    </div>
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

