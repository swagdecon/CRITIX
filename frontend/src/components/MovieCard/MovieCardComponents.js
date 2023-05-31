import PropTypes from "prop-types";
import React from "react";
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
  MovieCardActors.propTypes = {
    actors: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          role: PropTypes.string,
        }),
      ])
    ).isRequired,
  };

  if (actors === null) {
    return (<span>No Actors Available</span>)
  } else {
    const topActors = actors.slice(0, 3);
    return (
      <span>
        {topActors.map((actor, index) => (
          <span key={actor.name}>{index === 0 ? actor.name : `, ${actor.name}`}</span>
        ))}
      </span>
    );
  }
}

export { MovieCardActors, MovieCardGenres };
