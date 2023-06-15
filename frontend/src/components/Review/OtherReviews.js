import React from "react"
import "./OtherReviews.css"
export default function OtherReviews() {
    return (
        <div className="comment-section">
            <div className="container">
                <div className="review">
                    <div className="comment-section">
                        <div className="media media-review">
                            <div className="media-user"><img src="https://i.imgur.com/nUNhspp.jpg" alt="" /></div>
                            <div className="media-body">
                                <div className="M-flex">
                                    <h2 className="title"><span> Robert Bye </span>DD-MM-YYYY</h2>
                                    <div className="rating-row">
                                        <ul>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                            <li className=""><i className="fa fa-star-o"></i></li>
                                        </ul>
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