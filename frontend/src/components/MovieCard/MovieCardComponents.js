import PropTypes from "prop-types";
import React from "react";
function MovieCardGenres({ genres }) {
  if (!genres || genres.length === 0) {
    return "No genres available";
  }
  if (Array.isArray(genres)) {
    const flattenedGenres = genres.map((genre) => {
      if (typeof genre === "object") {
        return genre.name;
      } else {
        return genre;
      }
    });
    return flattenedGenres.join(" | ");
  } else {
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
  if (!actors || actors.length === 0) {
    return <span>No Actors Available</span>;
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
