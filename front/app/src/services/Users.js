import axios from 'axios'
const baseURL = 'https://projekti2-sivusto.onrender.com'

let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const login = (username, password) => {
    const request = axios.post(baseURL+"/api/login", {username, password});
    return request.then(response => response.data);
}

const signUp = (username, password) => {
    console.log(({username, password}));
    const request = axios.post(baseURL+"/api/signup", {username, password});
    return request.then(response => response.data);
}

const postScore = (score) => {
    const config = {
        headers: { Authorization: token},
    }

    console.log(score);
    const request = axios.post(baseURL+"/api/scores", score, config);
    return request.then(response => response.data);
}

const getScores = () => {
    const config = {
        headers: { Authorization: token},
    }

    const request = axios.get(baseURL+"/api/scores", config);
    return request.then(response => response.data);
}

const exported = {
    setToken,
    login,
    signUp,
    postScore,
    getScores,
}

export default exported;