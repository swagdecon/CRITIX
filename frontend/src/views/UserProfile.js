import React, { useState, useEffect, useCallback } from "react";
import { fetchData } from "../security/Data";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import isTokenExpired from "../security/IsTokenExpired.js";
import UserStyle from "../components/UserProfile/UserProfile.module.css"
import ProfilePicture from "../components/UserProfile/ProfileImage.js"
import NavBar from "../components/NavBar/NavBar.js";
import BannerImg from "../components/UserProfile/BannerImage.js";
import LoadingPage from "./LoadingPage.js";
import Pagination from "@mui/material/Pagination";
import IndUserReview from "../components/Review/NewReview/IndUserReview.js";
import InfoUpdate from "../components/UserProfile/InfoUpdate/InfoUpdate.js";
import LoginInfo from "../components/UserProfile/LoginInfo.js";
const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const getBannerEndpoint = process.env.REACT_APP_GET_USER_BANNER
const getUserFavouriteMoviesEndpoint = process.env.REACT_APP_GET_FAVOURITE_MOVIES_ENDPOINT
const getLoginInfoEndpoint = process.env.REACT_APP_GET_LOGIN_INFO_ENDPOINT

export default function UserProfile() {
    const reviewsPerPage = 2;
    const [favouriteMovies, setFavouriteMovies] = useState(null);
    const [loginInfo, setLoginInfo] = useState(null);
    const [userReviews, setUserReviews] = useState(null)
    const [recentUserReview, setRecentUserReview] = useState(null)
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renderUserSettings, setRenderUserSettings] = useState(false);
    const [renderUserHome, setRenderUserHome] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = useCallback((event, page) => setCurrentPage(page));

    const breakpoints = [
        {
            breakpoint: 4000,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 6,
                infinite: favouriteMovies?.length <= 10 ? true : false,
            }
        },
        {
            breakpoint: 3140,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 5,
                slidesToScroll: 5,
            }
        },
        {
            breakpoint: 2680,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 4,
                slidesToScroll: 4,
            }
        },
        {
            breakpoint: 2220,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 1750,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 1250,
            settings: {
                slidesToShow: favouriteMovies?.length <= 5 ? favouriteMovies.length : 1,
                slidesToScroll: 1
            }
        }
    ]

    let reviewsToDisplay = [];
    const startIdx = (currentPage - 1) * reviewsPerPage;
    const endIdx = startIdx + reviewsPerPage;
    reviewsToDisplay = userReviews?.slice(startIdx, endIdx);
    reviewsToDisplay > 0 ? reviewsToDisplay : null


    const totalPages = userReviews ? Math.ceil(userReviews.length / reviewsPerPage) : 1;

    const fetchBackendData = useCallback(async () => {

        try {
            await isTokenExpired();
            const [loginInfo, favouriteMovies, allUserReviews, avatarPic, bannerPic] = await Promise.all([
                fetchData(getLoginInfoEndpoint),
                fetchData(getUserFavouriteMoviesEndpoint),
                fetchData(allUserReviewsEndpoint),
                fetchData(getAvatarEndpoint),
                fetchData(getBannerEndpoint)
            ]);
            setLoginInfo(loginInfo)
            setFavouriteMovies(favouriteMovies)
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
    console.log(loginInfo)
    return isLoading ? (
        <LoadingPage />
    ) : (
        <div className={UserStyle.container}>
            <NavBar />
            <div className={UserStyle["profile-card"]}>
                <div className={UserStyle["profile-header"]}>
                    <BannerImg bannerPic={banner} refetchBanner={fetchBackendData} />
                    <div className={UserStyle["main-profile"]}>
                        <ProfilePicture avatar={avatar} />
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
                                <LoginInfo data={loginInfo} />
                            </section>
                            <section className={UserStyle.RecentReviews}>
                                <h2 className={UserStyle.Title}>Recent review</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {recentUserReview ?
                                        <IndUserReview key={recentUserReview.movieId} avatar={avatar} movieTitle={recentUserReview.movieTitle} createdDate={recentUserReview.createdDate} content={recentUserReview.content} rating={recentUserReview.rating} />
                                        : <div className={UserStyle.NoContent}>
                                            Start posting reviews to fill this spot with your insights.
                                        </div>}
                                </div>
                            </section>
                            <section className={UserStyle.AllReviews}>
                                <h2 className={UserStyle.Title}>all reviews</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {reviewsToDisplay ?
                                        reviewsToDisplay.map((review) => (
                                            <IndUserReview key={review.movieId} avatar={avatar} movieTitle={review.movieTitle} createdDate={review.createdDate} content={review.content} rating={review.rating} />
                                        ))
                                        : <div className={UserStyle.NoContent}>
                                            Start posting reviews to fill this spot with your insights.
                                        </div>}
                                </div>
                                {reviewsToDisplay ?
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
                                    : null}
                            </section>
                            <section className={UserStyle.FavouriteMovies}>

                                <h2 className={UserStyle.Title}>Your Favourite Movies</h2>
                                {favouriteMovies.length > 0 ?
                                    <MovieCarousel
                                        movies={favouriteMovies}
                                        endpoint="/movies/movie"
                                        breakpoints={breakpoints}
                                    />
                                    : <div className={UserStyle.NoContent}>Your favorite films deserve the spotlight. Start adding them here.</div>}
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