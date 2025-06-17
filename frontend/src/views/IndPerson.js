import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IndPersonStyle from "../components/IndPerson/IndPerson.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import "typeface-ibm-plex-sans";
import { fetchData } from "../security/Data.js";
import {
  PersonTitle,
  PersonJobs,
  PersonRoles,
} from "../components/IndPerson/PersonComponents.js";
import LoadingPage from "./Loading.js";
const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const PERSON_POSTER_URL = process.env.REACT_APP_PERSON_POSTER_URL;
const PERSON_ENDPOINT = process.env.REACT_APP_PERSON_ENDPOINT;
const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

export default function IndPerson() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  async function handleActorMovie(filmName) {
    try {
      const formattedQuery = filmName.includes(' ') ? filmName.trim().split(' ').join('+') : filmName.trim();
      const endpoint = `${API_URL}${searchEndpoint}${formattedQuery}`;

      const search = await fetchData(endpoint);
      navigate(`${indMovieEndpoint}${search[0].id}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

  if (loading || !person) {
    return <LoadingPage />;
  }

  const personPosterPath = person.profilePath
    ? `${PERSON_POSTER_URL}${person.profilePath}`
    : null;

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
            <h2 className={IndPersonStyle.person__title}>
              <PersonTitle name={person.name} />
            </h2>
            <div className={IndPersonStyle.person__year}>
              {person.birthYear ? `Born: ${person.birthYear}` : ""}
            </div>
            <PersonRoles
              personAwardNominations={person.awards.length}
            />
          </div>
          <div className={IndPersonStyle["hero-poster"]}>
            <img src={personPosterPath} alt={person.name} />
          </div>
        </div>
      </section>
      <section className={IndPersonStyle["person-details-section"]}>
        <div className={IndPersonStyle["person-details-content"]}>
          <div className={IndPersonStyle.person_job_wrapper}>
            <PersonJobs jobs={person.occupations} />
          </div>

          <h3 className={IndPersonStyle["section-heading"]}>Biography</h3>
          <p className={IndPersonStyle["biography"]}>
            {person.biography?.replace(/\\n/g, "\n") || "No biography available."}
          </p>
          {person.filmsActedIn?.length > 0 && (
            <>
              <h3 className={IndPersonStyle["section-heading"]}>Acting Credits</h3>
              <div className={IndPersonStyle["film-cards"]}>
                {person.filmsActedIn.map((film, index) => (
                  <div key={index} className={IndPersonStyle["film-card"]} onClick={() => handleActorMovie(film)}
                  >
                    <div className={IndPersonStyle["film-reel-edge"]}></div>
                    <span className={IndPersonStyle["film-title"]}>{film}</span>
                    <div className={IndPersonStyle["film-reel-edge"]}></div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={IndPersonStyle["personal-info-section"]}>
            <h3 className={IndPersonStyle["section-heading"]}>Personal Info</h3>
            <div className={IndPersonStyle["personal-info-grid"]}>
              <div className={IndPersonStyle["personal-info-item"]}>
                <span className={IndPersonStyle["info-label"]}>Birthday</span>
                <span className={IndPersonStyle["info-value"]}>  {person.birthday ? new Date(person.birthday).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" }) : "—"}
                </span>
              </div>
              <div className={IndPersonStyle["personal-info-item"]}>
                <span className={IndPersonStyle["info-label"]}>Education</span>
                <span className={IndPersonStyle["info-value"]}>   {Array.isArray(person.education)
                  ? person.education.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))
                  : person.education || "—"}
                </span>
              </div>
              <div className={IndPersonStyle["personal-info-item"]}>
                <span className={IndPersonStyle["info-label"]}>Place of Birth</span>
                <span className={IndPersonStyle["info-value"]}>{person.placeOfBirth || "—"}</span>
              </div>
            </div>
          </div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
