import React from "react"
import "./OtherReviews.css"
import UserRating from "../UserRating/UserRating"

import PropTypes from "prop-types"
export default function OtherReviews({ reviews }) {
    OtherReviews.propTypes = {
        reviews: PropTypes.obj
    };
    return (
        <div className="comment-section">
            <div className="container">
                <div className="review">
                    {/* <h2 className="R-title">Reviews</h2> */}
                    <div className="comment-section">
                        {reviews.slice(3).map((review) => (

                            < div className="user-review" key={review.author} >

                                <div className="media media-review">
                                    <div className="media-user"><img src={review.avatar.slice(1)} alt="" /> </div>
                                    <div className="media-body">
                                        <div className="M-flex">
                                            <h4 className="title"><span> {review.author} </span>{review.createdDate}</h4>
                                            <div className="rating-row">
                                                <UserRating percentage={review.rating * 10 || null} />
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