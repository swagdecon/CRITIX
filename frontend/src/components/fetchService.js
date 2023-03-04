// function ajax(url, reqMethod, jwt, requestBody) {
//   const fetchData = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: reqMethod,
//   };

//   if (jwt) {
//     fetchData.headers.Authorization = `Bearer ${jwt}`;
//     fetchData.headers.Authorization = `X-Fingerprint ${fingerprint}`;
//   }

//   if (requestBody) {
//     fetchData.body = JSON.stringify(requestBody);
//   }

//   return fetch(url, fetchData)
//     .then((res) => {
//       if (res.ok) {
//         return res.json();
//       } else {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//     })
//     .catch((error) => {
//       console.error(`ajax error: ${error}`);
//     });
// }

// export default ajax;
