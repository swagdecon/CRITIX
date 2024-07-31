import React, { useState, useMemo, useEffect, useCallback } from "react";
import { fetchData } from "../security/Data";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import isTokenExpired from "../security/IsTokenExpired.js";
import UserStyle from "../components/UserProfile/UserProfile.module.css"
import CardProfile from "../components/UserProfile/ProfileImageUpload.js"
import NavBar from "../components/NavBar/NavBar.js";
import { LineChart } from "@mui/x-charts/LineChart"
import BannerImg from "../components/UserProfile/BannerImage.js";
import LoadingPage from "./LoadingPage.js";
import Pagination from "@mui/material/Pagination";
import IndUserReview from "../components/Review/NewReview/IndUserReview.js";
import { UserGraphStyle } from "../components/Shared/SharedMUI.js"
import InfoUpdate from "../components/UserProfile/InfoUpdate/InfoUpdate.js";
const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const getBannerEndpoint = process.env.REACT_APP_GET_USER_BANNER
const getUserFavouriteMoviesEndpoint = process.env.REACT_APP_GET_FAVOURITE_MOVIES_ENDPOINT

const breakpoints = [
    {
        breakpoint: 3450,
        settings: {
            slidesToShow: 6,
            slidesToScroll: 6,
            infinite: true,
            dots: false
        }
    },
    {
        breakpoint: 3140,
        settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
        }
    },
    {
        breakpoint: 2680,
        settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
        }
    },
    {
        breakpoint: 2220,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3
        }
    },
    {
        breakpoint: 1750,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    },
    {
        breakpoint: 950,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
]
export default function UserProfile() {

    const reviewsPerPage = 2;
    const [favouriteMovies, setFavouriteMovies] = useState(null);
    const [userReviews, setUserReviews] = useState(null)
    const [recentUserReview, setRecentUserReview] = useState(null)
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renderUserSettings, setRenderUserSettings] = useState(false);
    const [renderUserHome, setRenderUserHome] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = useCallback((event, page) => setCurrentPage(page));

    const displayReviews = useMemo(() => {
        let reviewsToDisplay = [];
        const startIdx = (currentPage - 1) * reviewsPerPage;
        const endIdx = startIdx + reviewsPerPage;
        reviewsToDisplay = userReviews?.slice(startIdx, endIdx);
        return reviewsToDisplay;
    }, [currentPage, userReviews]);

    const totalPages = userReviews ? Math.ceil(userReviews.length / reviewsPerPage) : 1;

    const fetchBackendData = useCallback(async () => {

        try {
            await isTokenExpired();
            const [useFavouriteMovies, allUserReviews, avatarPic, bannerPic] = await Promise.all([
                fetchData(getUserFavouriteMoviesEndpoint),
                fetchData(allUserReviewsEndpoint),
                fetchData(getAvatarEndpoint),
                fetchData(getBannerEndpoint)
            ]);
            setFavouriteMovies(useFavouriteMovies)
            setUserReviews(allUserReviews);
            setAvatar(avatarPic);
            setRecentUserReview(allUserReviews[0]);
            setBanner(bannerPic);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchBackendData();
    }, [fetchBackendData]);

    function showUserSettings() {
        setRenderUserHome(false)
        setRenderUserSettings(true)
    }
    function showUserHome() {
        setRenderUserHome(true)
        setRenderUserSettings(false)
    }
    return isLoading ? (
        <LoadingPage />
    ) : (
        <div className={UserStyle.container}>
            <NavBar />
            <div className={UserStyle["profile-card"]}>
                <div className={UserStyle["profile-header"]}>
                    <BannerImg bannerPic={banner} refetchBanner={fetchBackendData} />
                    <div className={UserStyle["main-profile"]}>
                        <CardProfile avatar={avatar} />
                        <div className={UserStyle["profile-names"]}>
                            <h1 className={UserStyle.username}>Connor Pant</h1>
                        </div>
                    </div>
                </div>

                <div className={UserStyle["profile-body"]}>
                    <div className={UserStyle["profile-actions"]}>
                        <button className={UserStyle.settings} onClick={showUserHome}>Home</button>
                        <button className={UserStyle.settings} onClick={showUserSettings}>Settings</button>
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
                    {renderUserHome && !renderUserSettings ?
                        <div className={UserStyle.MainInfoPanel}>
                            <section className={UserStyle.ActivityInfo}>
                                <h2 className={UserStyle.Title}>Activity</h2>
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
                                            data: [1, 9, 4, 6.5, 7, 13, 2, 5.5, 2, 8.5, 4, 7.1],
                                            color: '#0096ff',

                                        },
                                    ]}
                                    width={1000}
                                    height={300}
                                    sx={UserGraphStyle}
                                />
                            </section>
                            <section className={UserStyle.RecentReviews}>
                                <h2 className={UserStyle.Title}>Recent review</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {recentUserReview ?
                                        <IndUserReview key={recentUserReview.movieId} avatar={avatar} movieTitle={recentUserReview.movieTitle} createdDate={recentUserReview.createdDate} content={recentUserReview.content} rating={recentUserReview.rating} />
                                        : "No Recent Reviews"}
                                </div>
                            </section>
                            <section className={UserStyle.AllReviews}>
                                <h2 className={UserStyle.Title}>all reviews</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {displayReviews.map((review) => (
                                        <IndUserReview key={review.movieId} avatar={avatar} movieTitle={review.movieTitle} createdDate={review.createdDate} content={review.content} rating={review.rating} />
                                    ))}
                                </div>
                                <div className={UserStyle.PaginationWrapper}>
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
                                        }}
                                    />
                                </div>
                            </section>
                            <section className={UserStyle.FavouriteMovies}>
                                <h2 className={UserStyle.Title}>Your Favourite Movies</h2>
                                {favouriteMovies ?
                                    <MovieCarousel
                                        movies={favouriteMovies}
                                        endpoint="/movies/movie"
                                        breakpoints={breakpoints}
                                    />
                                    : null}
                            </section>
                        </div>
                        :
                        <InfoUpdate />
                    }
                </div>
            </div>
        </div >
    )
}