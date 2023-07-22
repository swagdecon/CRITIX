import React, { useState, useMemo } from "react";
import "./OtherReviews.css";
import UserRating from "../Rating/UserRating/UserRating";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";

export default function ReviewSection({ reviews }) {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 2;
    const totalPages = Math.ceil(reviews.length / commentsPerPage);
    console.log(reviews);
    const displayReviews = useMemo(() => {
        let reviewsToDisplay = [];
        const startIdx = (currentPage - 1) * commentsPerPage;
        const endIdx = startIdx + commentsPerPage;
        reviewsToDisplay = reviews.slice(startIdx, endIdx);
        return reviewsToDisplay;
    }, [currentPage, reviews]);
    console.log(reviews.avatar)
    return (
        <div className="comment-section">
            <div className="container">
                <div className="review">
                    <div className="comment-section">
                        {displayReviews.map((review) => (
                            <div className="user-review" key={review.author}>
                                <div className="media media-review">
                                    <div className="media-user">
                                        <img
                                            src={review.avatar}
                                            className="profile-picture"
                                        />
                                    </div>
                                    <div className="media-body">
                                        <div className="M-flex">
                                            <h4 className="title">
                                                <span> {review.author} </span>
                                                {review.createdDate}
                                            </h4>

                                            <div className="rating-row">
                                                {review.rating ? (

                                                    <UserRating percentage={(review.reviewId == null ? review.rating * 10 : parseInt(review.rating))} />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="description">{review.content}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {reviews && reviews.length > 0 && totalPages > 0 && (
                        <Pagination
                            size="large"
                            color="primary"
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, page) => setCurrentPage(page)}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "#ffffff",
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

ReviewSection.propTypes = {
    reviews: PropTypes.array,
};
