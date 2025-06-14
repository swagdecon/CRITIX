import React, { useState, useMemo, useCallback } from "react";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import parse from 'html-react-parser';
import IndUserReview from "./IndUserReview";

export default function ReviewSection({ reviews }) {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 2;

    // Template subscription reviews
    const templateReviews = [
        {
            avatar: "/pro_avatar.png",
            author: "Critix Pro Reviewer",
            movieTitle: "Inception",
            createdDate: new Date().toISOString(),
            content: "Mind-bending, visually stunning, and thought-provoking. A must-watch for sci-fi lovers.",
            rating: 90,
            tier: "CritixPro",
            tags: ["mind-blowing", "visual feast", "smart"]
        },
        {
            avatar: "/ultimate_avatar.png",
            author: "Critix Ultimate",
            movieTitle: "The Godfather",
            createdDate: new Date().toISOString(),
            containsSpoiler: true,
            content: "A cinematic masterpiece. Every frame and line is iconic. Timeless and powerful.",
            rating: 98,
            tier: "CritixUltimate",
            tags: ["masterpiece", "gripping", "iconic"]
        }
    ];

    // Combine template with actual reviews
    const allReviews = [...templateReviews, ...reviews];
    const totalPages = Math.ceil(allReviews.length / commentsPerPage);

    const handlePageChange = useCallback((event, page) => setCurrentPage(page), []);

    const displayReviews = useMemo(() => {
        const startIdx = (currentPage - 1) * commentsPerPage;
        const endIdx = startIdx + commentsPerPage;
        return allReviews.slice(startIdx, endIdx);
    }, [currentPage, allReviews]);
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
                    tier={review.tier}
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
