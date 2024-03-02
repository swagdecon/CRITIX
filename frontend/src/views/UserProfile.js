import React from "react";
import UserStyle from "../components/UserProfile/UserProfile.module.css"
import CardProfile from "../components/UserProfile/ProfileImageUpload.js"
import NavBar from "../components/NavBar/NavBar.js";
export default function UserProfile() {

    return (
        <div className={UserStyle.container}>
            <NavBar />

            <div className={UserStyle["profile-card"]}>
                <div className={UserStyle["profile-header"]}>
                    <div className={UserStyle["main-profile"]}>
                        <CardProfile />
                        <div className={UserStyle["profile-names"]}>
                            <h1 className={UserStyle.username}>Connor Pant</h1>
                            <small className={UserStyle["page-title"]}>Pilot</small>
                        </div>
                    </div>
                </div>

                <div className={UserStyle["profile-body"]}>
                    <div className={UserStyle["profile-actions"]}>
                        <button className={UserStyle.follow}>Follow</button>
                        <button className={UserStyle.message}>Message</button>
                        <section className={UserStyle.bio}>
                            <div className={UserStyle["bio-header"]}>
                                <i className="fa fa-info-circle"></i>
                                Bio
                            </div>
                            <p className={UserStyle["bio-text"]}>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                            </p>
                        </section>
                    </div>

                    <div className={UserStyle["account-info"]}>
                        <div className={UserStyle.data}>
                            <section className={UserStyle["user-reviews-section"]}>
                                <div className={UserStyle["reviews-title"]}>
                                    all reviews
                                </div>
                                <div className={UserStyle["review-list"]}>
                                    {/* {reviews.map(review.length, (review) => {
                                        console.log(review)
                                    })} */}
                                </div>
                            </section>
                        </div>

                        <div className={UserStyle["social-media"]}>
                            <span>Follow me in:</span>
                            <a href="" className={UserStyle["media-link"]}><i className="fab fa-facebook-square"></i></a>
                            <a href="https://twitter.com/MammadSahragard" className={UserStyle["media-link"]}><i className="fab fa-twitter-square"></i></a>
                            <a href="https://www.linkedin.com/in/mohammadsahragard/" className={UserStyle["media-link"]}><i className="fab fa-linkedin"></i></a>
                            <a href="https://www.instagram.com/mammad.sahragard/" className={UserStyle["media-link"]}><i className="fab fa-instagram-square"></i></a>
                            <a href="https://github.com/MohammadSahragard" className={UserStyle["media-link"]}><i className="fab fa-github-square"></i></a>
                        </div>

                        <div className={UserStyle["last-post"]}>
                            <div className={UserStyle["post-cover"]}>
                                <span className={UserStyle["last-badge"]}>Last Post</span>
                            </div>
                            <h3 className={UserStyle["post-title"]}>3D layer</h3>
                            <button className={UserStyle["post-CTA"]}>View</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}