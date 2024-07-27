
// import { createTheme } from '@mui/material/styles';
import isTokenExpired from "../security/IsTokenExpired.js";
import { fetchData } from "../security/Data.js";
import WatchListStyle from "../components/MovieList/MovieList.module.css"
import { React, useMemo, useState } from "react";
import LoadingPage from "./LoadingPage.js";
import Title from "../components/Carousel/title.module.scss";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard/MovieCard.js";
import NavBar from "../components/NavBar/NavBar.js";
const GET_WATCHLIST_ENDPOINT = process.env.REACT_APP_GET_WATCHLIST_ENDPOINT;

export default function WatchList() {

    const [movies, setMovies] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false)

    // const handleSortByChange = useCallback((selectedValue) => {
    //     let sortedMovies;
    //     switch (selectedValue) {
    //         case "A-Z":
    //             sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    //             break;
    //         case "Z-A":
    //             sortedMovies = [...movies].sort((a, b) => b.title.localeCompare(a.title));
    //             break;
    //         case "Vote Average Asc.":
    //             sortedMovies = [...movies].sort((a, b) => a.voteAverage - b.voteAverage);
    //             break;
    //         case "Vote Average Desc.":
    //             sortedMovies = [...movies].sort((a, b) => b.voteAverage - a.voteAverage);
    //             break;
    //         default:
    //             sortedMovies = [...movies];
    //     }
    //     setMovies(sortedMovies);
    // }, [movies]);

    async function fetchBackendData() {
        try {
            await isTokenExpired();
            const response = await Promise.all([
                fetchData(GET_WATCHLIST_ENDPOINT),
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

    return (
        <div>
            <NavBar />
            <div className={WatchListStyle["page-wrapper"]}>
                <div className={WatchListStyle.titleWrapper}>
                    <div className={WatchListStyle["title-container"]}>
                        <h3 className={Title["movie-title"]}>YOUR WATCHLIST</h3>
                        {/* {movies.length !== 0 ?
                            <div className={WatchListStyle["sort-by-btn"]}>
                                <Dropdown onSelectSortBy={handleSortByChange} dropdownItems={[
                                    "A-Z",
                                    "Z-A",
                                    "Vote Average Desc.",
                                    "Vote Average Asc."]} />
                            </div>
                            : null} */}
                    </div>
                </div>
                <div className={WatchListStyle["watchlist-container"]}>
                    {movies.length !== 0 ? movies.map((movie) => (

                        < div key={movie.movieId} >
                            <Link to={`/movies/movie/${movie.movieId}`}>
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
                    )) :

                        <div className={WatchListStyle.emptyList}> Include films in your watchlist to have them displayed here!
                        </div>

                    }
                </div>
            </div>
        </div >
    );
}