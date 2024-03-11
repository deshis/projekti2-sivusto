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

const getDefaultTowerImage = () => {
    return baseURL+"/images/default-monke.png";
}

const getTowerImage = (tower, upgrades) => {
    upgrades = upgrades.map((u) => parseInt(u));
    let largest = 0;
    let i = 0;
    for(var u in upgrades){
        if(largest<upgrades[u]){
            largest=upgrades[u];
            i = u;
        }
    }
    
    for(var index in upgrades){
        if(index !== i) upgrades[index] = 0;
    }

    return `${baseURL}/images/${tower}/${upgrades.join("")}-${tower.replace(" ", '')}.png`
}

const getLargestUpgrade = (upgrades) => {
    upgrades = upgrades.map((u) => parseInt(u));
    let largest = 0;
    let i = 0;
    for(var u in upgrades){
        if(largest<upgrades[u]){
            largest=upgrades[u];
            i = u;
        }
    }
    
    return {path: parseInt(i), tier: parseInt(largest)-1};
}

const exportedObject = {
    getTowerArray, 
    getRandomTower, 
    getTowerData,
    getTowerTotalCost,
    getDefaultTowerImage,
    getTowerImage,
    getLargestUpgrade,
}

export default exportedObject