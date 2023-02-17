import React, { useState, useEffect } from "react";

const TopRate = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // CHANGE THE ROUTE BASED ON THE CONTROLLER MAPPING:
    fetch("/api/movies/top_rated")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          {/* {item.id} */}
          {item.title}
          {/* {item.release_date} */}
        </div>
      ))}
    </div>
  );
};

export default App;
