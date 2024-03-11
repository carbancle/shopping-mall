import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? "" : "http://localhost:3000",
});

// 요청을 보내기 전에 어떠한 행동을 하고 싶을 때
axiosInstance.interceptors.request.use(
  function (config) {
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("accessToken");
    return config;
  },
  function (e) {
    return Promise.reject(e);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (e) {
    if (e.response.data === "jwt expired") {
      window.location.reload();
    }
  }
);
