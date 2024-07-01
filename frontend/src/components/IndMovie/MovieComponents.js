import { React } from "react";
import PropTypes from "prop-types";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import ReactPlayer from "react-player";
import "../Carousel/MovieCarousel/MovieCarousel.module.css";
import GlassCard from "./GlassCard";
// import NoTrailer from "./NoTrailerAvailable.png"
import GlassStyle from "./GlassCard.module.css"
const amazonAffiliateUrl = process.env.REACT_APP_AMAZON_AFFILIATE_URL
const disneyPlusAffiliateUrl = process.env.REACT_APP_DISNEY_PLUS_AFFILIATE_URL
const paramountAffiliateUrl = process.env.REACT_APP_PARAMOUNT_AFFILIATE_URL
const appleAffiliateUrl = process.env.REACT_APP_APPLE_AFFILIATE_URL
const amcAffiliateUrl = process.env.REACT_APP_AMC_AFFILIATE_URL
const nowTVAffiliateUrl = process.env.REACT_APP_NOW_TV_AFFILIATE_URL
function TruncateDescription({ description }) {
  const words = description.split(" ");

  if (!words || words === null || words.length === 0) {
    return "No Description Available";
  }
  const numWords = words.length;

  if (numWords > 30) {

    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}

function ParseYear({ date }) {
  const year = date ? date.split("-")[0] : null;
  return year;
}

function OpenLinkInNewTab(url) {
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank'; // Opens the link in a new tab/window
    a.rel = 'noopener noreferrer'; // Security best practice for target="_blank"

    // Simulate a click on the anchor element
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvent);
  }
}
function WatchMovieNow(watchProviders) {
  const disneyPlusVideoExists = watchProviders?.UK?.flatrate?.find(provider => provider.provider_name === 'Disney Plus');
  const amazonVideoExists = watchProviders?.UK?.buy?.find(provider => provider.provider_name === 'Amazon Video');
  const paramountVideoExists = watchProviders?.UK?.flatrate?.find(provider => provider.provider_name === 'Paramount Plus');
  const appleVideoExists = watchProviders?.US?.buy?.find(provider => provider.provider_name === 'Apple TV');
  const amcVideoExists = watchProviders?.US?.buy?.find(provider => provider.provider_name === 'AMC on Demand');
  const nowTVVideoExists = watchProviders?.UK?.flatrate?.find(provider => provider.provider_name === 'Now TV');

  if (disneyPlusVideoExists) {
    OpenLinkInNewTab(disneyPlusAffiliateUrl);
  } else if (amazonVideoExists) {
    OpenLinkInNewTab(amazonAffiliateUrl);
  } else if (nowTVVideoExists) {
    OpenLinkInNewTab(nowTVAffiliateUrl);
  } else if (paramountVideoExists) {
    OpenLinkInNewTab(paramountAffiliateUrl);
  } else if (appleVideoExists) {
    OpenLinkInNewTab(appleAffiliateUrl);
  } else if (amcVideoExists) {
    OpenLinkInNewTab(amcAffiliateUrl);
  } else {
    OpenLinkInNewTab(nowTVAffiliateUrl);
  }
}


function MovieAverage({ voteAverage }) {
  return (
    <div className={IndMovieStyle.rating}>
      {voteAverage ? `${voteAverage} kernels` : "No Rating"}
    </div>
  )
}

MovieAverage.propTypes = {
  voteAverage: PropTypes.number,
};

function MovieGenres({ genres }) {
  genres ?
    (
      <ul className={IndMovieStyle.movie__type}>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    ) : ""
}

MovieGenres.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string),
};


function ParseNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function EmbeddedMovieTrailer({ trailer }) {
  if (!trailer) {
    return null;
  }

  return (
    <div className={IndMovieStyle.EmbeddedMovieTrailer}>
      <ReactPlayer
        url={trailer}
        controls={true}
        playing={false}
        width="60vw"
        height="70vh"
      />
    </div>
  );
}

EmbeddedMovieTrailer.propTypes = {
  trailer: PropTypes.string,
};

function MovieDetails({
  runtime,
  revenue,
  budget,
  voteCount,
  language,
  productionCompanies,
  movieStatus,
  releaseDate,
}) {
  return (
    <div className={GlassStyle["info-wrapper"]}>
      <div className={GlassStyle["info-container-wrapper"]}>
        <GlassCard
          name={"RUNTIME"}
          value={runtime}
          icon="&#xe8b5;"
          iconString={"&#xe8b5;"}
        />
        <GlassCard
          name={"BUDGET"}
          value={budget}
          iconString={"&#xef63;"}
          icon="&#xef63;"
        />
        <GlassCard
          name={"REVENUE"}
          value={revenue}
          iconString={"&#xf041;"}
          icon="&#xf041;"
        />
        <GlassCard
          name={"VOTE COUNT"}
          value={voteCount}
          iconString={"&#xe175;"}
          icon="&#xe175;"
        />
        <GlassCard
          name={"LANGUAGE"}
          value={language}
          iconString={"&#xe8e2;"}
          icon="&#xe8e2;"
        />
        <GlassCard
          name={"PRODUCTION"}
          value={productionCompanies}
          iconString={"&#xe04b;"}
          icon="&#xe04b;"
        />
        <GlassCard
          name={"MOVIE STATUS"}
          value={movieStatus}
          iconString={"&#xf7f3;"}
          icon="&#xf7f3;"
        />
        <GlassCard
          name={"RELEASE DATE"}
          value={releaseDate}
          iconString={"&#xebcc;"}
          icon="&#xebcc;"
        />
      </div>
    </div>
  );
}
MovieDetails.propTypes = {
  runtime: PropTypes.number,
  revenue: PropTypes.number,
  budget: PropTypes.number,
  voteCount: PropTypes.number,

  language: PropTypes.string,
  productionCompanies: PropTypes.arrayOf(PropTypes.string),
  movieStatus: PropTypes.string,
  releaseDate: PropTypes.string,
};

export {
  TruncateDescription,
  ParseYear,
  ParseNumber,
  OpenLinkInNewTab,
  WatchMovieNow,
  MovieAverage,
  EmbeddedMovieTrailer,
  MovieGenres,
  MovieDetails,
};
