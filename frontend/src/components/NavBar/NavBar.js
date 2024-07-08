import React from "react";
import Logo from "../Logo/Logo";
import Navigation from "./Navigation/Navigation";
import NavBarStyle from "./NavBar.module.css"
import Search from "./Search/Search";
import HeaderUser from "./HeaderUser/HeaderUser";
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react"
import { fetchData } from '../../security/Data';
import jwt_decode from "jwt-decode";
import isTokenExpired from "../../security/IsTokenExpired.js";
import CookieManager from "../../security/CookieManager.js";

const getAvatarEndpoint = process.env.REACT_APP_GET_USER_INFO

export default function NavBar(props) {
  const [avatar, setAvatar] = useState(null)
  const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
  const decodedToken = useMemo(() => jwt_decode(token), [token]);
  const userId = decodedToken.userId
  useEffect(() => {
    async function fetchBackendData() {
      try {
        await isTokenExpired();
        const [avatarPic] = await Promise.all([
          fetchData(`${getAvatarEndpoint}${userId}`),

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

