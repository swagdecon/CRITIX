import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import Search from "../Search/Search";
import UserProfile from "../UserProfile/UserProfile";
import "./Header.css"

const Header = (props) => {
    return (
        <header className="Header">
            <Logo />
            <Navigation />
            <Search onSubmit={props.onSubmit} />
            <UserProfile />
        </header>
    );
}

export default Header;