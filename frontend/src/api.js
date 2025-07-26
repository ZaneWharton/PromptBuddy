import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8000",
});

export const analyzePrompt = (prompt) => {
    return API.post("/analyze", { prompt })
}