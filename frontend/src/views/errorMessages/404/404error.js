import React from "react";
import { Link } from "react-router-dom";
import errorStyle from "./404error.module.css";

function Error404() {
  return (
    <div>
      <div className={errorStyle.wrapper}>
        <div id={errorStyle.container}>
          <div className={errorStyle.error}>
            <div className={errorStyle.wrap}>
              <pre>
                <code>
                  {"\n"}
                  {"  "}
                  <span className={errorStyle.red}>&lt;!</span>
                  <span>DOCTYPE html</span>
                  <span className={errorStyle.red}>&gt;</span>
                  {"\n"}
                  {"    "}
                  <span className={errorStyle.blue}>
                    &lt;html <span className={errorStyle.yellow}>lang=</span>
                    <span className={errorStyle.green}>&#34;en&#34;</span>&gt;
                  </span>
                  {"\n"}
                  {"      "}
                  <span className={errorStyle.blue}>
                    &lt;body <span className={errorStyle.yellow}>class=</span>
                    <span className={errorStyle.green}>&#34;broken&#34;</span>&gt;
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
                  <span className={errorStyle.comment}>
                    &lt;!-- page not found,{"\n"}
                    {"        "}time to go.--&gt;
                  </span>
                  {"\n"}
                  {"          "}
                  {"\n"}
                  {"        "}
                  <Link to="/" style={{ textDecoration: "none" }}>
                    {"\n"}
                    {"        "}
                    <span className={errorStyle.red} style={{ textDecoration: "none" }}>
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
                  </Link>
                  {"\n"}
                  {"      "}
                  <span className={errorStyle.blue}>&nbsp;&lt;/body&gt;</span>
                  {"\n"}
                  {"    "}
                  <span className={errorStyle.blue}>&lt;/html&gt;</span>
                  {"\n"}
                  {"    "}
                </code>
              </pre>
            </div>
          </div>
          <span className={errorStyle.fnf} />
        </div>
      </div>
    </div>
  );
}

export default Error404;
