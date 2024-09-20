import axios from "axios";

const $api = axios.create({
    baseURL: "http://localhost:5000"
});

$api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});

export default $api;
