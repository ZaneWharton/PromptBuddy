import axios from 'axios';

export const API = axios.create({
    baseURL: "https://promptbuddy-xzl4.onrender.com",
});

export const analyzePrompt = (prompt) => {
    return API.post("/analyze", { prompt })
}

export const revisePrompt = (prompt) => {
    return API.post("/revise", { prompt })
}