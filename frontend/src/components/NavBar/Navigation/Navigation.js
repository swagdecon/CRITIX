import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {

  return (
    <div className="Navigation">
      <nav>
        <ul>
          <Link className="nav-link" to="/home">
            HOME
          </Link>
          <Link className="nav-link" to="/now_playing">
            IN THEATRES
          </Link>
          <Link className="nav-link" to="/upcoming">
            UPCOMING
          </Link>
          <Link className="nav-link" to="/popular">
            MOST POPULAR
          </Link>
          <Link className="nav-link" to="#">
            WATCHLIST
          </Link>
        </ul>
      </nav>
    </div>
  );
}

