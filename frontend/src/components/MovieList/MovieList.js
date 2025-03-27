import { React, useState, useMemo, useCallback } from "react";
import MovieListStyle from "./MovieList.module.css";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import Title from "../Carousel/title.module.scss";
import PropTypes from "prop-types";
import LoadingPage from "../../views/Loading";
import Dropdown from "../Other/Dropdown/SortByDropdown";
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import isTokenExpired from "../../security/IsTokenExpired";
import { fetchData } from "../../security/Data";
const movieListEndpoint = process.env.REACT_APP_MOVIE_LIST_ENDPOINT
const API_URL = process.env.REACT_APP_BACKEND_API_URL

const theme = createTheme({
  palette: {
    primary: {
      main: "#0096ff",
    },
  },
});
async function fetchBackendData(endpointName, page) {

  try {
    await isTokenExpired();
    const response = await Promise.all([
      fetchData(`${API_URL}${movieListEndpoint}${endpointName}?page=${page}`),
    ]);
    return response[0]
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
export default function MovieList({ endpoint }) {
  const [movies, setMovies] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
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

  const handlePageChange = (event) => {
    setDataLoaded(false);
    const newPage = parseInt(event.target.textContent);
    setCurrentPage(newPage);
    fetchBackendData(endpoint.endpointName, newPage)
      .then(data => {
        setMovies(data.movieCardList);
        setTotalPages(data.totalPages);
        setDataLoaded(true);
      })
      .catch(error => {
        console.error("Error handling page change:", error);
        setDataLoaded(true);
      });
  }
  useMemo(() => {
    function getDetailedMovieData(endpointName) {
      setCurrentPage(1);
      fetchBackendData(endpointName, 1)
        .then(data => {
          setMovies(data.movieCardList);
          setTotalPages(data.totalPages);
          setDataLoaded(true);
          switch (endpointName) {
            case "now_playing":
              setTitle("In Theatres");
              setCaption("The Latest Movies on the Big Screen");
              break;
            case "upcoming":
              setTitle("Upcoming Movies");
              setCaption("Get a Sneak Peek of What's Coming Soon");
              break;
            case "popular":
              setTitle("Popular Movies");
              setCaption("Discover What Everyone Is Watching Right Now");
              break;
            case "top_rated":
              setTitle("Top Rated Movies");
              setCaption("Cinematic Masterpieces");
              break;
            case "now_playing_and_upcoming":
              setTitle("In Theatres");
              setCaption("The Latest Movies on the Big Screen");
              break;
            case "now_playing_and_popular":
              setTitle("In Theatres");
              break;
          }
        })
        .catch(error => {
          console.error("Error fetching detailed movie data:", error);
          setDataLoaded(true);
        });
    }
    getDetailedMovieData(endpoint.endpointName);
  }, [endpoint.endpointName]);


  if (!dataLoaded || movies === null) {
    return <LoadingPage />;
  }
  return (
    <>
      <div className={MovieListStyle.titleWrapper}>
        <div className={MovieListStyle["title-container"]}>
          <h3 className={Title["movie-title"]}>{title}</h3>
          <div className={MovieListStyle["title-caption"]}>{caption}</div>
          <div className={MovieListStyle["sort-by-btn"]}>
            <Dropdown onSelectSortBy={handleSortByChange} dropdownItems={["Popularity Desc.",
              "Popularity Asc.",
              "A-Z",
              "Z-A",
              "Vote Average Desc.",
              "Vote Average Asc."]} />
          </div>
        </div>
      </div>
      <div className={MovieListStyle.Container}>
        {movies.map((movie) => (
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
                isSavedToFavouriteMoviesList={movie.isSavedToFavouriteMoviesList}
                isSavedToWatchlist={movie.isSavedToWatchlist}
              />
            </Link>
          </div>
        ))}
      </div>
      <div className={MovieListStyle["pagination-container"]}>
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
      </div>
    </ >
  );
}

MovieList.propTypes = {
  endpoint: PropTypes.object,
};
