import React from "react";

const MovieDetails = () => {
  return (
    <div>
      <div className="poster_wrapper true">
        <div className="poster">
          <div className="image_content backdrop">
            <img
              className="poster lazyload lazyloaded"
              src="/t/p/w300_and_h450_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg"
              data-src="/t/p/w300_and_h450_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg"
              data-srcset="/t/p/w300_and_h450_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg 1x, /t/p/w600_and_h900_bestv2/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg 2x"
              alt="The Mandalorian"
              data-loaded="true"
            />
          </div>
          <div className="zoom">
            <a href="#" className="no_click">
              <span className="glyphicons_v2 fullscreen white"></span> Expand
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
