import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export default api;