import isTokenExpired from "../security/IsTokenExpired.js";
import { fetchData } from "../security/Data.js";
import WatchListStyle from "../components/MovieList/MovieList.module.css"
import { React, useMemo, useState } from "react";
import LoadingPage from "./Loading.js";
import Title from "../components/Carousel/title.module.scss";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard/MovieCard.js";
import NavBar from "../components/NavBar/NavBar.js";
import Footer from "../components/Footer/Footer.js";
import { Film, Plus } from 'lucide-react';

const GET_WATCHLIST_ENDPOINT = process.env.REACT_APP_GET_WATCHLIST_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

export default function WatchList() {
    const [movies, setMovies] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const navigate = useNavigate();

    async function fetchBackendData() {
        try {
            await isTokenExpired();
            const response = await Promise.all([
                fetchData(`${API_URL}${GET_WATCHLIST_ENDPOINT}`),
            ]);
            return response[0]
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useMemo(() => {
        function getDetailedMovieData() {
            fetchBackendData()
                .then(data => {
                    setMovies(data);
                    setDataLoaded(true);
                })
                .catch(error => {
                    console.error("Error fetching watchlist movie data:", error);
                    setDataLoaded(true);
                });
        }
        getDetailedMovieData();
    }, []);

    if (!dataLoaded || movies === null) {
        return <LoadingPage />;
    }

    // Empty state component
    const EmptyWatchlist = () => (
        <div className={WatchListStyle["empty-state-wrapper"]}>
            <div className={WatchListStyle["empty-state-container"]}>
                <div className={WatchListStyle["empty-state-card"]}>
                    <div className={WatchListStyle["icon-container"]}>
                        <div className={WatchListStyle["icon-wrapper"]}>
                            <Film size={64} strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className={WatchListStyle["empty-state-text"]}>
                        <h2>Your Watchlist is Empty</h2>
                        <p>
                            Start building your personal collection of must-watch films.
                            Discover, save, and never forget another movie you want to see.
                        </p>
                    </div>
                    <button
                        className={WatchListStyle["discover-btn"]}
                        onClick={() => navigate('/discover-movies')}
                    >
                        <Plus size={24} />
                        Discover Movies
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <NavBar />
            <div className={WatchListStyle["page-wrapper"]}>
                <div className={WatchListStyle.titleWrapper}>
                    <div className={WatchListStyle["title-container"]}>
                        <h3 className={Title["movie-title"]}>YOUR WATCHLIST</h3>
                    </div>
                </div>
                <div className={WatchListStyle["watchlist-container"]}>
                    {movies.length !== 0 ? movies.map((movie) => (
                        <div key={movie.movieId}>
                            <Link to={`${indMovieEndpoint}${movie.movieId}`}>
                                <MovieCard
                                    movieId={movie.movieId}
                                    posterUrl={movie.posterUrl}
                                    voteAverage={movie.voteAverage}
                                    runtime={movie.runtime}
                                    genres={movie.genres}
                                    overview={movie.overview}
                                    actors={movie.actors}
                                    video={movie.video}
                                    isSavedToFavouriteMoviesList={movie.isSavedToFavouriteMoviesList}
                                    isSavedToWatchlist={movie.isSavedToWatchlist}
                                />
                            </Link>
                        </div>
                    )) : <EmptyWatchlist />}
                </div>
            </div>
            <Footer />
        </div>
    );
}