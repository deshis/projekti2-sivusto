import axios from 'axios'
const baseURL = 'https://projekti2-sivusto.onrender.com'

const login = (username, password) => {
    const request = axios.post(baseURL+"/api/login", {username, password});
    return request.then(response => response.data);
}

const signUp = (username, password) => {
    console.log(({username, password}));
    const request = axios.post(baseURL+"/api/signup", {username, password});
    return request.then(response => response.data);
}

const exported = {
    login,
    signUp,
}

export default exported;