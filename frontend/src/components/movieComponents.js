import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import IndMovieStyle from "./IndMovie/ind_movie.module.css";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BsWallet2 } from "react-icons/bs";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlineMovie, MdDateRange } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
import ReactPlayer from "react-player";

import "../components/Carousel/MovieCarousel/MovieCarousel.css";
function TruncateDescription({ description }) {
  const words = description.split(" ");

  if (words.length > 30) {
    if (!words || words === null || words.length === 0) {
      return "No Description Available";
    }
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}

function MovieRuntime({ runtime }) {
  if (!runtime) {
    return "No Runtime Available";
  }
  return `${runtime} mins |`;
}

function getYearFromDate(dateString) {
  if (!dateString) {
    return null;
  }
  const year = dateString.split("-")[0];
  return year;
}
function MovieTrailer(url) {
  if (!url) {
    return;
  }
  return window.open(`https://www.youtube.com/watch?v=${url}`);
}

function MovieAverage({ voteAverage }) {
  if (!voteAverage) {
    return "No Rating";
  }
  let rating = parseFloat(voteAverage).toFixed(1);
  return rating;
}

function MovieGenres({ genres }) {
  if (!genres) {
    return "";
  }
  MovieGenres.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.string),
  };
  return (
    <ul className={IndMovieStyle.movie__type}>
      {genres.map((genre) => (
        <li key={genre}>{genre}</li>
      ))}
    </ul>
  );
}

function MovieCardGenres({ genres }) {
  if (!genres) {
    // If genres is falsy, return "No genres available"
    return "No genres available";
  }
  if (Array.isArray(genres)) {
    // If genres is an array, proceed with checking if it's nested or not
    const nestedGenres = genres.filter((genre) => typeof genre === "object"); // Filter the nested genres by checking if their type is an object
    if (nestedGenres.length > 0) {
      // If there are nested genres, flatten the array and join them using " | "
      const flattenedGenres = genres.flatMap((genre) => {
        if (typeof genre === "object") {
          // If genre is an object, return the name property
          return genre.name;
        } else {
          // Otherwise, return the genre
          return genre;
        }
      });
      return flattenedGenres.join(" | ");
    } else {
      // If there are no nested genres, join the genres array using " | "
      return genres.join(" | ");
    }
  } else {
    // If genres is not an array, return "No genres available"
    return "No genres available";
  }
}

function MovieCardActors({ actors }) {
  if (!Array.isArray(actors)) {
    return "No Actors Available";
  }
  MovieCardActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
  };

  const topActors = actors.slice(0, 3);
  return (
    <span>
      {topActors.map((actor, index) => {
        if (index === 0) {
          return actor;
        } else if (index < 3) {
          return `, ${actor}`;
        } else {
          return "";
        }
      })}
    </span>
  );
}
function EmbeddedMovieTrailer({ video }) {
  EmbeddedMovieTrailer.propTypes = {
    video: PropTypes.arrayOf(PropTypes.string),
  };

  console.log(video !== null);
  // if (video !== null) {
  return (
    <ReactPlayer
      className={IndMovieStyle.indMovieEmbeddedTrailer}
      url={`https://www.youtube.com/watch?v=${video}`}
      controls={true}
      playing={false}
      width={"60vw"}
      height={"60vh"}
    />
  );
  // } else {
  //   // return <div>No Trailer Available</div>;
  // }
}
function MovieReviews({ reviews }) {
  MovieReviews.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.string),
  };
  if (!reviews.length) {
    return (
      <div className={IndMovieStyle["no-reviews"]}>No Reviews Available</div>
    );
  }
  const [maxHeight, setMaxHeight] = useState(500);

  const reviewRef = useRef(null);
  useEffect(() => {
    if (reviewRef.current) {
      const reviewHeight = reviewRef.current.offsetHeight;
      setMaxHeight(reviewHeight);
    }
  }, [reviews]);

  const TEXT_COLLAPSE_OPTIONS = {
    collapse: false,
    collapseText: "... show more",
    expandText: "show less",
    minHeight: 210,
    maxHeight: 500,
    textStyle: {
      color: "white",
      fontSize: "20px",
    },
  };

  return (
    <div className={IndMovieStyle.review__wrapper}>
      {reviews.slice(0, 3).map((review, index) => (
        <ReactTextCollapse
          key={index}
          options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
        >
          {/* <div className="review__score">{review.rating}%</div> */}
          <p className={IndMovieStyle.review__description}>{review}</p>
          <br />
        </ReactTextCollapse>
      ))}
    </div>
  );
}
function MovieDetails({
  runtime,
  revenue,
  budget,
  language,
  productionCompanies,
  movieStatus,
  releaseDate,
}) {
  return (
    <section className={IndMovieStyle.movieDetailsContainer}>
      <div className={IndMovieStyle["ind-movie-details-card"]}>
        <div className={IndMovieStyle["card-overlay"]}>
          <div className={IndMovieStyle["movie-Details-Title"]}>
            Movie Details
          </div>
          <div className={IndMovieStyle["movie-info-row"]}>
            <ul className={IndMovieStyle["movie-column"]}>
              <ul className={IndMovieStyle["ind-movie-runtime"]}>
                <AiOutlineClockCircle
                  className={IndMovieStyle["movie-info-logo"]}
                  size={50}
                />

                <div className={IndMovieStyle["movie-info-text"]}>
                  {runtime ? `${runtime} minutes` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className={IndMovieStyle["ind-movie-revenue"]}>
                <RiMoneyDollarBoxFill
                  className={IndMovieStyle["movie-info-logo"]}
                  size={50}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {revenue ? `$${revenue}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className={IndMovieStyle["ind-movie-budget"]}>
                <BsWallet2
                  className={IndMovieStyle["movie-info-logo"]}
                  size={50}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {budget ? `$${budget}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className={IndMovieStyle["ind-movie-language"]}>
                <FaLanguage
                  className={IndMovieStyle["movie-info-logo"]}
                  size={50}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {language ? language : "N/A"}
                </div>
              </ul>
            </ul>
            <ul className={IndMovieStyle["movie-column"]}>
              <ul className={IndMovieStyle["ind-movie-production-company"]}>
                <MdOutlineMovie
                  className={IndMovieStyle["movie-info-logo"]}
                  size={50}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {productionCompanies ? productionCompanies[0] : "N/A"}
                </div>
              </ul>
              <br />
              <div className={IndMovieStyle["ind-movie-status"]}>
                <RiMovie2Line
                  size={50}
                  className={IndMovieStyle["movie-info-logo"]}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {movieStatus ? movieStatus : "N/A"}
                </div>
              </div>
              <br />
              <div className={IndMovieStyle["ind-movie-date"]}>
                <MdDateRange
                  size={50}
                  className={IndMovieStyle["movie-info-logo"]}
                />
                <div className={IndMovieStyle["movie-info-text"]}>
                  {releaseDate ? releaseDate : "N/A"}
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
MovieDetails.propTypes = {
  runtime: PropTypes.number,
  revenue: PropTypes.number,
  budget: PropTypes.number,
  language: PropTypes.string,
  productionCompanies: PropTypes.arrayOf(PropTypes.string),
  movieStatus: PropTypes.string,
  releaseDate: PropTypes.string,
};

export {
  TruncateDescription,
  getYearFromDate,
  MovieRuntime,
  MovieTrailer,
  MovieAverage,
  EmbeddedMovieTrailer,
  MovieGenres,
  MovieCardGenres,
  MovieCardActors,
  MovieReviews,
  MovieDetails,
};
