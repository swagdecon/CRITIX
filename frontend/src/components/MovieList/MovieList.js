import { React } from "react";
import PropTypes from "prop-types";
import MovieListStyle from "./MovieList.module.css";
import LoadingPage from "../../views/LoadingPage";
import MovieCard from "../../components/MovieCard/MovieCard";
import useFetchData from "../../security/FetchApiData";
import { Link } from "react-router-dom";
import "../Carousel/title.scss";

export default async function MovieList({ title, caption, endpoint }) {
  MovieList.propTypes = {
    title: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };
  const [movie, setMovie] = useState([]);
  const { data: moviesData, dataLoaded: dataLoaded } = useFetchData(endpoint);

  const fetchMovie = async () => {
    const data = await getDetailedMovie(
      "recommendations",
      moviesData.results.movieId
    );
    setMovie(data);
  };
  fetchMovie();

  if (!dataLoaded) {
    return <LoadingPage />;
  }

  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className={MovieListStyle["title-container"]}>
          <h3-title>{title}</h3-title>
          <div className={MovieListStyle["title-caption"]}>{caption}</div>
        </div>
        <div className={MovieListStyle["container"]}>
          {movies.map((movie, i) => (
            <div key={i}>
              <Link to={`${endpoint}/${movie.id}`}>
                <MovieCard
                  poster={movie.posterPath}
                  rating={movie.voteAverage}
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
      </body>
    </html>
  );
}
