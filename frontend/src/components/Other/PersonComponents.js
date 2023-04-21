import { React, useRef, useEffect } from "react";

import { propTypes } from "react-bootstrap/esm/Image";
import IndPersonStyle from "../IndPerson/ind_person.module.css";
import CountUp from "react-countup";

function PersonTitle({ name }) {
  PersonTitle.propTypes = {
    name: propTypes.string,
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

function PersonRoles({ actorFilmAppearances }) {
  PersonRoles.propTypes = {
    actorFilmAppearances: propTypes.integer,
  };
  const countUpRef = useRef(null);

  useEffect(() => {
    if (countUpRef.current) {
      countUpRef.current.start();
    }
  }, []);
  console.log(actorFilmAppearances);
  return (
    <div className={IndPersonStyle["person-role-wrapper"]}>
      <CountUp start={0} end={actorFilmAppearances} delay={1}>
        {({ countUpRef }) => (
          <div>
            <span ref={countUpRef} />
            <div className={IndPersonStyle["person-role-text"]}>
              Film Performances
            </div>
          </div>
        )}
      </CountUp>
    </div>
  );
}
export { PersonTitle, PersonJobs, PersonRoles };
