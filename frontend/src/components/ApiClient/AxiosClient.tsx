/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

export default axios.create({
    baseURL: "https://taskmanager-snsn.onrender.com/tasks",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});