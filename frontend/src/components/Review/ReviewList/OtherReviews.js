import React, { useState, useMemo } from "react";
import "./OtherReviews.css";
import UserRating from "../Rating/UserRating/UserRating";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";

function ImageLogic(avatar) {
    if (avatar !== null && avatar !== "null") {
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
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 2;
    const totalPages = Math.ceil((reviews.length - 3) / commentsPerPage);

    const displayReviews = useMemo(() => {
        let reviewsToDisplay = [];
        if (currentPage === 1) {
            const totalWordCount = reviews
                .slice(3, 5)
                .reduce((count, review) => count + review.content.split(" ").length, 0);
            if (totalWordCount > 300) {
                reviewsToDisplay = reviews.slice(2, 4);
            } else {
                reviewsToDisplay = reviews.slice(3
                    , 5);
            }
        } else {
            const startIdx = (currentPage - 1) * commentsPerPage + 3;
            const endIdx = startIdx + commentsPerPage;
            const pageReviews = reviews.slice(startIdx, endIdx);
            const pageWordCount = pageReviews.reduce(
                (count, review) => count + review.content.split(" ").length,
                0
            );
            if (pageWordCount > 300) {
                reviewsToDisplay = pageReviews.slice(0, 1);
            } else {
                reviewsToDisplay = pageReviews;
            }
        }
        return reviewsToDisplay;
    }, [currentPage, reviews]);

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
                                            src={ImageLogic(review.avatar)}
                                            className="profile-picture"
                                            alt=""
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
                    {reviews && reviews.length > 0 && (
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

OtherReviews.propTypes = {
    reviews: PropTypes.array,
};
