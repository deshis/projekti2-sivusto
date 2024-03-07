import axios from 'axios'
const baseURL = 'https://projekti2-sivusto.onrender.com'

const getTowerArray = () => {
    const request = axios.get(baseURL+"/api/towers");
    return request.then(response => response.data.towers);
}

const getRandomTower = () => {
    const request = axios.get(baseURL+"/api/towers/randomtower");
    return request.then(response => response.data);
}

const getTowerData = (tower) => {
    const request = axios.get(baseURL+"/api/towers/towerdata/"+tower);
    return request.then(response => response.data);
}

const getTowerTotalCost = (tower, upgrades) => {
    const request = axios.get(baseURL+"/api/towers/towerprice/"+tower+"/["+upgrades.toString()+"]");
    return request.then(response => response.data.cost);
}

const exportedObject = {
    getTowerArray, 
    getRandomTower, 
    getTowerData,
    getTowerTotalCost,
}

export default exportedObject