import React from "react";
import PropTypes from "prop-types";

function truncateDescription(description) {
  const words = description.split(" ");

  if (words.length > 30) {
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
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
function MovieAverage(vote_average) {
  if (!vote_average) {
    return "No Rating";
  }
  return vote_average;
}

function MovieGenres({ genres }) {
  if (!genres) {
    return "";
  }
  MovieGenres.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.string),
  };
  return (
    <ul className="movie__type">
      {genres.map((genre) => (
        <li key={genre}>{genre}</li>
      ))}
    </ul>
  );
}

// function ActorList(cast) {
//   const firstFourActors = cast.actors.slice(0, 4);

//   return (
//     <div>
//       <h1>First Four Actors:</h1>
//       <ul>
//         {firstFourActors.map((actor, i) => (
//           <div key={i} className="card card0">
//             <div className="border">
//               <h3 className="profile-person">{actor}</h3>
//               <div className="ind-movie-cast-icons">
//                 <i className="fa fa-codepen" aria-hidden="true"></i>
//                 <i className="fa fa-instagram" aria-hidden="true"></i>
//                 <i className="fa fa-dribbble" aria-hidden="true"></i>
//                 <i className="fa fa-twitter" aria-hidden="true"></i>
//                 <i className="fa fa-facebook" aria-hidden="true"></i>
//               </div>
//             </div>
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// }

export {
  truncateDescription,
  getYearFromDate,
  MovieTrailer,
  MovieAverage,
  MovieGenres,
  // ActorList,
};
