import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API
});

api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    // console.log("TOKEN:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log(config.headers);

    return config;
});

export default api;