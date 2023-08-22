import React from "react";
import "./PercentageCircle.css";
import PropTypes from "prop-types";
import Popcorn from "../../../Other/btn/MovieButton/popcornLogo";

const getColorClassName = (percentageRating) => {
    if (percentageRating >= 60) return "blue";
    if (percentageRating >= 30) return "yellow";
    return "red";
};

export default function PercentageRatingCircle({ percentageRating }) {
    const colorClassName = getColorClassName(percentageRating);
    const showNoRating = percentageRating < 0;

    return (
        <div className="flex-wrapper">
            <div className="single-chart">
                <div className="popcorn-wrapper">
                    <Popcorn propsCss="rating" />
                </div>
                <svg viewBox="0 0 36 36" className={`circular-chart ${colorClassName}`}>
                    <path
                        className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="circle"
                        strokeDasharray={`${percentageRating}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="26.35" className={showNoRating ? "error-percentage" : "percentage"}>
                        {showNoRating ? "No Rating" : `${percentageRating}%`}
                    </text>
                </svg>
            </div>
        </div>
    );
}

PercentageRatingCircle.propTypes = {
    percentageRating: PropTypes.number,
};
