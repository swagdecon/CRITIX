import React, { useState, useMemo } from "react";
import Logo from "../Logo/Logo";
import Navigation from "./Navigation/Navigation";
import NavBarStyle from "./NavBar.module.css"
import Search from "./Search/Search";
import HeaderUser from "./HeaderUser/HeaderUser";
import PropTypes from "prop-types";
import { fetchData } from '../../security/Data';
import isTokenExpired from "../../security/IsTokenExpired.js";
import MobileSearchBar from "./Search/MobileSearch.js";
import PremiumBtn from "./Ultimate/UltimateBtn.js";
import { jwtDecode } from "jwt-decode";
import CookieManager from "../../security/CookieManager.js";
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function NavBar(props) {
  const [avatar, setAvatar] = useState(null)
  const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
  const decodedToken = useMemo(() => jwtDecode(token), [token]);
  const isUltimateUser = decodedToken.isUltimateUser

  useMemo(() => {
    async function fetchBackendData() {
      try {
        await isTokenExpired();
        const [avatarPic] = await Promise.all([
          fetchData(`${API_URL}${getAvatarEndpoint}`),

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
        <div className={NavBarStyle.left}>
          <Logo placement="navbar" />
          <Navigation />
          {!isUltimateUser ? <PremiumBtn /> : null}
        </div>
        <div className={NavBarStyle.MobileSearchBar}>
          <MobileSearchBar onSubmit={props.onSubmit} />
        </div>
        <div className={NavBarStyle.SearchBar}>
          <Search onSubmit={props.onSubmit} />
        </div>
        <div className={NavBarStyle.right}>
          <HeaderUser avatar={avatar} />
        </div>
      </div>
    </div >
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

