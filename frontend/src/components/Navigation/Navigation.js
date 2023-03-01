import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <div id="navigation" className="Navigation">
      <nav>
        <ul>
          <Link className="nav-link" to="/homepage">HOME</Link>
          <Link className="nav-link" to="#">IN THEATRES</Link>
          <Link className="nav-link" to="#">UPCOMING</Link>
          <Link className="nav-link" to="#">MOST POPULAR</Link>
          <Link className="nav-link" to="#">WATCHLIST</Link>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
