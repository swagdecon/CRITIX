import React, { Component } from 'react'
import PropTypes from "prop-types";
import { Embed, CommentCount } from 'hyvor-talk-react'
import IndReview from "./Review.module.css";
export default class MovieComments extends Component {

    render() {
        MovieComments.propTypes = {
            movieId: PropTypes.number.isRequired,
        }
        const { movieId } = this.props;

        return (
            <div className={IndReview["ind-review-wrapper"]}>
                <h1>Reviews</h1>

                <div className="comment-count-view">

                    { /* Comment Counts */}
                    <CommentCount
                        websiteId={8952}
                        id={movieId}
                    />

                </div>

                <content>Your Article Here</content>

                { /* Load Comments now */}
                <Embed
                    websiteId={8952}
                    id={movieId}
                />
            </div>
        )
    }
}