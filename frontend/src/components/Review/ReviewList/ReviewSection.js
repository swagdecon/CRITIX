import React, { useState, useMemo, useCallback } from "react";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import parse from 'html-react-parser';
import IndUserReview from "./IndUserReview";

export default function ReviewSection({ reviews }) {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 2;

    // Combine template with actual reviews
    const totalPages = Math.ceil(reviews.length / commentsPerPage);

    const handlePageChange = useCallback((event, page) => setCurrentPage(page), []);

    const displayReviews = useMemo(() => {
        const startIdx = (currentPage - 1) * commentsPerPage;
        const endIdx = startIdx + commentsPerPage;
        return reviews.slice(startIdx, endIdx);
    }, [currentPage, reviews]);
    console.log(reviews)
    return (
        <>
            {displayReviews.map((review, index) => (
                <IndUserReview
                    key={`${review.author}-${index}`}
                    placement={"indMovie"}
                    avatar={review.avatar}
                    author={review.author}
                    movieTitle={review.movieTitle}
                    createdDate={review.createdDate}
                    content={parse(review.content)}
                    containsSpoiler={review.containsSpoiler}
                    rating={review.rating}
                    isUltimateUser={review.isUltimateUser}
                    tags={review.tags}
                />
            ))}
            {totalPages > 1 && (
                <Pagination
                    size="large"
                    color="primary"
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "#ffffff",
                        },
                        marginTop: "24px",
                        display: "flex",
                        justifyContent: "center"
                    }}
                />
            )}
        </>
    );
}

ReviewSection.propTypes = {
    reviews: PropTypes.array.isRequired,
};
