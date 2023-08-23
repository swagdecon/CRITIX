import React from "react";
import "./clapperboard.css";
import PropTypes from "prop-types";
import BtnStyles from "./Button.module.css";
import Popcorn from "./popcornLogo";
export default function MovieButton(props) {
  {
    if (props.innerIcon === "popcorn") {
      return (
        <button type="submit" className={BtnStyles["css-button"]}>
          <p className={BtnStyles["css-button-text"]}>SIGN UP</p>
          <div className={BtnStyles["css-button-inner-popcorn"]}>
            <div className={BtnStyles["reset-skew"]}>
              <div className={BtnStyles["popcorn-wrapper"]} >
                <Popcorn />
              </div>

            </div>
          </div>
        </button>
      );
    } else if (props.innerIcon === "clapperboard") {
      return (
        <button type="submit" className={BtnStyles["css-button"]}>
          <p className={BtnStyles["css-button-text"]}>LOG IN</p>
          <div className={BtnStyles["css-button-inner-clapperboard"]}>
            <div className={BtnStyles["reset-skew"]}>
              <div className={BtnStyles["clapperboard-wrapper"]}>
                <clapperboard-div />
              </div>
            </div>
          </div>
        </button>
      );
    } else if (props.innerIcon === "trailer") {
      return (
        <button
          type="submit"
          onClick={props.onClick}
          className={BtnStyles["css-button"]}
        >
          <p className={BtnStyles["css-button-text"]}>WATCH TRAILER</p>
          <div className={BtnStyles["css-button-inner-popcorn"]}>
            <div className={BtnStyles["reset-skew"]}>
              <div className={BtnStyles["popcorn-wrapper"]} >
                <Popcorn />
              </div>
            </div>
          </div>
        </button>
      );
    }
  }
}
MovieButton.propTypes = {
  innerIcon: PropTypes.string,
  onClick: PropTypes.func,
};
