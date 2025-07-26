import axios from 'axios';

export const API = axios.create({
    baseURL: "http://localhost:8000",
});

export const analyzePrompt = (prompt) => {
    return API.post("/analyze", { prompt })
}

export const revisePrompt = (prompt) => {
    return API.post("/revise", { prompt })
}