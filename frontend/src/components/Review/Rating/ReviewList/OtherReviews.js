import React from "react"
import "./OtherReviews.css"
import UserRating from "../UserRating/UserRating"
export default function OtherReviews() {
    return (
        <div className="comment-section">
            <div className="container">
                <div className="review">
                    {/* <h2 className="R-title">Reviews</h2> */}
                    <div className="comment-section">

                        <div className="media media-review">

                            <div className="media-user"><img src="https://i.imgur.com/nUNhspp.jpg" alt="" /> </div>
                            <div className="media-body">
                                <div className="M-flex">
                                    <h4 className="title"><span> Robert Bye </span>Date Month</h4>
                                    <div className="rating-row">
                                        <UserRating percentage="89" />
                                        {/* <ul>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                        </ul> */}
                                    </div>
                                </div>
                                <div className="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div>
                            </div>
                        </div>
                        <div className="media media-review">
                            <div className="media-user"><img src="https://i.imgur.com/nUNhspp.jpg" alt="" /></div>
                            <div className="media-body">
                                <div className="M-flex">
                                    <h2 className="title"><span> Robert Bye </span>Date Month</h2>
                                    <div className="rating-row">
                                        <UserRating percentage="50" />

                                        {/* <ul>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                        </ul> */}
                                    </div>
                                </div>
                                <div className="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div>

                            </div>
                        </div>
                        <div className="media media-review">
                            <div className="media-user"><img src="https://i.imgur.com/nUNhspp.jpg" alt="" /></div>
                            <div className="media-body">
                                <div className="M-flex">
                                    <h2 className="title"><span> Robert Bye </span>Date Month</h2>
                                    <div className="rating-row">
                                        <UserRating percentage="30" />

                                        {/* <ul>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                        </ul> */}
                                    </div>
                                </div>
                                <div className="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}