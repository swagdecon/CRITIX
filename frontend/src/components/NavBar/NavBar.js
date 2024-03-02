import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "./Navigation/Navigation";
import NavBarStyle from "./NavBar.module.css"
import Search from "./Search/Search";
import HeaderUser from "./HeaderUser/HeaderUser";
import PropTypes from "prop-types";
export default function NavBar(props) {
  return (
    <div className={NavBarStyle.NavBar}>
      <div className={NavBarStyle.group__1}>
        <div className={NavBarStyle.logo}>
          <Logo />
        </div>
        <Navigation />
        <Search onSubmit={props.onSubmit} />
      </div>
      <HeaderUser />
    </div >
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

