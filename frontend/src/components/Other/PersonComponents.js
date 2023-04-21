import { React } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import IndPersonStyle from "../IndPerson/ind_person.module.css";
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

function PersonRoles(actorFilmAppearances) {
  let valueDisplays = document.querySelectorAll(".num");
  let interval = 5000;

  valueDisplays.forEach((valueDisplay) => {
    let startValue = 0;
    let endValue = parseInt(valueDisplay.getAttribute("data-val"));
    let duration = Math.floor(interval / endValue);
    let counter = setInterval(function() {
      startValue += 1;
      valueDisplay.textContent = startValue;
      if (startValue == endValue) {
        clearInterval(counter);
      }
    }, duration);
  });
  <div className={IndPersonStyle["roles-wrapper"]}>
    <div className={IndPersonStyle["roles-container"]}>
      <i className="fas fa-people-arrows"></i>
      <span className="num" data-val={actorFilmAppearances}>
        000
      </span>
      <span className="text">Film Appearances</span>
    </div>
  </div>;
}
export { PersonTitle, PersonJobs, PersonRoles };
