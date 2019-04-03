import axios from "axios";
// let baseUrl = "http://levy.ren:3000/mock/398";

// if (process.env.mode === "dev") {
//   baseUrl = "//malldev.gtytong.com";
// } else if (process.env.mode === "prod") {
// baseUrl = "//mall.gtytong.com";
// }
// axios.defaults.baseURL = baseUrl;
// axios.defaults.baseURL = process.env.GATEWAY || "//malldev.gtytong.com";
axios.defaults.timeout = 15000;

// 请求拦截器 如果在store中获取到了token,那么就写入请求头
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default async (url = "", data = {}, type = "GET") => {
  type = type.toUpperCase();
  if (type === "POST") {
    if (localStorage.loginUser) {
      let userObj = JSON.parse(localStorage.loginUser);
      url =
        url +
        "?token=" +
        userObj.token +
        "&tenantCode=" +
        userObj.member.tenantCode;
    }

    return axios
      .post(url, data)
      .then(res => {
        return res.data;
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
  if (type === "GET") {
    let querys = [];
    for (let key in data) {
      querys.push(key + "=" + data[key]);
    }
    url = url + "?" + querys.join("&");

    return axios
      .get(url)
      .then(res => {
        return res.data;
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
};
