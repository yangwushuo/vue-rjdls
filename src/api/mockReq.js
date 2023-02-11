import axios from "axios";

let requests = axios.create({
  headers:{

  },
  baseURL: "/mock",
  timeout: 5000,
});

requests.interceptors.request.use((config) => {

  return config;
});

requests.interceptors.response.use(
  (res) => {

    return res.data;
  },
  (error) => {
    console.log("request err:",error);
    return Promise.reject(new Error('faile'));
  }
);

export default requests;