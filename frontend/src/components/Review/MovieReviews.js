import { React, useState } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField'
import Filter from "bad-words";
import Button from "@mui/material/Button"
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import PropTypes from "prop-types";
import CookieManager from "../../security/CookieManager";
import jwt_decode from "jwt-decode";
import PercentageRatingCircle from "./Rating/PercentageCircle/PercentageCircle";
import InputSlider from "./Rating/Slider";
import OtherReviews from "./OtherReviews";
export default function UserMovieReviews({ voteAverage }) {
    UserMovieReviews.propTypes = {
        voteAverage: PropTypes.number,
    }
    const percentageAverage = voteAverage * 10
    const token = CookieManager.decryptCookie("accessToken");
    const firstName = jwt_decode(token).firstName;
    const [review, setReview] = useState("");
    const filter = new Filter();
    const hasReviewProfanity = filter.isProfane(review);
    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <div className={IndReview["input-wrapper"]}>
                <div className={IndReview["test-wrapper"]}>
                    <PercentageRatingCircle percentageRating={percentageAverage} />
                </div>
                <div className={IndReview["user-review-wrapper"]}>

                    <div className={IndReview["user-info-wrapper"]}>

                        <img className={IndReview["profile-img"]} src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
                        <div className={IndReview["name-wrapper"]}>
                            {firstName}
                        </div>
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
                                borderRadius: "30px",
                                fieldSet: {
                                    borderRadius: "30px",
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
                                    borderRadius: "30px",
                                }}
                            >
                                POST REVIEW
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={IndReview["section-line"]} /> */}
            <OtherReviews />
        </div>
    );
}

