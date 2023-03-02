import React from "react";
import "../misc/error.css";

function Error404() {
  return (
    <div>
      <link rel="stylesheet" href="/error.css" />
      <div className="wrapper">
        <div id="container">
          <div className="error">
            <div className="wrap">
              <div className={404} style={{ fontSize: "30px" }}>
                <pre>
                  <code>
                    {"\n"}
                    {"  "}
                    <span className="red">&lt;!</span>
                    <span>DOCTYPE html</span>
                    <span className="red">&gt;</span>
                    {"\n"}
                    {"    "}
                    <span className="blue">
                      &lt;html <span className="yellow">lang=</span>
                      <span className="green">&#34;en&#34;</span>&gt;
                    </span>
                    {"\n"}
                    {"      "}
                    <span className="blue">
                      &lt;body <span className="yellow">class=</span>
                      <span className="green">&#34;broken&#34;</span>&gt;
                    </span>
                    {"\n"}
                    {"  "}
                    {"\n"}
                    {"      "}
                    <span>
                      ERROR 404! {"\n"}
                      {"        "}FILE NOT FOUND!
                    </span>
                    {"\n"}
                    {"        "}
                    {"\n"}
                    {"        "}
                    <span className="comment">
                      &lt;!-- page not found,{"\n"}
                      {"        "}time to go.--&gt;
                    </span>
                    {"\n"}
                    {"          "}
                    {"\n"}
                    {"        "}
                    <a href="/" style={{ textDecoration: "none" }}>
                      {"\n"}
                      {"        "}
                      <span className="red" style={{ textDecoration: "none" }}>
                        &gt;
                      </span>{" "}
                      {"\n"}
                      {"        "}
                      <input
                        id="the_button"
                        type="button"
                        defaultValue="back home."
                      />
                      {"\n"}
                      {"        "}
                    </a>
                    {"\n"}
                    {"      "}
                    <span className="blue">&nbsp;&lt;/body&gt;</span>
                    {"\n"}
                    {"    "}
                    <span className="blue">&lt;/html&gt;</span>
                    {"\n"}
                    {"    "}
                  </code>
                </pre>
              </div>
            </div>
            <span className="fnf" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
