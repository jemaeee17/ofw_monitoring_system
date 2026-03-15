import axios from "axios";

window.axios = axios;

window.axios.defaults.baseURL = "http://127.0.0.1:8000";
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers.common["Accept"] = "application/json";

const token = localStorage.getItem("token");

if (token) {
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}