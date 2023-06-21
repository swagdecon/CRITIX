import { React, useState, useRef, useEffect } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField'
import Filter from "bad-words";
import Button from "@mui/material/Button"
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import PropTypes from "prop-types";
import PercentageRatingCircle from "./Rating/PercentageCircle/PercentageCircle";
import InputSlider from "./Rating/Slider/Slider.js";
import OtherReviews from "./Rating/ReviewList/OtherReviews";
import useFetchData from "../../security/FetchApiData";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
UserMovieReviews.propTypes = {
    voteAverage: PropTypes.number,
    movieId: PropTypes.number,
    placement: PropTypes.string
}
export default function UserMovieReviews({ voteAverage, movieId, placement }) {
    const { data: userReviews, dataLoaded } = useFetchData(`http://localhost:8080/review/${movieId}`);
    if (placement === "userRatingSection") {
        const percentageAverage = voteAverage.toFixed(1) * 10
        const [review, setReview] = useState("");
        const filter = new Filter();
        const hasReviewProfanity = filter.isProfane(review);
        return (
            <div className={IndReview["ind-review-wrapper"]}>
                <div className={IndReview["input-wrapper"]}>
                    <div className={IndReview["total-rating-wrapper"]}>
                        <PercentageRatingCircle percentageRating={percentageAverage} />
                    </div>
                    <div className={IndReview["user-review-wrapper"]}>
                        <div className={IndReview["user-info-wrapper"]}>
                        </div>
                        <div className={IndReview["textField-wrapper"]}>
                            <div className={IndReview["input-slider"]}>
                                <InputSlider />
                            </div>
                            <TextField
                                size="small"
                                id="outlined-multiline-flexible"
                                label={hasReviewProfanity && review.trim().length > 0 ? "Profanity is not allowed." : "Post A Review"}
                                multiline
                                onChange={(e) => setReview(e.target.value)}
                                maxRows={4}
                                className={IndReview["mui-input-field"]}
                                InputLabelProps={{
                                    style: {
                                        color: 'white',
                                    },
                                }}
                                inputProps={{
                                    sx: {
                                        color: 'white',
                                    },
                                }}
                                error={hasReviewProfanity && review.trim().length > 0}
                                sx={{
                                    borderRadius: "15px",
                                    fieldSet: {
                                        borderRadius: "15px",
                                    },
                                    input: {
                                        color: "white !important",
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: hasReviewProfanity && review.trim().length > 0 ? '#ff0000' : '#0096ff',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: hasReviewProfanity && review.trim().length > 0 ? '#ff0000' : '#0096ff',
                                        },
                                    },
                                    width: "60%",
                                }}
                            />
                            <div className={IndReview["post-review-btn"]}>
                                <Button
                                    variant="contained"
                                    endIcon={<MovieCreationOutlinedIcon />}
                                    size="medium"
                                    sx={{
                                        borderRadius: "15px",
                                    }}
                                >
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {dataLoaded && <OtherReviews reviews={userReviews} />}
            </div >
        );
    } else if (placement === "header") {
        const [maxHeight, setMaxHeight] = useState(500);
        const reviewRef = useRef(null);
        useEffect(() => {
            if (reviewRef.current) {
                const reviewHeight = reviewRef.current.offsetHeight;
                setMaxHeight(reviewHeight);
            }
        });
        const TEXT_COLLAPSE_OPTIONS = {
            collapse: false,
            collapseText: "... show more",
            expandText: "show less",
            minHeight: 210,
            maxHeight: 500,
            textStyle: {
                color: "white",
                fontSize: "20px",
            },
        };
        return (
            <div className={IndMovieStyle.review__wrapper}>
                {Object.keys(userReviews).slice(0, 2).map((key, index) => (
                    <ReactTextCollapse
                        key={index}
                        options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
                    >
                        <p className={IndMovieStyle.review__description}>{userReviews[key].content}</p>
                        <br />
                    </ReactTextCollapse>
                ))}
            </div>
        );
    }
}