import React from "react"
import PercentageCircle from "./PercentageCircle.module.css"
import PropTypes from "prop-types"
export default function PercentageRatingCircle({ percentageRating }) {
    PercentageRatingCircle.propTypes = {
        percentageRating: PropTypes.number
    }
    if (percentageRating > 0 && percentageRating <= 30) {
        return (
            <div className={PercentageCircle["flex-wrapper"]}>
                <div className={PercentageCircle["single-chart"]}>
                    <svg viewBox="0 0 36 36" className={PercentageCircle["circular-chart orange"]}>
                        <path className={PercentageCircle["circle-bg"]}
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className={PercentageCircle.circle}
                            strokeDasharray={`${percentageRating}, 100`}
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className={PercentageCircle.percentage}>{percentageRating}%</text>
                    </svg>
                </div>
            </div>
        )
    } else if (percentageRating > 30 && percentageRating < 60) {
        console.log("this is less than 60")

        return (
            <div className={PercentageCircle["single-chart"]}>
                <svg viewBox="0 0 36 36" className={PercentageCircle["circular-chart green"]}>
                    <path className={PercentageCircle["circle-bg"]}
                        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className={PercentageCircle["circle"]}
                        strokeDasharray={`${percentageRating}, 100`}
                        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className={PercentageCircle.percentage}>60%</text>
                </svg>
            </div>
        )
    } else if (percentageRating >= 60 && percentageRating <= 100) {
        return (
            < div className={PercentageCircle["single-chart"]} >
                <svg viewBox="0 0 36 36" className={PercentageCircle["circular-chart blue"]}>
                    <path className={PercentageCircle["circle-bg"]}
                        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className={PercentageCircle["circle"]}
                        strokeDasharray={`${percentageRating}, 100`}
                        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className={PercentageCircle.percentage}>90%</text>
                </svg>
            </div >
        )
    }
    else {
        return
    }
}