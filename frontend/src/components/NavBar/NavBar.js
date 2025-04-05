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
import MobileSearchBar from "./Search/MobileSearch.js";
import PremiumBtn from "./Premium/PremiumBtn.js";
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function NavBar(props) {
  const [avatar, setAvatar] = useState(null)

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
        <Logo />
        <Navigation />
        <div className={NavBarStyle.MobileSearchBar}>
          <MobileSearchBar onSubmit={props.onSubmit} />
        </div>
        <div className={NavBarStyle.SearchBar}>
          <Search onSubmit={props.onSubmit} />
        </div>
        <PremiumBtn />
      </div>
      <HeaderUser avatar={avatar} />
    </div >
  )
}
NavBar.propTypes = {
  onSubmit: PropTypes.func,
};

