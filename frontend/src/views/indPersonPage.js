import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IndPersonStyle from "../components/IndPerson/ind_person.module.css";
import "font-awesome/css/font-awesome.min.css";
import Container from "../components/Container/Container";
import axios from "axios";
import "typeface-ibm-plex-sans";
import {
  PersonTitle,
  PersonJobs,
  PersonRoles,
} from "../components/Other/PersonComponents";
import LoadingPage from "./LoadingPage";
export default function IndPerson() {
  const [person, setPerson] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = JSON.parse(localStorage.getItem("refreshToken"));

        const response = await axios.get(`${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPerson(response.data);
        setDataLoaded(true);
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    if (prevId !== id) {
      // compare current url id with previous url id
      setRequestSent(false); // reset requestSent state variable
      setDataLoaded(false); // reset dataLoaded state variable
      setPrevId(id); // update previous id state variable
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, id, navigate, prevId]); // add prevId as a dependency

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  console.log(person);
  let personBackdrop =
    `url(${person.imdbPersonImages[1]}) ` || `url(${person.backdrop_path})`;

  let personPosterPath = `https://image.tmdb.org/t/p/original${person.profilePath}`;
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <Container />
      <div
        className={IndPersonStyle.background}
        style={{
          backgroundImage: personBackdrop,
        }}
      ></div>
      <ind-person-body>
        <div className={IndPersonStyle["ind-person-wrapper"]}>
          <div className={IndPersonStyle["hero-poster"]}>
            <img src={personPosterPath} />
          </div>
          <div id="fade" className={IndPersonStyle["container-margin"]}>
            <div className={IndPersonStyle["ind-person-header"]}>
              <div className={IndPersonStyle.person__score}></div>
              <div className={IndPersonStyle.person__title__container}>
                <div className={IndPersonStyle.person_job_wrapper}>
                  <PersonJobs jobs={person.imdbPersonJobs} />
                </div>
                <h2 className={IndPersonStyle.person__title}>
                  <PersonTitle name={person.name} />
                </h2>

                <div className={IndPersonStyle.person__year}></div>
                <PersonRoles
                  actorFilmAppearances={person.imdbPersonFilmAppearances}
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
                ></div>
              </div>
            </div>
          </section>
        </div>
      </ind-person-body>
    </html>
  );
}
