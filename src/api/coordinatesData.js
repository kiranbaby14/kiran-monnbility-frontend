import axios from "axios";


const URL_DOMAIN = 'http://localhost:8000'

const getRouteCoords = async () => {
    console.log(`${URL_DOMAIN}/coordinates/route`);
    const routeCoords = await axios.get(`${URL_DOMAIN}/coordinates/route`);
    return routeCoords
}

const getTrainCoords = async () => {
    const trainCoords = await axios.get(`${URL_DOMAIN}/coordinates/train`);
    return trainCoords
}

const getfaultCoords = async () => {
    const faultCoords = await axios.get(`${URL_DOMAIN}/coordinates/fault`);
    return faultCoords
}


export {
    getRouteCoords,
    getTrainCoords,
    getfaultCoords
}