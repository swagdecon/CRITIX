import { React, useState } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField'
import Filter from "bad-words";

export default function MovieComments() {

    const [review, setReview] = useState("");
    const filter = new Filter();

    const hasReviewProfanity = filter.isProfane(review);

    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <h2 className={IndReview["ind-review-section-title"]}>Audience Reviews & Ratings</h2>
            <TextField
                id="outlined-multiline-flexible"
                label={hasReviewProfanity && review.trim().length > 0 ? "Profanity is not allowed." : "Your Review"}
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
                error={hasReviewProfanity && review.trim().length > 0} // Keep error if profanity is present and there is non-empty text
                sx={{
                    borderRadius: " 30px",
                    fieldSet: {
                        borderRadius: " 30px",
                    },
                    input: {
                        color: "white !important"
                    },

                    width: "80%",
                }}
            />
        </div>
    )
}