import { React, useState, useEffect, useCallback } from "react";
import MovieListStyle from "./MovieList.module.css";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import Title from "../Carousel/title.module.scss";
import PropTypes from "prop-types";
import getDetailedMovie from "../../axios/GetDetailedMovie";
import LoadingPage from "../../views/LoadingPage";
import Dropdown from "../Other/Dropdown/SortByDropdown";
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#0096ff",
    },
  },
});

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
        sortedMovies = [...movies].sort((a, b) => a.vote_average - b.vote_average);
        break;
      case "Vote Average Desc.":
        sortedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average);
        break;
      default:
        sortedMovies = [...movies];
    }
    setMovies(sortedMovies);
  }, [movies]);

  const handlePageChange = useCallback(async (event) => {
    setDataLoaded(false);
    const newPage = parseInt(event.target.textContent);
    setCurrentPage(newPage);
    const data = await getDetailedMovie(endpoint.endpointName, { page: newPage });
    setMovies(data.detailedMovies);
    setDataLoaded(true);
  }, [endpoint.endpointName]);

  useEffect(() => {
    async function getDetailedMovieData(endpointName) {
      const data = await getDetailedMovie(endpointName);
      setMovies(data.detailedMovies);
      setTotalPages(data.totalPages);
      setDataLoaded(true);
      setCurrentPage(1);
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
    }
    getDetailedMovieData(endpoint.endpointName);
  }, [endpoint.endpointName]);

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  return (
    <div className={MovieListStyle["page-wrapper"]}>
      <div className={MovieListStyle.titleWrapper}>
        <div className={MovieListStyle["title-container"]}>
          <h3 className={Title["movie-title"]}>{title}</h3>
          <div className={MovieListStyle["title-caption"]}>{caption}</div>
          <div className={MovieListStyle["sort-by-btn"]}>
            <Dropdown onSelectSortBy={handleSortByChange} />
          </div>
        </div>
      </div>

      <div className={MovieListStyle["container"]}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <Link to={`/movies/movie/${movie.id}`}>
              <MovieCard
                poster={movie.poster_path}
                rating={movie.vote_average}
                runtime={movie.runtime}
                genres={movie.genres}
                overview={movie.overview}
                actors={movie.actors}
                video={movie.video}
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
    </div>
  );

}

MovieList.propTypes = {
  endpoint: PropTypes.object,
};
