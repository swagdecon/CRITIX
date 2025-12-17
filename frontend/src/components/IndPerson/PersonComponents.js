import { React, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import IndPersonStyle from "../IndPerson/IndPerson.module.css";
import CountUp from "react-countup";

function PersonRoles({ personFilmAppearances, personFilmsProduced, personAwardNominations }) {

  const countUpRef = useRef(null);
  useEffect(() => {
    if (countUpRef.current) {
      countUpRef.current.start();
    }
  }, []);

  function PersonRoleItem(value, text) {
    return (
      <div className={IndPersonStyle["person-role-item"]}>
        {value ? (
          <CountUp start={0} end={value} delay={1}>
            {({ countUpRef }) => (
              <div className={IndPersonStyle["person-role-text"]}>
                <div>{text}</div>
                <span ref={countUpRef} />
              </div>
            )}
          </CountUp>
        ) : (
          <div className={IndPersonStyle["person-role-text"]}>
            <div>{text}</div>
            <div>0</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={IndPersonStyle["person-role-container"]}>
      <div className={IndPersonStyle["person-role-wrapper"]}>
        {PersonRoleItem(personFilmAppearances, "Film Appearances")}
        {PersonRoleItem(personFilmsProduced, "Films Produced")}
        {PersonRoleItem(personAwardNominations, "Award Nominations")}
      </div>
    </div>);
}

function PersonTitle({ name }) {
  PersonTitle.propTypes = {
    name: PropTypes.string,
  };
  return name.toUpperCase();
}
function PersonJobs({ jobs }) {
  return (
    <div className={IndPersonStyle["person-jobs-flex"]}>
      {jobs
        .filter((job) => job.toLowerCase() !== "soundtrack")
        .map((job, i) => (
          <div key={i} className={IndPersonStyle["person-job-pill"]}>
            {job.toUpperCase()}
          </div>
        ))}
    </div>
  );
}

export { PersonTitle, PersonJobs, PersonRoles };
PersonRoles.propTypes = {
  personFilmAppearances: PropTypes.number.isRequired,
  personFilmsProduced: PropTypes.number.isRequired,
  personAwardNominations: PropTypes.number.isRequired,
};

PersonJobs.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.string).isRequired,
};