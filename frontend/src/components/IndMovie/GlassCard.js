import React from "react";
import PropTypes from "prop-types";
import "./GlassCard.css";

export default function GlassCard({ name, value, icon, iconString }) {
  GlassCard.propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    value: PropTypes.number || PropTypes.string,
    iconString: PropTypes.string,
  };
  let data;
  if (iconString === "&#xef63;") {
    // Budget
    data = `$ ${value}`;
  } else if (iconString === "&#xe8b5;") {
    // Minutes
    data = ` ${value} minutes`;
  } else if (iconString === "&#xf041;") {
    // Minutes
    data = `$ ${value} `;
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
