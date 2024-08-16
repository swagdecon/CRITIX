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
import { Link } from "react-router-dom";
import favouriteMovieBreakpoints from "../components/Carousel/Other/General.js";
import MovieCard from "../components/MovieCard/MovieCard.js";
const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const getBannerEndpoint = process.env.REACT_APP_GET_USER_BANNER
const getUserFavouriteMoviesEndpoint = process.env.REACT_APP_GET_FAVOURITE_MOVIES_ENDPOINT
const getLoginInfoEndpoint = process.env.REACT_APP_GET_LOGIN_INFO_ENDPOINT
const endpoint = "/movies/movie"
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
                        <button className={UserStyle.settings} onClick={renderUserHome ? showUserSettings : showUserHome}>{renderUserHome ? "Settings" : "Home"}</button>
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
                            <LoginInfo data={loginInfo} />
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
                                    {reviewsToDisplay.length > 0 ?
                                        reviewsToDisplay.map((review) => (
                                            <IndUserReview key={review.movieId} avatar={avatar} movieTitle={review.movieTitle} createdDate={review.createdDate} content={review.content} rating={review.rating} />
                                        ))
                                        : <div className={UserStyle.NoContent}>
                                            Start posting reviews to fill this spot with your insights.
                                        </div>}
                                </div>
                                {reviewsToDisplay.length > 0 ?
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
                                {/* The carousel styling makes cards look strange below 5 cards, therefore we will show just a simple loop through the cards in the else statement */}
                                {favouriteMovies.length > 5 ? (
                                    <MovieCarousel
                                        movies={favouriteMovies}
                                        endpoint={endpoint}
                                        breakpoints={favouriteMovieBreakpoints()}
                                    />
                                ) : favouriteMovies.length > 0 ? (
                                    <div className={UserStyle.FavouriteMovieWrapper}>
                                        {favouriteMovies.map((movie, i) => (
                                            <div className={UserStyle.ShortFavouriteMovieList} key={i}>
                                                <Link to={`${endpoint}/${movie.id || movie.movieId}`}>
                                                    <MovieCard
                                                        movieId={movie.id || movie.movieId}
                                                        title={movie.title}
                                                        posterUrl={movie.posterUrl}
                                                        voteAverage={movie.voteAverage}
                                                        genres={movie.genres}
                                                        overview={movie.overview}
                                                        actors={movie.actors}
                                                        isSavedToWatchlist={movie.isSavedToWatchlist}
                                                        isSavedToFavouriteMoviesList={movie.isSavedToFavouriteMoviesList}
                                                        shareUrl={`${endpoint}movie/${movie.id}`}
                                                    />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={UserStyle.NoContent}>
                                        Your favorite films deserve the spotlight. Start adding them here.
                                    </div>
                                )}


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