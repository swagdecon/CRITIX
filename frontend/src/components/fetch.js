import { useEffect, useState } from "react";

function contentList({ url }) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseJson = await myResponse.json();
          setContent(responseJson);
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [url]);
}

export default contentList;
