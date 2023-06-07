import React, { useEffect } from "react";
import IndReview from "./Review.module.css"
const ReviewBox = () => {
    useEffect(() => {
        if (window.replybox.site) return;

        window.replybox = {
            site: "PN76o2D45r"
        };

        const script = document.createElement("script");
        script.src = "https://cdn.replyboxreviews.com/js/embed.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div className={IndReview["ind-review-wrapper"]}>
        <div id="replybox"></div></div>
};

export default ReviewBox;