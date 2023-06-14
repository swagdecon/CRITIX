import React from "react"
import "./PercentageCircle.css"
import PropTypes from "prop-types"
import Popcorn from "../../../Other/btn/MovieButton/popcornLogo"
export default function PercentageRatingCircle({ percentageRating }) {
    PercentageRatingCircle.propTypes = {
        percentageRating: PropTypes.number
    }
    if (percentageRating > 0 && percentageRating <= 30) {
        return (
            <div className="flex-wrapper">
                <div className="single-chart">


                    <svg viewBox="0 0 36 36" className="circular-chart red">
                        <path className="circle-bg"
                            d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className="circle"
                            strokeDasharray={`${percentageRating}, 100`}
                            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="26.35" className="percentage">{percentageRating}%</text>
                    </svg>
                    <div className="popcorn-wrapper">
                        <Popcorn propsCss="rating" />
                    </div>
                </div >
            </div >
        )
    } else if (percentageRating > 30 && percentageRating < 60) {

        return (
            <div className="flex-wrapper">

                <div className="single-chart">
                    <svg viewBox="0 0 36 36" className="circular-chart yellow">
                        <path className="circle-bg"
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"z
                        />
                        <path className="circle"
                            strokeDasharray={`${percentageRating}, 100`}
                            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="26.35" className="percentage">{percentageRating}%</text>
                    </svg>
                    <div className="popcorn-wrapper">
                        <Popcorn propsCss="rating" />
                    </div>
                </div >
            </div>
        )
    } else if (percentageRating >= 60 && percentageRating <= 100) {
        return (
            <div className="flex-wrapper">

                <div className="single-chart" >

                    <svg viewBox="0 0 36 36" className="circular-chart blue">
                        <path className="circle-bg"
                            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                        />

                        <path className="circle"
                            strokeDasharray={`${percentageRating}, 100`}
                            d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                        />

                        <text x="18" y="26.35" className="percentage">{percentageRating}%</text>
                    </svg >
                    <div className="popcorn-wrapper">
                        <Popcorn propsCss="rating" />
                    </div>
                </div >
            </div>
        )
    }
    else {
        return
    }
}