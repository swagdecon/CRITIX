import { React, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import IndPersonStyle from "../IndPerson/ind_person.module.css";
import CountUp from "react-countup";

function PersonTitle({ name }) {
  PersonTitle.PropTypes = {
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

function PersonRoles({ PersonFilmAppearances }) {
  PersonRoles.propTypes = {
    PersonFilmAppearances: PropTypes.number.isRequired,
    // PersonFilmsProduced: PropTypes.number.isRequired,
  };
  const countUpRef = useRef(null);

  useEffect(() => {
    if (countUpRef.current) {
      countUpRef.current.start();
    }
  }, []);
  return (
    <div className={IndPersonStyle["person-role-wrapper"]}>
      <CountUp start={0} end={PersonFilmAppearances} delay={1}>
        {({ countUpRef }) => (
          <div>
            <span ref={countUpRef} />
            <div className={IndPersonStyle["person-role-text"]}>
              Film Performances
            </div>
          </div>
        )}
      </CountUp>
      {/* <CountUp start={0} end={PersonFilmsProduced} delay={1}>
        {({ countUpRef }) => (
          <div>
            <span ref={countUpRef} />
            <div className={IndPersonStyle["person-role-text"]}>
              Films Produced
            </div>
          </div>
        )}
      </CountUp> */}
    </div>
  );
}
export { PersonTitle, PersonJobs, PersonRoles };
