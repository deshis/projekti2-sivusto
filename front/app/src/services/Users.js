import axios from 'axios'
const baseURL = 'https://projekti2-sivusto.onrender.com'

let token = null;

let controller = new AbortController();

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const login = (username, password) => {
    const request = axios.post(baseURL+"/api/login", {username, password});
    return request.then(response => response.data);
}

const signUp = (username, password) => {
    const request = axios.post(baseURL+"/api/signup", {username, password});
    return request.then(response => response.data);
}

const postScore = (score) => {
    const config = {
        headers: { Authorization: token},
    }

    const request = axios.post(baseURL+"/api/scores", score, config);
    return request.then(response => response.data);
}

const getScores = () => {
    if(token === null) return; 
    const config = {
        headers: { Authorization: token},
    }
    const request = axios.get(baseURL+"/api/scores", config);
    return request.then(response => response.data);
}

const isDailyDone = () => {
    const request = axios.get(baseURL+"/api/daily", {headers: {Authorization: token},});
    return request.then(response => response.data.daily);
}

const postDailyDone = () => {
    const request = axios.post(baseURL+"/api/daily", {"daily": true}, {headers: {Authorization: token},});
    return request.then(response => response.data);
}

const getLeaderboardToday = () => {
    const request = axios.get(baseURL+"/api/daily/leaderboard");
    return request.then(response => response.data.leaderboard);
}

const postLeaderboardEntry = (score) => {
    const request = axios.post(baseURL+"/api/daily/leaderboard", score, {headers: {Authorization: token},});
    return request.then(response => response);
}

const getLeaderboard = (date) => {
    const request = axios.get(`${baseURL}/api/daily/leaderboard/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
    return request.then(response => response.data.leaderboard);
}

const getRandomRoomCode = () => {
    const request = axios.get(baseURL+"/api/versus/randomcode");
    return request.then(response => response.data.code);
}

const postVersusJoin = (code) => {
    const request = axios.post(baseURL+"/api/versus/join", {"code" : code.toString()}, {headers: {Authorization: token},});
    return request.then(response => response);
}

const postVersusLeave = (code) => {
    const request = axios.post(baseURL+"/api/versus/leave", {"code" : code.toString()}, {headers: {Authorization: token},});
    return request.then(response => response);
}

const postVersusGuess = (guess, code) => {
    const config = {
        headers: { Authorization: token},
    }
    const request = axios.post(baseURL+"/api/versus/guess", {"code" : code.toString(), "guess": guess}, config);
    return request.then(response => response.data);
} 

const getVersusData = (code, callback) => {
    axios
        .get(baseURL+"/api/versus/room/"+code, {signal: controller.signal})
        .then(response => callback(response.data))
        .catch((e) => {
            if (axios.isCancel(e)) {
                console.log("the cancel");
                return;
        }});
}

const postChat = (code, message) => {
    const config = {
        headers: { Authorization: token},
    }
    const request = axios.post(baseURL+"/api/versus/room/"+code+"/chat", {"message": message}, config);
    return request.then(response => response.data);
} 

const getChatMessages = (code) => {
    const request = axios.get(baseURL+"/api/versus/room/"+code+"/chat");
    return request.then(response => response.data);
} 

const cancelVersusDataRequest = () => {
    controller.abort();
}

const resetAfterAbort = () => {
    controller = new AbortController();
}

const exported = {
    setToken,
    login,
    signUp,
    postScore,
    getScores,
    isDailyDone,
    postDailyDone,
    getLeaderboardToday,
    postLeaderboardEntry,
    getLeaderboard,
    getRandomRoomCode,
    postVersusJoin,
    postVersusLeave,
    postVersusGuess,
    getVersusData,
    postChat,
    getChatMessages,
    cancelVersusDataRequest,
    resetAfterAbort,
}

export default exported;