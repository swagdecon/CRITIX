import React, { useEffect, useState } from "react";
import LoadingPage from "../../views/Loading";
import NavBar from "../NavBar/NavBar";
import { MovieAverage, ParseYear, MovieGenres, WatchMovieNow } from "../IndFilm/MovieComponents";
import MovieButton from "../Other/btn/MovieButton/Button";
import WatchListBtn from "../Other/btn/WatchListBtn/WatchListBtn";
import FavouriteBtn from "../Other/btn/FavouriteBtn/FavouriteBtn";
import IndMovieStyle from "../IndFilm/IndMovie.module.css";
import { fetchData } from "../../security/Data.js";
import isTokenExpired from "../../security/IsTokenExpired";
import backupPoster from "../../misc/noPosterAvailable.png";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import IntroSlide from "./IntroSlide.js";
import CookieManager from "../../security/CookieManager.js";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const userRecommendedMovies = process.env.REACT_APP_GET_USER_RECOMMENDED_MOVIES;

export default function recommendationsCarousel() {
    const [recommendedMovies, setRecommendedMovies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = CookieManager.decryptCookie('accessToken');
    const decodedToken = jwtDecode(token);
    const isUltimateUser = decodedToken.isUltimateUser;

    const handleWatchNowClick = (movie) => WatchMovieNow(movie.providerResults);

    useEffect(() => {
        async function fetchBackendData() {
            setIsLoading(true);
            try {
                await isTokenExpired();
                const recommendedMovies = await fetchData(`${API_URL}${userRecommendedMovies}`);
                setRecommendedMovies(recommendedMovies);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBackendData();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
        prevArrow: <div className="slick-prev">Previous</div>,
        nextArrow: <div className="slick-next">Next</div>,
    };

    const RecommendedSlider = styled(Slider)`
        .slick-prev,
        .slick-next {
            z-index: 1;
            width: 3rem;
            height: 3rem;
            display: flex !important;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 50%;
            transition: background 0.3s ease;
        }

        .slick-prev {
            left: 0.25vw;
        }

        .slick-next {
            right: 0.25vw;
        }

        .slick-prev::before,
        .slick-next::before {
            font-size: 2rem; 
            color: white;
        }
    `;

    if (isLoading) {
        return <LoadingPage />;
    }

    const hasRecommendations =
        Array.isArray(recommendedMovies) && recommendedMovies.length > 0;

    // Limit recommendations to 5 for non-ultimate users
    const displayedMovies = hasRecommendations
        ? isUltimateUser
            ? recommendedMovies
            : recommendedMovies.slice(0, 5)
        : [];

    const totalRecommendations = hasRecommendations ? recommendedMovies.length : 0;

    return (
        <div className={IndMovieStyle["ind-recommendation-page-wrapper"]}>
            <NavBar />
            <div className={IndMovieStyle.sliderWrapper}>
                {hasRecommendations ? (
                    <RecommendedSlider {...settings}>
                        <IntroSlide
                            isUltimateUser={isUltimateUser}
                            shownCount={displayedMovies.length}
                            totalCount={totalRecommendations}
                        />
                        {displayedMovies.map((movie, i) => (
                            <div key={i} className={IndMovieStyle.fullPageSlide}>
                                <div
                                    className={IndMovieStyle.background}
                                    style={{
                                        backgroundImage: `url(${movie.backdropUrl})`,
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        height: "100vh",
                                    }}
                                />
                                <div className={IndMovieStyle["content-wrapper"]}>
                                    <section className={IndMovieStyle["hero-content"]}>
                                        <div className={IndMovieStyle.movie_hero_info_container}>
                                            <div className={IndMovieStyle.rating}>
                                                <MovieAverage voteAverage={movie.voteAverage} />
                                            </div>
                                            <h2 className={IndMovieStyle.movie__title}>{movie.title}</h2>
                                            <div className={IndMovieStyle.movie__year}>
                                                <ParseYear date={movie.releaseDate} />
                                            </div>
                                            <MovieGenres genres={movie.genres} />
                                            <div className={IndMovieStyle.movie__description}>
                                                {movie.overview}
                                            </div>
                                            <div className={IndMovieStyle["btn-wrapper"]}>
                                                <MovieButton
                                                    innerIcon="watchNow"
                                                    onClick={() => handleWatchNowClick(movie)}
                                                />
                                                <div className={IndMovieStyle.BtnResponsive}>
                                                    <div className={IndMovieStyle["btn-wrapper-el"]}>
                                                        <WatchListBtn movieData={movie} outline={true} />
                                                    </div>
                                                    <div className={IndMovieStyle["btn-wrapper-el"]}>
                                                        <FavouriteBtn movieData={movie} outline={true} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={IndMovieStyle.RecommendationsPoster}>
                                            <img
                                                className={IndMovieStyle["hero-poster"]}
                                                src={movie.posterUrl || backupPoster}
                                                alt={movie.title || "fallback poster"}
                                            />
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ))}
                    </RecommendedSlider>
                ) : (
                    <IntroSlide
                        isUltimateUser={isUltimateUser}
                        shownCount={0}
                        totalCount={0}
                    />
                )}
            </div>
        </div>
    );
}