import React from "react"
import "./OtherReviews.css"
import UserRating from "../UserRating/UserRating"

import PropTypes from "prop-types"

function ImageLogic(avatar) {

    if (avatar !== "null") {
        console.log(avatar)
        if (avatar.includes("secure.gravatar.com")) {
            return avatar;
        } else {
            return `https://image.tmdb.org/t/p/w200/${avatar}`;
        }
    } else {
        return "https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg";
    }
}

export default function OtherReviews({ reviews }) {

    return (
        <div className="comment-section">
            <div className="container">
                <div className="review">
                    {/* <h2 className="R-title">Reviews</h2> */}
                    <div className="comment-section">
                        {reviews.slice(3).map((review) => (

                            < div className="user-review" key={review.author} >

                                <div className="media media-review">
                                    <div className="media-user"><img src={ImageLogic(review.avatar)} className="profile-picture" alt="" /> </div>
                                    <div className="media-body">
                                        <div className="M-flex">
                                            <h4 className="title"><span> {review.author} </span>{review.createdDate}</h4>
                                            <div className="rating-row">
                                                {review.rating ?
                                                    <UserRating percentage={review.rating * 10} />
                                                    : null}
                                            </div>
                                        </div>
                                        <div className="description">{review.content} </div>
                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}
OtherReviews.propTypes = {
    reviews: PropTypes.obj
};