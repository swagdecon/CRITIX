function ajax(url, reqMethod, jwt, requestBody) {
  const fetchData = {
    headers: {
      "Content-Type": "application/json",
    },
    method: reqMethod,
  };

  if (jwt) {
    fetchData.headers.Authorization = `Bearer ${jwt}`;
  }

  if (requestBody) {
    fetchData.body = JSON.stringify(requestBody);
  }

  return fetch(url, fetchData).then((res) => {
    if (res.status === 200) return res.json();
  });
}

export default ajax;
