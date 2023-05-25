import { React, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import IndPersonStyle from "../IndPerson/ind_person.module.css";
import CountUp from "react-countup";

function PersonTitle({ name }) {
  PersonTitle.propTypes = {
    name: PropTypes.string,
  };
  return name.toUpperCase();
}
function PersonJobs({ jobs }) {
  return jobs
    .filter((job) => job !== "soundtrack")
    .map((job, i) => (
      <ul className={IndPersonStyle["person-jobs-container"]} key={i}>
        <li className={IndPersonStyle["person-job"]}>{job.toUpperCase()}</li>
      </ul>
    ));
}

function PersonRoles({personFilmAppearances, personFilmsProduced, personAwardNominations} ) {
  PersonRoles.propTypes = {
    personFilmAppearances: PropTypes.number.isRequired,
    personFilmsProduced: PropTypes.number.isRequired,
    personAwardNominations: PropTypes.number.isRequired,

  };
 
  const countUpRef = useRef(null);
  useEffect(() => {
    if (countUpRef.current) {
      countUpRef.current.start();
    }
  }, []);

  function PersonRoleItem(value, text) {
    return (
        <div className={IndPersonStyle["person-role-item"]}>
          {value ? 
        <CountUp start={0} end={value} delay={1}>
          {({ countUpRef }) => (
            <div>
              <span ref={countUpRef} />
              <div className={IndPersonStyle["person-role-text"]}>
                {text}
              </div>
            </div>
          )}
        </CountUp>
        :  <div className={IndPersonStyle["person-role-text"]}>
                {text}
              
              <div>0</div>
            </div>}
        </div>
        )
          }  
  
  return (
    <div className={IndPersonStyle["person-role-container"]}>
    <div className={IndPersonStyle["person-role-wrapper"]}>
   { PersonRoleItem(personFilmAppearances, "Film Appearances")}
   { PersonRoleItem(personFilmsProduced, "Films Produced")}
   { PersonRoleItem(personAwardNominations, "Award Nominations")}
    </div>
    </div>);
}
 


export { PersonTitle, PersonJobs, PersonRoles };
