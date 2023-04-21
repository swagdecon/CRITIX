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

function PersonRoles() {
  const countUpRef = useRef(null);

  useEffect(() => {
    if (countUpRef.current) {
      countUpRef.current.start();
    }
  }, []);
  return (
    <CountUp start={0} end={10000} delay={0}>
      {({ countUpRef }) => (
        <div>
          <span ref={countUpRef} />
        </div>
      )}
    </CountUp>
  );
}
export { PersonTitle, PersonJobs, PersonRoles };
