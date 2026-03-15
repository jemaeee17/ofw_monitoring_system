import axios from 'axios';

const ofwApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

ofwApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('ofw_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

ofwApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("ofw_token");
            localStorage.removeItem("ofw");
            window.location.href = "/ofw-login";
        }
        return Promise.reject(error);
    }
);

export default ofwApi;