import React from "react";
import PropTypes from "prop-types";
import "./GlassCard.css";
import { ParseNumber } from "./MovieComponents";
export default function GlassCard({ name, value, icon, iconString }) {
  GlassCard.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    value: PropTypes.number || PropTypes.string || PropTypes.array,
    iconString: PropTypes.string,
  };
  let data;
  !value ? (value = "N/A") : value;
  if (iconString === "&#xef63;") {
    // Budget
    data = `$ ` + ParseNumber(value);
  } else if (iconString === "&#xe8b5;") {
    // Minutes
    data = ` ${value} minutes`;
  } else if (iconString === "&#xf041;") {
    // Revenue
    data = `$ ` + ParseNumber(value);
  } else if (iconString === "&#xe175;") {
    // Vote Count
    data = ParseNumber(value);
  } else if (iconString === "&#xe8e2;") {
    // Language
    data = ` ${value} `;
  } else if (iconString === "&#xe04b;") {
    // Production Companies - Gets the first one
    data = ` ${value[0]} `;
  } else if (iconString === "&#xf7f3;") {
    // Movie Status
    data = ` ${value} `;
  } else if (iconString === "&#xebcc;") {
    // Release Date
    data = ` ${value} `;
  }

  return (
    <div className="container">
      <div className="box">
        <div className="content">
          <span className="title">{name}</span>
          <div className="icon-container">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div className="value-container">
            <p>{data}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
