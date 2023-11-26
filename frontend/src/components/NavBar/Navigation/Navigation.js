import React from "react";
import { Link } from "react-router-dom";
import NavStyle from "./Navigation.module.css";

export default function Navigation() {
  return (
    <div className={NavStyle.Navigation}>
      <ul>
        <Link className={NavStyle["nav-link"]} to="/now_playing">
          IN THEATRES
        </Link>
        <Link className={NavStyle["nav-link"]} to="/upcoming">
          UPCOMING
        </Link>
        <Link className={NavStyle["nav-link"]} to="/popular">
          MOST POPULAR
        </Link>
        <Link className={NavStyle["nav-link"]} to="#">
          WATCHLIST
        </Link>
      </ul>
    </div>
  );
}

