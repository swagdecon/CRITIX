import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "./Navigation/Navigation";
import NavBarStyle from "./NavBar.module.css"
import Search from "./Search/Search";
import HeaderUser from "./HeaderUser/HeaderUser";
import PropTypes from "prop-types";
import { useState, useMemo } from "react"
import { fetchData } from '../../security/Data';
import isTokenExpired from "../../security/IsTokenExpired.js";

const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR

export default function NavBar(props) {
  const [avatar, setAvatar] = useState(null)

  useMemo(() => {
    async function fetchBackendData() {
      try {
        await isTokenExpired();
        const [avatarPic] = await Promise.all([
          fetchData(getAvatarEndpoint),

        ]);
        setAvatar(avatarPic)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchBackendData();
  }, []);
  return (
    <div className={NavBarStyle.NavBar}>
      <div className={NavBarStyle.group__1}>
        <div className={NavBarStyle.logo}>
          <Logo />
        </div>
        <Navigation />
        <Search onSubmit={props.onSubmit} />
      </div>
      <HeaderUser avatar={avatar} />
    </div >
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

