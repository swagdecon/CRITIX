import React from "react";
import "../misc/error.css";

function Error404() {
  return (
    <div className="wrapper">
      <div id="container">
        <div className="error">
          <div className="wrap">
            <div className="404" style={{ fontSize: "30px" }}>
              <pre>
                <code>
                  &lt;!
                  <span className="red">DOCTYPE html</span>
                  <span className="red">&gt;</span>
                  <span className="blue">&lt;html</span>{" "}
                  <span className="yellow">lang=</span>
                  <span className="green">&quot;en&quot;</span>
                  <span className="blue">&gt;</span>
                  <span className="blue">&lt;body</span>{" "}
                  <span className="yellow">class=</span>
                  <span className="green">&quot;broken&quot;</span>
                  <span className="blue">&gt;</span>
                  <br />
                  <br />
                  ERROR 404! FILE NOT FOUND!
                  <br />
                  <br />
                  <span className="comment">
                    &lt;!-- page not found, time to go. --&gt;
                  </span>
                  <br />
                  <br />
                  <a href="/" style={{ textDecoration: "none" }}>
                    <span className="red">&gt;</span>
                    <input id="the_button" type="button" value="back home." />
                  </a>
                  <br />
                  <br />
                  <span className="blue">&nbsp;&lt;/body&gt;</span>
                  <span className="blue">&lt;/html&gt;</span>
                </code>
              </pre>
            </div>
          </div>
          <span className="fnf"></span>
        </div>
      </div>
    </div>
  );
}
export default Error404;
