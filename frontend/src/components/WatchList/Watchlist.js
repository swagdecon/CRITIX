
// import { createTheme } from '@mui/material/styles';
import isTokenExpired from "../../security/IsTokenExpired";
import { fetchData } from "../../security/FetchApiData";
import WatchListStyle from "../MovieList/MovieList.module.css"
import { React, useMemo, useState, useCallback } from "react";
import jwt_decode from "jwt-decode";
import CookieManager from "../../security/CookieManager.js";
import LoadingPage from "../../views/LoadingPage.js";
import Title from "../Carousel/title.module.scss";
import { Link } from "react-router-dom";
import MovieCard from "../MovieCard/MovieCard.js";
import Dropdown from "../Other/Dropdown/SortByDropdown.js";
import NavBar from "../NavBar/NavBar.js";
const GET_WATCHLIST_ENDPOINT = process.env.REACT_APP_GET_WATCHLIST_ENDPOINT;

export default function WatchList() {
    const token = jwt_decode(CookieManager.decryptCookie("accessToken"))
    const userId = token.userId;
    const [movies, setMovies] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false)
    // const theme = createTheme({
    //     palette: {
    //         primary: {
    //             main: "#0096ff",
    //         },
    //     },
    // });
    const handleSortByChange = useCallback((selectedValue) => {
        let sortedMovies;
        switch (selectedValue) {
            case "A-Z":
                sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "Z-A":
                sortedMovies = [...movies].sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "Popularity Asc.":
                sortedMovies = [...movies].sort((a, b) => a.popularity - b.popularity);
                break;
            case "Popularity Desc.":
                sortedMovies = [...movies].sort((a, b) => b.popularity - a.popularity);
                break;
            case "Vote Average Asc.":
                sortedMovies = [...movies].sort((a, b) => a.voteAverage - b.voteAverage);
                break;
            case "Vote Average Desc.":
                sortedMovies = [...movies].sort((a, b) => b.voteAverage - a.voteAverage);
                break;
            default:
                sortedMovies = [...movies];
        }
        setMovies(sortedMovies);
    }, [movies]);

    async function fetchBackendData() {
        try {
            await isTokenExpired();
            const response = await Promise.all([
                fetchData(`${GET_WATCHLIST_ENDPOINT}/${userId}`),
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
                    console.log(data)
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
                        <div className={WatchListStyle["sort-by-btn"]}>
                            <Dropdown onSelectSortBy={handleSortByChange} />
                        </div>
                    </div>
                </div>
                <div className={WatchListStyle["container"]}>

                    {movies ? movies.map((movie) => (
                        <div key={movie.movieId}>
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
                                />
                            </Link>
                        </div>
                    )) : "Add a movie to your watchlist"}
                </div>
            </div>
            {/* <div className={MovieListStyle["pagination-container"]}>
                <ThemeProvider theme={theme}>
                    <Pagination
                        onClick={handlePageChange}
                        count={totalPages}
                        siblingCount={4}
                        boundaryCount={1}
                        page={currentPage}
                        size="large"
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#ffffff',
                            },
                        }}
                    />
                </ThemeProvider>
            </div> */}
        </div>
    );
}