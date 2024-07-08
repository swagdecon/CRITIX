import React, { useState, useEffect, useMemo } from "react";
import { fetchData } from "../security/Data";
import CookieManager from "../security/CookieManager.js";
import isTokenExpired from "../security/IsTokenExpired.js";
import UserStyle from "../components/UserProfile/UserProfile.module.css"
import CardProfile from "../components/UserProfile/ProfileImageUpload.js"
import NavBar from "../components/NavBar/NavBar.js";
import { LineChart } from "@mui/x-charts/LineChart"
import jwt_decode from "jwt-decode";

const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT

export default function UserProfile() {

    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    const decodedToken = useMemo(() => jwt_decode(token), [token]);
    const userId = decodedToken.userId
    const [userReviews, setUserReviews] = useState(null)
    const [recentUserReview, setRecentUserReview] = useState(null)
    useEffect(() => {
        async function fetchBackendData() {
            try {
                await isTokenExpired();
                const [allUserReviews] = await Promise.all([
                    fetchData(`${allUserReviewsEndpoint}${userId}`),
                ]);
                setUserReviews(
                    allUserReviews
                );
                setRecentUserReview(allUserReviews[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchBackendData();
    }, []);
    return (
        <div className={UserStyle.container}>
            <NavBar />
            <div className={UserStyle["profile-card"]}>
                <div className={UserStyle["profile-header"]}>
                    <div className={UserStyle["main-profile"]}>
                        <CardProfile userId={userId} />
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
                                Hi!, My name is Connor and I am the working on this application!
                            </p>
                        </section>
                    </div>
                    <div className={UserStyle.MainInfoPanel}>
                        <div className={UserStyle.ActivityInfo}>
                            <div className={UserStyle.UserActivityTitles}>Your Activity (Logins)</div>
                            <LineChart
                                xAxis={[
                                    {
                                        scaleType: 'time',
                                        data: [
                                            new Date(2024, 0, 1),
                                            new Date(2024, 1, 1),
                                            new Date(2024, 2, 1),
                                            new Date(2024, 3, 1),
                                            new Date(2024, 4, 1),
                                            new Date(2024, 5, 1),
                                            new Date(2024, 6, 1),
                                            new Date(2024, 7, 1),
                                            new Date(2024, 8, 1),
                                            new Date(2024, 9, 1),
                                            new Date(2024, 10, 1),
                                            new Date(2024, 11, 1),

                                        ],
                                        tickNumber: 3,
                                    },
                                ]}
                                series={[
                                    {
                                        data: [1, 9, 4, 6.5, 7, 13, 2, 5.5, 2, 8.5],
                                        color: '#0096ff',

                                    },
                                ]}
                                width={1000}
                                height={300}
                                sx={{
                                    //change left yAxis label styles
                                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                        strokeWidth: "1",
                                        fill: "white"
                                    },
                                    // change all labels fontFamily shown on both xAxis and yAxis
                                    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                                        fontFamily: "Roboto",
                                    },
                                    // change bottom label styles
                                    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                        strokeWidth: "0.5",
                                        fill: "white"
                                    },
                                    // bottomAxis Line Styles
                                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                        stroke: "white",
                                        strokeWidth: 1
                                    },
                                    // leftAxis Line Styles
                                    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                        stroke: "white",
                                        strokeWidth: 1
                                    },
                                }}
                            />
                        </div>
                        <div className={UserStyle.RecentReviews}>
                            <div className={UserStyle.RecentReviewsTitle}>Recent reviews</div>
                            <div className={UserStyle.AllUserReviews}>
                                {recentUserReview ?
                                    <div className={UserStyle.IndUserReviews} key={recentUserReview.movieId}>
                                        <div className={UserStyle.ProfilePic}>{recentUserReview.avatar}</div>
                                        <div className={UserStyle.ContentWrapper}>
                                            <div className={UserStyle.ContentHeaderWrapper}>
                                                <div className={UserStyle.UserName}>{recentUserReview.author}</div>
                                                <div className={UserStyle.TimeAgo}>
                                                    {recentUserReview.createdDate}
                                                </div>
                                            </div>
                                            <div className={UserStyle.ReviewContent}>{recentUserReview.content}</div>
                                        </div>
                                    </div>
                                    : "No Recent Reviews"}
                            </div>
                        </div>
                        <div className={UserStyle.AllReviews}>
                            <div className={UserStyle.AllReviewsTitle}>all reviews</div>
                            <div className={UserStyle.AllUserReviews}>
                                {userReviews?.map((review) => (
                                    <div className={UserStyle.IndUserReviews} key={review.movieId}>
                                        <div className={UserStyle.ProfilePic}>{review.avatar}</div>
                                        <div className={UserStyle.ContentWrapper}>
                                            <div className={UserStyle.ContentHeaderWrapper}>
                                                <div className={UserStyle.UserName}>{review.author}</div>
                                                <div className={UserStyle.TimeAgo}>
                                                    {review.createdDate}
                                                </div>
                                            </div>
                                            <div className={UserStyle.ReviewContent}>{review.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}