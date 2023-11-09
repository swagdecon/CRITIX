import { React } from "react";
import Logo from "../../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import Search from "../Search/Search";
import UserProfile from "../UserProfile/UserProfile";
import HeaderStyle from "./Header.module.css";
import PropTypes from "prop-types";
export default function Header(props) {
  return (
    <header className={HeaderStyle.Header}>
      <Logo />
      <Navigation />
      <Search onSubmit={props.onSubmit} />
      <UserProfile />
    </header>
  );
}
Header.propTypes = {
  onSubmit: PropTypes.func,
};
