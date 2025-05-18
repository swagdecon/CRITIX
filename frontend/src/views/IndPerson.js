import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IndPersonStyle from "../components/IndPerson/ind_person.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import "typeface-ibm-plex-sans";
import { fetchData } from "../security/Data.js";
import {
  PersonTitle,
  // PersonJobs,
  // PersonRoles,
} from "../components/IndPerson/PersonComponents.js";
import LoadingPage from "./Loading.js";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const PERSON_POSTER_URL = process.env.REACT_APP_PERSON_POSTER_URL;
const PERSON_ENDPOINT = process.env.REACT_APP_PERSON_ENDPOINT;

export default function IndPerson() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      try {
        const result = await fetchData(`${API_URL}${PERSON_ENDPOINT}/${id}`);
        setPerson(result);
      } catch (error) {
        console.error("Error fetching person data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPerson();
  }, [id]);
  console.log(person)
  if (loading || !person) {
    return <LoadingPage />;
  }


  const personPosterPath = person.profilePath
    ? `${PERSON_POSTER_URL}${person.profilePath}`
    : null;

  console.log(person.backdropPath);
  return (
    <div>
      <NavBar />
      <section className={IndPersonStyle["ind-person-wrapper"]} style={{ position: "relative", overflow: "hidden" }}>
        {person.backdropPath && (
          <img
            src={person.backdropPath}
            alt="Backdrop"
            className={IndPersonStyle.backgroundImg}
          />
        )}

        <div className={IndPersonStyle["overlay"]} />

        <div className={IndPersonStyle["ind-person-content"]}>
          <div className={IndPersonStyle["person-info"]}>
            <div className={IndPersonStyle.person_job_wrapper}>
              {/* <PersonJobs jobs={person.imdbPersonJobs} /> */}
            </div>
            <h2 className={IndPersonStyle.person__title}>
              <PersonTitle name={person.name} />
            </h2>
            <div className={IndPersonStyle.person__year}>
              {person.birthYear ? `Born: ${person.birthYear}` : ""}
            </div>
            {/* <PersonRoles
              personFilmAppearances={person.imdbPersonFilmAppearances}
              personFilmsProduced={person.imdbFilmsProduced}
              personAwardNominations={person.imdbAwardNominations}
            /> */}
          </div>

          <div className={IndPersonStyle["hero-poster"]}>
            <img src={personPosterPath} alt={person.name} />
          </div>
        </div>
      </section>
      <section className={IndPersonStyle["person-details-section"]}>
        <div className={IndPersonStyle["person-details-content"]}>
          <h3 className={IndPersonStyle["section-heading"]}>Biography</h3>
          <p className={IndPersonStyle["biography"]}>
            {person.biography?.replace(/\\n/g, "\n") || "No biography available."}
          </p>

          <div className={IndPersonStyle["person-stats"]}>
            <div className={IndPersonStyle["stat-box"]}>
              <span className={IndPersonStyle["stat-label"]}>Born</span>
              <span className={IndPersonStyle["stat-value"]}>
                {person.birthday || "—"}
              </span>
            </div>

            {person.deathday && (
              <div className={IndPersonStyle["stat-box"]}>
                <span className={IndPersonStyle["stat-label"]}>Died</span>
                <span className={IndPersonStyle["stat-value"]}>
                  {person.deathday}
                </span>
              </div>
            )}

            <div className={IndPersonStyle["stat-box"]}>
              <span className={IndPersonStyle["stat-label"]}>Gender</span>
              <span className={IndPersonStyle["stat-value"]}>
                {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Other"}
              </span>
            </div>

            <div className={IndPersonStyle["stat-box"]}>
              <span className={IndPersonStyle["stat-label"]}>Place of Birth</span>
              <span className={IndPersonStyle["stat-value"]}>
                {person.placeOfBirth || "—"}
              </span>
            </div>

            <div className={IndPersonStyle["stat-box"]}>
              <span className={IndPersonStyle["stat-label"]}>IMDb</span>
              <span className={IndPersonStyle["stat-value"]}>
                <a
                  href={`https://www.imdb.com/name/${person.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {person.imdbId}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
