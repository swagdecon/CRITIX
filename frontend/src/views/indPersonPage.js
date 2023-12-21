import React from "react";
import { useParams } from "react-router-dom";
import IndPersonStyle from "../components/IndPerson/ind_person.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import "typeface-ibm-plex-sans";
import { fetchData } from "../security/FetchApiData";
import {
  PersonTitle,
  PersonJobs,
  PersonRoles,
} from "../components/IndPerson/PersonComponents";
import LoadingPage from "./LoadingPage";
export default function IndPerson() {
  const { id } = useParams();

  const { data: person, dataLoaded: dataLoaded } = fetchData(id);

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  let personBackdrop =
    `url(${person.imdbPersonImages[1]}) ` || `url(${person.backdrop_path})`;

  let personPosterPath = `https://image.tmdb.org/t/p/original${person.profilePath}`;
  return (
    <div>
      <NavBar />
      <div
        className={IndPersonStyle.background}
        style={{
          backgroundImage: personBackdrop,
        }}
      />
      <section>
        <div className={IndPersonStyle["ind-person-wrapper"]}>
          <div className={IndPersonStyle["hero-poster"]}>
            <img src={personPosterPath} />
          </div>
          <div id="fade" className={IndPersonStyle["container-margin"]}>
            <div className={IndPersonStyle["ind-person-header"]}>
              <div className={IndPersonStyle.person__score} />
              <div className={IndPersonStyle.person__title__container}>
                <div className={IndPersonStyle.person_job_wrapper}>
                  <PersonJobs jobs={person.imdbPersonJobs} />
                </div>
                <h2 className={IndPersonStyle.person__title}>
                  <PersonTitle name={person.name} />
                </h2>

                <div className={IndPersonStyle.person__year} />
                <PersonRoles
                  personFilmAppearances={person.imdbPersonFilmAppearances}
                  personFilmsProduced={person.imdbFilmsProduced}
                  personAwardNominations={person.imdbAwardNominations}
                />
              </div>
            </div>
          </div>
          <section id="slide-1" className={IndPersonStyle.homeSlide}>
            <div className={IndPersonStyle.bcg}>
              <div className={IndPersonStyle.hsContainer}>
                <div
                  className={IndPersonStyle.hsContent}
                  data-center="opacity: 1"
                  data-top="opacity: 0"
                  data-anchor-target="#slide-1 h2"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>);
}
