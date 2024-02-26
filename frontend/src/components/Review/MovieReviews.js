import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import Filter from "bad-words";
import axios from "axios";
import jwt_decode from "jwt-decode";
import IndReview from "./Review.module.css";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import ReviewSection from "./ReviewList/ReviewSection";
import PercentageRatingCircle from "./Rating/PercentageCircle/PercentageCircle";
import InputSlider from "./Rating/Slider/Slider.js";
import CookieManager from "../../security/CookieManager";
import ReCAPTCHA from "react-google-recaptcha";
import { format } from 'date-fns';
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const RECAPTCHA_ENDPOINT = process.env.REACT_APP_RECAPTCHA_ENDPOINT;
const CREATE_MOVIE_ENDPOINT = process.env.REACT_APP_CREATE_MOVIE_ENDPOINT;

const TEXT_COLLAPSE_OPTIONS = {
    collapse: false,
    collapseText: <span style={{ cursor: "pointer" }}>...show more</span>,
    expandText: <span style={{ cursor: "pointer" }}>show less</span>,
    minHeight: 60,
    maxHeight: 500,
    textStyle: {
        color: "grey",
        fontSize: "20px"
    }
};

const MovieReviews = ({ voteAverage, reviews, movieId, placement }) => {

    let token = CookieManager.decryptCookie('accessToken');
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    const firstName = decodedToken.firstName;
    const filter = useMemo(() => new Filter(), []);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [disabledInput, setDisabledInputLogic] = useState(false);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const [recaptchaResult, setRecaptchaResult] = useState(false)
    const [maxHeight, setMaxHeight] = useState(500);
    const hasReviewProfanity = useMemo(() => filter.isProfane(reviewContent), [filter, reviewContent]);
    const isRecaptchaVisible = useMemo(() => reviewContent.trim().length != 0 && reviewRating != 0 && !hasReviewProfanity[reviewContent, reviewRating, hasReviewProfanity]);
    const wordCount = reviewContent.trim().split(/\s+/).length;

    const isSubmitDisabled = useMemo(
        () =>
            reviewContent.trim().length === 0 ||
            reviewRating === 0 ||
            wordCount < 15 ||
            !recaptchaResult,
        [reviewContent, reviewRating, recaptchaResult]
    );
    const reviewRef = useRef(null);
    const reviewInputStyles = {
        borderRadius: "15px",
        fieldSet: {
            borderRadius: "15px"
        },
        input: {
            color: "white !important"
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: hasReviewProfanity ? "red" : "white",
            },
            "&:hover fieldset": {
                borderColor: hasReviewProfanity ? "red" : "#0096ff",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#0096ff",
            },
            "&.Mui-error fieldset": {
                borderColor: "red",
            },
        },
        "& ::-webkit-scrollbar": {
            width: "12px",
            backgroundColor: "rgb(73, 73, 73)",
            borderRadius: "10px",
        },
        "& ::-webkit-scrollbar-track": {
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: "10px",
        },
        "& ::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.3)",
            backgroundColor: "#0096ff",
        },
        width: "60%",
        '@media (max-width: 500px)': {
            width: '100%',
        }

    };
    async function onChange(token) {
        try {
            await axios.post(RECAPTCHA_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                recaptchaValue: token
            }).then(res =>
                setRecaptchaResult(res.data.success))
        } catch (e) {
            console.error(e)
        }
    }


    const handleSubmit = useCallback(() => {
        if (!hasReviewProfanity) {
            const currentDate = new Date();
            const formattedDate = format(currentDate, 'dd-MM-yyyy');

            axios
                .post(`${CREATE_MOVIE_ENDPOINT}${movieId}`, {
                    createdDate: formattedDate,
                    movieId: movieId,
                    userId: userId,
                    author: firstName,
                    rating: reviewRating,
                    content: reviewContent,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setReviewRating(0);
                    setReviewContent("");
                    setHasSubmittedReview(true);
                    setDisabledInputLogic(true);
                })
                .catch((error) => {
                    if (error.response.status === 400 && error.response.data === "User already submitted a review for this movie.") {
                        setHasSubmittedReview(true);
                    }
                });
        }
    }, [movieId, decodedToken, reviewRating, reviewContent, token, hasReviewProfanity]);

    useEffect(() => {
        if (reviewRef.current) {
            const reviewHeight = reviewRef.current.offsetHeight;
            setMaxHeight(reviewHeight);
        }
    }, []);

    const renderUserRatingSection = () => {
        return (
            <div className={IndReview["ind-review-wrapper"]}>
                <div className={IndReview["input-wrapper"]}>
                    <div className={IndReview["user-review-wrapper"]}>
                        <div className={IndReview["user-info-wrapper"]} />
                        <div className={IndReview["textField-wrapper"]}>
                            <InputSlider onSliderChange={setReviewRating} />
                            <TextField
                                size="small"
                                id="outlined-multiline-flexible"
                                label={
                                    hasReviewProfanity && reviewContent.trim().length > 0
                                        ? "Profanity is not allowed."
                                        : hasSubmittedReview
                                            ? "Thanks for submitting a review!  "
                                            : "Post A Review (Min. 15 words)"
                                }
                                multiline
                                onChange={(e) => setReviewContent(e.target.value)}
                                maxRows={4}
                                value={reviewContent}
                                className={IndReview["mui-input-field"]}
                                InputLabelProps={{
                                    style: {
                                        color: "white"
                                    }
                                }}
                                inputProps={{
                                    disabled: disabledInput,
                                    sx: {
                                        color: "white"
                                    }
                                }}
                                error={hasReviewProfanity && reviewContent.trim().length > 0}
                                sx={reviewInputStyles}
                            />

                            {!hasSubmittedReview && !hasReviewProfanity && (
                                <div>
                                    {isRecaptchaVisible && (
                                        <div className={IndReview["recaptcha-btn"]}>
                                            <ReCAPTCHA
                                                sitekey={RECAPTCHA_KEY}
                                                onChange={onChange}
                                            />
                                        </div>
                                    )}
                                    <div className={IndReview["post-review-btn"]}>
                                        <Button
                                            variant="contained"
                                            endIcon={<MovieCreationOutlinedIcon />}
                                            size="medium"
                                            onClick={handleSubmit}
                                            disabled={isSubmitDisabled}
                                        >
                                            SUBMIT
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={IndReview["total-rating-wrapper"]}>
                            <PercentageRatingCircle percentageRating={voteAverage} />
                        </div>
                    </div>
                    {reviews && reviews.length >= 2 && (
                        <ReviewSection reviews={reviews} movieId={movieId} userId={userId} />
                    )}
                </div>
            </div>
        );

    };

    const renderHeaderSection = () => {
        if (reviews.length > 0) {
            return (
                <div className={IndMovieStyle.review__wrapper} ref={reviewRef}>
                    <h3 className={IndMovieStyle.ind_review_title}>Reviews</h3>
                    {
                        Object.keys(reviews)
                            .slice(0, 2)
                            .map((key, index) => (
                                <div className={IndMovieStyle.header__review__wrapper} key={key}>
                                    <ReactTextCollapse
                                        key={index}
                                        options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
                                    >
                                        <p className={IndMovieStyle.review__description}>
                                            {reviews[key].content}
                                        </p>
                                    </ReactTextCollapse>
                                </div>
                            ))}
                </div>
            );
        }
    };

    return (
        <>
            {placement === "userRatingSection" && renderUserRatingSection()}
            {placement === "header" && renderHeaderSection()}
        </>
    );
};

MovieReviews.propTypes = {
    voteAverage: PropTypes.number,
    reviews: PropTypes.array,
    movieId: PropTypes.number,
    placement: PropTypes.string
};

export default MovieReviews;
