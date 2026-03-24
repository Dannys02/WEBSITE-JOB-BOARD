import axios from "axios";

// Base URL semua request API mengarah
const instance = axios.create({
    baseUrl: "https://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Interceptor request — otomatis tambah token ke setiap request
// Jadi kita tidak perlu manual tambah Authorization header di setiap Axios call
instance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor response — kalau response 401 (unauthorized), otomatis logout
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;
