import React from "react";
import "../misc/error.css";

function Error() {
  return (
    <div className="wrapper">
      <div id="container">
        <div className="error">
          <div className="wrap">
            <div className="404" style={{ fontSize: "30px" }}>
              <pre>
                <code>
                  &lt;!DOCTYPE html&gt;
                  {"\n"} &lt;html lang="en"&gt;
                  {"\n"}
                  {"  "}
                  &lt;body className="broken"&gt;
                  {"\n"}
                  {"    "}
                  ERROR 404!
                  {"\n"}
                  {"    "}
                  FILE NOT FOUND!
                  {"\n"}
                  {"    "}
                  &lt;!-- page not found, time to go. --&gt;
                  {"\n"}
                  {"    "}
                  &lt;a href="/" style={{ textDecoration: "none" }}&gt;
                  {"\n"}
                  {"      "}
                  &lt;span className="red" style={{ textDecoration: "none" }}
                  &gt;&gt;&lt;/span&gt;
                  {"\n"}
                  {"      "}
                  &lt;input id="the_button" type="button" value="back home."
                  /&gt;
                  {"\n"}
                  {"    "}
                  &lt;/a&gt;
                  {"\n"}
                  {"  "}
                  &lt;/body&gt;
                  {"\n"}
                  &lt;/html&gt;
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
export default Error();
