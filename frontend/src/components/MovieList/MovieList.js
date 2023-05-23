import { React, useState, useEffect } from "react";
import MovieListStyle from "./MovieList.module.css";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import "../Carousel/title.scss";
import PropTypes from "prop-types";
import getDetailedMovie from "../../axios/GetDetailedMovie";
import LoadingPage from "../../views/LoadingPage";
import SortByButton from "../Other/Dropdown/SortByDropdown/SortByDropdown";
import FilterByButton from "../Other/Dropdown/FilterByDropdown/FilterByDropdown";
import Pagination from '@mui/material/Pagination';
export default function MovieList({ endpoint }) {
  MovieList.propTypes = {
    endpoint: PropTypes.string.isRequired,
  };
  const [movies, setMovies] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    async function getDetailedMovieData(endpoint, options) {
      const data = await getDetailedMovie(endpoint, options);
      console.log(data)

      setMovies(data.detailedMovies);
      setTotalPages(10);
      setDataLoaded(true);
    }
    getDetailedMovieData(endpoint.endpointName, { page: currentPage });
  }, [endpoint.endpointName, currentPage]);
    
  if (!dataLoaded) {
    return <LoadingPage />;
  }
  let title;
  let caption;
  if (endpoint.endpointName === "now_playing") {
    title = "In Theatres:";
    caption = "The Latest Movies on the Big Screen";
  } else if (endpoint.endpointName === "upcoming") {
    title = "Upcoming Movies:";
    caption = "Get a Sneak Peek of What's Coming Soon";
  } else if (endpoint.endpointName === "popular") {
    title = "Discover What Everyone Is Watching Right Now";
    caption = "Popular Movies:";
  }
  const handleSortByChange = async (selectedValue) => {
    const data = await getDetailedMovie(endpoint.endpointName);

    if (selectedValue === "A-Z") {
      const sortedMovieTitleAscending = data.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setMovies(sortedMovieTitleAscending);
    } else if (selectedValue === "Z-A") {
      const sortedMovieTitleDescending = data.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      setMovies(sortedMovieTitleDescending);
    } else if (selectedValue === "Popularity Asc.") {
      const sortedMoviePopularityAscending = data.sort(
        (a, b) => a.popularity - b.popularity
      );
      setMovies(sortedMoviePopularityAscending);
    } else if (selectedValue === "Popularity Desc.") {
      const sortedMoviePopularityDescending = data.sort(
        (a, b) => b.popularity - a.popularity
      );
      setMovies(sortedMoviePopularityDescending);
    } else if (selectedValue === "Vote Average Asc.") {
      const sortedMovieVoteAverageAscending = data.sort(
        (a, b) => a.vote_average - b.vote_average
      );
      setMovies(sortedMovieVoteAverageAscending);
    } else if (selectedValue === "Vote Average Desc.") {
      const sortedMovieVoteAverageDescending = data.sort(
        (a, b) => b.vote_average - a.vote_average
      );
      setMovies(sortedMovieVoteAverageDescending);
    } else {
      return;
    }
  };
  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
    setDataLoaded(false);
  };
  return (
    <div>
      <div className={MovieListStyle["title-container"]}>
        <h3-title>{title}</h3-title>
        <div className={MovieListStyle["title-caption"]}>{caption}</div>
      </div>
      <SortByButton onSelectSortBy={handleSortByChange} /> <FilterByButton />
      <div className={MovieListStyle["container"]}>
        {movies.map((movie, i) => (
          <div key={i}>
            <Link to={`/movies/${endpoint.endpointName}/${movie.id}`}>
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
        <div style={{backgroundColor:"white", transform: "translateY(3vh)", borderRadius:"5px"}}>
        <Pagination onClick={handlePageChange} count={totalPages}
          page={currentPage} color="primary" />
</div>
      </div>
    </div>
  );
}
